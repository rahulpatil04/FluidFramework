/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";

import {
	ITestDataObject,
	TestDataObjectType,
	describeCompat,
} from "@fluid-private/test-version-utils";
import { IGCRuntimeOptions } from "@fluidframework/container-runtime";
import { delay } from "@fluidframework/core-utils";
import { ISummaryTree, SummaryType } from "@fluidframework/protocol-definitions";
import { gcTreeKey } from "@fluidframework/runtime-definitions";
import {
	ITestContainerConfig,
	ITestObjectProvider,
	createSummarizer,
	createTestConfigProvider,
	summarizeNow,
	waitForContainerConnection,
} from "@fluidframework/test-utils";

import {
	getGCDeletedStateFromSummary,
	getGCStateFromSummary,
	getGCTombstoneStateFromSummary,
} from "./gcTestSummaryUtils.js";
import { IContainer } from "@fluidframework/container-definitions/internal";

/**
 * Validates that an unreferenced datastore goes through all the GC phases without overlapping.
 */
describeCompat("GC unreference phases", "NoCompat", (getTestObjectProvider) => {
	// Since these tests depend on these timing windows, they should not be run against drivers talking over the network
	// (see this.skip() call below)
	const tombstoneTimeoutMs = 200; // Tombstone at 200ms
	const sweepGracePeriodMs = 200; // Sweep at 400ms

	const configProvider = createTestConfigProvider();
	const gcOptions: IGCRuntimeOptions = {
		inactiveTimeoutMs: tombstoneTimeoutMs / 2, // Required to avoid an error
		enableGCSweep: true,
		sweepGracePeriodMs,
	};
	const testContainerConfig: ITestContainerConfig = {
		runtimeOptions: {
			summaryOptions: {
				summaryConfigOverrides: {
					state: "disabled",
				},
			},
			gcOptions,
		},
		loaderProps: { configProvider },
	};

	let provider: ITestObjectProvider;

	const loadSummarizer = async (container: IContainer, summaryVersion?: string) => {
		return createSummarizer(
			provider,
			container,
			{
				runtimeOptions: { gcOptions },
				loaderProps: { configProvider },
			},
			summaryVersion,
		);
	};

	async function isDataStoreInSummaryTree(summaryTree: ISummaryTree, dataStoreId: string) {
		const channelsTree =
			(summaryTree.tree[".channels"] as ISummaryTree)?.tree ?? summaryTree.tree;
		return dataStoreId in channelsTree;
	}

	beforeEach("setup", async function () {
		provider = getTestObjectProvider({ syncSummarizer: true });

		// These tests validate the GC state in summary generated by the container runtime. They do not care
		// about the snapshot that is downloaded from the server. So, it doesn't need to run against real services.
		// Additionally, they depend on tight timing windows. So, they should not be run against drivers talking over the network.
		if (provider.driver.type !== "local") {
			this.skip();
		}

		configProvider.set("Fluid.GarbageCollection.ThrowOnTombstoneUsage", true);
		configProvider.set(
			"Fluid.GarbageCollection.TestOverride.TombstoneTimeoutMs",
			tombstoneTimeoutMs,
		);
	});

	afterEach(() => {
		configProvider.clear();
	});

	it("Unreferenced objects follow the sequence [unreferenced, tombstoned, deleted]", async () => {
		const mainContainer = await provider.makeTestContainer(testContainerConfig);
		const mainDataStore = (await mainContainer.getEntryPoint()) as ITestDataObject;
		await waitForContainerConnection(mainContainer);

		const { summarizer } = await loadSummarizer(mainContainer);

		// create datastore
		const dataStore =
			await mainDataStore._context.containerRuntime.createDataStore(TestDataObjectType);
		const dataStoreHandle = dataStore.entryPoint;
		assert(dataStoreHandle !== undefined, "Expected a handle when creating a datastore");
		const dataObject = (await dataStoreHandle.get()) as ITestDataObject;
		const dataStoreId = dataObject._context.id;
		const ddsHandle = dataObject._root.handle;

		// store datastore handles
		mainDataStore._root.set("dataStore", dataStoreHandle);

		// unreference datastore handles
		mainDataStore._root.delete("dataStore");

		// Stage 1 - Referenced -> unreferenced //

		// Summarize and verify datastore are unreferenced and not tombstoned
		await provider.ensureSynchronized();
		let summaryTree = (await summarizeNow(summarizer)).summaryTree;
		let gcState = getGCStateFromSummary(summaryTree);
		assert(gcState !== undefined, "Expected GC state to be generated");
		assert(
			gcState.gcNodes[dataStoreHandle.absolutePath] !== undefined,
			"Data Store should exist on gc graph",
		);
		assert(
			gcState.gcNodes[dataStoreHandle.absolutePath].unreferencedTimestampMs !== undefined,
			"Data Store should be unreferenced",
		);
		let tombstoneState = getGCTombstoneStateFromSummary(summaryTree);
		assert(tombstoneState === undefined, "Nothing should be tombstoned");
		let deletedState = getGCDeletedStateFromSummary(summaryTree);
		assert(deletedState === undefined, "Nothing should be swept");
		// Summary check
		assert(
			await isDataStoreInSummaryTree(summaryTree, dataStoreId),
			"Data Store should be in the summary!",
		);

		// Wait half the time to Tombstone state. Nothing should change
		await delay(tombstoneTimeoutMs / 2);
		// Summarize and verify datastore is unreferenced but not tombstoned
		mainDataStore._root.set("send", "op");
		await provider.ensureSynchronized();
		summaryTree = (await summarizeNow(summarizer)).summaryTree;
		// GC state is a handle meaning it is the same as before, meaning nothing is tombstoned.
		assert.equal(
			summaryTree.tree[gcTreeKey].type,
			SummaryType.Handle,
			"GC tree should not have changed (indicated by incremental summary using the SummaryType.Handle)",
		);

		// Stage 2 - Unreferenced -> Tombstone //

		// Wait the other half of tombstoneTimeoutMs, triggering Tombstone
		await delay(tombstoneTimeoutMs / 2);
		mainDataStore._root.set("send", "op2");

		await provider.ensureSynchronized();
		summaryTree = (await summarizeNow(summarizer)).summaryTree;

		const rootGCTree = summaryTree.tree[gcTreeKey];
		assert.equal(rootGCTree?.type, SummaryType.Tree, "GC data should be a tree");
		tombstoneState = getGCTombstoneStateFromSummary(summaryTree);
		// After tombstoneTimeoutMs the object should be tombstoned.
		assert(tombstoneState !== undefined, "Should have tombstone state");
		assert(
			tombstoneState.includes(dataStoreHandle.absolutePath),
			"Datastore should be tombstoned",
		);

		// Stage 3 - Tombstone -> SweepReady //

		// Wait sweepGracePeriodMs, triggering GC op with the sweep ready nodes.
		await delay(sweepGracePeriodMs);
		mainDataStore._root.set("send", "op2");
		// Close the main container before sweep so that it doesn't end up deleting local data stores which
		// logs GC_Deleted_DataStore_Unexpected_Delete error. This error shouldn't happen outside of tests
		// because sweep only runs after session expiry which means no local data store should be deleted.
		mainContainer.close();

		await provider.ensureSynchronized();
		summaryTree = (await summarizeNow(summarizer)).summaryTree;
		// GC Tombstone check
		tombstoneState = getGCTombstoneStateFromSummary(summaryTree);
		assert(
			tombstoneState === undefined,
			"Tombstone nodes should have transitioned to sweep ready",
		);
		deletedState = getGCDeletedStateFromSummary(summaryTree);
		assert(deletedState === undefined, "Nothing should be deleted yet");

		// Stage 4 - SweepReady -> Swept (deleted) //

		// Wait for the GC op to be processed so that the sweep ready nodes are swept.
		await provider.ensureSynchronized();
		const summaryWithObjectDeleted = await summarizeNow(summarizer);
		summaryTree = summaryWithObjectDeleted.summaryTree;
		// GC graph check
		gcState = getGCStateFromSummary(summaryTree);
		assert(gcState !== undefined, "Expected GC state to be generated");
		assert(
			!(dataStoreHandle.absolutePath in gcState.gcNodes),
			"Data Store should not exist on gc graph",
		);
		// GC Tombstone check
		tombstoneState = getGCTombstoneStateFromSummary(summaryTree);
		assert(tombstoneState === undefined, "Nothing should be tombstoned");
		// GC Sweep check
		deletedState = getGCDeletedStateFromSummary(summaryTree);
		assert(deletedState !== undefined, "Should have sweep state");
		assert(deletedState.includes(dataStoreHandle.absolutePath), "Data Store should be swept");
		assert(deletedState.includes(ddsHandle.absolutePath), "DDS should be swept");
		assert(deletedState.length === 2, "Nothing else should have been swept");
		// Summary check
		assert(
			!(await isDataStoreInSummaryTree(summaryTree, dataStoreId)),
			"Data Store should not be in the summary!",
		);

		// Close the current summarizer and create a new one from the latest summary.
		summarizer.close();
		const { summarizer: remoteSummarizer } = await loadSummarizer(
			mainContainer,
			summaryWithObjectDeleted.summaryVersion,
		);

		// Summarize and validate that the data store is still deleted.
		summaryTree = (await summarizeNow(remoteSummarizer)).summaryTree;
		assert(
			!(await isDataStoreInSummaryTree(summaryTree, dataStoreId)),
			"Data Store should not be in the summary!",
		);
	});
});

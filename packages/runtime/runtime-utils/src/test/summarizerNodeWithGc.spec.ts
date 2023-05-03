/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { cloneGCData, GCDataBuilder } from "@fluidframework/garbage-collector";
import { ISnapshotTree, SummaryType } from "@fluidframework/protocol-definitions";
import {
	CreateChildSummarizerNodeParam,
	CreateSummarizerNodeSource,
	IGarbageCollectionData,
	IGarbageCollectionDetailsBase,
	ISummarizeInternalResult,
	ISummarizerNodeConfig,
	ISummarizerNodeWithGC,
	SummarizeInternalFn,
} from "@fluidframework/runtime-definitions";
import { MockLogger, TelemetryNullLogger } from "@fluidframework/telemetry-utils";
import {
	createRootSummarizerNodeWithGC,
	IRootSummarizerNodeWithGC,
	SummarizerNodeWithGC,
	// eslint-disable-next-line import/no-internal-modules
} from "../summarizerNode/summarizerNodeWithGc";
import { mergeStats } from "../summaryUtils";
import { IFetchSnapshotResult } from "../summarizerNode";

describe("SummarizerNodeWithGC Tests", () => {
	const summarizerNodeId = "testNode";
	const node1Id = "/gcNode1";
	const node2Id = "/gcNode2";
	const subNode1Id = "/gcNode1/subNode";
	const subNode2Id = "/gcNode2/subNode";

	let rootSummarizerNode: IRootSummarizerNodeWithGC;
	let summarizerNode: ISummarizerNodeWithGC;
	// The base GC details of the root summarizer node. The child base GC details from this is passed on to the child
	// summarizer node during its creation.
	let rootBaseGCDetails: IGarbageCollectionDetailsBase;
	// The GC data returned by the getGCData() API of the child summarizer node.
	let childInternalGCData: IGarbageCollectionData;
	let mockLogger: MockLogger;

	const getRootBaseGCDetails = async (): Promise<IGarbageCollectionDetailsBase> =>
		rootBaseGCDetails;
	const getChildInternalGCData = async (): Promise<IGarbageCollectionData> => childInternalGCData;

	beforeEach(async () => {
		mockLogger = new MockLogger();
		rootSummarizerNode = createRootSummarizerNodeWithGC(
			mockLogger,
			(() => undefined) as unknown as SummarizeInternalFn,
			0,
			0,
			undefined,
			undefined,
			getRootBaseGCDetails,
		);
		rootSummarizerNode.startSummary(0, new TelemetryNullLogger());

		summarizerNode = rootSummarizerNode.createChild(
			summarizeInternal,
			summarizerNodeId,
			{ type: CreateSummarizerNodeSource.FromSummary },
			undefined,
			getChildInternalGCData,
		);

		// Initialize the values to be returned by the child node's getGCData.
		childInternalGCData = {
			gcNodes: {
				"/": [node1Id, node2Id],
				[node1Id]: [subNode1Id],
			},
		};

		// Initialize the values to be returned by the getBaseGCDetails() API of the root summarizer node.
		rootBaseGCDetails = {
			usedRoutes: [],
		};
	});

	async function summarizeInternal(
		fullTree: boolean,
		trackState: boolean,
	): Promise<ISummarizeInternalResult> {
		const stats = mergeStats();
		stats.treeNodeCount++;
		return {
			summary: {
				type: SummaryType.Tree,
				tree: {},
			},
			stats,
			id: summarizerNodeId,
		};
	}

	/**
	 * Given the GC data of a child, build the GC data of the root (parent) node.
	 */
	function buildRootGCData(childGCData: IGarbageCollectionData, childId: string) {
		const builder = new GCDataBuilder();
		builder.prefixAndAddNodes(childId, childGCData.gcNodes);
		return builder.getGCData();
	}

	describe("getGCData API", () => {
		it("fails when function to get GC data is not provided", async () => {
			// Root summarizer node does not have the function to get GC data. Trying to get GC data from it should
			// fail.
			let failed = false;
			try {
				await rootSummarizerNode.getGCData();
			} catch {
				failed = true;
			}
			assert(failed, "Getting GC data should have failed");
		});

		it("can return GC data when data has changed since last summary", async () => {
			// Invalidate the summarizer node to force it to generate GC data and not use cached value.
			summarizerNode.invalidate(10);

			const gcData = await summarizerNode.getGCData();
			assert.deepStrictEqual(
				gcData,
				childInternalGCData,
				"GC data should be generated by calling getChildInternalGCData",
			);
		});

		it("can return base GC data when nothing has changed since last summary", async () => {
			// The base GC data of the child summarizer node.
			const childBaseGCData: IGarbageCollectionData = {
				gcNodes: {
					"/": [node1Id],
					[node1Id]: ["/"],
					[node2Id]: [subNode1Id, subNode2Id],
				},
			};
			// Set the root base GC details to include the child node's base GC data.
			rootBaseGCDetails = {
				usedRoutes: [""],
				gcData: buildRootGCData(childBaseGCData, summarizerNodeId),
			};

			// We did not invalidate the summarizer node, so it will get the base GC data because nothing changed
			// since last summary.
			const gcData = await summarizerNode.getGCData();
			assert.deepStrictEqual(
				gcData,
				childBaseGCData,
				"Base GC data should have been returned",
			);
		});

		it("can return GC data when base GC data is not available", async () => {
			// The base GC data of the child summarizer node is undefined by default. So, the node will generate GC
			// data even though nothing changed since last summary.
			const gcData = await summarizerNode.getGCData();
			assert.deepStrictEqual(
				gcData,
				childInternalGCData,
				"GC data should be generated by calling getChildInternalGCData",
			);
		});

		it("can return cached GC data", async () => {
			// The base GC data of the child summarizer node is undefined by default. So, the node will generate GC
			// data even though nothing changed since last summary.
			let gcData = await summarizerNode.getGCData();
			assert.deepStrictEqual(
				gcData,
				childInternalGCData,
				"GC data should be generated by calling getChildInternalGCData",
			);

			// Make a clone of the GC data returned above because we are about to change it.
			const cachedGCData = cloneGCData(gcData);

			// Add a new node to the GC data returned by getChildInternalGCData to make it different from cachedGCData above.
			// This will validate that the data returned by getGCData is not childInternalGCData.
			childInternalGCData.gcNodes[subNode1Id] = ["/", subNode2Id];

			// Since nothing changed since last summary, summarizer node should return the data from the previous run.
			gcData = await summarizerNode.getGCData();
			assert.deepStrictEqual(
				gcData,
				cachedGCData,
				"GC data from previous run should be returned",
			);
		});

		it("can generate GC data when nothing changed but fullGC flag is true", async () => {
			let gcData = await summarizerNode.getGCData();
			assert.deepStrictEqual(
				gcData,
				childInternalGCData,
				"GC data should be generated by calling getChildInternalGCData",
			);

			// Add a new node to the GC data returned by getChildInternalGCData to make it different from before.
			// This will validate that the data returned by getGCData is the new childInternalGCData.
			childInternalGCData.gcNodes[subNode1Id] = ["/", subNode2Id];

			// Call getGCData() with fullGC = true. Even though nothing changed since last summary, this will force the
			// summarizer node to generate GC data by calling getChildInternalGCData.
			gcData = await summarizerNode.getGCData(true /* fullGC */);
			assert.deepStrictEqual(
				gcData,
				childInternalGCData,
				"GC data should be generated by calling getChildInternalGCData",
			);
		});
	});

	describe("summarize API", () => {
		it("should not allow summarizing without running GC first", async () => {
			// Since GC is enabled, calling summarize without running GC (updating used routes) should result in
			// an assert being thrown.
			await assert.rejects(
				summarizerNode.summarize(true /* fullTree */),
				"summarize should have thrown since GC was run",
			);
		});

		it("should allow summarizing after running GC", async () => {
			// Update the used routes which emulates running GC.
			summarizerNode.updateUsedRoutes([""]);
			// Summarize should not throw since GC was run before.
			await assert.doesNotReject(
				summarizerNode.summarize(true /* fullTree */),
				"summarize should not have thrown an error since GC was run",
			);
		});
	});

	describe("Complete Summary", () => {
		const ids = ["rootId", "midId", "leafId"] as const;
		let rootNode: IRootSummarizerNodeWithGC;
		let midNode: ISummarizerNodeWithGC | undefined;
		let leafNode: ISummarizerNodeWithGC | undefined;

		const logger = new TelemetryNullLogger();
		const getSummarizeInternalFn = (depth: 0 | 1 | 2) => async (fullTree: boolean) => {
			return {
				id: ids[depth],
				pathPartsForChildren: undefined, // extra path parts between nodes
				stats: mergeStats(),
				summary: { type: SummaryType.Tree, tree: {} } as const,
			};
		};

		function createRoot({
			changeSeq = 1,
			refSeq,
			...config
		}: Partial<
			ISummarizerNodeConfig & {
				changeSeq: number;
				refSeq: number;
			}
		> = {}) {
			rootNode = createRootSummarizerNodeWithGC(
				logger,
				getSummarizeInternalFn(0),
				changeSeq,
				refSeq,
				config,
			);
		}

		function createMid(createParam: CreateChildSummarizerNodeParam) {
			midNode = rootNode.createChild(getSummarizeInternalFn(1), ids[1], createParam);
		}

		function createLeaf(createParam: CreateChildSummarizerNodeParam) {
			leafNode = midNode?.createChild(getSummarizeInternalFn(2), ids[2], createParam);
		}

		it("Should fail completeSummary if GC not run on root node", () => {
			createRoot();
			rootNode.startSummary(11, logger);
			assert.throws(
				() => rootNode.completeSummary("test-handle"),
				(error) => {
					const correctErrorMessage = error.message === "NodeDidNotRunGC";
					const correctErrorId = error.id.value === "";
					return correctErrorMessage && correctErrorId;
				},
				"Complete summary should have failed at the root node",
			);
		});

		it("Should fail completeSummary if GC not run on child node", async () => {
			createRoot();
			createMid({ type: CreateSummarizerNodeSource.Local });
			createLeaf({ type: CreateSummarizerNodeSource.Local });
			rootNode.startSummary(11, logger);

			// Call updateUsedRoutes (indicating GC ran) and summarize on the root and leaf nodes but not on the
			// mid node. Calling summarize is important because otherwise we will see similar failures because of
			// not running GC.
			rootNode.updateUsedRoutes([""]);
			leafNode?.updateUsedRoutes([""]);
			await rootNode.summarize(false);
			await leafNode?.summarize(false);
			const midNodeId = `/${ids[1]}`;
			assert.throws(
				() => rootNode.completeSummary("test-handle"),
				(error) => {
					const correctErrorMessage = error.message === "NodeDidNotRunGC";
					const correctErrorId = error.id.value === midNodeId;
					return correctErrorMessage && correctErrorId;
				},
				"Complete summary should have failed at the mid node",
			);
		});

		it("Should fail completeSummary if GC not run on leaf node", async () => {
			createRoot();
			createMid({ type: CreateSummarizerNodeSource.Local });
			createLeaf({ type: CreateSummarizerNodeSource.Local });
			rootNode.startSummary(11, logger);
			// Call updateUsedRoutes (indicating GC ran) and summarize on the root and leaf nodes but not on the
			// mid node. Calling summarize is important because otherwise we will see similar failures because of
			// not running GC.
			rootNode.updateUsedRoutes([""]);
			midNode?.updateUsedRoutes([""]);
			await rootNode.summarize(false);
			await midNode?.summarize(false);
			const leafNodeId = `/${ids[1]}/${ids[2]}`;
			assert.throws(
				() => rootNode.completeSummary("test-handle"),
				(error) => {
					const correctErrorMessage = error.message === "NodeDidNotRunGC";
					const correctErrorId = error.id.value === leafNodeId;
					return correctErrorMessage && correctErrorId;
				},
				"Complete summary should have failed at the leaf node",
			);
		});

		let summaryRefSeq = 123;
		const blobs = {
			protocolAttributes: { sequenceNumber: summaryRefSeq },
		} as const;
		const readAndParseBlob = async <T>(id: string) => blobs[id] as T;

		const emptySnapshot: ISnapshotTree = { blobs: {}, trees: {} };
		const protocolTree: ISnapshotTree = {
			blobs: { attributes: "protocolAttributes" },
			trees: {},
		};
		const coreSnapshot: ISnapshotTree = {
			blobs: {},
			trees: {
				[ids[1]]: {
					blobs: {},
					trees: {
						[ids[2]]: emptySnapshot,
					},
				},
			},
		};
		const simpleSnapshot: ISnapshotTree = {
			blobs: {},
			trees: {
				...coreSnapshot.trees,
				".protocol": protocolTree,
			},
		};
		const fetchLatestSnapshot: () => Promise<IFetchSnapshotResult> = async () => {
			return {
				snapshotTree: simpleSnapshot,
				snapshotRefSeq: summaryRefSeq,
			};
		};

		it("Should add GC pending summary node created after parent node was summarized with non-empty used routes", async () => {
			createRoot();
			createMid({ type: CreateSummarizerNodeSource.Local });
			rootNode.startSummary(summaryRefSeq++, logger);
			rootNode.updateUsedRoutes([""]);
			midNode?.updateUsedRoutes([""]);

			await rootNode.summarize(false);
			await midNode?.summarize(false);
			rootNode.completeSummary("test-handle1");

			let result = await rootNode.refreshLatestSummary(
				"test-handle1",
				summaryRefSeq,
				fetchLatestSnapshot,
				readAndParseBlob,
				logger,
			);
			assert(result.latestSummaryUpdated === true, "should update");
			assert(result.wasSummaryTracked === true, "should be tracked");

			rootNode.startSummary(summaryRefSeq++, logger);
			rootNode.updateUsedRoutes([`/`, `/${ids[1]}`, `/${ids[1]}/${ids[2]}`]);
			midNode?.updateUsedRoutes([`/`, `/${ids[2]}`]);

			await rootNode.summarize(false);
			await midNode?.summarize(false);
			rootNode.completeSummary("test-handle2");

			// Create a new child node for which we will need to create a pending summary for.
			createLeaf({ type: CreateSummarizerNodeSource.Local });

			result = await rootNode.refreshLatestSummary(
				"test-handle2",
				summaryRefSeq,
				fetchLatestSnapshot,
				readAndParseBlob,
				logger,
			);
			assert(result.latestSummaryUpdated === true, "should update");
			assert(result.wasSummaryTracked === true, "should be tracked");
			const leafNodePath = `${ids[0]}/${ids[1]}/${ids[2]}`;
			const leafNodeLatestSummary = (leafNode as SummarizerNodeWithGC).latestSummary;
			assert.strictEqual(
				leafNodeLatestSummary?.fullPath.toString(),
				leafNodePath,
				"The child node's latest summary path is incorrect",
			);
		});

		it("Should add GC pending summary node created after parent node was summarized with empty used routes", async () => {
			createRoot();
			createMid({ type: CreateSummarizerNodeSource.Local });
			rootNode.startSummary(summaryRefSeq++, logger);
			rootNode.updateUsedRoutes([""]);
			midNode?.updateUsedRoutes([""]);

			await rootNode.summarize(false);
			await midNode?.summarize(false);
			rootNode.completeSummary("test-handle1");

			let result = await rootNode.refreshLatestSummary(
				"test-handle1",
				summaryRefSeq,
				fetchLatestSnapshot,
				readAndParseBlob,
				logger,
			);
			assert(result.latestSummaryUpdated === true, "should update");
			assert(result.wasSummaryTracked === true, "should be tracked");

			rootNode.startSummary(summaryRefSeq++, logger);
			rootNode.updateUsedRoutes([""]);
			midNode?.updateUsedRoutes([""]);

			await rootNode.summarize(false);
			await midNode?.summarize(false);
			rootNode.completeSummary("test-handle2");

			// Create a new child node for which we will need to create a pending summary for.
			createLeaf({ type: CreateSummarizerNodeSource.Local });

			result = await rootNode.refreshLatestSummary(
				"test-handle2",
				summaryRefSeq,
				fetchLatestSnapshot,
				readAndParseBlob,
				logger,
			);
			assert(result.latestSummaryUpdated === true, "should update");
			assert(result.wasSummaryTracked === true, "should be tracked");
			const leafNodePath = `${ids[0]}/${ids[1]}/${ids[2]}`;
			const leafNodeLatestSummary = (leafNode as SummarizerNodeWithGC).latestSummary;
			assert.strictEqual(
				leafNodeLatestSummary?.fullPath.toString(),
				leafNodePath,
				"The child node's latest summary path is incorrect",
			);
		});
	});
});

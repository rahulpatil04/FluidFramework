/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { IMigrationTool } from "@fluid-example/example-utils";
import {
	MigrationToolInstantiationFactory,
	ModelContainerRuntimeFactory,
	getDataStoreEntryPoint,
} from "@fluid-example/example-utils";
import type { IContainer } from "@fluidframework/container-definitions";
import type { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
<<<<<<< HEAD
// eslint-disable-next-line import/no-deprecated
import { requestFluidObject } from "@fluidframework/runtime-utils";
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

import type { IInventoryList, IInventoryListAppModel } from "../modelInterfaces";
import { InventoryListAppModel } from "./appModel";
import { InventoryListInstantiationFactory } from "./inventoryList";

export const inventoryListId = "default-inventory-list";
export const migrationToolId = "migration-tool";

export class InventoryListContainerRuntimeFactory extends ModelContainerRuntimeFactory<IInventoryListAppModel> {
	/**
	 * Constructor for the factory. Supports a test mode which spawns the summarizer instantly.
	 * @param testMode - True to enable instant summarizer spawning.
	 */
	public constructor(testMode: boolean) {
		super(
			new Map([
				InventoryListInstantiationFactory.registryEntry,
				MigrationToolInstantiationFactory.registryEntry,
			]), // registryEntries
			testMode
				? {
						summaryOptions: {
							initialSummarizerDelayMs: 0,
						},
				  }
				: undefined,
		);
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.containerInitializingFirstTime}
	 */
	protected async containerInitializingFirstTime(runtime: IContainerRuntime) {
		const inventoryList = await runtime.createDataStore(InventoryListInstantiationFactory.type);
		await inventoryList.trySetAlias(inventoryListId);
		const migrationTool = await runtime.createDataStore(MigrationToolInstantiationFactory.type);
		await migrationTool.trySetAlias(migrationToolId);
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.containerHasInitialized}
	 */
	protected async containerHasInitialized(runtime: IContainerRuntime) {
		console.info("Using runtime factory version one");
		// Force the MigrationTool to instantiate in all cases.  The Quorum it uses must be loaded and running in
		// order to respond with accept ops, and without this call the MigrationTool won't be instantiated on the
		// summarizer client.
<<<<<<< HEAD
		// eslint-disable-next-line import/no-deprecated
		await requestFluidObject(await runtime.getRootDataStore(migrationToolId), "");
=======
		await getDataStoreEntryPoint(runtime, migrationToolId);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.createModel}
	 */
	protected async createModel(runtime: IContainerRuntime, container: IContainer) {
<<<<<<< HEAD
		// eslint-disable-next-line import/no-deprecated
		const inventoryList = await requestFluidObject<IInventoryList>(
			await runtime.getRootDataStore(inventoryListId),
			"",
		);
		// eslint-disable-next-line import/no-deprecated
		const migrationTool = await requestFluidObject<IMigrationTool>(
			await runtime.getRootDataStore(migrationToolId),
			"",
		);
		return new InventoryListAppModel(inventoryList, migrationTool, container);
=======
		return new InventoryListAppModel(
			await getDataStoreEntryPoint<IInventoryList>(runtime, inventoryListId),
			await getDataStoreEntryPoint<IMigrationTool>(runtime, migrationToolId),
			container,
		);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	}
}

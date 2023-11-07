/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

<<<<<<< HEAD
import { ModelContainerRuntimeFactory } from "@fluid-example/example-utils";
import type { IContainer } from "@fluidframework/container-definitions";
import type { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
// eslint-disable-next-line import/no-deprecated
import { requestFluidObject } from "@fluidframework/runtime-utils";

import type { IInventoryList, IInventoryListAppModel } from "../modelInterfaces";
import { InventoryListAppModel } from "./appModel";
import { LegacyTreeInventoryListFactory } from "./legacyTreeInventoryList";
import { NewTreeInventoryListFactory } from "./newTreeInventoryList";

export const legacyTreeInventoryListId = "legacy-tree-inventory-list";
export const newTreeInventoryListId = "new-tree-inventory-list";
=======
import { ModelContainerRuntimeFactory, getDataStoreEntryPoint } from "@fluid-example/example-utils";
import type { IContainer } from "@fluidframework/container-definitions";
import type { IContainerRuntime } from "@fluidframework/container-runtime-definitions";

import type { IInventoryListAppModel } from "../modelInterfaces";
import { InventoryListAppModel } from "./appModel";
import { InventoryList, InventoryListFactory } from "./inventoryList";

export const inventoryListId = "inventory-list";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

export class InventoryListContainerRuntimeFactory extends ModelContainerRuntimeFactory<IInventoryListAppModel> {
	public constructor() {
		super(
<<<<<<< HEAD
			new Map([
				LegacyTreeInventoryListFactory.registryEntry,
				NewTreeInventoryListFactory.registryEntry,
			]), // registryEntries
=======
			new Map([InventoryListFactory.registryEntry]), // registryEntries
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		);
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.containerInitializingFirstTime}
	 */
	protected async containerInitializingFirstTime(runtime: IContainerRuntime) {
<<<<<<< HEAD
		const legacyTreeInventoryList = await runtime.createDataStore(
			LegacyTreeInventoryListFactory.type,
		);
		await legacyTreeInventoryList.trySetAlias(legacyTreeInventoryListId);
		const newTreeInventoryList = await runtime.createDataStore(
			NewTreeInventoryListFactory.type,
		);
		await newTreeInventoryList.trySetAlias(newTreeInventoryListId);
=======
		const inventoryList = await runtime.createDataStore(InventoryListFactory.type);
		await inventoryList.trySetAlias(inventoryListId);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.createModel}
	 */
	protected async createModel(runtime: IContainerRuntime, container: IContainer) {
<<<<<<< HEAD
		// eslint-disable-next-line import/no-deprecated
		const legacyTreeInventoryList = await requestFluidObject<IInventoryList>(
			await runtime.getRootDataStore(legacyTreeInventoryListId),
			"",
		);
		// eslint-disable-next-line import/no-deprecated
		const newTreeInventoryList = await requestFluidObject<IInventoryList>(
			await runtime.getRootDataStore(newTreeInventoryListId),
			"",
		);
		return new InventoryListAppModel(
			legacyTreeInventoryList,
			newTreeInventoryList,
			this.triggerMigration,
		);
	}

	// This might normally be kicked off by some heuristic or network trigger to decide when to do the migration.  For this
	// demo we'll just trigger it with a debug button though.
	private readonly triggerMigration = () => {
		// TODO: implement
		console.log("Migration triggered!");
	};
=======
		const inventoryList = await getDataStoreEntryPoint<InventoryList>(runtime, inventoryListId);
		return new InventoryListAppModel(inventoryList);
	}
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
}

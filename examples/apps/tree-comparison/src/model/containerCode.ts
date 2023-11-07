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
=======
import { ModelContainerRuntimeFactory, getDataStoreEntryPoint } from "@fluid-example/example-utils";
import type { IContainer } from "@fluidframework/container-definitions";
import type { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

import type { IInventoryList, IInventoryListAppModel } from "../modelInterfaces";
import { InventoryListAppModel } from "./appModel";
import { LegacyTreeInventoryListFactory } from "./legacyTreeInventoryList";
import { NewTreeInventoryListFactory } from "./newTreeInventoryList";

export const legacyTreeInventoryListId = "legacy-tree-inventory-list";
export const newTreeInventoryListId = "new-tree-inventory-list";

export class InventoryListContainerRuntimeFactory extends ModelContainerRuntimeFactory<IInventoryListAppModel> {
	public constructor() {
		super(
			new Map([
				LegacyTreeInventoryListFactory.registryEntry,
				NewTreeInventoryListFactory.registryEntry,
			]), // registryEntries
		);
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.containerInitializingFirstTime}
	 */
	protected async containerInitializingFirstTime(runtime: IContainerRuntime) {
		const legacyTreeInventoryList = await runtime.createDataStore(
			LegacyTreeInventoryListFactory.type,
		);
		await legacyTreeInventoryList.trySetAlias(legacyTreeInventoryListId);
		const newTreeInventoryList = await runtime.createDataStore(
			NewTreeInventoryListFactory.type,
		);
		await newTreeInventoryList.trySetAlias(newTreeInventoryListId);
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
=======
		const legacyTreeInventoryList = await getDataStoreEntryPoint<IInventoryList>(
			runtime,
			legacyTreeInventoryListId,
		);
		const newTreeInventoryList = await getDataStoreEntryPoint<IInventoryList>(
			runtime,
			newTreeInventoryListId,
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		);
		return new InventoryListAppModel(legacyTreeInventoryList, newTreeInventoryList);
	}
}

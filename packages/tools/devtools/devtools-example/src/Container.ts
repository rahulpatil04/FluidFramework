/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { ModelContainerRuntimeFactory } from "@fluid-example/example-utils";
import type { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import type { IContainer } from "@fluidframework/container-definitions";
<<<<<<< HEAD
// eslint-disable-next-line import/no-deprecated
import { requestFluidObject } from "@fluidframework/runtime-utils";
=======
import type { IFluidHandle } from "@fluidframework/core-interfaces";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
import { AppData } from "./FluidObject";

/**
 * This model contains the data we want to share with other clients.
 */
export interface IAppModel {
	readonly appData: AppData;
	readonly container: IContainer;
}

class AppModel implements IAppModel {
	public constructor(
		public readonly appData: AppData,
		public readonly container: IContainer,
	) {}
}

const collaborativeObjId = "collaborative-obj";

/**
 * The runtime factory for the app.
 */
export class RuntimeFactory extends ModelContainerRuntimeFactory<IAppModel> {
	public constructor() {
		super(
			new Map([AppData.getFactory().registryEntry]), // registryEntries
		);
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.containerInitializingFirstTime}
	 */
	protected async containerInitializingFirstTime(runtime: IContainerRuntime): Promise<void> {
		const dataStore = await runtime.createDataStore(AppData.getFactory().type);
		await dataStore.trySetAlias(collaborativeObjId);
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.createModel}
	 */
	protected async createModel(
		runtime: IContainerRuntime,
		container: IContainer,
	): Promise<IAppModel> {
<<<<<<< HEAD
		// eslint-disable-next-line import/no-deprecated
		const collaborativeObj = await requestFluidObject<AppData>(
			await runtime.getRootDataStore(collaborativeObjId),
			"",
		);
		return new AppModel(collaborativeObj, container);
=======
		const entryPointHandle = (await runtime.getAliasedDataStoreEntryPoint(
			collaborativeObjId,
		)) as IFluidHandle<AppData> | undefined;

		if (entryPointHandle === undefined) {
			throw new Error(`Default dataStore [${collaborativeObjId}] must exist`);
		}

		return new AppModel(await entryPointHandle.get(), container);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	}
}

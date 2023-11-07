/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { ModelContainerRuntimeFactory, getDataStoreEntryPoint } from "@fluid-example/example-utils";
import { IContainer } from "@fluidframework/container-definitions";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
<<<<<<< HEAD
// eslint-disable-next-line import/no-deprecated
import { requestFluidObject } from "@fluidframework/runtime-utils";
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

import { DataObjectGrid, IDataObjectGrid } from "./dataObjectGrid";

/**
 * The data model for our application.
 *
 * @remarks Since this is a simple example it's just a single data object.  More advanced scenarios may have more
 * complex models.
 */
export interface IDataObjectGridAppModel {
	readonly dataObjectGrid: IDataObjectGrid;
}

class DataObjectGridAppModel implements IDataObjectGridAppModel {
	public constructor(public readonly dataObjectGrid: IDataObjectGrid) {}
}

const dataObjectGridId = "data-object-grid";

/**
 * The runtime factory for our Fluid container.
 */
export class DataObjectGridContainerRuntimeFactory extends ModelContainerRuntimeFactory<IDataObjectGridAppModel> {
	constructor() {
		super(
			new Map([DataObjectGrid.getFactory().registryEntry]), // registryEntries
		);
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.containerInitializingFirstTime}
	 */
	protected async containerInitializingFirstTime(runtime: IContainerRuntime) {
		const dataObjectGrid = await runtime.createDataStore(DataObjectGrid.getFactory().type);
		await dataObjectGrid.trySetAlias(dataObjectGridId);
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.createModel}
	 */
	protected async createModel(runtime: IContainerRuntime, container: IContainer) {
<<<<<<< HEAD
		// eslint-disable-next-line import/no-deprecated
		const dataObjectGrid = await requestFluidObject<IDataObjectGrid>(
			await runtime.getRootDataStore(dataObjectGridId),
			"",
=======
		return new DataObjectGridAppModel(
			await getDataStoreEntryPoint<IDataObjectGrid>(runtime, dataObjectGridId),
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		);
	}
}

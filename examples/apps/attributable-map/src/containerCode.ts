/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { IContainer } from "@fluidframework/container-definitions";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
<<<<<<< HEAD
// eslint-disable-next-line import/no-deprecated
import { requestFluidObject } from "@fluidframework/runtime-utils";
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
import { FluidObject } from "@fluidframework/core-interfaces";
import { IRuntimeAttributor, IProvideRuntimeAttributor } from "@fluid-experimental/attributor";
import { getDataStoreEntryPoint } from "@fluid-example/example-utils";
import { ModelContainerRuntimeFactoryWithAttribution } from "./modelContainerRuntimeFactoryWithAttribution";
import { HitCounter } from "./dataObject";

export interface IHitCounterAppModel {
	readonly hitCounter: HitCounter;
	readonly runtimeAttributor?: IRuntimeAttributor | undefined;
}

class HitCounterAppModel implements IHitCounterAppModel {
	public constructor(
		public readonly hitCounter: HitCounter,
		public readonly runtimeAttributor?: IRuntimeAttributor,
	) {}
}

const hitCounterId = "hit-counter";

export class HitCounterContainerRuntimeFactory extends ModelContainerRuntimeFactoryWithAttribution<IHitCounterAppModel> {
	constructor() {
		super(
			new Map([HitCounter.getFactory().registryEntry]), // registryEntries
		);
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.containerInitializingFirstTime}
	 */
	protected async containerInitializingFirstTime(runtime: IContainerRuntime) {
		const hitCounter = await runtime.createDataStore(HitCounter.getFactory().type);
		await hitCounter.trySetAlias(hitCounterId);
	}

	/**
	 * {@inheritDoc ModelContainerRuntimeFactory.createModel}
	 */
	protected async createModel(runtime: IContainerRuntime, container: IContainer) {
<<<<<<< HEAD
		// eslint-disable-next-line import/no-deprecated
		const hitCounter = await requestFluidObject<HitCounter>(
			await runtime.getRootDataStore(hitCounterId),
			"",
		);
=======
		const hitCounter = await getDataStoreEntryPoint<HitCounter>(runtime, hitCounterId);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		const maybeProvidesAttributor: FluidObject<IProvideRuntimeAttributor> = runtime.scope;
		const runtimeAttributor = maybeProvidesAttributor.IRuntimeAttributor;
		return new HitCounterAppModel(hitCounter, runtimeAttributor);
	}
}

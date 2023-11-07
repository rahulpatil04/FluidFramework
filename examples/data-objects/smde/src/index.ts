/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

<<<<<<< HEAD
// eslint-disable-next-line import/no-deprecated
import { mountableViewRequestHandler } from "@fluidframework/aqueduct";
import { IContainerContext } from "@fluidframework/container-definitions";
import { ContainerRuntime } from "@fluidframework/container-runtime";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
// eslint-disable-next-line import/no-deprecated
import { buildRuntimeRequestHandler } from "@fluidframework/request-handler";
import { IFluidDataStoreFactory } from "@fluidframework/runtime-definitions";
import {
	// eslint-disable-next-line import/no-deprecated
	requestFluidObject,
	RequestParser,
	RuntimeFactoryHelper,
} from "@fluidframework/runtime-utils";
=======
import { IContainerContext } from "@fluidframework/container-definitions";
import { ContainerRuntime } from "@fluidframework/container-runtime";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import { IFluidDataStoreFactory } from "@fluidframework/runtime-definitions";
import { RuntimeFactoryHelper } from "@fluidframework/runtime-utils";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
import { MountableView } from "@fluidframework/view-adapters";
import { FluidObject } from "@fluidframework/core-interfaces";
import {
	IFluidMountableViewEntryPoint,
	getDataStoreEntryPoint,
} from "@fluid-example/example-utils";

import React from "react";

import { SmdeDataObject, SmdeFactory } from "./smde";
import { SmdeReactView } from "./smdeView";

const defaultComponentId = "default";

const smde = new SmdeFactory();

<<<<<<< HEAD
const viewRequestHandler = async (request: RequestParser, runtime: IContainerRuntime) => {
	if (request.pathParts.length === 0) {
		const objectRequest = RequestParser.create({
			url: ``,
			headers: request.headers,
		});
		// eslint-disable-next-line import/no-deprecated
		const smdeDataObject = await requestFluidObject<SmdeDataObject>(
			await runtime.getRootDataStore(defaultComponentId),
			objectRequest,
		);
		return {
			status: 200,
			mimeType: "fluid/view",
			value: React.createElement(SmdeReactView, {
				smdeDataObject,
			}),
		};
	}
};

=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
class SmdeContainerFactory extends RuntimeFactoryHelper {
	public async instantiateFirstTime(runtime: ContainerRuntime): Promise<void> {
		const dataStore = await runtime.createDataStore(smde.type);
		await dataStore.trySetAlias(defaultComponentId);
	}

	public async preInitialize(
		context: IContainerContext,
		existing: boolean,
	): Promise<ContainerRuntime> {
		const registryEntries = new Map<string, Promise<IFluidDataStoreFactory>>([
			[smde.type, Promise.resolve(smde)],
		]);

		const runtime: ContainerRuntime = await ContainerRuntime.loadRuntime({
			context,
<<<<<<< HEAD
			registry,
			// eslint-disable-next-line import/no-deprecated
			buildRuntimeRequestHandler(
				// eslint-disable-next-line import/no-deprecated
				mountableViewRequestHandler(MountableView, [viewRequestHandler]),
			),
			undefined, // runtimeOptions
			undefined, // containerScope
=======
			registryEntries,
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			existing,
			containerScope: context.scope,
			provideEntryPoint: async (
				containerRuntime: IContainerRuntime,
			): Promise<IFluidMountableViewEntryPoint> => {
				const smdeDataObject = await getDataStoreEntryPoint<SmdeDataObject>(
					containerRuntime,
					defaultComponentId,
				);

				const view = React.createElement(SmdeReactView, {
					smdeDataObject,
				}) as any;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				let getMountableDefaultView = async () => view;
				if (MountableView.canMount(view)) {
					getMountableDefaultView = async () => new MountableView(view);
				}

				return {
					getDefaultDataObject: async () => smdeDataObject as FluidObject,
					getMountableDefaultView,
				};
			},
		});

		return runtime;
	}
}

export const fluidExport = new SmdeContainerFactory();

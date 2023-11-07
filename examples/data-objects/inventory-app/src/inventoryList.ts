/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import {
	ForestType,
	ISharedTree,
<<<<<<< HEAD
	ISharedTreeView,
=======
	ISharedTreeView2,
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	SharedTreeFactory,
	typeboxValidator,
} from "@fluid-experimental/tree2";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { Inventory, treeConfiguration } from "./schema";

const treeKey = "tree";

const factory = new SharedTreeFactory({
	jsonValidator: typeboxValidator,
	forest: ForestType.Reference,
});

export class InventoryList extends DataObject {
	#tree?: ISharedTree;
<<<<<<< HEAD
	#view?: ISharedTreeView;
=======
	#view?: ISharedTreeView2<typeof treeConfiguration.schema.rootFieldSchema>;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

	public get inventory(): Inventory {
		if (this.#view === undefined)
			throw new Error("view should be initialized by hasInitialized");
<<<<<<< HEAD
		return this.#view.root2(treeConfiguration.schema);
=======
		return this.#view.root;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	}

	protected async initializingFirstTime() {
		this.#tree = this.runtime.createChannel(undefined, factory.type) as ISharedTree;
		this.root.set(treeKey, this.#tree.handle);
	}

	protected async initializingFromExisting() {
		const handle = this.root.get<IFluidHandle<ISharedTree>>(treeKey);
		if (handle === undefined)
			throw new Error("map should be populated on creation by 'initializingFirstTime'");
		this.#tree = await handle.get();
	}

	protected async hasInitialized() {
		if (this.#tree === undefined)
			throw new Error("tree should be initialized by initializing* methods");
<<<<<<< HEAD
		this.#view = this.#tree.schematizeView(treeConfiguration);
=======
		this.#view = this.#tree.schematize(treeConfiguration);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	}
}

export const InventoryListFactory = new DataObjectFactory(
	"@fluid-experimental/inventory-list",
	InventoryList,
	[factory],
	{},
);

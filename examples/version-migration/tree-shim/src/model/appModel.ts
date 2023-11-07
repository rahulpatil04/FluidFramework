/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

<<<<<<< HEAD
import { TypedEmitter } from "tiny-typed-emitter";
import type {
	IInventoryList,
	IInventoryListAppModel,
	IInventoryListAppModelEvents,
} from "../modelInterfaces";

/**
 * The InventoryListAppModel provides two inventory lists, one using legacy SharedTree
 * and the other using new SharedTree.  They function the same and share the same interface.
 */
export class InventoryListAppModel
	extends TypedEmitter<IInventoryListAppModelEvents>
	implements IInventoryListAppModel
{
	public constructor(
		public readonly legacyTreeInventoryList: IInventoryList,
		public readonly newTreeInventoryList: IInventoryList,
		public readonly DEBUG_triggerMigration: () => void,
	) {
		super();
		// inventoryList.on("migrationFinished", () => { this.emit("inventoryListChanged"); });
	}
=======
import type {
	IInventoryList,
	IInventoryListAppModel,
	IMigrateBackingData,
} from "../modelInterfaces";

/**
 * The InventoryListAppModel just provides the inventory list, which is also capable of migrating its backing data.
 */
export class InventoryListAppModel implements IInventoryListAppModel {
	public constructor(
		public readonly migratingInventoryList: IInventoryList & IMigrateBackingData,
	) {}
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
}

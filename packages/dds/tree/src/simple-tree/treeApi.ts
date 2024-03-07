/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { assert } from "@fluidframework/core-utils";
import { fail } from "../util/index.js";
import { TreeValue } from "../core/index.js";
import {
	EditableTreeEvents,
	LeafNodeSchema,
	Multiplicity,
	TreeStatus,
	isTreeValue,
	valueSchemaAllows,
} from "../feature-libraries/index.js";
import { TreeNode } from "./types.js";
import { getFlexNode, tryGetFlexNode } from "./flexNode.js";
import { getClassSchema, getOrCreateNodeProxy } from "./proxies.js";
import { schemaFromValue } from "./schemaFactory.js";
import { NodeFromSchema, NodeKind, TreeNodeSchema, TreeLeafValue } from "./schemaTypes.js";
import { getFlexSchema } from "./toFlexSchema.js";
import { TreeView, WrapperTreeView, viewFromContext } from "./tree.js";

/**
 * Provides various functions for analyzing {@link TreeNode}s.
 *
 * @privateRemarks
 * Inlining the typing of this interface onto the `Tree` object provides slightly different .d.ts generation,
 * which avoids typescript expanding the type of TreeNodeSchema and thus encountering
 * https://github.com/microsoft/rushstack/issues/1958.
 * @public
 */
export interface TreeApi {
	/**
	 * The schema information for this node.
	 */
	schema<T extends TreeNode | TreeLeafValue>(
		node: T,
	): TreeNodeSchema<string, NodeKind, unknown, T>;
	/**
	 * Narrow the type of the given value if it satisfies the given schema.
	 * @example
	 * ```ts
	 * if (node.is(myNode, point)) {
	 *     const y = myNode.y; // `myNode` is now known to satisfy the `point` schema and therefore has a `y` coordinate.
	 * }
	 * ```
	 */
	is<TSchema extends TreeNodeSchema>(
		value: unknown,
		schema: TSchema,
	): value is NodeFromSchema<TSchema>;
	/**
	 * Return the node under which this node resides in the tree (or undefined if this is a root node of the tree).
	 */
	parent(node: TreeNode): TreeNode | undefined;
	/**
	 * The key of the given node under its parent.
	 * @remarks
	 * If `node` is an element in a {@link (TreeArrayNode:interface)}, this returns the index of `node` in the array node (a `number`).
	 * Otherwise, this returns the key of the field that it is under (a `string`).
	 */
	key(node: TreeNode): string | number;
	/**
	 * Register an event listener on the given node.
	 * @returns A callback function which will deregister the event.
	 * This callback should be called only once.
	 */
	on<K extends keyof TreeNodeEvents>(
		node: TreeNode,
		eventName: K,
		listener: TreeNodeEvents[K],
	): () => void;
	/**
	 * Returns the {@link TreeStatus} of the given node.
	 */
	readonly status: (node: TreeNode) => TreeStatus;
	/**
	 * Apply one or more edits to the tree as a single atomic unit.
	 * @param node - The node that will be passed to `transaction`.
	 * This is typically the root node of the subtree that will be modified by the transaction.
	 * @param transaction - The function to run as the body of the transaction.
	 * This function is passed the provided `node`.
	 * At any point during the transaction, the function may return the value `"rollback"` to abort the transaction and discard any changes it made so far.
	 * @remarks
	 * All of the changes in the transaction are applied synchronously and therefore no other changes (either from this client or from a remote client) can be interleaved with those changes.
	 * Note that this is guaranteed by Fluid for any sequence of changes that are submitted synchronously, whether in a transaction or not.
	 * However, using a transaction has the following additional consequences:
	 * - If reverted (e.g. via an "undo" operation), all the changes in the transaction are reverted together.
	 * - If any change in the transaction fails and must be discarded, then the entire transaction is discarded.
	 * - The internal data representation of a transaction with many changes is generally smaller and more efficient than that of the changes when separate.
	 *
	 * Local change events will be emitted for each change as the transaction is being applied.
	 * If the transaction is cancelled and rolled back, a corresponding change event will also be emitted for the rollback.
	 */
	runTransaction<TNode extends TreeNode>(
		node: TNode,
		transaction: (node: TNode) => void | "rollback",
	): void;
	/**
	 * Apply one or more edits to the tree as a single atomic unit.
	 * @param tree - The tree which will be edited by the transaction
	 * @param transaction - The function to run as the body of the transaction.
	 * This function is passed the root of the tree.
	 * At any point during the transaction, the function may return the value `"rollback"` to abort the transaction and discard any changes it made so far.
	 * @remarks
	 * All of the changes in the transaction are applied synchronously and therefore no other changes (either from this client or from a remote client) can be interleaved with those changes.
	 * Note that this is guaranteed by Fluid for any sequence of changes that are submitted synchronously, whether in a transaction or not.
	 * However, using a transaction has the following additional consequences:
	 * - If reverted (e.g. via an "undo" operation), all the changes in the transaction are reverted together.
	 * - If any change in the transaction fails and must be discarded, then the entire transaction is discarded.
	 * - The internal data representation of a transaction with many changes is generally smaller and more efficient than that of the changes when separate.
	 *
	 * Local change events will be emitted for each change as the transaction is being applied.
	 * If the transaction is cancelled and rolled back, a corresponding change event will also be emitted for the rollback.
	 */
	runTransaction<TRoot>(
		tree: TreeView<TRoot>,
		transaction: (root: TRoot) => void | "rollback",
	): void;
}

/**
 * The `Tree` object holds various functions for analyzing {@link TreeNode}s.
 * @public
 */
export const nodeApi: TreeApi = {
	parent: (node: TreeNode): TreeNode | undefined => {
		const editNode = getFlexNode(node).parentField.parent.parent;
		if (editNode === undefined) {
			return undefined;
		}

		const output = getOrCreateNodeProxy(editNode);
		assert(
			!isTreeValue(output),
			0x87f /* Parent can't be a leaf, so it should be a node not a value */,
		);
		return output;
	},
	key: (node: TreeNode) => {
		const parentField = getFlexNode(node).parentField;
		if (parentField.parent.schema.kind.multiplicity === Multiplicity.Sequence) {
			// The parent of `node` is an array node
			return parentField.index;
		}

		// The parent of `node` is an object, a map, or undefined (and therefore `node` is a root/detached node).
		return parentField.parent.key;
	},
	on: <K extends keyof EditableTreeEvents>(
		node: TreeNode,
		eventName: K,
		listener: EditableTreeEvents[K],
	) => {
		return getFlexNode(node).on(eventName, listener);
	},
	status: (node: TreeNode) => {
		return getFlexNode(node, true).treeStatus();
	},
	is: <TSchema extends TreeNodeSchema>(
		value: unknown,
		schema: TSchema,
	): value is NodeFromSchema<TSchema> => {
		const flexSchema = getFlexSchema(schema);
		if (isTreeValue(value)) {
			return (
				flexSchema instanceof LeafNodeSchema && valueSchemaAllows(flexSchema.info, value)
			);
		}
		return tryGetFlexNode(value)?.is(flexSchema) ?? false;
	},
	schema<T extends TreeNode | TreeValue>(node: T): TreeNodeSchema<string, NodeKind, unknown, T> {
		if (isTreeValue(node)) {
			return schemaFromValue(node) as TreeNodeSchema<string, NodeKind, unknown, T>;
		}
		return getClassSchema(getFlexNode(node).schema) as TreeNodeSchema<
			string,
			NodeKind,
			unknown,
			T
		>;
	},
	runTransaction<TNode extends TreeNode, TRoot>(
		viewOrNode: TreeView<TRoot> | TNode,
		transaction: ((node: TNode) => void | "rollback") | ((root: TRoot) => void | "rollback"),
	): void {
		if (viewOrNode instanceof WrapperTreeView) {
			viewOrNode.runTransaction(transaction as any);
		} else {
			const node = viewOrNode as TNode;
			const nodeTransaction = transaction as (node: TNode) => void | "rollback";
			const view =
				viewFromContext.get(getFlexNode(node).context) ??
				fail("Flex node does not have an associated tree view");

			assert(view instanceof WrapperTreeView, "View does not support transactions");
			view.runTransaction(() => nodeTransaction(node));
		}
	},
};

/**
 * A collection of events that can be raised by a {@link TreeNode}.
 * @public
 */
export interface TreeNodeEvents {
	/**
	 * Raised on a node right after a change is applied to one of its fields or the fields of a descendant node.
	 */
	afterChange(): void;
}

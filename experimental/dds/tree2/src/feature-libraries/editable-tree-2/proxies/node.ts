/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

<<<<<<< HEAD
import { fail } from "../../../util";
import { TreeNodeSchema, schemaIsFieldNode } from "../../typed-schema";
import { EditableTreeEvents } from "../../untypedTree";
import { TreeNode, TreeStatus } from "../editableTreeTypes";
import { getProxyForNode } from "./proxies";
import { ProxyNode, SharedTreeNode, getTreeNode } from "./types";
=======
import { TreeNodeSchema, schemaIsFieldNode } from "../../typed-schema";
import { EditableTreeEvents } from "../../untypedTree";
import { TreeStatus } from "../editableTreeTypes";
import { getOrCreateNodeProxy } from "./proxies";
import { getEditNode, tryGetEditNode } from "./editNode";
import { ProxyNode, SharedTreeNode } from "./types";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

/**
 * Provides various functions for analyzing {@link SharedTreeNode}s.
 * @alpha
 * @privateRemarks
<<<<<<< HEAD
 * Inlining the typing of this interface onto the `node` object provides slightly different .d.ts generation,
 * which avoids typescript expanding the type of TreeNodeSchema and thus encountering
 * https://github.com/microsoft/rushstack/issues/1958.
 */
export interface NodeApi {
=======
 * Inlining the typing of this interface onto the `Tree` object provides slightly different .d.ts generation,
 * which avoids typescript expanding the type of TreeNodeSchema and thus encountering
 * https://github.com/microsoft/rushstack/issues/1958.
 */
export interface TreeApi {
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	/**
	 * The schema information for this node.
	 */
	readonly schema: (node: SharedTreeNode) => TreeNodeSchema;
	/**
	 * Narrow the type of the given value if it satisfies the given schema.
	 * @example
	 * ```ts
	 * if (node.is(myNode, point)) {
	 *     const y = myNode.y; // `myNode` is now known to satisfy the `point` schema and therefore has a `y` coordinate.
	 * }
	 * ```
	 */
	readonly is: <TSchema extends TreeNodeSchema>(
		value: unknown,
		schema: TSchema,
	) => value is ProxyNode<TSchema>;
	/**
	 * Return the node under which this node resides in the tree (or undefined if this is a root node of the tree).
	 */
	readonly parent: (node: SharedTreeNode) => SharedTreeNode | undefined;
	/**
	 * The key of the given node under its parent.
	 * @remarks
	 * If `node` is an element in a {@link SharedTreeList}, this returns the index of `node` in the list (a `number`).
	 * Otherwise, this returns the key of the field that it is under (a `string`).
	 */
	readonly key: (node: SharedTreeNode) => string | number;
	/**
	 * Register an event listener on the given node.
	 * @returns A callback function which will deregister the event.
	 * This callback should be called only once.
	 */
	readonly on: <K extends keyof EditableTreeEvents>(
		node: SharedTreeNode,
		eventName: K,
		listener: EditableTreeEvents[K],
	) => () => void;
	/**
	 * Returns the {@link TreeStatus} of the given node.
	 */
	readonly status: (node: SharedTreeNode) => TreeStatus;
}

/**
<<<<<<< HEAD
 * The `node` object holds various functions for analyzing {@link SharedTreeNode}s.
 * @alpha
 */
export const nodeApi: NodeApi = {
	schema: (node: SharedTreeNode) => {
		return assertTreeNode(node).schema;
=======
 * The `Tree` object holds various functions for analyzing {@link SharedTreeNode}s.
 * @alpha
 */
export const nodeApi: TreeApi = {
	schema: (node: SharedTreeNode) => {
		return getEditNode(node).schema;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	},
	is: <TSchema extends TreeNodeSchema>(
		value: unknown,
		schema: TSchema,
	): value is ProxyNode<TSchema> => {
<<<<<<< HEAD
		return getTreeNode(value)?.is(schema) ?? false;
	},
	parent: (node: SharedTreeNode) => {
		const treeNode = assertTreeNode(node).parentField.parent.parent;
		if (treeNode !== undefined) {
			return getProxyForNode(treeNode);
=======
		return tryGetEditNode(value)?.is(schema) ?? false;
	},
	parent: (node: SharedTreeNode) => {
		const editNode = getEditNode(node).parentField.parent.parent;
		if (editNode !== undefined) {
			return getOrCreateNodeProxy(editNode);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		}

		return undefined;
	},
	key: (node: SharedTreeNode) => {
<<<<<<< HEAD
		const treeNode = assertTreeNode(node);
=======
		const editNode = getEditNode(node);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		const parent = nodeApi.parent(node);
		if (parent !== undefined) {
			const parentSchema = nodeApi.schema(parent);
			if (schemaIsFieldNode(parentSchema)) {
				// The parent of `node` is a list
<<<<<<< HEAD
				return treeNode.parentField.index;
=======
				return editNode.parentField.index;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			}
		}

		// The parent of `node` is an object, a map, or undefined (and therefore `node` is a root/detached node).
<<<<<<< HEAD
		return treeNode.parentField.parent.key;
=======
		return editNode.parentField.parent.key;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	},
	on: <K extends keyof EditableTreeEvents>(
		node: SharedTreeNode,
		eventName: K,
		listener: EditableTreeEvents[K],
	) => {
<<<<<<< HEAD
		return assertTreeNode(node).on(eventName, listener);
	},
	status: (node: SharedTreeNode) => {
		return assertTreeNode(node).treeStatus();
	},
};

function assertTreeNode(node: SharedTreeNode): TreeNode {
	return getTreeNode(node) ?? fail("Expected a SharedTreeNode");
}
=======
		return getEditNode(node).on(eventName, listener);
	},
	status: (node: SharedTreeNode) => {
		return getEditNode(node).treeStatus();
	},
};
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

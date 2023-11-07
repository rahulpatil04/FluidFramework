/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import {
	DefaultEditBuilder,
	TreeFieldSchema,
	ImplicitFieldSchema,
	ProxyField,
	ProxyRoot,
	TreeSchema,
	createMockNodeKeyManager,
	nodeKeyFieldKey,
<<<<<<< HEAD
} from "../../../feature-libraries";
// eslint-disable-next-line import/no-internal-modules
import { Context, getTreeContext } from "../../../feature-libraries/editable-tree-2/context";
import { AllowedUpdateType, IEditableForest } from "../../../core";
import { ISharedTree, ISharedTreeView, TreeContent } from "../../../shared-tree";
=======
	SchemaAware,
} from "../../../feature-libraries";
// eslint-disable-next-line import/no-internal-modules
import { Context, getTreeContext } from "../../../feature-libraries/editable-tree-2/context";
import { AllowedUpdateType, IEditableForest, ITreeCursorSynchronous } from "../../../core";
import { ISharedTree, ISharedTreeView2, TreeContent } from "../../../shared-tree";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
import { TestTreeProviderLite, forestWithContent } from "../../utils";
import { brand } from "../../../util";
import { SchemaBuilder } from "../../../domains";

export function getReadonlyContext(forest: IEditableForest, schema: TreeSchema): Context {
	// This will error if someone tries to call mutation methods on it
	const dummyEditor = {} as unknown as DefaultEditBuilder;
	return getTreeContext(
		schema,
		forest,
		dummyEditor,
		createMockNodeKeyManager(),
		brand(nodeKeyFieldKey),
	);
}

/**
 * Creates a context and its backing forest from the provided `content`.
 *
 * @returns The created context.
 */
export function contextWithContentReadonly(content: TreeContent): Context {
	const forest = forestWithContent(content);
	return getReadonlyContext(forest, content.schema);
}

export function createTree(): ISharedTree {
	const tree = new TestTreeProviderLite(1).trees[0];
	assert(tree.isAttached());
	return tree;
}

<<<<<<< HEAD
export function createTreeView<TRoot extends TreeFieldSchema>(
	schema: TreeSchema<TRoot>,
	initialTree: any,
): ISharedTreeView {
	return createTree().schematizeView({
=======
export function createTreeView2<TRoot extends TreeFieldSchema>(
	schema: TreeSchema<TRoot>,
	initialTree:
		| ITreeCursorSynchronous
		| readonly ITreeCursorSynchronous[]
		| SchemaAware.TypedField<TRoot, SchemaAware.ApiMode.Flexible>,
): ISharedTreeView2<TRoot> {
	return createTree().schematize({
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		allowedSchemaModifications: AllowedUpdateType.None,
		initialTree,
		schema,
	});
}

/** Helper for making small test schemas. */
export function makeSchema<const TSchema extends ImplicitFieldSchema>(
	fn: (builder: SchemaBuilder) => TSchema,
) {
	const builder = new SchemaBuilder({
		scope: `test.schema.${Math.random().toString(36).slice(2)}`,
	});
	const root = fn(builder);
	return builder.intoSchema(root);
}

export function itWithRoot<TRoot extends TreeFieldSchema>(
	title: string,
	schema: TreeSchema<TRoot>,
	initialTree: ProxyRoot<TreeSchema<TRoot>, "javaScript">,
	fn: (root: ProxyField<(typeof schema)["rootFieldSchema"]>) => void,
): void {
	it(title, () => {
<<<<<<< HEAD
		const view = createTreeView(schema, initialTree);
		const root = view.root2(schema);
=======
		const view = createTreeView2(
			schema,
			initialTree as SchemaAware.TypedField<TRoot, SchemaAware.ApiMode.Flexible>,
		);
		const root = view.root;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		fn(root);
	});
}

/**
 * Similar to JSON stringify, but preserves `undefined` and numbers numbers as-is at the root.
 */
export function pretty(arg: unknown): number | undefined | string {
<<<<<<< HEAD
	return arg === undefined ? "undefined" : typeof arg === "number" ? arg : JSON.stringify(arg);
=======
	if (arg === undefined) {
		return "undefined";
	}
	if (typeof arg === "number") {
		return arg;
	}
	if (typeof arg === "string") {
		return `"${arg}"`;
	}
	return JSON.stringify(arg);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
}

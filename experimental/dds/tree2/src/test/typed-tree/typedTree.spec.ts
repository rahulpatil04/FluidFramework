/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import { strict as assert } from "assert";
import { MockFluidDataStoreRuntime } from "@fluidframework/test-runtime-utils";
import { ForestType, TypedTreeFactory } from "../../shared-tree";
import { AllowedUpdateType } from "../../core";
import { typeboxValidator } from "../../external-utilities";
<<<<<<< HEAD
import { leaf, SchemaBuilder } from "../../domains";

describe("TypedTree", () => {
	it("editable-tree-2-end-to-end", () => {
		const builder = new SchemaBuilder({ scope: "e2e" });
		const schema = builder.intoSchema(leaf.number);
=======
import { SchemaBuilder } from "../../domains";

describe("TypedTree", () => {
	it("typed-tree end to end", () => {
		const builder = new SchemaBuilder({ scope: "e2e" });
		const Node = builder.object("Node", { item: builder.number });
		const schema = builder.intoSchema(Node);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		const factory = new TypedTreeFactory({
			jsonValidator: typeboxValidator,
			forest: ForestType.Reference,
			subtype: "test",
		});
<<<<<<< HEAD
		const root = factory.create(new MockFluidDataStoreRuntime(), "the tree").schematize({
			allowedSchemaModifications: AllowedUpdateType.SchemaCompatible,
			initialTree: 1,
			schema,
		});
		root.content += 1;
		assert.equal(root.content, 2);
=======
		const view = factory.create(new MockFluidDataStoreRuntime(), "the tree").schematize({
			allowedSchemaModifications: AllowedUpdateType.SchemaCompatible,
			initialTree: { item: 1 },
			schema,
		});
		view.root.item += 1;
		assert.equal(view.root.item, 2);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	});
});

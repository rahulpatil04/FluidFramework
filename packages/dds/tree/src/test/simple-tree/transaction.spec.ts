/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { SchemaFactory, Tree, TreeConfiguration } from "../../simple-tree/index.js";
import { getView } from "./utils.js";

describe("simple-tree transactions", () => {
	const sb = new SchemaFactory("test");
	const schema = sb.object("object", {
		content: sb.number,
	});
	const initialTree = () => ({ content: 42 });

	describe("initiated from a node", () => {
		it("can change the tree", () => {
			const root = getView(new TreeConfiguration(schema, initialTree)).root;
			Tree.runTransaction(root, (r) => {
				r.content = 43;
			});
			assert.equal(root.content, 43);
		});

		it("emit change events", () => {
			const root = getView(new TreeConfiguration(schema, initialTree)).root;
			let changed = false;
			Tree.on(root, "afterChange", () => (changed = true));
			Tree.runTransaction(root, (r) => {
				r.content = 43;
			});
			assert.equal(changed, true);
		});

		it("can be rolled back", () => {
			const root = getView(new TreeConfiguration(schema, initialTree)).root;
			Tree.runTransaction(root, (r) => {
				r.content = 43;
				return "rollback";
			});
			assert.equal(root.content, 42);
		});
	});

	describe("initiated from a tree view", () => {
		it("can change the tree", () => {
			const view = getView(new TreeConfiguration(schema, initialTree));
			Tree.runTransaction(view, (root) => {
				root.content = 43;
			});
			assert.equal(view.root.content, 43);
		});

		it("emit change events", () => {
			const view = getView(new TreeConfiguration(schema, initialTree));
			let changed = false;
			view.events.on("afterBatch", () => (changed = true));
			Tree.runTransaction(view, () => {
				view.root.content = 43;
			});
			assert.equal(changed, true);
		});

		it("can be rolled back", () => {
			const view = getView(new TreeConfiguration(schema, initialTree));
			Tree.runTransaction(view, (root) => {
				root.content = 43;
				return "rollback";
			});
			assert.equal(view.root.content, 42);
		});
	});
});

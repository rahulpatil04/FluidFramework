/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { assert } from "@fluidframework/core-utils";
import { brand, fail } from "../../../util";
import {
	AllowedTypes,
<<<<<<< HEAD
	FieldNodeSchema,
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	TreeFieldSchema,
	ObjectNodeSchema,
	TreeNodeSchema,
	schemaIsFieldNode,
	schemaIsLeaf,
	schemaIsMap,
	schemaIsObjectNode,
	MapSchema,
<<<<<<< HEAD
=======
	FieldNodeSchema,
	MapFieldSchema,
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
} from "../../typed-schema";
import { FieldKinds } from "../../default-field-kinds";
import {
	FieldNode,
<<<<<<< HEAD
	MapNode,
=======
	FlexibleFieldContent,
	MapNode,
	ObjectNode,
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	OptionalField,
	RequiredField,
	TreeNode,
	TypedField,
<<<<<<< HEAD
	TypedNodeUnion,
=======
	UnknownUnboxed,
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
} from "../editableTreeTypes";
import { LazySequence } from "../lazyField";
import { FieldKey } from "../../../core";
import { LazyObjectNode, getBoxedField } from "../lazyTree";
<<<<<<< HEAD
import { ContextuallyTypedNodeData } from "../../contextuallyTyped";
=======
import { ContextuallyTypedNodeData, isFluidHandle, typeNameSymbol } from "../../contextuallyTyped";
import { createRawObjectNode, extractRawNodeContent } from "../rawObjectNode";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
import {
	ProxyField,
	ProxyNode,
	ProxyNodeUnion,
	SharedTreeList,
	SharedTreeMap,
<<<<<<< HEAD
	SharedTreeNode,
	SharedTreeObject,
	getTreeNode,
	setTreeNode,
} from "./types";
import { extractFactoryContent } from "./objectFactory";

const proxyCacheSym = Symbol("ProxyCache");

/** Cache the proxy that wraps the given tree node so that the proxy can be re-used in future reads */
function cacheProxy(target: TreeNode, proxy: SharedTreeNode): void {
	Object.defineProperty(target, proxyCacheSym, {
		value: proxy,
		writable: false,
		enumerable: false,
		configurable: false,
	});
}

/** If there has already been a proxy created to wrap the given tree node, return it */
function getCachedProxy(treeNode: TreeNode): ProxyNode<TreeNodeSchema> | undefined {
	return (treeNode as unknown as { [proxyCacheSym]: ProxyNode<TreeNodeSchema> })[proxyCacheSym];
}
=======
	SharedTreeObject,
} from "./types";
import { tryGetEditNodeTarget, setEditNode, getEditNode, tryGetEditNode } from "./editNode";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

/** Retrieve the associated proxy for the given field. */
export function getProxyForField<TSchema extends TreeFieldSchema>(
	field: TypedField<TSchema>,
): ProxyField<TSchema> {
	switch (field.schema.kind) {
		case FieldKinds.required: {
			const asValue = field as TypedField<TreeFieldSchema<typeof FieldKinds.required>>;

			// TODO: Ideally, we would return leaves without first boxing them.  However, this is not
			//       as simple as calling '.content' since this skips the node and returns the FieldNode's
			//       inner field.
<<<<<<< HEAD
			return getProxyForNode(asValue.boxedContent) as ProxyField<TSchema>;
=======
			return getOrCreateNodeProxy(asValue.boxedContent) as ProxyField<TSchema>;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		}
		case FieldKinds.optional: {
			const asValue = field as TypedField<TreeFieldSchema<typeof FieldKinds.optional>>;

			// TODO: Ideally, we would return leaves without first boxing them.  However, this is not
			//       as simple as calling '.content' since this skips the node and returns the FieldNode's
			//       inner field.

			const maybeContent = asValue.boxedContent;

			// Normally, empty fields are unreachable due to the behavior of 'tryGetField'.  However, the
			// root field is a special case where the field is always present (even if empty).
			return (
<<<<<<< HEAD
				maybeContent === undefined ? undefined : getProxyForNode(maybeContent)
=======
				maybeContent === undefined ? undefined : getOrCreateNodeProxy(maybeContent)
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			) as ProxyField<TSchema>;
		}
		// TODO: Remove if/when 'FieldNode' is removed.
		case FieldKinds.sequence: {
			// 'getProxyForNode' handles FieldNodes by unconditionally creating a list proxy, making
			// this case unreachable as long as users follow the 'list recipe'.
			fail("'sequence' field is unexpected.");
		}
		default:
			fail("invalid field kind");
	}
}

<<<<<<< HEAD
export function getProxyForNode<TSchema extends TreeNodeSchema>(
	treeNode: TreeNode,
): ProxyNode<TSchema> {
	const schema = treeNode.schema;

	/**
	 * Gets a cached proxy for `treeNode` if one was already created and cached.
	 * Otherwise, creates a new proxy, caches it, and returns it.
	 */
	function getOrCreateProxy(createProxy: () => SharedTreeNode): ProxyNode<TSchema> {
		const cachedProxy = getCachedProxy(treeNode);
		if (cachedProxy !== undefined) {
			return cachedProxy as ProxyNode<TSchema>;
		}

		const proxy = createProxy();
		cacheProxy(treeNode, proxy);
		return proxy as ProxyNode<TSchema>;
	}

	if (schemaIsMap(schema)) {
		return getOrCreateProxy(() => createMapProxy(treeNode));
	}
	if (schemaIsLeaf(schema)) {
		return treeNode.value as ProxyNode<TSchema>;
	}
	const isFieldNode = schemaIsFieldNode(schema);
	if (isFieldNode || schemaIsObjectNode(schema)) {
		return getOrCreateProxy(() =>
			isFieldNode ? createListProxy(treeNode) : createObjectProxy(treeNode, schema),
		);
	}

	fail("unrecognized node kind");
}

export function createObjectProxy<TSchema extends ObjectNodeSchema, TTypes extends AllowedTypes>(
	content: TypedNodeUnion<TTypes>,
=======
export function getOrCreateNodeProxy<TSchema extends TreeNodeSchema>(
	editNode: TreeNode,
): ProxyNode<TSchema> {
	const cachedProxy = tryGetEditNodeTarget(editNode);
	if (cachedProxy !== undefined) {
		return cachedProxy as ProxyNode<TSchema>;
	}

	const schema = editNode.schema;
	if (schemaIsLeaf(schema)) {
		return editNode.value as ProxyNode<TSchema>;
	}
	if (schemaIsMap(schema)) {
		return setEditNode(createMapProxy(), editNode as MapNode<MapSchema>) as ProxyNode<TSchema>;
	} else if (schemaIsFieldNode(schema)) {
		return setEditNode(
			createListProxy(),
			editNode as FieldNode<FieldNodeSchema>,
		) as ProxyNode<TSchema>;
	} else if (schemaIsObjectNode(schema)) {
		return setEditNode(createObjectProxy(schema), editNode as ObjectNode) as ProxyNode<TSchema>;
	} else {
		fail("unrecognized node kind");
	}
}

function createObjectProxy<TSchema extends ObjectNodeSchema>(
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	schema: TSchema,
): SharedTreeObject<TSchema> {
	// To satisfy 'deepEquals' level scrutiny, the target of the proxy must be an object with the same
	// prototype as an object literal '{}'.  This is because 'deepEquals' uses 'Object.getPrototypeOf'
	// as a way to quickly reject objects with different prototype chains.
	//
	// (Note that the prototype of an object literal appears as '[Object: null prototype] {}', not because
	// the prototype is null, but because the prototype object itself has a null prototype.)

	// TODO: Although the target is an object literal, it's still worthwhile to try experimenting with
	// a dispatch object to see if it improves performance.
<<<<<<< HEAD
	const proxy = new Proxy(
		{},
		{
			get(target, key): unknown {
				const field = content.tryGetField(key as FieldKey);
=======
	const proxy: SharedTreeObject<TSchema> = new Proxy(
		{},
		{
			get(target, key): unknown {
				const field = getEditNode(proxy).tryGetField(key as FieldKey);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
				if (field !== undefined) {
					return getProxyForField(field);
				}

<<<<<<< HEAD
				return Reflect.get(target, key);
			},
			set(target, key, value) {
				const fieldSchema = content.schema.objectNodeFields.get(key as FieldKey);
=======
				// Pass the proxy as the receiver here, so that any methods on the prototype receive `proxy` as `this`.
				return Reflect.get(target, key, proxy);
			},
			set(target, key, value) {
				const editNode = getEditNode(proxy);
				const fieldSchema = editNode.schema.objectNodeFields.get(key as FieldKey);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

				if (fieldSchema === undefined) {
					return false;
				}

				// TODO: Is it safe to assume 'content' is a LazyObjectNode?
<<<<<<< HEAD
				assert(content instanceof LazyObjectNode, 0x7e0 /* invalid content */);
				assert(typeof key === "string", 0x7e1 /* invalid key */);
				const field = getBoxedField(content, brand(key), fieldSchema);
=======
				assert(editNode instanceof LazyObjectNode, 0x7e0 /* invalid content */);
				assert(typeof key === "string", 0x7e1 /* invalid key */);
				const field = getBoxedField(editNode, brand(key), fieldSchema);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

				switch (field.schema.kind) {
					case FieldKinds.required: {
						(field as RequiredField<AllowedTypes>).content =
							extractFactoryContent(value);
						break;
					}
					case FieldKinds.optional: {
						(field as OptionalField<AllowedTypes>).content =
							extractFactoryContent(value);
						break;
					}
					default:
						fail("invalid FieldKind");
				}

				return true;
			},
			has: (target, key) => {
				return schema.objectNodeFields.has(key as FieldKey);
			},
			ownKeys: (target) => {
				return [...schema.objectNodeFields.keys()];
			},
			getOwnPropertyDescriptor: (target, key) => {
<<<<<<< HEAD
				const field = content.tryGetField(key as FieldKey);
=======
				const field = getEditNode(proxy).tryGetField(key as FieldKey);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

				if (field === undefined) {
					return undefined;
				}

				const p: PropertyDescriptor = {
					value: getProxyForField(field),
					writable: true,
					enumerable: true,
					configurable: true, // Must be 'configurable' if property is absent from proxy target.
				};

				return p;
			},
		},
	) as SharedTreeObject<TSchema>;
<<<<<<< HEAD
	setTreeNode(proxy, content);
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	return proxy;
}

/**
<<<<<<< HEAD
 * Given the a list proxy, returns its underlying LazySequence field.
 */
const getSequenceField = <TTypes extends AllowedTypes>(
	list: SharedTreeList<AllowedTypes, "javaScript">,
) => {
	const treeNode = getTreeNode(list) as FieldNode<FieldNodeSchema>;
	const field = treeNode.content;
	return field as LazySequence<TTypes>;
};

// Used by 'insert*()' APIs to converts new content (expressed as a proxy union) to contextually
// typed data prior to forwarding to 'LazySequence.insert*()'.
function itemsAsContextuallyTyped(
	iterable: Iterable<ProxyNodeUnion<AllowedTypes, "javaScript">>,
): Iterable<ContextuallyTypedNodeData> {
=======
 * Given a list proxy, returns its underlying LazySequence field.
 */
const getSequenceField = <TTypes extends AllowedTypes>(
	list: SharedTreeList<AllowedTypes, "javaScript">,
) => getEditNode(list).content as LazySequence<TTypes>;

// Used by 'insert*()' APIs to converts new content (expressed as a proxy union) to contextually
// typed data prior to forwarding to 'LazySequence.insert*()'.
function contextualizeInsertedListContent(
	iterable: Iterable<ProxyNodeUnion<AllowedTypes, "javaScript">>,
): Iterable<ContextuallyTypedNodeData> {
	if (typeof iterable === "string") {
		throw new TypeError(
			"Attempted to directly insert a string as iterable list content. Wrap the input string 's' in an array ('[s]') to insert it as a single item or, supply the iterator of the string directly via 's[Symbol.iterator]()' if intending to insert each Unicode code point as a separate item.",
		);
	}
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	// If the iterable is not already an array, copy it into an array to use '.map()' below.
	return Array.isArray(iterable)
		? iterable.map((item) => extractFactoryContent(item) as ContextuallyTypedNodeData)
		: Array.from(iterable, (item) => extractFactoryContent(item) as ContextuallyTypedNodeData);
}

// #region Create dispatch map for lists

// TODO: Experiment with alternative dispatch methods to see if we can improve performance.

/**
 * PropertyDescriptorMap used to build the prototype for our SharedListNode dispatch object.
 */
const listPrototypeProperties: PropertyDescriptorMap = {
	// We manually add [Symbol.iterator] to the dispatch map rather than use '[fn.name] = fn' as
<<<<<<< HEAD
	// above because 'Array.prototype[Symbol.iterator].name' returns "values" (i.e., Symbol.iterator
	// is an alias for the '.values()' function.)
	[Symbol.iterator]: {
		value: Array.prototype[Symbol.iterator],
	},
=======
	// below when adding 'Array.prototype.*' properties to this map because 'Array.prototype[Symbol.iterator].name'
	// returns "values" (i.e., Symbol.iterator is an alias for the '.values()' function.)
	[Symbol.iterator]: {
		value: Array.prototype[Symbol.iterator],
	},
	at: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			index: number,
		): UnknownUnboxed | undefined {
			return getSequenceField(this).at(index);
		},
	},
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	insertAt: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			index: number,
			value: Iterable<ProxyNodeUnion<AllowedTypes, "javaScript">>,
		): void {
<<<<<<< HEAD
			getSequenceField(this).insertAt(index, itemsAsContextuallyTyped(value));
=======
			getSequenceField(this).insertAt(index, contextualizeInsertedListContent(value));
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		},
	},
	insertAtStart: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			value: Iterable<ProxyNodeUnion<AllowedTypes, "javaScript">>,
		): void {
<<<<<<< HEAD
			getSequenceField(this).insertAtStart(itemsAsContextuallyTyped(value));
=======
			getSequenceField(this).insertAtStart(contextualizeInsertedListContent(value));
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		},
	},
	insertAtEnd: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			value: Iterable<ProxyNodeUnion<AllowedTypes, "javaScript">>,
		): void {
<<<<<<< HEAD
			getSequenceField(this).insertAtEnd(itemsAsContextuallyTyped(value));
=======
			getSequenceField(this).insertAtEnd(contextualizeInsertedListContent(value));
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		},
	},
	removeAt: {
		value(this: SharedTreeList<AllowedTypes, "javaScript">, index: number): void {
			getSequenceField(this).removeAt(index);
		},
	},
	removeRange: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			start?: number,
			end?: number,
		): void {
			getSequenceField(this).removeRange(start, end);
		},
	},
	moveToStart: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			sourceIndex: number,
			source?: SharedTreeList<AllowedTypes>,
		): void {
			if (source !== undefined) {
				getSequenceField(this).moveToStart(sourceIndex, getSequenceField(source));
			} else {
				getSequenceField(this).moveToStart(sourceIndex);
			}
		},
	},
	moveToEnd: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			sourceIndex: number,
			source?: SharedTreeList<AllowedTypes>,
		): void {
			if (source !== undefined) {
				getSequenceField(this).moveToEnd(sourceIndex, getSequenceField(source));
			} else {
				getSequenceField(this).moveToEnd(sourceIndex);
			}
		},
	},
	moveToIndex: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			index: number,
			sourceIndex: number,
			source?: SharedTreeList<AllowedTypes>,
		): void {
			if (source !== undefined) {
				getSequenceField(this).moveToIndex(index, sourceIndex, getSequenceField(source));
			} else {
				getSequenceField(this).moveToIndex(index, sourceIndex);
			}
		},
	},
	moveRangeToStart: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			sourceStart: number,
			sourceEnd: number,
			source?: SharedTreeList<AllowedTypes>,
		): void {
			if (source !== undefined) {
				getSequenceField(this).moveRangeToStart(
					sourceStart,
					sourceEnd,
					getSequenceField(source),
				);
			} else {
				getSequenceField(this).moveRangeToStart(sourceStart, sourceEnd);
			}
		},
	},
	moveRangeToEnd: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			sourceStart: number,
			sourceEnd: number,
			source?: SharedTreeList<AllowedTypes>,
		): void {
			if (source !== undefined) {
				getSequenceField(this).moveRangeToEnd(
					sourceStart,
					sourceEnd,
					getSequenceField(source),
				);
			} else {
				getSequenceField(this).moveRangeToEnd(sourceStart, sourceEnd);
			}
		},
	},
	moveRangeToIndex: {
		value(
			this: SharedTreeList<AllowedTypes, "javaScript">,
			index: number,
			sourceStart: number,
			sourceEnd: number,
			source?: SharedTreeList<AllowedTypes>,
		): void {
			if (source !== undefined) {
				getSequenceField(this).moveRangeToIndex(
					index,
					sourceStart,
					sourceEnd,
					getSequenceField(source),
				);
			} else {
				getSequenceField(this).moveRangeToIndex(index, sourceStart, sourceEnd);
			}
		},
	},
};

/* eslint-disable @typescript-eslint/unbound-method */

// For compatibility, we are initially implement 'readonly T[]' by applying the Array.prototype methods
// to the list proxy.  Over time, we should replace these with efficient implementations on LazySequence
// to avoid re-entering the proxy as these methods access 'length' and the indexed properties.
//
// For brevity, the current implementation dynamically builds a property descriptor map from a list of
// Array functions we want to re-expose via the proxy.

// TODO: This assumes 'Function.name' matches the property name on 'Array.prototype', which may be
// dubious across JS engines.
[
<<<<<<< HEAD
	// TODO: Remove cast to any once targeting a more recent ES version.
	(Array.prototype as any).at,

=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	Array.prototype.concat,
	// Array.prototype.copyWithin,
	Array.prototype.entries,
	Array.prototype.every,
	// Array.prototype.fill,
	Array.prototype.filter,
	Array.prototype.find,
	Array.prototype.findIndex,
	Array.prototype.flat,
	Array.prototype.flatMap,
	Array.prototype.forEach,
	Array.prototype.includes,
	Array.prototype.indexOf,
	Array.prototype.join,
	Array.prototype.keys,
	Array.prototype.lastIndexOf,
	// Array.prototype.length,
	Array.prototype.map,
	// Array.prototype.pop,
	// Array.prototype.push,
	Array.prototype.reduce,
	Array.prototype.reduceRight,
	// Array.prototype.reverse,
	// Array.prototype.shift,
	Array.prototype.slice,
	Array.prototype.some,
	// Array.prototype.sort,
	// Array.prototype.splice,
	Array.prototype.toLocaleString,
	Array.prototype.toString,
	// Array.prototype.unshift,
	Array.prototype.values,
].forEach((fn) => {
	listPrototypeProperties[fn.name] = { value: fn };
});

/* eslint-enable @typescript-eslint/unbound-method */

const listPrototype = Object.create(Object.prototype, listPrototypeProperties);

// #endregion

/**
 * Helper to coerce property keys to integer indexes (or undefined if not an in-range integer).
 */
function asIndex(key: string | symbol, length: number) {
	if (typeof key === "string") {
		// TODO: It may be worth a '0' <= ch <= '9' check before calling 'Number' to quickly
		// reject 'length' as an index, or even parsing integers ourselves.
		const asNumber = Number(key);

		// TODO: See 'matrix/range.ts' for fast integer coercing + range check.
		if (Number.isInteger(asNumber)) {
			return 0 <= asNumber && asNumber < length ? asNumber : undefined;
		}
	}
}

<<<<<<< HEAD
export function createListProxy<TTypes extends AllowedTypes>(
	treeNode: TreeNode,
): SharedTreeList<TTypes> {
	// Create a 'dispatch' object that this Proxy forwards to instead of the proxy target.
=======
function createListProxy<TTypes extends AllowedTypes>(): SharedTreeList<TTypes> {
	// Create a 'dispatch' object that this Proxy forwards to instead of the proxy target, because we need
	// the proxy target to be a plain JS array (see comments below when we instantiate the Proxy).
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	// Own properties on the dispatch object are surfaced as own properties of the proxy.
	// (e.g., 'length', which is defined below).
	//
	// Properties normally inherited from 'Array.prototype' are surfaced via the prototype chain.
<<<<<<< HEAD
	const dispatch = Object.create(listPrototype, {
=======
	const dispatch: object = Object.create(listPrototype, {
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		length: {
			get(this: SharedTreeList<AllowedTypes, "javaScript">) {
				return getSequenceField(this).length;
			},
			set() {},
			enumerable: false,
			configurable: false,
		},
	});

<<<<<<< HEAD
	setTreeNode(dispatch, treeNode);

	// To satisfy 'deepEquals' level scrutiny, the target of the proxy must be an array literal in order
	// to pass 'Object.getPrototypeOf'.  It also satisfies 'Array.isArray' and 'Object.prototype.toString'
	// requirements without use of Array[Symbol.species], which is potentially on a path ot deprecation.
	return new Proxy<SharedTreeList<TTypes>>([] as any, {
		get: (target, key) => {
			const field = getSequenceField(dispatch);
=======
	// To satisfy 'deepEquals' level scrutiny, the target of the proxy must be an array literal in order
	// to pass 'Object.getPrototypeOf'.  It also satisfies 'Array.isArray' and 'Object.prototype.toString'
	// requirements without use of Array[Symbol.species], which is potentially on a path ot deprecation.
	const proxy: SharedTreeList<TTypes> = new Proxy<SharedTreeList<TTypes>>([] as any, {
		get: (target, key) => {
			const field = getSequenceField(proxy);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			const maybeIndex = asIndex(key, field.length);

			// TODO: Ideally, we would return leaves without first boxing them.  However, this is not
			//       as simple as calling '.content' since this skips the node and returns the FieldNode's
			//       inner field.
			return maybeIndex !== undefined
<<<<<<< HEAD
				? getProxyForNode(field.boxedAt(maybeIndex))
				: (Reflect.get(dispatch, key) as unknown);
=======
				? getOrCreateNodeProxy(field.boxedAt(maybeIndex))
				: // Pass the proxy as the receiver here, so that any methods on the prototype receive `proxy` as `this`.
				  (Reflect.get(dispatch, key, proxy) as unknown);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		},
		set: (target, key, newValue, receiver) => {
			// 'Symbol.isConcatSpreadable' may be set on an Array instance to modify the behavior of
			// the concat method.  We allow this property to be added to the dispatch object.
			if (key === Symbol.isConcatSpreadable) {
<<<<<<< HEAD
				return Reflect.set(dispatch, key, newValue);
=======
				return Reflect.set(dispatch, key, newValue, proxy);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			}

			// For MVP, we otherwise disallow setting properties (mutation is only available via the list mutation APIs).
			return false;
		},
		has: (target, key) => {
<<<<<<< HEAD
			const field = getSequenceField(dispatch);
=======
			const field = getSequenceField(proxy);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			const maybeIndex = asIndex(key, field.length);
			return maybeIndex !== undefined || Reflect.has(dispatch, key);
		},
		ownKeys: (target) => {
<<<<<<< HEAD
			const field = getSequenceField(dispatch);
=======
			const field = getSequenceField(proxy);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

			// TODO: Would a lazy iterator to produce the indexes work / be more efficient?
			// TODO: Need to surface 'Symbol.isConcatSpreadable' as an own key.
			return Array.from({ length: field.length }, (_, index) => `${index}`).concat("length");
		},
		getOwnPropertyDescriptor: (target, key) => {
<<<<<<< HEAD
			const field = getSequenceField(dispatch);
=======
			const field = getSequenceField(proxy);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			const maybeIndex = asIndex(key, field.length);
			if (maybeIndex !== undefined) {
				// To satisfy 'deepEquals' level scrutiny, the property descriptor for indexed properties must
				// be a simple value property (as opposed to using getter) and declared writable/enumerable/configurable.
				return {
					// TODO: Ideally, we would return leaves without first boxing them.  However, this is not
					//       as simple as calling '.at' since this skips the node and returns the FieldNode's
					//       inner field.
<<<<<<< HEAD
					value: getProxyForNode(field.boxedAt(maybeIndex)),
=======
					value: getOrCreateNodeProxy(field.boxedAt(maybeIndex)),
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
					writable: true, // For MVP, disallow setting indexed properties.
					enumerable: true,
					configurable: true,
				};
			} else if (key === "length") {
				// To satisfy 'deepEquals' level scrutiny, the property descriptor for 'length' must be a simple
				// value property (as opposed to using getter) and be declared writable / non-configurable.
				return {
<<<<<<< HEAD
					value: getSequenceField(dispatch).length,
=======
					value: getSequenceField(proxy).length,
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
					writable: true,
					enumerable: false,
					configurable: false,
				};
			}
			return Reflect.getOwnPropertyDescriptor(dispatch, key);
		},
	});
<<<<<<< HEAD
=======
	return proxy;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
}

// #region Create dispatch map for maps

const mapStaticDispatchMap: PropertyDescriptorMap = {
	[Symbol.iterator]: {
		value(this: SharedTreeMap<MapSchema>) {
<<<<<<< HEAD
			const node = getMapNode(this);
			return node[Symbol.iterator]();
		},
	},
	entries: {
		value(this: SharedTreeMap<MapSchema>): IterableIterator<[string, unknown]> {
			const node = getMapNode(this);
=======
			const node = getEditNode(this);
			return node[Symbol.iterator]();
		},
	},
	delete: {
		value(this: SharedTreeMap<MapSchema>, key: string): void {
			const node = getEditNode(this);
			node.delete(key);
		},
	},
	entries: {
		value(this: SharedTreeMap<MapSchema>): IterableIterator<[string, unknown]> {
			const node = getEditNode(this);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			return node.entries();
		},
	},
	get: {
		value(this: SharedTreeMap<MapSchema>, key: string): unknown {
<<<<<<< HEAD
			const node = getMapNode(this);
=======
			const node = getEditNode(this);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			const field = node.getBoxed(key);
			return getProxyForField(field);
		},
	},
	has: {
		value(this: SharedTreeMap<MapSchema>, key: string): boolean {
<<<<<<< HEAD
			const node = getMapNode(this);
=======
			const node = getEditNode(this);
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			return node.has(key);
		},
	},
	keys: {
		value(this: SharedTreeMap<MapSchema>): IterableIterator<string> {
<<<<<<< HEAD
			const node = getMapNode(this);
			return node.keys();
		},
	},
	size: {
		get(this: SharedTreeMap<MapSchema>) {
			return getMapNode(this).size;
=======
			const node = getEditNode(this);
			return node.keys();
		},
	},
	set: {
		value(
			this: SharedTreeMap<MapSchema>,
			key: string,
			value: ProxyNodeUnion<AllowedTypes, "javaScript">,
		): SharedTreeMap<MapSchema> {
			const node = getEditNode(this);
			node.set(key, extractFactoryContent(value as FlexibleFieldContent<MapFieldSchema>));
			return this;
		},
	},
	size: {
		get(this: SharedTreeMap<MapSchema>) {
			return getEditNode(this).size;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		},
	},
	values: {
		value(this: SharedTreeMap<MapSchema>): IterableIterator<unknown> {
<<<<<<< HEAD
			const node = getMapNode(this);
			return node.values();
		},
	},
	// TODO: clear, delete, set. Will require mutation APIs to be added to MapNode.
=======
			const node = getEditNode(this);
			return node.values();
		},
	},
	// TODO: add `clear` once we have established merge semantics for it.
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
};

const mapPrototype = Object.create(Object.prototype, mapStaticDispatchMap);

// #endregion

<<<<<<< HEAD
const getMapNode = <TSchema extends MapSchema>(target: object): MapNode<TSchema> => {
	return getTreeNode(target) as MapNode<TSchema>;
};

function createMapProxy<TSchema extends MapSchema>(treeNode: TreeNode): SharedTreeMap<TSchema> {
	// Create a 'dispatch' object that this Proxy forwards to instead of the proxy target.
	const dispatch = Object.create(mapPrototype, {
		// Empty - JavaScript Maps do not expose any "own" properties.
	});

	setTreeNode(dispatch, treeNode);

	// TODO: Although the target is an object literal, it's still worthwhile to try experimenting with
	// a dispatch object to see if it improves performance.
	return new Proxy<SharedTreeMap<TSchema>>(new Map<string, ProxyField<TSchema["mapFields"]>>(), {
		get: (target, key, receiver): unknown => {
			return Reflect.get(dispatch, key);
		},
		getOwnPropertyDescriptor: (target, key): PropertyDescriptor | undefined => {
			return Reflect.getOwnPropertyDescriptor(dispatch, key);
		},
		has: (target, key) => {
			return Reflect.has(dispatch, key);
		},
		set: (target, key, newValue): boolean => {
			// There aren't any `set` opperations appropriate for maps.
			return false;
		},
		ownKeys: (target) => {
			// All of Map's properties are inherited via its prototype, so there is nothing to return here,
			return [];
		},
	});
=======
function createMapProxy<TSchema extends MapSchema>(): SharedTreeMap<TSchema> {
	// Create a 'dispatch' object that this Proxy forwards to instead of the proxy target.
	const dispatch: object = Object.create(mapPrototype, {
		// Empty - JavaScript Maps do not expose any "own" properties.
	});

	// TODO: Although the target is an object literal, it's still worthwhile to try experimenting with
	// a dispatch object to see if it improves performance.
	const proxy = new Proxy<SharedTreeMap<TSchema>>(
		new Map<string, ProxyField<TSchema["mapFields"], "sharedTree", "notEmpty">>(),
		{
			get: (target, key, receiver): unknown => {
				// Pass the proxy as the receiver here, so that any methods on the prototype receive `proxy` as `this`.
				return Reflect.get(dispatch, key, proxy);
			},
			getOwnPropertyDescriptor: (target, key): PropertyDescriptor | undefined => {
				return Reflect.getOwnPropertyDescriptor(dispatch, key);
			},
			has: (target, key) => {
				return Reflect.has(dispatch, key);
			},
			set: (target, key, newValue): boolean => {
				// There aren't any `set` operations appropriate for maps.
				return false;
			},
			ownKeys: (target) => {
				// All of Map's properties are inherited via its prototype, so there is nothing to return here,
				return [];
			},
		},
	);
	return proxy;
}

/**
 * Create a proxy to a {@link SharedTreeObject} that is backed by a raw object node (see {@link createRawObjectNode}).
 * @param schema - the schema of the object node
 * @param content - the content to be stored in the raw node.
 * A copy of content is stored, the input `content` is not modified and can be safely reused in another call to {@link createRawObjectProxy}.
 * @remarks
 * Because this proxy is backed by a raw node, it has the same limitations as the node created by {@link createRawObjectNode}.
 * Most if its properties and methods will error if read/called.
 */
export function createRawObjectProxy<TSchema extends ObjectNodeSchema>(
	schema: TSchema,
	content: ProxyNode<TSchema, "javaScript">,
): SharedTreeObject<TSchema> {
	// Shallow copy the content and then add the type name symbol to it.
	const contentCopy = { ...content };
	Object.defineProperty(contentCopy, typeNameSymbol, { value: schema.name });
	const proxy = createObjectProxy(schema);
	const editNode = createRawObjectNode(schema, contentCopy);
	return setEditNode(proxy, editNode);
}

/**
 * Given a content tree that is to be inserted into the shared tree, replace all subtrees that were created by factories
 * (via {@link SharedTreeObjectFactory.create}) with the content that was passed to those factories.
 * @remarks
 * This functions works recursively.
 * Factory-created objects that are nested inside of the content passed to other factory-created objects, and so on, will be in-lined.
 * This function also adds the hidden {@link typeNameSymbol} of each object schema to the output.
 * @example
 * ```ts
 * const x = foo.create({
 *   a: 3, b: bar.create({
 *     c: [baz.create({ d: 5 })]
 *   })
 * });
 * const y = extractFactoryContent(y);
 * y === {
 *   [typeNameSymbol]: "foo", a: 3, b: {
 *     [typeNameSymbol]: "bar", c: [{ [typeNameSymbol]: "baz", d: 5 }]
 *  }
 * }
 * ```
 */
export function extractFactoryContent<T extends ProxyNode<TreeNodeSchema, "javaScript">>(
	content: T,
): T {
	if (Array.isArray(content)) {
		// `content` is an array
		return content.map(extractFactoryContent) as T;
	} else if (content instanceof Map) {
		// `content` is a map
		const map = new Map();
		for (const [k, v] of content) {
			map.set(k, extractFactoryContent(v));
		}
		return map as T;
	} else if (isFluidHandle(content)) {
		return content;
	} else if (content !== null && typeof content === "object") {
		const copy: Record<string, unknown> = {};
		const editNode = tryGetEditNode(content);
		if (editNode !== undefined) {
			const factoryContent = extractRawNodeContent(editNode);
			if (factoryContent === undefined) {
				// We were passed a proxy, but that proxy doesn't have any raw content.
				throw new Error("Cannot insert a node that is already in the tree");
			}
			// `content` is a factory-created object
			const typeName =
				(factoryContent as { [typeNameSymbol]?: string })[typeNameSymbol] ??
				fail("Expected schema type name to be set on factory object content");

			// Copy the type name from the factory content to the output object.
			// This ensures that all objects from factories can be checked for their nominal type if necessary.
			Object.defineProperty(copy, typeNameSymbol, { value: typeName });
			for (const [p, v] of Object.entries(factoryContent)) {
				copy[p] = extractFactoryContent(v);
			}
		} else {
			// `content` is a plain javascript object (but may have factory-created objects within it)
			for (const [p, v] of Object.entries(content)) {
				copy[p] = extractFactoryContent(v);
			}
		}
		return copy as T;
	} else {
		// `content` is a primitive
		return content;
	}
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
}

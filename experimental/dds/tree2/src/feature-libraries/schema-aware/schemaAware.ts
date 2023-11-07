/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

<<<<<<< HEAD
import { assert } from "@fluidframework/core-utils";
import { PrimitiveValueSchema, TreeNodeSchemaIdentifier, TreeValue, ValueSchema } from "../../core";
import {
	ContextuallyTypedNodeData,
	FluidSerializableReadOnly,
	MarkedArrayLike,
	PrimitiveValue,
	isFluidHandle,
	typeNameSymbol,
	valueSymbol,
} from "../contextuallyTyped";
import { Multiplicity } from "../modular-schema";
import {
	InternalTypedSchemaTypes,
	TreeFieldSchema,
	TreeNodeSchema,
	AllowedTypes,
} from "../typed-schema";
=======
import { TreeNodeSchemaIdentifier, TreeValue, ValueSchema } from "../../core";
import { ContextuallyTypedNodeData, typeNameSymbol, valueSymbol } from "../contextuallyTyped";
import { Multiplicity } from "../modular-schema";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
import {
	InternalTypedSchemaTypes,
	TreeFieldSchema,
	TreeNodeSchema,
	AllowedTypes,
} from "../typed-schema";
import { Assume, FlattenKeys, _InlineTrick } from "../../util";
<<<<<<< HEAD
import { UntypedOptionalField, UntypedSequenceField, UntypedValueField } from "./partlyTyped";
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
import { TypedValueOrUndefined } from "./schemaAwareUtil";

/**
 * Empty Object for use in type computations that should contribute no fields when `&`ed with another type.
 * @alpha
 */
// Using {} instead of interface {} or Record<string, never> for empty object here produces better IntelliSense in the generated types than `Record<string, never>` recommended by the linter.
// Making this a type instead of an interface prevents it from showing up in IntelliSense, and also avoids breaking the typing somehow.
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/consistent-type-definitions
export type EmptyObject = {};

/**
 * @alpha
 */
export type ValuePropertyFromSchema<TSchema extends ValueSchema | undefined> =
	TSchema extends ValueSchema ? { [valueSymbol]: TreeValue<TSchema> } : EmptyObject;

/**
 * Different schema aware APIs that can be generated.
 * @alpha
 */
export const enum ApiMode {
	/**
	 * Allow all forms accepted as ContextuallyTypedNodeData that align with the schema.
	 * Types are optional.
	 *
	 * This also permits some cases which are ambiguous and thus would be rejected by `applyFieldTypesFromContext`.
	 */
	Flexible,
	/**
	 * Simplified version of Flexible.
	 *
	 * Primitive values are always unwrapped.
	 */
	Simple,
}

/**
 * Collects the various parts of the API together.
 * @alpha
 */
export type CollectOptions<
	Mode extends ApiMode,
	TTypedFields,
	TValueSchema extends ValueSchema | undefined,
	TName,
> = {
	[ApiMode.Flexible]: EmptyObject extends TTypedFields
		? TypedValueOrUndefined<TValueSchema> | FlexibleObject<TValueSchema, TName>
		: FlexibleObject<TValueSchema, TName> & TTypedFields;
<<<<<<< HEAD
	[ApiMode.Editable]: {
		[typeNameSymbol]: TName & TreeNodeSchemaIdentifier;
	} & ValuePropertyFromSchema<TValueSchema> &
		TTypedFields &
		UntypedTreeCore;
	[ApiMode.EditableUnwrapped]: [EmptyObject, TValueSchema] extends [
		TTypedFields,
		PrimitiveValueSchema,
	]
		? TypedValueOrUndefined<TValueSchema>
		: // TODO: primary field unwrapping
		  CollectOptions<ApiMode.Editable, TTypedFields, TValueSchema, TName>;
	[ApiMode.Wrapped]: {
		[typeNameSymbol]: TName;
		[valueSymbol]: TypedValueOrUndefined<TValueSchema>;
	} & TTypedFields;
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	[ApiMode.Simple]: EmptyObject extends TTypedFields
		? TypedValueOrUndefined<TValueSchema>
		: FlexibleObject<TValueSchema, TName> & TTypedFields;
}[Mode];

/**
 * The name and value part of the `Flexible` API.
 * @alpha
 */
export type FlexibleObject<TValueSchema extends ValueSchema | undefined, TName> = [
	FlattenKeys<
		{ [typeNameSymbol]?: UnbrandedName<TName> } & ValuePropertyFromSchema<TValueSchema>
	>,
][_InlineTrick];

/**
 * Remove type brand from name.
 * @alpha
 */
export type UnbrandedName<TName> = [
	TName extends infer S & TreeNodeSchemaIdentifier ? S : string,
][_InlineTrick];

/**
 * `{ [key: string]: FieldSchemaTypeInfo }` to `{ [key: string]: TypedTree }`
 *
 * In Editable mode, unwraps the fields.
 * @alpha
 */
export type TypedFields<
	Mode extends ApiMode,
	TFields extends undefined | { [key: string]: TreeFieldSchema },
> = [
	TFields extends { [key: string]: TreeFieldSchema }
		? {
<<<<<<< HEAD
				-readonly [key in keyof TFields]: TypedField<
					TFields[key],
					Mode extends ApiMode.Editable ? ApiMode.EditableUnwrapped : Mode
				>;
=======
				-readonly [key in keyof TFields]: TypedField<TFields[key], Mode>;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		  }
		: EmptyObject,
][_InlineTrick];

/**
 * `TreeFieldSchema` to `TypedField`. May unwrap to child depending on Mode and FieldKind.
 * @alpha
 */
<<<<<<< HEAD
export type TypedField<TField extends TreeFieldSchema, Mode extends ApiMode = ApiMode.Editable> = [
=======
export type TypedField<TField extends TreeFieldSchema, Mode extends ApiMode> = [
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	ApplyMultiplicity<
		TField["kind"]["multiplicity"],
		AllowedTypesToTypedTrees<Mode, TField["allowedTypes"]>,
		Mode
	>,
][_InlineTrick];

/**
 * Adjusts the API for a field based on its Multiplicity.
 * @alpha
 */
export type ApplyMultiplicity<
	TMultiplicity extends Multiplicity,
	TypedChild,
	_Mode extends ApiMode,
> = {
	[Multiplicity.Forbidden]: undefined;
<<<<<<< HEAD
	[Multiplicity.Optional]: Mode extends ApiMode.Editable
		? EditableOptionalField<TypedChild>
		: undefined | TypedChild;
	[Multiplicity.Sequence]: Mode extends ApiMode.Editable | ApiMode.EditableUnwrapped
		? EditableSequenceField<TypedChild>
		: TypedChild[];
	[Multiplicity.Single]: Mode extends ApiMode.Editable
		? EditableValueField<TypedChild>
		: TypedChild;
=======
	[Multiplicity.Optional]: undefined | TypedChild;
	[Multiplicity.Sequence]: TypedChild[];
	[Multiplicity.Single]: TypedChild;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
}[TMultiplicity];

/**
 * Takes in `AllowedTypes` and returns a TypedTree union.
 * @alpha
 */
export type AllowedTypesToTypedTrees<Mode extends ApiMode, T extends AllowedTypes> = [
	T extends InternalTypedSchemaTypes.FlexList<TreeNodeSchema>
		? InternalTypedSchemaTypes.ArrayToUnion<
				TypeArrayToTypedTreeArray<
					Mode,
					Assume<
						InternalTypedSchemaTypes.ConstantFlexListToNonLazyArray<T>,
						readonly TreeNodeSchema[]
					>
				>
		  >
		: UntypedApi<Mode>,
][_InlineTrick];

/**
 * Takes in `TreeNodeSchema[]` and returns a TypedTree union.
 * @alpha
 */
export type TypeArrayToTypedTreeArray<Mode extends ApiMode, T extends readonly TreeNodeSchema[]> = [
	T extends readonly [infer Head, ...infer Tail]
		? [
				TypedNode<Assume<Head, TreeNodeSchema>, Mode>,
				...TypeArrayToTypedTreeArray<Mode, Assume<Tail, readonly TreeNodeSchema[]>>,
		  ]
		: [],
][_InlineTrick];

// TODO: make these more accurate
/**
 * API if type is unknown or Any.
 * @alpha
 */
export type UntypedApi<Mode extends ApiMode> = {
	[ApiMode.Flexible]: ContextuallyTypedNodeData;
	[ApiMode.Simple]: ContextuallyTypedNodeData;
}[Mode];

/**
 * Generate a schema aware API for a single tree schema.
 * @alpha
 */
<<<<<<< HEAD
export type TypedNode<
	TSchema extends TreeNodeSchema,
	Mode extends ApiMode = ApiMode.Editable,
> = FlattenKeys<
	CollectOptions<
		Mode,
		TypedFields<
			Mode extends ApiMode.Editable ? ApiMode.EditableUnwrapped : Mode,
			TSchema["objectNodeFieldsObject"]
		>,
=======
export type TypedNode<TSchema extends TreeNodeSchema, Mode extends ApiMode> = FlattenKeys<
	CollectOptions<
		Mode,
		TypedFields<Mode, TSchema["objectNodeFieldsObject"]>,
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		TSchema["leafValue"],
		TSchema["name"]
	>
>;

/**
 * Generate a schema aware API for a single tree schema.
 * @alpha
 * @deprecated Use `TypedNode` instead (and reverse the type parameter order).
 */
export type NodeDataFor<Mode extends ApiMode, TSchema extends TreeNodeSchema> = TypedNode<
	TSchema,
	Mode
>;
<<<<<<< HEAD

/**
 * Check if an `UntypedTreeCore` has a specific schema, and if it does, cast it to use `ApiMode.Editable` with that schema.
 * Provided schema must be included in the schema for the tree being viewed (getting this wrong will error).
 * @alpha
 */
export function downCast<TSchema extends TreeNodeSchema>(
	schema: TSchema,
	tree: UntypedTreeCore,
): tree is TypedNode<TSchema> {
	assert(typeof tree === "object", 0x72b /* downCast only valid on wrapped nodes */);
	assert(tree !== null, 0x7d5 /* downCast only valid on wrapped nodes */);
	assert(
		!isFluidHandle(tree as unknown as FluidSerializableReadOnly),
		0x7d6 /* downCast only valid on wrapped nodes */,
	);

	const contextSchema = tree[contextSymbol].schema;
	const lookedUp = contextSchema.nodeSchema.get(schema.name);
	// TODO: for this to pass, schematized view must have the view schema, not just stored schema.
	assert(lookedUp === schema, 0x68c /* cannot downcast to a schema the tree is not using */);

	// TODO: make this actually work
	const matches = tree[typeSymbol] === schema;
	assert(
		matches === (tree[typeSymbol].name === schema.name),
		0x68d /* schema object identity comparison should match identifier comparison */,
	);
	return matches;
}
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

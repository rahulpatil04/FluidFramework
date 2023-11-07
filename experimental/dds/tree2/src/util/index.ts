/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export {
	brand,
	Brand,
	BrandedType,
	brandOpaque,
	brandedNumberType,
	brandedStringType,
	extractFromOpaque,
	ExtractFromOpaque,
	NameFromBranded,
	Opaque,
	ValueFromBranded,
} from "./brand";
export {
	deleteFromNestedMap,
	getOrAddInMap,
	getOrAddInNestedMap,
	getOrDefaultInNestedMap,
	forEachInNestedMap,
	NestedMap,
	SizedNestedMap,
	populateNestedMap,
	setInNestedMap,
	tryAddToNestedMap,
	tryGetFromNestedMap,
	encodeNestedMap,
	decodeNestedMap,
} from "./nestedMap";
export { addToNestedSet, NestedSet, nestedSetContains } from "./nestedSet";
export { OffsetList, OffsetListFactory } from "./offsetList";
export { TransactionResult } from "./transactionResult";
export {
	areSafelyAssignable,
	Contravariant,
	Covariant,
	eitherIsAny,
	EnforceTypeCheckTests,
	Invariant,
	isAny,
	isAssignableTo,
	isStrictSubset,
	MakeNominal,
	requireFalse,
	requireTrue,
	requireAssignableTo,
} from "./typeCheck";
export { StackyIterator } from "./stackyIterator";
export {
	asMutable,
	clone,
	compareSets,
	fail,
	getOrAddEmptyToMap,
	getOrCreate,
	isJsonObject,
	isReadonlyArray,
	JsonCompatible,
	JsonCompatibleObject,
	JsonCompatibleReadOnly,
	JsonCompatibleReadOnlySchema,
	makeArray,
	mapIterable,
	Mutable,
	RecursiveReadonly,
	zipIterables,
	Assume,
	assertValidIndex,
	assertValidRange,
	assertNonNegativeSafeInteger,
	generateStableId,
	useDeterministicStableId,
	useAsyncDeterministicStableId,
	objectToMap,
	oneFromSet,
	Named,
	disposeSymbol,
	IDisposable,
	capitalize,
	assertValidRangeIndices,
	transformObjectMap,
} from "./utils";
export { ReferenceCountedBase, ReferenceCounted } from "./referenceCounting";

export {
	AllowOptional,
	RequiredFields,
	OptionalFields,
	_InlineTrick,
	_RecursiveTrick,
	FlattenKeys,
	AllowOptionalNotFlattened,
	RestrictiveReadonlyRecord,
} from "./typeUtils";

export {
	BrandedKey,
	BrandedKeyContent,
	BrandedMapSubset,
	getOrCreateSlotContent,
	brandedSlot,
} from "./brandedMap";

<<<<<<< HEAD
export { getFirstFromRangeMap, RangeEntry, RangeMap, setInRangeMap } from "./rangeMap";
=======
export {
	getFirstEntryFromRangeMap,
	getFromRangeMap,
	RangeEntry,
	RangeMap,
	RangeQueryResult,
	setInRangeMap,
} from "./rangeMap";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

export {
	IdAllocator,
	idAllocatorFromMaxId,
	idAllocatorFromState,
	IdAllocationState,
	fakeIdAllocator,
} from "./idAllocator";

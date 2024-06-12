/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export {
	ITree,
	TreeView,
	TreeViewEvents,
	TreeConfiguration,
	ITreeConfigurationOptions,
	SchemaIncompatible,
} from "./tree.js";
export {
	TreeNodeSchema,
	NodeFromSchema,
	NodeKind,
	TreeNodeSchemaClass,
	TreeNodeSchemaNonClass,
	TreeNodeSchemaCore,
	ImplicitFieldSchema,
	TreeFieldFromImplicitField,
	ImplicitAllowedTypes,
	TreeNodeFromImplicitAllowedTypes,
	InsertableTreeNodeFromImplicitAllowedTypes,
	TreeLeafValue,
	type,
	WithType,
	AllowedTypes,
	FieldKind,
	FieldSchema,
	InsertableTreeFieldFromImplicitField,
	InsertableTypedNode,
	NodeBuilderData,
	DefaultProvider,
	type FieldProps,
	normalizeFieldSchema,
} from "./schemaTypes.js";
import * as InternalSimpleTreeTypes from "./internalTypes.js";
export { InternalSimpleTreeTypes };
export { SchemaFactory, type ScopedSchemaName } from "./schemaFactory.js";
export { getFlexNode } from "./proxyBinding.js";
export { treeNodeApi, TreeNodeApi, TreeChangeEvents } from "./treeNodeApi.js";
export { toFlexConfig } from "./toFlexSchema.js";
export {
	ObjectFromSchemaRecordUnsafe,
	TreeObjectNodeUnsafe,
	TreeFieldFromImplicitFieldUnsafe,
	TreeNodeFromImplicitAllowedTypesUnsafe,
	FieldSchemaUnsafe,
	InsertableTreeNodeFromImplicitAllowedTypesUnsafe,
	TreeArrayNodeUnsafe,
	TreeMapNodeUnsafe,
	InsertableObjectFromSchemaRecordUnsafe,
	InsertableTreeFieldFromImplicitFieldUnsafe,
	InsertableTypedNodeUnsafe,
	NodeBuilderDataUnsafe,
	NodeFromSchemaUnsafe,
} from "./typesUnsafe.js";
export { ValidateRecursiveSchema } from "./schemaFactoryRecursive.js";
export { getProxyForField, InsertableContent } from "./proxies.js";

export {
	adaptEnum,
	enumFromStrings,
	singletonSchema,
	typedObjectValues,
} from "./schemaCreationUtilities.js";

// Exporting the schema (RecursiveObject) to test that recursive types are working correctly.
// These are `@internal` so they can't be included in the `InternalClassTreeTypes` due to https://github.com/microsoft/rushstack/issues/3639
export {
	RecursiveObject as test_RecursiveObject,
	base as test_RecursiveObject_base,
	RecursiveObjectPojoMode as test_RecursiveObjectPojoMode,
} from "./testRecursiveDomain.js";

// TreeNode is only type exported, which prevents use of the class object for unsupported use-cases like direct sub-classing and instancof.
// See docs on TreeNode for more details.
export { type TreeNode, Unhydrated, InternalTreeNode } from "./types.js";
export { TreeArrayNode, IterableTreeArrayContent, TreeArrayNodeBase } from "./arrayNode.js";
export {
	InsertableObjectFromSchemaRecord,
	ObjectFromSchemaRecord,
	TreeObjectNode,
	setField,
} from "./objectNode.js";
export { TreeMapNode } from "./mapNode.js";

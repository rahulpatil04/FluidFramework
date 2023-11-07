/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

<<<<<<< HEAD
import { SchemaBuilder, TypedField, leaf } from "@fluid-experimental/tree2";
=======
import { ProxyField, SchemaBuilder, leaf } from "@fluid-experimental/tree2";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

const builder = new SchemaBuilder({ scope: "tree-react-api" });

export const inventory = builder.object("Contoso:Inventory-1.0.0", {
	nuts: leaf.number,
	bolts: leaf.number,
});

export const schema = builder.intoSchema(inventory);

<<<<<<< HEAD
export type Inventory = TypedField<typeof schema.rootFieldSchema>;
=======
export type Inventory = ProxyField<typeof schema.rootFieldSchema>;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

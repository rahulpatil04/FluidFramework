/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { SchemaAware, typeNameSymbol, valueSymbol, SchemaBuilder, leaf } from "../../../";

const builder = new SchemaBuilder({ scope: "Simple Schema" });

// Schema
export const pointSchema = builder.object("point", {
	x: builder.number,
	y: builder.number,
});

export const appSchemaData = builder.intoSchema(builder.sequence(pointSchema));

// Schema aware types
<<<<<<< HEAD
export type Number = SchemaAware.TypedNode<typeof leaf.number>;

export type Point = SchemaAware.TypedNode<typeof pointSchema>;
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

// Example Use

// More Schema aware APIs
{
	type FlexibleNumber = SchemaAware.TypedNode<typeof leaf.number, SchemaAware.ApiMode.Flexible>;

	type FlexiblePoint = SchemaAware.TypedNode<typeof pointSchema, SchemaAware.ApiMode.Flexible>;

	const point: FlexiblePoint = {
		x: 1,
		y: 2,
	};

	const point2: FlexiblePoint = {
		[typeNameSymbol]: pointSchema.name,
		x: 1,
		y: { [valueSymbol]: 1 },
	};
}

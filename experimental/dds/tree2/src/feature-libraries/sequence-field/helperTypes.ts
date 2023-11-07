/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

<<<<<<< HEAD
import { CellId, HasMarkFields, Detach, Insert, Mark, Transient } from "./format";
=======
import {
	CellId,
	HasMarkFields,
	Detach,
	Mark,
	CellMark,
	TransientEffect,
	MoveIn,
	MoveSource,
} from "./format";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

export type EmptyInputCellMark<TNodeChange> = Mark<TNodeChange> & DetachedCellMark;

export interface DetachedCellMark extends HasMarkFields {
	cellId: CellId;
}

<<<<<<< HEAD
export type TransientMark<TNodeChange> = Insert<TNodeChange> & Transient;

export type EmptyOutputCellMark<TNodeChange> = TransientMark<TNodeChange> | Detach<TNodeChange>;
=======
export type EmptyOutputCellMark<TNodeChange> = CellMark<Detach | TransientEffect, TNodeChange>;

export type MoveDestination = MoveIn;
export type MoveMarkEffect = MoveSource | MoveDestination;
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

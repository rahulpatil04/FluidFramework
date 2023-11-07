/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { unreachableCase } from "@fluidframework/core-utils";
import { Type } from "@sinclair/typebox";
import { JsonCompatible, JsonCompatibleReadOnly, fail } from "../../util";
import { IJsonCodec, makeCodecFamily } from "../../codec";
<<<<<<< HEAD
import { Changeset, Mark, NoopMarkType } from "./format";
=======
import { Attach, Changeset, Detach, Mark, MarkEffect, NoopMarkType } from "./format";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

export const sequenceFieldChangeCodecFactory = <TNodeChange>(childCodec: IJsonCodec<TNodeChange>) =>
	makeCodecFamily<Changeset<TNodeChange>>([[0, makeV0Codec(childCodec)]]);

function makeV0Codec<TNodeChange>(
	childCodec: IJsonCodec<TNodeChange>,
): IJsonCodec<Changeset<TNodeChange>> {
	function encodeEffect(effect: MarkEffect): JsonCompatibleReadOnly & object {
		const type = effect.type;
		switch (type) {
			case NoopMarkType:
			case "MoveIn":
			case "Insert":
			case "Delete":
			case "MoveOut":
			case "ReturnFrom":
				return { ...(effect as JsonCompatibleReadOnly & object) };
			case "Transient":
				return {
					...effect,
					attach: encodeEffect(effect.attach),
					detach: encodeEffect(effect.detach),
				};
			case "Placeholder":
				fail("Should not have placeholders in serialized changeset");
			default:
				unreachableCase(type);
		}
	}

	function decodeEffect(effect: MarkEffect): MarkEffect {
		const type = effect.type;
		switch (type) {
			case NoopMarkType:
			case "MoveIn":
			case "Insert":
			case "Delete":
			case "MoveOut":
			case "ReturnFrom":
				return { ...effect };
			case "Transient":
				return {
					...effect,
					attach: decodeEffect(effect.attach) as Attach,
					detach: decodeEffect(effect.detach) as Detach,
				};
			case "Placeholder":
				fail("Should not have placeholders in serialized changeset");
			default:
				unreachableCase(type);
		}
	}

	return {
		encode: (changeset) => {
			const jsonMarks: JsonCompatible[] = [];
			for (const mark of changeset) {
				// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
				const encodedMark = {
					...mark,
					...encodeEffect(mark),
				} as Mark<JsonCompatibleReadOnly>;
				if (mark.changes !== undefined) {
					encodedMark.changes = childCodec.encode(mark.changes);
				}
<<<<<<< HEAD
				const type = mark.type;
				switch (type) {
					case NoopMarkType:
					case "MoveIn":
					case "Insert":
					case "Delete":
					case "MoveOut":
					case "ReturnFrom":
						break;
					case "Placeholder":
						fail("Should not have placeholders in serialized changeset");
					default:
						unreachableCase(type);
				}
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
				jsonMarks.push(encodedMark as unknown as JsonCompatible);
			}
			return jsonMarks;
		},
		decode: (changeset) => {
			const marks: Changeset<TNodeChange> = [];
			const array = changeset as unknown as Changeset<JsonCompatibleReadOnly>;
			for (const mark of array) {
				const decodedMark: Mark<TNodeChange> = { count: mark.count, ...decodeEffect(mark) };
				if (mark.cellId !== undefined) {
					decodedMark.cellId = mark.cellId;
				}

				if (mark.changes !== undefined) {
					decodedMark.changes = childCodec.decode(mark.changes);
				}
<<<<<<< HEAD
				const type = mark.type;
				switch (type) {
					case NoopMarkType:
					case "MoveIn":
					case "Insert":
					case "Delete":
					case "MoveOut":
					case "ReturnFrom":
						break;
					case "Placeholder":
						fail("Should not have placeholders in serialized changeset");
					default:
						unreachableCase(type);
				}
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
				marks.push(decodedMark);
			}
			return marks;
		},
		encodedSchema: Changeset(childCodec.encodedSchema ?? Type.Any()),
	};
}

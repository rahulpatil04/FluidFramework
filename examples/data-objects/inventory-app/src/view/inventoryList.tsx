/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import * as React from "react";
<<<<<<< HEAD
import { node } from "@fluid-experimental/tree2";
=======
import { Tree } from "@fluid-experimental/tree2";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
import { Inventory } from "../schema";
import { Counter } from "./counter";

export const MainView: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
	// Use a React effect hook to invalidate this component when the inventory changes.
	// We do this by incrementing a counter, which is passed as a dependency to the effect hook.
	const [invalidations, setInvalidations] = React.useState(0);

	// React effect hook that increments the 'invalidation' counter whenever inventory or any of its children change.
	React.useEffect(() => {
		// Returns the cleanup function to be invoked when the component unmounts.
<<<<<<< HEAD
		return node.on(inventory, "subtreeChanging", () => {
=======
		return Tree.on(inventory, "subtreeChanging", () => {
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
			// TODO: RAF required because 'subtreeChanging' event fires prior to applying changes.
			//       Remove RAF when we have an "afterChange" event.
			requestAnimationFrame(() => setInvalidations((i) => i + 1));
		});
	}, [invalidations, inventory]);

	const counters: JSX.Element[] = [];

	for (const part of inventory.parts) {
		counters.push(
			<Counter
				key={part.name}
				title={part.name}
				count={part.quantity}
				onDecrement={() => part.quantity--}
				onIncrement={() => part.quantity++}
			></Counter>,
		);
	}

	return (
		<div>
			<h1>Inventory:</h1>
			{counters}
		</div>
	);
};

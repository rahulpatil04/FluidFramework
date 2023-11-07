/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { type IFluidHandle } from "@fluidframework/core-interfaces";
<<<<<<< HEAD
import { type IDeltaConnection, type IDeltaHandler } from "@fluidframework/datastore-definitions";
import { type IShimDeltaHandler } from "./types.js";
=======
import {
	type IChannelAttributes,
	type IDeltaConnection,
	type IDeltaHandler,
} from "@fluidframework/datastore-definitions";
import { type IStampedContents, type IShimDeltaHandler } from "./types.js";
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

/**
 * Represents a connection to a Shim data store that can receive and submit deltas.
 *
 * This allows the Shim class to swap out the delta handler on the fly.
 *
<<<<<<< HEAD
 * TODO: stamp the V2 ops. Either the MigrationShim needs to pass this logic to the ShimDeltaConnection, or
 * the ShimDeltaConnection needs to do it itself. We can probably put submitting and processing ops on the
 * IShimDeltaHandler interface. I'm of the opinion to iterate over this design. For now we will have one class, and
 * see what works best. Ideally, this class doesn't need to know about swapping handlers. It will need to know to stamp
 * ops as that's how this was designed. We can probably get away with just stamping the ops in the submit method.
=======
 * The PreMigrationDeltaConnection does not stamp ops so that those ops can be considered v1 ops.
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
 *
 * This special logic allows for connect to be called for the underlying new SharedObject without the need for
 * modifications on the current ChannelDeltaConnection.
 */
<<<<<<< HEAD
export class ShimDeltaConnection implements IDeltaConnection {
=======
export class PreMigrationDeltaConnection implements IDeltaConnection {
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	public constructor(
		private readonly deltaConnection: IDeltaConnection,
		private readonly shimDeltaHandler: IShimDeltaHandler,
	) {}
<<<<<<< HEAD
	private isShimDeltaHandlerAttachedToConnection = false;
=======
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

	public get connected(): boolean {
		return this.deltaConnection.connected;
	}

<<<<<<< HEAD
	// Should we be adding some metadata here?
	public submit(messageContent: unknown, localOpMetadata: unknown): void {
		// TODO: stamp messageContent with V2 metadata - this is not the final implementation
		this.deltaConnection.submit(messageContent, localOpMetadata);
=======
	private canSubmit = true;
	public disableSubmit(): void {
		this.canSubmit = false;
	}

	// This is for submitting v1 ops
	public submit(messageContent: unknown, localOpMetadata: unknown): void {
		if (this.canSubmit) {
			this.deltaConnection.submit(messageContent, localOpMetadata);
		}
		// We don't want to throw so we can revert local changes on the LegacySharedTree
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
	}

	// We only want to call attach on the underlying delta connection once, as we'll hit an assert if we call it twice.
	// Note: SharedObject.load calls attach as well as SharedObject.connect
	public attach(handler: IDeltaHandler): void {
		// There are essentially two delta handlers that process ops, the shim delta handler to process shim ops
		// preventing them from being processed by the tree delta handler, and the tree delta handler to process tree
		// ops. Post migration v1 ops can be considered "shim" ops as they are dropped.
		this.shimDeltaHandler.attachTreeDeltaHandler(handler);
<<<<<<< HEAD
		if (!this.isShimDeltaHandlerAttachedToConnection) {
			this.deltaConnection.attach(this.shimDeltaHandler);
			this.isShimDeltaHandlerAttachedToConnection = true;
=======
		if (!this.shimDeltaHandler.attached) {
			this.deltaConnection.attach(this.shimDeltaHandler);
			this.shimDeltaHandler.markAttached();
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df
		}
	}
	public dirty(): void {
		this.deltaConnection.dirty();
	}

	// This needs to be more thoroughly thought through. What happens when the source handle is changed?
	public addedGCOutboundReference?(srcHandle: IFluidHandle, outboundHandle: IFluidHandle): void {
		this.deltaConnection.addedGCOutboundReference?.(srcHandle, outboundHandle);
	}
}
<<<<<<< HEAD
=======

/**
 * A delta connection that stamps ops with a particular channel attributes so that those ops won't get dropped
 */
export class StampDeltaConnection implements IDeltaConnection {
	public constructor(
		private readonly deltaConnection: IDeltaConnection,
		private readonly shimDeltaHandler: IShimDeltaHandler,
		private readonly attributes: IChannelAttributes,
	) {}

	public get connected(): boolean {
		return this.deltaConnection.connected;
	}

	// This is for submitting v2 ops
	public submit(messageContent: IStampedContents, localOpMetadata: unknown): void {
		messageContent.fluidMigrationStamp = {
			...this.attributes,
		};
		this.deltaConnection.submit(messageContent, localOpMetadata);
	}

	/**
	 * For the MigrationShim because we only attach once to the actual delta connection, we store state in the
	 * migrationDeltaHandler to know if we've already attached. We will call attach once on the
	 * PreMigrationDeltaConnection and once on the StampDeltaConnection.
	 *
	 * The SharedTreeShim should not be swapping delta connections and thus the if statement should always be executed.
	 *
	 * @param handler - this delta handler can only connect once.
	 */
	public attach(handler: IDeltaHandler): void {
		// Maybe put an assert here to only call attach once?
		this.shimDeltaHandler.attachTreeDeltaHandler(handler);
		if (!this.shimDeltaHandler.attached) {
			this.deltaConnection.attach(this.shimDeltaHandler);
			this.shimDeltaHandler.markAttached();
		}
	}

	public dirty(): void {
		this.deltaConnection.dirty();
	}

	// This needs to be more thoroughly thought through. What happens when the source handle is changed?
	public addedGCOutboundReference?(srcHandle: IFluidHandle, outboundHandle: IFluidHandle): void {
		this.deltaConnection.addedGCOutboundReference?.(srcHandle, outboundHandle);
	}
}
>>>>>>> 0bf5c00ade67744f59337227c17c5aa11c19c2df

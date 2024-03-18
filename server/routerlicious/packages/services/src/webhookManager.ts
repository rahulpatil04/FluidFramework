/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { IWebhookManager } from "@fluidframework/server-services-core";
import axios, { default as Axios } from "axios";

/**
 * Manages Webhooks and associated events
 */
export class WebhookManager implements IWebhookManager {
	// Map of webhook event names to URL's (webhooks)
	private readonly eventSubscriptions: Map<string, Set<string>>;
	private readonly internalHistorianUrl: string;

	constructor(historianUrl: string) {
		this.eventSubscriptions = new Map();
		this.internalHistorianUrl = historianUrl;
	}

	public getSubscriptions(eventName: string): Set<string> {
		return this.eventSubscriptions.get(eventName) ?? new Set();
	}

	public getAllSubscriptions() {
		return this.eventSubscriptions;
	}

	public subscribe(url: string, event: string) {
		let urlSubscriptions = this.eventSubscriptions.get(event);
		if (urlSubscriptions === undefined) {
			this.eventSubscriptions.set(event, new Set());
			urlSubscriptions = this.eventSubscriptions.get(event);
		}
		urlSubscriptions.add(url);
	}

	public unsubscribe(url: string, event: string) {
		let urlSubscriptions = this.eventSubscriptions.get(event);
		if (urlSubscriptions === undefined) {
			this.eventSubscriptions.set(event, new Set());
			urlSubscriptions = this.eventSubscriptions.get(event);
		}
		urlSubscriptions.delete(url);
	}

	public async handleEvent(event: string, payload: object) {
		const urlSubscriptions = this.eventSubscriptions.get(event) ?? new Set();
		for (const url of urlSubscriptions) {
			const response = await axios.post(url, payload);
			if (response.status !== 200) {
				console.warn(
					`Did not receieve successful response from Client url: ${url} for event: ${event}`,
				);
			} else {
				console.log(
					`Successfully sent event payload response from Client url: ${url} for event: ${event}`,
				);
			}
		}
	}

	public async getLatestSummary(tenantId: string): Promise<string> {
		const requestUrl = `${this.internalHistorianUrl}/repos/${tenantId}/git/summaries/latest?disableCache=true`;

		try {
			const response = await Axios.get(requestUrl);
			const messages = response.data.blobs
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				.filter((e) => e.content.includes("blobs") && e.content.includes("content"))
				.map((e) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return e.content;
				});

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return messages;
		} catch (error: unknown) {
			console.log(`Error fetching latest summary.`);
		}
	}
}

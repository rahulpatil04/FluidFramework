/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";
import { Lumberjack } from "@fluidframework/server-services-telemetry";
import { IContextErrorData } from "@fluidframework/server-services-core";
import type * as kafkaTypes from "astan-node-rdkafka";
import { DefaultAzureCredential } from "@azure/identity";
import { tryImportNodeRdkafka } from "./tryImport";

export interface IKafkaBaseOptions {
	numberOfPartitions: number;
	replicationFactor: number;
	disableTopicCreation?: boolean;
	sslCACertFilePath?: string;
	restartOnKafkaErrorCodes?: number[];
	eventHubConnString?: string; // deprecated in favor of eventHubsConfig
	eventHubsConfig?: object;
}

export interface IKafkaEndpoints {
	kafka: string[];
	zooKeeper?: string[];
}

interface IEventHubsConfig {
	azureClientId: string;
	audience: string;
	azureCredential?: DefaultAzureCredential;
}

export abstract class RdkafkaBase extends EventEmitter {
	protected readonly kafka: typeof kafkaTypes;
	protected readonly sslOptions?: kafkaTypes.ConsumerGlobalConfig;
	protected defaultRestartOnKafkaErrorCodes: number[] = [];
	private readonly options: IKafkaBaseOptions;
	private readonly eventHubsConfig?: IEventHubsConfig;

	constructor(
		protected readonly endpoints: IKafkaEndpoints,
		public readonly clientId: string,
		public readonly topic: string,
		options?: Partial<IKafkaBaseOptions>,
	) {
		super();

		const kafka = tryImportNodeRdkafka();
		if (!kafka) {
			throw new Error("Invalid node-rdkafka package");
		}

		this.kafka = kafka;
		this.options = {
			...options,
			numberOfPartitions: options?.numberOfPartitions ?? 32,
			replicationFactor: options?.replicationFactor ?? 3,
		};

		// In RdKafka, we can check what features are enabled using kafka.features. If "ssl" is listed,
		// it means RdKafka has been built with support for SSL.
		// To build node-rdkafka with SSL support, make sure OpenSSL libraries are available in the
		// environment node-rdkafka would be running. Once OpenSSL is available, building node-rdkafka
		// as usual will automatically include SSL support.
		const rdKafkaHasSSLEnabled = kafka.features.filter((feature) =>
			feature.toLowerCase().includes("ssl"),
		);

		if (options?.sslCACertFilePath) {
			// If the use of SSL is desired, but rdkafka has not been built with SSL support,
			// throw an error making that clear to the user.
			if (!rdKafkaHasSSLEnabled) {
				throw new Error(
					"Attempted to configure SSL, but rdkafka has not been built to support it. " +
						"Please make sure OpenSSL is available and build rdkafka again.",
				);
			}

			this.sslOptions = {
				"security.protocol": "ssl",
				"ssl.ca.location": options?.sslCACertFilePath,
			};
		} else if (options?.eventHubsConfig) {
			if (!kafka.features.filter((feature) => feature.toLowerCase().includes("sasl_ssl"))) {
				throw new Error(
					"Attempted to configure SASL_SSL for Event Hubs, but rdkafka has not been built to support it. " +
						"Please make sure OpenSSL is available and build rdkafka again.",
				);
			}

			if (!RdkafkaBase.isIEventHubsConfig(options?.eventHubsConfig)) {
				throw new Error("eventHubsConfig is malformed");
			}

			this.eventHubsConfig = options.eventHubsConfig;
			this.eventHubsConfig.azureCredential = new DefaultAzureCredential({
				managedIdentityClientId: this.eventHubsConfig.azureClientId,
			});
			this.sslOptions = {
				"security.protocol": "sasl_ssl",
				"sasl.mechanisms": "OAUTHBEARER",
			};
		} else if (options?.eventHubConnString) {
			if (!kafka.features.filter((feature) => feature.toLowerCase().includes("sasl_ssl"))) {
				throw new Error(
					"Attempted to configure SASL_SSL for Event Hubs, but rdkafka has not been built to support it. " +
						"Please make sure OpenSSL is available and build rdkafka again.",
				);
			}

			this.sslOptions = {
				"security.protocol": "sasl_ssl",
				"sasl.mechanisms": "PLAIN",
				"sasl.username": "$ConnectionString",
				"sasl.password": options?.eventHubConnString,
			};
		}

		setTimeout(() => void this.initialize(), 1);
	}

	protected abstract connect(): void;

	protected async getAzureIdentityToken(cb: (token: string) => void) {
		if (!this.eventHubsConfig) {
			throw new Error(
				"getAzureIdentityToken() was invoked without setting managed identity config",
			);
		}

		const tokenHolder = await this.eventHubsConfig.azureCredential?.getToken(
			this.eventHubsConfig.audience,
		);

		if (!tokenHolder) {
			throw new Error("getAzureIdentityToken() could not fetch azure token");
		}

		const now = new Date().getTime();

		setTimeout(
			() => {
				this.getAzureIdentityToken(cb)
					.then((token) => cb(token))
					.catch((err) => {});
			},
			tokenHolder.expiresOnTimestamp - now - 120_000,
		);

		Lumberjack.warning(
			`OAUTHBEARER AZURE TOKEN: new token will expire at ${
				tokenHolder.expiresOnTimestamp
			}, refresh in ${tokenHolder.expiresOnTimestamp - now - 120_000}`,
		);

		return tokenHolder.token;
	}

	private async initialize() {
		try {
			if (!this.options.disableTopicCreation) {
				await this.ensureTopics();
			}

			this.connect();
		} catch (ex) {
			this.error(ex);

			this.initialize().catch((error) => {
				Lumberjack.error("Error initializing rdkafka", undefined, error);
			});

			return;
		}
	}

	protected async ensureTopics() {
		if (!this.eventHubsConfig) {
			throw new Error("ensureTopics() was invoked without setting managed identity config");
		}

		if (!this.eventHubsConfig.azureCredential) {
			throw new Error(
				"ensureTopics() was invoked without setting managed identity config. No azureCredential",
			);
		}

		const th = await this.eventHubsConfig.azureCredential.getToken(
			this.eventHubsConfig.audience,
		);

		const options: kafkaTypes.GlobalConfig = {
			"client.id": `${this.clientId}-admin`,
			"metadata.broker.list": this.endpoints.kafka.join(","),
			...this.sslOptions,
		};

		const adminClient = this.kafka.AdminClient.create(options, th.token);

		const newTopic: kafkaTypes.NewTopic = {
			topic: this.topic,
			num_partitions: this.options.numberOfPartitions,
			replication_factor: this.options.replicationFactor,
		};

		return new Promise<void>((resolve, reject) => {
			adminClient.createTopic(newTopic, 10000, (err) => {
				adminClient.disconnect();

				if (err && err.code !== this.kafka.CODES.ERRORS.ERR_TOPIC_ALREADY_EXISTS) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	protected error(error: any, errorData: IContextErrorData = { restart: false }) {
		const errorCodesToCauseRestart =
			this.options.restartOnKafkaErrorCodes ?? this.defaultRestartOnKafkaErrorCodes;

		if (
			RdkafkaBase.isObject(error) &&
			errorCodesToCauseRestart.includes((error as kafkaTypes.LibrdKafkaError).code)
		) {
			errorData.restart = true;
		}

		this.emit("error", error, errorData);
	}

	protected static isObject(value: any): value is object {
		return value !== null && typeof value === "object";
	}

	private static isIEventHubsConfig(value: any): value is IEventHubsConfig {
		return (
			value !== null &&
			typeof value.azureClientId === "string" &&
			typeof value.audience === "string"
		);
	}
}

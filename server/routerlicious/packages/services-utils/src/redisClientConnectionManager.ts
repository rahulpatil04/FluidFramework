/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import * as Redis from "ioredis";
import { Lumberjack } from "@fluidframework/server-services-telemetry";
import { getRedisClusterRetryStrategy } from "./redisUtils";

export class RedisClusterWrapper extends Redis.Cluster {
	constructor(startupNodes: Redis.ClusterNode[], options?: Redis.ClusterOptions) {
		super(startupNodes, options);
	}

	private async execWrappedMethod(
		commandName: string,
		func: Function, // eslint-disable-line @typescript-eslint/ban-types
		...args: any[]
	): Promise<any> {
		try {
			if (commandName === "get" || commandName === "publish") {
				Lumberjack.info(
					`Doing redis command: ${commandName} with args: ${JSON.stringify(args)}`,
				);
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return func(...args);
		} catch (err: any) {
			Lumberjack.error(`Error in command: ${commandName}: ${err}`);
			const clusteringErrMessage = err.message ?? "";
			if (
				clusteringErrMessage.includes("Too many Cluster redirections") ||
				clusteringErrMessage.includes("MOVED") ||
				clusteringErrMessage.includes("Failed to refresh slots cache")
			) {
				Lumberjack.info(`Redis client is reconnecting due to a MOVED error: ${err}`);
				this.disconnect(true);
			} else {
				throw err;
			}
		}
	}

	async get(key: Redis.RedisKey, callback?: Redis.Callback<string>): Promise<string> {
		return this.execWrappedMethod(
			"get",
			super.get.bind(this),
			key,
			...(callback ? [callback] : []),
		) as unknown as string;
	}

	async set(
		key: Redis.RedisKey,
		value: string | number | Buffer,
		...overloadedArgs: any[]
	): Promise<"OK"> {
		return this.execWrappedMethod(
			"set",
			super.set.bind(this),
			key,
			value,
			overloadedArgs,
		) as unknown as "OK";
	}

	async del(
		...args:
			| [...keys: Redis.RedisKey[], callback: Redis.Callback<number>]
			| [keys: Redis.RedisKey[], callback: Redis.Callback<number>]
			| [...keys: Redis.RedisKey[]]
			| [keys: Redis.RedisKey[]]
	): Promise<number> {
		return this.execWrappedMethod("del", super.del.bind(this), args) as unknown as number;
	}

	async lpush(
		...args:
			| [
					key: Redis.RedisKey,
					...elements: (string | Buffer | number)[],
					callback: Redis.Callback<number>,
			  ]
			| [key: Redis.RedisKey, ...elements: (string | Buffer | number)[]]
	): Promise<number> {
		return this.execWrappedMethod("lpush", super.lpush.bind(this), args) as unknown as number;
	}

	async rpop(key: Redis.RedisKey, callback?: Redis.Callback<string>): Promise<string>;
	async rpop(
		key: Redis.RedisKey,
		count: string | number,
		callback?: Redis.Callback<string[]>,
	): Promise<string[]>;
	async rpop(...args: any[]): Promise<any> {
		return this.execWrappedMethod("rpop", super.rpop.bind(this), ...args) as unknown as
			| string
			| string[];
	}

	async hset(
		key: Redis.RedisKey,
		mapOrObject: object | Map<string | Buffer | number, string | Buffer | number>,
		callback?: Redis.Callback<number>,
	): Promise<number>;
	async hset(
		...args: [
			key: Redis.RedisKey,
			...fieldValues: (string | Buffer | number)[],
			callback: Redis.Callback<number>,
		]
	): Promise<number>;
	async hset(
		...args: [key: Redis.RedisKey, ...fieldValues: (string | Buffer | number)[]]
	): Promise<number>;
	async hset(...args: any[]): Promise<number> {
		return this.execWrappedMethod("hset", super.hset.bind(this), args) as unknown as number;
	}

	async hget(
		key: Redis.RedisKey,
		field: string | Buffer,
		callback?: Redis.Callback<string | null>,
	): Promise<string | null> {
		return this.execWrappedMethod(
			"hget",
			super.hget.bind(this),
			key,
			field,
			...(callback ? [callback] : []),
		) as unknown as string | null;
	}

	async hdel(
		...args:
			| [
					key: Redis.RedisKey,
					...fields: (string | Buffer)[],
					callback: Redis.Callback<number>,
			  ]
			| [key: Redis.RedisKey, ...fields: (string | Buffer)[]]
	): Promise<number> {
		return this.execWrappedMethod("hdel", super.hdel.bind(this), args) as unknown as number;
	}

	async hstrlen(
		key: Redis.RedisKey,
		field: string | Buffer,
		callback?: Redis.Callback<number>,
	): Promise<number> {
		return this.execWrappedMethod(
			"hstrlen",
			super.hstrlen.bind(this),
			key,
			field,
			...(callback ? [callback] : []),
		) as unknown as number;
	}

	async hgetall(
		key: Redis.RedisKey,
		callback?: Redis.Callback<Record<string, string>>,
	): Promise<Record<string, string>> {
		return this.execWrappedMethod(
			"hgetall",
			super.hgetall.bind(this),
			key,
			...(callback ? [callback] : []),
		) as unknown as Record<string, string>;
	}

	async strlen(key: Redis.RedisKey, callback?: Redis.Callback<number>): Promise<number> {
		return this.execWrappedMethod(
			"strlen",
			super.strlen.bind(this),
			key,
			...(callback ? [callback] : []),
		) as unknown as number;
	}

	async unlink(
		...args:
			| [...keys: Redis.RedisKey[], callback: Redis.Callback<number>]
			| [keys: Redis.RedisKey[], callback: Redis.Callback<number>]
			| [...keys: Redis.RedisKey[]]
			| [keys: Redis.RedisKey[]]
	): Promise<number> {
		return this.execWrappedMethod("unlink", super.unlink.bind(this), args) as unknown as number;
	}

	async keys(pattern: string, callback?: Redis.Callback<string[]>): Promise<string[]> {
		return this.execWrappedMethod(
			"keys",
			super.keys.bind(this),
			pattern,
			...(callback ? [callback] : []),
		) as unknown as string[];
	}

	async exists(
		...args:
			| [...keys: Redis.RedisKey[], callback: Redis.Callback<number>]
			| [keys: Redis.RedisKey[], callback: Redis.Callback<number>]
			| [...keys: Redis.RedisKey[]]
			| [keys: Redis.RedisKey[]]
	): Promise<number> {
		return this.execWrappedMethod("exists", super.exists.bind(this), args) as unknown as number;
	}

	async expire(
		key: Redis.RedisKey,
		seconds: number | string,
		callback?: Redis.Callback<number>,
	): Promise<number>;
	async expire(
		key: Redis.RedisKey,
		seconds: number | string,
		nx: "NX",
		callback?: Redis.Callback<number>,
	): Promise<number>;
	async expire(
		key: Redis.RedisKey,
		seconds: number | string,
		xx: "XX",
		callback?: Redis.Callback<number>,
	): Promise<number>;
	async expire(
		key: Redis.RedisKey,
		seconds: number | string,
		gt: "GT",
		callback?: Redis.Callback<number>,
	): Promise<number>;
	async expire(
		key: Redis.RedisKey,
		seconds: number | string,
		lt: "LT",
		callback?: Redis.Callback<number>,
	): Promise<number>;
	async expire(...args: any[]): Promise<number> {
		return this.execWrappedMethod("expire", super.expire.bind(this), args) as unknown as number;
	}

	async incr(key: Redis.RedisKey, callback?: Redis.Callback<number>): Promise<number> {
		return this.execWrappedMethod(
			"incr",
			super.incr.bind(this),
			key,
			...(callback ? [callback] : []),
		) as unknown as number;
	}

	async decr(key: Redis.RedisKey, callback?: Redis.Callback<number>): Promise<number> {
		return this.execWrappedMethod(
			"decr",
			super.decr.bind(this),
			key,
			...(callback ? [callback] : []),
		) as unknown as number;
	}

	async publish(
		channel: string | Buffer,
		message: string | Buffer,
		callback?: Redis.Callback<number>,
	): Promise<number> {
		return this.execWrappedMethod(
			"publish",
			super.publish.bind(this),
			channel,
			message,
			...(callback ? [callback] : []),
		) as unknown as number;
	}

	async subscribe(
		...args:
			| [...channels: (string | Buffer)[], callback: Redis.Callback<unknown>]
			| [...channels: (string | Buffer)[]]
	): Promise<unknown> {
		return this.execWrappedMethod("subscribe", super.subscribe.bind(this), args) as unknown;
	}

	async unsubscribe(callback?: Redis.Callback<unknown>): Promise<unknown>;
	async unsubscribe(
		...args: [...channels: (string | Buffer)[], callback: Redis.Callback<unknown>]
	): Promise<unknown>;
	async unsubscribe(...args: [...channels: (string | Buffer)[]]): Promise<unknown>;
	async unsubscribe(...args: any[]): Promise<unknown> {
		return this.execWrappedMethod("unsubscribe", super.unsubscribe.bind(this), args) as unknown;
	}
}

/**
 * Represents an interface for managing creation,
 * and authentication with a Redis client.
 */
export interface IRedisClientConnectionManager {
	/**
	 * @returns The Redis client.
	 */
	getRedisClient(): Redis.default | RedisClusterWrapper;

	/**
	 * Adds an error handler to the Redis client, which will print telemetry when an error is encountered.
	 *
	 * @param lumberProperties - Lumber properties to be added to the telemetry.
	 * @param errorMessage - The error message to be printed when an error is encountered.
	 * @param additionalLoggingFunctionality - A lambda function that adds additional error handling and/or logging behavior.
	 * If this lambda returns true it will completely override the existing error handling/logging, otherwise it will do both.
	 */
	addErrorHandler(
		lumberProperties?: Record<string, any>,
		errorMessage?: string,
		additionalLoggingFunctionality?: (error: Error) => boolean,
	): void;
}

export class RedisClientConnectionManager implements IRedisClientConnectionManager {
	private client: Redis.default | RedisClusterWrapper | undefined;
	private readonly redisOptions: Partial<Redis.RedisOptions & Redis.ClusterOptions>;
	private readonly enableClustering: boolean;
	private readonly slotsRefreshTimeout: number;
	private readonly retryDelays: {
		retryDelayOnFailover: number;
		retryDelayOnClusterDown: number;
		retryDelayOnTryAgain: number;
		retryDelayOnMoved: number;
		maxRedirections?: number;
	};

	constructor(
		redisOptions?: Partial<Redis.RedisOptions & Redis.ClusterOptions>,
		redisConfig?: any,
		enableClustering: boolean = false,
		slotsRefreshTimeout: number = 50000,
		retryDelays: {
			retryDelayOnFailover: number;
			retryDelayOnClusterDown: number;
			retryDelayOnTryAgain: number;
			retryDelayOnMoved: number;
			maxRedirections?: number;
		} = {
			retryDelayOnFailover: 100,
			retryDelayOnClusterDown: 100,
			retryDelayOnTryAgain: 100,
			retryDelayOnMoved: 100,
			maxRedirections: 16,
		},
	) {
		this.enableClustering = enableClustering;
		this.slotsRefreshTimeout = slotsRefreshTimeout;
		this.retryDelays = retryDelays;
		if (!redisOptions && !redisConfig) {
			Lumberjack.error("Either redisOptions or redisConfig must be provided");
			throw new Error("Either redisOptions or redisConfig must be provided");
		} else if (!redisOptions && redisConfig) {
			Lumberjack.info("Using default redisOptions after reading from config");
			this.redisOptions = {
				host: redisConfig.host,
				port: redisConfig.port,
				password: redisConfig.pass,
				connectTimeout: redisConfig.connectTimeout,
				enableReadyCheck: true,
				maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
				enableOfflineQueue: redisConfig.enableOfflineQueue,
				retryStrategy: getRedisClusterRetryStrategy(redisConfig.retryStrategyParams),
			};
			if (redisConfig.enableAutoPipelining) {
				/**
				 * When enabled, all commands issued during an event loop iteration are automatically wrapped in a
				 * pipeline and sent to the server at the same time. This can improve performance by 30-50%.
				 * More info: https://github.com/luin/ioredis#autopipelining
				 */
				this.redisOptions.enableAutoPipelining = true;
				this.redisOptions.autoPipeliningIgnoredCommands = ["ping"];
			}
			if (redisConfig.tls) {
				this.redisOptions.tls = {
					servername: redisConfig.host,
				};
			}
		} else {
			Lumberjack.info("Using the provided redisOptions");
			// Adding this check here to avoid linting errors
			// If control-flow lands here, redisOptions will be defined
			if (!redisOptions) {
				Lumberjack.error("redisOptions must be provided");
				throw new Error("redisOptions must be provided");
			}
			this.redisOptions = redisOptions;
		}

		if (!this.redisOptions.retryStrategy) {
			this.redisOptions.retryStrategy = getRedisClusterRetryStrategy({
				delayPerAttemptMs: 50,
				maxDelayMs: 2000,
			});
		}
		this.authenticateAndCreateRedisClient();
	}

	private authenticateAndCreateRedisClient(): void {
		if (this.enableClustering) {
			this.redisOptions.clusterRetryStrategy = this.redisOptions.retryStrategy;
		}

		const redisClusteringOptions: Partial<Redis.ClusterOptions> = {
			redisOptions: this.redisOptions,
			slotsRefreshTimeout: this.slotsRefreshTimeout,
			dnsLookup: (adr, callback) => callback(null, adr),
			showFriendlyErrorStack: true,
			retryDelayOnFailover: this.retryDelays.retryDelayOnFailover,
			retryDelayOnClusterDown: this.retryDelays.retryDelayOnClusterDown,
			retryDelayOnTryAgain: this.retryDelays.retryDelayOnTryAgain,
			retryDelayOnMoved: this.retryDelays.retryDelayOnMoved,
			maxRedirections: this.retryDelays.maxRedirections,
		};

		// Remove password from the options objects that will be logged
		const loggableRedisOptions = { ...this.redisOptions };
		loggableRedisOptions.password = undefined;

		const loggableClusteringOptions = { ...redisClusteringOptions };
		loggableClusteringOptions.redisOptions = loggableRedisOptions;

		const stringifiedOptions = this.enableClustering
			? JSON.stringify(loggableClusteringOptions)
			: JSON.stringify(loggableRedisOptions);

		this.client = this.enableClustering
			? new RedisClusterWrapper(
					[{ port: this.redisOptions.port, host: this.redisOptions.host }],
					redisClusteringOptions,
			  )
			: new Redis.default(this.redisOptions);
		Lumberjack.info("Redis client created", {
			["constructorOptions"]: stringifiedOptions,
			["clusteringEnabled"]: this.enableClustering,
		});
	}

	public getRedisClient(): Redis.default | RedisClusterWrapper {
		if (!this.client) {
			throw new Error("Redis client not initialized");
		}
		return this.client;
	}

	private redactArg(arg: string, ind: number, commandName: string): string {
		// For some commands argument 0 is the key, meaning we can safely log it
		const safeCommands: string[] = ["get", "set", "del", "hget", "hset", "hdel"];
		if (ind === 0 && safeCommands.includes(commandName?.toLowerCase() ?? "")) {
			return arg;
		}

		return arg.length.toString();
	}

	public addErrorHandler(
		lumberProperties: Record<string, any> = {},
		errorMessage: string = "Error with Redis",
		additionalLoggingFunctionality?: (error: Error) => boolean,
	): void {
		if (!this.client) {
			throw new Error("Redis client not initialized");
		}

		this.client.on("error", (error) => {
			if (additionalLoggingFunctionality && additionalLoggingFunctionality(error)) {
				// If the additionalLoggingFunctionality returns true, it means it has completely handled the error
				return;
			}

			const commandName: string | undefined =
				error.command?.name ?? error.lastNodeError?.command?.name;
			const args: string[] = error.command?.args ?? error.lastNodeError?.command?.args ?? [];

			if (error.previousErrors) {
				// Internally redact the previous errors of an exec command
				lumberProperties.previousErrors = [];
				error.previousErrors?.forEach((prevError) => {
					if (prevError.command) {
						const prevCommandName: string | undefined = prevError.command.name;
						const prevArgs: string[] = prevError.command.args;
						const prevArgsRedacted: string[] = prevArgs.map((arg, ind) =>
							this.redactArg(arg, ind, prevCommandName ?? ""),
						);
						const prevErrorCopy = { ...prevError };
						prevErrorCopy.command.args = prevArgsRedacted;
						lumberProperties.previousErrors.push(prevErrorCopy);
					}
				});
			}
			const argSizes: string[] = args.map((arg, ind) =>
				this.redactArg(arg, ind, commandName ?? ""),
			);

			// Set additional logging info in lumberProperties
			lumberProperties.commandName = commandName;
			lumberProperties.commandArgSizes = argSizes;

			Lumberjack.error(errorMessage, lumberProperties, error);
		});
	}
}

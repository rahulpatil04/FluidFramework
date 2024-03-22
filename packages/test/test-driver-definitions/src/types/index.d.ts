/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { ITelemetryBufferedLogger } from "../interfaces.js";

declare global {
	/**
	 * This function may be provided by the environment, like a mocha test hook or dynamic import
	 */
	const getTestLogger: (() => ITelemetryBufferedLogger) | undefined;
}

export {}


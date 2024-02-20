/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

const JSON5 = require("json5");
const path = require("path");
const fs = require("fs");

// Assume current working directory is the package root.
const packageRoot = process.cwd();

const workspaceRoot = (() => {
  	let relativePath = "../".repeat(packageRoot.split(path.sep).length - 3);
  	return relativePath.slice(0, relativePath.length - 1);
})();

const packagePath = path.join(packageRoot, "package.json");
const package = JSON5.parse(fs.readFileSync(packagePath, "utf8"));

package.type = "module";
const shortName = package.name.split("/")[1];
package.exports = {
	".": {
		"import": {
			"types": "./lib/index.d.ts",
			"default": "./lib/index.js"
		},
		"require": {
			"types": "./dist/index.d.ts",
			"default": "./dist/index.js"
		}
	},
	"./beta": {
		"import": {
			"types": `./lib/${shortName}-beta.d.ts`,
			"default": "./lib/index.js"
		},
		"require": {
			"types": `./dist/${shortName}-beta.d.ts`,
			"default": "./dist/index.js"
		}
	},
	"./alpha": {
		"import": {
			"types": `./lib/${shortName}-alpha.d.ts`,
			"default": "./lib/index.js"
		},
		"require": {
			"types": `./dist/${shortName}-alpha.d.ts`,
			"default": "./dist/index.js"
		}
	},
	"./internal": {
		"import": {
			"types": "./lib/index.d.ts",
			"default": "./lib/index.js"
		},
		"require": {
			"types": "./dist/index.d.ts",
			"default": "./dist/index.js"
		}
	},
	"./public": {
		"import": {
			"types": `./lib/${shortName}-public.d.ts`,
			"default": "./lib/index.js"
		},
		"require": {
			"types": `./dist/${shortName}-public.d.ts`,
			"default": "./dist/index.js"
		}
	},
};
delete package.module;
package.scripts["api-extractor:commonjs"] = "api-extractor run --config ./api-extractor-cjs.json";
package.scripts["api-extractor:esnext"] = "api-extractor run --local";
package.scripts["check:are-the-types-wrong"] = "attw --pack . --entrypoints .";
package.scripts["build:esnext"] = "tsc --project ./tsconfig.json";

if (package.scripts["build:test"]) {
	package.scripts["build:test"] = "tsc --project ./src/test/tsconfig.json && tsc --project ./src/test/tsconfig.cjs.json";
}

if (package.scripts["test:mocha"]) {
	package.scripts["test:mocha"] = "npm run test:mocha:cjs && npm run test:mocha:esm";
	package.scripts["test:mocha:cjs"] = "mocha  --recursive \"dist/test/*.spec.*js\" --exit --project src/test/tsconfig.cjs.json -r node_modules/@fluidframework/mocha-test-setup";
	package.scripts["test:mocha:esm"] = "mocha  --recursive \"lib/test/*.spec.*js\" --exit --project src/test/tsconfig.json -r node_modules/@fluidframework/mocha-test-setup";
}

package.scripts["tsc"] = `tsc-multi --config ${workspaceRoot}/common/build/build-common/tsc-multi.node16.cjs.json && copyfiles -f ${workspaceRoot}/common/build/build-common/src/cjs/package.json ./dist`;
package.devDependencies["tsc-multi"] = "^1.1.0";
package.devDependencies["@arethetypeswrong/cli"] = "^0.13.3";
package.devDependencies["copyfiles"] = "^2.4.1";

fs.writeFileSync(packagePath, JSON.stringify(package, null, 4));

const apiExtractorEsmPath = path.join(packageRoot, "api-extractor.json");
if (fs.existsSync(apiExtractorEsmPath)) {
	const apiExtractorEsm = `{
		"$schema": "https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json",
		"extends": "${workspaceRoot}/common/build/build-common/api-extractor-base.esm.primary.json"
	}
	`;
	fs.writeFileSync(apiExtractorEsmPath, apiExtractorEsm);

	const apiExtractorCjsPath = path.join(packageRoot, "api-extractor-cjs.json");
	const apiExtractorCjs = `{
		"$schema": "https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json",
		"extends": "${workspaceRoot}/common/build/build-common/api-extractor-base.cjs.primary.json",
		// CJS is actually secondary; so, no report.
		"apiReport": {
			"enabled": false
		}
	}`;
	fs.writeFileSync(apiExtractorCjsPath, apiExtractorCjs);
}

const tsconfigPath = path.join(packageRoot, "tsconfig.json");
const tsconfig = JSON5.parse(fs.readFileSync(tsconfigPath, "utf8"));
tsconfig.extends = `${workspaceRoot}/common/build/build-common/tsconfig.node16.json`;
const compilerOptions = tsconfig.compilerOptions;

if (compilerOptions.composite === true) { delete compilerOptions.composite }
if (compilerOptions.declaration === true) { delete compilerOptions.declaration }
if (compilerOptions.declarationMap === true) { delete compilerOptions.declarationMap }
if (compilerOptions.esModuleInterop === true) { delete compilerOptions.esModuleInterop }
if (compilerOptions.incremental === true) { delete compilerOptions.incremental }
if (compilerOptions.inlineSources === true) { delete compilerOptions.inlineSources }
if (compilerOptions.jsx === "react") { delete compilerOptions.jsx }
if (compilerOptions.noImplicitAny === false) { delete compilerOptions.noImplicitAny }
if (compilerOptions.noUnusedLocals === true) { delete compilerOptions.noUnusedLocals }
if (compilerOptions.pretty === true) { delete compilerOptions.pretty }
if (compilerOptions.sourceMap === true) { delete compilerOptions.sourceMap }
if (compilerOptions.strict === true) { delete compilerOptions.strict }
if (compilerOptions.target === "ES2020") { delete compilerOptions.target }
if (compilerOptions.types?.length === 0) { delete compilerOptions.types }
compilerOptions.outDir = "./lib";

delete compilerOptions.module;
delete compilerOptions.moduleResolution;
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 4));

const tsconfigCjsPath = path.join(packageRoot, "tsconfig.cjs.json");
const tsconfigCjs = `{
	// This config must be used in a "type": "commonjs" environment. (Use tsc-mult.)
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"outDir": "./dist",
	},
}
`;
fs.writeFileSync(tsconfigCjsPath, tsconfigCjs);

const testTsconfigPath = path.join(packageRoot, "src/test/tsconfig.json");
if (fs.existsSync(testTsconfigPath)) {
	const testTsconfig = `{
		"extends": "${workspaceRoot}/../../common/build/build-common/tsconfig.test.node16.json",
		"compilerOptions": {
			"rootDir": "./",
			"outDir": "../../lib/test",
			"types": ["mocha", "node"],
		},
		"include": ["./**/*"],
		"references": [
			{
				"path": "../..",
			},
		],
	}
	`;
	fs.writeFileSync(testTsconfigPath, testTsconfig);

	const testTsconfigCjsPath = path.join(packageRoot, "src/test/tsconfig.cjs.json");
	const testTsconfigCjs = `{
		// This config must be used in a "type": "commonjs" environment. (Use tsc-mult.)
		"extends": "./tsconfig.json",
		"compilerOptions": {
			"outDir": "../../dist/test",
		},
		"references": [
			{
				"path": "../../tsconfig.cjs.json",
			},
		],
	}
	`;
	fs.writeFileSync(testTsconfigCjsPath, testTsconfigCjs);
}

// const jestConfigPath = path.join(packageRoot, "jest.config.cjs");
// if (fs.existsSync(jestConfigPath)) {
// 	const jestConfig = JSON5.parse(fs.readFileSync(jestConfigPath, "utf8"));
// 	jestConfig.moduleNameMapper["^(\\.{1,2}/.*)\\.js$"] = "$1";
// 	fs.writeFileSync(jestConfigPath, JSON.stringify(jestConfig, null, 4));
// }

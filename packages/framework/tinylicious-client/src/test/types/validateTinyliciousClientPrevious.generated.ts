/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */
import type * as old from "@fluidframework/tinylicious-client-previous";
import type * as current from "../../index";


// See 'build-tools/src/type-test-generator/compatibility.ts' for more information.
type TypeOnly<T> = T extends number
	? number
	: T extends string
	? string
	: T extends boolean | bigint | symbol
	? T
	: {
			[P in keyof T]: TypeOnly<T[P]>;
	  };

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITelemetryBaseEvent": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITelemetryBaseEvent():
    TypeOnly<old.ITelemetryBaseEvent>;
declare function use_current_InterfaceDeclaration_ITelemetryBaseEvent(
    use: TypeOnly<current.ITelemetryBaseEvent>): void;
use_current_InterfaceDeclaration_ITelemetryBaseEvent(
    get_old_InterfaceDeclaration_ITelemetryBaseEvent());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITelemetryBaseEvent": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITelemetryBaseEvent():
    TypeOnly<current.ITelemetryBaseEvent>;
declare function use_old_InterfaceDeclaration_ITelemetryBaseEvent(
    use: TypeOnly<old.ITelemetryBaseEvent>): void;
use_old_InterfaceDeclaration_ITelemetryBaseEvent(
    get_current_InterfaceDeclaration_ITelemetryBaseEvent());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITelemetryBaseLogger": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITelemetryBaseLogger():
    TypeOnly<old.ITelemetryBaseLogger>;
declare function use_current_InterfaceDeclaration_ITelemetryBaseLogger(
    use: TypeOnly<current.ITelemetryBaseLogger>): void;
use_current_InterfaceDeclaration_ITelemetryBaseLogger(
    get_old_InterfaceDeclaration_ITelemetryBaseLogger());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITelemetryBaseLogger": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITelemetryBaseLogger():
    TypeOnly<current.ITelemetryBaseLogger>;
declare function use_old_InterfaceDeclaration_ITelemetryBaseLogger(
    use: TypeOnly<old.ITelemetryBaseLogger>): void;
use_old_InterfaceDeclaration_ITelemetryBaseLogger(
    get_current_InterfaceDeclaration_ITelemetryBaseLogger());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_ITinyliciousAudience": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_ITinyliciousAudience():
    TypeOnly<old.ITinyliciousAudience>;
declare function use_current_TypeAliasDeclaration_ITinyliciousAudience(
    use: TypeOnly<current.ITinyliciousAudience>): void;
use_current_TypeAliasDeclaration_ITinyliciousAudience(
    get_old_TypeAliasDeclaration_ITinyliciousAudience());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_ITinyliciousAudience": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_ITinyliciousAudience():
    TypeOnly<current.ITinyliciousAudience>;
declare function use_old_TypeAliasDeclaration_ITinyliciousAudience(
    use: TypeOnly<old.ITinyliciousAudience>): void;
use_old_TypeAliasDeclaration_ITinyliciousAudience(
    get_current_TypeAliasDeclaration_ITinyliciousAudience());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TinyliciousClient": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TinyliciousClient():
    TypeOnly<old.TinyliciousClient>;
declare function use_current_ClassDeclaration_TinyliciousClient(
    use: TypeOnly<current.TinyliciousClient>): void;
use_current_ClassDeclaration_TinyliciousClient(
    get_old_ClassDeclaration_TinyliciousClient());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TinyliciousClient": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TinyliciousClient():
    TypeOnly<current.TinyliciousClient>;
declare function use_old_ClassDeclaration_TinyliciousClient(
    use: TypeOnly<old.TinyliciousClient>): void;
use_old_ClassDeclaration_TinyliciousClient(
    get_current_ClassDeclaration_TinyliciousClient());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TinyliciousClientProps": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_TinyliciousClientProps():
    TypeOnly<old.TinyliciousClientProps>;
declare function use_current_InterfaceDeclaration_TinyliciousClientProps(
    use: TypeOnly<current.TinyliciousClientProps>): void;
use_current_InterfaceDeclaration_TinyliciousClientProps(
    get_old_InterfaceDeclaration_TinyliciousClientProps());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TinyliciousClientProps": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_TinyliciousClientProps():
    TypeOnly<current.TinyliciousClientProps>;
declare function use_old_InterfaceDeclaration_TinyliciousClientProps(
    use: TypeOnly<old.TinyliciousClientProps>): void;
use_old_InterfaceDeclaration_TinyliciousClientProps(
    get_current_InterfaceDeclaration_TinyliciousClientProps());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TinyliciousConnectionConfig": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_TinyliciousConnectionConfig():
    TypeOnly<old.TinyliciousConnectionConfig>;
declare function use_current_InterfaceDeclaration_TinyliciousConnectionConfig(
    use: TypeOnly<current.TinyliciousConnectionConfig>): void;
use_current_InterfaceDeclaration_TinyliciousConnectionConfig(
    get_old_InterfaceDeclaration_TinyliciousConnectionConfig());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TinyliciousConnectionConfig": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_TinyliciousConnectionConfig():
    TypeOnly<current.TinyliciousConnectionConfig>;
declare function use_old_InterfaceDeclaration_TinyliciousConnectionConfig(
    use: TypeOnly<old.TinyliciousConnectionConfig>): void;
use_old_InterfaceDeclaration_TinyliciousConnectionConfig(
    get_current_InterfaceDeclaration_TinyliciousConnectionConfig());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TinyliciousContainerServices": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_TinyliciousContainerServices():
    TypeOnly<old.TinyliciousContainerServices>;
declare function use_current_InterfaceDeclaration_TinyliciousContainerServices(
    use: TypeOnly<current.TinyliciousContainerServices>): void;
use_current_InterfaceDeclaration_TinyliciousContainerServices(
    get_old_InterfaceDeclaration_TinyliciousContainerServices());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TinyliciousContainerServices": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_TinyliciousContainerServices():
    TypeOnly<current.TinyliciousContainerServices>;
declare function use_old_InterfaceDeclaration_TinyliciousContainerServices(
    use: TypeOnly<old.TinyliciousContainerServices>): void;
use_old_InterfaceDeclaration_TinyliciousContainerServices(
    get_current_InterfaceDeclaration_TinyliciousContainerServices());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TinyliciousMember": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_TinyliciousMember():
    TypeOnly<old.TinyliciousMember>;
declare function use_current_InterfaceDeclaration_TinyliciousMember(
    use: TypeOnly<current.TinyliciousMember>): void;
use_current_InterfaceDeclaration_TinyliciousMember(
    get_old_InterfaceDeclaration_TinyliciousMember());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TinyliciousMember": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_TinyliciousMember():
    TypeOnly<current.TinyliciousMember>;
declare function use_old_InterfaceDeclaration_TinyliciousMember(
    use: TypeOnly<old.TinyliciousMember>): void;
use_old_InterfaceDeclaration_TinyliciousMember(
    get_current_InterfaceDeclaration_TinyliciousMember());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TinyliciousUser": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_TinyliciousUser():
    TypeOnly<old.TinyliciousUser>;
declare function use_current_InterfaceDeclaration_TinyliciousUser(
    use: TypeOnly<current.TinyliciousUser>): void;
use_current_InterfaceDeclaration_TinyliciousUser(
    get_old_InterfaceDeclaration_TinyliciousUser());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_TinyliciousUser": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_TinyliciousUser():
    TypeOnly<current.TinyliciousUser>;
declare function use_old_InterfaceDeclaration_TinyliciousUser(
    use: TypeOnly<old.TinyliciousUser>): void;
use_old_InterfaceDeclaration_TinyliciousUser(
    get_current_InterfaceDeclaration_TinyliciousUser());

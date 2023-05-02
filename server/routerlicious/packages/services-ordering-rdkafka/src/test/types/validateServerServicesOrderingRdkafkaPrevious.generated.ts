/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */
import * as old from "@fluidframework/server-services-ordering-rdkafka-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IKafkaConsumerOptions": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IKafkaConsumerOptions():
    TypeOnly<old.IKafkaConsumerOptions>;
declare function use_current_InterfaceDeclaration_IKafkaConsumerOptions(
    use: TypeOnly<current.IKafkaConsumerOptions>);
use_current_InterfaceDeclaration_IKafkaConsumerOptions(
    get_old_InterfaceDeclaration_IKafkaConsumerOptions());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IKafkaConsumerOptions": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IKafkaConsumerOptions():
    TypeOnly<current.IKafkaConsumerOptions>;
declare function use_old_InterfaceDeclaration_IKafkaConsumerOptions(
    use: TypeOnly<old.IKafkaConsumerOptions>);
use_old_InterfaceDeclaration_IKafkaConsumerOptions(
    get_current_InterfaceDeclaration_IKafkaConsumerOptions());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IKafkaProducerOptions": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IKafkaProducerOptions():
    TypeOnly<old.IKafkaProducerOptions>;
declare function use_current_InterfaceDeclaration_IKafkaProducerOptions(
    use: TypeOnly<current.IKafkaProducerOptions>);
use_current_InterfaceDeclaration_IKafkaProducerOptions(
    get_old_InterfaceDeclaration_IKafkaProducerOptions());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IKafkaProducerOptions": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IKafkaProducerOptions():
    TypeOnly<current.IKafkaProducerOptions>;
declare function use_old_InterfaceDeclaration_IKafkaProducerOptions(
    use: TypeOnly<old.IKafkaProducerOptions>);
use_old_InterfaceDeclaration_IKafkaProducerOptions(
    get_current_InterfaceDeclaration_IKafkaProducerOptions());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IRdkafkaResources": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IRdkafkaResources():
    TypeOnly<old.IRdkafkaResources>;
declare function use_current_InterfaceDeclaration_IRdkafkaResources(
    use: TypeOnly<current.IRdkafkaResources>);
use_current_InterfaceDeclaration_IRdkafkaResources(
    get_old_InterfaceDeclaration_IRdkafkaResources());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IRdkafkaResources": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IRdkafkaResources():
    TypeOnly<current.IRdkafkaResources>;
declare function use_old_InterfaceDeclaration_IRdkafkaResources(
    use: TypeOnly<old.IRdkafkaResources>);
use_old_InterfaceDeclaration_IRdkafkaResources(
    get_current_InterfaceDeclaration_IRdkafkaResources());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RdkafkaConsumer": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_RdkafkaConsumer():
    TypeOnly<old.RdkafkaConsumer>;
declare function use_current_ClassDeclaration_RdkafkaConsumer(
    use: TypeOnly<current.RdkafkaConsumer>);
use_current_ClassDeclaration_RdkafkaConsumer(
    get_old_ClassDeclaration_RdkafkaConsumer());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RdkafkaConsumer": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_RdkafkaConsumer():
    TypeOnly<current.RdkafkaConsumer>;
declare function use_old_ClassDeclaration_RdkafkaConsumer(
    use: TypeOnly<old.RdkafkaConsumer>);
use_old_ClassDeclaration_RdkafkaConsumer(
    get_current_ClassDeclaration_RdkafkaConsumer());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RdkafkaProducer": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_RdkafkaProducer():
    TypeOnly<old.RdkafkaProducer>;
declare function use_current_ClassDeclaration_RdkafkaProducer(
    use: TypeOnly<current.RdkafkaProducer>);
use_current_ClassDeclaration_RdkafkaProducer(
    get_old_ClassDeclaration_RdkafkaProducer());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RdkafkaProducer": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_RdkafkaProducer():
    TypeOnly<current.RdkafkaProducer>;
declare function use_old_ClassDeclaration_RdkafkaProducer(
    use: TypeOnly<old.RdkafkaProducer>);
use_old_ClassDeclaration_RdkafkaProducer(
    get_current_ClassDeclaration_RdkafkaProducer());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RdkafkaResources": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_RdkafkaResources():
    TypeOnly<old.RdkafkaResources>;
declare function use_current_ClassDeclaration_RdkafkaResources(
    use: TypeOnly<current.RdkafkaResources>);
use_current_ClassDeclaration_RdkafkaResources(
    get_old_ClassDeclaration_RdkafkaResources());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RdkafkaResources": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_RdkafkaResources():
    TypeOnly<current.RdkafkaResources>;
declare function use_old_ClassDeclaration_RdkafkaResources(
    use: TypeOnly<old.RdkafkaResources>);
use_old_ClassDeclaration_RdkafkaResources(
    get_current_ClassDeclaration_RdkafkaResources());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RdkafkaResourcesFactory": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_RdkafkaResourcesFactory():
    TypeOnly<old.RdkafkaResourcesFactory>;
declare function use_current_ClassDeclaration_RdkafkaResourcesFactory(
    use: TypeOnly<current.RdkafkaResourcesFactory>);
use_current_ClassDeclaration_RdkafkaResourcesFactory(
    get_old_ClassDeclaration_RdkafkaResourcesFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_RdkafkaResourcesFactory": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_RdkafkaResourcesFactory():
    TypeOnly<current.RdkafkaResourcesFactory>;
declare function use_old_ClassDeclaration_RdkafkaResourcesFactory(
    use: TypeOnly<old.RdkafkaResourcesFactory>);
use_old_ClassDeclaration_RdkafkaResourcesFactory(
    get_current_ClassDeclaration_RdkafkaResourcesFactory());

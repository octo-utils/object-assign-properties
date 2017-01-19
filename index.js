/* Created by tommyZZM.OSX on 2017/1/14. */
"use strict";

const curry = require("ramda/src/curry");

const KEY_ACCESSOR_VALUES = Symbol('accessorValues');
const KEY_ACCESSOR_VALUE_GETTERS = Symbol('accessorValueGetters');
const KEY_ACCESSOR_VALUE_SETTERS = Symbol('accessorValueSetters');

const OptimizedAccessors = {};

function getterOf(prop) {
    return function () {
        let accessorValues = this[KEY_ACCESSOR_VALUES];
        let accessorValueGetters = this[KEY_ACCESSOR_VALUE_GETTERS];

        let lastValue = accessorValues[prop];
        let getter = accessorValueGetters[prop];

        return getter(lastValue, prop, this);
    }
}

function setterOf(prop) {
    return function (newValue) {
        let accessorValues = this[KEY_ACCESSOR_VALUES];
        let accessorValueSetters = this[KEY_ACCESSOR_VALUE_SETTERS];

        let setter = accessorValueSetters[prop];

        accessorValues[prop] = setter(
            accessorValues[prop], newValue, prop, this
        );
    }
}

const objectAssignProperties = curry(function (descriptor, properties, object) {

    let isOwnsGetter = typeof descriptor.get === "function";
    let isOwnsSetter = typeof descriptor.set === "function";
    let isOwnsGetterOrSetter = isOwnsGetter || isOwnsSetter;

    let get = descriptor.get;
    let set = descriptor.set;

    let _descriptor = Object.keys(descriptor)
        .reduce((_descriptor, key) => {
            if (key === "get" || key === "set") {
                return _descriptor;
            }

            // Cannot both specify accessors and a value or writable attribute
            if (key === "writable" && isOwnsGetterOrSetter) {
                return _descriptor;
            }

            _descriptor[key] = descriptor[key];
            return _descriptor;
    }, { });

    [KEY_ACCESSOR_VALUES, KEY_ACCESSOR_VALUE_GETTERS, KEY_ACCESSOR_VALUE_SETTERS]
        .forEach(key => {
            let descriptor = Object.getOwnPropertyDescriptor(
                object, key
            );

            if (!descriptor) {
                Object.defineProperty(object, key, {
                    value:{},
                    enumerable:false,
                    configurable:false
                })
            }
        });
    
    let accessorValues = object[KEY_ACCESSOR_VALUES];
    let accessorValueGetters = object[KEY_ACCESSOR_VALUE_GETTERS];
    let accessorValueSetters = object[KEY_ACCESSOR_VALUE_SETTERS];
    
    return Object.defineProperties(object, Object.keys(properties)
        .reduce((_properties, prop) => {
            let value = properties[prop];
            
            if (isOwnsGetterOrSetter) {
                accessorValues[prop] = value;
                accessorValueGetters[prop] = get;
                accessorValueSetters[prop] = set;
            }

            let optimizedAccessor = OptimizedAccessors[prop];

            if (!optimizedAccessor) {
                optimizedAccessor = [
                    getterOf(prop), setterOf(prop)
                ];
                OptimizedAccessors[prop] = optimizedAccessor;
            }

            let _descriptorValue = isOwnsGetterOrSetter ? Object.assign(
                isOwnsGetter ? {
                    get: optimizedAccessor[0]
                } : {},
                isOwnsSetter ? {
                    set: optimizedAccessor[1]
                } : {}
            ) : { value };

            _properties[prop] = Object.assign(
                _descriptor, _descriptorValue
            );
            return _properties
    }, {}));
})

/**
 * @module ./index
 */
module.exports = objectAssignProperties;

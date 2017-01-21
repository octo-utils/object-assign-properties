/* Created by tommyZZM.OSX on 2017/1/14. */
"use strict";

const curry = require("@riim/curry");

const Symbol = (typeof global.Symbol !== "function"
    && typeof Symbol.iterator !== "symbol") ? global.Symbol : function(key) {
        return key+((Math.random()*10).toFixed(2).replace(".","_"));
    };

const KEY_ACCESSOR_VALUES = Symbol('accessorValues');
const KEY_ACCESSOR_VALUE_GETTERS = Symbol('accessorValueGetters');
const KEY_ACCESSOR_VALUE_SETTERS = Symbol('accessorValueSetters');

const OptimizedAccessors = {};

function getterOf(prop) {
    return function () {
        const self = this;
        const accessorValues = self[KEY_ACCESSOR_VALUES];
        const accessorValueGetters = self[KEY_ACCESSOR_VALUE_GETTERS];

        const lastValue = accessorValues[prop];
        const getter = accessorValueGetters[prop];

        return getter(lastValue, prop, self);
    }
}

function setterOf(prop) {
    return function (newValue) {
        const self = this;
        const accessorValues = self[KEY_ACCESSOR_VALUES];
        const accessorValueSetters = self[KEY_ACCESSOR_VALUE_SETTERS];

        const setter = accessorValueSetters[prop];
        let lastValue = accessorValues[prop];

        lastValue = setter(
            lastValue, newValue, prop, self
        );

        accessorValues[prop] = lastValue;
    }
}

const objectAssignProperties = curry(function (descriptor, properties, object) {

    const isOwnsGetter = typeof descriptor.get === "function";
    const isOwnsSetter = typeof descriptor.set === "function";
    const isOwnsGetterOrSetter = isOwnsGetter || isOwnsSetter;

    const get = descriptor.get;
    const set = descriptor.set;

    const _descriptor = Object.keys(descriptor)
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
    
    const accessorValues = object[KEY_ACCESSOR_VALUES];
    const accessorValueGetters = object[KEY_ACCESSOR_VALUE_GETTERS];
    const accessorValueSetters = object[KEY_ACCESSOR_VALUE_SETTERS];
    
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
 * @module object-assign-properties
 * @function
 */
module.exports = objectAssignProperties;

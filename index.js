/* Created by tommyZZM.OSX on 2017/1/14. */
"use strict";

const curry = require("ramda/src/curry");

const noop = _ => void 0 ;

const objectAssignProperties = curry(function (descriptor, object, properties) {

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



    return Object.defineProperties(object, Object.keys(properties)
        .reduce((_properties, prop) => {
            let value = properties[prop];

            let _descriptorValue = isOwnsGetterOrSetter ? Object.assign(isOwnsGetter ? {
                get: function () {
                    return get(value, prop);
                    // return descriptor.get(value, prop);
                }
            } : {}, isOwnsSetter ? {
                set: function (newValue) {
                    value = set(newValue, prop);
                }
            } : {}) : { value };

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

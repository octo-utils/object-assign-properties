/* Created by tommyZZM.OSX on 2017/1/14. */
"use strict";

const curry = require("ramda/src/curry");

const noop = _ => void 0 ;

const objectAssignProperties = curry(function (descriptor, object, properties) {

    let _descriptor = Object.keys(descriptor)
        .reduce((_descriptor, key) => {
            if (key === "get" || key === "set") {
                return _descriptor;
            }

            // Cannot both specify accessors and a value or writable attribute
            if (key === "writable" && (
                typeof descriptor.get === "function"
                || typeof descriptor.set === "function"
            )) {
                return _descriptor;
            }

            _descriptor[key] = descriptor[key];
            return _descriptor;
    }, { });

    let getAssessors = resolveAccessors(descriptor);

    return Object.defineProperties(object, Object.keys(properties)
        .reduce((_properties, prop) => {
            let value = properties[prop];
            let _descriptorAssessors = getAssessors(object, prop, value);
            _properties[prop] = Object.assign(_descriptor,
                _descriptorAssessors ? _descriptorAssessors : {value}
            );
            return _properties
    }, {}));
})

/**
 * @module ./index
 */
module.exports = objectAssignProperties;

function resolveAccessors(descriptor) {
    return (["get", "set"]).reduce((resolver, desc) => {
        return resolver(descriptor[desc])
    }, curry((get, set) => {

        let getFn = typeof get === "function" ? function (thisArg, key, getter) {
            return function _get() {
                return get.call(thisArg, getter(), key)
            }
        } : noop;

        let setFn = typeof set === "function" ? function (thisArg, key, setter) {
            return newValue => setter(set.call(thisArg, newValue, key))
        } : noop;

        return (thisArg, key, initalValue) => {
            let lastValue = initalValue;
            return [
                ["get", getFn(thisArg, key, function () {
                    return lastValue;
                })],
                ["set", setFn(thisArg, key, function (newValue) {
                    lastValue = newValue;
                })]
            ].reduce((result, pair) => {
                let _result = result;

                if (pair) {
                    let name = pair[0];
                    let fn = pair[1];

                    if (name && typeof fn === "function") {
                        if (!_result) _result = {};
                        _result[name] = fn;
                        return _result;
                    }
                }

                return _result;
            }, void 0);
        }
    }))
}

/* Created by tommyZZM.OSX on 2017/1/14. */
"use strict";
const chalk = require("chalk");
const Benchmark = require('benchmark');
const objectAssignProperties = require("../");

const objectAssignPropertiesReadonly = objectAssignProperties({
    enumerable:false,
    writable:false
});

const objectAssignPropertiesReadonlyABC = objectAssignPropertiesReadonly({
    a:1,
    b:2,
    c:3
})

console.log(chalk.yellow.bold("index.benchmark.js"));
(new Benchmark.Suite("object-assign-properties"))
    .add("#built-in Objects.defineProperties", function () {
        Object.defineProperties({}, {
            a:{
                value:1,
                enumerable:false,
                configurable:false
            }
            ,b:{
                value:2,
                enumerable:false,
                configurable:false
            }
            ,c:{
                value:3,
                enumerable:false,
                configurable:false
            }
        })
    })
    .add("#object-assign-properties", function () {
        objectAssignProperties({
            enumerable:false,
            writable:false
        }, {
            a:1,
            b:2,
            c:3
        }, {});
    })
    .add("#object-assign-properties curry 1", function () {
        objectAssignPropertiesReadonly({
            a:1,
            b:2,
            c:3
        }, {});
    })
    .add("#object-assign-properties curry 2", function () {
        objectAssignPropertiesReadonlyABC({});
    })
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + chalk.green.bold(this.filter('fastest').map('name')));
    })
    // run async
    .run({ 'async': false });

/* Created by tommyZZM.OSX on 2017/1/14. */
"use strict";
const chalk = require("chalk");
const Benchmark = require('benchmark');
const objectAssignProperties = require("../");

const moduleObject = objectAssignProperties({
    get(lastValue) {
        return lastValue;
    },
    set(newValue) {
        return newValue;
    }
}, {}, {
    a:1
});

const builtInObject = (function (object) {
    let lastA = 1;
    return Object.defineProperties(object, {
        a:{
            get(){
                return lastA
            },
            set(newValue){
                lastA = newValue;
            }
        }
    })
})({});

console.log(chalk.yellow.bold("accessor.benchmark.js"));
(new Benchmark.Suite("object-assign-properties"))
    .add("#built-in object getter and setter", function () {
        builtInObject.a = builtInObject.a + 1;
    })
    .add("#object-assign-properties getter and setter", function () {
        moduleObject.a = moduleObject.a + 1;
    })
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + chalk.green.bold(this.filter('fastest').map('name')));
    })
    // run async
    .run({ 'async': false });


/* Created by tommyZZM.OSX on 2017/1/14. */
"use strict";
const chalk = require("chalk");
const Benchmark = require('benchmark');
const objectAssignProperties = require("../");

const moduleObject = objectAssignProperties({
    get(lastValue) {
        return lastValue;
    },
    set(_, newValue) {
        return newValue;
    }
}, {
    a:1
}, {});

const moduleObject2 = objectAssignProperties({
    get(lastValue) {
        return lastValue;
    },
    set(_, newValue) {
        return newValue;
    }
}, {
    a:1
}, {});

const moduleObject3 = objectAssignProperties({
    get(lastValue) {
        return lastValue;
    },
    set(_, newValue) {
        return newValue;
    }
}, {
    a:2
}, {});

const builtInObject = (function (object) {
    let lastA = 1;
    return Object.defineProperties(object, {
        b:{
            get(){
                return lastA
            },
            set(newValue){
                lastA = newValue;
            }
        }
    })
})({});

const builtInObject2 = (function (object) {
    let lastA = 1;
    return Object.defineProperties(object, {
        b:{
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
    .add("#1 object-assign-properties getter and setter", function () {
        moduleObject.a = moduleObject.a + 1;
    })
    .add("#2 object-assign-properties getter and setter", function () {
        moduleObject2.a = moduleObject2.a + 1;
    })
    .add("#3 object-assign-properties getter and setter", function () {
        moduleObject3.a = moduleObject3.a + 1;
    })
    .add("#1 built-in object getter and setter", function () {
        builtInObject.b = builtInObject.b + 1;
    })
    .add("#2 built-in object getter and setter", function () {
        builtInObject2.b = builtInObject2.b + 1;
    })
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + chalk.green.bold(this.filter('fastest').map('name')));
    })
    // run async
    .run({ 'async': false });

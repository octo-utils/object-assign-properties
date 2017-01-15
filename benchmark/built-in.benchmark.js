/* Created by tommyZZM.OSX on 2017/1/15. */
"use strict";
const chalk = require("chalk");
const Benchmark = require('benchmark');

const builtInObject1 = (function (object) {
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

const builtInObject2 = (function (object) {
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

const builtInObject3 = (function () {
    let lastA = 1;
    return {
        get a(){
            return lastA
        },
        set a(value){
            lastA = value;
        }
    }
})();

console.log(chalk.yellow.bold("built-in.benchmark.js"));
(new Benchmark.Suite("object-assign-properties"))
    .add("#built-in object1 getter and setter", function () {
        builtInObject1.a = builtInObject1.a + 1;
    })
    .add("#built-in object2 getter and setter", function () {
        builtInObject2.a = builtInObject2.a + 1;
    })
    .add("#built-in object3 getter and setter", function () {
        builtInObject3.a = builtInObject3.a + 1;
    })
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + chalk.green.bold(this.filter('fastest').map('name')));
    })
    .run({ 'async': false });
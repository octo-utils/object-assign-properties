/* Created by tommyZZM.OSX on 2017/1/14. */
"use strict";

const expect = require("chai").expect;
const objectAssignProperties = require("../")

describe("basic usage", function () {
    it("it should assign readonly properties successfully", function () {

        let objectAssignPropertiesReadonly = objectAssignProperties({
            writable:false,
            enumerable:false,
            configurable:false
        })

        let target = {};

        objectAssignPropertiesReadonly(target, {
            a:1,
            b:2,
            c:3
        });

        let thatDescriptor = Object.getOwnPropertyDescriptor(target, "a");

        expect(thatDescriptor).to.have.property("writable", false);
        expect(thatDescriptor).to.have.property("enumerable", false);
        expect(thatDescriptor).to.have.property("configurable", false);

        expect(function () {
            target.b = -1;
        }).to.throw(TypeError);
    })

    it("it should assign both getter and setter successfully", function () {
        let objectAssignPropertiesSetAndGet = objectAssignProperties({
            set(value) {
                return value - 2;
            },
            get(value) {
                return value + 1;
            }
        })

        let target = objectAssignPropertiesSetAndGet({}, {
            a:1
        });

        expect(target.a).to.be.equal(2); // 1 + 1;
        target.a = 1;
        expect(target.a).to.be.equal(0); // 1 - 2 + 1
    });

    it("it should assign getter successfully", function () {
        let objectAssignPropertiesSetAndGet = objectAssignProperties({
            get(value) {
                return value + 1;
            }
        })

        let target = objectAssignPropertiesSetAndGet({}, {
            a:1
        });

        expect(target.a).to.be.equal(2); // 1 + 1;
    })
})

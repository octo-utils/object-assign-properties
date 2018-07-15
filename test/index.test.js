/* Created by tommyZZM.OSX on 2017/1/14. */
"use strict";

const expect = require("chai").expect;
const objectAssignProperties = require("../")

describe("basic usage", function () {
  it("it should assign readonly properties successfully", function () {

    let objectAssignPropertiesReadonly = objectAssignProperties({
      writable: false,
      enumerable: false,
      configurable: false
    })

    let target = {};

    objectAssignPropertiesReadonly({
      a: 1,
      b: 2,
      c: 3
    }, target);

    let thatDescriptor = Object.getOwnPropertyDescriptor(target, "a");

    expect(target.a).to.be.equal(1);
    expect(target.b).to.be.equal(2);
    expect(target.c).to.be.equal(3);

    expect(thatDescriptor).to.have.property("writable", false);
    expect(thatDescriptor).to.have.property("enumerable", false);
    expect(thatDescriptor).to.have.property("configurable", false);

    expect(function () {
      target.b = -1;
    }).to.throw(TypeError);
  })

  it("it should assign both getter and setter successfully", function () {
    let objectAssignPropertiesSetAndGet = objectAssignProperties({
      set(_, value) {
        return value - 2;
      },
      get(value) {
        return value + 1;
      }
    })

    let target = objectAssignPropertiesSetAndGet({
      a: 1
    }, {});

    expect(target.a).to.be.equal(2); // 1 + 1;
    target.a = 6;
    expect(target.a).to.be.equal(5); // 5 - 2 + 1
  });

  it("it should assign getter successfully", function () {
    let objectAssignPropertiesSetAndGet = objectAssignProperties({
      get(value) {
        return value + 1;
      }
    })

    let target = objectAssignPropertiesSetAndGet({
      a: 1
    }, {});

    expect(target.a).to.be.equal(2); // 1 + 1;
  });

  it("accessor should be the same function", function () {
    let objectAssignPropertiesSetAndGet = objectAssignProperties({
      shareAccessor: true,
      get(value) {
        return value;
      },
      set(_, value) {
        return value;
      }
    })

    let target = objectAssignPropertiesSetAndGet({
      accessor: 1
    }, {});

    let target2 = objectAssignPropertiesSetAndGet({
      accessor: 1
    }, {});

    let accessorDescriptor1 =
      Object.getOwnPropertyDescriptor(target, 'accessor');

    let accessorDescriptor2 =
      Object.getOwnPropertyDescriptor(target2, 'accessor')

    expect(accessorDescriptor1.get === accessorDescriptor2.get).to.be.equal(true);
    expect(accessorDescriptor1.set === accessorDescriptor2.set).to.be.equal(true);

    target.accessor = 5
    expect(target.accessor).to.be.equal(5);
    expect(target2.accessor).to.be.equal(1);
    target2.accessor = 2
    expect(target.accessor).to.be.equal(5);
    expect(target2.accessor).to.be.equal(2);
  })
})

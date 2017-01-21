# object-assign-properties

[![npm](https://img.shields.io/npm/v/object-assign-properties.svg?style=flat-square)](https://www.npmjs.com/package/object-assign-properties)

[![npm](https://nodei.co/npm/object-assign-properties.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/object-assign-properties)

curried and reusable function define object properties like [`Object.defineProperties`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)

## API
`objectAssignProperties(descriptor[, properties[, object]])`

`((descriptor, properties, object) => *) => descriptor => properties => object => object`

there are 3 arguments of this curried function.

- `descriptor` description for properties ([description](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description))

#### example
```javascript
({
    writable:false,
    configurable:false
})
```

#### getter/setter

`getter` and `setter` description would be little different from built-in ones

because of `objectAssignProperties` always assign mutable properties for mutable objects, so we need more property infos in our accessor functions

you can define `getter` and `setter` like this example below:

```javascript
({
   get(lastValue, key, self) { // inital or last value will save in a interal scope
       return lastValue + 1;
   }
   set(lastValue, newValue, prop, self) {
       if (typeof newValue === "number") {
          return newValue; // return value would be set as a new value for the property
       } else {
          return lastValue;
       }
   }
})
```

- `properties` properties with it's value

- `object` target object

## Example

#### normal description
```javascript
const objectAssignProperties = require("object-assign-properties");

let target = {};

objectAssignProperties({
    writable:false,
    configurable:false
}, {
    a:1
    b:2
}, target);

console.log(target); // assign readonly properties `a` `b` `c` to target object

```

#### normal description (curry)

```javascript
const objectAssignProperties = require("object-assign-properties");

const objectAssignPropertiesReadonly = objectAssignProperties({
    writable:false,
    configurable:false
});

const objectAssignPropertiesReadonlyABC = objectAssignPropertiesReadonly({
    a:1, b:2, c:3
})

let target1 = {};
let target2 = {};

objectAssignPropertiesReadonlyABC(target1); // assign readonly properties `a` `b` `c` to target object
objectAssignPropertiesReadonlyABC(target2);
```

#### accessor description (`getter` and `setter`)

```javascript
const objectAssignProperties = require("object-assign-properties");

const objectAssignPropertiesGetPlus1 = objectAssignProperties({
    get(value, key){
        return value + 1;
    }
}, {
    a:1, b:2, c:"c"
})

let target1 = {};
let target2 = {};

objectAssignPropertiesGetPlus1(target1);
objectAssignPropertiesGetPlus1(target2);

console.log(target1.a) // 2;
console.log(target1.b) // 3;
console.log(target1.c) // "c1";

console.log(target2.a) // 2;
console.log(target2.b) // 3;
console.log(target2.c) // "c1";
```

## Benchmark (`node.js v7.4.0`)

Benchmark sources can be found in the [folder](https://github.com/octo-utils/object-assign-properties/blob/master/benchmark/)

### 1.create assign properties for object

assign `a`,`b`,`c`, with `enumerable:false` and `writable:false`

| function \ `ops/sec`                             | create  |
|:-------------------------------------------------|---------|
| Object.defineProperties                          | 519,578 |
| object-assign-properties                         | 213,094 |
| object-assign-properties curry 1 argument        | 212,660 |
| object-assign-properties curry 2 arguments       | 216,285 |

### 2.call assigned properties with accessor (getter and setter)

assigned a property with `getter` and `setter`, then `object[property] = object[property] + 1`

| function \ `ops/sec`                 | call first object | call second object | call third object |
|:------------------------------------ |-------------------|--------------------|-------------------|
| object-assign-properties             | 54,178,445        | 25,635,134         | 25,277,132        |
| Object.defineProperties              | 77,025,879        | 3,842,031          | 3,678,909         |

#### why `object-assign-properties` performance better after the first object ?

reference issue [`nodejs/help|#442`](https://github.com/nodejs/help/issues/442#issuecomment-272906330)

objects with **the same property name** and **different function** defined via **accessor** (getter/setter) (even with the same return value) are always turned to **dictionary mode** expect the first one, however if we always define same function for **accessor** of **the same property name**, then the object will stay fast!

## Reference
- [MDN | Object.defineProperty](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

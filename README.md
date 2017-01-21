# object-assign-properties

[![npm](https://img.shields.io/npm/v/object-assign-properties.svg?style=flat-square)](https://www.npmjs.com/package/object-assign-properties)

[![npm](https://nodei.co/npm/object-assign-properties.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/object-assign-properties)

curried and reusable defineProperties function like Object.defineProperties

## API
`objectAssignProperties(descriptor[, properties[, object]])`

`((descriptor, properties, object) => *) => descriptor => properties => object => object`

there are 3 arguments of this curried function.

#### Note!

> `v0.2.*` has transfer the order of `object`(second) and `properties`(third) arguments!

- `descriptor` description for properties ([description](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description))

#### example
```javascript
({
    writable:false,
    configurable:false
})
```

#### getter/setter

`getter` and `setter` description would be little different from `built-in description`

you can define `getter` and `setter` like this example below

```javascript
({
   get(lastValue, key, self) { // inital or last value will save in a interal scope
       return lastValue + 1;
   }
   set(lastValue, newValue, key, self) {
       if (typeof newValue === "number") {
          return newValue; // return value would be set as a new value for the key
       } else {
          return lastValue;
       }
   }
})
```

- `properties` properties with it's value

- `object` target object

## Example

#### normal description (call all 3 arguments once)
```javascript
const objectAssignProperties = require("object-assign-properties");

let target = objectAssignProperties({
    writable:false,
    configurable:false
}, {
    a:1
    b:2
}, {});

console.log(target);

// assign `a` `b` `c` readonly properties to target object

```

#### normal description

```javascript
const objectAssignProperties = require("object-assign-properties");

const objectAssignPropertiesReadonly = objectAssignProperties({
    writable:false,
    configurable:false
}, {
    a:1, b:2, c:3
});

let target = {};

objectAssignPropertiesReadonly(target); // also return target object it self

console.log(target);
// assign `a` `b` `c` readonly properties to target object
```

#### accessor description (`get` and `set`)

```javascript
const objectAssignProperties = require("object-assign-properties");

const objectAssignPropertiesGetPlus1 = objectAssignProperties({
    get(value, key){
        return value + 1;
    }
}, {
    a:1, b:2, c:"c"
})

let target = {};

objectAssignPropertiesReadonly(target);

console.log(target.a) // 2;
console.log(target.b) // 3;
console.log(target.c) // "c1";
```

## Benchmark (`node.js v7.4.0`)

#### create assign properties for object

assign `a`,`b`,`c`, with `enumerable:false` and `writable:false`

| function \ `ops/sec`                             | create  |
|:-------------------------------------------------|---------|
| Object.defineProperties                          | 508,225 |
| object-assign-properties                          | 209,195 |
| object-assign-properties lifted call              | 208,194 |

#### call assigned properties with accessor (getter and setter)

assigned a property with `getter` and `setter`, then `object[property] = object[property] + 1`

| function \ `ops/sec`                 | call first object | call second object | call third object |
|:------------------------------------ |-------------------|--------------------|-------------------|
| object-assign-properties             | 54,178,445        | 25,635,134         | 25,277,132        |
| Object.defineProperties              | 77,025,879        | 3,842,031          | 3,678,909         |

Benchmark sources can be found in the [folder](https://github.com/octo-utils/object-assign-properties/blob/master/benchmark/)

## Reference
- [MDN | Object.defineProperty](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

# object-assign-properties

[![npm](http://img.shields.io/npm/v/object-assign-properties.svg?style=flat-square)](https://www.npmjs.com/package/object-assign-properties)

[![npm](https://nodei.co/npm/object-assign-properties.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/object-assign-properties)

curried and reusable defineProperties function like Object.defineProperties

## API
`objectAssignProperties(descriptor, object, properties)`

`((descriptor, object, properties) => *) => descriptor => object => properties => object`

there are 3 arguments of this curried function.

- `descriptor` description for properties ([description](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description))

#### like:
```
{
    writable:false,
    configurable:false
}
```

- `object` target object

- `properties` properties with it's value

## Example

#### normal description (call all 3 arguments once)
```javascript
const objectAssignProperties = require("object-assign-properties");

let target = objectAssignProperties({
    writable:false,
    configurable:false
}, {}, {
    a:1
    b:2
});

console.log(target);

// assign `a` `b` `c` readonly properties to target object

```

#### normal description

```javascript
const objectAssignProperties = require("object-assign-properties");

const objectAssignPropertiesReadonly = objectAssignProperties({
    writable:false,
    configurable:false
});

let target = {};

objectAssignPropertiesReadonly(target, {
   a:1, b:2, c:3
});

// assign `a` `b` `c` readonly properties to target object
```

#### accessor description (`get` and `set`)
```javascript
const objectAssignProperties = require("object-assign-properties");

const objectAssignPropertiesGetPlus1 = objectAssignProperties({
    get(value){
        return value + 1;
    }
})

let target = objectAssignPropertiesReadonly({}, {
   a:1, b:2, c:"c"
});

console.log(target.a) // 2;
console.log(target.b) // 3;
console.log(target.c) // "c1";
```

## Reference
- [MDN | Object.defineProperty](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

# object-assign-properties

curried and reusable defineProperties function like Object.defineProperties

## Usage

#### normal description

```javascript
const objectAssignProperties = require("object-assign-properties");

const objectAssignPropertiesReadonly = objectAssignProperties({
    writable:false,
    configurable:false
})

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

## API
`objectAssignProperties(descriptor, object, properties)`

`((descriptor, object, properties) => *) => descriptor => object => properties => object`

- `descriptor` description for properties ([description](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description))
```
{
    writable:false,
    configurable:false
}
```

- `object` target object

- `properties` properties with it's value

## Reference
- [MDN | Object.defineProperty](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

# Promise polyfill

MyPromise was written following the [API design guidance](https://www.w3.org/2001/tag/doc/promises-guide#api-design-guidance)
MyPromise polyfill includes next things:

- Support all static methods
- Endless chaining (then, catch)
- Full typing

## Usage
Use like default Promise
```js
const myPromise = new MyPromise<number>((resolve, reject) => {
    setTimeout(() => {
        resolve(5);
    }, 5_000)
})
    .then((value) => {
        console.log("value:", value);
    })
    .catch((reason) => {
        console.log("reason:", reason);
    })
    .then(() => {
        console.log("====");
    })
```

## Utils

#### `asap`
As you know,  promises refer to microtask in event loop.
Asap utility, in dependence on platform and version where js is execution, add our solution in queue microtask

#### `isPromiseLike`
Type guard for detect PromiseLike object

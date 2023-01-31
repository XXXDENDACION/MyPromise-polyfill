var MyPromise = /** @class */ (function () {
    function MyPromise(executor) {
        var _this = this;
        this.thenCb = null;
        this.catchCb = null;
        this.then = function (thenCallback) {
            _this.thenCb = thenCallback;
            return _this;
        };
        this["catch"] = function (catchCallback) {
            _this.catchCb = catchCallback;
            return _this;
        };
        this.resolve = function (value) {
            if (_this.thenCb) {
                _this.thenCb(value);
            }
            console.log(value);
        };
        this.reject = function (reason) {
            if (_this.catchCb) {
                _this.catchCb(reason);
            }
            console.log(reason);
            return _this;
        };
        executor(this.resolve, this.reject);
    }
    return MyPromise;
}());
var testPromise = new MyPromise(function (resolve, _reject) {
    setTimeout(function () {
        resolve(5);
    }, 1000);
})
    .then(function (value) {
    console.log(value);
})["catch"](function (error) {
    console.log(error);
});
// output
// reference
// const referencePromise = new Promise((resolve, reject) => {
//   console.log("RESOLVE_1");
//   setTimeout(() => {
//     resolve("RESOLVE_2");
//   }, 500);
// })
//   .then((value) => {
//     console.log(value);
//     throw new Error("error");
//   })
//   .then((value) => {
//     console.log("TEST");
//     return "TEST_2";
//   })
//   .then((value) => {
//     console.log(value);
//     return "TEST_3";
//   })
//   .catch((error) => {
//     console.log(error);
//   })
//   .then(() => {
//     return new Promise((resolve) => {
//       resolve(5);
//     });
//   })
//   .then(console.log);
// polyfill
// const polyfillPromise = new MyPromise((resolve, reject) => {
//   console.log("RESOLVE_1");
//   setTimeout(() => {
//     resolve("RESOLVE_2");
//   }, 500);
// })
//   .then((value) => {
//     console.log(value);
//     throw new Error("error");
//   })
//   .then((value) => {
//     console.log("TEST");
//     return "TEST_2";
//   })
//   .then((value) => {
//     console.log(value);
//     return "TEST_3";
//   })
//   .catch((error) => {
//     console.log(error);
//   })
//   .then(() => {
//     return new Promise((resolve) => {
//       resolve(5);
//     });
//   })
//   .then(console.log);

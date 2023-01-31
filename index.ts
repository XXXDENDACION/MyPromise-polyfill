type Executor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void
) => void;

type AnyFunction = (...args: any[]) => any;

class MyPromise<T> {
  thenCb: AnyFunction[] | null = null;
  catchCb: AnyFunction[] | null = null;

  constructor(executor: Executor<T>) {
      executor(this.resolve, this.reject);
  }

  public then = (thenCallback: (value: T) => void) => {
      this.thenCb = thenCallback;
      return this;
  };

  public catch = (catchCallback: (reason?: any) => void) => {
      this.catchCb = catchCallback;
      return this;
  };

  private resolve = (value: T) => {
      if (this.thenCb) {
          this.thenCb(value);
      }
  };

  private reject = (reason?: any) => {
      if (this.catchCb) {
          this.catchCb(reason);
      }
  };
}

const wait = (ms: number) => (
    new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
)

const waitedPromise = new MyPromise<number>((resolve, reject) => {
    setTimeout(() => {
        resolve(5);
    }, 1_000);
})
    .then((value) => {
        console.log("value:", value);
        return value;
    })
    .then((value) => {
        console.log("====", value);
    })

// const waitedPromise = new Promise<number>((resolve, reject) => {
//     setTimeout(() => {
//         resolve(5);
//     }, 1_000);
// })
//     .then((value) => {
//         console.log("value:", value);
//         return wait(5000);
//     })
//     .then(() => {
//         console.log("====");
//     })

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

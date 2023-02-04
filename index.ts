type Executor<T> = (
  resolve: Resolve<T>,
  reject: Reject
) => void;

type AnyFunction = (...args: any[]) => any;
type Resolve<T> = (value: T) => void;
type Reject = (reason?: any) => void;
type Status = 'fulfilled' | 'rejected' | 'pending';
class MyPromise<T> {
  thenCbs: [AnyFunction, Resolve<T>][] = [];
  catchCbs: [AnyFunction, Reject][] = [];
  status: Status = 'pending';
  value: T | null = null;
  error?: any;

  constructor(executor: Executor<T>) {
      console.log('CREATE INSTANCE');
      executor(this.resolve, this.reject);
  }

  public then = (thenCallback: (value: T) => void) => {
      return new MyPromise((resolve, reject) => {
          this.thenCbs.push([thenCallback, resolve]);
      });
  };

  public catch = (catchCallback: (reason?: any) => void) => {
      return new MyPromise((resolve, reject) => {
          this.catchCbs.push([catchCallback, reject]);
      });
  };

  private resolve = (value: T) => {
      this.status = 'fulfilled';
      this.value = value;

      this.processPipeline();
  };

  private reject = (reason?: any) => {
      this.status = 'rejected';
      this.error = reason;

      this.processPipeline();
  };

  private processPipeline = () => {
      if (this.status === 'pending') {
          return;
      }

      if (this.status === 'fulfilled') {
          console.log("CALLBACKS", this.thenCbs);
          const thenCbs = this.thenCbs;
          this.thenCbs = [];

          thenCbs.forEach(([thenCb, resolve]) => {
              const value = thenCb(this.value);
              resolve(value);
          })
      } else {
          console.log("CALLBACKS", this.catchCbs);
          const catchCbs = this.catchCbs;
          this.catchCbs = [];

          catchCbs.forEach(([catchCb, reject]) => {
              const value = catchCb(this.value);
              reject(value);
          })
      }
  }
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
    }, 500);
    // resolve(5);
})
    .then((value) => {
        console.log("value:", value);
        return 6;
    })
    .catch((reason) => {
        reason();
    })
    .then(value => {
        console.log('second value:', value);
        return 4
    })
    .then((value) => {
        console.log("====", value);
    })

// const waitedPromise = new Promise<number>((resolve, reject) => {
//     resolve(5);
// })
//     .then((value) => {
//         console.log("value:", value);
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

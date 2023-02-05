import {asap, isPromiseLike} from "./utils";

type Executor<T> = (
  resolve: Resolve<T>,
  reject: Reject
) => void;

type Callback<T> = [AnyFunction | undefined, AnyFunction | undefined, Resolve<T>, Reject];
type AnyFunction = (...args: any[]) => any;
type Resolve<T> = (value: T) => void;
type Reject = (reason?: any) => void;
type Status = 'fulfilled' | 'rejected' | 'pending';
class MyPromise<T> {
  thenCbs: Callback<T>[] = [];
  status: Status = 'pending';
  value: T | null = null;
  error?: any;

  constructor(executor: Executor<T>) {
      try {
          executor(this.resolve, this.reject);
      } catch (error) {
          this.reject(error);
      }
  }

  public then = (thenCallback: (value: T) => void, catchCallback?: (reason?: any) => void) => {
      return new MyPromise((resolve, reject) => {
          this.thenCbs.push([thenCallback, catchCallback, resolve, reject]);
      });
  };

  public catch = (catchCallback: (reason?: any) => void) => {
      return new MyPromise((resolve, reject) => {
          this.thenCbs.push([undefined, catchCallback, resolve, reject]);
      });
  };

  private resolve = (value: T | PromiseLike<T>) => {
      if (isPromiseLike(value)) {
          value.then(this.resolve, this.reject);
      } else {
          this.status = 'fulfilled';
          this.value = value;

          this.processPipeline();
      }
  };

  private reject = (reason?: any) => {
      this.status = 'rejected';
      this.error = reason;

      this.processPipeline();
  };

  private processPipeline = () => {
      asap(() => {
          if (this.status === 'pending') {
              return;
          }

          const thenCbs = this.thenCbs;
          this.thenCbs = [];
          thenCbs.forEach(([thenCb, catchCb, resolve, reject]) => {
              try {
                  if (this.status === 'fulfilled') {
                      const value = thenCb ? thenCb(this.value) : this.value;
                      resolve(value);
                  } else {
                      const reason = catchCb ? catchCb(this.error) : this.error;
                      resolve(reason);
                  }
              } catch (error) {
                  reject(error);
              }
          })
      })
  }
}

// const wait = (ms: number) => (
//     new MyPromise<void>(resolve => {
//         setTimeout(() => {
//             resolve();
//         }, ms);
//     })
// )

new MyPromise((resolve, reject) => {
    resolve("SECOND");
}).then(console.log)

console.log('FIRST')

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

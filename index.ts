import {asap, isPromiseLike} from "./utils";

type Executor<T> = (
  resolve: Resolve,
  reject: Reject
) => void;

type Resolve = (value: any) => void;
type Reject = (reason?: any) => void;
type ThenCb<T> = (value: T) => any;
type CatchCb = (reason?: any) => any;

type AllSettledResult<T> =
    | {
    status: "fulfilled";
    value: T;
}
    | {
    status: "rejected";
    reason: any;
};

type Status = 'fulfilled' | 'rejected' | 'pending';
class MyPromise<T> {
  thenCbs: [ThenCb<T> | undefined, CatchCb | undefined, Resolve, Reject][] = [];
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

  static all<U>(arrayPromises: (U | MyPromise<U>)[]) {
      const result: U[] = Array(arrayPromises.length);
      let count = 0;

      return new MyPromise<U[]>((resolve, reject) => {
          arrayPromises.forEach((promise, index) => {
              MyPromise.resolve(promise)
                  .then(value => {
                      result[index] = value;
                      count++;

                      if (count === arrayPromises.length) {
                        resolve(result);
                      }
                  })
                  .catch((error) => {
                      reject(error);
                  })
          })
      });
  }

  static allSettled<U>(arrayPromises: MyPromise<U>[]) {
      return MyPromise.all<AllSettledResult<U>>(
          arrayPromises.map((promise) =>
              promise
                  .then((value) => ({ status: 'fulfilled' as const, value }))
                  .catch((reason) => ({ status: 'rejected' as const, reason })))
      );
  }

    /**
     * Call all MyPromises and return first resolve/reject (depend on which is first)
     * @param arrayPromises. Array of MyPromises instance
     * @returns A new MyPromise
     */
  static race<U>(arrayPromises: MyPromise<U>[]) {
      return new MyPromise((resolve, reject) => {
          arrayPromises.forEach(promise => {
              MyPromise.resolve(promise)
                  .then(resolve)
                  .catch(reject)
          })
      })
  }

  static resolve<U>(value: U | PromiseLike<U>) {
      return new MyPromise<U>(resolve => {
          resolve(value);
      })
  }

  static reject(reason?: any) {
      return new MyPromise((_, reject) => {
          reject(reason);
      })
  }

  public then = <U>(
      thenCallback?: (value: T) => U | PromiseLike<U>,
      catchCallback?: (reason?: any) => void
  ) => {
      const promise = new MyPromise<U>((resolve, reject) => {
          this.thenCbs.push([thenCallback, catchCallback, resolve, reject]);
      });

      this.processPipeline();
      return promise;
  };

  public catch = <U>(catchCallback?: (reason?: any) => U) => {
      const promise = new MyPromise<U>((resolve, reject) => {
          this.thenCbs.push([undefined, catchCallback, resolve, reject]);
      });

      this.processPipeline();
      return promise;
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
                      if (catchCb) {
                          const value = catchCb(this.error);
                          resolve(value);
                      } else {
                          reject(this.error);
                      }
                  }
              } catch (error) {
                  reject(error);
              }
          })
      })
  }
}

const promis1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(10)
    }, 500);
});

const promis2 = new MyPromise((resolve, reject) => {
    resolve(5)
});

const promis3 = new MyPromise((resolve, reject) => {
    reject("ERror");
});

MyPromise.race([
    promis1,
    promis2
]).then(console.log);

// MyPromise.all([
//     promis1,
//     promis2,
//     promis3
// ])
//     .then(console.log)
//     .catch((error) => console.log(error))

// const waitedPromise = new MyPromise<number>((resolve, reject) => {
//     resolve(5);
// })
//     .catch(value => {
//
//     })
//     .then((value) => {
//         console.log("value:", value);
//     })
//     .catch((reason) => {
//         console.log("reason:", reason);
//     })
//     .then(() => {
//         console.log("====");
//     })

// output
// reference


export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
    return Boolean(
        value &&
            typeof value === "object" &&
            "then" in value &&
            typeof value.then === "function"
    )
}

type AsapCallback = () => void;

function createAsap() {
    if (typeof queueMicrotask === "function") {
        return function asap(callback: AsapCallback) {
            queueMicrotask(callback);
        }
    } else if (typeof MutationObserver === "function") {
        return function asap(callback: AsapCallback) {
            const observer = new MutationObserver(function () {
                callback();
                observer.disconnect();
            });
            const target = document.createElement('div');
            observer.observe(target, { attributes: true });
            target.setAttribute("data-foo", "");
        }
    } else if (
        typeof process === "object" &&
        typeof process.nextTick === "function"
    ) {
        return function asap(callback: AsapCallback) {
            process.nextTick(callback)
        }
    } else if (typeof setImmediate === "function") {
        // old IE??
        return function asap(callback: AsapCallback) {
            setImmediate(callback);
        }
    } else {
        // if platform doesn't support any microtask functions we will call setTimeout with zero delay
        // but this is macrotask LOL
        // but there's nothing to be done
        return function asap(callback: AsapCallback) {
            setTimeout(() => {
                callback();
            }, 0)
        }
    }
}

export const asap = createAsap();

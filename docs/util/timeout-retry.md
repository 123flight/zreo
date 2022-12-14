# 使用 [Promise.race](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) 实现的请求超时重试
> Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝，
> 并且采用第一个 promise 的值作为它的值

```js
const timeoutRetry = (fn, delay) => {
    const mainPromise = fn();
    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve(fn());
        }, delay);
    });
}
```

```js
// 测试
const timeoutRetry = (fn1, fn2, delay) => {
    const mainPromise = fn1();
    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve(fn2());
        }, delay);
    });
}

const getA = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('A');
        }, 200);
    });
}

const getB = () => {
    return new Promise((resolve) => {
        resolve('B');
    });
}

const getRes = async () => {
    const res = await timeoutRetry(getA, getB, 100);
    console.log(res); // B
}

getRes();
```
# compose问题的一些实现

啥都不说了，开局一张图：
![图片](https://img1.imgtp.com/2022/06/28/vTXh3zAV.png)

#### 这是 v2ex 上的一个精简的解法：
```js
const compose = ([fn, ...fns]) => () => fn?.(compose(fns));
```

#### 这个据说是不费力就能看得懂的方法，你觉着呢？
```js
function compose(middlewares) {
    const fns = [...middlewares];
    const recursion = () => {
        while (fns.length) {
            const fn = fns.shift();
            fn(recursion);
        }
    };
    return () => {
        recursion();
    };
}
```

#### `redux`对 `compose` 的实现方式：
```ts
function compose(...funcs: Function[]) {
    if (funcs.length === 0) {
        return <T>(arg: T) => arg;
    }
    
    if (funcs.length === 1) {
        return funcs[0];
    }
    
    return funcs.reduce(
        (a, b) =>
            (...args: any) => 
                a(b(...args))
    );
}
```
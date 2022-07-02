# 一张图助你理解原型链

![原型链图](https://img1.imgtp.com/2022/07/02/7sWZb1Qr.png)

#### 判断对象中是否存在某个属性

- 第一种
```js
function hasProperty(obj, key) {
    return obj.key !== undefined;
}
```

- 错误点
    - 错误点一：这里判断的永远是 obj上键名是key的值
    - 错误点二：即使使用obj[key]这种形式去判断，如果 const obj = { a: undefine }，用这种方法是得不到正确结果的

- 第二种
```js
function hasProperty(obj, key) {
    return Object.keys(obj).includes(key);
}
```

- 错误点
    - 错误点一：此时定义的对象 obj 上的属性 a 不可遍历，这是第二种方法是不可以的
```js
Object.defineProperty(obj, 'a', {
    enumerable: false,
    value: 1,
});
```

- 第三种
```js
function hasProperty(obj, key) {
    return obj.hasOwnProperty(key);
}
```

- 错误点：hasProperty(obj, 'toString')，正常对象是有 toString 属性，之不过是在原型链上可能不是在自定义对象它本身上。

- 第四种
```js
function hasProperty(obj, key) {
    return key in obj;
}
```
> 关键字 in 可以判断一个属性是否在对象上，并且可以在原型链上查找的。
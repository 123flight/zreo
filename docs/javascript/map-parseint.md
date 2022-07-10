# map 和 parseInt

先简单介绍一下这两个 API：
- [map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) ：创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
- [parseInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt) ：parseInt(string, radix)  解析一个字符串并返回指定基数的十进制整数，radix 是 2-36 之间的整数，表示被解析字符串的基数。

##### 看道题：['1', '2', '3'].map(parseInt);

根据两个API的定义可以将这道题理解成：
```js
[ 
    parseInt('1', 0),
    parseInt('2', 1),
    parseInt('3', 2)
]
```

得到结果：
```js
[ 1, NaN, NaN]
```

解释：
- 为什么第一个会输出 1：![图片](https://img1.imgtp.com/2022/07/10/zjX8GA5Q.png)
- 为什么第二个会输出NaN：![图片](https://img1.imgtp.com/2022/07/10/lxGi3Qnq.png)
- 为什么第三个会输出NaN：因为第一个参数没有一个有效字符可以转换成二进制

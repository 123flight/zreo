# 数字格式化

场景：给你一个数字如：100000000，将数字格式化为：100,000,000

废话不多说，直接上代码

```ts
/**
 * 格式化数
 * @param number 要格式化的数
 */
const numberFormat = (number: number | string): string => {
    return String(number).replace(/(?=\B(\d{3})+$)/g, ',');
}
```

示例：![数字格式化示例](https://img1.imgtp.com/2022/07/08/zgdrmKio.png)
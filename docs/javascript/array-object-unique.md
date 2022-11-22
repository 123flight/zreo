# 数组对象去重

> 利用 Map 和 filter

```js
const arr = [
    {
        name: 'A',
        age: 15,
    },
    {
        name: 'B',
        age: 18,
    },
    {
        name: 'A',
        age: 15
    }
]
const arrayObjectUnique = (arr, uniKey) => {
    const res = new Map();
    return arr.filter((item) => !res.has(item[uniKey]) && res.set(item[uniKey], 1));
}
const newArr = arrayObjectUnique(arr, 'name');
// [{name: 'A', age : 15},{name: 'B', age: 18}]
```
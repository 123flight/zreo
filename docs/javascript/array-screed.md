# 数组抹平

- toString 和 split
> toString可以直接去掉所有中括号，此方法适合将数组抹平为1层

```javascript
const arr = [1,2,[3,4,5,[6,7,8],9],10,[11,12]];
const arr1 = arr.toString().split(',').map((val)=>{
            return parseInt(val)
          });
console.log(arr1);
//[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

//思路
[1,2,[3,4,5,[6,7,8],9],10,[11,12]].toString().split(",")
// ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
[1,2,[3,4,5,[6,7,8],9],10,[11,12]].toString()
//"1,2,3,4,5,6,7,8,9,10,11,12"
```
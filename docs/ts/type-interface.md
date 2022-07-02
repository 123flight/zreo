# 说一说 TS 中的 `type` 和 `interface`

#### type 和 interface 的相同点

- 他俩都是对接口的定义，只是形式不同，都是用来定义 对象 或者 函数 的属性

```ts
interface Person1 {
    name: string;
    age: number;
}

interface GetPerson1Func {
    (name: string, age: number): void
}

type Person2 = {
    name: string;
    age: number;
}

type GetPerson2Func = (name: string, age: number) => v;
```

- 它俩都支持继承，并不是独立的，而是可以相互继承

```ts
interface Person1 {
    name: string;
}

type TypePerson1 = {
    name: string;
}

interface Person2 extends Person1 {
    age: number;
}

interface Person2 extends TypePerson1 {
    age: number;
}

type TypePerson2 = TypePerson1 & {
    age: number;
}

type TypePerson2 = Person1 & {
    age: number;
}
```
可以看出对于interface来说继承是通过 `extends` 实现，而type是通过 `&` 来实现，也可以叫做 `交叉类型`

#### 不同点

- type可以做到，而interface不能做到的
    - type可以定义 基本类型的别名，如 `type myString = string`
    - type可以通过 typeof 操作符来定义，如 `type myType = typeof myObj`
    - type可以声明 联合类型，如 `type unionType = myType1 | myType2`
    - type可以声明 元组类型，如 `type yuanzuType = [myType1, myType2]`

- interface可以做到，而type不能做到的
    - interface可以 声明合并，如下
```ts
interface Person {
    name: string;
}

interface Person {
    age: number;
}

// Person 实际为 {
//     name: string;
//     age: number;
// }
```
这种情况type是会报 重复定义 的警告
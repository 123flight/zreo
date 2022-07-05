# 你不知道的阴影

场景：当给你一个图像让你给这个图像加阴影。

#### 正常我们首先会想到 `box-shadow`

> [`box-shadow`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow) 属性用于在元素的框架上添加阴影效果。 

```html
    ...
    img {
        box-shadow: 0 0 15px #bbb;
    }
    ...
    <img src="https://img1.imgtp.com/2022/07/05/YhZAaGbW.png" />
    ...
```

此时的效果为：

![阴影图](https://img1.imgtp.com/2022/07/05/lDdQnzhS.png)

此时会发现，当给一个不是规则的图像时，这个阴影是加在整个图片的外围，而不是围绕着图像的内容，也许此时不是我们想要的结果。

#### 使用 `filter 的 drop-shadow()`

> [`filter属性中的drop-shadow()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter-function/drop-shadow) ：是创建一个符合图像本身形状 (alpha 通道) 的阴影

```html
    ...
    img {
        filter: drop-shadow(0 0 15px #bbb);
    }
    ...
    <img src="https://img1.imgtp.com/2022/07/05/YhZAaGbW.png" />
    ...
```

![阴影图](https://img1.imgtp.com/2022/07/05/lmTc31qL.png)

用这种方法会发现我们给图像添加的阴影是围绕着图像内容的
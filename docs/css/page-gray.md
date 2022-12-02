# 一行代码实现页面置灰

- [CSS3 filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)
> CSS属性 filter 将模糊或颜色偏移等图形效果应用于元素。滤镜通常用于调整图像、背景和边框的渲染。

#### filter 滤镜
```css
filter: none | blur() | contrast() | grayscale() | hue-rotate() | drop-shadow();
```

> grayscale() 函数将改变输入图像灰度。amount 的值定义了转换的比例。值为 100% 则完全转为灰度图像，值为 0% 图像无变化。值在 0% 到 100% 之间，则是效果的线性乘数。若未设置值，默认是 0。

```css
html {
    filter: grayscale(100%);
}

/** 如果想局部置灰可以在类里面使用 */
.gray-page {
    filter: grayscale(100%);
}
```
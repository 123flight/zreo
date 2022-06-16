# 关于 input 输入框类型为 File 时不能选择相同文件的问题

#### 场景

在做一个关于有多媒体文件上传的项目时考虑到是先上传之后拿到服务器返回的链接再进行本地预览
还是先在本地预览然后再上传服务器。我选择的是先在本地预览，在本地生成一个blob链接付给 image 标签的 src
属性，但是当我在做删除操作时，只是将 src 的值进行清空，然后将新上传的多媒体文件生成的blob链接赋给 image
这时神奇的事情发生了，做删除操作，然后选择相同的文件时是无法将新的链接给到 image ，这就导致选择的文件显示不出来。

#### 问题分析

首先上述做的删除操作只是将 src 值清空显然是不对的，导致这个问题的最主要原因是，将给 input 赋值之后，
下次再进行选择文件赋值时，input 会触发 onChange 事件，前后会对比两次的 value 是否相同，如果相同则不会再次进行选择。

#### 解决方法

其实只需要在做假删除的同时将input的value置空，或者上传赋值前先将input的value置空即可。

```html
...
document.getElementById('imageInput').value = null;
...
<input id="imageInput" type="file" accept="image/gif, image/png, image/jpeg" />
...
```

#### 注：当 input 的 type 为 file 时，accept 定义了文件的类型 [input的accept属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/file#attr-accept)
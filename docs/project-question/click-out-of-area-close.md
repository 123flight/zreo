# 点击某个元素外的部分隐藏或者关闭元素

> 项目中经常遇到这样的需求，一个小列表或者什么操作没有给关闭按钮，要求点击元素外的内容关闭此列表或者弹窗。

以我在 React 项目中的事例介绍一下使用

```js
    componentDidMount () {
        // ...
        document.addEventListener('click', this.closeDom.bind(this));
        // ...
    }
    
    closeDom = (event) => {
        // 获取操作的dom最外层一个
        const dom = document.getElementsByClassName('test')[0];
        // 如果鼠标点击的位置的路径不包含所要操作的部分则关闭
        if (!event.path.includes(dom)) {
            console.log('关闭');
        } else  {
            console.log('不关闭');
        }
    }

    componentWillUnmount () {
        window.removeEventListener('click', this.closeDom);
    }
```
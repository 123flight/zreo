# 解决鼠标关于鼠标移入移出元素时，元素抖动问题

#### 场景

当鼠标移动到列表展示的卡片上时，卡片展示特定按钮，移出元素时按钮消失

#### 第一次使用的方法 onMouseOver onMouseOut

这个方法是造成元素抖动的问题所在。这对事件是根据鼠标事件的 target 进行触发的，是一种精准触发。当为某一组件(如div)设置这两个事件时，
当事件的 target 是该组件时，就会触发 mouseover，但是当鼠标划到该组件的子组件上时，因为 target 改变了，所以就触发了 mouseout 事件，
这往往就会造成页面元素闪烁。

这对事件就导致每次经过子组件时，整个元素在疯狂抖动。

#### 第二次使用的方法 onMouseEnter onMouseLeave

这对事件是根据组件在页面的范围进行触发的，不管组件中是否有子组件，只要鼠标进入到组件的范围，就可以触发 mouseenter 事件，
离开范围，则触发 mouseleave 事件。

```jsx
    ...
    handleOnMouseEnter = () => {
        ...doSomethings
    }
    
    handleOnMouseLeave = () => {
        ...doSomethings
    }
    ...
    <div
        onMouseEnter={() => { this.handleOnMouseEnter() }}
        onMouseLeave={() => { this.handleOnMouseLeave() }}
    >
    ...
```
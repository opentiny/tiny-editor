# 标题列表

在线演示：[标题列表](/docs/demo/header-list)。

## 安装

```bash
npm install quill-header-list
```

## 使用

```js
import FluentEditor from '@opentiny/fluent-editor'
import HeaderList from 'quill-header-list'
import 'quill-header-list/dist/index.css'

FluentEditor.register({ 'modules/header-list': HeaderList }, true)

new FluentEditor('#editor', {
  theme: 'snow',
  modules: {
    'toolbar': {
      container: [[{ header: [null, 1, 2, 3, 4, 5, 6] }, 'header-list']],
      handlers: {
        'header-list': HeaderList.toolbarHandle,
      },
    },
    'header-list': {
      container: document.getElementById('directory'), // 指定一个元素来接收头部列表
    },
  },
})
```

## Options 配置

| 名称            | 类型                     | 描述                                                                         | 默认值      | 是否必选 |
| --------------- | ------------------------ | ---------------------------------------------------------------------------- | ----------- | -------- |
| container       | `string \| HTMLElement`  | 列表容器，字符串必须是元素的id                                               | -           | `true`   |
| scrollContainer | `string \| HTMLElement`  | 编辑器滚动容器，默认是 `quill.root`                                          | -           | `false`  |
| hideClass       | `number`                 | 列表隐藏时的类名                                                             | `is-hidden` | `false`  |
| topOffset       | `number \| () => number` | 从顶部的偏移量（单位为 `px`）                                                | `0`         | `false`  |
| headerHeight    | `number`                 | 编辑器中的头部高度，这是用于计算头部滚动高亮的，不要使h1和h6之间的高度差过大 | `36`        | `false`  |
| onBeforeShow    | `() => boolean`          | 在显示前触发，返回 `true` 将取消显示                                         | -           | `false`  |
| onBeforeHide    | `() => boolean`          | 在隐藏前触发，返回 `true` 将取消隐藏                                         | -           | `false`  |
| onItemClick     | `(id: string) => void`   | 点击列表项时触发，id是头部元素的id                                           | -           | `false`  |

## 其他

如果你的页面中有一个固定元素，你可以使用`topOffset`来返回该固定元素的高度，这样头部列表项的滚动位置就不会被固定元素遮盖。

```js
new FluentEditor('#editor', {
  theme: 'snow',
  modules: {
    'toolbar': [[{ header: [null, 1, 2, 3, 4, 5, 6] }, 'header-list']],
    'header-list': {
      container: document.getElementById('directory'), // 指定一个元素来接收头部列表
      topOffset: () => {
        // 获取固定元素的高度
        const navOffset = document.querySelector('.fixed')?.getBoundingClientRect().height || 0
        return navOffset
      },
      // 或者如果你已经知道高度
      // topOffset: 36,
    },
  },
})
```

想了解更多 quill-header-list 模块的使用说明，请参考：[https://github.com/opentiny/quill-header-list](https://github.com/opentiny/quill-header-list)。

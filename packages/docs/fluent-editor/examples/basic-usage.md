# 基本用法

通过 `new FluentEditor(selector, options)` 初始化编辑器实例，selector 是编辑器挂载的 DOM 节点，options 是配置项，最基本的用法就是配置 snow 主题。

默认工具栏配置是：

```javascript
[
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
]
```

:::demo src=examples/demos/basic-usage.vue
:::

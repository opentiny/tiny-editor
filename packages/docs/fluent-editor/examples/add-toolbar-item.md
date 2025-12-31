# 增加工具栏

通过覆盖 Quill 内部的 `ui/icons` 对象可以给工具栏增加自定义的图标，再结合 `Toolbar` 模块的 `addHandler` 方法，可以给工具栏图标增加自定义事件。

本示例增加点赞、点踩两个工具栏图标，点赞可以给文本设置绿色，点踩可以给文本设置红色。

:::demo src=examples/demos/add-toolbar-item.vue
:::

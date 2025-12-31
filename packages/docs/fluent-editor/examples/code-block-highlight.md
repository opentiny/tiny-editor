# 代码块高亮

使用代码块高亮需要安装 [`highlight.js`](https://highlightjs.org/) 插件。

如果 highlight.js 暴露在 `window` 上，你可以设置 `syntax` 模块为 `true` 可开启代码块高亮功能。

如果 highlight.js 没有暴露在 `window` 上，你需要将导入的 highlight.js 传递给 `syntax` 模块的 `hljs` 选项。

:::demo src=examples/demos/code-block-highlight.vue
:::

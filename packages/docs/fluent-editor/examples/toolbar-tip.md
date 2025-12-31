# 工具栏提示文字

## 安装

此功能为外部插件，使用前请安装[`quill-toolbar-tip`](https://www.npmjs.com/package/quill-toolbar-tip)插件，完整文档请查看[插件文档](https://github.com/opentiny/quill-toolbar-tip#quilltoolbartip)。

```bash
npm install quill-toolbar-tip
```

## 基础使用

内部提供函数`generateToolbarTip`用于适配`i18n`模块，如若禁用`i18n`模块，则需要手动传递参数。

> 注意注册模块名称请保持为`toolbar-tip`

:::demo src=examples/demos/toolbar-tip.vue
:::

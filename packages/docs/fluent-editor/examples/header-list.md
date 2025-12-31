# 标题列表

## 安装

此功能为外部插件, 使用前请安装[`quill-header-list`](https://www.npmjs.com/package/quill-header-list)插件，完整文档请查看[插件文档](https://github.com/opentiny/quill-header-list#quill-header-list)。

```bash
npm install quill-header-list
```

## 基本用法

创建一个元素用于存放标题列表，并将其传入`header-list`的`container`属性。

:::demo src=examples/demos/header-list.vue
:::

## 设置滚动容器

默认情况下，编辑器会指定自身为滚动容器，可通过传递`scrollContainer`属性来指定滚动容器。

当页面中存在`fixed`元素处于顶部时，你可能会需要进行额外的滚动 offset(比如此文档页面)，否则会导致滚动后的标题被`fixed`元素遮挡。可以设置`topOffset`额外滚动距离。

:::demo src=examples/demos/header-list-container.vue
:::

## 参数选项

| 名称            | 类型                     | 说明                                                   | 默认值      | 必填    |
| --------------- | ------------------------ | ------------------------------------------------------ | ----------- | ------- |
| container       | `string \| HTMLElement`  | 列表存放位置                                           | -           | `true`  |
| scrollContainer | `string \| HTMLElement`  | 滚动容器                                               | -           | `true`  |
| hideClass       | `number`                 | 隐藏时`container`类名                                  | `fe-hidden` | `false` |
| topOffset       | `number \| () => number` | 滚动距离顶部偏移量, 单位`px`                           | `0`         | `false` |
| onBeforeShow    | `() => boolean`          | 列表显示前执行回调, 返回`true`可阻止显示               | -           | `false` |
| onBeforeHide    | `() => boolean`          | 列表隐藏前执行回调, 返回`true`可阻止隐藏               | -           | `false` |
| onItemClick     | `(id: string) => void`   | 列表项点击后时执行回调, 参数`id`为对应跳转至的标题`id` | -           | `false` |

# 思维导图

TinyEditor 的思维导图功能依赖 `SimpleMindMap` ，使用前请先安装 `SimpleMindMap` 相关依赖。

```bash
npm install simple-mind-map
```

## 基础使用

通过配置工具栏按钮 `mind-map`，并启用 `mind-map`模块: `'mind-map': true` 可以开启思维导图功能。

:::demo src=demos/mind-map.vue
:::

## 背景样式

思维导图模块支持配置背景样式，可以配置背景颜色、图片等设置。

:::demo src=demos/mind-map-background.vue
:::

## 调整大小

思维导图模块支持调整思维导图的大小，拖动调整手柄可以改变思维导图的尺寸。

:::demo src=demos/mind-map-resize.vue
:::

## 连线样式

思维导图模块支持配置连线样式，可以配置连线颜色、样式等设置。其中曲线只在logicalStructure逻辑结构图和mindMap思维导图两种结构时生效。

:::demo src=demos/mind-map-line.vue
:::

## 主题样式

思维导图模块支持配置主题样式，传入主题名称即可。需要安装相关依赖 `simple-mind-map-plugin-themes`。需要注意的是设置了主题后改变的是节点，连线，背景等相关样式，所以设置了主题和背景样式和连线样式后，背景样式和连线样式会覆盖与其相关的主题样式。

```bash
npm install simple-mind-map-plugin-themes
```

:::demo src=demos/mind-map-theme.vue
:::

## 配置

### modules['mind-map'].background

| 属性               | 类型                                                                                                                                                              | 说明             | 默认值   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | -------- |
| backgroundColor    | `string`                                                                                                                                                          | 背景颜色         | -        |
| backgroundImage    | `string`                                                                                                                                                          | 背景图片 URL     | -        |
| backgroundRepeat   | `'repeat' \| 'repeat-x' \| 'repeat-y' \| 'no-repeat'`                                                                                                             | 背景图片重复方式 | 'repeat' |
| backgroundPosition | `'0% 0%' \|'left top' \| 'left center' \| 'left bottom' \| 'right top' \| 'right center' \| 'right bottom' \| 'center top' \| 'center center' \| 'center bottom'` | 背景图片位置     | '0% 0%'  |
| backgroundSize     | `'auto' \| 'cover' \| 'contain'`                                                                                                                                  | 背景图片大小     | 'auto'   |

### modules['mind-map'].resize

| 属性   | 类型      | 说明                     | 默认值 |
| ------ | --------- | ------------------------ | ------ |
| resize | `boolean` | 是否允许调整思维导图大小 | false  |

### modules['mind-map'].line

| 属性      | 类型                                | 说明     | 默认值  |
| --------- | ----------------------------------- | -------- | ------- |
| color     | `string`                            | 连线颜色 | -       |
| width     | `number`                            | 连线粗细 | -       |
| dasharray | `string`                            | 虚线样式 | -       |
| style     | `'curve' \| 'straight' \| 'direct'` | 连线风格 | 'curve' |

### modules['mind-map'].theme

| 属性  | 类型     | 说明                                                                                          | 默认值    |
| ----- | -------- | --------------------------------------------------------------------------------------------- | --------- |
| theme | `string` | [主题名称](https://wanglin2.github.io/mind-map-docs/api/constructor/constructor-options.html) | 'default' |

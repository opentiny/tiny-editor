# 流程图

TinyEditor 的流程图功能依赖 `LogicFlow` ，使用前请先安装 `LogicFlow` 相关依赖。

```bash
npm install @logicflow/core @logicflow/extension
```

## 功能说明

1. 通过左边控制面板可以拖拽节点添加到流程图中，也可以改变连线类型。通过右上控制面板可以缩小，放大，适应，全屏/恢复大小，撤退，恢复，隐藏控制面板功能。
2. 通过双击节点编辑节点内容，通过双击连线编辑连线内容。通过右键节点可以复制并粘贴节点，删除节点。通过右键连线可以删除连线内容，删除连线。
3. 鼠标悬停在节点上出现在四个角的手柄可以调整节点大小，右上方的手柄可以旋转节点，上下左右方向上的的手柄可以添加连线。
3. 该流程图模块支持配置网格样式，背景样式，调整大小。

## 基础使用

通过配置工具栏按钮 `flow-chart`，并启用 `flow-chart`模块: `'flow-chart': true` 可以开启流程图功能。

:::demo src=demos/flow-chart.vue
:::

## 网格样式

流程图模块支持配置网格样式，可以配置网格大小、颜色、类型等设置。

:::demo src=demos/flow-chart-grid.vue
:::

## 背景样式

流程图模块支持配置背景样式，可以配置背景颜色、图片等设置。

:::demo src=demos/flow-chart-background.vue
:::

## 调整大小

流程图模块支持调整流程图的大小，拖动调整手柄可以改变流程图的尺寸。

:::demo src=demos/flow-chart-resize.vue
:::

## 配置

### modules['flow-chart'].grid

| 属性             | 类型              | 说明                                       | 默认值  |
| ---------------- | ----------------- | ------------------------------------------ | ------- |
| size             | `number`          | 网格大小                                   | 20      |
| visible          | `boolean`         | 是否显示网格                               | true    |
| type             | `'dot' \| 'mesh'` | 网格类型，可选 'dot'(点状) 或 'mesh'(线状) | 'dot'   |
| config.color     | `string`          | 网格颜色配置                               | #ababab |
| config.thickness | `number`          | 网格线宽                                   | 1       |

### modules['flow-chart'].background

| 属性     | 类型                                                  | 说明                                       | 默认值   |
| -------- | ----------------------------------------------------- | ------------------------------------------ | -------- |
| color    | `string`                                              | 背景颜色                                   | -        |
| image    | `string`                                              | 背景图片 URL                               | -        |
| repeat   | `'repeat' \| 'repeat-x' \| 'repeat-y' \| 'no-repeat'` | 背景图片重复方式                           | 'repeat' |
| position | `string`                                              | 背景图片位置（CSS background-position 值） | 'center' |
| size     | `string`                                              | 背景图片大小（CSS background-size 值）     | 'auto'   |
| opacity  | `number`                                              | 背景透明度，取值范围 0-1                   | 1        |

### modules['flow-chart'].resize

| 属性   | 类型      | 说明                   | 默认值 |
| ------ | --------- | ---------------------- | ------ |
| resize | `boolean` | 是否允许调整流程图大小 | false  |

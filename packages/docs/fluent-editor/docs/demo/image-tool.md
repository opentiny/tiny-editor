# 图片操作

## 工具栏

点击图片可显示图片相关工具

:::demo src=demos/image-toolbar.vue
:::

## 工具栏按钮配置

可通过配置项 `modules.image.toolbar.buttons` 对工具栏按钮进行配置。默认存在 `align-left`、`align-center`、`align-right`、`copy`、`download` 五个按钮，可以自行增加按钮或者通过设置 `false` 关闭某个按钮。

:::demo src=demos/image-toolbar-button.vue
:::

## 配置

### modules.image.toolbar

| 属性                 | 类型                                          | 说明                  |
| -------------------- | --------------------------------------------- | --------------------- |
| mainClassName        | `string`                                      | toolbar 元素 class 名 |
| mainStyle            | `Record<string, string>`                      | toolbar 元素 style    |
| buttonClassName      | `string`                                      | button 元素 class 名  |
| addButtonSelectStyle | `boolean`                                     | 是否应用选中样式      |
| buttonStyle          | `Record<string, string>`                      | button 元素 style     |
| svgStyle             | `Record<string, string>`                      | button 中 icon style  |
| buttons              | `Record<string, ToolButtonOption \| boolean>` | toolbar 按钮配置      |

<details>
  <summary>ToolButtonOption</summary>

```ts
export interface ToolButtonOption {
  name: string
  icon: string
  isActive?: (el: HTMLElement) => boolean
  apply: (this: ImageToolbar, el: HTMLImageElement, toolbarButtons: ImageToolbarButtons) => void
}
```

</details>

### modules.image.overlay

| 属性      | 类型                     | 说明                  |
| --------- | ------------------------ | --------------------- |
| className | `string`                 | overlay 元素 class 名 |
| style     | `Record<string, string>` | overlay 元素 style    |

### modules.image.resize

| 属性            | 类型                     | 说明                           |
| --------------- | ------------------------ | ------------------------------ |
| handleClassName | `string`                 | resize 元素（拖拽块） class 名 |
| handleStyle     | `Record<string, string>` | resize 元素（拖拽块） style    |

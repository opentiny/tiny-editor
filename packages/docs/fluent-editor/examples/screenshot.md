# 截屏

## 基本用法

通过配置工具栏按钮 `screenshot`，可以开启截屏功能。

由于截屏功能依赖 [`html2canvas`](https://github.com/niklasvh/html2canvas)，需要安装 `html2canvas` 依赖包，并在初始化编辑器前将 `Html2Canvas` 变量暴露在 `window` 上。

```javascript
import Html2Canvas from 'html2canvas'
window.Html2Canvas = Html2Canvas
```

:::demo src=examples/demos/screenshot.vue
:::

## 上传截图

除了将 `Html2Canvas` 变量暴露在 `window` 上，还可以将 Html2Canvas 变量传入 screenshot 配置项中。

默认截图的格式是 Base64，你可以在 `screenshot.beforeCreateImage` 中处理截屏图片，将图片上传到服务器，再将服务器返回的图片 URL 显示到编辑器中。

:::demo src=examples/demos/screenshot-upload-to-server.vue
:::

## API

screenshot 配置项可传递 html2canvas 支持的配置选项, 具体请查看[官方文档](https://html2canvas.hertzen.com/configuration)。

除 html2canvas 支持的配置选项外，还支持以下配置：

| 名称                   | 类型                                                         | 说明                                                                                                                                 | 默认值 |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Html2Canvas            | `html2canvas`                                                | html2canvas 模块                                                                                                                     | -      |
| beforeCreateCanvas     | `() => void`                                                 | canvas 绘制前执行函数, 可在此阶段对页面 dom 进行处理                                                                                 | -      |
| beforeCreateImage      | `(canvas: HTMLCanvasElement) => HTMLCanvasElement \| string` | canvas 绘制完成后执行函数, 可通过返回字符串作为最终生成图片的 url 路径, 否则默认生成 base64 作为图片 url. 也可对 canvas 绘制进行调整 | -      |
| useCORS                | `boolean`                                                    | html2canvas 配置选项                                                                                                                 | `true` |
| foreignObjectRendering | `boolean`                                                    | html2canvas 配置选项                                                                                                                 | `true` |

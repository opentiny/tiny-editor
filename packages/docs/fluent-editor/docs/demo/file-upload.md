# 文件上传

## 基本用法

默认会处理视频与图片格式，其他格式统一被处理为文件显示

:::demo src=demos/file-upload.vue
:::

## 服务器端上传

在此示例中，编辑器设置了 mimetype 为 `'image/*'` 而仅接受图片文件，所以点击 toolbar 上的 video icon 不会触发文件选择。

通过 handler 回调函数模拟 local 图片上传，返回值为图片路径（显示为 chrome 浏览器图标），并且每次上传都会拒绝第 2n 个图片，通过第 2n+1 个图片。

在 fail 回调中，由于此文件上传失败，手动插入一个图片（显示为 edge 浏览器图标）以用于标识上传失败

所以，如果上传四张图片，最终的结果应该是： edge 浏览器图标、chrome 浏览器图标、edge 浏览器图标、chrome 浏览器图标

:::demo src=demos/file-upload-handle.vue
:::

## Options

| 名称      | 类型                                                                                           | 说明                                      | 默认值     |
| --------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------- |
| mimetypes | `string[]`                                                                                     | 允许上传文件的 mimetype                   | `['*']`    |
| maxSize   | `number`                                                                                       | 文件最大字节限制                          | `Infinity` |
| handler   | `(this: { quill: FluentEditor }, range: Range, files: File[]) => Promise<(string \| false)[]>` | 文件上传触发回调，返回值为文件路径        | -          |
| success   | `(this: { quill: FluentEditor }, file: File, range: Range) => void`                            | 针对 handler 单个返回结果成功后执行的回调 | -          |
| fail      | `(this: { quill: FluentEditor }, file: File, range: Range) => void`                            | 针对 handler 单个返回结果失败后执行的回调 | -          |

> 上传文件被 `mimetypes` 或 `maxSize` 筛选而上传失败的文件不会出现在 `handler` 回调参数中。
> 若文件是被`mimetypes` 或 `maxSize` 筛选而上传失败，fail 回调中的 `range` 则为上传初始位置，而不是上传失败的位置。

## 图片(image)模块的 Options

```typescript
const DefaultOptions = {
  // 默认情况下，`file://` 格式的本地文件路径在浏览器环境无法读取，因此会被转换成 `//:0`，但是在一些特殊的场景下（比如：Electron），需要获取到图片的原始路径，进行后续的上传处理
  // 注意：该选项一旦设置为 true，本地磁盘路径会暴露出去，这可能会带来安全风险，请确保你了解相关的安全隐患
  allowInvalidUrl: false,

  specs: [
    ImageSpec,
  ],
  overlay: {
    className: 'blot-formatter__overlay',
    style: {
      position: 'absolute',
      boxSizing: 'border-box',
      border: '1px dashed #444',
    },
  },
  toolbar: {
    mainClassName: 'blot-formatter__toolbar',
    mainStyle: {
      position: 'absolute',
      top: '-12px',
      right: '0',
      left: '0',
      height: '0',
      minWidth: '120px',
      font: '12px/1.0 Arial, Helvetica, sans-serif',
      textAlign: 'center',
      color: '#333',
      boxSizing: 'border-box',
      cursor: 'default',
      zIndex: '1',
    },
    buttonClassName: 'blot-formatter__toolbar-button',
    addButtonSelectStyle: true,
    buttonStyle: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      background: 'white',
      border: '1px solid #999',
      verticalAlign: 'middle',
      cursor: 'pointer',
    },
    svgStyle: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      background: 'white',
      verticalAlign: 'middle',
    },
    buttons: {
      'align-left': true,
      'align-center': true,
      'align-right': true,
      'copy': true,
      'download': true,
    },
  },
  resize: {
    handleClassName: 'blot-formatter__resize-handle',
    handleStyle: {
      position: 'absolute',
      height: '12px',
      width: '12px',
      backgroundColor: 'white',
      border: '1px solid #777',
      boxSizing: 'border-box',
      opacity: '0.80',
    },
  },
}
```

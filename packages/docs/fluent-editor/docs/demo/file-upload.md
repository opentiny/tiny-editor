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

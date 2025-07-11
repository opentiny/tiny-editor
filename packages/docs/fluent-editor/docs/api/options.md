# 配置项

通过以下方式可以初始化 TinyEditor 富文本编辑器。

```typescript
import FluentEditor from '@opentiny/fluent-editor'

const editor = new FluentEditor(container, options)
```

第一个参数 container 是用来配置富文本编辑器容器，可以是一个 CSS 选择器，也可以是一个 DOM 对象。

第二个参数 options 是一个对象，用来做一些编辑器配置，需要注意的是 TinyEditor 的 options 配置项在 Quill 的基础上做了一些扩展。

```typescript
import type { QuillOptions } from 'quill'

export interface FluentEditorOptions extends QuillOptions {
  modules?: QuillModules & {
    // 字符统计模块
    counter: boolean | CounterOption

    // 表情模块
    emoji?: boolean

    // 文件上传模块
    file?: boolean

    // 可编辑公式模块
    mathlive: boolean

    // @提醒模块
    mention?: boolean | MentionOptions
  }

  // 是否给超链接自动增加协议前缀
  autoProtocol?: boolean | string

  // 粘贴事件的回调函数
  editorPaste?: any

  // 上传配置项
  uploadOption?: {
    imageUpload?: ({ file, callback, editor }) => void
    imageAccept?: Array<string>[] | string
    fileAccept?: Array<string>[] | string
    fileUpload: ({ file, callback, editor }) => void
    isVideoPlay?: boolean
    maxSize?: number
    success?: (file: File) => void
    fail?: (file: File) => void
    multiple?: boolean
  }

  // 截屏配置项目
  screenshot?: Partial<ScreenShotOptions>

  // 国际化配置项
  i18n?: {
    lang?: string
    langText?: Record<string, string>
  }
}
```

更多配置项请参考 Quill 官方文档：[https://quilljs.com/docs/configuration](https://quilljs.com/docs/configuration)。

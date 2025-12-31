# 实例 API

通过以下方式可以初始化 TinyEditor 富文本编辑器，并获得 TinyEditor 实例对象。

```typescript
import FluentEditor from '@opentiny/fluent-editor'

// TinyEditor 实例对象
const editor = new FluentEditor(container, options)
```

TinyEditor 基于 Quill，因此 TinyEditor 的实例对象包含 Quill 实例对象的所有变量和方法。

这里仅列出几个常用的实例变量和实例方法。

## getModule

获取模块实例。

- 类型

```ts
class Quill {
  getModule(name: string): any
}
```

- 详细信息

name 是模块名称，比如工具栏模块是 `toolbar`，注意不是 `modules/toolbar`。

- 示例

```typescript
const toolbar = quill.getModule('toolbar')
const i18n = quill.getModule('i18n')
```

- 参考[国际化](/examples/i18n)

## getContents

获取编辑器的 Delta 数据。

- 类型

```typescript
class Quill {
  getContents(index: number = 0, length: number = remaining): Delta
}
```

- 详细信息

index 和 length 分别是内容的索引和长度，表示想要获取哪段内容的 Delta 数据，这两个参数都是可选的，都不传的话，会返回所有内容的 Delta 数据。

- 示例

```typescript
const delta = editor.getContents()
```

- 参考[获取内容](/examples/get-content)

## setContents

使用 Delta 数据设置编辑器内容，主要这个方法是全量覆盖编辑器里面的内容，如果想更新一部分内容，可以使用 updateContents 方法。

- 类型

```typescript
class Quill {
  setContents(delta: Delta, source: string = 'api'): Delta
}
```

- 详细信息

第一个参数是想要设置的 Delta 内容，第二个参数主要影响事件的触发。

- 示例

```typescript
editor.setContents([
  { insert: 'Hello ' },
  { insert: 'World!', attributes: { bold: true } },
  { insert: '\n' },
])
```

- 参考[内容初始化](/examples/set-content)

更多实例方法请参考 Quill 官方文档：[https://quilljs.com/docs/api](https://quilljs.com/docs/api)。

# 类 API

通过以下方式可以导入 FluentEditor 类。

```typescript
import FluentEditor from '@opentiny/fluent-editor'
```

FluentEditor 类继承自 Quill 类，包含了 Quill 类的全部静态变量和静态方法。

这里仅列出几个常用的静态方法。

## FluentEditor.import()

导入一个 FluentEditor 模块，这里导入的是模块类，而不是模块实例，如果要获取模块实例，需要调用 FluentEditor 示例的 editor.getModule() 方法。

这里的模块是一个泛指，主要包含：库(parchment / delta)、模块(modules/)、主题(themes/)、格式(formats/)。

- 类型

```typescript
class Quill {
  static import(path): any
}
```

- 详细信息

path 是需要导入的模块路径，比如 `modules/clipboard` 是粘贴板模块的路径，返回该模块类。

需要注意的是，通过 FluentEditor.import() 导入的模块都是经过 FluentEditor 增强的，不是原本的 Quill 模块，如果要导入 Quill 模块，可以使用 Quill.import() 方法。

- 示例

```typescript
const Parchment = FluentEditor.import('parchment')
const Delta = FluentEditor.import('delta')

const Toolbar = FluentEditor.import('modules/toolbar')
const Mention = FluentEditor.import('modules/mention')
const Mention = FluentEditor.import('themes/snow')
const Link = FluentEditor.import('formats/link')
```

## FluentEditor.register()

注册一个 FluentEditor 模块，只有注册过的模块才可以在 TinyEditor 中使用。

注册过的模块可以通过 FluentEditor.import() 进行导入。

这里的模块是一个泛指，主要包含：模块(modules/)、主题(themes/)、格式(formats/)。

- 类型

```typescript
class Quill {
  static register(format: Attributor | BlotDefinintion, supressWarning: boolean = false): void
  static register(path: string, def: any, supressWarning: boolean = false): void
  static register(defs: { [path: string]: any }, supressWarning: boolean = false): void
  static register(...args: any[]): void
}
```

- 详细信息

注册格式只需要直接传入格式类，内部会自动补全 path。

注册模块和主题需要手动传入 path 和对应的模块类、主题类。有两种注册方式：第一种方式是传入两个参数，第一个参数是模块 path，第二个参数是具体的模块类；第二种方式传入一个对象，对象 key 是 path，对象 value 是模块类，这种方式可以同时注册多个模块。

最后一个参数 supressWarning 是用来决定是否覆盖内部同名模块的，设置为 true 则会覆盖内部的同名模块。

- 示例

```typescript
const Module = Quill.import('core/module')

class CustomModule extends Module {}

// 第一种方式传入两个参数，第一个参数是模块 path，第二个参数是具体的模块类。
Quill.register('modules/custom-module', CustomModule)
```

```typescript
// 第二种方式传入一个对象，对象 key 是 path，对象 value 是模块类，这种方式可以同时注册多个模块。
Quill.register({
  'formats/custom-format': CustomFormat,
  'modules/custom-module-a': CustomModuleA,
  'modules/custom-module-b': CustomModuleB,
})

Quill.register(CustomFormat)
```

- 参考[工具栏提示](/examples/toolbar-tip)

更多静态变量和静态方法请参考 Quill 官方文档：[https://quilljs.com/docs/api](https://quilljs.com/docs/api)。

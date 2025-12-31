# 工具栏提示

在线演示：[工具栏提示](/examples/toolbar-tip)。

## 安装

```bash
npm install quill-toolbar-tip
```

## 使用

如果你想使用英文文本，你可以使用导出名为 `defaultToolbarTip` 的默认提示文本。

```ts
import FluentEditor from '@opentiny/fluent-editor'
import QuillToolbarTip, { defaultToolbarTip } from 'quill-toolbar-tip'
import 'quill-toolbar-tip/dist/index.css'

FluentEditor.register(
  {
    [`modules/${QuillToolbarTip.moduleName}`]: QuillToolbarTip,
  },
  true,
)

const QuillToolbarTipOption = {
  tipTextMap: defaultToolbarTip['en-US'],
}

const editor = new FluentEditor('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ color: [] }, { background: [] }],
    ],
    [QuillToolbarTip.moduleName]: QuillToolbarTipOption,
  },
})
```

或者你可以在 `tipTextMap` 中添加文本以在工具提示中显示。键与工具栏格式名称相匹配。

```ts
import QuillToolbarTip from 'quill-toolbar-tip'
import 'quill-toolbar-tip/dist/index.css'

FluentEditor.register(
  {
    [`modules/${QuillToolbarTip.moduleName}`]: QuillToolbarTip,
  },
  true,
)

const QuillToolbarTipOption = {
  tipTextMap: {
    bold: 'Bold',
    italic: 'Italic',
    color: {
      onShow(target, value) {
        return `Font Color${value ? `: ${value}` : ''}`
      },
    },
    background: {
      onShow(target, value) {
        return `Background Color${value ? `: ${value}` : ''}`
      },
    },
  },
}

const editor = new FluentEditor('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ color: [] }, { background: [] }],
    ],
    [QuillToolbarTip.moduleName]: QuillToolbarTipOption,
  },
})
```

你可以使用 `key:value` 来设置特定的提示。例如，要为项目符号列表设置提示文本“无序列表”，你可以使用 `'list:bullet': 'Unordered List'`。

```ts
const QuillToolbarTipOption = {
  tipTextMap: {
    'list:ordered': 'Ordered List',
    'list:bullet': 'Unordered List',
  },
}
```

你还可以为键设置一个选项，并使用 `onShow` 来计算工具提示的文本。但是，如果你使用了 `onShow` 选项，`msg` / `content` 或字符串值将被忽略。最终显示的文本将是项的值。

```ts
const QuillToolbarTipOption = {
  tipTextMap: {
    script: {
      onShow(target, value) {
        const text = {
          sub: 'Subscript',
          super: 'Superscript',
        }
        return text[value] || null
      },
    },
  },
}
```

## Options 配置

| 名称                  | 类型                                             | 描述                                                                                           |
| --------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| defaultTooltipOptions | `Partial<TooltipOptions>`                        | 默认工具提示选项                                                                               |
| tipTextMap            | `Record<string, Partial<TooltipItem> \| string>` | 工具提示文本映射。你也可以设置一个对象，该对象将在工具提示中使用。工具提示选项的配置如下所示： |

### TooltipOptions 配置

| 名称         | 描述                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| direction    | 工具提示显示的方向                                                            |
| delay        | 工具提示显示和隐藏前的延迟时间，单位为毫秒                                    |
| msg          | 工具提示的消息                                                                |
| content      | 工具提示的内容                                                                |
| className    | 工具提示的类名                                                                |
| tipHoverable | 当工具提示被悬停时显示工具提示。默认值为 `true`                               |
| onShow       | 工具提示显示时的回调函数。如果 `onShow`返回 `undefined`，则工具提示将不会显示 |

```ts
interface TooltipOptions {
  direction:
    | 'auto'
    | 'auto-start'
    | 'auto-end'
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end'
  msg: string
  delay: number
  content: HTMLElement
  className: string | string[]
  onShow: (target: HTMLElement) => string | HTMLElement | undefined
}
```

`msg` / `content` 和 `onShow` 在同一时间只有一个会生效，优先级顺序为 `onShow` > `content` > `msg`。

这意味着如果你设置了如下选项，最终显示的文本将是 'C'。

```js
const B = document.createElement('span')
B.textContent = 'B'

tipTextMap = {
  color: {
    msg: 'A',
    content: B,
    onShow() {
      return 'C'
    },
  },
}
```

`onShow` 的参数 `value` 是工具栏按钮或选择框的当前值。

```ts
interface TooltipItem extends Omit<TooltipOptions, 'onShow'> {
  onShow: (target: HTMLElement, value: string) => string | HTMLElement
}
```

`defaultTooltipOptions` 如下所示。

```ts
const tooltipDefaultOptions = {
  msg: '',
  delay: 150,
  direction: 'top',
  className: [] as string[],
}
```

想了解更多 quill-toolbar-tip 模块的使用说明，请参考：[https://github.com/opentiny/quill-toolbar-tip](https://github.com/opentiny/quill-toolbar-tip)。

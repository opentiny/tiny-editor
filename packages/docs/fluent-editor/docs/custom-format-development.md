# 自定义格式开发

FluentEditor 中的自定义格式开发使开发者能够通过创建自定义格式来扩展编辑器的富文本功能，这些格式定义了内容的渲染、存储和操作方式。本文档介绍了自定义格式开发的架构、实现模式和最佳实践。

## 格式架构概述

FluentEditor 基于 Quill 的 blot 系统，其中格式被实现为继承自特定 blot 类型的类。格式系统遵循分层结构，每个格式映射到 HTML 元素并定义内容表示的行为。

![]()


































## 格式类型与用例

### 块级嵌入格式

块级嵌入格式用于占据其自身块级元素的内容，通常用于媒体或复杂内容类型。

视频格式示例：video.ts

视频格式展示了一个完整的块级嵌入实现，包含清理、属性处理和 DOM 操作：

```typescript
export class Video extends BlockEmbed {
  static blotName = 'video'
  static tagName = 'VIDEO'
  static SANITIZED_URL = 'about:blank'
  static PROTOCOL_WHITELIST = ['http', 'https', 'blob']
  static className = 'ql-video'
 
  static sanitize(url) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL
  }
 
  static create(value) {
    const node = super.create(value) as HTMLElement
    node.setAttribute('contenteditable', 'false')
    node.setAttribute('controls', 'controls')
    VIDEO_ATTRIBUTES.forEach((key) => {
      if (value[key]) {
        switch (key) {
          case 'src':{ 
            const src = Video.sanitize(value[key])
            node.setAttribute(key, src)
            break
          }
          case 'title': {
            node.setAttribute(key, value[key])
            break
          }
          default: {
            node.dataset[key] = value[key]
          }
        }
      }
    })
    return node
  }
 
  static value(domNode) {
    const formats: any = {}
    VIDEO_ATTRIBUTES.forEach((key) => {
      const value = domNode.getAttribute(key) || domNode.dataset[key]
      if (value) {
        formats[key] = value
      }
    })
    return formats
  }
}
```

> 始终对外部内容（如 URL）实施清理以防止 XSS 攻击。视频格式包含一个协议白名单，仅允许特定的安全协议。

### 内联格式

内联格式应用于文本片段，通常在块内修改文本外观或行为。

删除线格式示例：strike.ts

简单的内联格式只需最少的实现：

```typescript
export class StrikeBlot extends Inline {
  static blotName = 'strike'
  static tagName = 'u'
  static className = 'ql-custom-strike'
}
```

表情符号格式示例：emoji.ts

另一个采用不同样式方法的内联格式示例：

```typescript
export class EmojiBlot extends Inline {
  static blotName = 'emoji'
  static tagName = 'span'
  static className = 'ql-emoji-format'
}
```

### 嵌入格式

嵌入格式是包含自包含内容的内联级元素。

软换行格式示例：soft-break.ts

软换行格式展示了优化逻辑和长度计算：

```typescript
export class SoftBreak extends Embed {
  static blotName = 'soft-break'
  static tagName = 'BR'
  static className = 'ql-soft-break'
  remove: () => void
 
  static create() {
    const node = super.create()
    return node
  }
 
  optimize() {
    // 移除列表项边界的软换行
    if (this.prev === null) {
      this.remove()
    }
  }
 
  length() {
    return 1
  }
}
```

> 实现 optimize() 方法以处理边界情况并提高性能。软换行格式在位于列表项边界时会自动移除，以防止无效的 HTML 结构。

## 格式注册流程

所有自定义格式都必须在 FluentEditor 实例中注册才能使用。注册过程在主编辑器初始化文件中进行。

注册示例：fluent-editor.ts

```typescript
FluentEditor.register(
  {
    'formats/emoji': EmojiBlot,
    'formats/softBreak': SoftBreak,
    'formats/strike': StrikeBlot,
    'formats/video': Video,
    'formats/divider': DividerBlot,
    'formats/link': LinkBlot,
    // ... 其他格式和模块
  },
  true, // 覆盖内部模块
)
```

## 开发指南

### 必需的静态属性

每个自定义格式都必须定义这些核心静态属性：

属性	类型	描述	示例
blotName	string	格式的唯一标识符	'video'
tagName	string	HTML 元素标签名	'VIDEO'
className	string	用于样式的 CSS 类	'ql-video'

### 核心方法实现

#### create(value) 方法

负责从格式值创建 DOM 元素：

```typescript
static create(value) {
  const node = super.create(value) as HTMLElement
  // 自定义初始化逻辑
  return node
}
```

#### value(domNode) 方法

从 DOM 元素中提取格式值：

```typescript
static value(domNode) {
  // 提取并返回格式数据
  return formats
}
```

#### sanitize() 方法（可选）

验证和清理输入值：

```typescript
static sanitize(value) {
  // 返回清理后的值或默认值
  return isValid ? value : defaultValue
}
```

### 格式选择指南

| 格式类型 | 用例 | 示例 |
| -- | -- | -- |
| BlockEmbed | 媒体、复杂内容、自包含块 | Video、Divider、File |
| Inline | 文本样式、内联内容装饰 | Strike、Emoji、Link |
| Embed	 | 内联自包含元素 | SoftBreak、Mention |

## 最佳实践

- 安全性：始终清理外部输入，特别是 URL 和用户内容
- 性能：为可能需要清理的复杂格式实现 `optimize()` 方法
- 可访问性：使用语义化 HTML 元素并提供适当的 ARIA 属性
- 样式：使用一致的 CSS 类命名约定（`ql-format-name`）
- 验证：在 `sanitize()` 方法中实现全面的输入验证

## 与模块的集成

自定义格式通常与编辑器模块协同工作。例如，视频格式与工具栏模块集成以实现插入功能，与剪贴板模块集成以实现复制粘贴操作。

有关模块集成的详细信息，请参阅 模块注册与配置 和 创建自定义模块。

## 下一步

开发完自定义格式后，你需要了解更广泛的注册系统：

- 格式注册与 Blot 系统：深入了解注册过程和 blot 架构
- 模块注册与配置：了解格式如何与模块系统集成
- 创建自定义模块：为自定义格式开发支持模块

自定义格式系统为扩展 FluentEditor 的功能提供了强大的基础，同时保持与现有架构的一致性。

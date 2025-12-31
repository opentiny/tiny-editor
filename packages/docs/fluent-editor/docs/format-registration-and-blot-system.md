# 格式注册与 Blot 系统

FluentEditor 中的格式注册和 Blot 系统通过 Quill 的 Parchment 框架，为扩展编辑器的格式化功能提供了强大的架构。该系统使开发者能够创建自定义格式、样式属性器和可嵌入内容类型，这些都能与编辑器的核心功能无缝集成。

## 核心架构

FluentEditor 构建于 Quill 的 blot 系统之上，该系统将所有内容表示为具有关联行为的 DOM 节点。注册过程在编辑器初始化期间进行，并遵循分层模式：

![]()












注册系统集中在主 FluentEditor 类中，所有格式、属性器和模块都通过 true 参数注册，以覆盖默认的 Quill 实现。

## 样式属性器

样式属性器为文本元素提供内联 CSS 样式功能。FluentEditor 包含四个核心属性器：

### 字体大小和样式

- SizeStyle: 使用 Parchment.Scope.INLINE 将 font-size 应用于内联元素
- FontStyle: 使用 Parchment.Scope.INLINE 将 font-family 应用于内联元素

### 块级样式

- LineHeightStyle: 使用 Parchment.Scope.BLOCK 将 line-height 应用于块级元素
- TextIndentStyle: 使用 Parchment.Scope.BLOCK 将 text-indent 应用于块级元素

> 样式属性器使用 Parchment 的 StyleAttributor 类，该类自动处理 DOM 属性和 Delta 操作之间的双向转换。

## 自定义格式 Blots

### Inline Blots

EmojiBlot: 扩展 Quill 的 Inline blot，以特定样式渲染表情内容：

- blotName: 'emoji'
- tagName: 'span'
- className: 'ql-emoji-format'

StrikeBlot: 使用带有自定义样式的 `<u>` 元素提供文本删除线功能：

- blotName: 'strike'
- tagName: 'u'
- className: 'ql-custom-strike'

### Embed Blots

SoftBreak: 扩展 Quill 的 Embed blot，实现智能优化的软换行：

- 自动移除列表边界的软换行
- 返回长度为 1 个字符
- 使用带有 'ql-soft-break' 类的 `<BR>` 元素

### Block Embed Blots

Video: 用于视频内容的综合 BlockEmbed 实现，具有安全特性：

| 特性 | 实现 |
| -- | -- |
| 安全性 | 使用协议白名单（http, https, blob）进行 URL 清理 |
| 属性 | 支持 id、title 和 src 属性 |
| 控件 | 自动添加 contenteditable=false 和 controls 属性 |
| 回退 | 对无效 URL 使用 'about:blank' |

> Video blot 通过在 DOM 插入前实现 URL 清理来展示高级安全模式，防止通过恶意视频源进行 XSS 攻击。

## 注册模式

注册遵循一致的命名约定，映射到 Quill 的内部结构：

```typescript
FluentEditor.register({
  // 属性器（基于样式）
  'attributors/style/font': FontStyle,
  'attributors/style/size': SizeStyle,
  
  // 格式（基于内容）
  'formats/emoji': EmojiBlot,
  'formats/video': Video,
  
  // 模块（基于功能）
  'modules/toolbar': BetterToolbar,
  'modules/clipboard': CustomClipboard
}, true)
```

这种双重注册方法确保了与 Quill 内部 API 和 FluentEditor 扩展功能的兼容性。

## 扩展系统

要创建自定义格式，请遵循以下模式：

1. 选择合适的基类：

- Inline 用于文本级格式化
- Embed 用于内联原子内容
- BlockEmbed 用于块级原子内容

2. 定义必需的静态属性：

- blotName: 唯一标识符
- tagName: HTML 元素类型
- className: 用于样式的 CSS 类

3. 实现生命周期方法：

- static create(): DOM 节点创建
- static value(): 从 DOM 提取数据
- optimize(): 性能优化

4. 注册两个路径以实现最大兼容性。

格式注册和 Blot 系统为扩展 FluentEditor 功能提供了坚实的基础，同时保持与 Quill 架构的一致性。有关实际实现示例，请参阅自定义格式开发并探索 formats 目录 中的内置格式实现。

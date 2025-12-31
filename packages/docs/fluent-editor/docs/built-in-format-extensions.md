# 内置格式扩展

FluentEditor 通过一套全面的内置格式扩展增强了 Quill 的格式化功能，提升了富文本编辑体验。这些扩展分为两大类：用于结构化内容元素的 Blot Formats 和用于文本样式属性的 Attributor Styles。

## Blot Format Extensions

Blot formats 定义了可以嵌入编辑器内容的结构化元素。FluentEditor 提供了四种基本的内置 blot formats：

### Emoji Format

EmojiBlot 类扩展了 Quill 的 Inline blot，提供标准化的 emoji 渲染 emoji.ts。它创建具有一致样式的 emoji 元素：

- Blot Name: emoji
- HTML Tag: `<span>`
- CSS Class: ql-emoji-format

### Soft Break Format

SoftBreak 类扩展了 Quill 的 Embed blot，处理内容中的换行 soft-break.ts。主要特性包括：

- Blot Name: soft-break
- HTML Tag: `<BR>`
- CSS Class: ql-soft-break
- Auto-optimization: 自动移除列表边界的软换行以确保正确的格式

### Strike Format

StrikeBlot 类扩展了 Quill 的 Inline blot，实现文本删除线功能 strike.ts。配置如下：

- Blot Name: strike
- HTML Tag: `<u>` (利用带自定义样式的下划线标签)
- CSS Class: ql-custom-strike

### Video Format

Video 类扩展了 Quill 的 BlockEmbed blot，提供全面的视频嵌入功能 video.ts。高级特性包括：

- Blot Name: video
- HTML Tag: `<VIDEO>`
- CSS Class: ql-video
- Security: 使用协议白名单 (http, https, blob) 进行 URL 净化
- Attributes: 支持 id、title 和 src 属性
- Controls: 自动设置 contenteditable=false 和 controls 属性

## Attributor Style Extensions

Attributor styles 定义了可应用于内容的文本格式属性。FluentEditor 包含四个核心样式 attributors：

### Font Size Style

SizeStyle attributor 管理字体大小格式 font-size.ts：

- Attribute: size
- CSS Property: font-size
- Scope: 仅限内联元素

### Font Style

FontStyle attributor 处理字体系列格式 font-style.ts：

- Attribute: font
- CSS Property: font-family
- Scope: 仅限内联元素

### Line Height Style

LineHeightStyle attributor 控制行间距 line-height.ts：

- Attribute: line-height
- CSS Property: line-height
- Scope: 块级元素

### Text Indent Style

TextIndentStyle attributor 管理段落缩进 text-indent.ts：

- Attribute: text-indent
- CSS Property: text-indent
- Scope: 块级元素

## Format Registration Architecture

所有内置格式通过格式索引 formats/index.ts 和 attributor 索引 attributors/index.ts 集中导出，确保在整个编辑器实例中的一致注册和可用性。

> 格式扩展遵循 Quill 的 Parchment 架构，其中每个格式扩展特定的 blot 类型（Inline、Embed、BlockEmbed）或使用 StyleAttributor 进行基于 CSS 的样式设计。这确保了与 Quill 核心编辑引擎的无缝集成，同时保持 FluentEditor 的增强功能。

## Integration Pattern

这些内置格式扩展在 FluentEditor 初始化时自动注册，无需额外配置即可立即访问增强的格式功能。每个格式设计时都保持与 Quill 标准格式的向后兼容性，同时添加 FluentEditor 特有的功能和样式。

对于希望超越这些内置格式的开发者，下一步是探索 [Custom Format Development](./custom-format-development.md)，其中详细介绍了如何按照这些内置扩展建立的相同架构模式创建自定义 blot formats 和 attributors。

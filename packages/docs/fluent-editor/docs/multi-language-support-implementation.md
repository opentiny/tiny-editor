# 多语言支持实现

FluentEditor 提供了一套全面的国际化（i18n）系统，使开发者能够轻松为其富文本编辑器实例实现多语言支持。该系统基于集中式语言管理架构构建，处理文本翻译、动态语言切换以及与各种 UI 组件的集成。

## 架构概述

多语言支持系统通过围绕 I18N 类和语言资源文件的模块化架构实现。系统采用基于注册的模式，语言包全局注册，并可动态应用于编辑器实例。

![]()









## 核心组件

### I18N 模块

I18N 类作为核心语言管理系统，具有以下关键职责：

- 语言注册：通过静态 register() 方法管理多个语言包
- 文本解析：提供 parserText() 处理国际化文本模式
- 动态切换：通过 changeLanguage() 方法支持运行时语言更改

该模块通过 isCover 参数支持完整语言替换和增量更新，实现灵活的语言包管理。

### 语言资源文件

FluentEditor 内置对英语和中文的支持：

- 英语 (en-US)：包含 140+ 个翻译条目，覆盖所有 UI 元素 packages/fluent-editor/src/config/i18n/en-us.ts
- 中文 (zh-CN)：提供全面的中文本地化 packages/fluent-editor/src/config/i18n/zh-cn.ts

每个语言文件导出一个常量对象，包含键值对，其中键表示文本标识符，值包含翻译字符串。

## 实现细节

### 编辑器集成

FluentEditor 类通过 i18n 支持扩展了 Quill 的功能：

```typescript
get lang() {
  const i18nModule = this.getModule('i18n') as I18N
  return i18nModule ? i18nModule.options.lang : defaultLanguage
}
 
getLangText(name: string) {
  return I18N.parserText(name, this.lang)
}
```

### 工具栏国际化

工具栏系统通过 generateToolbarTip 函数自动与 i18n 模块集成。当语言更改发生时，所有工具提示都会使用适当的翻译重新生成。

系统支持不同的工具提示类型：

- 按钮工具提示：带有可选键盘快捷键的简单文本
- 选择工具提示：下拉菜单的动态文本生成
- 值控制工具提示：基于当前状态的上下文感知文本

### 语言注册流程

编辑器初始化期间，语言包全局注册：

```typescript
I18N.register(
  {
    'en-US': EN_US,
    'zh-CN': ZH_CN,
  },
  true,
)
```

这确保所有编辑器实例都可以访问可用语言，无需单独注册。

## 配置选项

### 基本语言设置

初始化期间配置编辑器语言：

```typescript
const editor = new FluentEditor('#editor', {
  modules: {
    i18n: {
      lang: 'zh-CN'  // 或 'en-US'
    }
  }
})
```

### 动态语言切换

运行时更改语言：

```typescript
const i18nModule = editor.getModule('i18n')
i18nModule.changeLanguage({ lang: 'en-US' })
```

系统发出 CHANGE_LANGUAGE_EVENT，触发所有组件的 UI 更新。

> 语言更改事件自动更新所有 UI 元素，包括工具提示、对话框消息和错误通知，无需手动刷新。

## 自定义语言实现

### 创建新语言包

添加对其他语言的支持：

- 在 src/config/i18n/ 中创建新语言文件
- 导出包含所有必需翻译键的常量
- 编辑器初始化期间注册语言

示例结构：

```typescript
// src/config/i18n/fr-fr.ts
export const FR_FR = {
  'bold': 'Gras',
  'italic': 'Italique',
  'underline': 'Souligné',
  // ... 所有其他翻译
}
```

### 扩展现有语言

对于部分语言更新或自定义术语：

```typescript
I18N.register({
  'en-US': {
    'custom-feature': 'My Custom Feature'
  }
}, false)  // false = 与现有翻译合并
```

> 扩展现有语言时使用 isCover: false 选项，以在添加新翻译的同时保留原始翻译。

## 支持的文本类别

i18n 系统涵盖全面的 UI 元素：

| 类别 | 示例 | 目的 |
| -- | -- | -- |
| 格式化 | 'bold', 'italic', 'underline' | 文本样式选项 |
| 布局 | 'align-left', 'indent-+1' | 内容排列 |
| 插入 | 'image', 'table', 'link' | 内容插入工具 |
| 操作 | 'undo', 'redo', 'save' | 用户操作 |
| 消息 | 'loading', 'img-error'	状态通知 |
| 表格操作 | 'InsertRow', 'MergeCell' | 表格特定操作 |

## 最佳实践

1. 一致的键命名：使用描述性、分层的键（例如 'table-insert-row'）
2. 完整覆盖：确保所有面向用户的文本都已国际化
3. 回退处理：系统自动回退到默认语言处理缺失翻译
4. 事件驱动更新：利用语言更改事件实现动态 UI 更新

FluentEditor 中的多语言支持实现为创建真正的国际化富文本编辑体验提供了坚实的基础，同时保持出色的性能和开发者体验。

对于高级自定义，探索主题定制和样式以协调语言更改与视觉主题，或参考模块配置选项了解详细的 i18n 模块设置。

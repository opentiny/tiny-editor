# 自定义主题开发

本指南为在 FluentEditor 中创建和自定义主题提供了全面的文档，涵盖了主题架构、样式系统以及面向高级开发者的实现模式。

## 主题架构概述

FluentEditor 的主题系统基于 Quill 的主题架构构建，并进行了重要扩展以增强功能。核心主题实现位于 SnowTheme 类中，该类扩展了 Quill 的原始 Snow 主题。

![]()


## 核心主题实现

### 主题类结构

`SnowTheme` 类作为主题开发的基础，继承自 Quill 的基础主题，同时添加了 FluentEditor 特定的增强功能：

```typescript
class SnowTheme extends OriginSnowTheme {
  constructor(public quill: FluentEditor, options: ThemeOptions) {
    super(quill, options)
    this.quill.emitter.on(CHANGE_LANGUAGE_EVENT, () => {
      this.i18nTextToolbar()
    })
  }
}
```

主题构造函数建立国际化事件监听器并初始化核心主题功能。

### 模块配置

主题通过 DEFAULTS 对象定义默认模块配置，该对象指定工具栏处理程序、键盘绑定和模块选项：

```typescript
OriginSnowTheme.DEFAULTS = {
  modules: {
    'i18n': true,
    'toolbar': {
      handlers: {
        'formula': function () { /* ... */ },
        'undo': function () { this.quill.history.undo() },
        'redo': function () { this.quill.history.redo() },
        'fullscreen': fullscreenHandler,
        // ... additional handlers
      }
    }
  }
}
```

此配置结构允许全面自定义编辑器行为和工具栏功能。

## 样式系统架构

### CSS 自定义属性

FluentEditor 利用 CSS 自定义属性实现动态主题，在变量系统中定义：

```scss
:root {
  @include common.setCssVar(editor-bg-color, #ffffff);
}
 
:root.dark {
  @include common.setCssVar(editor-bg-color, #161618);
}
```

系统使用命名空间前缀 (`fe`) 避免冲突并支持暗模式变体。

### SCSS 架构

样式系统按功能模块化组织：

```scss
@use './common' as *;
@use './video.scss' as *;
@use './variable.scss' as *;
@use './mention';
@use './toolbar';
@use './editor' as *;
// ... additional modules
```

每个模块通过主样式文件导入，实现选择性样式和可维护的架构。

### 配置系统

通用配置提供共享变量和 mixins：

```scss
$defaultFontSize: 14px;
$namespace: fe;
$fullscreenZIndex-normal: 50;
$fullscreenZIndex-full: 51;
```

这些常量确保主题实现的一致性。

## 自定义主题开发

### 创建自定义主题

要创建自定义主题，扩展基础 SnowTheme 类：

```typescript
import SnowTheme from '@opentiny/fluent-editor/themes/snow'
import FluentEditor from '@opentiny/fluent-editor/core/fluent-editor'
 
class CustomTheme extends SnowTheme {
  constructor(quill: FluentEditor, options: ThemeOptions) {
    super(quill, options)
    // Custom initialization
  }
  
  // Override methods as needed
  extendToolbar(toolbar) {
    super.extendToolbar(toolbar)
    // Custom toolbar extensions
  }
}
```

### 自定义配色方案

通过修改主题常量定义自定义调色板：

```typescript
const CUSTOM_COLORS = [
  '',
  'rgb(255, 255, 255)',
  'rgb(0, 0, 0)',
  // Add your custom colors
  'rgb(41, 114, 244)',  // Primary blue
  'rgb(49, 155, 98)',   // Success green
  'rgb(222, 60, 54)',   // Error red
  'custom'
]
```

颜色系统支持预定义颜色和自定义颜色选择。

### 自定义工具栏样式

利用提供的 mixins 实现一致的工具栏组件样式：

```scss
@use './common' as *;
 
.custom-toolbar {
  @include common.toolbarPicker('content', 120px);
  
  .ql-picker-label {
    @include common.arrowIcon;
  }
  
  .ql-active,
  &:hover {
    color: #your-brand-color;
  }
}
```

mixin 系统为工具栏组件提供可重用的样式模式。

## 高级自定义

### 暗模式实现

通过扩展 CSS 自定义属性实现暗模式：

```scss
:root.dark {
  @include common.setCssVar(editor-bg-color, #161618);
  @include common.setCssVar(text-color, #ffffff);
  @include common.setCssVar(border-color, #363636);
}
 
html.dark .ql-toolbar {
  background-color: getCssVar(editor-bg-color);
  border-color: getCssVar(border-color);
}
```

引用自定义属性时始终使用 getCssVar() 函数，以确保正确的命名空间和可维护性。

### 自定义模块集成

通过扩展主题的模块配置集成自定义模块：

```typescript
const customThemeConfig = {
  modules: {
    ...SnowTheme.DEFAULTS.modules,
    'custom-module': {
      handler: customHandler,
      options: customOptions
    }
  }
}
```

### 响应式设计

使用 SCSS mixins 实现响应式工具栏布局：

```scss
@mixin responsiveToolbar {
  @media (max-width: 768px) {
    .ql-toolbar {
      flex-wrap: wrap;
      
      .ql-formats {
        flex: 1 1 100%;
      }
    }
  }
}
```

## 实现模式

### 主题注册

向 FluentEditor 注册自定义主题：

```typescript
import FluentEditor from '@opentiny/fluent-editor'
 
FluentEditor.register('themes/custom', CustomTheme)
 
const editor = new FluentEditor('#editor', {
  theme: 'custom',
  modules: { /* ... */ }
})
```

### 样式导入策略

在应用程序中高效导入主题样式：

```scss
@use 'sass:meta';
 
// Core styles
@include meta.load-css('@opentiny/fluent-editor/style.scss');
 
// Additional plugin styles
@include meta.load-css('quill-table-up/index.css');
@include meta.load-css('quill-header-list/dist/index.css');
```

此模式在项目结构中演示。

## 最佳实践

### 性能优化

- 使用 CSS 自定义属性进行动态主题，以最小化重绘
- 利用 SCSS mixins 实现一致的样式模式
- 对主题特定资源实施延迟加载

### 可维护性

- 遵循使用 fe 命名空间的既定命名约定
- 按功能模块化样式
- 记录自定义配色方案和设计令牌

### 可访问性

- 确保文本和背景有足够的对比度
- 为交互元素提供焦点指示器
- 支持高对比度模式变体

> 创建自定义主题时，通过保留预期的类结构和方法签名来维护与现有模块系统的兼容性。

## 后续步骤

要全面开发主题，请探索这些相关主题：

- 理解 FluentEditor 类结构 - 了解核心编辑器架构
- 模块注册和配置 - 了解如何集成自定义模块
- 多语言支持实现 - 在主题中实现国际化

主题系统为创建自定义编辑器体验提供了坚实的基础，同时保持与 FluentEditor 生态系统的一致性。

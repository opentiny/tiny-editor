# 主题定制与样式

FluentEditor 提供了一套完整的主题系统，允许开发者通过 CSS 变量、主题配置和模块化样式方法自定义编辑器外观。主题架构围绕 Snow 主题扩展构建，支持浅色和深色模式。

## 主题架构概述

FluentEditor 的主题系统采用模块化架构，样式被组织到独立的 SCSS 文件中，并通过 CSS 自定义属性进行管理。主主题类扩展了 Quill 的 Snow 主题，同时添加了自定义功能和样式能力。

![](../public/images/主题架构概述.png)

## 核心主题配置

### SnowTheme 类结构

SnowTheme 类是 FluentEditor 视觉外观的基础，扩展了 Quill 原生的 Snow 主题并增强了功能：

- 构造函数：初始化主题，支持国际化和语言变更事件监听
- 选择器管理：处理颜色、字体、大小和对齐选择器，支持自定义选项
- 工具栏扩展：通过自定义处理器和样式扩展工具栏功能

### 调色板系统

FluentEditor 包含预定义的调色板，提供 60+ 种按强度级别组织的颜色：

```typescript
const COLORS = [
  '', // 清除/默认
  'rgb(255, 255, 255)', 'rgb(0, 0, 0)', // 基础颜色
  'rgb(72, 83, 104)', 'rgb(41, 114, 244)', // 主色调
  // ... 60+ 预定义颜色
  'custom' // 自定义颜色选项
]
```

颜色系统包括：

- 标准颜色：基础黑、白和灰度值
- 品牌颜色：主色调蓝、绿、红和橙色变体
- 色度变化：每种颜色提供 5 个强度级别
- 自定义支持：内置自定义颜色选择器功能

## CSS 变量系统

FluentEditor 使用 CSS 自定义属性实现动态主题，支持运行时主题切换而无需页面刷新。

### 变量结构

CSS 变量在 fe 命名空间（FluentEditor）下组织：

```css
:root {
  @include common.setCssVar(editor-bg-color, #ffffff);
}
 
:root.dark {
  @include common.setCssVar(editor-bg-color, #161618);
}
```

### 可用的 CSS 变量

- --fe-editor-bg-color：主编辑器背景色
- --fe-text-color：工具栏提示文本颜色
- --fe-bg-color：工具栏提示背景颜色

变量系统通过基于类的切换支持浅色和深色主题。

## 模块化 SCSS 架构

FluentEditor 的样式被组织到模块化 SCSS 文件中，以提高可维护性并支持选择性导入：

### 核心样式模块

主 style.scss 文件协调所有样式模块：

```scss
@use './common' as *;
@use './video.scss' as *;
@use './variable.scss' as *;
@use './mention';
@use './toolbar';
@use './editor' as *;
@use './counter';
// ... 其他模块
```

### 组件特定样式

每个主要组件都有自己的 SCSS 模块：

- 工具栏：toolbar.scss - 完整的工具栏样式和选择器配置
- 编辑器：editor.scss - 主编辑区域样式和内容格式化
- 通用：common.scss - 共享 mixins、工具函数和辅助函数
- 变量：variable.scss - CSS 变量定义和主题切换

### 工具 Mixins

系统为常见样式模式提供可复用的 mixins：

```scss
@mixin toolbarPicker($content, $width: 40px) {
  // 标准化选择器样式
}
 
@mixin fontSizeList {
  // 字体大小下拉样式
}
 
@mixin lineHeightList {
  // 行高下拉样式
}
```

## 自定义主题开发

### 创建自定义主题

创建自定义主题，需扩展基础 SnowTheme 类：

```typescript
import SnowTheme from '../themes/snow'
 
class CustomTheme extends SnowTheme {
  constructor(quill: FluentEditor, options: ThemeOptions) {
    super(quill, options)
    // 自定义初始化
  }
  
  // 重写方法实现自定义行为
  extendToolbar(toolbar) {
    super.extendToolbar(toolbar)
    // 自定义工具栏扩展
  }
}
```

### CSS 变量自定义

覆盖 CSS 变量实现自定义主题：

```scss
:root.custom-theme {
  @include common.setCssVar(editor-bg-color, #f8f9fa);
  // 其他自定义变量
}
```

### 模块化样式覆盖

针对特定组件样式：

```scss
// 自定义工具栏样式
.ql-toolbar.ql-snow {
  background-color: your-custom-color;
  border: your-custom-border;
}
 
// 自定义编辑器样式
.ql-editor {
  font-family: your-custom-font;
  // 其他编辑器自定义
}
```

## 主题配置选项

### 字体和排版

FluentEditor 通过预定义常量支持可自定义排版：

```typescript
const FONTS = [false, 'serif', 'monospace']
const HEADERS = ['1', '2', '3', false]
const SIZES = ['small', false, 'large', 'huge']
const LINEHEIGHT = [false, '1.2', '1.5', '2']
```

### 对齐和布局

文本对齐选项可配置：

```typescript
const ALIGNS = [false, 'center', 'right']
```

### 图标系统

主题包含自定义图标字体系统：

```scss
@font-face {
  font-family: 'iconfont';
  src: url('./iconfont/iconfont.woff2') format('woff2'),
       url('./iconfont/iconfont.woff') format('woff'),
       url('./iconfont/iconfont.ttf') format('truetype');
}
```

## 深色模式实现

FluentEditor 通过 CSS 类切换提供内置深色模式支持：

### 深色模式激活

应用 .dark 类启用深色主题：

```html
<html class="dark">
  <!-- FluentEditor 将自动使用深色主题 -->
</html>
```

### 深色模式变量

深色模式覆盖定义在主题系统中：

```scss
:root.dark {
  @include common.setCssVar(editor-bg-color, #161618);
}
 
html.dark .toolbar-tip__tooltip {
  @include common.setCssVar(text-color, #141414);
  @include common.setCssVar(bg-color, #f5f5f5);
}
```

## 集成和使用

### 基础主题设置

```typescript
import FluentEditor from 'fluent-editor'
import SnowTheme from 'fluent-editor/themes/snow'
 
// 注册自定义主题
FluentEditor.register('themes/snow', SnowTheme)
 
// 使用主题初始化
const editor = new FluentEditor('#editor', {
  theme: 'snow',
  modules: {
    toolbar: true,
    // 其他模块
  }
})
```

### 动态主题切换

使用 CSS 类在运行时切换主题：

```typescript
// 切换深色模式
document.documentElement.classList.toggle('dark')
 
// 应用自定义主题
document.documentElement.classList.add('custom-theme')
```

## 最佳实践

### 性能优化

- 使用 CSS 变量进行动态主题以最小化重绘
- 利用模块化导入减少打包体积
- 通过类变更而非样式操作实现主题切换

### 可维护性

- 在独立的 SCSS 模块中组织自定义样式
- 遵循使用 fe 命名空间的既定命名约定
- 使用提供的 mixins 保持一致的样式模式

### 可访问性

- 确保自定义主题中足够的颜色对比度
- 在不同设备和屏幕尺寸上测试主题
- 为用户偏好提供主题持久化选项

FluentEditor 的主题系统为创建自定义编辑器体验提供了灵活的基础，同时保持了一致性和性能。模块化架构允许对外观进行精细控制，而 CSS 变量系统则在不影响功能的前提下支持动态主题切换。

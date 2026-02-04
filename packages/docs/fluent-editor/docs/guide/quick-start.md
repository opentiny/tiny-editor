# 快速开始

## 通过代码演练场方式使用

你可以通过以下链接，亲自修改代码体验下 TinyEditor 的各项功能，里面包含了 TinyEditor 相对比较全面的功能。

[https://stackblitz.com/edit/vitejs-vite-cakzv5](https://stackblitz.com/edit/vitejs-vite-cakzv5)

## 通过 NPM 包方式使用

安装 TinyEditor：

```shell
npm i @opentiny/fluent-editor
```

编写 html：

```html
<div id="editor">
  <p>Hello TinyEditor!</p>
</div>
```

引入样式：

```css
@import '@opentiny/fluent-editor/style.css';
```

初始化 TinyEditor 编辑器：

```javascript
import FluentEditor from '@opentiny/fluent-editor'

// 执行初始化时，请确保能获取到 DOM 元素，如果是在 Vue 项目中，需要在 onMounted 事件中执行。
const editor = new FluentEditor('#editor', {
  theme: 'snow',
})
```

## 通过 CDN 方式使用

你也可以通过 CDN 方式使用 TinyEditor，只需要在 HTML 文件中增加以下内容：

```html
<head>
  <!-- 引入 @opentiny/fluent-editor -->
  <script type="importmap">
    {
      "imports": {
        "@opentiny/fluent-editor": "https://unpkg.com/@opentiny/fluent-editor@3.18.3/index.es.js"
      }
    }
  </script>
  <!-- 引入 @opentiny/fluent-editor 样式 -->
  <link rel="stylesheet" href="https://unpkg.com/@opentiny/fluent-editor@3.18.3/style.css" />
</head>
```

接着就可以导入 TinyEditor，并通过 `new FluentEditor(selector, options)` 进行初始化。

```html
<body>
  <div id="editor"></div>
  <script type="module">
    // 引入 @opentiny/fluent-editor
    import FluentEditor from '@opentiny/fluent-editor'

    // 初始化 TinyEditor 富文本编辑器
    const editor = new FluentEditor('#editor', {
      theme: 'snow',
    })
  </script>
</body>
```

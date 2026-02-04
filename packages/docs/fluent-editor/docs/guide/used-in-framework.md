# 在前端框架中使用

TinyEditor 是一个框架无关的富文本编辑器，既可以在原生 JavaScript 项目中使用，也可以在 Vue、React 等前端框架中使用。

## Vue

安装 TinyEditor：

```shell
npm i @opentiny/fluent-editor
```

在 `src/App.vue` 文件中写入以下代码：

```vue
<script setup lang="ts">
import FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

onMounted(() => {
  new FluentEditor('#editor', {
    theme: 'snow',
  })
})
</script>

<template>
  <div id="editor" />
</template>
```

在 `src/style.css` 文件中引入样式：

```css
@import '@opentiny/fluent-editor/style.css';
```

## React

安装 TinyEditor：

```shell
npm i @opentiny/fluent-editor
```

在 `src/App.tsx` 文件中写入以下代码：

```tsx
import FluentEditor from '@opentiny/fluent-editor'
import { useEffect, useRef } from 'react'
import '@opentiny/fluent-editor/style.css'

function App() {
  const editorNode = useRef(null)

  useEffect(() => {
    if (!editorNode.current) {
      editorNode.current = new FluentEditor('#editor', {
        theme: 'snow',
      })
    }
  }, [])

  return (
    <div id="editor"></div>
  )
}

export default App
```

## Angular

安装 TinyEditor：

```shell
npm i @opentiny/fluent-editor
```

在 `src/app/app.component.html` 文件中写入以下代码：

```html
<main class="main">
  <div id="editor"></div>
</main>

<router-outlet />
```

在 `src/app/app.component.ts` 文件中写入以下代码：

```ts
import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import FluentEditor from '@opentiny/fluent-editor'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-app'

  ngAfterViewInit() {
    new FluentEditor('#editor', {
      theme: 'snow',
    })
  }
}
```

在 `src/styles.scss` 文件中引入样式：

```css
@import '@opentiny/fluent-editor/style.css';
```

<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
// 代码块高亮
import hljs from 'highlight.js'
// 截屏
import Html2Canvas from 'html2canvas'
// 插入公式
import katex from 'katex'
import { onMounted, ref } from 'vue'
import 'highlight.js/styles/atom-one-dark.css'
import 'katex/dist/katex.min.css'

window.katex = katex
window.Html2Canvas = Html2Canvas

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor, FULL_TOOLBAR } = await import('@opentiny/fluent-editor')

  if (!editorRef.value) return

  const font = [false, '仿宋_GB2312, 仿宋', '楷体', '隶书', '黑体', '无效字体, 隶书']
  const toolbar = [...FULL_TOOLBAR]
  toolbar[1][1] = { font }

  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
    placeholder: '请输入内容...',
    modules: {
      toolbar,
      file: true,
      emoji: true,
      syntax: {
        hljs,
      },
    },
  })
})
</script>

<template>
  <div>
    <div ref="editorRef" />
  </div>
</template>

<style>
/* 引入本地字体 */
@font-face {
  font-family: '仿宋_GB2312';
  src: local('仿宋_GB2312'), local('FangSong_GB2312');
  font-weight: normal;
  font-style: normal;
}
</style>

<style scoped>
/* 设置默认字体为宋体 */
.ql-container {
  font-family: 宋体;
}

/* 修改下拉框显示文字 */
/* 默认字体显示文字 */
:deep(.ql-snow .ql-picker.ql-font .ql-picker-label::before),
:deep(.ql-snow .ql-picker.ql-font .ql-picker-item::before) {
  content: '宋体';
}

/* 自定义字体显示文字 */
:deep(.ql-formats .ql-font.ql-picker .ql-picker-label[data-value='仿宋_GB2312, 仿宋']::before),
:deep(.ql-formats .ql-font.ql-picker .ql-picker-item[data-value='仿宋_GB2312, 仿宋']::before) {
  content: '仿宋';
}

:deep(.ql-formats .ql-font.ql-picker .ql-picker-label[data-value='无效字体, 隶书']::before),
:deep(.ql-formats .ql-font.ql-picker .ql-picker-item[data-value='无效字体, 隶书']::before) {
  content: '无效字体降级显示';
}
</style>

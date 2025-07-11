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

window.hljs = hljs
window.katex = katex
window.Html2Canvas = Html2Canvas

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  ['undo', 'redo', 'clean', 'format-painter'],
  [
    // 请保留默认值为 false
    { header: [1, 2, 3, 4, 5, 6, false] },
    { font: [false, '仿宋_GB2312, 仿宋', '楷体', '隶书', '黑体', '无效字体, 隶书'] },
    { size: [false, '12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px'] },
    { 'line-height': [false, '1.2', '1.5', '1.75', '2', '3', '4', '5'] },
  ],
  ['bold', 'italic', 'strike', 'underline', 'divider'],
  [{ color: [] }, { background: [] }],
  [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  ['link', 'blockquote', 'code', 'code-block'],
  ['image', 'file'],
  ['emoji', 'video', 'formula', 'screenshot', 'fullscreen'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    if (!editorRef.value) return
    const FluentEditor = module.default
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_CONFIG,
        file: true,
        emoji: true,
        syntax: true,
      },
    })
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

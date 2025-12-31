<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
// 代码块高亮
import hljs from 'highlight.js'
// 截屏
import Html2Canvas from 'html2canvas'
// 插入公式
import katex from 'katex'
import QuillToolbarTip from 'quill-toolbar-tip'
import { onMounted, ref } from 'vue'

import 'quill-toolbar-tip/dist/index.css'
import 'highlight.js/styles/atom-one-dark.css'
import 'katex/dist/katex.min.css'

window.hljs = hljs
window.katex = katex
window.Html2Canvas = Html2Canvas

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor, FULL_TOOLBAR, generateToolbarTip } = await import('@opentiny/fluent-editor')

  if (!editorRef.value) return
  FluentEditor.register({ 'modules/toolbar-tip': generateToolbarTip(QuillToolbarTip) }, true)
  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
    modules: {
      'toolbar': FULL_TOOLBAR,
      'file': true,
      'emoji': true,
      'syntax': true,
      'toolbar-tip': {
        defaultTooltipOptions: {
          tipHoverable: false,
        },
      },
    },
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

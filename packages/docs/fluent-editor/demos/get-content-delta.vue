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

// @提醒
const searchKey = 'name'
const mentionList = [
  {
    name: 'Jack',
    age: 26,
    cn: 'Jack 杰克',
  },
  {
    name: 'Lucy',
    age: 22,
    cn: 'Lucy 露西',
  },
]

const TOOLBAR_CONFIG = [
  ['undo', 'redo', 'clean', 'format-painter'],
  [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }, { size: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px'] }],
  ['bold', 'italic', 'strike', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  ['link', 'blockquote', 'code', 'code-block'],
  ['image', 'file'],
  ['emoji', 'video', 'formula', 'screenshot'],
]

const articleRef = ref<HTMLElement>()
function updateDeltaStr(deltaStr: string) {
  if (articleRef.value) {
    articleRef.value.innerHTML = deltaStr
  }
}

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    editor = new FluentEditor('#editor-get-content-delta', {
      theme: 'snow',
      modules: {
        'toolbar': TOOLBAR_CONFIG,
        'syntax': { hljs },
        'emoji-toolbar': true,
        'file': true,
        'mention': {
          itemKey: 'cn',
          searchKey,
          search(term) {
            return mentionList.filter((item) => {
              return item[searchKey] && String(item[searchKey]).includes(term)
            })
          },
        },
      },
    })

    updateDeltaStr(JSON.stringify(editor.getContents()))

    editor.on('text-change', () => {
      updateDeltaStr(JSON.stringify(editor.getContents()))
    })
  })
})
</script>

<template>
  <div id="editor-get-content-delta">
    <p>Hello <strong>TinyEditor</strong>!</p>
  </div>
  <br>
  Delta 内容：
  <div ref="articleRef" class="article ql-editor" />
</template>

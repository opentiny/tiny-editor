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

import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'

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

const articleRef = ref<HTMLElement>()
function updateHTML(html: string) {
  if (articleRef.value) {
    articleRef.value.innerHTML = html
  }
}

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const [
    { default: FluentEditor, generateTableUp, FULL_TOOLBAR },
    { defaultCustomSelect, TableMenuContextmenu, TableSelection, TableUp },
  ] = await Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-table-up'),
  ])

  FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)
  editor = new FluentEditor('#editor-get-content-html', {
    theme: 'snow',
    modules: {
      'toolbar': FULL_TOOLBAR,
      'syntax': { hljs },
      'emoji': true,
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
      'table-up': {
        customSelect: defaultCustomSelect,
        modules: [
          { module: TableSelection },
          { module: TableMenuContextmenu },
        ],
      },
    },
  })

  updateHTML(editor.root.innerHTML)

  editor.on('text-change', () => {
    updateHTML(editor.root.innerHTML)
  })
})
</script>

<template>
  <div id="editor-get-content-html">
    <p>Hello <strong>TinyEditor</strong>!</p>
  </div>
  <br>
  预览效果：
  <div
    ref="articleRef"
    class="article ql-editor"
  />
</template>

<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean', 'image'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then(({ default: FluentEditor }) => {
    if (!editorRef.value) return
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_CONFIG,
      },
    })
  })
})
</script>

<template>
  <div ref="editorRef">
    <p />
    <p><img data-align="center" width="400px" src="https://res.hc-cdn.com/tiny-vue-web-doc/3.20.7.20250117141151/static/images/mountain.png"></p>
    <p />
  </div>
</template>

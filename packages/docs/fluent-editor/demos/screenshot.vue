<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import Html2Canvas from 'html2canvas'
import { onMounted, ref } from 'vue'

window.Html2Canvas = Html2Canvas

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
  ['screenshot'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default
    if (!editorRef.value) return
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_CONFIG,
      },
      screenshot: {},
    })
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

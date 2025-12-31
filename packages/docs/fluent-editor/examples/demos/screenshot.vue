<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import Html2Canvas from 'html2canvas'
import { onMounted, ref } from 'vue'

window.Html2Canvas = Html2Canvas

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor, DEFAULT_TOOLBAR } = await import('@opentiny/fluent-editor')

  if (!editorRef.value) return
  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        ...DEFAULT_TOOLBAR,
        ['screenshot'], 
      ],
    },
    screenshot: {},
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

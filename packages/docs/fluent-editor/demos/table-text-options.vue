<script setup lang="ts">
import { onMounted, ref } from 'vue'

let editor

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
]

const editorRef = ref()

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      langText: {
        'sub-title-bg-color': '主题色1',
      },
      modules: {
        toolbar: TOOLBAR_CONFIG,
      },
    })
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

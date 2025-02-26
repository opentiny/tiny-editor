<script setup lang="ts">
import { onMounted, ref } from 'vue'

let editor
const editorRef = ref()

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike', 'underline'],
          ['link', 'image'],
          [{ color: [] }, { background: [] }],
        ],
        counter: true,
        i18n: {
          lang: 'zh-CN',
        },
      },

    })
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

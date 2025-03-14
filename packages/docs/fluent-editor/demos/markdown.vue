<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    import('quill-markdown-shortcuts').then((markdown) => {
      const MarkdownShortcuts = markdown.default

      FluentEditor.register('modules/markdownShortcuts', MarkdownShortcuts)

      editor = new FluentEditor('#editor', {
        theme: 'snow',
        modules: {
          markdownShortcuts: true,
        },
      })
    })
  })
})
</script>

<template>
  <div id="editor" />
</template>

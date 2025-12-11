<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const [
    { default: FluentEditor },
    { default: MarkdownShortcuts },
  ] = await Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-markdown-shortcuts'),
  ])

  FluentEditor.register('modules/markdownShortcuts', MarkdownShortcuts)

  editor = new FluentEditor('#editor', {
    theme: 'snow',
    modules: {
      markdownShortcuts: true,
    },
  })
})
</script>

<template>
  <div id="editor" />
</template>

<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor } = await import('@opentiny/fluent-editor')

  editor = new FluentEditor('#editor-counter-count', {
    theme: 'snow',
    modules: {
      counter: {
        count: 2000,
      },
    },
  })
})
</script>

<template>
  <div id="editor-counter-count" />
</template>

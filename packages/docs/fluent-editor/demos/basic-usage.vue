<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor } = await import('@opentiny/fluent-editor')

  editor = new FluentEditor('#editor', {
    theme: 'snow',
  })
})
</script>

<template>
  <div id="editor">
    <p>Hello <strong>TinyEditor</strong>!</p>
  </div>
</template>

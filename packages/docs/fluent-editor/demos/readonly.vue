<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor } = await import('@opentiny/fluent-editor')

  editor = new FluentEditor('#editor-readonly', {
    theme: 'snow',
    modules: {
      toolbar: false,
    },
    readOnly: true,
  })
})
</script>

<template>
  <div id="editor-readonly">
    <p>Hello <strong>TinyEditor</strong>!</p>
    <p>官网: <a href="https://opentiny.github.io/tiny-editor" target="_blank">https://opentiny.github.io/tiny-editor</a></p>
    <p>GitHub: <a href="https://github.com/opentiny/tiny-editor" target="_blank">https://github.com/opentiny/tiny-editor</a></p>
  </div>
</template>

<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    editor = new FluentEditor('#editor-readonly', {
      theme: 'snow',
      modules: {
        toolbar: false,
      },
      readOnly: true,
    })
  })
})
</script>

<template>
  <div id="editor-readonly">
    <p>Hello <strong>TinyEditor</strong>!</p>
  </div>
</template>

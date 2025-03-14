<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    editor = new FluentEditor('#editor-set-content-html', {
      theme: 'snow',
    })

    const html = '<p>Hello <strong>TinyEditor</strong>!</p>'

    editor.root.innerHTML = html
  })
})
</script>

<template>
  <div id="editor-set-content-html" />
</template>

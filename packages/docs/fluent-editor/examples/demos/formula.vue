<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import katex from 'katex'
import { onMounted } from 'vue'
import 'katex/dist/katex.min.css'

window.katex = katex

let editor: FluentEditor

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor, DEFAULT_TOOLBAR } = await import('@opentiny/fluent-editor')

  editor = new FluentEditor('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ...DEFAULT_TOOLBAR,
        ['formula'],
      ],
    },
  })
})
</script>

<template>
  <div id="editor" />
</template>

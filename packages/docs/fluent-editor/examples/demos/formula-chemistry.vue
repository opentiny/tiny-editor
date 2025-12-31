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

  await import('katex/contrib/mhchem/mhchem')

  editor = new FluentEditor('#chemistry-editor', {
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
  <div id="chemistry-editor" />
</template>

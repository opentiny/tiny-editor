<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import hljs from 'highlight.js'
// config extra languages
import go from 'highlight.js/lib/languages/go'
import { onMounted } from 'vue'
// import the highlight.js theme you want
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('go', go)

let editor: FluentEditor

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor, DEFAULT_TOOLBAR } = await import('@opentiny/fluent-editor')

  editor = new FluentEditor('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ...DEFAULT_TOOLBAR,
        ['code-block'],
      ],
      syntax: {
        hljs,
        languages: [
          { key: 'go', label: 'Golang' },
        ],
      },
    },
  })
})
</script>

<template>
  <div id="editor" />
</template>

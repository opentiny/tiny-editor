<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import katex from 'katex'
import { onMounted } from 'vue'
import 'katex/contrib/mhchem/mhchem'
import 'katex/dist/katex.min.css'

window.katex = katex

let editor: FluentEditor

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
  ['formula'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    editor = new FluentEditor('#chemistry-editor', {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_CONFIG,
      },
    })
  })
})
</script>

<template>
  <div id="chemistry-editor" />
</template>

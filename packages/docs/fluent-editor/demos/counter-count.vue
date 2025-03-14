<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    editor = new FluentEditor('#editor-counter-count', {
      theme: 'snow',
      modules: {
        counter: {
          count: 2000,
        },
      },
    })
  })
})
</script>

<template>
  <div id="editor-counter-count" />
</template>

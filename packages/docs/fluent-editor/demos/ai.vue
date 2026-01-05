<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor, DEFAULT_TOOLBAR } = await import('@opentiny/fluent-editor')

  editor = new FluentEditor('#editor-add-toolbar-item', {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          ['ai'],
          ...DEFAULT_TOOLBAR,
        ],
      },
      ai: {
        host: 'http://localhost:11434/api/generate',
        model: 'deepseek-r1:8b',
        apiKey: '',
        contentMaxLength: 1000,
      },
    },
  })
})
</script>

<template>
  <div id="editor-add-toolbar-item">
    <p>我曾经跨过山和大海，也穿过人山人海</p>
  </div>
</template>

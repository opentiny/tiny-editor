<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor } = await import('@opentiny/fluent-editor')

  editor = new FluentEditor('#editor-set-content-delta', {
    theme: 'snow',
  })

  const ops = [{ insert: 'Hello ' }, { attributes: { bold: true }, insert: 'TinyEditor' }, { insert: '!\n' }]

  editor.setContents(ops)
})
</script>

<template>
  <div id="editor-set-content-delta" />
</template>

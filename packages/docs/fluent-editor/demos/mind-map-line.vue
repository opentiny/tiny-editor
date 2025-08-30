<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  ['clean'],
  ['mind-map'],
]

onMounted(() => {
  import('@opentiny/fluent-editor').then(({ default: FluentEditor }) => {
    if (!editorRef.value) return
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        'toolbar': TOOLBAR_CONFIG,
        'mind-map': {
          line: {
            color: '#009CE0',
            width: 3,
            dasharray: '15, 10, 5, 10, 15',
            style: 'curve',
          },
        },
      },
    })
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

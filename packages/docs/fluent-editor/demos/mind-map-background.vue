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
          background: {
            color: '#A4DD00',
            // image: 'url(path/to/image.png)',
            repeat: 'repeat',
            position: 'center',
            size: 'auto',
          },
          theme: 'minions',
        },
      },
    })
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

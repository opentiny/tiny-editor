<script setup lang="ts">
import type { Range } from '@opentiny/fluent-editor'
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
  ['file', 'image', 'video'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then(({ default: FluentEditor }) => {
    if (!editorRef.value) return
    const Delta = FluentEditor.import('delta')
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_CONFIG,
        uploader: {
          // only allow image
          mimetypes: ['image/*'],
          handler(range: Range, files: File[]) {
            return files.map((_, i) => i % 2 === 0 ? false : 'https://developer.mozilla.org/static/media/chrome.5e791c51c323fbb93c31.svg')
          },
          fail(file: File, range: Range) {
            this.quill.updateContents(new Delta().retain(range.index).delete(1).insert({ image: 'https://developer.mozilla.org/static/media/edge.741dffaf92fcae238b84.svg' }))
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

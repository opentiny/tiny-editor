<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import Html2Canvas from 'html2canvas'
import { onMounted, ref } from 'vue'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
  ['screenshot'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default
    if (!editorRef.value) return
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_CONFIG,
      },
      screenshot: {
        Html2Canvas,
        beforeCreateImage(canvas) {
          return new Promise((resolve) => {
            canvas.toBlob(
              (data: Blob | null) => {
                if (!data) return
                const file = new File([data], `screenshot.png`, { type: 'image/jpeg' })
                // here can upload file to server. demo just use setTimeout to simulate
                setTimeout(() => {
                  // return the final image url
                  resolve('https://res.hc-cdn.com/tiny-vue-web-doc/3.18.9.20240902190525/static/images/mountain.png')
                }, 1000)
              },
              'image/png',
              1,
            )
          })
        },
      },
    })
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import Html2Canvas from 'html2canvas'
import { onMounted, ref } from 'vue'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const { default: FluentEditor, DEFAULT_TOOLBAR } = await import('@opentiny/fluent-editor')

  if (!editorRef.value) return
  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        ...DEFAULT_TOOLBAR,
        ['screenshot'],
      ],
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
</script>

<template>
  <div ref="editorRef" />
</template>

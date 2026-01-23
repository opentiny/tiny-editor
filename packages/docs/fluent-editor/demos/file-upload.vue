<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
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
        ['file', 'image', 'video'],
      ],
      uploader: {
        // 按工具按钮区分 file / image / video
        // 支持单个 MIME type、模糊匹配子类型和后缀名三种格式
        mimetypes: {
          file: [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.txt',
            '.zip',
          ],
          image: ['image/*', '.png', '.jpg', '.jpeg', '.gif', '.webp'],
          video: ['video/*', '.mp4', '.webm'],
        },
        maxSize: {
          file: 5 * 1024 * 1024, // 5 MB
          image: 100 * 1024, // 100 KB
          video: 10 * 1024 * 1024, // 10 MB
        },
      },
    },
  })
})
</script>

<template>
  <div ref="editorRef" />
  <br>
</template>

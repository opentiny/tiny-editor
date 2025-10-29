<script setup lang="ts">
import type { EmojiMartData } from '@emoji-mart/data'
import type FluentEditor from '@opentiny/fluent-editor'
// 这里实际导入的是一个 json 文件，包含了 emoji-mart 所需的所有表情数据，类型是 EmojiMartData
import data from '@emoji-mart/data'
// computePosition 函数用于计算 emoji picker显示的位置，你可以根据需要自定义位置计算逻辑
import { computePosition } from '@floating-ui/dom'
import { Picker } from 'emoji-mart'
import { onMounted } from 'vue'

let editor: FluentEditor

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
  ['emoji'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    editor = new FluentEditor('#editor', {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_CONFIG,
        emoji: {
          emojiData: data as EmojiMartData,
          EmojiPicker: Picker,
          emojiPickerPosition: computePosition,
        },
      },
    })
  })
})
</script>

<template>
  <div id="editor" />
</template>

<script setup lang="ts">
import type { EmojiMartData } from '@emoji-mart/data'
import type FluentEditor from '@opentiny/fluent-editor'
// 这里实际导入的是一个 json 文件，包含了 emoji-mart 所需的所有表情数据，类型是 EmojiMartData
import data from '@emoji-mart/data'
// computePosition 函数用于计算 emoji picker显示的位置
import { computePosition } from '@floating-ui/dom'
import { onMounted } from 'vue'

let editor: FluentEditor

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const [{ default: FluentEditor, DEFAULT_TOOLBAR }, emojiMart] = await Promise.all([
    import('@opentiny/fluent-editor'),
    import('emoji-mart'),
  ])

  editor = new FluentEditor('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ...DEFAULT_TOOLBAR,
        ['emoji'],
      ],
      emoji: {
        emojiData: data as EmojiMartData,
        EmojiPicker: emojiMart.Picker,
        emojiPickerPosition: computePosition,
      },
    },
  })
})
</script>

<template>
  <div id="editor" />
</template>

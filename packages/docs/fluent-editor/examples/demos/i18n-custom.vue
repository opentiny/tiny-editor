<script setup lang="ts">
import type { EmojiMartData } from '@emoji-mart/data'
import type FluentEditor from '@opentiny/fluent-editor'

import type { I18N } from '@opentiny/fluent-editor'
// 这里实际导入的是一个 json 文件，包含了 emoji-mart 所需的所有表情数据，类型是 EmojiMartData
import data from '@emoji-mart/data'
// computePosition 函数用于计算 emoji picker显示的位置
import { computePosition } from '@floating-ui/dom'

import QuillToolbarTip from 'quill-toolbar-tip'
import { onMounted, ref } from 'vue'

import 'quill-toolbar-tip/dist/index.css'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()
const lang = ref('zh-CN')

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const [
    { default: FluentEditor, FULL_TOOLBAR, I18N, generateToolbarTip, generateTableUp },
    { defaultCustomSelect, TableMenuContextmenu, TableSelection, TableUp },
    emojiMart,
  ] = await Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-table-up'),
    import('emoji-mart'),
  ])

  if (!editorRef.value) return
  FluentEditor.register({ 'modules/toolbar-tip': generateToolbarTip(QuillToolbarTip) }, true)
  FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)
  I18N.register(
    {
      'zh-CN': {
        'replace bold': '替换粗体文本',
        'replace italic': '替换斜体文本',
      },
      'en-US': {
        'replace bold': 'Replace bold text',
        'replace italic': 'Replace italic text',
      },
    },
    // set false to add text to the existing language
    false,
  )
  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
    modules: {
      'toolbar': FULL_TOOLBAR,
      'counter': true,
      'emoji': {
        emojiData: data as EmojiMartData,
        EmojiPicker: emojiMart.Picker,
        emojiPickerPosition: computePosition,
      },
      'i18n': {
        lang: lang.value,
      },
      'toolbar-tip': {
        tipTextMap: {
          bold: '_i18n"replace bold"',
          italic: '_i18n"replace italic"',
        },
        defaultTooltipOptions: {
          tipHoverable: false,
        },
      },
      'table-up': {
        customSelect: defaultCustomSelect,
        modules: [
          { module: TableSelection },
          { module: TableMenuContextmenu },
        ],
      },
    },
  })
})
function switchLanguage() {
  lang.value = lang.value === 'zh-CN' ? 'en-US' : 'zh-CN';
  (editor.getModule('i18n') as I18N).changeLanguage({ lang: lang.value })
}
</script>

<template>
  <button @click="switchLanguage">
    Click here to switch between Chinese and English languages
  </button>
  <div ref="editorRef" />
</template>

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
const lang = ref('en-US')

const TOOLBAR_CONFIG = [
  ['undo', 'redo', 'clean', 'format-painter'],
  [
    // 请保留默认值为 false
    { header: [1, 2, 3, 4, 5, 6, false] },
    { font: [false, '宋体', '微软雅黑', '楷体', '黑体', '隶书', 'andale mono', 'arial', 'arial black', 'comic sans ms', 'impact', 'times new roman'] },
    { size: [false, '12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px'] },
    { 'line-height': [false, '1.2', '1.5', '1.75', '2', '3', '4', '5'] },
  ],
  ['bold', 'italic', 'strike', 'underline', 'divider'],
  [{ color: [] }, { background: [] }],
  [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  ['link', 'blockquote', 'code', 'code-block'],
  ['image', 'file'],
  ['emoji', 'video', 'formula', 'screenshot', 'fullscreen'],
  [{ 'table-up': [] }],
]

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const [
    { default: FluentEditor, generateToolbarTip, generateTableUp },
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
  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
    modules: {
      'toolbar': TOOLBAR_CONFIG,
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

<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import katex from 'katex'
import { onMounted, ref } from 'vue'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'
import 'katex/dist/katex.min.css'

window.katex = katex

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  ['undo', 'redo', 'clean', 'format-painter'],
  [
    // 请保留默认值为 false
    { header: [1, 2, 3, 4, 5, 6, false] },
    { font: [false, '仿宋_GB2312, 仿宋', '楷体', '隶书', '黑体', '无效字体, 隶书'] },
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

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-table-up'),
  ]).then(([
    { default: FluentEditor, generateTableUp, generateTableUpShortKeyMenu },
    { createSelectBox, defaultCustomSelect, TableUp },
  ]) => {
    FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)
    const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox)
    tableUpConfig.title = '_i18n"table"'
    if (editorRef.value) {
      editor = new FluentEditor(editorRef.value, {
        theme: 'snow',
        modules: {
          'toolbar': TOOLBAR_CONFIG,
          'table-up': {
            customSelect: defaultCustomSelect,
          },
          'shortcut-key': {
            menuItems: [tableUpConfig],
            isMenuItemsAdd: true,
            menuKeyboardControls(event, data) {
              let result = false
              result = tableUpKeyboardControl(event, data) || result
              return result
            },
          },
        },
      })
    }
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

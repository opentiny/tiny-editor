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

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const [
    { default: FluentEditor, FULL_TOOLBAR, generateTableUp, generateTableUpShortKeyMenu },
    { createSelectBox, defaultCustomSelect, TableUp },
  ] = await Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-table-up'),
  ])
  
  FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)
  const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox)
  tableUpConfig.title = '_i18n"table"'
  if (editorRef.value) {
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        'toolbar': FULL_TOOLBAR,
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
</script>

<template>
  <div ref="editorRef" />
</template>

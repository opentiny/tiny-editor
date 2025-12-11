<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'

let editorContextmenu: FluentEditor
let editorSelect: FluentEditor
const editorContextmenuRef = ref<HTMLElement>()
const editorSelectRef = ref<HTMLElement>()

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const [
    { default: FluentEditor, DEFAULT_TOOLBAR, generateTableUp },
    { defaultCustomSelect, TableMenuContextmenu, TableMenuSelect, TableSelection, TableUp },
  ] = await Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-table-up'),
  ])
  
  FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)
  if (editorSelectRef.value) {
    editorSelect = new FluentEditor(editorSelectRef.value, {
      theme: 'snow',
      modules: {
        'toolbar': [
          ...DEFAULT_TOOLBAR,
          [{ 'table-up': [] }],
        ],
        'table-up': {
          customSelect: defaultCustomSelect,
          modules: [
            { module: TableSelection },
            { module: TableMenuSelect },
          ],
        },
      },
    })
  }
  if (editorContextmenuRef.value) {
    editorContextmenu = new FluentEditor(editorContextmenuRef.value, {
      theme: 'snow',
      modules: {
        'toolbar': [
          ...DEFAULT_TOOLBAR,
          [{ 'table-up': [] }],
        ],
        'table-up': {
          customSelect: defaultCustomSelect,
          modules: [
            { module: TableSelection },
            { module: TableMenuContextmenu },
          ],
        },
      },
    })
  }
})
</script>

<template>
  <div>
    <p>右击菜单：选择单元格后右键弹出</p>
    <div ref="editorContextmenuRef" />
    <p>选择菜单：选择单元格后持续显示</p>
    <div ref="editorSelectRef" />
  </div>
</template>

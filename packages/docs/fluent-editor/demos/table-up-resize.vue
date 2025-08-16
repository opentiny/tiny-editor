<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'

let editorbox: FluentEditor
let editorLine: FluentEditor
let editorScale: FluentEditor
const editorBoxRef = ref<HTMLElement>()
const editorLineRef = ref<HTMLElement>()
const editorScaleRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
  [{ 'table-up': [] }],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-table-up'),
  ]).then(([
    { default: FluentEditor, generateTableUp },
    { defaultCustomSelect, TableResizeBox, TableResizeLine, TableResizeScale, TableUp },
  ]) => {
    FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)
    if (editorBoxRef.value) {
      editorbox = new FluentEditor(editorBoxRef.value, {
        theme: 'snow',
        modules: {
          'toolbar': TOOLBAR_CONFIG,
          'table-up': {
            customSelect: defaultCustomSelect,
            modules: [
              { module: TableResizeBox },
            ],
          },
        },
      })
    }
    if (editorLineRef.value) {
      editorLine = new FluentEditor(editorLineRef.value, {
        theme: 'snow',
        modules: {
          'toolbar': TOOLBAR_CONFIG,
          'table-up': {
            customSelect: defaultCustomSelect,
            modules: [
              { module: TableResizeLine },
            ],
          },
        },
      })
    }
    if (editorScaleRef.value) {
      editorScale = new FluentEditor(editorScaleRef.value, {
        theme: 'snow',
        modules: {
          'toolbar': TOOLBAR_CONFIG,
          'table-up': {
            customSelect: defaultCustomSelect,
            modules: [
              { module: TableResizeScale },
            ],
          },
        },
      })
    }
  })
})
</script>

<template>
  <div>
    <p>包围盒：点击表格内部显示调整包围盒</p>
    <div ref="editorBoxRef" />
    <p>内部隐藏线：点击表格内部，鼠标移至单元格右侧或下侧拖拽进行调整</p>
    <div ref="editorLineRef" />
    <p>整体单元格调整：点击表格内部，拖拽右下角方块调整</p>
    <div ref="editorScaleRef" />
  </div>
</template>

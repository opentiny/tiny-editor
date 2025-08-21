<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import Html2Canvas from 'html2canvas'
import katex from 'katex'
import { onMounted, ref } from 'vue'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'
import 'katex/dist/katex.min.css'

window.katex = katex
window.Html2Canvas = Html2Canvas

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  ['undo', 'redo', 'format-painter', 'clean'],
  [
    { header: [false, 1, 2, 3, 4, 5, 6] },
    { size: ['12px', '14px', '16px', '18px', '20px', '24px', '32px'] },
    { font: [] },
    { 'line-height': ['1', '1.15', '1.5', '2', '2.5', '3'] },
  ],
  ['bold', 'italic', 'underline', 'strike', 'code'],
  [{ color: [] }, { background: [] }],
  [
    { align: ['', 'center', 'right', 'justify'] },
    { list: 'ordered' },
    { list: 'bullet' },
    { list: 'check' },
    { indent: '+1' },
    { indent: '-1' },
  ],
  [{ script: 'sub' }, { script: 'super' }],
  ['link', 'blockquote', 'code-block', 'divider'],
  ['image', 'file', 'emoji', 'video', 'formula'],
  [{ 'table-up': [] }, 'screenshot', 'fullscreen'],
]

const ROOM_NAME = `tiny-editor-document-demo-roomName`

onMounted(() => {
  Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-table-up'),
  ]).then(
    ([
      { default: FluentEditor, generateTableUp, CollaborationModule },
      { defaultCustomSelect, TableMenuContextmenu, TableSelection, TableUp },
    ]) => {
      if (!editorRef.value) return

      FluentEditor.register(
        { 'modules/table-up': generateTableUp(TableUp) },
        true,
      )
      FluentEditor.register(
        'modules/collaborative-editing',
        CollaborationModule,
        true,
      )

      editor = new FluentEditor(editorRef.value, {
        theme: 'snow',
        modules: {
          'toolbar': TOOLBAR_CONFIG,
          'file': true,
          'emoji': true,
          'table-up': {
            customSelect: defaultCustomSelect,
            selection: TableSelection,
            selectionOptions: {
              tableMenu: TableMenuContextmenu,
            },
          },
          'collaborative-editing': {
            provider: {
              type: 'websocket',
              options: {
                serverUrl: 'wss://120.26.92.145:1234',
                roomName: ROOM_NAME,
              },
            },
            awareness: {
              state: {
                color: '#ff6b6b',
              },
            },
            cursors: {
              hideDelayMs: 300,
              hideSpeedMs: 300,
              selectionChangeSource: null,
              transformOnTextChange: true,
            },
          },
        },
      })
    },
  )
})
</script>

<template>
  <div>
    <div>
      <div ref="editorRef" class="editor" />
    </div>
  </div>
</template>

<style scoped>
</style>

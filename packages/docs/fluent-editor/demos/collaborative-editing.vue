<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'

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
  ]).then(([
    { default: FluentEditor, generateTableUp, CollaborationModule },
    { defaultCustomSelect, TableMenuContextmenu, TableSelection, TableUp },
  ]) => {
    if (!editorRef.value) return

    FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)
    CollaborationModule.register()
    FluentEditor.register('modules/collaboration', CollaborationModule, true)

    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        'toolbar': TOOLBAR_CONFIG,
        'cursors': true,
        'file': true,
        'emoji': true,
        'table-up': {
          customSelect: defaultCustomSelect,
          selection: TableSelection,
          selectionOptions: {
            tableMenu: TableMenuContextmenu,
          },
        },
        'collaboration': {
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
        },
      },
    })
  })
})
</script>

<template>
  <div class="collaborative-demo">
    <div class="editor-container">
      <h3>TinyEditor 编辑器</h3>
      <div ref="editorRef" class="editor" />
    </div>
  </div>
</template>

<style scoped>
.collaborative-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.editor-container {
  margin-bottom: 30px;
}

.editor {
  min-height: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>

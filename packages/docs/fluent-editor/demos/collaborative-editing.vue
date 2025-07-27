<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'

let editor1: FluentEditor
let editor2: FluentEditor
const editor1Ref = ref<HTMLElement>()
const editor2Ref = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link'],
  [{ 'table-up': [] }],
  ['clean'],
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
    if (!editor1Ref.value || !editor2Ref.value) return

    FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)
    CollaborationModule.register()
    FluentEditor.register('modules/collaboration', CollaborationModule, true)

    // 编辑器1
    editor1 = new FluentEditor(editor1Ref.value, {
      theme: 'snow',
      modules: {
        'toolbar': TOOLBAR_CONFIG,
        'cursors': true,
        'table-up': {
          customSelect: defaultCustomSelect,
          selection: TableSelection,
          selectionOptions: {
            tableMenu: TableMenuContextmenu,
          },
        },
        'collaboration': {
          cursors: true,
          provider: {
            type: 'websocket',
            options: {
              serverUrl: 'wss://demos.yjs.dev/ws',
              roomName: ROOM_NAME,
            },
          },
          awareness: {
            state: {
              name: '用户1',
              color: '#ff6b6b',
            },
          },
        },
      },
    })

    // 编辑器2
    editor2 = new FluentEditor(editor2Ref.value, {
      theme: 'snow',
      modules: {
        'toolbar': TOOLBAR_CONFIG,
        'cursors': true,
        'table-up': {
          customSelect: defaultCustomSelect,
          selection: TableSelection,
          selectionOptions: {
            tableMenu: TableMenuContextmenu,
          },
        },
        'collaboration': {
          cursors: true,
          provider: {
            type: 'websocket',
            options: {
              serverUrl: 'wss://demos.yjs.dev/ws',
              roomName: ROOM_NAME,
            },
          },
          awareness: {
            state: {
              name: '用户2',
              color: '#4ecdc4',
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
      <h3>用户1 编辑器</h3>
      <div ref="editor1Ref" class="editor" />
    </div>

    <div class="editor-container">
      <h3>用户2 编辑器</h3>
      <div ref="editor2Ref" class="editor" />
    </div>
  </div>
</template>

<style scoped></style>

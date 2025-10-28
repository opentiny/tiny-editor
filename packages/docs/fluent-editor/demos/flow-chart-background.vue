<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import LogicFlow from '@logicflow/core'
import { DndPanel, SelectionSelect, Snapshot } from '@logicflow/extension'
import { onMounted, ref } from 'vue'
import '@logicflow/core/lib/style/index.css'
import '@logicflow/extension/lib/style/index.css'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  ['clean'],
  ['flow-chart'],
]

onMounted(() => {
  import('@opentiny/fluent-editor').then(({ default: FluentEditor }) => {
    if (!editorRef.value) return
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        'toolbar': TOOLBAR_CONFIG,
        'flow-chart': {
          background: {
            color: '#98FB98',
            // image: 'url(path/to/image.png)',
            repeat: 'repeat',
            position: 'center',
            size: 'auto',
            opacity: 0.1,
          },
          deps: {
            LogicFlow,
            DndPanel,
            SelectionSelect,
            Snapshot,
          },
        },
      },
    })
    const ops = [{ insert: '\n' }, { insert: { 'flow-chart': { nodes: [{ id: 'node1', type: 'rect', x: 100, y: 150, text: '开始' }, { id: 'node2', type: 'rect', x: 300, y: 150, text: '结束' }], edges: [{ id: 'edge1', sourceNodeId: 'node1', targetNodeId: 'node2', type: 'polyline' }] } } }, { insert: '\n\n' }]
    editor.setContents(ops)
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

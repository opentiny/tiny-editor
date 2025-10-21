<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  ['clean'],
  ['mind-map'],
]

onMounted(() => {
  import('@opentiny/fluent-editor').then(({ default: FluentEditor }) => {
    if (!editorRef.value) return
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        'toolbar': TOOLBAR_CONFIG,
        'mind-map': {
          background: {
            color: '#A4DD00',
            // image: 'url(path/to/image.png)',
            repeat: 'repeat',
            position: 'center',
            size: 'auto',
          },
        },
      },
    })
    const ops = [{ insert: '\n' }, { insert: { 'mind-map': { layout: 'logicalStructure', root: { data: { text: '根节点', expand: true, uid: '36bae545-da0b-4c08-be14-ff05f7f05d0a', isActive: false }, children: [{ data: { text: '二级节点', uid: 'ef0895d2-b5cc-4214-b0ee-e29f8f02420d', expand: true, richText: false, isActive: false }, children: [] }], smmVersion: '0.14.0-fix.1' }, theme: { template: 'default', config: { backgroundColor: '#A4DD00', backgroundRepeat: 'repeat', backgroundPosition: 'center', backgroundSize: 'auto' } }, view: { transform: { scaleX: 1, scaleY: 1, shear: 0, rotate: 0, translateX: 0, translateY: 0, originX: 0, originY: 0, a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, state: { scale: 1, x: 0, y: 0, sx: 0, sy: 0 } } } } }, { insert: '\n\n' }]
    editor.setContents(ops)
  })
})
</script>

<template>
  <div ref="editorRef" />
</template>

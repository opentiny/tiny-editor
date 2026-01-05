<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

onMounted(async () => {
  const [
    { default: FluentEditor, DEFAULT_TOOLBAR },
    { default: SimpleMindMap },
    { default: Drag },
    { default: Export },
    { default: Themes },
    { default: nodeIconList },
  ] = await Promise.all([
    import('@opentiny/fluent-editor'),
    import('simple-mind-map'),
    import('simple-mind-map/src/plugins/Drag.js'),
    import('simple-mind-map/src/plugins/Export.js'),
    import('simple-mind-map-plugin-themes'),
    import('simple-mind-map/src/svg/icons'),
  ])

  if (!editorRef.value) return
  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
    modules: {
      'toolbar': [
        ...DEFAULT_TOOLBAR,
        ['mind-map'],
      ],
      'mind-map': {
        deps: {
          SimpleMindMap,
          Themes,
          Drag,
          Export,
          nodeIconList,
        },
        theme: 'minions',
      },
    },
  })

  const ops = [{ insert: '\n' }, { insert: { 'mind-map': { layout: 'logicalStructure', root: { data: { text: '根节点', expand: true, uid: '36bae545-da0b-4c08-be14-ff05f7f05d0a', isActive: false }, children: [{ data: { text: '二级节点', uid: 'ef0895d2-b5cc-4214-b0ee-e29f8f02420d', expand: true, richText: false, isActive: false }, children: [] }], smmVersion: '0.14.0-fix.1' }, theme: { template: 'minions', config: {} }, view: { transform: { scaleX: 1, scaleY: 1, shear: 0, rotate: 0, translateX: 0, translateY: 0, originX: 0, originY: 0, a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, state: { scale: 1, x: 0, y: 0, sx: 0, sy: 0 } } } } }, { insert: '\n\n' }]
  editor.setContents(ops)
})
</script>

<template>
  <div ref="editorRef" />
</template>

<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'
import 'quill-header-list/dist/index.css'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()
const headerListRef = ref<HTMLElement>()

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-header-list'),
  ])
    .then(([{ default: FluentEditor }, { default: HeaderList }]) => {
      if (!editorRef.value) return
      FluentEditor.register({ 'modules/header-list': HeaderList }, true)

      editor = new FluentEditor(editorRef.value, {
        theme: 'snow',
        modules: {
          'toolbar': {
            container: [
              [{ header: [null, 1, 2, 3, 4, 5, 6] }, 'header-list'],
            ],
            handlers: {
              'header-list': HeaderList.toolbarHandle,
            },
          },
          'header-list': {
            container: headerListRef.value,
            scrollContainer: window,
            topOffset: () => {
              const navOffset = document.querySelector('header.VPNav')?.getBoundingClientRect().height || 0
              const VPOffset = document.querySelector('div.VPLocalNav')?.getBoundingClientRect().height || 0
              if (window.innerWidth <= 960) {
                return VPOffset
              }
              else if (window.innerWidth <= 1280) {
                return navOffset + VPOffset
              }
              return navOffset
            },
          },
        },
      })

      editor.setContents([
        { insert: 'header 1' },
        { attributes: { header: { value: 1 } }, insert: '\n' },
        { insert: '\n\n\n\n\n\n\n\n\n\nheader 1.1' },
        { attributes: { header: { value: 2 } }, insert: '\n' },
        { insert: '\n\n\n\n\n\n\n\n\nheader 1.2' },
        { attributes: { header: { value: 2 } }, insert: '\n' },
        { insert: '\n\n\n\nheader 1.3' },
        { attributes: { header: { value: 2 } }, insert: '\n' },
        { insert: '\n\n\n\n\n\n\n\n\n\n\nheader 2' },
        { attributes: { header: { value: 1 } }, insert: '\n' },
        { insert: '\n\n\n\n\n\n\n\nheader 2.1' },
        { attributes: { header: { value: 2 } }, insert: '\n' },
        { insert: '\nheader 2.1.1' },
        { attributes: { header: { value: 3 } }, insert: '\n' },
        { insert: '\n\n\n\n\n\n\n\n\n\nheader 2.1.2' },
        { attributes: { header: { value: 3 } }, insert: '\n' },
        { insert: '\n\n\n\n\n\n\n\n\n\nheader 44444444' },
        { attributes: { header: { value: 4 } }, insert: '\n' },
        { insert: '\n\n\n\n\n\n\n\n\n\nheader 44444444' },
        { attributes: { header: { value: 4 } }, insert: '\n' },
        { insert: '\n\n\n\n\n\n\n\n\n\nheader 5' },
        { attributes: { header: { value: 5 } }, insert: '\n' },
        { insert: '\n\n\n\n\n\n\n\n\n\nheader 6' },
        { attributes: { header: { value: 6 } }, insert: '\n' },
      ])
    })
})
</script>

<template>
  <div ref="headerListRef" class="header-list is-hidden">
    <p>设置滚动容器</p>
  </div>
  <div ref="editorRef" />
</template>

<style scoped>
.header-list {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  height: 100%;
  padding: 8px 0px;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  overflow-x: auto;
  overflow-y: hidden;
}
</style>

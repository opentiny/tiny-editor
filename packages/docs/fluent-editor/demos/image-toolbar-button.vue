<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import type { ImageToolbarButtons } from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean', 'image'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then(({ default: FluentEditor }) => {
    if (!editorRef.value) return
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_CONFIG,
        image: {
          toolbar: {
            buttons: {
              copy: false,
              download: false,
              clean: {
                name: 'clean',
                icon: (FluentEditor.import('ui/icons') as Record<string, string>).clean,
                apply(el: HTMLImageElement, toolbarButtons: ImageToolbarButtons) {
                  toolbarButtons.clear(el)
                  el.removeAttribute('width')
                  el.removeAttribute('height')
                  this.buttons.forEach((button) => {
                    button.classList.remove('is-selected')
                    button.style.removeProperty('filter')
                  })
                },
              },
            },
          },
        },
      },
    })
  })
})
</script>

<template>
  <div ref="editorRef">
    <p />
    <p><img data-align="center" src="https://d85bacca-925d-464c-94b0-4797720f56a6.mdnplay.dev/shared-assets/images/examples/grapefruit-slice.jpg"></p>
    <p />
  </div>
</template>

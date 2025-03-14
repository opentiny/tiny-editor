<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import type { I18N } from '@opentiny/fluent-editor'

import QuillToolbarTip from 'quill-toolbar-tip'
import { onMounted, ref } from 'vue'
import 'quill-toolbar-tip/dist/index.css'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()
const lang = ref('zh-CN')

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then(({ default: FluentEditor, I18N, generateToolbarTip }) => {
    if (!editorRef.value) return
    FluentEditor.register({ 'modules/toolbar-tip': generateToolbarTip(QuillToolbarTip) }, true)
    I18N.register(
      {
        'zh-CN': {
          'replace bold': '替换粗体文本',
          'replace italic': '替换斜体文本',
        },
        'en-US': {
          'replace bold': 'Replace bold text',
          'replace italic': 'Replace italic text',
        },
      },
      // set false to add text to the existing language
      false,
    )
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        'toolbar': [
          ['bold', 'italic', 'strike', 'underline'],
          ['link', 'image'],
          [{ color: [] }, { background: [] }],
        ],
        'counter': true,
        'i18n': {
          lang: lang.value,
        },
        'toolbar-tip': {
          tipTextMap: {
            bold: '_i18n"replace bold"',
            italic: '_i18n"replace italic"',
          },
          defaultTooltipOptions: {
            tipHoverable: false,
          },
        },
      },
    })
  })
})
function switchLanguage() {
  lang.value = lang.value === 'zh-CN' ? 'en-US' : 'zh-CN';
  (editor.getModule('i18n') as I18N).changeLanguage({ lang: lang.value })
}
</script>

<template>
  <button @click="switchLanguage">
    Click here to switch between Chinese and English languages
  </button>
  <div ref="editorRef" />
</template>

<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import type { I18N } from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'

let editor: FluentEditor
const editorRef = ref<HTMLElement>()
const lang = ref('en-US')

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then(({ default: FluentEditor }) => {
    if (!editorRef.value) return
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike', 'underline'],
          ['link', 'image', 'emoji'],
          [{ color: [] }, { background: [] }],
        ],
        counter: true,
        emoji: true,
        i18n: {
          lang: lang.value,
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

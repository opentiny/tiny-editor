<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'

let editor: FluentEditor

const editorRef = ref<HTMLElement>()
const editable = ref(true)

// @提醒
const searchKey = 'name'
const mentionList = [
  {
    name: 'Jack',
    age: 26,
    cn: 'Jack 杰克',
    link: '#/use/Jack',
    target: '_blank',
  },
  {
    name: 'Lucy',
    age: 22,
    cn: 'Lucy 露西',
    link: '#/use/Lucy',
    target: '_blank',
  },
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    if (!editorRef.value) return
    const FluentEditor = module.default

    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        mention: {
          itemKey: 'cn',
          searchKey,
          search(term) {
            return mentionList.filter((item) => {
              return item[searchKey] && String(item[searchKey]).includes(term)
            })
          },
        },
      },
    })
  })
})
function toggleEditable() {
  editable.value = !editable.value
  editor.enable(editable.value)
}
</script>

<template>
  <div style="display: flex;">
    <button @click="toggleEditable">
      toggle editable
    </button>
    <div style="margin-left: auto;">
      {{ editable ? 'enabled' : 'disabled' }}
    </div>
  </div>
  <div ref="editorRef" />
</template>

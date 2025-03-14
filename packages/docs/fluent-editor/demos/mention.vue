<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

// @提醒
const searchKey = 'name'
const mentionList = [
  {
    name: 'Jack',
    age: 26,
    cn: 'Jack 杰克',
  },
  {
    name: 'Lucy',
    age: 22,
    cn: 'Lucy 露西',
  },
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    editor = new FluentEditor('#editor', {
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
</script>

<template>
  <div id="editor" />
</template>

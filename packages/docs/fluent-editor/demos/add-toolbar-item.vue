<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

const TOOLBAR_CONFIG = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],

  // 配置自定义工具栏
  ['good', 'bad'],
]

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    // 增加工具栏图标
    const goodIcon = `<svg t="1734490908682" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5918" width="200" height="200"><path d="M881.066667 394.666667c-21.333333-23.466667-51.2-36.266667-81.066667-36.266667H618.666667v-117.333333c0-44.8-29.866667-85.333333-87.466667-117.333334-17.066667-10.666667-38.4-12.8-57.6-8.533333-19.2 4.266667-36.266667 17.066667-46.933333 34.133333-2.133333 2.133333-2.133333 4.266667-4.266667 6.4l-125.866667 281.6H204.8c-59.733333 0-108.8 46.933333-108.8 106.666667v258.133333c0 57.6 49.066667 106.666667 108.8 106.666667h544c53.333333 0 98.133333-38.4 106.666667-89.6l51.2-337.066667c4.266667-34.133333-6.4-64-25.6-87.466666z m-593.066667 448H204.8c-25.6 0-44.8-19.2-44.8-42.666667v-256c0-23.466667 19.2-42.666667 44.8-42.666667h83.2v341.333334z m554.666667-373.333334L789.333333 806.4c-4.266667 21.333333-21.333333 36.266667-42.666666 36.266667H352V471.466667l130.133333-290.133334c2.133333-4.266667 4.266667-4.266667 6.4-4.266666 2.133333 0 4.266667 0 8.533334 2.133333 25.6 14.933333 55.466667 38.4 55.466666 64v149.333333c0 17.066667 14.933333 32 32 32h213.333334c12.8 0 25.6 4.266667 34.133333 14.933334 8.533333 6.4 12.8 19.2 10.666667 29.866666z" fill="#666666" p-id="5919"></path></svg>`
    const badIcon = `<svg t="1734491308472" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3380" width="200" height="200"><path d="M904.533333 522.666667L853.333333 185.6c-8.533333-51.2-55.466667-89.6-106.666666-89.6H204.8c-59.733333 0-108.8 46.933333-108.8 106.666667v258.133333c0 57.6 49.066667 106.666667 108.8 106.666667h91.733333l125.866667 281.6c2.133333 2.133333 2.133333 4.266667 4.266667 6.4 14.933333 23.466667 38.4 36.266667 64 36.266666 12.8 0 25.6-4.266667 38.4-10.666666 57.6-34.133333 87.466667-72.533333 87.466666-117.333334v-117.333333h183.466667c32 0 59.733333-12.8 81.066667-36.266667 19.2-25.6 29.866667-55.466667 23.466666-87.466666z m-616.533333-21.333334H204.8c-25.6 0-44.8-19.2-44.8-42.666666v-256c0-23.466667 19.2-42.666667 44.8-42.666667h83.2v341.333333zM832 567.466667c-8.533333 8.533333-21.333333 14.933333-34.133333 14.933333h-213.333334c-17.066667 0-32 14.933333-32 32v149.333333c0 25.6-29.866667 49.066667-55.466666 64-4.266667 2.133333-10.666667 2.133333-14.933334-4.266666L352 533.333333V160H746.666667c21.333333 0 40.533333 14.933333 42.666666 36.266667L842.666667 533.333333c2.133333 10.666667-2.133333 23.466667-10.666667 34.133334z" fill="#666666" p-id="3381"></path></svg>`
    const icons = FluentEditor.import('ui/icons') as Record<string, string>
    icons.good = goodIcon
    icons.bad = badIcon

    // 注册自定义格式
    const Parchment = FluentEditor.import('parchment')
    const GoodStyle = new Parchment.StyleAttributor('good', 'color', {
      scope: Parchment.Scope.INLINE,
    })
    const BadStyle = new Parchment.StyleAttributor('bad', 'color', {
      scope: Parchment.Scope.INLINE,
    })
    FluentEditor.register('formats/good', GoodStyle)
    FluentEditor.register('formats/bad', BadStyle)

    editor = new FluentEditor('#editor-add-toolbar-item', {
      theme: 'snow',
      modules: {
        toolbar: {
          container: TOOLBAR_CONFIG,
          handlers: {
            good(value: boolean) {
              // 给选中的内容设置格式
              this.quill.format('good', value ? '#5cb300' : '')
            },
            bad(value: boolean) {
              this.quill.format('bad', value ? '#f23030' : '')
            },
          },
        },
      },
    })
  })
})
</script>

<template>
  <div id="editor-add-toolbar-item">
    <p>Hello <strong>TinyEditor</strong>!</p>
  </div>
</template>

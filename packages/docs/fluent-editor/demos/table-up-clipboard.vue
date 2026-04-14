<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted, ref } from 'vue'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'

let editorContextmenu: FluentEditor
let editorSelect: FluentEditor
const editorContextmenuRef = ref<HTMLElement>()

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const [
    { default: FluentEditor, DEFAULT_TOOLBAR, generateTableUp },
    { defaultCustomSelect, TableMenuContextmenu, TableSelection, TableUp },
  ] = await Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-table-up'),
  ])

  FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)
  if (editorContextmenuRef.value) {
    editorContextmenu = new FluentEditor(editorContextmenuRef.value, {
      theme: 'snow',
      modules: {
        'toolbar': [
          ...DEFAULT_TOOLBAR,
          [{ 'table-up': [] }],
        ],
        'table-up': {
          customSelect: defaultCustomSelect,
          pasteStyleSheet: true,
          pasteDefaultTagStyle: false,
          modules: [
            { module: TableSelection },
            { module: TableMenuContextmenu },
          ],
        },
      },
    })
  }
})
</script>

<template>
  <div>
    <p>
      主要针对从 Excel 粘贴内容时，quill-table-up从3.5.0版本新增的选项 pasteStyleSheet，配置为 true 会将粘贴的 html 中 style 标签的样式也进行解析。
      如果你希望保留粘贴 html 中通过标签选择器设置的样式，可以将 pasteDefaultTagStyle 也设置为 true。
    </p>
    <p> 请注意：如果开启了配置 pasteStyleSheet，可能会对粘贴时的解析性能造成一定影响，因为会对整个粘贴的文档进行额外的解析。</p>
    <div ref="editorContextmenuRef" />
  </div>
</template>

<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import type { I18n } from '@opentiny/fluent-editor'
import katex from 'katex'
import QuillToolbarTip from 'quill-toolbar-tip'
import { onMounted, ref, watch } from 'vue'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'
import 'quill-toolbar-tip/dist/index.css'
import 'katex/dist/katex.min.css'

window.katex = katex

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

onMounted(async () => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  const [
    {
      default: FluentEditor,
      FULL_TOOLBAR,
      generateTableUp,
      generateTableUpShortKeyMenu,
      generateToolbarTip,
    },
    {
      createSelectBox,
      defaultCustomSelect,
      TableUp,
      TableVirtualScrollbar,
      TableAlign,
      TableResizeLine,
      TableResizeScale,
      TableSelection,
      TableMenuContextmenu,
    },
  ] = await Promise.all([
    import('@opentiny/fluent-editor'),
    import('quill-table-up'),
  ])

  FluentEditor.register({
    'modules/table-up': generateTableUp(TableUp),
    'modules/toolbar-tip': generateToolbarTip(QuillToolbarTip),
  }, true)
  const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox)
  tableUpConfig.title = function () {
    return (this.quill.getModule('i18n') as I18n).t('table') as string
  }
  if (editorRef.value) {
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        'toolbar': FULL_TOOLBAR,
        'table-up': {
          customSelect: defaultCustomSelect,
          modules: [
            { module: TableVirtualScrollbar },
            { module: TableAlign },
            { module: TableResizeLine },
            { module: TableResizeScale },
            { module: TableSelection },
            { module: TableMenuContextmenu },
          ],
        },
        'shortcut-key': {
          menuItems: [tableUpConfig],
          isMenuItemsAdd: true,
          menuKeyboardControls(event, data) {
            let result = false
            result = tableUpKeyboardControl(event, data) || result
            return result
          },
        },
        'toolbar-tip': {
          defaultTooltipOptions: {
            tipHoverable: false,
          },
        },
      },
    })
  }
})

const lang = ref('en-US')
watch(lang, (value) => {
  (editor.getModule('i18n') as I18n).setLocale(value)
})
</script>

<template>
  <label for="locale-select">Language:</label>
  <select id="locale-select" v-model="lang">
    <option value="en-US">
      English
    </option>
    <option value="zh-CN">
      中文
    </option>
  </select>
  <div ref="editorRef" />
</template>

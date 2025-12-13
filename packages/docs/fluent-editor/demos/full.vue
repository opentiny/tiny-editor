<script setup lang="ts">
import FluentEditor, { FULL_TOOLBAR, I18N, generateToolbarTip, generateTableUp, CollaborationModule } from '@opentiny/fluent-editor'

// 这里实际导入的是一个 json 文件，包含了 emoji-mart 所需的所有表情数据，类型是 EmojiMartData
import data from '@emoji-mart/data'
// computePosition 函数用于计算 emoji picker显示的位置
import { computePosition } from '@floating-ui/dom'

import { defaultCustomSelect, TableMenuContextmenu, TableSelection, TableUp } from 'quill-table-up'

import QuillToolbarTip from 'quill-toolbar-tip'
import type { EmojiMartData } from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

import 'quill-toolbar-tip/dist/index.css'
import 'quill-table-up/index.css'
import 'quill-table-up/table-creator.css'


import type { MathliveModule } from '@opentiny/fluent-editor'

import MarkdownShortcuts from 'quill-markdown-shortcuts'


import SimpleMindMap from 'simple-mind-map'
import Drag from 'simple-mind-map/src/plugins/Drag.js'
import Export from 'simple-mind-map/src/plugins/Export.js'
import Themes from 'simple-mind-map-plugin-themes'
import nodeIconList from 'simple-mind-map/src/svg/icons'

import LogicFlow from '@logicflow/core'
import { DndPanel, SelectionSelect, Snapshot } from '@logicflow/extension'

import * as Y from 'yjs'
import { Awareness } from 'y-protocols/awareness'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import QuillCursors from 'quill-cursors'

import 'mathlive'
import 'mathlive/static.css'
import 'mathlive/fonts.css'

// 代码块高亮
import hljs from 'highlight.js'
// 截屏
import Html2Canvas from 'html2canvas'
// 插入公式
import katex from 'katex'
import { onMounted, ref } from 'vue'
import 'highlight.js/styles/atom-one-dark.css'
import 'katex/dist/katex.min.css'

// window.hljs = hljs
window.katex = katex
window.Html2Canvas = Html2Canvas

// @提醒
const searchKey = 'name'
const mentionList = [
  {
    name: 'kagol',
    cn: '卡哥',
    followers: 156,
    avatar: 'https://avatars.githubusercontent.com/u/9566362?v=4',
  },
  {
    name: 'zzcr',
    cn: '超哥',
    followers: 10,
    avatar: 'https://avatars.githubusercontent.com/u/18521562?v=4',
  },
  {
    name: 'hexqi',
    cn: '小伍哥',
    followers: 2,
    avatar: 'https://avatars.githubusercontent.com/u/18585869?v=4',
  },
]

let editor: FluentEditor
const editorRef = ref<HTMLElement>()

const ROOM_NAME = `tiny-editor-document-demo-roomName`

const CURSOR_CLASSES = {
  SELECTION_CLASS: 'ql-cursor-selections',
  CARET_CONTAINER_CLASS: 'ql-cursor-caret-container',
  CARET_CLASS: 'ql-cursor-caret',
  FLAG_CLASS: 'ql-cursor-flag',
  NAME_CLASS: 'ql-cursor-name',
}

onMounted(() => {
  if (!editorRef.value) return

  FluentEditor.register({ 'modules/toolbar-tip': generateToolbarTip(QuillToolbarTip) }, true)
  FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)
  FluentEditor.register('modules/markdownShortcuts', MarkdownShortcuts)
  FluentEditor.register(
    'modules/collaborative-editing',
    CollaborationModule,
    true,
  )

  const lang = ref('zh-CN')

  editor = new FluentEditor(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          ...FULL_TOOLBAR,
          ['mind-map', 'flow-chart'],
        ],
        handlers: {
          formula() {
            const mathlive = this.quill.getModule('mathlive') as MathliveModule
            mathlive.createDialog('e=mc^2')
          },
        },
      },
      file: true,
      markdownShortcuts: true,
      syntax: {
        hljs
      },
      'counter': true,
      mathlive: true,
      'emoji': {
        emojiData: data as EmojiMartData,
        EmojiPicker: Picker,
        emojiPickerPosition: computePosition,
      },
      'i18n': {
        lang: lang.value,
      },
      'toolbar-tip': {
        defaultTooltipOptions: {
          tipHoverable: false,
        },
      },
      'table-up': {
        customSelect: defaultCustomSelect,
        modules: [
          { module: TableSelection },
          { module: TableMenuContextmenu },
        ],
      },
      'mind-map': {
        deps: {
          SimpleMindMap,
          Themes,
          Drag,
          Export,
          nodeIconList,
        },
      },
      'flow-chart': {
        deps: {
          LogicFlow,
          DndPanel,
          SelectionSelect,
          Snapshot,
        },
      },
      mention: {
        containerClass: 'ql-mention-list-container__custom-list',
        itemKey: 'cn',
        searchKey,
        search(term) {
          return mentionList.filter((item) => {
            return item[searchKey] && String(item[searchKey]).includes(term)
          })
        },
        renderMentionItem(item) {
          return `
            <div class="item-avatar">
              <img src="${item.avatar}">
            </div>
            <div class="item-info">
              <div class="item-name">${item.cn}</div>
              <div class="item-desc">${item.followers}粉丝</div>
            </div>
          `
        },
      },
      'collaborative-editing': {
        deps: {
          Y,
          Awareness,
          QuillBinding,
          QuillCursors,
          WebsocketProvider,
          IndexeddbPersistence,
        },
        provider: {
          type: 'websocket',
          options: {
            serverUrl: 'wss://120.26.92.145:1234',
            roomName: ROOM_NAME,
          },
        },
        awareness: {
          state: {
            name: `userId:${Math.random().toString(36).substring(2, 15)}`,
            color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`,
          },
        },
        cursors: {
          template: `
              <span class="${CURSOR_CLASSES.SELECTION_CLASS}"></span>
              <span class="${CURSOR_CLASSES.CARET_CONTAINER_CLASS}">
                <span class="${CURSOR_CLASSES.CARET_CLASS}"></span>
              </span>
              <div class="${CURSOR_CLASSES.FLAG_CLASS}">
                <small class="${CURSOR_CLASSES.NAME_CLASS}"></small>
              </div>
          `,
          hideDelayMs: 500,
          hideSpeedMs: 300,
          transformOnTextChange: true,
        },
      },
    },
  })
})
</script>

<template>
  <div ref="editorRef" />
  <div></div>
</template>

<style lang="less">
.ql-mention-list-container.ql-mention-list-container__custom-list .ql-mention-list .ql-mention-item {
  display: flex;
  align-items: center;
  height: 52px;
  line-height: 1.5;
  font-size: 12px;
  padding: 0 12px;

  &.ql-mention-item--active {
    background-color: #f1f2f3;
    color: #18191c;
  }

  .item-avatar {
    margin-right: 8px;

    img {
      width: 36px;
      border-radius: 50%;
    }
  }

  .item-info {
    .item-desc {
      color: #9499a0;
    }
  }
}
</style>

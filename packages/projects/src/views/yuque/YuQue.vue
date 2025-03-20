<script setup lang="ts">
import FluentEditor, { generateTableUp, generateTableUpShortKeyMenu } from '@opentiny/fluent-editor'
import HeaderList from 'quill-header-list'
import { createSelectBox, defaultCustomSelect, TableMenuContextmenu, TableResizeLine, TableResizeScale, TableSelection, TableUp } from 'quill-table-up'
import { onMounted, ref } from 'vue'

FluentEditor.register({ 'modules/header-list': HeaderList }, true)
FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true)

const { tableUpConfig, tableUpKeyboardControl } = generateTableUpShortKeyMenu(createSelectBox)
tableUpConfig.title = '_i18n"table"'

let editor: FluentEditor
const headerListRef = ref<HTMLElement>()

const title = ref('测试文档')

const TOOLBAR_CONFIG = [
  ['undo', 'redo', 'format-painter', 'clean'],
  [
    { header: [false, 1, 2, 3, 4, 5, 6] },
    { size: ['12px', '13px', '14px', '15px', '16px', '19px', '22px', '24px', '29px', '32px', '40px', '48px'] },
    'bold',
    'italic',
    'strike',
    'underline',
    { script: 'super' },
    { script: 'sub' },
    'code',
  ],
  [{ color: [] }, { background: [] }],
  [
    { align: ['', 'center', 'right', 'justify'] },
    { list: 'ordered' },
    { list: 'bullet' },
    { indent: '+1' },
    { indent: '-1' },
    { 'line-height': ['1', '1.15', '1.5', '2', '2.5', '3'] },
  ],
  [{ list: 'check' }, 'link', 'blockquote', 'divider'],
  [{ 'table-up': [] }, 'header-list'],
]

onMounted(() => {
  editor = new FluentEditor('#editor', {
    theme: 'snow',
    modules: {
      'toolbar': {
        container: TOOLBAR_CONFIG,
        handlers: {
          'header-list': HeaderList.toolbarHandle,
        },
      },
      'header-list': {
        container: headerListRef.value,
        scrollContainer: window,
      },
      'table-up': {
        customSelect: defaultCustomSelect,
        selection: TableSelection,
        selectionOptions: {
          tableMenu: TableMenuContextmenu,
        },
        resize: TableResizeLine,
        resizeScale: TableResizeScale,
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
    },
  })
})
</script>

<template>
  <div
    class="fixed top-0 z-1 h-[52px] w-full flex items-center pl-[16px] bg-white"
  >
    <RouterLink to="/" class="hidden">
      &lt;返回
    </RouterLink>
    <span>{{ title }}</span>
  </div>
  <div class="!mt-[94px]">
    <div class="flex justify-center pt-[33px] pb-[26px]">
      <textarea v-model="title" placeholder="请输入标题" class="w-[750px] text-[#262626] h-[54px] outline-none resize-none text-[36px] font-bold placeholder-[#bfbfbf]" />
    </div>
    <div id="editor" class="!border-0 max-w-[750px] !ml-auto !mr-auto">
      <p>
        这是一篇<a
          class="ql-normal-link"
          href="https://opentiny.github.io/tiny-editor/"
          target="_blank"
        >测试文档</a>
      </p>
      <p>这是<strong>粗体</strong></p>
      <p>这是<em>斜体</em></p>
      <p>这是<u class="ql-custom-strike">删除线</u></p>
      <p>这是<u>下划线</u></p>
      <p>这是上标X<sup>2</sup>和下标X<sub>2</sub></p>
      <p>
        这是<span style="color: rgb(223, 42, 63)">文本色</span>和<span
          style="background-color: rgb(116, 182, 2)"
        >背景色</span>
      </p>
      <ol class="unchecked">
        <li class="bullet">
          <span class="ql-ui" contenteditable="false" />这是一个无序列表
        </li>
        <li class="bullet">
          <span class="ql-ui" contenteditable="false" />这是一个无序列表
        </li>
        <li class="ordered">
          <span class="ql-ui" contenteditable="false" />这是一个有序列表
        </li>
        <li class="ordered">
          <span class="ql-ui" contenteditable="false" />这是一个有序列表
        </li>
        <li class="unchecked">
          <span class="ql-ui" contenteditable="false" />这是一个任务项
        </li>
        <li class="unchecked">
          <span class="ql-ui" contenteditable="false" />这是一个任务项
        </li>
      </ol>
      <blockquote>这是一段引用</blockquote>
      <blockquote>这是一段引用</blockquote>
      <p>
        这是一段<code style="background-color: rgba(0, 0, 0, 0.06)">行内代码</code>。
      </p>
      <hr contenteditable="false">
      <h1><span style="line-height: 36px">标题1</span></h1>
      <h2><span style="line-height: 32px">标题2</span></h2>
      <h3><span style="line-height: 28px">标题3</span></h3>
      <h4><span style="line-height: 24px">标题4</span></h4>
      <h5><span style="line-height: 24px">标题5</span></h5>
      <h6><span style="line-height: 24px">标题6</span></h6>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <h1><span style="line-height: 36px">标题2</span></h1>
      <p>正文</p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <p>这是测试文档的底部。</p>
    </div>
  </div>
  <div ref="headerListRef" class="header-list is-hidden fixed top-[140px] right-0">
    <p>大纲</p>
  </div>
</template>

<style lang="scss">
.ql-editor {
  padding: 0 !important;
  min-height: calc(100vh - 94px);
  font-family:
    PingFang SC,
    Hiragino Sans GB,
    Microsoft YaHei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif,
    Segoe UI;
  font-size: 15px !important;
  color: #262626;

  p {
    line-height: 2.2;
  }

  hr {
    margin: 12px 0;
    color: #e7e9e8;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #262626;
    font-weight: 700;
  }

  h1 {
    font-size: 28px !important;
    line-height: 38px !important;
    margin-top: 38px !important;
    margin-bottom: 19px !important;
  }

  h2 {
    font-size: 24px !important;
    line-height: 34px !important;
    margin-top: 34px !important;
    margin-bottom: 17px !important;
  }

  h3 {
    font-size: 20px !important;
    line-height: 30px !important;
    margin-top: 30px !important;
    margin-bottom: 15px !important;
  }

  h4 {
    font-size: 16px !important;
    line-height: 26px !important;
    margin-top: 26px !important;
    margin-bottom: 13px !important;
  }

  h5,
  h6 {
    font-size: 15px !important;
    line-height: 24px !important;
    margin-top: 24px !important;
    margin-bottom: 12px !important;
  }

  blockquote {
    margin: 0 !important;
    border-left: solid 2px #d8dad9 !important;
    padding-left: 10px !important;
    opacity: 0.7;
    line-height: 24px;
  }

  a {
    color: #117cee !important;
    text-decoration: none !important;
  }

  ol {
    padding-left: 0 !important;
  }

  li {
    padding-left: 2em !important;
  }

  li.checked > .ql-ui,
  li.unchecked > .ql-ui {
    border-radius: 4px;
    transition: all 0.3s;
    margin-left: -20px !important;
    top: 3px;
  }

  li.unchecked > .ql-ui {
    border-color: #e7e9e8 !important;
  }

  li.checked > .ql-ui {
    border-color: #00b96b !important;
    background-color: #00b96b !important;
  }

  li.bullet::before,
  li.ordered::before {
    position: absolute;
  }

  li.bullet::before {
    left: 26px;
    font-size: 16px;
  }

  li.ordered::before {
    left: 28px;
    font-size: 14px;
  }

  code {
    margin: 1px 3px;
    font-size: 15px !important;
    background-color: #0000000f !important;
    border-color: #e7e9e8;
  }
}

.ql-toolbar {
  position: fixed !important;
  z-index: 1;
  width: 100%;
  top: 52px;
  padding-left: 16px !important;
  background-color: #fff !important;
  border-left: 0;
  border-right: 0;
  border-color: #0000000a !important;
  text-align: center;
}
</style>

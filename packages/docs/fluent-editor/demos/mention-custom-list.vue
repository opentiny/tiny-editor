<script setup lang="ts">
import type FluentEditor from '@opentiny/fluent-editor'
import { onMounted } from 'vue'

let editor: FluentEditor

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

onMounted(() => {
  // ssr compat, reference: https://vitepress.dev/guide/ssr-compat#importing-in-mounted-hook
  import('@opentiny/fluent-editor').then((module) => {
    const FluentEditor = module.default

    editor = new FluentEditor('#editor-mention-custom-list', {
      theme: 'snow',
      modules: {
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
      },
    })
  })
})
</script>

<template>
  <div id="editor-mention-custom-list" />
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

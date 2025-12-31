# @提醒

通过输入 `@` 符号，可以触发提醒功能。

## 基本用法

通过配置 `mention` 模块，可以开启@提醒功能。

:::demo src=examples/demos/mention.vue
:::

## 自定义列表样式

通过配置 `renderMentionItem` 方法，可以自定义选项列表的样式。

:::demo src=examples/demos/mention-custom-list.vue
:::

## 跳转链接

在数据中配置`link`与`target`属性，可设置提醒跳转的链接，对应`a`标签的`href`与`target`属性。

当编辑器处于可编辑状态时，链接跳转不可以，注意切换为只读状态。

:::demo src=examples/demos/mention-link.vue
:::

## API

`mention` 模块配置项：

```typescript
interface MentionOption {
  containerClass?: string
  defaultLink?: string
  itemActiveClass?: string
  itemKey: string
  itemClass?: string
  listClass?: string
  listHideClass?: string
  maxHeight?: number
  mentionChar?: string
  remove?: (data: any) => void
  renderMentionItem?: (data: any) => string | HTMLElement
  renderMentionText?: (data: any) => string | HTMLElement
  search?: (term: string) => Promise<any[]>
  searchKey: string
  select?: (data: any) => void
  target?: string
}
```

# 表情

TinyEditor 的提供了对 emoji-mart 的封装，可以快速进行集成

## 安装依赖

```bash
npm i @floating-ui/dom @emoji-mart/data emoji-mart
```

## 集成示例

工具栏配置增加 `emoji`，modules 增加 `emoji` 按照如下代码所示配置进行配置后即可使用

> `emojiData`、`EmojiPicker`、`emojiPickerPosition` 支持通过 window 传入

<demo vue="../../demos/emoji.vue" />

## Options

`emoji` 支持如下配置

| 配置项             | 类型       | 默认值                                                                                             | 描述                                                                         |
| ------------------ | ---------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `theme`            | `string`   | `'light'`                                                                                          | 设置主题样式，可选值：`light`、`dark`、`auto`。                              |
| `set`              | `string`   | `'native'`                                                                                         | emoji 图标集，可选值有：`native`、`apple`、`google`、`twitter`、`facebook`。 |
| `skinTonePosition` | `string`   | `'none'`                                                                                           | 设置肤色选择器的位置，可选：`none`、`top`、`preview`。                       |
| `previewPosition`  | `string`   | `'bottom'`                                                                                         | 设置预览区域的位置，可选值：`none`、`top`、`bottom`。                        |
| `searchPosition`   | `string`   | `'sticky'`                                                                                         | 设置搜索栏的位置，可选值：`none`、`static`、`sticky`。                       |
| `categories`       | `string[]` | `[ 'frequent', 'people', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols', 'flags' ]` | 控制显示的 emoji 分类。                                                      |
| `maxFrequentRows`  | `number`   | `2`                                                                                                | 设置“常用表情”最大显示的行数。                                               |
| `perLine`          | `number`   | `8`                                                                                                | 每行显示 emoji 的数量。                                                      |
| `navPosition`      | `string`   | `'top'`                                                                                            | 分类导航的位置，可选值：`top`、`bottom`、`none`。                            |
| `noCountryFlags`   | `boolean`  | `false`                                                                                            | 是否禁用国家/地区旗帜 emoji。                                                |
| `dynamicWidth`     | `boolean`  | `false`                                                                                            | 是否根据容器宽度动态决定 `perLine` 的值。                                    |

> 💡 以上配置项最终会传递给 [`<EmojiPicker>`](https://github.com/missive/emoji-mart#-emoji-component) 组件，你可以根据项目实际需要进行覆盖。
>
> 更多配置可参考 [emoji-mart Options / Props](https://github.com/missive/emoji-mart#options--props)

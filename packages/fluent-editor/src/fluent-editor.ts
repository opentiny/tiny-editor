import { FontStyle, LineHeightStyle, SizeStyle, TextIndentStyle } from './attributors'
import { EN_US } from './config/i18n/en-us'
import { ZH_CN } from './config/i18n/zh-cn'
import FluentEditor from './core/fluent-editor'
import SoftBreak from './formats/soft-break' // 软回车
import Strike from './formats/strike' // 删除线
import Video from './formats/video' // 视频
import Counter from './modules/counter' // 字符统计
import CustomClipboard from './modules/custom-clipboard' // 粘贴板
import Image from './modules/custom-image/BlotFormatter' // 图片
import { FileUploader } from './modules/custom-uploader' // 上传
import DividerBlot from './modules/divider' // 分割线
import Emoji from './modules/emoji' // 表情
import FileModule from './modules/file' // 文件
import I18N from './modules/i18n'
import Link from './modules/link' // 超链接
import MathliveModule from './modules/mathlive' // latex公式
import MathliveBlot from './modules/mathlive/formats'
import Mention from './modules/mention/Mention' // @提醒
import { ShortCutKey } from './modules/shortcut-key'
import Syntax from './modules/syntax' // 代码块高亮
import Toolbar from './modules/toolbar' // 工具栏
import { ColorPicker, Picker } from './modules/toolbar/better-picker'
import SnowTheme from './themes/snow'
import Icons from './ui/icons'

I18N.register(
  {
    'en-US': EN_US,
    'zh-CN': ZH_CN,
  },
  true,
)
FluentEditor.register(
  {
    'attributors/style/font': FontStyle,
    'attributors/style/size': SizeStyle,
    'attributors/style/line-height': LineHeightStyle,

    'formats/font': FontStyle,
    'formats/line-height': LineHeightStyle,
    'formats/size': SizeStyle,
    'formats/emoji': Emoji.EmojiBlot,
    [`formats/${MathliveBlot.blotName}`]: MathliveBlot,
    'formats/softBreak': SoftBreak,
    'formats/strike': Strike,
    'formats/text-indent': TextIndentStyle,
    'formats/video': Video,

    'modules/clipboard': CustomClipboard,
    'modules/counter': Counter,
    'modules/divider': DividerBlot,
    'modules/emoji-shortname': Emoji.ShortNameEmoji,
    'modules/emoji-toolbar': Emoji.ToolbarEmoji,
    'modules/file': FileModule,
    'modules/i18n': I18N,
    'modules/image': Image,
    'modules/link': Link,
    'modules/mathlive': MathliveModule,
    'modules/mention': Mention,
    'modules/syntax': Syntax,
    'modules/toolbar': Toolbar,
    'modules/uploader': FileUploader,
    'modules/shortcut-key': ShortCutKey,

    'themes/snow': SnowTheme,

    'ui/icons': Icons,
    'ui/picker': Picker,
    'ui/color-picker': ColorPicker,
  },
  true, // 覆盖内部模块
)

export default FluentEditor

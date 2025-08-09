import { FontStyle, LineHeightStyle, SizeStyle, TextIndentStyle } from './attributors'
import { EN_US } from './config/i18n/en-us'
import { ZH_CN } from './config/i18n/zh-cn'
import FluentEditor from './core/fluent-editor'
import { EmojiBlot, SoftBreak, StrikeBlot, Video } from './formats'
import Counter from './modules/counter' // 字符统计
import { CustomClipboard } from './modules/custom-clipboard' // 粘贴板
import { BlotFormatter } from './modules/custom-image' // 图片
import { FileUploader } from './modules/custom-uploader' // 上传
import { DividerBlot } from './modules/divider' // 分割线
import { EmojiModule } from './modules/emoji'
import { FileModule } from './modules/file' // 文件
import { FlowChartModule } from './modules/flow-chart' // 流程图
import I18N from './modules/i18n'
import { LinkBlot } from './modules/link' // 超链接
import { MathliveModule } from './modules/mathlive' // latex公式
import { Mention } from './modules/mention' // @提醒
import { MindMapModule } from './modules/mind-map' // 思维导图
import { ShortCutKey } from './modules/shortcut-key'
import Syntax from './modules/syntax' // 代码块高亮
import { BetterToolbar } from './modules/toolbar' // 工具栏
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
    'formats/emoji': EmojiBlot,
    'formats/softBreak': SoftBreak,
    'formats/strike': StrikeBlot,
    'formats/text-indent': TextIndentStyle,
    'formats/video': Video,
    'formats/divider': DividerBlot,
    'formats/link': LinkBlot,

    'modules/clipboard': CustomClipboard,
    'modules/counter': Counter,
    'modules/emoji': EmojiModule,
    'modules/file': FileModule,
    'modules/i18n': I18N,
    'modules/image': BlotFormatter,
    'modules/mathlive': MathliveModule,
    'modules/mention': Mention,
    'modules/syntax': Syntax,
    'modules/toolbar': BetterToolbar,
    'modules/uploader': FileUploader,
    'modules/shortcut-key': ShortCutKey,
    'modules/mind-map': MindMapModule,
    'modules/flow-chart': FlowChartModule,

    'themes/snow': SnowTheme,

    'ui/icons': Icons,
    'ui/picker': Picker,
    'ui/color-picker': ColorPicker,
  },
  true, // 覆盖内部模块
)

export default FluentEditor

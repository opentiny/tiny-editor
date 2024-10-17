import type { Module, Parchment as TypeParchment } from 'quill'
import type { IEditorConfig } from './config/types'
import Quill from 'quill'
import { FontStyle, LineHeightStyle, SizeStyle, TextIndentStyle } from './attributors' // 字符统计
import { getListValue, ICONS_CONFIG, inputFile, TABLE_MENU_TEXT_CONFIG, TABLE_RIGHT_MENU_CONFIG, TABLE_TEXT_CONFIG, TABLEUP_RIGHT_MENU_TEXT_CONFIG } from './config' // 粘贴板
import Counter from './counter' // 图片
import CustomClipboard from './custom-clipboard' // 图片拉伸模块
import CustomImage from './custom-image/BlotFormatter' // 上传
import { CustomImageSpec } from './custom-image/specs/CustomImageSpec' // 表情
import CustomUploader from './custom-uploader' // 文件
import Emoji from './emoji' // 超链接0
import FileModule from './file' // @提醒
import { FormatPainter } from './format-painter'// 截图
// import GlobalLink from './global-link' // 全局链接
import Link from './link' // 软回车
import Mention from './mention/Mention' // 删除线
// import QuickMenu from './quick-menu' // 快捷菜单
import { Screenshot } from './screenshot' // 表格
import SoftBreak from './soft-break' // 代码块高亮
import Strike from './strike' // 工具栏
import CustomSyntax from './syntax' // 视频
import BetterTable from './table/better-table'
import TableUp from './table-up'
import Toolbar from './toolbar'
import Video from './video'

class FluentEditor extends Quill {
  constructor(container: HTMLElement | string, options: IEditorConfig = {}) {
    super(container, options)
  }
}

const registerModules = function () {
  const Icons = Quill.imports['ui/icons']
  const iconKeys = Object.keys(ICONS_CONFIG)
  iconKeys.forEach((iconKey) => {
    Icons[iconKey] = ICONS_CONFIG[iconKey]
  })

  const SnowTheme = Quill.imports['themes/snow'] as typeof Module
  SnowTheme.DEFAULTS = {
    modules: {
      'keyboard': {
        bindings: {
          ...BetterTable.keyboardBindings,
        },
      },
      'toolbar': {
        handlers: {
          ...(SnowTheme.DEFAULTS as Record<string, any>).modules.toolbar.handlers,
          'undo': function () {
            this.quill.history.undo()
          },
          'redo': function () {
            this.quill.history.redo()
          },
          'better-table': function () {
            this.quill.getModule('better-table').insertTable(3, 3)
          },
          'file': function () {
            const accept = this.quill.options?.uploadOption?.fileAccept
            inputFile.call(this, 'file', accept)
          },
          'image': function () {
            const accept = this.quill.options?.uploadOption?.imageAccept
            inputFile.call(this, 'image', accept)
          },
          'emoji': function () {},
          'fullscreen': function () {},
          'list': function (value) {
            const range = this.quill.getSelection()
            const formats = this.quill.getFormat(range)
            const preListValue = Array.isArray(formats.list) ? formats.list[0]?.value : formats.list?.value
            const curListValue = getListValue(value, preListValue)
            // 如果设置list的选区中有表格，判断第一个table-col位置，将表格前的内容设置为list格式
            const lines = this.quill.getLines(range.index, range.length)
            const tableCols = lines.filter(line => line.statics.blotName === 'table-col' && !line.prev)
            if (tableCols.length) {
              let start = range.index
              // 遍历table-col群组，以之获取表格，将表格前选区设置为对应list格式
              tableCols.forEach((item, index) => {
                const table = item.domNode.closest('table.quill-better-table')
                const tableBlot = Quill.find(table) as TypeParchment.Blot
                const tableLength = tableBlot.length()
                const tableStart = this.quill.getIndex(item)
                const tableEnd = tableStart + tableLength
                const beforeTableRangeLength = tableStart - start
                // 在表格前设置列表
                this.quill.setSelection(start, beforeTableRangeLength, Quill.sources.SILENT)
                this.quill.format('list', curListValue, Quill.sources.USER)
                table.parentNode.classList.remove('quill-better-table-selected')
                // 当前表格末尾为下一个选取的开始
                start = tableEnd
                if (index === tableCols.length - 1) {
                  // 将最后一个表格之后所有选区内容设置list格式
                  this.quill.setSelection(tableEnd, range.index + range.length - tableEnd)
                  this.quill.format('list', curListValue, Quill.sources.USER)
                }
              })
            }
            else {
              this.quill.format('list', curListValue, Quill.sources.USER)
            }
          },
          [FormatPainter.toolName]: FormatPainter,
          [Screenshot.toolName]: Screenshot,
        },
      },
      'better-table': {
        operationMenu: {
          items: TABLE_RIGHT_MENU_CONFIG,
          color: true,
        },
      },
      [TableUp.moduleName]: {
        full: false,
        resizerSetOuter: true,
        selection: {
          selectColor: '#5170ff',
          tableMenu: {
            tipText: true,
            contextmenu: true,
            tipTexts: TABLEUP_RIGHT_MENU_TEXT_CONFIG,
            texts: TABLE_MENU_TEXT_CONFIG,
          },
        },
        texts: TABLE_TEXT_CONFIG,
      },
      'image': {
        specs: [CustomImageSpec],
        overlay: {
          style: {
            border: '1px dashed rgb(68, 68, 68)',
          },
        },
        align: {
          icons: {
            left: '<i class="icon-text-align-left"></i>',
            center: '<i class="icon-text-align-center"></i>',
            right: '<i class="icon-text-align-right"></i>',
          },
        },
      },
    },
  }

  FluentEditor.register(
    {
      'modules/toolbar': Toolbar,
      'modules/mention': Mention,
      'modules/better-table': BetterTable,
      [`modules/${TableUp.moduleName}`]: TableUp,
      'modules/clipboard': CustomClipboard,
      'modules/uploader': CustomUploader, // 三者关联性最强
      'modules/image': CustomImage, // 三者关联性最强
      'modules/file': FileModule, // 三者关联性最强
      'modules/counter': Counter,
      'modules/emoji-toolbar': Emoji.ToolbarEmoji,
      'modules/emoji-shortname': Emoji.ShortNameEmoji,
      // 'modules/global-link': GlobalLink,//暂未开发
      'modules/link': Link, // 报错
      // 'modules/quickmenu': QuickMenu,//暂未开发
      'modules/syntax': CustomSyntax,

      'formats/strike': Strike,
      'formats/softBreak': SoftBreak,
      'formats/video': Video,
      'formats/emoji': Emoji.EmojiBlot,
      'formats/font': FontStyle,
      'formats/size': SizeStyle,
      'formats/line-height': LineHeightStyle,
      'formats/text-indent': TextIndentStyle,
    },
    true, // 覆盖内部模块
  )

  return FluentEditor
}

export default registerModules()

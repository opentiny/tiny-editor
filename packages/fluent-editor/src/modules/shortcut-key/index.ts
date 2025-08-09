import type { Range } from 'quill'
import type { Menu, MenuItemsGroup, QuillShortcutKeyInputOptions, QuillShortcutKeyOptions } from 'quill-shortcut-key'
import type { Context } from 'quill/modules/keyboard'
import type TypeToolbar from 'quill/modules/toolbar'
import type FluentEditor from '../../fluent-editor'
import Quill from 'quill'
import QuillShortcutKey, { defaultShortKey, searchAndSort } from 'quill-shortcut-key'
import { CHANGE_LANGUAGE_EVENT } from '../../config'

export interface ShortCutKeyCustomOptions { isMenuItemsAdd: boolean }
export type ShortCutKeyInputOptions = QuillShortcutKeyInputOptions & ShortCutKeyCustomOptions
export type ShortCutKeyOptions = QuillShortcutKeyOptions & ShortCutKeyCustomOptions

export class ShortCutKey extends QuillShortcutKey {
  constructor(public quill: FluentEditor, options: Partial<ShortCutKeyInputOptions>) {
    super(quill, options)

    this.quill.emitter.on(CHANGE_LANGUAGE_EVENT, () => {
      this.destroyMenuList()
      this.options = this.resolveOptions(options)
      this.menuSorter = searchAndSort.bind(this, this.getAllMenuItems()) as (searchText: string) => Menu
      this.placeholderTip.remove()
      this.placeholderTip = this.initPlaceholder()
      this.placeholderUpdate()
    })
  }

  resolveOptions(options: Partial<ShortCutKeyInputOptions>) {
    const defaultMenuItems = this.defaultMenuList()
    const value: ShortCutKeyOptions = Object.assign({
      placeholder: this.quill.getLangText('input-recall-menu-placeholder'),
      menuItems: defaultMenuItems,
      isMenuItemsAdd: false,
      menuKeyboardControls: () => false,
    }, options)
    if (value.isMenuItemsAdd) {
      value.menuItems = [...defaultMenuItems, ...value.menuItems]
    }

    const deepCopyMenuItems = (items: Menu): Menu => {
      return items.map((item) => {
        const value = {
          ...item,
        }
        if (item.title) {
          value.title = this.quill.getLangText(item.title)
        }
        if (item.type === 'group') {
          (value as MenuItemsGroup).children = deepCopyMenuItems(item.children)
        }
        return value
      })
    }
    value.menuItems = deepCopyMenuItems(value.menuItems)
    return value
  }

  defaultMenuList() {
    const icons = Quill.import('ui/icons') as Record<string, any>
    const toolbarHandler = (format: string) => {
      return function (this: Quill, range: Range | null) {
        if (!range) return
        const toolbarModule = this.getModule('toolbar') as TypeToolbar
        if (!toolbarModule) return
        toolbarModule.handlers[format].call(toolbarModule, true)
      }
    }
    const formatHandler = (format: string, value: any) => {
      return function (this: Quill, range: Range | null) {
        if (!range) return
        this.formatLine(range.index, 0, format, value, Quill.sources.USER)
      }
    }

    return [
      ...new Array(6).fill(0).map((_, i) => ({
        type: 'item' as const,
        name: `h${i + 1}`,
        alias: ['header', `head${i + 1}`],
        icon: icons.header[i + 1],
        title: this.quill.getLangText(`header-${i + 1}`),
        onClick: formatHandler('header', i + 1),
      })),
      {
        type: 'item' as const,
        name: 'yy',
        alias: ['blockquote'],
        icon: icons.blockquote,
        title: this.quill.getLangText('blockquote'),
        onClick: formatHandler('blockquote', true),
      },
      {
        type: 'item' as const,
        name: 'dm',
        alias: ['code', 'codeblock'],
        icon: icons['code-block'],
        title: this.quill.getLangText('code-block'),
        onClick: formatHandler('code-block', true),
      },
      {
        type: 'item' as const,
        name: 'lj',
        alias: ['link'],
        icon: icons.link,
        title: this.quill.getLangText('link'),
        onClick(this: Quill, range: Range | null, _: any) {
          if (!range) return
          const title = 'link'
          const link = prompt('Enter link URL')
          if (!link) return
          this.insertText(range.index, title, Quill.sources.USER)
          this.formatText(range.index, range.length + title.length, 'link', link, Quill.sources.USER)
          this.setSelection({ index: range.index, length: range.index + title.length })
        },
      },
      {
        type: 'group' as const,
        name: 'lb',
        alias: [],
        hideSearch: true,
        icon: icons.list.bullet,
        title: this.quill.getLangText('list'),
        children: [
          {
            type: 'item' as const,
            name: 'wxlb',
            alias: ['list', 'bullet'],
            icon: icons.list.bullet,
            title: this.quill.getLangText('list-bullet'),
            onClick: formatHandler('list', 'bullet'),
          },
          {
            type: 'item' as const,
            name: 'yxlb',
            alias: ['list', 'ordered'],
            icon: icons.list.ordered,
            title: this.quill.getLangText('list-ordered'),
            onClick: formatHandler('list', 'ordered'),
          },
          {
            type: 'item' as const,
            name: 'rwlb',
            alias: ['list', 'check'],
            icon: icons.list.check,
            title: this.quill.getLangText('list-check'),
            onClick: formatHandler('list', 'unchecked'),
          },
        ],
      },
      {
        type: 'item' as const,
        name: 'bq',
        alias: ['emoji'],
        icon: icons.emoji,
        title: this.quill.getLangText('emoji'),
        onClick(this: Quill, range: Range | null, _: any) {
          if (!range) return
          const toolbarModule = this.getModule('toolbar') as TypeToolbar
          if (!toolbarModule) return
          // TODO: keyboard handler emoji select(in emoji module)
          toolbarModule.handlers.emoji.call(toolbarModule, true)
        },
      },
      {
        type: 'item' as const,
        name: 'jp',
        alias: ['screenshot'],
        icon: icons.screenshot,
        title: this.quill.getLangText('screenshot'),
        onClick: toolbarHandler('screenshot'),
      },
      {
        type: 'item' as const,
        name: 'gs',
        alias: ['formula'],
        icon: icons.formula,
        title: this.quill.getLangText('formula'),
        onClick: toolbarHandler('formula'),
      },
      {
        type: 'item' as const,
        name: 'tp',
        alias: ['image', 'pic', 'picture'],
        icon: icons.image,
        title: this.quill.getLangText('image'),
        onClick: toolbarHandler('image'),
      },
      {
        type: 'item' as const,
        name: 'sp',
        alias: ['video'],
        icon: icons.video,
        title: this.quill.getLangText('video'),
        onClick: toolbarHandler('video'),
      },
      {
        type: 'item' as const,
        name: 'wj',
        alias: ['file'],
        icon: icons.file,
        title: this.quill.getLangText('file'),
        onClick: toolbarHandler('file'),
      },
      {
        type: 'item' as const,
        name: 'sldt',
        alias: ['mind-map'],
        icon: icons['mind-map'],
        title: this.quill.getLangText('mind-map'),
        onClick(this: Quill, range: Range | null, _: any) {
          if (!range) return
          const MindMapModule = this.getModule('mind-map')
          if (MindMapModule && typeof (MindMapModule as any).insertMindMapEditor === 'function') {
            (MindMapModule as any).insertMindMapEditor()
          }
        },
      },
      {
        type: 'item' as const,
        name: 'lct',
        alias: ['flow-chart'],
        icon: icons['flow-chart'],
        title: this.quill.getLangText('flow-chart'),
        onClick(this: Quill, range: Range | null, _: any) {
          if (!range) return
          const FlowChartModule = this.getModule('flow-chart')
          if (FlowChartModule && typeof (FlowChartModule as any).insertFlowChartEditor === 'function') {
            (FlowChartModule as any).insertFlowChartEditor()
          }
        },
      },
    ]
  }
}

export const shortKey = {
  ...defaultShortKey,
  link: {
    key: 'k',
    shortKey: true,
    handler(this: { quill: Quill }, _: any, context: Context) {
      const toolbar = this.quill.getModule('toolbar') as TypeToolbar
      if (!toolbar) return
      toolbar.handlers.link.call(toolbar, !context.format.link)
    },
  },
  color: {
    key: 'c',
    altKey: true,
    shortKey: true,
    handler(this: { quill: Quill }) {
      const selected = (this.quill.getModule('toolbar') as TypeToolbar).container!.querySelector('.ql-color.ql-color-picker .ql-picker-options .ql-selected') as HTMLElement
      this.quill.format('color', selected?.dataset?.value || false, Quill.sources.USER)
    },
  },
  background: {
    key: 'b',
    altKey: true,
    shortKey: true,
    handler(this: { quill: Quill }) {
      const selected = (this.quill.getModule('toolbar') as TypeToolbar).container!.querySelector('.ql-background.ql-color-picker .ql-picker-options .ql-selected') as HTMLElement
      this.quill.format('background', selected?.dataset?.value || false, Quill.sources.USER)
    },
  },
}

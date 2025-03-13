import type { Parchment } from 'quill'
import type Toolbar from 'quill/modules/toolbar'
import type BaseTheme from 'quill/themes/base'
import type Picker from 'quill/ui/picker'
import type { Constructor } from '../../config/types'
import type FluentEditor from '../../core/fluent-editor'
import { CHANGE_LANGUAGE_EVENT } from '../../config'

interface QuillTheme extends BaseTheme {
  pickers: QuillThemePicker[]
}
type QuillThemePicker = (Picker & { options: HTMLElement })
interface InternalModule {
  show: () => void
  hide: () => void
  update: () => void
  destroy: () => void
}
export interface InternalTableSelectionModule extends InternalModule {
  dragging: boolean
  boundary: {
    x: number
    y: number
    x1: number
    y1: number
    width: number
    height: number
  } | null
  selectedTds: Parchment.Blot[]
  cellSelect: HTMLElement
  tableMenu?: InternalModule
  computeSelectedTds: (
    startPoint: {
      x: number
      y: number
    },
    endPoint: {
      x: number
      y: number
    }
  ) => Parchment.Blot[]
  updateWithSelectedTds: () => void
}
export function generateTableUp(QuillTableUp: Constructor) {
  return class extends QuillTableUp {
    tableSelection?: InternalTableSelectionModule
    constructor(public quill: FluentEditor, options: Partial<any>) {
      super(quill, options)

      this.quill.emitter.on(CHANGE_LANGUAGE_EVENT, () => {
        this.options.texts = this.resolveTexts(options.texts)
        const toolbar = this.quill.getModule('toolbar') as Toolbar
        if (toolbar && (this.quill.theme as QuillTheme).pickers) {
          const [, select] = (toolbar.controls as [string, HTMLElement][] || []).find(([name]) => name === this.statics.toolName) || []
          if (select && select.tagName.toLocaleLowerCase() === 'select') {
            const picker = (this.quill.theme as QuillTheme).pickers.find(picker => picker.select === select)
            if (picker) {
              this.buildCustomSelect(this.options.customSelect, picker)
            }
          }
        }
        if (this.tableSelection) {
          this.tableSelection.destroy()
        }
        if (this.options.selection) {
          // eslint-disable-next-line new-cap
          this.tableSelection = new this.options.selection(this, this.quill, this.options.selectionOptions)
        }
      })
    }

    resolveTexts(options: Record<string, string> = {}) {
      return Object.assign({
        fullCheckboxText: this.quill.getLangText('fullCheckboxText'),
        customBtnText: this.quill.getLangText('customBtnText'),
        confirmText: this.quill.getLangText('confirmText'),
        cancelText: this.quill.getLangText('cancelText'),
        rowText: this.quill.getLangText('rowText'),
        colText: this.quill.getLangText('colText'),
        notPositiveNumberError: this.quill.getLangText('notPositiveNumberError'),
        custom: this.quill.getLangText('custom'),
        clear: this.quill.getLangText('clear'),
        transparent: this.quill.getLangText('transparent'),
        perWidthInsufficient: this.quill.getLangText('perWidthInsufficient'),
        CopyCell: this.quill.getLangText('CopyCell'),
        CutCell: this.quill.getLangText('CutCell'),
        InsertTop: this.quill.getLangText('InsertTop'),
        InsertRight: this.quill.getLangText('InsertRight'),
        InsertBottom: this.quill.getLangText('InsertBottom'),
        InsertLeft: this.quill.getLangText('InsertLeft'),
        MergeCell: this.quill.getLangText('MergeCell'),
        SplitCell: this.quill.getLangText('SplitCell'),
        DeleteRow: this.quill.getLangText('DeleteRow'),
        DeleteColumn: this.quill.getLangText('DeleteColumn'),
        DeleteTable: this.quill.getLangText('DeleteTable'),
        BackgroundColor: this.quill.getLangText('BackgroundColor'),
        BorderColor: this.quill.getLangText('BorderColor'),
      }, Object.entries(options).reduce((pre, [key, value]) => {
        pre[key] = this.quill.getLangText(value)
        return pre
      }, {} as Record<string, string>))
    }
  }
}

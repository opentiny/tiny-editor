import type Toolbar from 'quill/modules/toolbar'
import type BaseTheme from 'quill/themes/base'
import type Picker from 'quill/ui/picker'
import type { Constructor } from '../../config/types'
import type FluentEditor from '../../core/fluent-editor'
import { I18N_LOCALE_CHANGE } from 'quill-i18n'
import { isFunction } from '../../utils/is'

interface QuillTheme extends BaseTheme {
  pickers: QuillThemePicker[]
}
type QuillThemePicker = (Picker & { options: HTMLElement })

export function generateTableUp(QuillTableUp: Constructor) {
  return class extends QuillTableUp {
    constructor(public quill: FluentEditor, options: Partial<any>) {
      super(quill, options)

      if (!this.quill.options['format-painter']) this.quill.options['format-painter'] = {}
      const currentIgnoreFormat = this.quill.options['format-painter'].ignoreFormat || []
      this.quill.options['format-painter'].ignoreFormat = Array.from(
        new Set([
          ...currentIgnoreFormat,
          'table-up-cell-inner',
        ]),
      )

      this.quill.on(I18N_LOCALE_CHANGE, () => {
        this.refreshUI()
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

        Object.keys(this.modules).forEach((key) => {
          if (isFunction(this.modules[key].destroy)) {
            this.modules[key].destroy()
          }
        })
        this.modules = {}
        this.initModules()
      })
    }

    resolveOptions(options: Partial<any> = {}) {
      const { texts, ...rest } = options || {}
      const resolvedOptions = super.resolveOptions(rest)
      resolvedOptions.texts = super.resolveTexts(this.createTextResolver(texts))
      return resolvedOptions
    }

    resolveTexts(options: Record<string, string> | ((key: string) => string) = {}) {
      return super.resolveTexts(this.createTextResolver(options))
    }

    createTextResolver(options: Record<string, string> | ((key: string) => string) = {}) {
      const textResolver = isFunction(options) ? options : null
      const textMap = textResolver ? {} : options

      return (key: string) => {
        if (textResolver) {
          const customText = textResolver.call(this, key)
          if (customText !== undefined) return customText
        }
        else if (textMap[key] !== undefined) {
          return textMap[key]
        }

        return this.quill.getLangText(key)
      }
    }
  }
}

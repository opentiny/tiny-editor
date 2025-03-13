import type { ExpandedQuillOptions } from 'quill'
import type { IEditorConfig } from '../config/types'
import type { FileUploader } from '../modules/custom-uploader'
import Quill from 'quill'
import { defaultLanguage } from '../config'
import I18N from '../modules/i18n'

class FluentEditor extends Quill {
  isFullscreen: boolean = false
  declare options: IEditorConfig & ExpandedQuillOptions
  declare uploader: FileUploader

  static register(...args: any[]): void {
    super.register(...args as Parameters<typeof Quill.register>)
  }

  get lang() {
    const i18nModule = this.getModule('i18n') as I18N
    return i18nModule ? i18nModule.options.lang : defaultLanguage
  }

  constructor(container: HTMLElement | string, options: IEditorConfig = {}) {
    super(container, options)
  }

  getLangText(name: string) {
    return I18N.parserText(name, this.lang)
  }
}

export default FluentEditor

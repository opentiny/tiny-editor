import type { ExpandedQuillOptions } from 'quill'
import type { I18n, I18nOptions } from 'quill-i18n'
import type { IEditorConfig } from '../config/types'
import type { FileUploader } from '../modules/custom-uploader'
import Quill from 'quill'
import { defaultLanguage } from '../config'
import { EN_US } from '../config/i18n/en-us'
import { ZH_CN } from '../config/i18n/zh-cn'
import { merge } from '../utils/merge'

// Temporary backward-compat syntax support: `_i18n"key"`
// TODO: remove this legacy syntax support in a future major version.
const LEGACY_I18N_KEY_REGEX = /^_i18n(?:"([^"]+)"|'([^']+)'|`([^`]+)`)$/

function resolveLegacyI18nKey(name: string): string {
  const key = name.trim()
  const matched = key.match(LEGACY_I18N_KEY_REGEX)
  if (!matched) return name
  return matched[1] || matched[2] || matched[3] || name
}

class FluentEditor extends Quill {
  isFullscreen: boolean = false
  declare options: IEditorConfig & ExpandedQuillOptions
  declare uploader: FileUploader

  static register(...args: any[]): void {
    super.register(...args as Parameters<typeof Quill.register>)
  }

  get lang() {
    const i18nModule = this.getModule('i18n') as I18n
    return i18nModule ? i18nModule.getLocale() : defaultLanguage
  }

  constructor(container: HTMLElement | string, options: IEditorConfig = {}) {
    if (!options.modules) options.modules = {}
    if (!options.modules.i18n) options.modules.i18n = {}

    const i18nOptions = options.modules.i18n as I18nOptions
    const defaultMessages = {
      'en-US': EN_US,
      'zh-CN': ZH_CN,
    }
    const userMessages = i18nOptions.messages || {}
    i18nOptions.messages = merge({}, defaultMessages, userMessages)

    if (!i18nOptions.interpolate) {
      i18nOptions.interpolate = (template: string, params: Record<string, any>) => {
        return template.replaceAll(/\{\{([\w]+)\}\}/g, (match, key) => params[key] != null ? String(params[key]) : match)
      }
    }

    super(container, options)
  }

  getLangText(name: string, params?: Record<string, any>, defaultValue?: string) {
    const i18nModule = this.getModule('i18n') as I18n
    if (!i18nModule) return name
    return i18nModule.t(resolveLegacyI18nKey(name), params, defaultValue)
  }
}

export default FluentEditor

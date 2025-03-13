import type FluentEditor from '../fluent-editor'
import { CHANGE_LANGUAGE_EVENT, defaultLanguage } from '../config'
import { isUndefined } from '../utils/is'

const langs: Record<string, Record<string, string>> = {}

export interface I18NOptions {
  lang: string
}
export class I18N {
  static register(inputLangs: Record<string, Record<string, string>>, isCover: boolean = true) {
    for (const lang in inputLangs) {
      const texts = inputLangs[lang]
      if (isCover) {
        langs[lang] = texts
      }
      else {
        if (!langs[lang]) langs[lang] = {}
        Object.assign(langs[lang], texts)
      }
    }
  }

  static parserText(text: string, lang: string): string {
    const i18nPattern = /^_i18n"([^"]*)"/
    const match = text.match(i18nPattern)
    let key = text
    if (match) {
      key = match[1]
    }
    return langs[lang]?.[key] || key
  }

  options: I18NOptions = {
    lang: '',
  }

  constructor(public quill: FluentEditor, options: Partial<I18NOptions>) {
    this.options = Object.assign({}, options, this.resolveLanguageOption(options || {}))
    // wait until all module registed
    Promise.resolve().then(() => this.changeLanguage(this.options, true))
  }

  resolveLanguageOption(options: Partial<I18NOptions>): I18NOptions {
    if (isUndefined(options.lang)) {
      options.lang = defaultLanguage
    }
    if (!(options.lang in langs)) {
      console.warn(`The language ${options.lang} is not supported. Use the default language: ${defaultLanguage}`)
      options.lang = defaultLanguage
    }
    return {
      lang: options.lang,
    }
  }

  changeLanguage(options: Partial<I18NOptions>, force: boolean = false) {
    const currentLang = this.options.lang
    const langOps = this.resolveLanguageOption(options)
    if (langOps.lang === currentLang && !force) return
    this.options.lang = langOps.lang
    this.quill.emitter.emit(CHANGE_LANGUAGE_EVENT, this.options.lang, langs[langOps.lang])
  }
}

export default I18N

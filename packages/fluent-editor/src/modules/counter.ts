import type { AnyFunction } from '../config'
import type FluentEditor from '../fluent-editor'
import Quill from 'quill'
import { CHANGE_LANGUAGE_EVENT } from '../config'

export interface ICounterOption {
  format?: 'text' | 'html'
  unit?: 'word' | 'char'
  count?: number
  template?: string | AnyFunction
  errorTemplate?: string | AnyFunction
}

export default class Counter {
  container: HTMLDivElement
  options: ICounterOption

  constructor(public quill: FluentEditor, options: ICounterOption) {
    this.options = this.resolveOptions(options)
    this.container = quill.addContainer('ql-counter')
    quill.on(Quill.events.TEXT_CHANGE, this.renderCount)
    this.quill.emitter.on(CHANGE_LANGUAGE_EVENT, () => {
      this.options = this.resolveOptions(options)
      this.renderCount()
    })
    this.renderCount()
  }

  resolveOptions(options: ICounterOption) {
    return Object.assign({
      format: 'text',
      unit: 'char',
      template: this.quill.getLangText('counter-template'),
      count: 500,
    }, options)
  }

  renderCount = () => {
    setTimeout(() => {
      // @ts-ignore
      const { format, count: totalCount, unit, template: counterTemplate, errorTemplate } = this.options
      const count = this.getContentLength(format)
      const restCount = totalCount - count
      const countUnit = unit === 'char' ? this.quill.getLangText('char') : this.quill.getLangText('word')
      let template: any = counterTemplate
      if (typeof template === 'function') {
        template = template(count, restCount)
      }
      const desc = template.replace('{{count}}', count)
        .replace('{{totalCount}}', String(totalCount))
        .replace('{{restCount}}', String(restCount))
        .replace(/{{countUnit}}/g, countUnit)

      let limitTemplate: any = errorTemplate || this.quill.getLangText('counter-limit-tips')
      if (typeof limitTemplate === 'function') {
        limitTemplate = limitTemplate(count, restCount)
      }
      const limitTips = limitTemplate.replace('{{countUnit}}', countUnit)
      if (restCount < 0) {
        this.container.innerHTML = errorTemplate ? limitTips : `<span style="color:red">${limitTips}</span>`
      }
      else {
        this.container.innerHTML = desc
      }
    })
  }

  getContentLength(format) {
    let content = this.quill.getText()
    if (format === 'html') {
      let html = this.quill.root.innerHTML
      // 编辑器初始时
      if (html === '<p><br></p>' || html === '<div><br><div>') {
        html = ''
      }
      content = html
    }
    const text = content.replace(/\s/g, '').trim()
    if (this.options.unit === 'word') {
      return !content.trim() ? 0 : content.trim().split(/\s+/).length
    }
    return text.length
  }
}

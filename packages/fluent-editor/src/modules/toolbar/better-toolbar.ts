import type TypeToolbar from 'quill/modules/toolbar'
import Quill from 'quill'
import { isNullOrUndefined } from '../../config/editor.utils'

const Delta = Quill.import('delta')
const Parchment = Quill.import('parchment')
const levels = ['error', 'warn', 'log', 'info'] as const
let level = 'warn' as const

function debuglogger(method: typeof levels[number], ...args) {
  if (levels.indexOf(method) <= levels.indexOf(level)) {
    console[method](...args) // eslint-disable-line no-console
  }
}

function namespace(ns) {
  return levels.reduce((logger, method) => {
    logger[method] = debuglogger.bind(console, method, ns)
    return logger
  }, {} as Record<typeof levels[number], (...args: any) => void>)
}

namespace.level = (newLevel) => {
  level = newLevel
}
debuglogger.level = namespace.level
const debug = namespace('quill:toolbar')

const Toolbar = Quill.import('modules/toolbar') as typeof TypeToolbar

export class BetterToolbar extends Toolbar {
  update(range) {
    const formats = isNullOrUndefined(range) ? {} : this.quill.getFormat(range) as Record<string, any>
    this.controls.forEach((pair) => {
      const [format, input] = pair
      if (input.tagName === 'SELECT') {
        const select = input as HTMLSelectElement
        let option
        if (isNullOrUndefined(range)) {
          option = null
        }
        else if (isNullOrUndefined(formats[format])) {
          option = select.querySelector('option[selected]')
        }
        else if (!Array.isArray(formats[format])) {
          let value = formats[format]
          if (typeof value === 'string') {
            value = value.replace(/"/g, '\\"')
          }
          option = select.querySelector(`option[value="${value}"]`)
        }
        if (isNullOrUndefined(option)) {
          select.value = '' // TODO make configurable?
          select.selectedIndex = -1
        }
        else {
          option.selected = true
        }
      }
      else if (isNullOrUndefined(range)) {
        input.classList.remove('ql-active')
      }
      else if (input.hasAttribute('value')) {
        // both being null should match (default values)
        // '1' should match with 1 (headers)
        let isActive
          = formats[format] === input.getAttribute('value')
            || (!isNullOrUndefined(formats[format])
              && (formats[format].value === input.getAttribute('value')
                || formats[format].toString() === input.getAttribute('value')))
              || (isNullOrUndefined(formats[format]) && !input.getAttribute('value'))

        if (!isActive) {
          const checkFormat = formats[format]
          if (checkFormat === 'checked' || checkFormat === 'unchecked') {
            isActive = input.getAttribute('value') === 'check'
          }
        }

        if (isActive) {
          input.classList.add('ql-active')
        }
        else {
          input.classList.remove('ql-active')
        }
      }
      else {
        if (!isNullOrUndefined(formats[format])) {
          input.classList.add('ql-active')
        }
        else {
          input.classList.remove('ql-active')
        }
      }
    })
  }

  attach(input: HTMLElement) {
    let format = Array.from(input.classList).find((className) => {
      return className.indexOf('ql-') === 0
    })
    if (!format) return
    format = format.slice('ql-'.length)

    if (input.tagName === 'BUTTON') {
      input.setAttribute('type', 'button')
    }

    if (this.handlers[format] == null && this.quill.scroll.query(format) == null) {
      debug.warn('ignoring attaching to nonexistent format', format, input)
      return
    }

    const eventName = input.tagName === 'SELECT' ? 'change' : 'click'
    input.addEventListener(eventName, (e) => {
      let value: boolean | string

      if (input.tagName === 'SELECT') {
        const select = input as HTMLSelectElement
        if (select.selectedIndex < 0) return
        const selected = select.options[select.selectedIndex]

        if (selected.hasAttribute('selected')) {
          value = false
        }
        else {
          value = selected.value || false
        }
      }
      else {
        const button = input as HTMLButtonElement
        if (button.classList.contains('ql-active')) {
          value = false
        }
        else {
          value = button.value || !button.hasAttribute('value')
        }
        e.preventDefault()
      }

      this.quill.focus({ preventScroll: format === 'screenshot' })
      const [range] = this.quill.selection.getRange()
      if (this.handlers[format] != null) {
        // @ts-ignore
        if (!isNullOrUndefined(window.quillIsIntable) && window.quillIsIntable === true && (format === 'blockquote' || format === 'code-block' || format === 'list' || format === 'indent' || format === 'clean')) {
          return
        }
        this.handlers[format].call(this, value)
      }
      else if (
        // @ts-ignore
        this.quill.scroll.query(format).prototype instanceof Parchment.EmbedBlot
      ) {
        value = prompt(`Enter ${format}`)
        if (!value) return
        this.quill.updateContents(
          new Delta()
            .retain(range.index)
            .delete(range.length)
            .insert({ [format]: value }),
          Quill.sources.USER,
        )
      }
      else {
        // @ts-ignore
        if (!isNullOrUndefined(window.quillIsIntable) && window.quillIsIntable === true && (format === 'blockquote' || format === 'code-block' || format === 'list' || format === 'indent' || format === 'clean')) {
          return
        }
        this.quill.format(format, value, Quill.sources.USER)
      }

      this.update(range)
    })
    this.controls.push([format, input])
  }
}

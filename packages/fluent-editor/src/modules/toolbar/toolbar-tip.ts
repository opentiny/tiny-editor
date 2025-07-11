import type { Constructor } from '../../config/types'
import type FluentEditor from '../../fluent-editor'
import { CHANGE_LANGUAGE_EVENT } from '../../config'
import { isString } from '../../utils/is'

export function generateToolbarTip(QuillToolbarTip: Constructor) {
  return class extends QuillToolbarTip {
    constructor(public quill: FluentEditor, options: Partial<Record<string, any>>) {
      if (!options?.tipTextMap) {
        options.tipTextMap = {}
      }
      super(quill, options)

      this.quill.emitter.on(CHANGE_LANGUAGE_EVENT, () => {
        this.destroyAllTips()
        this.options = this.resolveOptions(options)
        this.createToolbarTip()
      })
    }

    resolveOptions(options: Partial<Record<string, any>>): Record<string, any> {
      const result = super.resolveOptions(options)
      if (!this.quill.lang) return result
      const shortKeyMap = {
        'bold': 'Ctrl + B',
        'italic': 'Ctrl + I',
        'underline': 'Ctrl + U',
        'strike': 'Ctrl + D',
        'clean': 'Ctrl + /',
        'align-left': 'Alt + L',
        'align-center': 'Alt + C',
        'align-right': 'Alt + R',
        'align-justify': 'Alt + J',
        'indent-+1': 'Ctrl + ]',
        'indent--1': 'Ctrl + [',
        'script-sub': 'Ctrl + ;',
        'script-super': 'Ctrl + \'',
        'code': 'Ctrl + E',
        'direction-rtl': 'Ctrl + R',
        'direction-ltr': 'Ctrl + L',
        'undo': 'Ctrl + Z',
        'redo': 'Ctrl + shift + Z',
        'color': 'Ctrl + Alt + C',
        'background': 'Ctrl + Alt + B',
        'link': 'Ctrl + K',
      }
      const shortcutModule = this.quill.getModule('shortcut-key')
      const getShortKey = (name: string) => {
        if (!shortcutModule) return ''
        const shortKey = shortKeyMap[name]
        return shortKey ? `\n${shortKey}` : ''
      }
      const btnTips = [
        'color',
        'background',
        'bold',
        'italic',
        'strike',
        'underline',
        'undo',
        'redo',
        'clean',
        'link',
        'divider',
        'blockquote',
        'code',
        'image',
        'file',
        'emoji',
        'video',
        'screenshot',
        'code-block',
        'formula',
        'format-painter',
        'header-list',
        'table-up',
      ].reduce((map, name) => {
        map[name] = this.quill.getLangText(name) + getShortKey(name)
        return map
      }, {} as Record<string, string>)
      const selectTips = [
        'font',
        'size',
        'line-height',
      ].reduce((map, name) => {
        map[name] = {
          onShow: () => {
            return this.quill.getLangText(name) + getShortKey(name)
          },
        }
        return map
      }, {})
      const valueControlTips = [
        'list',
        'align',
        'script',
        'indent',
        'header',
        'direction',
      ].reduce((map, name) => {
        map[name] = {
          onShow: (target: HTMLElement, value: string) => {
            if (name === 'direction') {
              value = target.classList.contains('ql-active') ? 'rtl' : 'ltr'
            }
            if (!value) {
              if (name === 'align') {
                value = 'left'
              }
              else if (name === 'header') {
                value = 'normal'
              }
            }
            return this.quill.getLangText(`${name}-${value}`) + getShortKey(`${name}-${value}`)
          },
        }
        return map
      }, {})
      const textMap = {
        ...btnTips,
        ...valueControlTips,
        ...selectTips,
        fullscreen: {
          onShow: () => {
            return this.quill.getLangText(this.quill.isFullscreen ? 'exit-fullscreen' : 'fullscreen')
          },
        },
      }
      const inputTipTextMap = Object.entries(options.tipTextMap).reduce((pre, [key, value]) => {
        pre[key] = isString(value) ? this.quill.getLangText(value) : value
        return pre
      }, {})
      return {
        ...result,
        tipTextMap: {
          ...textMap,
          ...inputTipTextMap,
        },
      }
    }
  }
}

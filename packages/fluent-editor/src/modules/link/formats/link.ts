import type TypeInline from 'quill/blots/inline'
import Quill from 'quill'
import { hadProtocol, sanitize } from '../../../config/editor.utils'

const Inline = Quill.import('blots/inline') as typeof TypeInline

export class LinkBlot extends Inline {
  static blotName = 'link'
  static tagName = 'A'
  static SANITIZED_URL = 'about:blank'
  static PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel']
  static className = 'ql-normal-link'

  static autoProtocol: string = ''
  static create(value: string) {
    const node = super.create(value)
    let href = value
    if (!hadProtocol(href) && this.autoProtocol) {
      href = `${this.autoProtocol}://${value}`
    }
    href = this.sanitize(href)
    node.setAttribute('href', href)
    node.setAttribute('target', '_blank')
    return node
  }

  static formats(domNode: HTMLElement): string | null {
    return domNode.getAttribute('href')
  }

  static sanitize(url: string) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL
  }

  format(name: string, value: any) {
    if (name !== this.statics.blotName || [false, null].includes(value)) {
      super.format(name, value)
    }
    else {
      this.domNode.setAttribute('href', LinkBlot.sanitize(value))
    }
  }
}

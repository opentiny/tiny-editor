import type TypeEmbed from 'quill/blots/embed'
import Quill from 'quill'

const Embed = Quill.import('blots/embed') as typeof TypeEmbed

export class SoftBreak extends Embed {
  static blotName = 'soft-break'
  static tagName = 'BR'
  static className = 'ql-soft-break'
  remove: () => void

  static create() {
    const node = super.create()
    return node
  }

  optimize() {
    // li的开头结尾，移除软回车
    if (this.prev === null) {
      this.remove()
    }
  }

  length() {
    return 1
  }
}

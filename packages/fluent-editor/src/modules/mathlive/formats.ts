import type { MathfieldElement } from 'mathlive'
import type { Root } from 'parchment'
import Quill from 'quill'

const Parchment = Quill.import('parchment')
export type MathliveBlotMode = 'dialog' | 'only-read'
export class MathliveBlot extends Parchment.EmbedBlot {
  static blotName = 'mathlive'
  static tagName = 'math-field'
  static className = 'ql-math-field'
  mode: MathliveBlotMode

  static create(obj: { value: string, mode: MathliveBlotMode }) {
    const el = super.create() as MathfieldElement
    el.setAttribute('mode', obj.mode)
    el.classList.add('view')
    el.innerHTML = obj.value
    el.setValue(obj.value)
    return el
  }

  static value(domNode: MathfieldElement) {
    return {
      value: domNode.value,
      mode: domNode.getAttribute('mode'),
    }
  }

  constructor(scroll: Root, public domNode: MathfieldElement) {
    super(scroll, domNode)
    domNode.setAttribute('contenteditable', 'false')
    this.mode = (domNode.getAttribute('mode') || 'only-read') as MathliveBlotMode
  }

  html() {
    const formula = this.domNode.value
    return `<math-field class="ql-math-field view" contenteditable="false" mode="${this.mode}">${formula}</math-field>`
  }
}

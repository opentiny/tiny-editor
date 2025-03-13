import type { MathfieldElement } from 'mathlive'
import type { Bounds } from 'quill/core/selection'
import type TypeTooltip from 'quill/ui/tooltip'
import Quill from 'quill'
import { isString } from '../../utils/is'

const Delta = Quill.import('delta')
const Tooltip = Quill.import('ui/tooltip') as typeof TypeTooltip
export class MathliveTooltip extends Tooltip {
  static TEMPLATE = ``

  mathliveDom: MathfieldElement
  editValue?: string

  constructor(quill: Quill, boundsContainer?: HTMLElement) {
    super(quill, boundsContainer)
    this.mathliveDom = document.createElement('math-field') as MathfieldElement
    this.mathliveDom.classList.add('ql-math-field')
    this.root.appendChild(this.mathliveDom)
    this.root.classList.add('math-field-tooltip')
    this.listen()
  }

  listen() {
    this.mathliveDom.addEventListener('blur', (event) => {
      this.hide()
    })
    this.root.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.save()
      }
      else if (event.key === 'Escape') {
        event.preventDefault()
        this.cancel()
      }
    })
  }

  cancel() {
    this.hide()
    this.restoreFocus()
  }

  edit(value?: string) {
    this.editValue = value
    this.root.classList.remove('ql-hidden')
    this.root.classList.add('ql-editing')
    this.mathliveDom.setValue(value || '')
    const range = this.quill.getSelection()
    const bounds = range ? this.quill.getBounds(range) : null
    if (bounds != null) {
      this.position(bounds)
    }
    this.show()
    this.mathliveDom.focus()
  }

  restoreFocus() {
    this.mathliveDom.blur()
    this.quill.focus({ preventScroll: true })
  }

  save() {
    const range = this.quill.getSelection(true)
    const inputValue = this.mathliveDom.value
    if (!inputValue) return
    const contentData = this.quill.getContents(range.index, 1).ops[0].insert
    let deleteCount = 0
    if (!isString(contentData) && contentData.mathlive) {
      deleteCount += 1
    }
    const delta = new Delta()
      .retain(range.index)
      .delete(Math.max(deleteCount, range.length))
      .insert({ mathlive: { value: inputValue, mode: 'dialog' } })
    this.quill.updateContents(delta, Quill.sources.USER)
    this.quill.setSelection(range.index + 1, Quill.sources.SILENT)
    this.hide()
  }

  position(reference: Bounds) {
    const adjustedReference = { ...reference }
    adjustedReference.left = reference.left + this.root.offsetWidth / 2 - reference.width / 2
    return super.position(adjustedReference)
  }
}

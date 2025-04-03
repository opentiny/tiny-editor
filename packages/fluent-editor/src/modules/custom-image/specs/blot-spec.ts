import type { BlotFormatter } from '../blot-formatter'
import { CustomResizeAction, DeleteAction, ImageToolbarAction } from '../actions'

export class BlotSpec {
  formatter: BlotFormatter

  constructor(formatter: BlotFormatter) {
    this.formatter = formatter
  }

  init(): void {}

  getActions() {
    return [ImageToolbarAction, CustomResizeAction, DeleteAction]
  }

  getTargetElement(): HTMLElement | null {
    return null
  }

  getOverlayElement() {
    return this.getTargetElement()
  }

  setSelection(): void {
    this.formatter.quill.setSelection(null)
  }

  onHide() {}
}

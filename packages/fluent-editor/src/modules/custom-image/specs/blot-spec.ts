import { CustomResizeAction, DeleteAction } from '../actions'

export class BlotSpec {
  formatter

  constructor(formatter) {
    this.formatter = formatter
  }

  init(): void {}

  getActions() {
    return [CustomResizeAction, DeleteAction]
  }

  getTargetElement() {
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

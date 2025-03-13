import type { Parchment as TypeParchment } from 'quill'
import Quill from 'quill'
import { Action } from './action'

export class DeleteAction extends Action {
  onCreate() {
    document.addEventListener('keyup', this.onKeyUp, true)
    this.formatter.quill.root.addEventListener('input', this.onKeyUp, true)
  }

  onDestroy() {
    document.removeEventListener('keyup', this.onKeyUp)
    this.formatter.quill.root.removeEventListener('input', this.onKeyUp)
  }

  onKeyUp = (event: any) => {
    if (!this.formatter.currentSpec) {
      return
    }

    // delete or backspace
    if (event.keyCode === 46 || event.keyCode === 8) {
      const blot = Quill.find(this.formatter.currentSpec.getTargetElement()) as TypeParchment.Blot
      if (blot) {
        // TODO: fix later
        // @ts-ignore
        blot.deleteAt(0)
      }
      this.formatter.hide()
    }
  }
}

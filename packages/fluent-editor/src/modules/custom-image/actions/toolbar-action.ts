import type { BlotFormatter } from '../blot-formatter'
import { Action } from './action'
import { ImageToolbarButtons } from './image-toolbar-buttons'
import { ImageToolbar } from './toolbar'

export class ImageToolbarAction extends Action {
  toolbar: ImageToolbar
  buttons: ImageToolbarButtons

  constructor(formatter: BlotFormatter) {
    super(formatter)
    this.buttons = new ImageToolbarButtons({
      buttons: formatter.options.toolbar.buttons,
    })
    this.toolbar = new ImageToolbar()
  }

  onCreate() {
    const toolbar = this.toolbar.create(this.formatter, this.buttons)
    this.formatter.overlay.appendChild(toolbar)
  }

  onDestroy() {
    const toolbar = this.toolbar.getElement()
    if (!toolbar) {
      return
    }

    this.formatter.overlay.removeChild(toolbar)
    this.toolbar.destroy()
  }
}

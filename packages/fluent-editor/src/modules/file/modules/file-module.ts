import type FluentEditor from '../../../core/fluent-editor'
import Quill from 'quill'
import { File } from '../formats/file'
import { FileBar } from './file-bar'

export class FileModule {
  fileBar: FileBar

  static register() {
    Quill.register('formats/file', File, true)
  }

  constructor(public quill: FluentEditor) {
    this.quill = quill
    quill.root.addEventListener('click', event => this.clickEvent(event), false)
  }

  clickEvent(event: MouseEvent) {
    event.preventDefault()
    const target = event.target as HTMLElement
    const fileDom = target.closest('a.ql-file-item')
    if (fileDom) {
      if (this.fileBar) {
        this.fileBar.destroy()
      }
      this.fileBar = new FileBar(this.quill, fileDom)
    }
    else if (this.fileBar && !target.closest('.ql-file-bar')) {
      this.fileBar.destroy()
      this.fileBar = null
    }
  }
}

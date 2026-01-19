import Quill from 'quill'
import File from './formats/file'
import FileBar from './modules/file-bar'

const Module = Quill.imports['core/module']

class FileModule extends Module {
  quill: any
  fileBar: FileBar

  static register() {
    Quill.register('formats/file', File, true)
  }

  constructor(quill, options) {
    super(quill, options)
    this.quill = quill
    quill.root.addEventListener('click', event => this.clickEvent(event), false)
  }

  clickEvent(event) {
    const target = event.target
    const fileDom = target.closest('a.ql-file-item')
    const fileBar = target.closest('.ql-file-bar')

    if (fileDom) {
      event.preventDefault()
      if (this.fileBar) {
        this.fileBar.destroy()
      }
      this.fileBar = new FileBar(this.quill, fileDom)
    }
    else if (this.fileBar && !fileBar) {
      event.preventDefault()
      this.fileBar.destroy()
      this.fileBar = null
    }
  }
}

export default FileModule

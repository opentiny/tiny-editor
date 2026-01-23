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
    const target = event.target as HTMLElement
    const fileDom = target.closest('a.ql-file-item')
    const fileBar = target.closest('.ql-file-bar')

    if (fileDom) {
      event.preventDefault()
      // 在只读模式下直接下载文件
      if (!this.quill.isEnabled()) {
        this.downloadFile(fileDom)
        return
      }
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

  downloadFile(fileDom: HTMLElement) {
    const fileName = fileDom.dataset.title || ''
    const fileDownloadUrl = fileDom.getAttribute('href') || ''
    if (fileDownloadUrl) {
      const a = document.createElement('a')
      a.href = fileDownloadUrl
      a.target = '_blank'
      a.id = 'exppub'
      a.download = fileName
      document.body.appendChild(a)
      const alink = document.getElementById('exppub')
      alink?.click()
      alink?.parentNode?.removeChild(a)
    }
  }
}

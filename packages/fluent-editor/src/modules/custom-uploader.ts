import type { Range } from 'quill'
import type TypeUploader from 'quill/modules/uploader'
import type FluentEditor from '../core/fluent-editor'
import Quill from 'quill'
import { isString } from '../utils/is'

const Uploader = Quill.import('modules/uploader') as typeof TypeUploader
const Delta = Quill.import('delta')

interface UploaderOptions {
  mimetypes: string[]
  handler: (this: { quill: Quill }, range: Range, files: File[]) => void
}
export interface FileUploaderOptions {
  mimetypes: string[]
  maxSize: number
  handler: (this: { quill: FluentEditor }, range: Range, files: File[]) => Promise<(string | false)[]> | (string | false)[]
  success: (this: { quill: FluentEditor }, file: File, range: Range) => void
  fail: (this: { quill: FluentEditor }, file: File, range: Range) => void
}
export class FileUploader extends Uploader {
  static DEFAULTS = {} as any
  // Partial<UploaderOptions> for ts type
  declare options: Partial<UploaderOptions> & FileUploaderOptions
  constructor(public quill: FluentEditor, options: Partial<FileUploaderOptions>) {
    super(quill, options as any)
    this.options = this.resolveOptions(options)
    // paste handle in clipboard
  }

  resolveOptions(options: Partial<FileUploaderOptions> = {}) {
    return Object.assign({
      mimetypes: ['*'],
      maxSize: Number.POSITIVE_INFINITY,
      handler(range: Range, files: File[]) {
        return files.map(file => URL.createObjectURL(file))
      },
      success() {},
      fail() {},
    }, options)
  }

  validateFile(file: File) {
    return this.options.mimetypes.some(type => (file.type || 'text/plain').match(type.replaceAll('*', '.*'))) && file.size < this.options.maxSize
  }

  async getFileUrls(files: File[], range: Range) {
    const uploads = files.filter(file => this.validateFile(file))
    return this.options.handler.call(this, range, uploads)
  }

  async upload(range: Range, files: FileList | File[]) {
    const uploads = []
    const fails = []
    for (const file of Array.from(files)) {
      if (this.validateFile(file)) {
        uploads.push(file)
      }
      else {
        fails.push(file)
      }
    }
    const result = await this.options.handler.call(this, range, uploads)
    const updateDelta = result.reduce((delta, url, i) => {
      if (isString(url)) {
        const type = uploads[i].type
        if (type.startsWith('image/')) {
          delta.insert({ image: url })
        }
        else if (type.startsWith('video/')) {
          delta.insert({ video: { src: url } })
        }
        else {
          delta.insert({ file: { size: uploads[i].size, title: uploads[i].name, src: url } })
        }
      }
      else {
        delta.insert('\n')
      }
      return delta
    }, new Delta().retain(range.index).delete(range.length))
    this.quill.updateContents(updateDelta, Quill.sources.USER)
    this.quill.setSelection(range.index + result.length, Quill.sources.SILENT)
    for (const file of fails) {
      this.options.fail.call(this, file, range)
    }
    for (const [i, res] of result.entries()) {
      if (isString(res)) {
        this.options.success.call(this, files[i], { index: range.index + i, length: 0 })
      }
      else {
        this.options.fail.call(this, files[i], { index: range.index + i, length: 0 })
      }
    }
  }
}

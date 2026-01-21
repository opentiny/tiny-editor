import type { Range } from 'quill'
import type TypeUploader from 'quill/modules/uploader'
import type FluentEditor from '../core/fluent-editor'
import Quill from 'quill'
import { isString } from '../utils/is'

const Uploader = Quill.import('modules/uploader') as typeof TypeUploader
const Delta = Quill.import('delta')

export type UploadKind = 'image' | 'video' | 'file'
export type MimeTypesConfig = string[] | Partial<Record<UploadKind, string[]>>

interface UploaderOptions {
  mimetypes: string[]
  handler: (this: { quill: Quill }, range: Range, files: File[]) => void
}
export interface FileUploaderOptions {
  /**
   * 支持单个 MIME type、模糊匹配子类型和后缀名三种格式
   * - 全局配置：`string[]`
   * - 根据文件/图片/视频单独配置：`{ file?: string[]; image?: string[]; video?: string[] }`
   */
  mimetypes: MimeTypesConfig
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

  private inferKind(file: File): UploadKind {
    const type = file.type || ''
    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    return 'file'
  }

  private filterFromArray(types: string[], kind: UploadKind): string[] {
    if (kind === 'file') return types
    const prefix = `${kind}/`
    return types.filter((type) => {
      if (type === '*') return true
      if (type.includes('/')) return type.startsWith(prefix)
      return true
    })
  }

  getAccept(kind: UploadKind): string[] {
    const mimetypes = this.options.mimetypes
    if (Array.isArray(mimetypes)) {
      return this.filterFromArray(mimetypes, kind)
    }
    const map = mimetypes || {}
    const fromKind = map[kind]
    if (fromKind?.length) return fromKind
    if (map.file?.length && kind !== 'file') return map.file
    return []
  }

  validateFile(file: File, kind?: UploadKind) {
    const accept = this.getAccept(kind ?? this.inferKind(file))
    const mimeOk = accept.some((type) => {
      // 简单区分：带 '/' 的按 MIME，其他按后缀
      if (type.includes('/')) {
        return (file.type || 'text/plain').match(type.replaceAll('*', '.*'))
      }
      else {
        // 按文件名后缀匹配，例如 'png' / '.png'
        const ext = type.startsWith('.') ? type.toLowerCase() : `.${type.toLowerCase()}`
        return file.name.toLowerCase().endsWith(ext)
      }
    })
    return mimeOk && file.size < this.options.maxSize
  }

  async getFileUrls(files: File[], range: Range, kind?: UploadKind) {
    const uploads = files.filter(file => this.validateFile(file, kind))
    return this.options.handler.call(this, range, uploads)
  }

  async upload(range: Range, files: FileList | File[], kind?: UploadKind) {
    const uploads = []
    const fails = []

    for (const file of Array.from(files)) {
      if (this.validateFile(file, kind)) {
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
        delta.insert(' ')
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

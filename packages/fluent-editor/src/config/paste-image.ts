const MS_EXCEL_CHECK = /<meta.*?Microsoft Excel\s[\d].*?>/
const USABLE_PASTE_IMAGE_RE = /^(https?:|blob:|data:image|\/\/)/i

export function getPasteImageSrc(image: unknown): string {
  if (typeof image === 'string') {
    return image
  }
  if (image && typeof image === 'object' && 'src' in image) {
    const src = (image as { src?: unknown }).src
    return src == null ? '' : String(src)
  }
  return ''
}

export function isUsablePasteImageSrc(src: string): boolean {
  const value = src?.trim()
  return !!value && value !== '//:0' && USABLE_PASTE_IMAGE_RE.test(value)
}

export function shouldUploadFilesOnly(html: string, files: File[]): boolean {
  if (!files.length) {
    return false
  }
  if (isExcelHtml(html)) {
    return false
  }
  if (!html) {
    return true
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.childElementCount === 1 && doc.body.firstElementChild?.tagName === 'IMG'
}

export function getClipboardImageFiles(clipboardData?: DataTransfer | null, files?: File[]): File[] {
  if (!clipboardData) {
    return []
  }
  const fromFiles = (files || Array.from(clipboardData.files || [])).filter(file => file.type?.startsWith('image/'))
  if (fromFiles.length) {
    return fromFiles
  }
  return Array.from(clipboardData.items || [])
    .filter(item => item.kind === 'file' && item.type?.startsWith('image/'))
    .map(item => item.getAsFile())
    .filter((file): file is File => !!file)
}

export function isExcelHtml(html: string): boolean {
  return !!html && html.search(MS_EXCEL_CHECK) !== -1
}

import { isNullOrUndefined } from './editor.utils'

export * from './editor.config'
export * from './editor.utils'
export * from './types'

// 触发上传
export function inputFile(type: 'image' | 'video' | 'file', accept: string[]) {
  if (accept.length <= 0) return
  let fileInput = this.container.querySelector(`input.ql-${type}[type=file]`)
  if (isNullOrUndefined(fileInput)) {
    fileInput = document.createElement('input')
    fileInput.style.display = 'none'
    fileInput.classList.add(`ql-${type}`)
    fileInput.setAttribute('type', 'file')
    fileInput.setAttribute('accept', accept.map(mime => mime === '*' ? `${type}/*` : mime).join(','))
    fileInput.setAttribute('multiple', '')
    fileInput.addEventListener('change', () => {
      const range = this.quill.getSelection(true)
      this.quill.uploader.upload(range, fileInput.files)
      fileInput.value = ''
    })
    this.container.appendChild(fileInput)
  }
  fileInput.click()
}

export function getListValue(value, preListValue) {
  let curListValue = value
  if (preListValue && preListValue === value) {
    curListValue = false
  }
  else if (value === 'check') {
    if (preListValue === 'checked' || preListValue === 'unchecked') {
      curListValue = false
    }
    else {
      curListValue = 'unchecked'
    }
  }
  return curListValue
}
/** css namespace */
export const namespace = 'fe'

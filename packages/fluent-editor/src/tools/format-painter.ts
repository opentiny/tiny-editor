import type { Range } from 'quill'
import type Toolbar from 'quill/modules/toolbar'
import Quill from 'quill'

export interface FormatData {
  formatPainter: {
    rangeFormat: Record<string, any>
    isFormatterLock: boolean
    isFormating: boolean
    prepareLock: boolean
  }
}
export function FormatPainter(this: Toolbar & FormatData) {
  if (!this.formatPainter) {
    this.formatPainter = {
      rangeFormat: {},
      isFormatterLock: false,
      isFormating: false,
      prepareLock: false,
    }
  }
  const [, formatterBtn] = this.controls.find(([name]) => name === FormatPainter.toolName)
  const formatRange = (range: Range | null) => {
    if (!range) return
    const currentFormats = this.quill.getFormat(range)
    for (const format in currentFormats) {
      if (this.quill.options['format-painter']?.ignoreFormat?.includes(format)) continue
      this.quill.format(format, null, Quill.sources.USER)
    }

    for (const format in this.formatPainter.rangeFormat) {
      if (this.quill.options['format-painter']?.ignoreFormat?.includes(format)) continue
      this.quill.format(format, this.formatPainter.rangeFormat[format], Quill.sources.USER)
    }
    if (!this.formatPainter.isFormatterLock) {
      unbindFormatSelect()
    }
    else {
      btnActive()
    }
  }
  // setTime for Toolbar.update
  const btnActive = () => {
    setTimeout(() => {
      formatterBtn.classList.add('ql-active')
    }, 0)
  }
  const btnRemoveActive = () => {
    setTimeout(() => {
      formatterBtn.classList.remove('ql-active')
    }, 0)
  }
  const bindFormatSelect = () => {
    const range = this.quill.getSelection()
    if (range.length === 0) return
    this.formatPainter.rangeFormat = this.quill.getFormat(range)
    this.formatPainter.isFormating = true
    this.quill.on(Quill.events.SELECTION_CHANGE, formatRange)
    btnActive()
  }
  const unbindFormatSelect = () => {
    this.quill.off(Quill.events.SELECTION_CHANGE, formatRange)
    this.formatPainter.rangeFormat = {}
    btnRemoveActive()
    this.formatPainter.isFormating = false
    this.formatPainter.isFormatterLock = false
  }

  if (this.formatPainter.isFormatterLock || (this.formatPainter.isFormating && !this.formatPainter.prepareLock)) {
    unbindFormatSelect()
  }
  else if (this.formatPainter.isFormating && this.formatPainter.prepareLock) {
    this.formatPainter.isFormatterLock = true
    btnActive()
  }
  else {
    // imitate double click
    this.formatPainter.prepareLock = true
    setTimeout(() => {
      this.formatPainter.prepareLock = false
    }, 200)
    bindFormatSelect()
  }
}
FormatPainter.toolName = 'format-painter'

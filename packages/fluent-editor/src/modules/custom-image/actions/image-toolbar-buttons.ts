import type { ToolbarButtonOptions, ToolButtonOption } from '../options'
import { isBoolean, isObject } from '../../../utils/is'
import { CENTER_ALIGN, COPY, DOWNLOAD, LEFT_ALIGN, RIGHT_ALIGN } from '../options'

export const ALIGN_ATTR = 'data-align'

export function setAlignStyle(el: HTMLElement, display: string | null, float: string | null, margin: string | null) {
  el.style.setProperty('display', display)
  el.style.setProperty('float', float)
  el.style.setProperty('margin', margin)
}
export const alignmentHandler = {
  left: (el: HTMLElement, toolbarButtons: ImageToolbarButtons) => {
    setAlignStyle(el, 'inline', 'left', '0 1em 1em 0')
  },
  center: (el: HTMLElement, toolbarButtons: ImageToolbarButtons) => {
    setAlignStyle(el, 'block', null, 'auto')
  },
  right: (el: HTMLElement, toolbarButtons: ImageToolbarButtons) => {
    setAlignStyle(el, 'inline', 'right', '0 0 1em 1em')
  },
  download: (el: HTMLImageElement, toolbarButtons: ImageToolbarButtons) => {
    const imageName = el.dataset.title || 'image'
    const url = el.src || ''
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.download = imageName
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.parentNode.removeChild(a)
  },
  copy: async (el: HTMLImageElement, toolbarButtons: ImageToolbarButtons) => {
    if (!el.src) return
    const imageUrl = el.src
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error('Copy image failed')
      }
      const blob = await response.blob()
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
    }
    catch (e) {
      throw new Error('Copy image failed')
    }
  },
}
const defaultButtons: Record<string, ToolButtonOption> = {
  [LEFT_ALIGN]: {
    name: LEFT_ALIGN,
    icon: `
        <svg viewbox="0 0 18 18">
          <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>
          <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
          <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line>
        </svg>
      `,
    isActive: el => el.getAttribute(ALIGN_ATTR) === 'left',
    apply: (el: HTMLImageElement, toolbarButtons: ImageToolbarButtons) => {
      el.setAttribute(ALIGN_ATTR, 'left')
      alignmentHandler.left(el, toolbarButtons)
    },
  },
  [CENTER_ALIGN]: {
    name: CENTER_ALIGN,
    icon: `
        <svg viewbox="0 0 18 18">
          <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
          <line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"></line>
          <line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"></line>
        </svg>
      `,
    isActive: el => el.getAttribute(ALIGN_ATTR) === 'center',
    apply: (el: HTMLImageElement, toolbarButtons: ImageToolbarButtons) => {
      el.setAttribute(ALIGN_ATTR, 'center')
      alignmentHandler.center(el, toolbarButtons)
    },
  },
  [RIGHT_ALIGN]: {
    name: RIGHT_ALIGN,
    icon: `
        <svg viewbox="0 0 18 18">
          <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
          <line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"></line>
          <line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"></line>
        </svg>
      `,
    isActive: el => el.getAttribute(ALIGN_ATTR) === 'right',
    apply: (el: HTMLImageElement, toolbarButtons: ImageToolbarButtons) => {
      el.setAttribute(ALIGN_ATTR, 'right')
      alignmentHandler.right(el, toolbarButtons)
    },
  },
  [DOWNLOAD]: {
    name: DOWNLOAD,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path class="ql-fill" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10z"/></svg>`,
    apply: (el: HTMLImageElement, toolbarButtons: ImageToolbarButtons) => {
      alignmentHandler.download(el, toolbarButtons)
    },
  },
  [COPY]: {
    name: COPY,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path class="ql-fill" d="M28 10v18H10V10zm0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2"/><path class="ql-fill" d="M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z"/></svg>`,
    apply: (el: HTMLImageElement, toolbarButtons: ImageToolbarButtons) => {
      alignmentHandler.copy(el, toolbarButtons)
    },
  },
}
export class ImageToolbarButtons {
  buttons: Record<string, ToolButtonOption>

  constructor(options: ToolbarButtonOptions) {
    this.buttons = Object.entries(options.buttons).reduce((acc, [name, button]) => {
      if (isBoolean(button) && button && defaultButtons[name]) {
        acc[name] = defaultButtons[name]
      }
      else if (isObject(button)) {
        acc[button.name] = button
      }
      return acc
    }, {})
  }

  getItems(): ToolButtonOption[] {
    return Object.keys(this.buttons).map(k => this.buttons[k])
  }

  clear(el: HTMLElement): void {
    el.removeAttribute(ALIGN_ATTR)
    setAlignStyle(el, null, null, null)
  }
}

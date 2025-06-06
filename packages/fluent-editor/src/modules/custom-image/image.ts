import type { Parchment as TypeParchment } from 'quill'
import type TypeEmbed from 'quill/blots/embed'
import Quill from 'quill'
import { isNullOrUndefined, sanitize } from '../../config/editor.utils'
import { isObject } from '../../utils/is'
import { ALIGN_ATTR, alignmentHandler } from './actions'

const Embed = Quill.import('blots/embed') as typeof TypeEmbed
const ATTRIBUTES = ['alt', 'height', 'width', 'image-id']

export type ImageValue = string | {
  src: string
  align?: string
  height?: number
  width?: number
}
export class CustomImage extends Embed {
  static blotName = 'image'
  static tagName = 'IMG'
  static ID_SEED = 0
  declare domNode: HTMLElement
  static create(value: ImageValue) {
    const node = super.create(value) as HTMLElement
    const url = typeof value === 'string' ? value : value.src
    if (url) {
      const imgURL = this.sanitize(url)
      if (!imgURL?.startsWith('data:image')) {
        node.dataset.src = imgURL
      }
      node.setAttribute('src', imgURL)
    }
    node.setAttribute('data-image-id', `img${CustomImage.ID_SEED++}`)
    node.style.verticalAlign = 'baseline'
    if (isObject(value)) {
      if (value.align && alignmentHandler[value.align]) {
        node.setAttribute(ALIGN_ATTR, value.align)
        alignmentHandler[value.align](node)
      }
      if (value.width) {
        node.setAttribute('width', String(value.width))
      }
      if (value.height) {
        node.setAttribute('height', String(value.height))
      }
    }
    return node
  }

  static formats(domNode: HTMLElement) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }

  static match(url: string) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url)
  }

  static register() {
    if (/Firefox/i.test(navigator.userAgent)) {
      setTimeout(() => {
        // Disable image resizing in Firefox
        document.execCommand('enableObjectResizing', false, 'false')
      }, 1)
    }
  }

  static sanitize(url: string) {
    return sanitize(url, ['http', 'https', 'blob', 'data']) ? url : '//:0'
  }

  static value(domNode: HTMLElement) {
    const formats: any = {}
    const imageSrc = domNode.getAttribute('src')
    formats.src = this.sanitize(imageSrc)
    formats.imageId = domNode.dataset.imageId
    if (domNode.dataset.align) {
      formats.align = domNode.dataset.align
    }
    if (domNode.hasAttribute('width')) {
      formats.width = domNode.getAttribute('width')
    }
    if (domNode.hasAttribute('height')) {
      formats.height = domNode.getAttribute('height')
    }
    return formats
  }

  format(name: string, value: any) {
    if (ATTRIBUTES.includes(name)) {
      if (value) {
        this.domNode.setAttribute(name, value)
      }
      else {
        this.domNode.removeAttribute(name)
      }
    }
    else {
      super.format(name, value)
    }
  }

  unWrap() {
    this.parent.replaceWith(this as TypeEmbed)
  }

  wrap(name: string, value?: any): TypeParchment.Parent
  wrap(wrapper: TypeParchment.Parent): TypeParchment.Parent
  wrap(name: string | TypeParchment.Parent, value?: any) {
    const wrapper = (typeof name === 'string' ? this.scroll.create(name, value) : name) as TypeParchment.Parent
    if (!isNullOrUndefined(this.parent)) {
      this.parent.insertBefore(wrapper, this.next || undefined)
    }
    if (typeof wrapper.appendChild !== 'function') {
      throw new TypeError(`Cannot wrap ${name}`)
    }
    wrapper.appendChild(this)
    return wrapper
  }
}

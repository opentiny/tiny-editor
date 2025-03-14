import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block'
import Quill from 'quill'
import { sanitize } from '../config/editor.utils'

const BlockEmbed = Quill.import('blots/block/embed') as typeof TypeBlockEmbed
const VIDEO_ATTRIBUTES = ['id', 'title', 'src']

export class Video extends BlockEmbed {
  static blotName = 'video'
  static tagName = 'VIDEO'
  static SANITIZED_URL = 'about:blank'
  static PROTOCOL_WHITELIST = ['http', 'https', 'blob']
  static className = 'ql-video'

  static sanitize(url) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL
  }

  static create(value) {
    const node = super.create(value) as HTMLElement
    node.setAttribute('contenteditable', 'false')
    node.setAttribute('controls', 'controls')
    VIDEO_ATTRIBUTES.forEach((key) => {
      if (value[key]) {
        switch (key) {
          case 'src':{ const src = Video.sanitize(value[key])
            node.setAttribute(key, src)
            break
          }
          case 'title': {
            node.setAttribute(key, value[key])
            break
          }
          default: {
            node.dataset[key] = value[key]
          }
        }
      }
    })
    return node
  }

  static value(domNode) {
    const formats: any = {}
    VIDEO_ATTRIBUTES.forEach((key) => {
      const value = domNode.getAttribute(key) || domNode.dataset[key]
      if (value) {
        formats[key] = value
      }
    })
    return formats
  }
}

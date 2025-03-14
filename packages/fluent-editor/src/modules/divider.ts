import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block'
import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed') as typeof TypeBlockEmbed

export class DividerBlot extends BlockEmbed {
  static blotName = 'divider'
  static tagName = 'hr'

  static create() {
    const node = super.create() as HTMLElement
    node.setAttribute('contenteditable', 'false')
    return node
  }
}

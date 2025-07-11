import type TypeInline from 'quill/blots/inline'
import Quill from 'quill'

const Inline = Quill.import('blots/inline') as typeof TypeInline

export class EmojiBlot extends Inline {
  static blotName = 'emoji'
  static tagName = 'span'
  static className = 'ql-emoji-format'
}

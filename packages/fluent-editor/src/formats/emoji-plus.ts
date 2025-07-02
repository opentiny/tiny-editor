import type TypeInline from 'quill/blots/inline'
import Quill from 'quill'

const Inline = Quill.import('blots/inline') as typeof TypeInline

export class EmojiPlusBlot extends Inline {
  static blotName = 'emoji-plus'
  static tagName = 'span'
  static className = 'ql-emoji-plus-format'
}

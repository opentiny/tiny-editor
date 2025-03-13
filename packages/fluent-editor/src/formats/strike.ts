import type TypeInline from 'quill/blots/inline'
import Quill from 'quill'

const Inline = Quill.import('blots/inline') as typeof TypeInline

export class StrikeBlot extends Inline {
  static blotName = 'strike'
  static tagName = 'u'
  static className = 'ql-custom-strike'
  // 此处删除了formats方法，当前tag非span，则并不需要进行特殊处理去重写formats方法
}

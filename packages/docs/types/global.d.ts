import type { EmojiMartData } from '@emoji-mart/data'
import type { computePosition } from '@floating-ui/dom'
import type { Picker } from 'emoji-mart'
import type hljs from 'highlight.js'
import type Html2Canvas from 'html2canvas'
import type katex from 'katex'

declare global {
  interface Window {
    hljs: typeof hljs
    katex: typeof katex
    Html2Canvas: typeof Html2Canvas
    emojiData: EmojiMartData
    EmojiPicker: new (props: any) => Picker
    emojiPickerPosition: typeof computePosition
  }
}

export {}

import type hljs from 'highlight.js'
import type Html2Canvas from 'html2canvas'
import type katex from 'katex'

declare global {
  interface Window {
    hljs: typeof hljs
    katex: typeof katex
    Html2Canvas: typeof Html2Canvas
  }
}

export {}

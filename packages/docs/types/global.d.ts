import type hljs from 'highlight.js'
import type Html2Canvas from 'html2canvas'
import type katex from 'katex'
import type SimpleMindMap from 'simple-mind-map'
import type Drag from 'simple-mind-map/src/plugins/Drag.js'
import type Export from 'simple-mind-map/src/plugins/Export.js'
import type Themes from 'simple-mind-map/src/themes'

declare global {
  interface Window {
    hljs: typeof hljs
    katex: typeof katex
    Html2Canvas: typeof Html2Canvas
    SimpleMindMap: typeof SimpleMindMap
    Themes: typeof Themes
    Drag: typeof Drag
    Export: typeof Export
  }
}

export {}

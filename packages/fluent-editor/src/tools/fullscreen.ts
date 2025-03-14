import type Toolbar from 'quill/modules/toolbar'
import type FluentEditor from '../core/fluent-editor'
import { namespace } from '../config'
import { ICONS_CONFIG } from '../ui/icons'
import { lockScroll } from '../utils/scroll-lock'

export interface FluentEditorToolbar extends Toolbar {
  quill: FluentEditor
}

let exitEscHandlerBindToolbar: (e: KeyboardEvent) => void
let resizeHandlerBindToolbar: () => void
let cleanLock: ReturnType<typeof lockScroll>
let originScrollTop = 0
function exitEscHandler(toolbar: FluentEditorToolbar, e: KeyboardEvent) {
  if (e.code === 'Escape') {
    exitFullscreen(toolbar)
  }
}
function updateToolbarHeight(toolbar: FluentEditorToolbar) {
  const toolbarRect = toolbar.container.getBoundingClientRect()
  toolbar.quill.container.style.setProperty(`--${namespace}-top`, `${toolbarRect.height}px`)
}
function intoFullscreen(toolbar: FluentEditorToolbar) {
  toolbar.quill.isFullscreen = true
  originScrollTop = document.documentElement.scrollTop
  toolbar.container.classList.add('fullscreen')
  toolbar.quill.container.classList.add('fullscreen')
  cleanLock = lockScroll()
  resizeHandlerBindToolbar()
  const [, btn] = toolbar.controls.find(item => item[0] === 'fullscreen')
  btn.innerHTML = ICONS_CONFIG['fullscreen-exit']
  window.addEventListener('resize', resizeHandlerBindToolbar)
  document.addEventListener('keydown', exitEscHandlerBindToolbar)
  // TODO: clear hard code
  const toolbarTipModule = toolbar.quill.getModule('toolbar-tip') as any
  if (toolbarTipModule) {
    toolbarTipModule.hideAllTips()
  }
}
function exitFullscreen(toolbar: FluentEditorToolbar) {
  toolbar.quill.isFullscreen = false
  toolbar.container.classList.remove('fullscreen')
  toolbar.quill.container.classList.remove('fullscreen')
  cleanLock()
  document.documentElement.scrollTop = originScrollTop
  const [, btn] = toolbar.controls.find(item => item[0] === 'fullscreen')
  btn.innerHTML = ICONS_CONFIG.fullscreen
  window.removeEventListener('resize', resizeHandlerBindToolbar)
  document.removeEventListener('keydown', exitEscHandlerBindToolbar)
  // TODO: clear hard code
  const toolbarTipModule = toolbar.quill.getModule('toolbar-tip') as any
  if (toolbarTipModule) {
    toolbarTipModule.hideAllTips()
  }
}
export function fullscreenHandler(this: FluentEditorToolbar) {
  if (this.quill.isFullscreen) {
    exitFullscreen(this)
  }
  else {
    exitEscHandlerBindToolbar = exitEscHandler.bind(undefined, this)
    resizeHandlerBindToolbar = updateToolbarHeight.bind(undefined, this)
    intoFullscreen(this)
  }
}

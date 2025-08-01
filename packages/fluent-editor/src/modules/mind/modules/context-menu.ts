import type FluentEditor from '../../../core/fluent-editor'
import type MindmapPlaceholderBlot from '../formats/mind-blot'
import { CHANGE_LANGUAGE_EVENT } from '../../../config'
import { I18N } from '../../../modules/i18n'

class MindContextMenuHandler {
  private texts: Record<string, string>
  private lang: string
  getText(key: keyof Record<string, string>): string {
    return this.texts[key]
  }

  constructor(private quill: FluentEditor, private blot: MindmapPlaceholderBlot) {
    this.lang = 'en-US'
    this.texts = this.resolveTexts()
    this.quill.emitter.on(CHANGE_LANGUAGE_EVENT, (lang: string) => {
      this.lang = lang
      this.texts = this.resolveTexts()
      this.updateContextMenuItems()
    })
  }

  resolveTexts() {
    return {
      copy: I18N.parserText('mindmap.contextMenu.copy', this.lang),
      cut: I18N.parserText('mindmap.contextMenu.cut', this.lang),
      paste: I18N.parserText('mindmap.contextMenu.paste', this.lang),
      delete: I18N.parserText('mindmap.contextMenu.deleteContent', this.lang),
    }
  }

  updateContextMenuItems() {
    if (!this.blot.contextMenu) return

    const menuItems = this.blot.contextMenu.querySelectorAll('.mindmap-context-menu-item')
    if (menuItems.length >= 4) {
      menuItems[0].textContent = this.texts.copy
      menuItems[1].textContent = this.texts.cut
      menuItems[2].textContent = this.texts.paste
      menuItems[3].textContent = this.texts.delete
    }
  }
}

const contextMenuHandlers = new WeakMap<MindmapPlaceholderBlot, MindContextMenuHandler>()

export function initContextMenu(blot: MindmapPlaceholderBlot, quill: FluentEditor): void {
  blot.contextMenu = document.createElement('div')
  blot.contextMenu.className = 'mindmap-context-menu'
  blot.contextMenu.style.position = 'fixed'
  blot.contextMenu.style.background = 'white'
  blot.contextMenu.style.borderRadius = '4px'
  blot.contextMenu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
  blot.contextMenu.style.padding = '5px 0'
  blot.contextMenu.style.zIndex = '1000'
  blot.contextMenu.style.display = 'block'
  blot.contextMenu.style.visibility = 'visible'
  blot.contextMenu.style.opacity = '1'
  blot.contextMenu.style.width = '120px'
  blot.contextMenu.style.height = 'auto'
  document.body.appendChild(blot.contextMenu)

  const handler = new MindContextMenuHandler(quill, blot)
  contextMenuHandlers.set(blot, handler)

  addContextMenuItem(blot, handler.getText('copy'), () => handleCopy(blot))
  addContextMenuItem(blot, handler.getText('cut'), () => handleCut(blot))
  addContextMenuItem(blot, handler.getText('paste'), () => handlePaste(blot))
  addContextMenuItem(blot, handler.getText('delete'), () => handleDeleteContent(blot))

  // 监听节点右键点击事件
  if (blot.mm) {
    blot.mm.on('node_contextmenu', (e: any, node: any) => {
      e.preventDefault()
      e.stopPropagation()
      blot.currentNode = node
      if (blot.contextMenu) {
        blot.contextMenu.style.display = 'block'
        blot.contextMenu.style.left = `${e.clientX}px`
        blot.contextMenu.style.top = `${e.clientY}px`
      }
    })
  }

  // 隐藏菜单的逻辑
  const hideMenu = () => {
    if (blot.contextMenu) {
      blot.contextMenu.style.display = 'none'
      blot.currentNode = null
    }
  }

  blot.mm.on('node_click', hideMenu)
  blot.mm.on('draw_click', hideMenu)
  blot.mm.on('expand_btn_click', hideMenu)
  document.addEventListener('click', (e) => {
    if (blot.contextMenu && !blot.contextMenu.contains(e.target as Node)) {
      hideMenu()
    }
  })
}

function addContextMenuItem(blot: MindmapPlaceholderBlot, text: string, onClick: () => void): void {
  const item = document.createElement('div')
  item.className = 'mindmap-context-menu-item'
  item.textContent = text
  item.style.padding = '5px 15px'
  item.style.cursor = 'pointer'
  item.style.whiteSpace = 'nowrap'
  item.addEventListener('click', onClick)
  item.addEventListener('mouseenter', () => {
    item.style.background = '#f5f5f5'
  })
  item.addEventListener('mouseleave', () => {
    item.style.background = 'white'
  })
  blot.contextMenu!.appendChild(item)
}

function handleCopy(blot: MindmapPlaceholderBlot): void {
  blot.mm.renderer.copy()
  hideContextMenu(blot)
}

function handleCut(blot: MindmapPlaceholderBlot): void {
  blot.mm.renderer.cut()
  hideContextMenu(blot)
}

function handlePaste(blot: MindmapPlaceholderBlot): void {
  blot.mm.renderer.paste()
  hideContextMenu(blot)
}

function handleDeleteContent(blot: MindmapPlaceholderBlot): void {
  if (blot.currentNode) {
    blot.currentNode.setText('')
    blot.data = blot.mm.getData({})
    blot.domNode.setAttribute('data-mm', JSON.stringify(blot.data))
    blot.scroll.update([], {})
  }
  hideContextMenu(blot)
}

function hideContextMenu(blot: MindmapPlaceholderBlot): void {
  if (blot.contextMenu) {
    blot.contextMenu.style.display = 'none'
  }
}

import type FluentEditor from '../../../core/fluent-editor'
import type MindMapPlaceholderBlot from '../formats/mind-map-blot'
import { CHANGE_LANGUAGE_EVENT } from '../../../config'
import { I18N } from '../../../modules/i18n'
import { registerMindMapI18N } from '../i18n'

class MindMapContextMenuHandler {
  private texts: Record<string, string>
  private lang: string
  getText(key: keyof Record<string, string>): string {
    return this.texts[key]
  }

  constructor(private quill: FluentEditor, private blot: MindMapPlaceholderBlot) {
    const i18nModule = this.quill.getModule('i18n') as I18N
    registerMindMapI18N(I18N)
    this.lang = i18nModule.options.lang
    this.texts = this.resolveTexts()
    this.quill.emitter.on(CHANGE_LANGUAGE_EVENT, (lang: string) => {
      this.lang = lang
      this.texts = this.resolveTexts()
      this.updateContextMenuItems()
    })
  }

  resolveTexts() {
    return {
      copy: I18N.parserText('mindMap.contextMenu.copy', this.lang),
      cut: I18N.parserText('mindMap.contextMenu.cut', this.lang),
      paste: I18N.parserText('mindMap.contextMenu.paste', this.lang),
      delete: I18N.parserText('mindMap.contextMenu.deleteContent', this.lang),
    }
  }

  updateContextMenuItems() {
    if (!this.blot.contextMenu) return

    const menuItems = this.blot.contextMenu.querySelectorAll('.ql-mind-map-context-menu-item')
    if (menuItems.length >= 4) {
      menuItems[0].textContent = this.texts.copy
      menuItems[1].textContent = this.texts.cut
      menuItems[2].textContent = this.texts.paste
      menuItems[3].textContent = this.texts.delete
    }
  }
}

const contextMenuHandlers = new WeakMap<MindMapPlaceholderBlot, MindMapContextMenuHandler>()

export function initContextMenu(blot: MindMapPlaceholderBlot, quill: FluentEditor): void {
  blot.contextMenu = document.createElement('div')
  blot.contextMenu.className = 'ql-mind-map-context-menu'
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
  blot.domNode.appendChild(blot.contextMenu)

  const handler = new MindMapContextMenuHandler(quill, blot)
  contextMenuHandlers.set(blot, handler)

  addContextMenuItem(blot, handler.getText('copy'), () => handleCopy(blot))
  addContextMenuItem(blot, handler.getText('cut'), () => handleCut(blot))
  addContextMenuItem(blot, handler.getText('paste'), () => handlePaste(blot))
  addContextMenuItem(blot, handler.getText('delete'), () => handleDeleteContent(blot))

  // 监听节点右键点击事件
  if (blot.mindMap) {
    blot.mindMap.on('node_contextmenu', (e: any, node: any) => {
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

  blot.mindMap.on('node_click', hideMenu)
  blot.mindMap.on('draw_click', hideMenu)
  blot.mindMap.on('expand_btn_click', hideMenu)
  document.addEventListener('click', (e) => {
    if (blot.contextMenu && !blot.contextMenu.contains(e.target as Node)) {
      hideMenu()
    }
  })
}

function addContextMenuItem(blot: MindMapPlaceholderBlot, text: string, onClick: () => void): void {
  const item = document.createElement('div')
  item.className = 'ql-mind-map-context-menu-item'
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

function handleCopy(blot: MindMapPlaceholderBlot): void {
  blot.mindMap.renderer.copy()
  hideContextMenu(blot)
}

function handleCut(blot: MindMapPlaceholderBlot): void {
  blot.mindMap.renderer.cut()
  hideContextMenu(blot)
}

function handlePaste(blot: MindMapPlaceholderBlot): void {
  blot.mindMap.renderer.paste()
  hideContextMenu(blot)
}

function handleDeleteContent(blot: MindMapPlaceholderBlot): void {
  if (blot.currentNode) {
    blot.currentNode.setText('')
    blot.data = blot.mindMap.getData({})
    blot.domNode.setAttribute('data-mind-map', JSON.stringify(blot.data))
  }
  hideContextMenu(blot)
}

function hideContextMenu(blot: MindMapPlaceholderBlot): void {
  if (blot.contextMenu) {
    blot.contextMenu.style.display = 'none'
  }
}

import type FluentEditor from '../../../core/fluent-editor'
import type FlowChartPlaceholderBlot from '../formats/flow-chart-blot'
import { CHANGE_LANGUAGE_EVENT } from '../../../config'
import { I18N } from '../../../modules/i18n'
import { registerFlowChartI18N } from '../i18n/index'

class FlowChartContextMenuHandler {
  private texts: Record<string, string>
  private lang: string
  getText(key: keyof Record<string, string>): string {
    return this.texts[key]
  }

  constructor(private quill: FluentEditor, private blot: FlowChartPlaceholderBlot) {
    registerFlowChartI18N(I18N)
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
      copy: I18N.parserText('flowChart.contextMenu.copy', this.lang),
      cut: I18N.parserText('flowChart.contextMenu.cut', this.lang),
      paste: I18N.parserText('flowChart.contextMenu.paste', this.lang),
      deleteContent: I18N.parserText('flowChart.contextMenu.deleteContent', this.lang),
      deleteNode: I18N.parserText('flowChart.contextMenu.deleteNode', this.lang),
      deleteEdge: I18N.parserText('flowChart.contextMenu.deleteEdge', this.lang),
    }
  }

  updateContextMenuItems() {
    if (!this.blot.contextMenu) return

    const menuItems = this.blot.contextMenu.querySelectorAll('.flow-chart-context-menu-item')
    if (menuItems.length > 0) {
      Array.from(menuItems).forEach((item) => {
        const text = item.getAttribute('data-text-key')
        if (text && this.texts[text as keyof Record<string, string>]) {
          item.textContent = this.texts[text as keyof Record<string, string>]
        }
      })
    }
  }
}

const contextMenuHandlers = new WeakMap<FlowChartPlaceholderBlot, FlowChartContextMenuHandler>()

export function initContextMenu(blot: FlowChartPlaceholderBlot, quill: FluentEditor): void {
  blot.contextMenu = document.createElement('div')
  blot.contextMenu.className = 'flow-chart-context-menu'
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

  const handler = new FlowChartContextMenuHandler(quill, blot)
  contextMenuHandlers.set(blot, handler)

  if (blot.flowChart) {
    blot.flowChart.on('node:contextmenu', (event: any) => {
      const { data, e } = event
      e.preventDefault()
      e.stopPropagation()
      blot.currentElement = { type: 'node', data }
      showNodeContextMenu(blot, handler, e.clientX, e.clientY)
    })

    blot.flowChart.on('edge:contextmenu', (event: any) => {
      const { data, e } = event
      e.preventDefault()
      e.stopPropagation()
      blot.currentElement = { type: 'edge', data }
      showEdgeContextMenu(blot, handler, e.clientX, e.clientY)
    })
  }

  const hideMenu = () => {
    if (blot.contextMenu) {
      blot.contextMenu.style.display = 'none'
      blot.currentElement = null
    }
  }

  blot.flowChart.on('blank:click', hideMenu)
  document.addEventListener('click', (e) => {
    if (blot.contextMenu && !blot.contextMenu.contains(e.target as Node)) {
      hideMenu()
    }
  })
}

function showNodeContextMenu(blot: FlowChartPlaceholderBlot, handler: FlowChartContextMenuHandler, x: number, y: number): void {
  clearContextMenu(blot)

  addContextMenuItem(blot, handler.getText('copy'), 'copy', () => handleCopy(blot))
  addContextMenuItem(blot, handler.getText('deleteContent'), 'deleteContent', () => handleDeleteContent(blot))
  addContextMenuItem(blot, handler.getText('deleteNode'), 'deleteNode', () => handleDeleteNode(blot))

  showContextMenu(blot, x, y)
}

function showEdgeContextMenu(blot: FlowChartPlaceholderBlot, handler: FlowChartContextMenuHandler, x: number, y: number): void {
  clearContextMenu(blot)

  addContextMenuItem(blot, handler.getText('deleteContent'), 'deleteContent', () => handleDeleteContent(blot))
  addContextMenuItem(blot, handler.getText('deleteEdge'), 'deleteEdge', () => handleDeleteEdge(blot))

  showContextMenu(blot, x, y)
}

function clearContextMenu(blot: FlowChartPlaceholderBlot): void {
  if (blot.contextMenu) {
    blot.contextMenu.innerHTML = ''
  }
}

function showContextMenu(blot: FlowChartPlaceholderBlot, x: number, y: number): void {
  if (blot.contextMenu) {
    blot.contextMenu.style.display = 'block'
    blot.contextMenu.style.left = `${x}px`
    blot.contextMenu.style.top = `${y}px`
  }
}

function addContextMenuItem(blot: FlowChartPlaceholderBlot, text: string, textKey: string, onClick: () => void): void {
  const item = document.createElement('div')
  item.className = 'flow-chart-context-menu-item'
  item.textContent = text
  item.setAttribute('data-text-key', textKey)
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

function handleCopy(blot: FlowChartPlaceholderBlot): void {
  if (blot.currentElement && blot.currentElement.type === 'node') {
    const nodeId = blot.currentElement.data.id
    blot.flowChart.cloneNode(nodeId)
  }
  hideContextMenu(blot)
}

function handleDeleteContent(blot: FlowChartPlaceholderBlot): void {
  if (blot.currentElement) {
    if (blot.currentElement.type === 'node') {
      const node = blot.currentElement.data
      blot.flowChart.updateText(node.id, '')
    }
    else if (blot.currentElement.type === 'edge') {
      const edge = blot.currentElement.data
      blot.flowChart.updateText(edge.id, '')
    }
    blot.data = blot.flowChart.getGraphData()
    blot.domNode.setAttribute('data-flow-chart', JSON.stringify(blot.data))
    blot.scroll.update([], {})
  }
  hideContextMenu(blot)
}

function handleDeleteNode(blot: FlowChartPlaceholderBlot): void {
  if (blot.currentElement && blot.currentElement.type === 'node') {
    blot.flowChart.deleteNode(blot.currentElement.data.id)
    blot.data = blot.flowChart.getGraphData()
    blot.domNode.setAttribute('data-flow-chart', JSON.stringify(blot.data))
    blot.scroll.update([], {})
  }
  hideContextMenu(blot)
}

function handleDeleteEdge(blot: FlowChartPlaceholderBlot): void {
  if (blot.currentElement && blot.currentElement.type === 'edge') {
    blot.flowChart.deleteEdge(blot.currentElement.data.id)
    blot.data = blot.flowChart.getGraphData()
    blot.domNode.setAttribute('data-flow-chart', JSON.stringify(blot.data))
    blot.scroll.update([], {})
  }
  hideContextMenu(blot)
}

function hideContextMenu(blot: FlowChartPlaceholderBlot): void {
  if (blot.contextMenu) {
    blot.contextMenu.style.display = 'none'
  }
}

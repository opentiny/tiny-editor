import type { I18n } from 'quill-i18n'
import type FluentEditor from '../../../core/fluent-editor'
import type FlowChartPlaceholderBlot from '../formats/flow-chart-blot'
import { registerFlowChartI18N } from '../i18n/index'

class FlowChartContextMenuHandler {
  private texts: Record<string, string>
  private lang: string
  getText(key: keyof Record<string, string>): string {
    return this.texts[key]
  }

  constructor(private quill: FluentEditor, private blot: FlowChartPlaceholderBlot) {
    const i18nModule = this.quill.getModule('i18n') as I18n
    registerFlowChartI18N(i18nModule)
    this.lang = i18nModule.getLocale()
    this.texts = this.resolveTexts()
    this.quill.on('i18n-locale-change', (event: { locale: string, oldLocale: string }) => {
      this.lang = event.locale
      this.texts = this.resolveTexts()
      this.updateContextMenuItems()
    })
  }

  resolveTexts() {
    return {
      copy: this.quill.getLangText('flowChart.contextMenu.copy'),
      cut: this.quill.getLangText('flowChart.contextMenu.cut'),
      paste: this.quill.getLangText('flowChart.contextMenu.paste'),
      deleteContent: this.quill.getLangText('flowChart.contextMenu.deleteContent'),
      deleteNode: this.quill.getLangText('flowChart.contextMenu.deleteNode'),
      deleteEdge: this.quill.getLangText('flowChart.contextMenu.deleteEdge'),
    }
  }

  updateContextMenuItems() {
    if (!this.blot.contextMenu) return

    const menuItems = this.blot.contextMenu.querySelectorAll('.ql-flow-chart-context-menu-item')
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
  blot.contextMenu.className = 'ql-flow-chart-context-menu'
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
  item.className = 'ql-flow-chart-context-menu-item'
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
  }
  hideContextMenu(blot)
}

function handleDeleteNode(blot: FlowChartPlaceholderBlot): void {
  if (blot.currentElement && blot.currentElement.type === 'node') {
    blot.flowChart.deleteNode(blot.currentElement.data.id)
    blot.data = blot.flowChart.getGraphData()
    blot.domNode.setAttribute('data-flow-chart', JSON.stringify(blot.data))
  }
  hideContextMenu(blot)
}

function handleDeleteEdge(blot: FlowChartPlaceholderBlot): void {
  if (blot.currentElement && blot.currentElement.type === 'edge') {
    blot.flowChart.deleteEdge(blot.currentElement.data.id)
    blot.data = blot.flowChart.getGraphData()
    blot.domNode.setAttribute('data-flow-chart', JSON.stringify(blot.data))
  }
  hideContextMenu(blot)
}

function hideContextMenu(blot: FlowChartPlaceholderBlot): void {
  if (blot.contextMenu) {
    blot.contextMenu.style.display = 'none'
  }
}

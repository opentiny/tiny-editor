import type FluentEditor from '../../../core/fluent-editor'
import type MindmapPlaceholderBlot from '../formats/mind-blot'
import { CHANGE_LANGUAGE_EVENT } from '../../../config'
import { I18N } from '../../../modules/i18n'

class ControlPanelHandler {
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
      this.updateControlPanelTexts()
    })
  }

  resolveTexts() {
    return {
      zoomOut: I18N.parserText('mindmap.controlPanel.zoomOut', this.lang),
      zoomIn: I18N.parserText('mindmap.controlPanel.zoomIn', this.lang),
      fit: I18N.parserText('mindmap.controlPanel.fit', this.lang),
      back: I18N.parserText('mindmap.controlPanel.back', this.lang),
      forward: I18N.parserText('mindmap.controlPanel.forward', this.lang),
      export: I18N.parserText('mindmap.controlPanel.export', this.lang),
      import: I18N.parserText('mindmap.controlPanel.import', this.lang),
      inserChildNode: I18N.parserText('mindmap.controlPanel.inserChildNode', this.lang),
      inserNode: I18N.parserText('mindmap.controlPanel.inserNode', this.lang),
      inserParentNode: I18N.parserText('mindmap.controlPanel.inserParentNode', this.lang),
      removeNode: I18N.parserText('mindmap.controlPanel.removeNode', this.lang),

      zoomOutTitle: I18N.parserText('mindmap.controlPanel.zoomOutTitle', this.lang),
      zoomInTitle: I18N.parserText('mindmap.controlPanel.zoomInTitle', this.lang),
      fitTitle: I18N.parserText('mindmap.controlPanel.fitTitle', this.lang),
      backTitle: I18N.parserText('mindmap.controlPanel.backTitle', this.lang),
      forwardTitle: I18N.parserText('mindmap.controlPanel.forwardTitle', this.lang),
      exportTitle: I18N.parserText('mindmap.controlPanel.exportTitle', this.lang),
      importTitle: I18N.parserText('mindmap.controlPanel.importTitle', this.lang),
      inserChildNodeTitle: I18N.parserText('mindmap.controlPanel.inserChildNodeTitle', this.lang),
      inserNodeTitle: I18N.parserText('mindmap.controlPanel.inserNodeTitle', this.lang),
      inserParentNodeTitle: I18N.parserText('mindmap.controlPanel.inserParentNodeTitle', this.lang),
      removeNodeTitle: I18N.parserText('mindmap.controlPanel.removeNodeTitle', this.lang),
    }
  }

  updateControlPanelTexts() {
    const controlItems = this.blot.domNode.querySelectorAll('.mindmap-control-item')
    controlItems.forEach((item) => {
      const icon = item.querySelector('i')
      if (icon) {
        const iconClass = icon.className.split('-')[2]
        if (this.texts[iconClass]) {
          const textSpan = item.querySelector('.mindmap-control-text')
          if (textSpan) {
            textSpan.textContent = this.texts[iconClass]
          }
          (item as HTMLElement).title = this.texts[`${iconClass}Title`] || ''
        }
      }
    })
  }
}

const controlPanelHandlers = new WeakMap<MindmapPlaceholderBlot, ControlPanelHandler>()

const DISABLED_OPACITY = '0.5'
const ENABLED_OPACITY = '1'
export function createControlPanel(blot: MindmapPlaceholderBlot, quill: FluentEditor): void {
  let isStart = true
  let isEnd = true
  // 右上的控制面板
  const controlPanel = document.createElement('div')
  controlPanel.className = 'mindmap-control'
  // 左下的控制面板
  const controlLeftDownPanel = document.createElement('div')
  controlLeftDownPanel.className = 'mindmap-left-down-control'
  // 左上的控制面板
  const controlLeftUpPanel = document.createElement('div')
  controlLeftUpPanel.className = 'mindmap-left-up-control'

  const handler = new ControlPanelHandler(quill, blot)
  controlPanelHandlers.set(blot, handler)

  const zoomOutBtn = createControlItem('zoomOut', handler.getText('zoomOut'), handler.getText('zoomOutTitle'), () => handleZoomOut(blot))
  const zoomInBtn = createControlItem('zoomIn', handler.getText('zoomIn'), handler.getText('zoomInTitle'), () => handleZoomIn(blot))
  const resetBtn = createControlItem('fit', handler.getText('fit'), handler.getText('fitTitle'), () => handleResetZoom(blot))
  const backBtn = createControlItem('back', handler.getText('back'), handler.getText('backTitle'), () => {
    if (!isStart) {
      blot.mm.execCommand('BACK')
    }
  })
  const forwardBtn = createControlItem('forward', handler.getText('forward'), handler.getText('forwardTitle'), () => {
    if (!isEnd) {
      blot.mm.execCommand('FORWARD')
    }
  })
  const exportJSON = createControlItem('export', handler.getText('export'), handler.getText('exportTitle'), () => handleExport(blot))
  const importJSON = createControlItem('import', handler.getText('import'), handler.getText('importTitle'), () => handleImport(blot))
  const insertChildNode = createControlItem('inserChildNode', handler.getText('inserChildNode'), handler.getText('inserChildNodeTitle'), () => handleInsertChildNode(blot))
  const insertNode = createControlItem('inserNode', handler.getText('inserNode'), handler.getText('inserNodeTitle'), () => handleInsertNode(blot))
  const insertParentNode = createControlItem('inserParentNode', handler.getText('inserParentNode'), handler.getText('inserParentNodeTitle'), () => handleInsertParentNode(blot))
  const removeNode = createControlItem('removeNode', handler.getText('removeNode'), handler.getText('removeNodeTitle'), () => handleRemoveNode(blot))

  const updateButtonState = (index: number, len: number) => {
    isStart = index <= 0
    isEnd = index >= len - 1
    backBtn.style.cursor = isStart ? 'not-allowed' : 'pointer'
    backBtn.style.opacity = isStart ? DISABLED_OPACITY : ENABLED_OPACITY
    forwardBtn.style.cursor = isEnd ? 'not-allowed' : 'pointer'
    forwardBtn.style.opacity = isEnd ? DISABLED_OPACITY : ENABLED_OPACITY
  }

  blot.mm.on('back_forward', (index: number, len: number) => {
    updateButtonState(index, len)
  })
  controlPanel.append(zoomOutBtn, zoomInBtn, resetBtn, backBtn, forwardBtn)
  blot.domNode.appendChild(controlPanel)
  controlLeftDownPanel.append(exportJSON, importJSON)
  blot.domNode.appendChild(controlLeftDownPanel)
  controlLeftUpPanel.append(insertChildNode, insertNode, insertParentNode, removeNode)
  blot.domNode.appendChild(controlLeftUpPanel)
}

function createControlItem(iconClass: string, text: string, title: string, onClick: () => void, disabled = false) {
  const controlItem = document.createElement('div')
  controlItem.className = 'mindmap-control-item'
  controlItem.title = title
  controlItem.style.cursor = disabled ? 'not-allowed' : 'pointer'
  controlItem.style.opacity = disabled ? DISABLED_OPACITY : ENABLED_OPACITY

  const icon = document.createElement('i')
  icon.className = `mindmap-control-${iconClass}`

  const textSpan = document.createElement('span')
  textSpan.className = 'mindmap-control-text'
  textSpan.textContent = text

  controlItem.appendChild(icon)
  controlItem.appendChild(textSpan)

  if (!disabled) {
    controlItem.addEventListener('click', onClick)
  }

  return controlItem
}

function handleInsertChildNode(blot: MindmapPlaceholderBlot): void {
  blot.mm.execCommand('INSERT_CHILD_NODE')
}

function handleInsertNode(blot: MindmapPlaceholderBlot): void {
  blot.mm.execCommand('INSERT_NODE')
}

function handleInsertParentNode(blot: MindmapPlaceholderBlot): void {
  blot.mm.execCommand('INSERT_PARENT_NODE')
}

function handleRemoveNode(blot: MindmapPlaceholderBlot): void {
  blot.mm.execCommand('REMOVE_CURRENT_NODE')
}

function handleExport(blot: MindmapPlaceholderBlot): void {
  blot.mm.getElRectInfo()
  if (blot.mm) {
    blot.mm.export('json', true, '思维导图')
  }
}

function handleImport(blot: MindmapPlaceholderBlot): void {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = '.json'
  fileInput.style.display = 'none'

  // 监听文件选择事件
  fileInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string)
        if (blot.mm) {
          if (jsonData.root) {
            blot.mm.setFullData(jsonData)
          }
          else {
            blot.mm.setData(jsonData)
          }
          blot.mm.view.reset()
          blot.data = blot.mm.getData({})
          blot.domNode.setAttribute('data-mm', JSON.stringify(blot.data))
          blot.scroll.update([], {})
        }
      }
      catch (error) {
        alert('文件解析错误，请确保选择的是有效的JSON文件')
      }
    }
    reader.readAsText(file)
  })

  // 触发文件选择对话框
  document.body.appendChild(fileInput)
  fileInput.click()
  document.body.removeChild(fileInput)
}

function handleZoomIn(blot: MindmapPlaceholderBlot): void {
  if (blot.mm && blot.mm.view) {
    const containerRect = blot.mm.el.getBoundingClientRect()
    const cx = containerRect.width / 2
    const cy = containerRect.height / 2
    blot.mm.view.enlarge(cx, cy, false)
    blot.zoomCount++
  }
}

function handleZoomOut(blot: MindmapPlaceholderBlot): void {
  if (blot.mm && blot.mm.view) {
    const containerRect = blot.mm.el.getBoundingClientRect()
    const cx = containerRect.width / 2
    const cy = containerRect.height / 2
    blot.mm.view.narrow(cx, cy, false)
    blot.zoomCount--
  }
}

function handleResetZoom(blot: MindmapPlaceholderBlot): void {
  if (!blot.mm || !blot.mm.view || blot.zoomCount === 0) return
  const containerRect = blot.mm.el.getBoundingClientRect()
  const centerX = containerRect.width / 2
  const centerY = containerRect.height / 2
  const operationCount = Math.abs(blot.zoomCount)
  const isEnlarge = blot.zoomCount < 0
  for (let i = 0; i < operationCount; i++) {
    if (isEnlarge) {
      blot.mm.view.enlarge(centerX, centerY, false)
    }
    else {
      blot.mm.view.narrow(centerX, centerY, false)
    }
  }
  blot.zoomCount = 0
}

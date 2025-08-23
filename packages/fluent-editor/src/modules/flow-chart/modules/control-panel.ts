import type FluentEditor from '../../../core/fluent-editor'
import type FlowChartPlaceholderBlot from '../formats/flow-chart-blot'
import { CHANGE_LANGUAGE_EVENT } from '../../../config'
import { I18N } from '../../../modules/i18n'
import { registerFlowChartI18N } from '../i18n'
import bezierIcon from '../icons/bezierIcon.png'
import contractIcon from '../icons/contractIcon.png'
import expandIcon from '../icons/expandIcon.png'
import fullScreenIcon from '../icons/fullScreenIcon.png'
import lineIcon from '../icons/lineIcon.png'
import polyLineIcon from '../icons/polyLineIcon.png'
import smallScreenIcon from '../icons/smallScreenIcon.png'

class FlowChartControlPanelHandler {
  private texts: Record<string, string>
  private lang: string
  getText(key: keyof Record<string, string>): string {
    return this.texts[key]
  }

  constructor(private quill: FluentEditor, private blot: FlowChartPlaceholderBlot) {
    const i18nModule = this.quill.getModule('i18n') as I18N
    registerFlowChartI18N(I18N)
    this.lang = i18nModule.options.lang
    this.texts = this.resolveTexts()
    this.quill.emitter.on(CHANGE_LANGUAGE_EVENT, (lang: string) => {
      this.lang = lang
      this.texts = this.resolveTexts()
      this.updateControlPanelTexts()
    })
  }

  resolveTexts() {
    return {
      exportTitle: I18N.parserText('flowChart.controlPanel.exportTitle', this.lang),
      zoomOutTitle: I18N.parserText('flowChart.controlPanel.zoomOutTitle', this.lang),
      zoomInTitle: I18N.parserText('flowChart.controlPanel.zoomInTitle', this.lang),
      fitTitle: I18N.parserText('flowChart.controlPanel.fitTitle', this.lang),
      backTitle: I18N.parserText('flowChart.controlPanel.backTitle', this.lang),
      forwardTitle: I18N.parserText('flowChart.controlPanel.forwardTitle', this.lang),
      setEdgeTypeTitle: I18N.parserText('flowChart.controlPanel.setEdgeTypeTitle', this.lang),
      panelStatusTitle: I18N.parserText('flowChart.controlPanel.panelStatusTitle', this.lang),
      screenTypeTitle: I18N.parserText('flowChart.controlPanel.screenTypeTitle', this.lang),
    }
  }

  updateControlPanelTexts() {
    const controlItems = this.blot.domNode.querySelectorAll('.ql-flow-chart-control-item')

    const controlItemMap: Record<string, string> = {
      'zoom-out': 'zoomOutTitle',
      'zoom-in': 'zoomInTitle',
      'fit': 'fitTitle',
      'back': 'backTitle',
      'forward': 'forwardTitle',
      'set-edge-type': 'setEdgeTypeTitle',
      'panel-status': 'panelStatusTitle',
      'screen-type': 'screenTypeTitle',
    }

    controlItems.forEach((item) => {
      const controlType = (item as HTMLElement).dataset.controlType
      if (controlType && controlItemMap[controlType] && this.texts[controlItemMap[controlType]]) {
        (item as HTMLElement).title = this.texts[controlItemMap[controlType]]
      }
    })
  }
}

const controlPanelHandlers = new WeakMap<FlowChartPlaceholderBlot, FlowChartControlPanelHandler>()

const DISABLED_OPACITY = '0.5'
const ENABLED_OPACITY = '1'
export function createControlPanel(blot: FlowChartPlaceholderBlot, quill: FluentEditor): void {
  // 中间的控制面板
  const controlPanel = document.createElement('div')
  controlPanel.className = 'ql-flow-chart-control'
  // 右上的控制面板
  const controlRightUpPanel = document.createElement('div')
  controlRightUpPanel.className = 'ql-flow-chart-right-up-control'

  const handler = new FlowChartControlPanelHandler(quill, blot)
  controlPanelHandlers.set(blot, handler)
  const zoomOutBtn = createControlItem('zoom-out', handler.getText('zoomOutTitle'), () => handleZoomOut(blot))
  const zoomInBtn = createControlItem('zoom-in', handler.getText('zoomInTitle'), () => handleZoomIn(blot))
  const resetBtn = createControlItem('fit', handler.getText('fitTitle'), () => handleResetZoom(blot))
  const backBtn = createControlItem('back', handler.getText('backTitle'), () => handleUndo(blot))
  const forwardBtn = createControlItem('forward', handler.getText('forwardTitle'), () => handleRedo(blot))
  const setEdgeTypeBtn = createControlItem('set-edge-type', handler.getText('setEdgeTypeTitle'), () => handleSetEdgeType(blot))
  const panelStatusBtn = createControlItem('panel-status', handler.getText('panelStatusTitle'), () => handlePanelStatusBtn(blot))
  const screenTypeBtn = createControlItem('screen-type', handler.getText('screenTypeTitle'), () => handleScreenTypeBtn(blot))

  const updateButtonState = (historyData: any) => {
    if (!historyData.data) {
      backBtn.style.opacity = DISABLED_OPACITY
      backBtn.style.cursor = 'not-allowed'
      forwardBtn.style.opacity = DISABLED_OPACITY
      forwardBtn.style.cursor = 'not-allowed'
      return
    }
    const isUndoAvailable = historyData.data.undoAble || historyData.data.undos.length < 0
    const isRedoAvailable = historyData.data.redoAble || historyData.data.redos.length > 0

    if (backBtn) {
      backBtn.style.opacity = isUndoAvailable ? ENABLED_OPACITY : DISABLED_OPACITY
      backBtn.style.cursor = isUndoAvailable ? 'pointer' : 'not-allowed'
    }

    if (forwardBtn) {
      forwardBtn.style.opacity = isRedoAvailable ? ENABLED_OPACITY : DISABLED_OPACITY
      forwardBtn.style.cursor = isRedoAvailable ? 'pointer' : 'not-allowed'
    }
  }
  updateButtonState(blot.flowChart.history)
  blot.flowChart.on('history:change', (data: any) => {
    updateButtonState(data)
  })

  setTimeout(() => {
    const controlLeftUpPanel = document.querySelector('.lf-dndpanel') as HTMLElement | null
    controlLeftUpPanel.append(setEdgeTypeBtn)
  }, 0)
  controlRightUpPanel.append(panelStatusBtn)
  blot.domNode.appendChild(controlRightUpPanel)
  controlPanel.append(zoomOutBtn, zoomInBtn, resetBtn, screenTypeBtn, backBtn, forwardBtn)
  blot.domNode.appendChild(controlPanel)
}

function handleUndo(blot: FlowChartPlaceholderBlot): void {
  if (blot.flowChart) {
    blot.flowChart.undo()
  }
}

function handleRedo(blot: FlowChartPlaceholderBlot): void {
  if (blot.flowChart) {
    blot.flowChart.redo()
  }
}

function handleZoomIn(blot: FlowChartPlaceholderBlot): void {
  if (blot.flowChart) {
    blot.flowChart.zoom(true)
  }
}

function handleZoomOut(blot: FlowChartPlaceholderBlot): void {
  if (blot.flowChart) {
    blot.flowChart.zoom(false)
  }
}

function handleResetZoom(blot: FlowChartPlaceholderBlot): void {
  if (blot.flowChart) {
    blot.flowChart.resetZoom()
  }
}

function createControlItem(iconClass: string, title: string, onClick: () => void, disabled = false) {
  const controlItem = document.createElement('div')
  controlItem.className = 'ql-flow-chart-control-item'
  controlItem.title = title
  controlItem.dataset.controlType = iconClass
  controlItem.style.cursor = disabled ? 'not-allowed' : 'pointer'

  const icon = document.createElement('i')
  icon.className = `ql-flow-chart-control-${iconClass}`
  controlItem.appendChild(icon)

  if (!disabled) {
    controlItem.addEventListener('click', onClick)
  }

  return controlItem
}

function handleSetEdgeType(blot: FlowChartPlaceholderBlot): void {
  const controlLeftUpPanel = document.querySelector('.lf-dndpanel') as HTMLElement | null
  if (!controlLeftUpPanel) return
  let edgeTypePanel = controlLeftUpPanel.querySelector('.ql-flow-chart-edge-panel') as HTMLElement
  if (!edgeTypePanel) {
    edgeTypePanel = document.createElement('div')
    edgeTypePanel.className = 'ql-flow-chart-edge-panel'
    controlLeftUpPanel.appendChild(edgeTypePanel)
    edgeTypePanel.style.display = 'flex'
    edgeTypePanel.style.justifyContent = 'space-around'
    edgeTypePanel.style.flexWrap = 'nowrap'
    const edgeTypes = [
      {
        name: 'line',
        displayName: '直线',
        icon: lineIcon,
      },
      {
        name: 'polyline',
        displayName: '折线',
        icon: polyLineIcon,
      },
      {
        name: 'bezier',
        displayName: '贝塞尔曲线',
        icon: bezierIcon,
      },
    ]

    edgeTypes.forEach((edgeType) => {
      const edgeItem = document.createElement('div')
      edgeItem.className = 'ql-flow-chart-edge-item'

      const edgeIcon = document.createElement('div')
      edgeIcon.className = `ql-flow-chart-edge-type-icon`
      edgeIcon.style.backgroundImage = `url(${edgeType.icon})`

      edgeItem.appendChild(edgeIcon)

      edgeItem.addEventListener('click', () => {
        const { edges = [] } = blot.flowChart.getSelectElements()
        if (edges.length > 0) {
          edges.forEach((edge) => {
            blot.flowChart.changeEdgeType(edge.id, edgeType.name)
          })
          blot.data = blot.flowChart.getGraphData()
          blot.domNode.setAttribute('data-flow-chart', JSON.stringify(blot.data))
        }

        edgeTypePanel.style.display = 'none'
      })
      edgeTypePanel.appendChild(edgeItem)
    })
  }
  else {
    edgeTypePanel.style.display = 'flex'
    edgeTypePanel.style.justifyContent = 'space-around'
    edgeTypePanel.style.flexWrap = 'nowrap'
  }

  const handleOutsideClick = (e: MouseEvent) => {
    let setEdgeTypeBtn: HTMLElement | null = null
    const controlItems = controlLeftUpPanel.querySelectorAll('.ql-flow-chart-control-item')
    controlItems.forEach((item) => {
      const iconEl = item.querySelector('i')
      if (iconEl && iconEl.className.includes('set-edge-type')) {
        setEdgeTypeBtn = item as HTMLElement
      }
    })
    if (!edgeTypePanel.contains(e.target as Node)
      && (!setEdgeTypeBtn || !setEdgeTypeBtn.contains(e.target as Node))) {
      edgeTypePanel.style.display = 'none'
      document.removeEventListener('click', handleOutsideClick)
    }
  }

  document.removeEventListener('click', handleOutsideClick)
  document.addEventListener('click', handleOutsideClick)
}
function handlePanelStatusBtn(blot: FlowChartPlaceholderBlot): void {
  const control = blot.domNode.querySelector('.ql-flow-chart-control') as HTMLElement | null
  const leftUpControl = blot.domNode.querySelector('.lf-dndpanel') as HTMLElement | null
  const panelStatusIcon = blot.domNode.querySelector('.ql-flow-chart-control-panel-status') as HTMLElement | null
  if (!leftUpControl || !control) return
  const isVisible = leftUpControl.style.display !== 'none' && control.style.display !== 'none'
  if (isVisible) {
    leftUpControl.style.display = 'none'
    control.style.display = 'none'
    if (panelStatusIcon) {
      panelStatusIcon.style.backgroundImage = `url(${contractIcon})`
    }
  }
  else {
    leftUpControl.style.display = 'block'
    control.style.display = 'flex'
    if (panelStatusIcon) {
      panelStatusIcon.style.backgroundImage = `url(${expandIcon})`
    }
  }
}
function handleScreenTypeBtn(blot: FlowChartPlaceholderBlot): void {
  const screenTypeIconElement = document.querySelector('.ql-flow-chart-control-screen-type') as HTMLElement | null
  const flowChartContainer = blot.domNode
  if (!screenTypeIconElement || !flowChartContainer) return
  const isFullscreen = flowChartContainer.style.position === 'fixed'
  if (isFullscreen) {
    const originalPosition = flowChartContainer.getAttribute('data-original-position')
    const originalWidth = flowChartContainer.getAttribute('data-original-width')
    const originalHeight = flowChartContainer.getAttribute('data-original-height')
    if (originalPosition && originalWidth && originalHeight) {
      flowChartContainer.style.position = originalPosition
      flowChartContainer.style.width = originalWidth
      flowChartContainer.style.height = originalHeight
      flowChartContainer.style.zIndex = '0'
    }
    screenTypeIconElement.style.backgroundImage = `url(${fullScreenIcon})`
  }
  else {
    flowChartContainer.setAttribute('data-original-position', flowChartContainer.style.position || '')
    flowChartContainer.setAttribute('data-original-width', flowChartContainer.style.width || '')
    flowChartContainer.setAttribute('data-original-height', flowChartContainer.style.height || '')
    flowChartContainer.style.position = 'fixed'
    flowChartContainer.style.top = '0'
    flowChartContainer.style.left = '0'
    flowChartContainer.style.width = '100vw'
    flowChartContainer.style.height = '100vh'
    flowChartContainer.style.zIndex = '100'
    screenTypeIconElement.style.backgroundImage = `url(${smallScreenIcon})`
  }
  blot.flowChart.resize()
  blot.flowChart.translateCenter()
}

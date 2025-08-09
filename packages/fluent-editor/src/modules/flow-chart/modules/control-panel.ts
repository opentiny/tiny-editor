import type FluentEditor from '../../../core/fluent-editor'
import type FlowChartPlaceholderBlot from '../formats/flow-chart-blot'
import { CHANGE_LANGUAGE_EVENT } from '../../../config'
import { I18N } from '../../../modules/i18n'
import { registerFlowChartI18N } from '../i18n'

class FlowChartControlPanelHandler {
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
      this.updateControlPanelTexts()
      this.updateDndPanelLabels()
    })
    this.initDndPanel()
  }

  resolveTexts() {
    return {
      export: I18N.parserText('flowChart.controlPanel.export', this.lang),
      import: I18N.parserText('flowChart.controlPanel.import', this.lang),
      exportTitle: I18N.parserText('flowChart.controlPanel.exportTitle', this.lang),
      importTitle: I18N.parserText('flowChart.controlPanel.importTitle', this.lang),
      selection: I18N.parserText('flowChart.dndPanel.selection', this.lang),
      rectangle: I18N.parserText('flowChart.dndPanel.rectangle', this.lang),
      circle: I18N.parserText('flowChart.dndPanel.circle', this.lang),
      ellipse: I18N.parserText('flowChart.dndPanel.ellipse', this.lang),
      diamond: I18N.parserText('flowChart.dndPanel.diamond', this.lang),
      zoomOut: I18N.parserText('flowChart.controlPanel.zoomOut', this.lang),
      zoomIn: I18N.parserText('flowChart.controlPanel.zoomIn', this.lang),
      fit: I18N.parserText('flowChart.controlPanel.fit', this.lang),
      back: I18N.parserText('flowChart.controlPanel.back', this.lang),
      forward: I18N.parserText('flowChart.controlPanel.forward', this.lang),
      zoomOutTitle: I18N.parserText('flowChart.controlPanel.zoomOutTitle', this.lang),
      zoomInTitle: I18N.parserText('flowChart.controlPanel.zoomInTitle', this.lang),
      fitTitle: I18N.parserText('flowChart.controlPanel.fitTitle', this.lang),
      backTitle: I18N.parserText('flowChart.controlPanel.backTitle', this.lang),
      forwardTitle: I18N.parserText('flowChart.controlPanel.forwardTitle', this.lang),
    }
  }

  updateControlPanelTexts() {
    const controlItems = this.blot.domNode.querySelectorAll('.flow-chart-control-item')
    controlItems.forEach((item) => {
      const icon = item.querySelector('i')
      if (icon) {
        const iconClass = icon.className.split('-')[3]
        if (this.texts[iconClass]) {
          const textSpan = item.querySelector('.flow-chart-control-text')
          if (textSpan) {
            textSpan.textContent = this.texts[iconClass]
          }
          (item as HTMLElement).title = this.texts[`${iconClass}Title`] || ''
        }
      }
    })
  }

  initDndPanel() {
    if (this.blot.flowChart && this.blot.flowChart.extension.dndPanel) {
      this.updateDndPanelLabels()
    }
  }

  updateDndPanelLabels() {
    if (this.blot.flowChart && this.blot.flowChart.extension.dndPanel) {
      (this.blot.flowChart.extension.dndPanel as any).setPatternItems([
        {
          label: this.texts.selection,
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAASVJREFUOE+1VFEOgjAMpQvcA/9IGGeQo+hJjCdRb6JngCX8yT0gVN5CyUQJzCA/28r62tfXjoKNPwJekiRxGIYx9m3b1lVV1WJbOrs+2FvANE0vQRDkRFT3tnNZlnet9Qm2pTMzx0qpc1EU1zdApdRDjD5VQDKu75jhpoBZlh2YuQZVn+xwd+prM9zys4Ba61zU9AWf+v6nhlOlfLL8qjLSBoiPKEOfPiS4+P4sSg/I6AxjzM5lZAEhfdM0d4zcGrrDWD5nAdfWEDQxakSEuc8B2K+2d4noBtpeKoPmHIM+0NUYcxwBERURJRLK0HXdXs7yKkVRZAVkZjwoyOyIVUo2NvZAY/wB5WH7VtvFGq4Rwr3jAFqaHyr7Agp9rNPO+LkP55J4AUBcASTXtDeAAAAAAElFTkSuQmCC',
          callback: () => {
            (this.blot.flowChart?.extension.selectionSelect as any).openSelectionSelect()
            this.blot.flowChart?.once('selection:selected', () => {
              (this.blot.flowChart?.extension.selectionSelect as any).closeSelectionSelect()
            })
          },
        },
        {
          type: 'rect',
          text: '矩形',
          label: this.texts.rectangle,
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAHNJREFUOE9jZKAyYKSyeQxgAzU0NBRYWFgUKDX8ypUrB8AG6ujo7P///z/ZBjIyMoL0Hrhy5Yoj3ECoQCM5rtTR0akH6ncYNRAcqKNhSFwiGk02kLxM9axH7cLBgbj4xK3qz58/D27cuPGANgUspa5D1g8A3buIFT4kLMIAAAAASUVORK5CYII=',
        },
        {
          type: 'circle',
          text: '圆形',
          label: this.texts.circle,
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAVZJREFUOE+tlFGugjAQRTvAQvCPhLIGdSXiStSV4FuJsAbahD9dSEPtNS0pvOLrS+CHUKZn7kxvh9jGD23MY6tAzvmBMbZnjOF90Fq/bPKWiH6EEG1ITBDIOb+Y4KvW+k5EAHXYTET5OI57s1bjvxDitoT+AnLOHwaUE9F5TUVRFHmapg/ApJQ7HzoDlmXZoLxlUKg0D9pKKc8uZgLaniHrcU3ZEgxolmVPf88EtOpQwpQtxgFoEeKEEMdPn92msiyfSZLc+r6/x4BcDA7QOKB2bfJL1kqp3TAMzh5RXLRKa93MgKFeRNEYY1VV1QAaC33E+QrRizbkrW9wCzyFetjAuO5HrMLlYc5sA+nfDL1MErLazNjLE/tLJZyBNgWNjc3+ldrk6jmocf8J3kL2JEk6TBql1AvrVvU1eji4Mq3aCw7KjjAGsPmG8bt/ja/QnY01/OYT+w3u97wVMeIzNwAAAABJRU5ErkJggg==',
        },
        {
          type: 'ellipse',
          text: '椭圆',
          label: this.texts.ellipse,
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAVxJREFUOE+tlFGOgyAQhgHxHGvfTMA72JPUnmTrSepN7J5BSHxrDwKZOgYMVrfibk2MROCbYeb/oeTDD/0wj0QB8zzPOOeZUuq2lcAq0AFOhJDSvRMHAB7Dv5u1tu77HsezZwGUUn4PKy64iRBSG2MefiMGStO0BICvAVxRShulVB0SZ0ApZQsAGaX0vHU8hCdJ0mJgrfXZQycgZoZRtdaHrTr5eQ8NMw2BQAg5bmX2GszV+26MOWBpRmBRFBUAnJRSx9jswnVYKqw3JjMChRBX/Ia12AN25cpw/wh0nSWvHYuFhgl5IErhuqchYTAhxJ0xVndd14xAX9i/NEVKieJvZ03xx0bZWGuPaw5YO/5b2QTNKWOFzTkfmxmqY+aUwMOXwTENY+wHveu16S8JlBiltEKLvrVe6ADO+XQ5IHRwQ4bzbrzw8MJ6v0kEs8K5f11fsfpbWxd1we4J8ARGasMVX8rnOgAAAABJRU5ErkJggg==',
        },
        {
          type: 'diamond',
          text: '菱形',
          label: this.texts.diamond,
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAjNJREFUOE+t1E2rElEYB/BnbkKCY9FnaHzBOSfaBIEiI1SroE2gGCqKuyAQIXAUTVoFLWx8QXCTXohA0KRNcGklhaC48cyIRNFCUsSP4MzUSF6uqTNyaZbnPM+PM3P+81Dwnx/qGI9lWR9FUSZCyJlRvSGIELoJAF0AoCiKco9Gox96qC7IcZxpuVx2E4nE3dVqBcVi8QshxHNpECH03u/3+zOZzNrIZrPQbrdPCSHhQ+jBE2KMX3k8nueVSmWrNxqNwmAweEEIye9D94Isyz612WylRqMBVqt1q282m0E4HIb5fB4mhJz+i+6ACKGHFovlY71eB4fDsffN+v0+xGIxbc9NCPl6sWgLxBhjVVW7giBc9/l8uglptVqQy+W+K4rikSRpvik+BxmGuWY2m7upVOpWMBg0itt6XxAEqNVqZ39O+WAHxBjf0PLG8zwbCASOAkulElSr1c+iKN7bAbUFl8t1++TkpFsul2mv16uLdjodSKfTP1erlXsymfzaC2qLGONHNE1/0G6YYZi96HA4hEgkAoqieCVJ0v6i82dvbBBCz+x2+xvtpmma3kIXiwWEQiGYTqdRSZLeGsZmU4AQes1xXLJYLG71xONx6PV6L0VRzB4d7E0hxrgZCAQe8zy/Xsrn89BsNt+Jovjk0AfWHQ4Mw1zVopRMJu/IsgyFQqH3dzjIlwK1JqfTaTeZTOvxJcuyezwef9O7fsN5qDUjhO6rqnpFFMVPRgE9CjRCLu7/BivoyhX8YXObAAAAAElFTkSuQmCC',
        },
      ])
    }
  }
}

const controlPanelHandlers = new WeakMap<FlowChartPlaceholderBlot, FlowChartControlPanelHandler>()

const DISABLED_OPACITY = '0.5'
const ENABLED_OPACITY = '1'
export function createControlPanel(blot: FlowChartPlaceholderBlot, quill: FluentEditor): void {
  // 右上的控制面板
  const controlPanel = document.createElement('div')
  controlPanel.className = 'flow-chart-control'
  // 左下的控制面板
  const controlLeftDownPanel = document.createElement('div')
  controlLeftDownPanel.className = 'flow-chart-left-down-control'

  const handler = new FlowChartControlPanelHandler(quill, blot)
  controlPanelHandlers.set(blot, handler)
  const zoomOutBtn = createControlItem('zoomOut', handler.getText('zoomOut'), handler.getText('zoomOutTitle'), () => handleZoomOut(blot))
  const zoomInBtn = createControlItem('zoomIn', handler.getText('zoomIn'), handler.getText('zoomInTitle'), () => handleZoomIn(blot))
  const resetBtn = createControlItem('fit', handler.getText('fit'), handler.getText('fitTitle'), () => handleResetZoom(blot))
  const backBtn = createControlItem('back', handler.getText('back'), handler.getText('backTitle'), () => handleUndo(blot))
  const forwardBtn = createControlItem('forward', handler.getText('forward'), handler.getText('forwardTitle'), () => handleRedo(blot))
  const exportJSON = createControlItem('export', handler.getText('export'), handler.getText('exportTitle'), () => handleExport(blot))
  const importJSON = createControlItem('import', handler.getText('import'), handler.getText('importTitle'), () => handleImport(blot))

  const updateButtonState = (historyData: any) => {
    if (!historyData.data) {
      backBtn.style.opacity = DISABLED_OPACITY
      backBtn.style.cursor = 'not-allowed'
      forwardBtn.style.opacity = DISABLED_OPACITY
      forwardBtn.style.cursor = 'not-allowed'
      return
    }
    const isUndoAvailable = historyData.data.undoAble || historyData.data.undos.length > 0
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

  controlPanel.append(zoomOutBtn, zoomInBtn, resetBtn, backBtn, forwardBtn)
  controlLeftDownPanel.append(exportJSON, importJSON)
  blot.domNode.appendChild(controlPanel)
  blot.domNode.appendChild(controlLeftDownPanel)
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

function createControlItem(iconClass: string, text: string, title: string, onClick: () => void, disabled = false) {
  const controlItem = document.createElement('div')
  controlItem.className = 'flow-chart-control-item'
  controlItem.title = title
  controlItem.style.cursor = disabled ? 'not-allowed' : 'pointer'

  const icon = document.createElement('i')
  icon.className = `flow-chart-control-${iconClass}`
  const textSpan = document.createElement('span')
  textSpan.className = 'flow-chart-control-text'
  textSpan.textContent = text

  controlItem.appendChild(icon)
  controlItem.appendChild(textSpan)

  if (!disabled) {
    controlItem.addEventListener('click', onClick)
  }

  return controlItem
}

function handleExport(blot: FlowChartPlaceholderBlot): void {
  if (blot.flowChart) {
    const data = blot.flowChart.getGraphData()
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '流程图.json'
    a.click()
    URL.revokeObjectURL(url)
  }
}

function handleImport(blot: FlowChartPlaceholderBlot): void {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = '.json'
  fileInput.style.display = 'none'

  fileInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string)
        if (blot.flowChart) {
          blot.flowChart.render(jsonData)
          blot.data = jsonData
          blot.domNode.setAttribute('data-flow-chart', JSON.stringify(jsonData))
          blot.scroll.update([], {})
        }
      }
      catch (error) {
        alert('文件解析错误，请确保选择的是有效的JSON文件')
      }
    }
    reader.readAsText(file)
  })

  document.body.appendChild(fileInput)
  fileInput.click()
  document.body.removeChild(fileInput)
}

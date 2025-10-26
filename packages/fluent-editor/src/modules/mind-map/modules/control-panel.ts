import type FluentEditor from '../../../core/fluent-editor'
import type MindMapPlaceholderBlot from '../formats/mind-map-blot'
import { nodeIconList } from 'simple-mind-map/src/svg/icons'
import { CHANGE_LANGUAGE_EVENT } from '../../../config'
import { I18N } from '../../../modules/i18n'
import { registerMindMapI18N } from '../i18n'
import { backIcon, catalogOrganizationIcon, contractIcon, fishboneIcon, fitIcon, forwardIcon, insertChildNodeIcon, insertIconIcon, insertNodeIcon, insertParentNodeIcon, logicalStructureIcon, mindMapIcon, organizationStructureIcon, removeNodeIcon, screenReduceIcon, screenTypeIcon, setLayoutIcon, timelineIcon, zoomInIcon, zoomOutIcon } from '../icons'

class MindMapControlPanelHandler {
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
      this.updateControlPanelTexts()
    })
  }

  resolveTexts() {
    const textKeys = [
      'zoomOutTitle',
      'zoomInTitle',
      'fitTitle',
      'backTitle',
      'forwardTitle',
      'inserChildNodeTitle',
      'inserNodeTitle',
      'insertIconTitle',
      'inserParentNodeTitle',
      'removeNodeTitle',
      'setLayoutTitle',
      'logicalStructureLayout',
      'catalogOrganizationLayout',
      'mindMapLayout',
      'organizationStructureLayout',
      'timelineLayout',
      'fishboneLayout',
      'panelStatusTitle',
      'screenTypeTitle',
    ]

    return textKeys.reduce((acc, key) => {
      if (!key.includes('Title')) {
        acc[key] = I18N.parserText(`mindMap.layout.${key.replace('Layout', '')}`, this.lang)
      }
      else {
        acc[key] = I18N.parserText(`mindMap.controlPanel.${key}`, this.lang)
      }
      return acc
    }, {} as Record<string, string>)
  }

  updateControlPanelTexts() {
    const controlItems = this.blot.domNode.querySelectorAll('.ql-mind-map-control-item')

    const controlItemMap: Record<string, string> = {
      'zoom-out': 'zoomOutTitle',
      'zoom-in': 'zoomInTitle',
      'fit': 'fitTitle',
      'back': 'backTitle',
      'forward': 'forwardTitle',
      'insert-child-node': 'inserChildNodeTitle',
      'insert-node': 'inserNodeTitle',
      'insert-icon': 'insertIconTitle',
      'insert-parent-node': 'inserParentNodeTitle',
      'remove-node': 'removeNodeTitle',
      'set-layout-icon': 'setLayoutTitle',
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

const controlPanelHandlers = new WeakMap<MindMapPlaceholderBlot, MindMapControlPanelHandler>()

const DISABLED_OPACITY = '0.5'
const ENABLED_OPACITY = '1'
export function createControlPanel(blot: MindMapPlaceholderBlot, quill: FluentEditor): void {
  let isStart = true
  let isEnd = true
  let selectedNodes: any[] = []
  blot.mindMap.on('node_active', (...args: unknown[]) => {
    selectedNodes = Array.isArray(args[1]) ? args[1] : []
  })
  // 中间的控制面板
  const controlPanel = document.createElement('div')
  controlPanel.className = 'ql-mind-map-control'
  // 右上的控制面板
  const controlRightUpPanel = document.createElement('div')
  controlRightUpPanel.className = 'ql-mind-map-right-up-control'
  // 左上的控制面板
  const controlLeftUpPanel = document.createElement('div')
  controlLeftUpPanel.className = 'ql-mind-map-left-up-control'

  const handler = new MindMapControlPanelHandler(quill, blot)
  controlPanelHandlers.set(blot, handler)

  const zoomOutBtn = createControlItem('zoom-out', handler.getText('zoomOutTitle'), () => handleZoomOut(blot))
  const zoomInBtn = createControlItem('zoom-in', handler.getText('zoomInTitle'), () => handleZoomIn(blot))
  const resetBtn = createControlItem('fit', handler.getText('fitTitle'), () => handleResetZoom(blot))
  const backBtn = createControlItem('back', handler.getText('backTitle'), () => {
    if (!isStart) {
      blot.mindMap.execCommand('BACK')
    }
  })
  const forwardBtn = createControlItem('forward', handler.getText('forwardTitle'), () => {
    if (!isEnd) {
      blot.mindMap.execCommand('FORWARD')
    }
  })
  const insertChildNode = createControlItem('insert-child-node', handler.getText('inserChildNodeTitle'), () => handleInsertChildNode(blot))
  const insertNode = createControlItem('insert-node', handler.getText('inserNodeTitle'), () => handleInsertNode(blot))
  const insertParentNode = createControlItem('insert-parent-node', handler.getText('inserParentNodeTitle'), () => handleInsertParentNode(blot))
  const removeNode = createControlItem('remove-node', handler.getText('removeNodeTitle'), () => handleRemoveNode(blot))
  const insertIconBtn = createControlItem('insert-icon', handler.getText('insertIconTitle'), () => handleInsertIcon(blot, selectedNodes))
  const setLayoutBtn = createControlItem('set-layout-icon', handler.getText('setLayoutTitle'), () => handleSetLayoutBtn(blot))
  const panelStatusBtn = createControlItem('panel-status', handler.getText('panelStatusTitle'))
  const screenTypeBtn = createControlItem('screen-type', handler.getText('screenTypeTitle'), () => handleScreenTypeBtn(blot))
  const updateButtonState = (index: number, len: number) => {
    isStart = index <= 0
    isEnd = index >= len - 1
    backBtn.style.cursor = isStart ? 'not-allowed' : 'pointer'
    backBtn.style.opacity = isStart ? DISABLED_OPACITY : ENABLED_OPACITY
    forwardBtn.style.cursor = isEnd ? 'not-allowed' : 'pointer'
    forwardBtn.style.opacity = isEnd ? DISABLED_OPACITY : ENABLED_OPACITY
  }

  blot.mindMap.on('back_forward', (index: number, len: number) => {
    updateButtonState(index, len)
  })
  controlPanel.append(zoomOutBtn, zoomInBtn, resetBtn, screenTypeBtn, backBtn, forwardBtn)
  blot.domNode.appendChild(controlPanel)
  controlRightUpPanel.append(panelStatusBtn)
  blot.domNode.appendChild(controlRightUpPanel)
  controlLeftUpPanel.append(insertChildNode, insertNode, insertParentNode, removeNode, insertIconBtn, setLayoutBtn)
  blot.domNode.appendChild(controlLeftUpPanel)
}

function createControlItem(iconClass: string, title: string, onClick?: () => void, disabled = false) {
  const controlItem = document.createElement('div')
  controlItem.className = 'ql-mind-map-control-item'
  controlItem.title = title
  controlItem.dataset.controlType = iconClass
  controlItem.style.cursor = disabled ? 'not-allowed' : 'pointer'
  controlItem.style.opacity = disabled ? DISABLED_OPACITY : ENABLED_OPACITY

  const iconMap: Record<string, string> = {
    'back': backIcon,
    'forward': forwardIcon,
    'zoom-out': zoomOutIcon,
    'zoom-in': zoomInIcon,
    'fit': fitIcon,
    'insert-child-node': insertChildNodeIcon,
    'insert-node': insertNodeIcon,
    'insert-parent-node': insertParentNodeIcon,
    'remove-node': removeNodeIcon,
    'insert-icon': insertIconIcon,
    'set-layout-icon': setLayoutIcon,
    'screen-type': screenTypeIcon,
    'panel-status': contractIcon,
  }

  const icon = document.createElement('i')
  icon.innerHTML = iconMap[iconClass] || ''
  controlItem.appendChild(icon)

  if (!disabled) {
    controlItem.addEventListener('click', onClick)
  }

  return controlItem
}

function handleInsertChildNode(blot: MindMapPlaceholderBlot): void {
  blot.mindMap.execCommand('INSERT_CHILD_NODE')
}

function handleInsertNode(blot: MindMapPlaceholderBlot): void {
  blot.mindMap.execCommand('INSERT_NODE')
}

function handleInsertParentNode(blot: MindMapPlaceholderBlot): void {
  blot.mindMap.execCommand('INSERT_PARENT_NODE')
}

function handleRemoveNode(blot: MindMapPlaceholderBlot): void {
  blot.mindMap.execCommand('REMOVE_CURRENT_NODE')
}

function handleZoomIn(blot: MindMapPlaceholderBlot): void {
  if (blot.mindMap && blot.mindMap.view) {
    const containerRect = blot.mindMap.el.getBoundingClientRect()
    const cx = containerRect.width / 2
    const cy = containerRect.height / 2
    blot.mindMap.view.enlarge(cx, cy, false)
    blot.zoomCount++
  }
}

function handleZoomOut(blot: MindMapPlaceholderBlot): void {
  if (blot.mindMap && blot.mindMap.view) {
    const containerRect = blot.mindMap.el.getBoundingClientRect()
    const cx = containerRect.width / 2
    const cy = containerRect.height / 2
    blot.mindMap.view.narrow(cx, cy, false)
    blot.zoomCount--
  }
}

function handleResetZoom(blot: MindMapPlaceholderBlot): void {
  blot.mindMap.renderer.setRootNodeCenter()
  if (!blot.mindMap || !blot.mindMap.view || blot.zoomCount === 0) return
  const containerRect = blot.mindMap.el.getBoundingClientRect()
  const centerX = containerRect.width / 2
  const centerY = containerRect.height / 2
  const operationCount = Math.abs(blot.zoomCount)
  const isEnlarge = blot.zoomCount < 0
  for (let i = 0; i < operationCount; i++) {
    if (isEnlarge) {
      blot.mindMap.view.enlarge(centerX, centerY, false)
    }
    else {
      blot.mindMap.view.narrow(centerX, centerY, false)
    }
  }
  blot.zoomCount = 0
}

function handleInsertIcon(blot: MindMapPlaceholderBlot, selectedNodes: any[]): void {
  (blot as any).selectedNodes = selectedNodes
  const heightStr = blot.domNode.getAttribute('height') || '500px'
  const height = Number.parseInt(heightStr.replace(/[^\d.]/g, ''), 10) || 500
  let iconList = []
  iconList = nodeIconList
  const leftUpControl = blot.domNode.querySelector('.ql-mind-map-left-up-control') as HTMLElement
  let iconPanel = leftUpControl.querySelector('.ql-mind-map-icon-panel') as HTMLElement
  if (!iconPanel) {
    iconPanel = document.createElement('div')
    iconPanel.className = 'ql-mind-map-icon-panel'

    iconList.forEach((group) => {
      const groupContainer = document.createElement('div')
      groupContainer.className = 'ql-mind-map-icon-group-container'

      group.list.forEach((icon: { icon: string, name: string }) => {
        const iconItem = document.createElement('div')
        iconItem.className = 'ql-mind-map-icon-item'
        iconItem.innerHTML = icon.icon

        iconItem.addEventListener('click', () => {
          const currentSelectedNodes = (blot as any).selectedNodes || []
          if (currentSelectedNodes.length > 0) {
            const node = currentSelectedNodes[0]

            if (node.getData('icon') && node.getData('icon')[0] === `${group.type}_${icon.name}`) {
              node.setIcon([])
            }
            else {
              node.setIcon([`${group.type}_${icon.name}`])
            }
            blot.data = blot.mindMap.getData({})
            blot.domNode.setAttribute('data-mind-map', JSON.stringify(blot.data))
          }
          iconPanel.style.display = 'none'
        })
        groupContainer.appendChild(iconItem)
      })
      iconPanel.appendChild(groupContainer)
    })
    if (height < 395) {
      iconPanel.style.height = `${height - 130}px`
    }
    else {
      iconPanel.style.height = '270px'
    }
    leftUpControl.appendChild(iconPanel)
  }
  else {
    if (height < 395) {
      iconPanel.style.height = `${height - 130}px`
    }
    else {
      iconPanel.style.height = '270px'
    }
    iconPanel.style.display = 'block'
  }

  const handleOutsideClick = (e: MouseEvent) => {
    let insertIconBtn: HTMLElement | null = null
    const controlItems = leftUpControl.querySelectorAll('.ql-mind-map-control-item')

    controlItems.forEach((item) => {
      if ((item as HTMLElement).dataset.controlType === 'insert-icon') {
        insertIconBtn = item as HTMLElement
      }
    })

    if (!iconPanel.contains(e.target as Node) && (!insertIconBtn || !insertIconBtn.contains(e.target as Node))) {
      iconPanel.style.display = 'none'
      document.removeEventListener('click', handleOutsideClick)
    }
  }
  document.removeEventListener('click', handleOutsideClick)
  document.addEventListener('click', handleOutsideClick)
}

function handleSetLayoutBtn(blot: MindMapPlaceholderBlot): void {
  const handler = controlPanelHandlers.get(blot)
  const leftUpControl = blot.domNode.querySelector('.ql-mind-map-left-up-control') as HTMLElement
  let layoutPanel = leftUpControl.querySelector('.ql-mind-map-layout-panel') as HTMLElement
  const heightStr = blot.domNode.getAttribute('height') || '500'
  const height = Number.parseInt(heightStr.replace(/[^\d.]/g, ''), 10) || 500

  if (!layoutPanel) {
    layoutPanel = document.createElement('div')
    layoutPanel.className = 'ql-mind-map-layout-panel'

    const layouts = [
      {
        name: 'logicalStructure',
        displayName: handler?.getText('logicalStructureLayout'),
        icon: logicalStructureIcon,
      },
      {
        name: 'catalogOrganization',
        displayName: handler?.getText('catalogOrganizationLayout'),
        icon: catalogOrganizationIcon,
      },
      {
        name: 'mindMap',
        displayName: handler?.getText('mindMapLayout'),
        icon: mindMapIcon,
      },
      {
        name: 'organizationStructure',
        displayName: handler?.getText('organizationStructureLayout'),
        icon: organizationStructureIcon,
      },
      {
        name: 'timeline',
        displayName: handler?.getText('timelineLayout'),
        icon: timelineIcon,
      },
      {
        name: 'fishbone',
        displayName: handler?.getText('fishboneLayout'),
        icon: fishboneIcon,
      },
    ]

    layouts.forEach((layout) => {
      const layoutItem = document.createElement('div')
      layoutItem.className = 'ql-mind-map-layout-item'

      const iconContainer = document.createElement('div')
      iconContainer.className = 'ql-mind-map-layout-icon-container'

      const img = document.createElement('div')
      img.className = 'ql-mind-map-layout-icon'
      img.innerHTML = layout.icon
      img.style.display = 'flex'
      img.style.alignItems = 'center'
      img.style.justifyContent = 'center'
      const svgElement = img.querySelector('svg')

      svgElement.style.maxWidth = '100%'
      svgElement.style.maxHeight = '100%'
      svgElement.style.width = 'auto'
      svgElement.style.height = 'auto'
      svgElement.removeAttribute('width')
      svgElement.removeAttribute('height')

      iconContainer.appendChild(img)

      const nameText = document.createElement('div')
      nameText.className = 'ql-mind-map-layout-name'
      nameText.textContent = layout.displayName

      layoutItem.appendChild(iconContainer)
      layoutItem.appendChild(nameText)
      layoutItem.addEventListener('click', () => {
        blot.mindMap.setLayout(layout.name)
        blot.data = blot.mindMap.getData({})
        blot.domNode.setAttribute('data-mind-map', JSON.stringify(blot.data))
        layoutPanel.style.display = 'none'
      })
      layoutPanel.appendChild(layoutItem)
    })
    leftUpControl.appendChild(layoutPanel)
    if (height < 395) {
      layoutPanel.style.height = `${height - 130}px`
    }
    else {
      layoutPanel.style.height = '270px'
    }
  }
  else {
    if (height < 395) {
      layoutPanel.style.height = `${height - 130}px`
    }
    else {
      layoutPanel.style.height = '270px'
    }
    layoutPanel.style.display = 'flex'
  }

  const handleOutsideClick = (e: MouseEvent) => {
    let setLayoutBtn: HTMLElement | null = null
    const controlItems = leftUpControl.querySelectorAll('.ql-mind-map-control-item')

    setLayoutBtn = Array.from(controlItems).find(item => item.getAttribute('data-control-type') === 'set-layout-icon') as HTMLElement | null

    if (!layoutPanel.contains(e.target as Node) && (!setLayoutBtn || !setLayoutBtn.contains(e.target as Node))) {
      layoutPanel.style.display = 'none'
      document.removeEventListener('click', handleOutsideClick)
    }
  }
  document.removeEventListener('click', handleOutsideClick)
  document.addEventListener('click', handleOutsideClick)
}

function handleScreenTypeBtn(blot: MindMapPlaceholderBlot): void {
  const screenTypeBtn = blot.domNode.querySelector('[data-control-type="screen-type"]') as HTMLElement | null
  if (!screenTypeBtn || !blot.domNode) return

  const mindMapContainer = blot.domNode
  const isFullscreen = mindMapContainer.style.position === 'fixed'

  if (isFullscreen) {
    const originalPosition = mindMapContainer.getAttribute('data-original-position')
    const originalWidth = mindMapContainer.getAttribute('data-original-width')
    const originalHeight = mindMapContainer.getAttribute('data-original-height')
    if (originalWidth && originalHeight) {
      mindMapContainer.style.position = originalPosition
      mindMapContainer.style.width = originalWidth
      mindMapContainer.style.height = originalHeight
      mindMapContainer.style.zIndex = '0'
    }
    const iconElement = screenTypeBtn.querySelector('i')
    if (iconElement) {
      iconElement.innerHTML = screenTypeIcon
    }
  }
  else {
    mindMapContainer.setAttribute('data-original-position', mindMapContainer.style.position || '')
    mindMapContainer.setAttribute('data-original-width', mindMapContainer.style.width || '')
    mindMapContainer.setAttribute('data-original-height', mindMapContainer.style.height || '')
    mindMapContainer.style.position = 'fixed'
    mindMapContainer.style.top = '0'
    mindMapContainer.style.left = '0'
    mindMapContainer.style.width = '100vw'
    mindMapContainer.style.height = '100vh'
    mindMapContainer.style.zIndex = '100'
    const iconElement = screenTypeBtn.querySelector('i')
    if (iconElement) {
      iconElement.innerHTML = screenReduceIcon
    }
  }
  blot.mindMap.renderer.setRootNodeCenter()
  blot.mindMap.resize()
}

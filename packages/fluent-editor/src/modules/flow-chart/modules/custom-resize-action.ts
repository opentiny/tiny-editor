const MIN_WIDTH = 350
const MIN_HEIGHT = 290

export class FlowChartResizeAction {
  topLeftHandle: HTMLElement
  topRightHandle: HTMLElement
  bottomRightHandle: HTMLElement
  bottomLeftHandle: HTMLElement
  dragHandle: HTMLElement | null = null
  dragStartX: number = 0
  dragStartY: number = 0
  preDragWidth: number = 0
  preDragHeight: number = 0
  targetRatio: number = 0
  blot: any

  constructor(blot: any) {
    this.blot = blot
    this.topLeftHandle = this.createHandle('top-left', 'nwse-resize')
    this.topRightHandle = this.createHandle('top-right', 'nesw-resize')
    this.bottomRightHandle = this.createHandle('bottom-right', 'nwse-resize')
    this.bottomLeftHandle = this.createHandle('bottom-left', 'nesw-resize')
    this.init()
  }

  isFullscreen(): boolean {
    const container = this.blot.domNode
    return container.style.position === 'fixed' && container.style.width === '100vw' && container.style.height === '100vh'
  }

  init() {
    const container = this.blot.domNode
    container.style.position = 'relative'
    container.appendChild(this.topLeftHandle)
    container.appendChild(this.topRightHandle)
    container.appendChild(this.bottomRightHandle)
    container.appendChild(this.bottomLeftHandle)
    this.repositionHandles()
  }

  createHandle(position: string, cursor: string): HTMLElement {
    const box = document.createElement('div')
    box.classList.add('ql-flow-chart-resize-handle')
    box.setAttribute('data-position', position)
    Object.assign(box.style, {
      cursor,
      position: 'absolute',
      width: '10px',
      height: '10px',
      background: '#4285f4',
      border: '1px solid white',
      borderRadius: '50%',
      zIndex: '99',
      userSelect: 'none',
    })
    box.addEventListener('mousedown', this.onMouseDown.bind(this))
    return box
  }

  repositionHandles() {
    const container = this.blot.domNode
    const rect = container.getBoundingClientRect()

    Object.assign(this.topLeftHandle.style, {
      left: '-5px',
      top: '-5px',
    })
    Object.assign(this.topRightHandle.style, {
      right: '-5px',
      top: '-5px',
    })
    Object.assign(this.bottomRightHandle.style, {
      right: '-5px',
      bottom: '-5px',
    })
    Object.assign(this.bottomLeftHandle.style, {
      left: '-5px',
      bottom: '-5px',
    })
  }

  onMouseDown(event: MouseEvent) {
    if (this.isFullscreen()) {
      return
    }
    if (!(event.target instanceof HTMLElement)) {
      return
    }

    this.dragHandle = event.target
    document.body.style.cursor = this.dragHandle.style.cursor

    const container = this.blot.domNode
    const rect = container.getBoundingClientRect()

    this.dragStartX = event.clientX
    this.dragStartY = event.clientY
    this.preDragWidth = rect.width
    this.preDragHeight = rect.height
    this.targetRatio = rect.height / rect.width

    event.preventDefault()
    document.addEventListener('mousemove', this.onDrag.bind(this))
    document.addEventListener('mouseup', this.onMouseUp.bind(this))
  }

  onDrag(event: MouseEvent) {
    if (!this.dragHandle) return

    const container = this.blot.domNode
    let newWidth = this.preDragWidth
    let newHeight = this.preDragHeight

    const deltaX = event.clientX - this.dragStartX
    const deltaY = event.clientY - this.dragStartY

    switch (this.dragHandle.dataset.position) {
      case 'top-left':
        newWidth = Math.max(MIN_WIDTH, this.preDragWidth - deltaX)
        newHeight = Math.max(MIN_HEIGHT, this.preDragHeight - deltaY)
        break
      case 'top-right':
        newWidth = Math.max(MIN_WIDTH, this.preDragWidth + deltaX)
        newHeight = Math.max(MIN_HEIGHT, this.preDragHeight - deltaY)
        break
      case 'bottom-right':
        newWidth = Math.max(MIN_WIDTH, this.preDragWidth + deltaX)
        newHeight = Math.max(MIN_HEIGHT, this.preDragHeight + deltaY)
        break
      case 'bottom-left':
        newWidth = Math.max(MIN_WIDTH, this.preDragWidth - deltaX)
        newHeight = Math.max(MIN_HEIGHT, this.preDragHeight + deltaY)
        break
    }

    container.style.width = `${newWidth}px`
    container.style.height = `${newHeight}px`
    container.setAttribute('width', String(newWidth))
    container.setAttribute('height', String(newHeight))

    if (this.blot.flowChart) {
      this.blot.flowChart.resize(newWidth, newHeight)
    }

    this.blot.data.width = newWidth
    this.blot.data.height = newHeight
    container.setAttribute('data-flow-chart', JSON.stringify(this.blot.data))
  }

  onMouseUp() {
    document.body.style.cursor = ''
    document.removeEventListener('mousemove', this.onDrag.bind(this))
    document.removeEventListener('mouseup', this.onMouseUp.bind(this))
    this.dragHandle = null
  }

  destroy() {
    const container = this.blot.domNode
    container.removeChild(this.topLeftHandle)
    container.removeChild(this.topRightHandle)
    container.removeChild(this.bottomRightHandle)
    container.removeChild(this.bottomLeftHandle)
  }
}

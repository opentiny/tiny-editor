import type { Root } from 'parchment'
import type { BlockEmbed as TypeBlockEmbed } from 'quill/blots/block'
import type FluentEditor from '../../../core/fluent-editor'
import LogicFlow from '@logicflow/core'
import { DndPanel, SelectionSelect } from '@logicflow/extension'
import Quill from 'quill'
import { initContextMenu } from '../modules/context-menu'
import { createControlPanel } from '../modules/control-panel'
import '../style/flow-chart.scss'

const BlockEmbed = Quill.import('blots/embed') as typeof TypeBlockEmbed

class FlowChartPlaceholderBlot extends BlockEmbed {
  static blotName = 'flow-chart-placeholder'
  static tagName = 'div'
  static className = 'ql-flow-chart'
  flowChart: LogicFlow | null = null
  data: any
  contextMenu: HTMLElement | null = null
  currentElement: any = null

  constructor(scroll: Root, domNode: HTMLElement) {
    super(scroll, domNode)
    this.domNode.classList.add('ql-flow-chart-container')
    this.domNode.style.height = '500px'
    this.domNode.style.border = '1px solid #e8e8e8'
    this.data = FlowChartPlaceholderBlot.value(this.domNode)
    this.initFlowChart()
  }

  static value(domNode: HTMLElement): any {
    const dataStr = JSON.parse(domNode.getAttribute('data-flow-chart'))
    return dataStr.root ? dataStr.root : dataStr
  }

  static create(value: any): HTMLElement {
    const node = super.create() as HTMLElement
    if (value) {
      node.setAttribute('data-flow-chart', JSON.stringify(value))
    }
    return node
  }

  initFlowChart(): void {
    if (this.domNode.isConnected) {
      this.insertFlowChartEditor()
    }
    else {
      const observer = new MutationObserver(() => {
        if (this.domNode.isConnected) {
          this.insertFlowChartEditor()
          observer.disconnect()
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
    }
  }

  insertFlowChartEditor(): void {
    this.domNode.style.width = '100%'
    this.domNode.style.height = '100%'
    this.flowChart = new LogicFlow({
      container: this.domNode,
      stopScrollGraph: true,
      stopZoomGraph: true,
      allowResize: true,
      allowRotate: true,
      editable: true,
      height: 500,
      grid: {
        type: 'dot',
        size: 20,
      },
      plugins: [DndPanel, SelectionSelect],
    })
    const quill = this.scroll as unknown as FluentEditor
    createControlPanel(this, quill) // 创建控制面板
    initContextMenu(this, quill) // 初始化右键菜单
    this.flowChart.render(this.data)
    this.flowChart.on('graph:updated', () => {
      this.data = this.flowChart.getGraphData()
      this.domNode.setAttribute('data-flow-chart', JSON.stringify(this.data))
      this.scroll.update([], {})
    })
    this.flowChart.on('history:change', () => {
      this.data = this.flowChart.getGraphData()
      this.domNode.setAttribute('data-flow-chart', JSON.stringify(this.data))
      this.scroll.update([], {})
    })
    this.flowChart.on('node:dbclick', this.handleNodeDblClick.bind(this))
    this.flowChart.on('edge:dbclick', this.handleNodeDblClick.bind(this))
  }

  // 处理节点双击事件
  handleNodeDblClick(event: any) {
    const { data, position, e } = event
    if (data && data.id) {
      this.createEditInput(data, position, e)
    }
  }

  // 创建编辑输入框
  createEditInput(nodeData: any, position: any, e: any) {
    const timer = setInterval(() => {
      const textInput = document.querySelector('.lf-text-input') as HTMLElement | null
      if (textInput) {
        const existingInput = document.querySelector('.lf-text-input')
        if (existingInput) {
          existingInput.remove()
        }
        clearInterval(timer)
      }
    }, 10)

    const input = document.createElement('textarea')
    input.className = 'lf-node-edit-input'
    input.value = nodeData.text?.value || ''

    Object.assign(input.style, {
      position: 'absolute',
      boxSizing: 'border-box',
      width: '100px',
      height: '35px',
      padding: '5px',
      lineHeight: '1.2',
      whiteSpace: 'pre',
      textAlign: 'center',
      background: '#fff',
      border: '1px solid #edefed',
      borderRadius: '3px',
      outline: 'none',
      transform: 'translate(-50%, -50%)',
      resize: 'none',
      zIndex: '1000',
      left: `${e.pageX}px`,
      top: `${e.pageY}px`,
      overflow: 'hidden',
    })

    document.body.appendChild(input)

    input.focus()

    this.flowChart.on('blank:mousedown', () => {
      this.flowChart.updateText(nodeData.id, input.value)
      input.remove()
    })

    this.flowChart.on('node:click', () => {
      this.flowChart.updateText(nodeData.id, input.value)
      input.remove()
    })

    this.flowChart.on('edge:click', () => {
      this.flowChart.updateText(nodeData.id, input.value)
      input.remove()
    })

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.flowChart.updateText(nodeData.id, input.value)
        input.remove()
      }
    })
  }

  updateText(nodeId: string, text: string) {
    this.flowChart.updateNode(nodeId, {
      text: { value: text },
    })
  }

  destroyFlowChart() {
    if (this.flowChart) {
      this.flowChart.destroy()
      this.flowChart = null
    }
    const editInputs = document.querySelectorAll('.lf-node-edit-input')
    editInputs.forEach(input => input.remove())
  }

  remove() {
    this.destroyFlowChart()
    super.remove()
  }
}

Quill.register(FlowChartPlaceholderBlot)

export default FlowChartPlaceholderBlot

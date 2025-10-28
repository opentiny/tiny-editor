import type Quill from 'quill'
import type { FlowChartOptions } from './options'
import Quills from 'quill'
import FlowChartPlaceholderBlot from './formats/flow-chart-blot'

export class FlowChartModule {
  quill: Quill
  toolbar: any
  options: FlowChartOptions

  static register() {
    Quills.register('formats/flow-chart', FlowChartPlaceholderBlot, true)
  }

  constructor(quill: Quill, options: any) {
    (quill.container as any).__quillInstance = quill
    this.quill = quill
    this.options = options
    this.toolbar = quill.getModule('toolbar')
    if (this.toolbar) {
      this.toolbar.addHandler('flow-chart', () => {
        this.insertFlowChartEditor()
      })
    }
  }

  public insertFlowChartEditor(): void {
    const range = this.quill.getSelection()
    if (range) {
      const defaultData = {
        nodes: [
          { id: 'node1', type: 'rect', x: 100, y: 150, text: '开始' },
          { id: 'node2', type: 'rect', x: 300, y: 150, text: '结束' },
        ],
        edges: [
          { id: 'edge1', sourceNodeId: 'node1', targetNodeId: 'node2', type: 'polyline' },
        ],
      }
      this.quill.insertText(range.index, '\n', 'user')
      this.quill.insertEmbed(range.index + 1, 'flow-chart', defaultData, 'user')
      this.quill.insertText(range.index + 2, '\n', 'user')
    }
  }
}

import type Quill from 'quill'
import type { MindMapOptions } from './options'
import Quills from 'quill'
import MindMapPlaceholderBlot from './formats/mind-map-blot'

export class MindMapModule {
  quill: Quill
  toolbar: any
  options: MindMapOptions

  static register() {
    Quills.register('formats/mind-map-placeholder', MindMapPlaceholderBlot, true)
  }

  constructor(quill: Quill, options: any) {
    (quill.container as any).__quillInstance = quill
    this.quill = quill
    this.options = options
    this.toolbar = quill.getModule('toolbar')
    if (this.toolbar) {
      this.toolbar.addHandler('mind-map', () => {
        this.insertMindMapEditor()
      })
    }
    const toolbarContainer = this.toolbar?.container
      || document.querySelector('.ql-toolbar')
    if (toolbarContainer) {
      toolbarContainer.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        const flowChartButton = target.closest('.ql-mind-map')
        if (flowChartButton) {
          event.preventDefault()
          this.insertMindMapEditor()
        }
      })
    }
  }

  public insertMindMapEditor(): void {
    const range = this.quill.getSelection()
    if (range) {
      const defaultData = {
        data: {
          text: '根节点',
          expand: true,
          uid: '36bae545-da0b-4c08-be14-ff05f7f05d0a',
          isActive: false,
        },
        children: [
          {
            data: {
              text: '二级节点',
              uid: 'ef0895d2-b5cc-4214-b0ee-e29f8f02420d',
              expand: true,
              richText: false,
              isActive: false,
            },
            children: [],
          },
        ],
        smmVersion: '0.14.0-fix.1',
      }
      this.quill.insertText(range.index, '\n', 'user')
      this.quill.insertEmbed(range.index + 1, 'mind-map-placeholder', defaultData, 'user')
      this.quill.insertText(range.index + 2, '\n', 'user')
    }
  }
}

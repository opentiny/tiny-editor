import type Quill from 'quill'
import './formats/mind-blot'

export class MindModule {
  quill: Quill
  toolbar: any
  mmContainer: HTMLElement | null = null
  mm: any = null
  tempDiv: HTMLElement | null = null

  constructor(quill: Quill, options: any) {
    this.quill = quill
    this.toolbar = quill.getModule('toolbar')
    const domNode = document.querySelector('.ql-mind')

    if (domNode) {
      domNode.addEventListener('click', () => {
        this.insertMindMapEditor()
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
      this.quill.insertEmbed(range.index, 'mindmap-placeholder', defaultData, 'user')
      this.quill.setSelection(range.index + 1, 0)
    }
  }
}

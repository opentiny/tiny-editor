import Quill from 'quill'
import { MathliveBlot } from './formats'
import { MathliveTooltip } from './tooltip'

export class MathliveModule {
  tooltip: MathliveTooltip
  static register() {
    Quill.register({ [`formats/${MathliveBlot.blotName}`]: MathliveBlot }, true)
  }

  constructor(public quill: Quill) {
    this.tooltip = new MathliveTooltip(quill)

    this.quill.root.addEventListener(
      'click',
      (e: MouseEvent) => {
        if (!this.quill.isEnabled()) return
        const path = e.composedPath() as HTMLElement[]
        if (!path || path.length <= 0) return

        const mathliveNode = path.find(node => node.tagName && node.tagName.toUpperCase() === MathliveBlot.tagName.toUpperCase() && node.classList.contains(MathliveBlot.className))
        const mathliveBlot = Quill.find(mathliveNode) as MathliveBlot | null
        if (mathliveBlot) {
          const { value, mode } = MathliveBlot.value(mathliveBlot.domNode)
          if (mode === 'dialog') {
            this.createDialog(value)
          }
        }
      },
      true,
    )
  }

  createDialog(value?: string) {
    this.tooltip.edit(value)
  }
}

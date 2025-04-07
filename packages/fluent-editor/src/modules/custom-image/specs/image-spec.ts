import { BlotSpec } from './blot-spec'

export class ImageSpec extends BlotSpec {
  img: HTMLImageElement | null = null

  init() {
    this.formatter.quill.root.addEventListener('click', this.onClick)
  }

  getTargetElement() {
    return this.img
  }

  onHide() {
    this.img = null
  }

  onClick = (event: MouseEvent) => {
    const el = event.target
    if (!(el instanceof HTMLElement) || el.tagName !== 'IMG') {
      return
    }
    event.stopPropagation()

    this.img = el as HTMLImageElement
    this.formatter.show(this)
  }
}

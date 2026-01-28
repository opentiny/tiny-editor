/**
 * 图片预览模态框
 * 提供图片双击时的预览功能，包括遮罩层和全屏预览
 */

export class ImagePreviewModal {
  private modal: HTMLElement | null = null
  private overlay: HTMLElement | null = null
  private previewImage: HTMLImageElement | null = null

  constructor() {
    this.initModal()
  }

  private initModal() {
    // 创建遮罩层
    this.overlay = document.createElement('div')
    this.overlay.className = 'image-preview-overlay'
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: none;
      z-index: 9999;
      cursor: pointer;
    `

    // 创建预览容器
    this.modal = document.createElement('div')
    this.modal.className = 'image-preview-modal'
    this.modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: transparent;
      display: none;
      z-index: 10000;
      max-width: 90vw;
      max-height: 90vh;
      cursor: auto;
    `

    // 创建预览图片
    this.previewImage = document.createElement('img')
    this.previewImage.className = 'image-preview-img'
    this.previewImage.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    `

    // 创建关闭按钮
    const closeBtn = document.createElement('button')
    closeBtn.className = 'image-preview-close'
    closeBtn.innerHTML = '×'
    closeBtn.style.cssText = `
      position: absolute;
      top: -40px;
      right: 0;
      width: 40px;
      height: 40px;
      border: none;
      background-color: transparent;
      color: white;
      font-size: 32px;
      cursor: pointer;
      z-index: 10001;
      line-height: 1;
      padding: 0;
    `
    closeBtn.addEventListener('click', () => this.hide())

    this.modal.appendChild(this.previewImage)
    this.modal.appendChild(closeBtn)

    // 绑定事件
    this.overlay.addEventListener('click', () => this.hide())
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hide()
      }
    })

    // 阻止模态框内的点击事件冒泡到遮罩层
    this.modal.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    document.body.appendChild(this.overlay)
    document.body.appendChild(this.modal)
  }

  /**
   * 显示预览
   * @param imageUrl 图片URL
   */
  show(imageUrl: string) {
    if (!this.previewImage || !this.modal || !this.overlay) {
      return
    }

    this.previewImage.src = imageUrl
    this.modal.style.display = 'flex'
    this.modal.style.alignItems = 'center'
    this.modal.style.justifyContent = 'center'
    this.overlay.style.display = 'block'

    // 防止页面滚动
    document.body.style.overflow = 'hidden'
  }

  /**
   * 隐藏预览
   */
  hide() {
    if (this.modal && this.overlay) {
      this.modal.style.display = 'none'
      this.overlay.style.display = 'none'
      document.body.style.overflow = ''
    }
  }

  /**
   * 销毁预览模态框
   */
  destroy() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay)
    }
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal)
    }
    this.modal = null
    this.overlay = null
    this.previewImage = null
  }
}

// 全局单例实例
let globalPreviewModal: ImagePreviewModal | null = null

/**
 * 获取或创建全局预览模态框实例
 */
export function getImagePreviewModal(): ImagePreviewModal {
  if (!globalPreviewModal) {
    globalPreviewModal = new ImagePreviewModal()
  }
  return globalPreviewModal
}

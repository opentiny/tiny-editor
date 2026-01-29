/**
 * 图片预览模态框
 * 提供图片双击时的预览功能，包括遮罩层和全屏预览
 */

export class ImagePreviewModal {
  private modal: HTMLElement | null = null
  private overlay: HTMLElement | null = null
  private previewImage: HTMLImageElement | null = null
  private scaleTooltip: HTMLElement | null = null
  private currentScale: number = 1
  private minScale: number = 0.5
  private maxScale: number = 3
  private scaleStep: number = 0.1
  private tooltipHideTimer: number | null = null

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
      transition: transform 0.2s ease-out;
      cursor: grab;
    `

    // 创建关闭按钮
    const closeBtn = document.createElement('button')
    closeBtn.className = 'tiny-editor-image-preview-close'
    closeBtn.innerHTML = '×'
    closeBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
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
    document.body.appendChild(closeBtn)

    // 创建缩放提示窗口
    this.scaleTooltip = document.createElement('div')
    this.scaleTooltip.className = 'image-preview-scale-tooltip'
    this.scaleTooltip.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 10002;
      display: none;
      pointer-events: none;
      white-space: nowrap;
      font-weight: 500;
    `
    document.body.appendChild(this.scaleTooltip)

    // 绑定事件
    this.overlay.addEventListener('click', () => this.hide())
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hide()
      }
    })

    // 绑定滚轮缩放事件
    document.addEventListener('wheel', (e) => this.onMouseWheel(e), { passive: false })

    // 阻止模态框内的点击事件冒泡到遮罩层
    this.modal.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    document.body.appendChild(this.overlay)
    document.body.appendChild(this.modal)
  }

  /**
   * 处理鼠标滚轮事件 - 缩放图片
   */
  private onMouseWheel = (event: WheelEvent) => {
    // 只在预览打开时处理
    if (!this.modal || this.modal.style.display === 'none') {
      return
    }

    event.preventDefault()

    // 根据滚轮方向调整缩放比例
    const delta = event.deltaY > 0 ? -this.scaleStep : this.scaleStep
    this.setScale(this.currentScale + delta)

    // 显示缩放提示
    this.showScaleTooltip()
  }

  /**
   * 设置缩放比例
   */
  private setScale(scale: number) {
    // 限制缩放范围
    this.currentScale = Math.max(this.minScale, Math.min(scale, this.maxScale))

    if (this.previewImage) {
      this.previewImage.style.transform = `scale(${this.currentScale})`
    }
  }

  /**
   * 显示缩放百分比提示
   */
  private showScaleTooltip() {
    if (!this.scaleTooltip) {
      return
    }

    // 清除之前的隐藏计时器
    if (this.tooltipHideTimer !== null) {
      clearTimeout(this.tooltipHideTimer)
    }

    // 更新提示文本
    const percentage = Math.round(this.currentScale * 100)
    this.scaleTooltip.textContent = `${percentage}%`
    this.scaleTooltip.style.display = 'block'

    // 1.5秒后隐藏提示
    this.tooltipHideTimer = window.setTimeout(() => {
      if (this.scaleTooltip) {
        this.scaleTooltip.style.display = 'none'
      }
      this.tooltipHideTimer = null
    }, 1500)
  }

  /**
   * 隐藏缩放提示
   */
  private hideScaleTooltip() {
    if (this.tooltipHideTimer !== null) {
      clearTimeout(this.tooltipHideTimer)
      this.tooltipHideTimer = null
    }
    if (this.scaleTooltip) {
      this.scaleTooltip.style.display = 'none'
    }
  }

  /**
   * 重置缩放比例
   */
  private resetScale() {
    this.currentScale = 1
    if (this.previewImage) {
      this.previewImage.style.transform = 'scale(1)'
    }
    this.hideScaleTooltip()
  }

  /**
   * 显示预览
   * @param imageUrl 图片URL
   */
  show(imageUrl: string) {
    if (!this.previewImage || !this.modal || !this.overlay) {
      return
    }

    this.resetScale()
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
      this.resetScale()
    }
  }

  /**
   * 销毁预览模态框
   */
  destroy() {
    this.hideScaleTooltip()
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay)
    }
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal)
    }
    if (this.scaleTooltip && this.scaleTooltip.parentNode) {
      this.scaleTooltip.parentNode.removeChild(this.scaleTooltip)
    }
    this.modal = null
    this.overlay = null
    this.previewImage = null
    this.scaleTooltip = null
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

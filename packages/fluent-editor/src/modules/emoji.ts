import type { Delta } from 'quill'
import type TypeToolbar from 'quill/modules/toolbar'
import type FluentEditor from '../fluent-editor'
import data from '@emoji-mart/data'
import { computePosition } from '@floating-ui/dom'
import { Picker } from 'emoji-mart'
import { debounce } from 'lodash-es'

export interface EmojiModuleOptions {
  theme?: string
  locale?: string
  set?: string
  skinTonePosition?: string
  previewPosition?: string
  searchPosition?: string
  categories?: string[]
  maxFrequentRows?: number
  perLine?: number
  navPosition?: string
  noCountryFlags?: boolean
  dynamicWidth?: boolean
}

const DEFAULT_OPTIONS: Readonly<EmojiModuleOptions> = {
  theme: 'light',
  set: 'native',
  skinTonePosition: 'none',
  previewPosition: 'bottom',
  searchPosition: 'sticky',
  categories: ['frequent', 'people', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols', 'flags'],
  maxFrequentRows: 2,
  perLine: 8,
  navPosition: 'top',
  noCountryFlags: false,
  dynamicWidth: false,
} as const

const PICKER_DOM_ID = 'emoji-picker'

const LOCALE_MAP = {
  'zh-CN': 'zh',
  'en-US': 'en',
} as const

class EmojiModule {
  private readonly quill: FluentEditor
  private readonly options: EmojiModuleOptions
  private picker: HTMLElement | null = null
  private isPickerVisible = false
  private cleanupResizeObserver: (() => void) | null = null

  constructor(quill: FluentEditor, options: EmojiModuleOptions = {}) {
    this.quill = quill

    this.options = options

    const toolbar = this.quill.getModule('toolbar') as TypeToolbar

    if (toolbar) {
      toolbar.addHandler('emoji', () => {
        if (this.isPickerVisible) {
          this.closeDialog()
        }
        else {
          this.openDialog()
        }
      })
    }
  }

  private getEmojiButton() {
    return document.querySelector('.ql-emoji') as HTMLElement | null
  }

  private async updatePickerPosition() {
    const button = this.getEmojiButton()
    const pickerElement = document.getElementById(PICKER_DOM_ID)

    if (!button || !this.picker || !pickerElement) {
      return
    }

    try {
      const { x, y } = await computePosition(button, pickerElement)
      this.picker.style.top = `${y}px`
      this.picker.style.left = `${x}px`
    }
    catch (error) {
      console.warn('Failed to compute picker position:', error)
    }
  }

  // 监听容器大小变化，更新表情选择弹窗位置
  private setupContainerResizeObserver() {
    const container = this.quill.root.parentElement
    if (!container) {
      return null
    }

    const debouncedUpdate = debounce(() => {
      this.updatePickerPosition()
    }, 100)

    const resizeObserver = new ResizeObserver(() => {
      debouncedUpdate()
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      debouncedUpdate.cancel()
    }
  }

  // 创建表情选择弹窗
  private createPicker() {
    const pickerConfig = {
      ...DEFAULT_OPTIONS,
      // emoji-mart 与 tiny-editor 国际化的的 locale 不一致使用 LOCALE_MAP 转换
      locale: LOCALE_MAP[this.quill.lang] ?? 'en',
      ...this.options,
      data,
      onEmojiSelect: this.handleEmojiSelect.bind(this),
      onClickOutside: this.handleClickOutside.bind(this),
    }

    const picker = new Picker(pickerConfig) as unknown as HTMLElement

    // 设置样式和属性
    picker.id = PICKER_DOM_ID
    picker.style.position = 'absolute'
    picker.style.zIndex = '1000'

    return picker
  }

  // 打开表情弹窗
  public openDialog() {
    if (this.picker) {
      return
    }

    try {
      this.picker = this.createPicker()
      document.body.appendChild(this.picker)

      this.updatePickerPosition()
      this.cleanupResizeObserver = this.setupContainerResizeObserver()
      this.isPickerVisible = true
    }
    catch (error) {
      console.error('Failed to open emoji picker:', error)
      this.closeDialog()
    }
  }

  // 关闭表情弹窗
  public closeDialog() {
    if (!this.picker) {
      return
    }

    this.isPickerVisible = false
    this.picker.remove()
    this.picker = null

    this.cleanupResizeObserver?.()
    this.cleanupResizeObserver = null
  }

  // 处理表情选择事件
  private handleEmojiSelect(emoji: { native: string }) {
    const selection = this.quill.getSelection(true)
    if (!selection) {
      console.warn('No selection available for emoji insertion')
      return
    }

    try {
      const emojiDelta = this.quill.insertText(selection.index, emoji.native, 'user')

      this.closeDialog()

      // 异步设置光标位置，确保插入完成后再设置
      this.setSelectionAfterEmoji(emojiDelta)
    }
    catch (error) {
      console.error('Failed to insert emoji:', error)
    }
  }

  // 设置表情插入后的光标位置
  private setSelectionAfterEmoji(emojiDelta: Delta) {
    setTimeout(() => {
      try {
        const newSelection = this.quill.getSelection(true)
        if (newSelection && emojiDelta) {
          this.quill.setSelection(newSelection.index + emojiDelta.length())
        }
      }
      catch (error) {
        console.warn('Failed to set selection after emoji insertion:', error)
      }
    }, 0)
  }

  // 处理外部点击事件
  private handleClickOutside(event: MouseEvent) {
    const button = this.getEmojiButton()

    const target = event.target

    const isClickOnButton = target === button || (target instanceof Element && button?.contains(target))

    // 如果点击的是表情符号按钮或其子元素，则不关闭选择器
    if (isClickOnButton) {
      return
    }

    this.closeDialog()
  }

  // 销毁模块，清理资源
  public destroy() {
    this.cleanupResizeObserver?.()
    this.cleanupResizeObserver = null
    this.closeDialog()
  }
}

export { EmojiModule }

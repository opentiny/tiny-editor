import type TypeToolbar from 'quill/modules/toolbar'
import type FluentEditor from '../fluent-editor'
import data from '@emoji-mart/data'
import { computePosition } from '@floating-ui/dom'
import { Picker } from 'emoji-mart'
import { debounce } from 'lodash-es'

export interface EmojiModulePlusOptions {
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

const DefaultOptions: EmojiModulePlusOptions = {
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
}

const PickerDomId = 'emoji-plus-picker'

const I18nKeyMap: Record<string, string> = {
  'zh-CN': 'zh',
  'en-US': 'en',
}

class EmojiPlusModule {
  private quill: FluentEditor
  private options: EmojiModulePlusOptions
  private picker: HTMLElement | null
  private isPickerVisible: boolean
  private clearContainerResize: () => void

  constructor(quill: FluentEditor, options: EmojiModulePlusOptions = {}) {
    this.quill = quill
    this.options = { ...DefaultOptions, locale: I18nKeyMap[this.quill.lang] ?? 'en', ...options }
    this.picker = null
    this.isPickerVisible = false

    const toolbar = quill.getModule('toolbar') as TypeToolbar

    if (typeof toolbar !== 'undefined') {
      toolbar.addHandler('emoji-plus', () => {
        this.isPickerVisible ? this.closeDialog() : this.openDialog()
      })
    }
  }

  private getButton() {
    return document.getElementsByClassName('ql-emoji-plus')[0]
  }

  private updatePickerPosition() {
    const but = this.getButton()
    const PickerDom = document.getElementById(PickerDomId)

    computePosition(but, PickerDom).then(({ x, y }) => {
      this.picker.style.top = `${y}px`
      this.picker.style.left = `${x}px`
    })
  }

  private containerResize() {
    const container = this.quill.root.parentElement
    if (!container) return

    const debouncedResize = debounce(() => this.updatePickerPosition(), 100)

    const resizeObserver = new ResizeObserver(() => {
      debouncedResize()
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      debouncedResize.cancel()
    }
  }

  public openDialog() {
    if (!this.picker) {
      this.picker = new Picker({
        data,
        onEmojiSelect: (emoji: any) => this.selectEmoji(emoji),
        onClickOutside: (event: MouseEvent) => this.onClickOutside(event),
        ...this.options,
      }) as unknown as HTMLElement

      document.body.appendChild(this.picker)

      this.picker.id = PickerDomId
      this.picker.style.position = 'absolute'
      this.picker.style.zIndex = '1'
      this.updatePickerPosition()
      this.clearContainerResize = this.containerResize()

      this.isPickerVisible = true
    }
  }

  public closeDialog() {
    this.isPickerVisible = false
    this.picker?.remove()
    this.picker = null
  }

  private selectEmoji(emoji: any) {
    const emojiDelta = this.quill.insertText(
      this.quill.getSelection(true).index,
      emoji.native,
      'user',
    )

    this.closeDialog()

    // 设置表情符号后的输入位置
    setTimeout(() => {
      this.quill.setSelection(this.quill.getSelection(true).index + emojiDelta.length())
    })
  }

  private onClickOutside(event: MouseEvent): void {
    const but = this.getButton()

    // 仅当工具栏内的表情符号按钮存在且未发生点击时才关闭！
    if (!but || !(but === event.target || (event.target instanceof Element && but.contains(event.target)))) {
      this.closeDialog()
    }
  }

  public destroy() {
    this.clearContainerResize()
    this.closeDialog()
  }
}

export {
  EmojiPlusModule,
}

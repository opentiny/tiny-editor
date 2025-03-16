import type { Parchment as TypeParchment } from 'quill'
import type FluentEditor from '../../../core/fluent-editor'
import Quill, { Range } from 'quill'
import Emitter from 'quill/core/emitter'
import { BaseTooltip } from 'quill/themes/base'
import { CHANGE_LANGUAGE_EVENT } from '../../../config'
import { hadProtocol, isNullOrUndefined } from '../../../config/editor.utils'
import { EN_US } from '../../../config/i18n/en-us'
import { debounce } from '../../../utils/debounce'
import { LinkBlot } from '../formats/link'

export class LinkTooltip extends BaseTooltip {
  static TEMPLATE: string = [
    `<input type="text" data-formula="e=mc^2" data-link="${EN_US.linkplaceholder}" data-video="Embed URL" style="width: 225px;">`,
    '<span class="ql-split"></span>',
    '<a class="ql-preview"><i class="icon-share"></i></a>',
    '<a class="ql-remove"><i class="icon-delete"></i></a>',
  ].join('')

  isInputFocus: boolean
  isHover: boolean
  debouncedHideToolTip: any
  debouncedShowToolTip: any
  options: { autoProtocol: string } = {
    autoProtocol: 'https',
  }

  constructor(public quill: FluentEditor, bounds) {
    super(quill, bounds)
    this.setTemplate()
    this.isInputFocus = false
    this.isHover = false

    this.resolveOptions()
    LinkBlot.autoProtocol = this.options.autoProtocol
    this.debouncedHideToolTip = debounce(this.hideToolTip, 300)
    this.debouncedShowToolTip = debounce(this.showToolTip, 300)
    this.quill.emitter.on(CHANGE_LANGUAGE_EVENT, () => {
      this.setTemplate()
    })
  }

  setTemplate() {
    this.root.innerHTML = [
      `<input type="text" data-formula="e=mc^2" data-link="${this.quill.getLangText('linkplaceholder')}" data-video="Embed URL" style="width: 225px;">`,
      '<span class="ql-split"></span>',
      '<a class="ql-preview"><i class="icon-share"></i></a>',
      '<a class="ql-remove"><i class="icon-delete"></i></a>',
    ].join('')
    this.textbox = this.root.querySelector('input[type="text"]')
    this.listen()
  }

  resolveOptions() {
    this.options = {
      autoProtocol: 'https',
    }
    const value = this.quill.options.autoProtocol
    if (value && typeof value === 'string') {
      this.options.autoProtocol = value
    }
    else if (typeof value === 'boolean' && !value) {
      this.options.autoProtocol = ''
    }
  }

  shouldHide() {
    return !this.isHover && !this.isInputFocus
  }

  hideToolTip() {
    if (this.shouldHide()) {
      this.hide()
    }
  }

  showToolTip(name, value, range) {
    if (!this.shouldHide()) {
      this.edit(name, value, range)
    }
  }

  handleMouseLeave() {
    this.isHover = false
    this.debouncedHideToolTip()
  }

  handleMouseEnter(event) {
    const isTooltipShow = !this.root.classList.contains('ql-hidden')
    if (isTooltipShow) {
      return
    }

    if (this.isInputFocus) {
      this.save()
    }
    this.isHover = true
    const linkNode = event.target
    const preview = LinkBlot.formats(linkNode)
    if (preview.startsWith('#')) {
      return
    }
    const linkBlot = Quill.find(linkNode) as TypeParchment.Blot
    const index = this.quill.getIndex(linkBlot)
    const [link, offset] = this.quill.scroll.descendant(
      LinkBlot,
      index,
    )
    const length = link && link.length()
    this.linkRange = new Range(index - offset, length)
    this.debouncedShowToolTip('link', preview, this.linkRange)
  }

  listen() {
    super.listen()
    this.root.querySelector('a.ql-remove').addEventListener('click', (event) => {
      if (!isNullOrUndefined(this.linkRange)) {
        const range = this.linkRange
        this.restoreFocus()
        this.quill.formatText(range, 'link', false, Emitter.sources.API)
        delete this.linkRange
      }
      event.preventDefault()
      this.hide()
    })

    this.quill.root.addEventListener(
      'mouseover',
      (event) => {
        const target = event.target as HTMLElement
        if (
          (target.tagName.toUpperCase() !== 'A'
            || !target.classList.contains(LinkBlot.className))
          && !target.closest(`a.${LinkBlot.className}`)
        ) {
          return
        }
        this.handleMouseEnter(event)
      },
      false,
    )

    this.quill.root.addEventListener(
      'mouseout',
      (event) => {
        const target = event.target as HTMLElement
        if (target.tagName.toUpperCase() !== 'A' && !target.closest(`a.${LinkBlot.className}`)) {
          return
        }
        this.handleMouseLeave()
      },
      false,
    )

    this.root.addEventListener(
      'mouseenter',
      () => {
        this.isHover = true
      },
      false,
    )

    this.root.addEventListener('mouseleave', this.handleMouseLeave.bind(this), false)

    this.root.querySelector('a.ql-preview').addEventListener('click', (event) => {
      const link = LinkBlot.sanitize(this.textbox.value)
      window.open(link, '_blank')
      event.preventDefault()
    })
    this.root.querySelector('input[type="text"]').addEventListener('focus', () => {
      this.isInputFocus = true
    })
    this.root.querySelector('input[type="text"]').addEventListener('blur', () => {
      this.isInputFocus = false
      this.save()
    })
    this.quill.on(
      Emitter.events.SELECTION_CHANGE,
      (range, _oldRange, source) => {
        if (isNullOrUndefined(range)) return
        if (source === Emitter.sources.USER) {
          const [link, offset] = this.quill.scroll.descendant(
            LinkBlot,
            range.index,
          )

          if (!isNullOrUndefined(link)) {
            this.linkRange = new Range(range.index - offset, link.length())
            const preview = LinkBlot.formats(link.domNode)
            if (!preview.startsWith('#')) {
              this.edit('link', preview, this.linkRange)
            }
            return
          }
        }
        if (this.shouldHide()) {
          this.hide()
        }
      },
    )
    this.quill.on(
      Emitter.events.TEXT_CHANGE,
      () => {
        const selection = this.quill.getSelection()
        const index = selection && selection.index
        setTimeout(() => {
          const link = this.quill.scroll.descendant(
            LinkBlot,
            index,
          )[0]
          if (!link) {
            this.handleMouseLeave()
          }
        })
      },
    )
  }

  save() {
    let value = this.textbox.value
    if (!value) return
    this.textbox.value = ''
    switch (this.root.getAttribute('data-mode')) {
      case 'link': {
        const { scrollTop } = this.quill.root
        if (this.options.autoProtocol) {
          value = this.addHttpProtocol(value)
        }

        if (this.linkRange) {
          this.quill.formatText(
            this.linkRange,
            'link',
            value,
            Emitter.sources.USER,
          )
          this.restoreFocus()
        }
        else {
          this.restoreFocus()
          this.quill.format('link', value, Emitter.sources.USER)
        }
        this.quill.root.scrollTop = scrollTop
        break
      }
      case 'formula': {
        const range = this.quill.getSelection(true)
        if (!isNullOrUndefined(range)) {
          const index = range.index + range.length
          this.quill.insertEmbed(
            index,
            this.root.getAttribute('data-mode'),
            value,
            Emitter.sources.USER,
          )
          if (this.root.getAttribute('data-mode') === 'formula') {
            this.quill.insertText(index + 1, ' ', Emitter.sources.USER)
          }
          this.quill.setSelection(index + 2, Emitter.sources.USER)
        }
        break
      }
      case 'video': {
        const range = this.quill.getSelection(true)
        this.quill.insertText(range.index, '\n', Emitter.sources.USER)
        this.quill.insertEmbed(range.index + 1, 'video', { src: value }, Emitter.sources.USER)
        this.quill.insertText(range.index + 2, '\n', Emitter.sources.USER)
        this.quill.setSelection(range.index + 3, Emitter.sources.SILENT)
        this.textbox.value = ''
        this.hide()
        break
      }
      default:
    }
  }

  position(reference) {
    const left = reference.left
    const top = reference.bottom + this.quill.root.scrollTop
    this.root.style.left = `${left}px`
    this.root.style.top = `${top}px`
    this.root.classList.remove('ql-flip')
    const containerBounds = this.boundsContainer.getBoundingClientRect()
    const rootBounds = this.root.getBoundingClientRect()
    let shift = 0
    if (rootBounds.right > containerBounds.right) {
      shift = containerBounds.right - rootBounds.right
      this.root.style.left = `${left + shift}px`
    }
    if (rootBounds.left < containerBounds.left) {
      shift = containerBounds.left - rootBounds.left
      this.root.style.left = `${left + shift}px`
    }
    if (rootBounds.bottom > containerBounds.bottom) {
      const height = rootBounds.bottom - rootBounds.top
      const verticalShift = reference.bottom - reference.top + height
      const fixedTop = top - verticalShift
      this.root.style.top = `${fixedTop < 0 ? this.quill.root.scrollTop + reference.top : fixedTop}px`
      this.root.classList.add('ql-flip')
    }
    return shift
  }

  // @ts-expect-error
  edit(mode: string = 'link', preview = null, range) {
    this.linkRange = range || this.quill.selection.savedRange
    this.root.classList.remove('ql-hidden')
    this.root.classList.add('ql-editing')
    if (!isNullOrUndefined(preview)) {
      this.textbox.value = preview
    }
    else if (mode !== this.root.getAttribute('data-mode')) {
      this.textbox.value = ''
    }
    this.position(this.quill.getBounds(range || this.quill.selection.savedRange))
    if (this.textbox.value === '') {
      this.textbox.focus()
    }
    this.textbox.setAttribute(
      'placeholder',
      this.textbox.getAttribute(`data-${mode}`) || '',
    )
    this.root.setAttribute('data-mode', mode)
  }

  show() {
    super.show()
    this.root.removeAttribute('data-mode')
  }

  addHttpProtocol(url: string) {
    let result = url
    if (!url) {
      return ''
    }
    if (!hadProtocol(url)) {
      result = `${this.options.autoProtocol}://${url}`
    }
    return result
  }
}

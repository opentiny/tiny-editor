import type { BlotFormatter } from '../blot-formatter'
import type { ToolButtonOption } from '../options'
import type { ImageToolbarButtons } from './image-toolbar-buttons'

export class ImageToolbar {
  toolbar?: HTMLElement
  buttons: HTMLElement[]

  constructor() {
    this.toolbar = null
    this.buttons = []
  }

  create(formatter: BlotFormatter, toolButton: ImageToolbarButtons): HTMLElement {
    const toolbar = document.createElement('div')
    toolbar.classList.add(formatter.options.toolbar.mainClassName)
    this.addToolbarStyle(formatter, toolbar)
    this.addButtons(formatter, toolbar, toolButton)

    this.toolbar = toolbar
    return this.toolbar
  }

  destroy() {
    this.toolbar = null
    this.buttons = []
  }

  getElement() {
    return this.toolbar
  }

  addToolbarStyle(formatter: BlotFormatter, toolbar: HTMLElement) {
    if (formatter.options.toolbar.mainStyle) {
      Object.assign(toolbar.style, formatter.options.toolbar.mainStyle)
    }
  }

  addButtonStyle(button: HTMLElement, index: number, formatter: BlotFormatter) {
    if (formatter.options.toolbar.buttonStyle) {
      Object.assign(button.style, formatter.options.toolbar.buttonStyle)
      if (index > 0) {
        button.style.borderLeftWidth = '0'
      }
    }

    if (formatter.options.toolbar.svgStyle) {
      Object.assign((button.children[0] as HTMLElement).style, formatter.options.toolbar.svgStyle)
    }
  }

  addButtons(formatter: BlotFormatter, toolbar: HTMLElement, toolButton: ImageToolbarButtons) {
    toolButton.getItems().forEach((tool, i) => {
      const button = document.createElement('span')
      button.classList.add(formatter.options.toolbar.buttonClassName)
      button.innerHTML = tool.icon
      button.addEventListener('click', () => {
        this.onButtonClick(button, formatter, tool, toolButton)
      })
      this.preselectButton(button, tool, formatter, toolButton)
      this.addButtonStyle(button, i, formatter)
      this.buttons.push(button)
      toolbar.appendChild(button)
    })
  }

  preselectButton(
    button: HTMLElement,
    toolButtonOption: ToolButtonOption,
    formatter: BlotFormatter,
    toolButton: ImageToolbarButtons,
  ) {
    if (!formatter.currentSpec) {
      return
    }

    const target = formatter.currentSpec.getTargetElement()
    if (!target) {
      return
    }

    if (toolButtonOption.isActive && toolButtonOption.isActive(target)) {
      this.selectButton(formatter, button)
    }
  }

  onButtonClick(
    button: HTMLElement,
    formatter: BlotFormatter,
    toolButtonOption: ToolButtonOption,
    toolButton: ImageToolbarButtons,
  ) {
    if (!formatter.currentSpec) {
      return
    }

    const target = formatter.currentSpec.getTargetElement()
    if (!target || target.tagName.toLowerCase() !== 'img') {
      return
    }

    this.clickButton(button, target as HTMLImageElement, formatter, toolButtonOption, toolButton)
  }

  clickButton(
    button: HTMLElement,
    target: HTMLImageElement,
    formatter: BlotFormatter,
    toolButtonOption: ToolButtonOption,
    toolButton: ImageToolbarButtons,
  ) {
    if (!toolButtonOption.isActive) {
      toolButtonOption.apply.call(this, target, toolButton)
    }
    else {
      this.buttons.forEach((b) => {
        this.deselectButton(formatter, b)
      })

      if (toolButtonOption.isActive(target)) {
        toolButton.clear(target)
      }
      else {
        this.selectButton(formatter, button)
        toolButtonOption.apply.call(this, target, toolButton)
      }
    }

    formatter.update()
  }

  selectButton(formatter: BlotFormatter, button: HTMLElement) {
    button.classList.add('is-selected')
    if (formatter.options.toolbar.addButtonSelectStyle) {
      button.style.setProperty('filter', 'invert(20%)')
    }
  }

  deselectButton(formatter: BlotFormatter, button: HTMLElement) {
    button.classList.remove('is-selected')
    if (formatter.options.toolbar.addButtonSelectStyle) {
      button.style.removeProperty('filter')
    }
  }
}

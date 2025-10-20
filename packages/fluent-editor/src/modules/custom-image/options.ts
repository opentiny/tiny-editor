import type { ImageToolbar, ImageToolbarButtons } from './actions'
import type { BlotSpec } from './specs'
import { ImageSpec } from './specs'

export interface OverlayOptions {
  // classname applied to the overlay element
  className: string
  // style applied to overlay element, or null to prevent styles
  style: Record<string, string>
}

export interface ResizeOptions {
  // class name applied to the resize handles
  handleClassName: string
  // style applied to resize handles, or null to prevent styles
  handleStyle: Record<string, string>
}

export interface ToolButtonOption {
  name: string
  icon: string
  isActive?: (el: HTMLElement) => boolean
  apply: (this: ImageToolbar, el: HTMLImageElement, toolbarButtons: ImageToolbarButtons) => void
}

export interface ToolbarButtonOptions {
  buttons: Record<string, ToolButtonOption | boolean>
}

export interface ToolbarOptions extends ToolbarButtonOptions {
  // class name applied to the root toolbar element
  mainClassName: string
  // style applied to root toolbar element, or null to prevent styles
  mainStyle: Record<string, unknown>
  // class name applied to each button in the toolbar
  buttonClassName: string
  /* whether or not to add the selected style to the buttons.
    they'll always get the is-selected class */
  addButtonSelectStyle: boolean
  // style applied to buttons, or null to prevent styles
  buttonStyle: Record<string, unknown>
  // style applied to the svgs in the buttons
  svgStyle: Record<string, unknown>
}

export interface BlotFormatterOptionsInput {
  specs: typeof BlotSpec[]
  overlay: Partial<OverlayOptions>
  resize: Partial<ResizeOptions>
  toolbar: Partial<ToolbarOptions>
}
export interface BlotFormatterOptions {
  specs: typeof BlotSpec[]
  overlay: OverlayOptions
  resize: ResizeOptions
  toolbar: ToolbarOptions
  allowInvalidUrl: boolean
}

export const LEFT_ALIGN = 'align-left'
export const CENTER_ALIGN = 'align-center'
export const RIGHT_ALIGN = 'align-right'
export const COPY = 'copy'
export const DOWNLOAD = 'download'
const DefaultOptions: BlotFormatterOptions = {
  // 默认情况下，`file://` 格式的本地文件路径在浏览器环境无法读取，因此会被转换成 `//:0`，但是在一些特殊的场景下（比如：Electron），需要获取到图片的原始路径，进行后续的上传处理
  // 注意：该选项一旦设置为 true，本地磁盘路径会暴露出去，这可能会带来安全风险，请确保你了解相关的安全隐患
  allowInvalidUrl: false,

  specs: [
    ImageSpec,
  ],
  overlay: {
    className: 'blot-formatter__overlay',
    style: {
      position: 'absolute',
      boxSizing: 'border-box',
      border: '1px dashed #444',
    },
  },
  toolbar: {
    mainClassName: 'blot-formatter__toolbar',
    mainStyle: {
      position: 'absolute',
      top: '-12px',
      right: '0',
      left: '0',
      height: '0',
      minWidth: '120px',
      font: '12px/1.0 Arial, Helvetica, sans-serif',
      textAlign: 'center',
      color: '#333',
      boxSizing: 'border-box',
      cursor: 'default',
      zIndex: '1',
    },
    buttonClassName: 'blot-formatter__toolbar-button',
    addButtonSelectStyle: true,
    buttonStyle: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      background: 'white',
      border: '1px solid #999',
      verticalAlign: 'middle',
      cursor: 'pointer',
    },
    svgStyle: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      background: 'white',
      verticalAlign: 'middle',
    },
    buttons: {
      [LEFT_ALIGN]: true,
      [CENTER_ALIGN]: true,
      [RIGHT_ALIGN]: true,
      [COPY]: true,
      [DOWNLOAD]: true,
    },
  },
  resize: {
    handleClassName: 'blot-formatter__resize-handle',
    handleStyle: {
      position: 'absolute',
      height: '12px',
      width: '12px',
      backgroundColor: 'white',
      border: '1px solid #777',
      boxSizing: 'border-box',
      opacity: '0.80',
    },
  },
}

export default DefaultOptions

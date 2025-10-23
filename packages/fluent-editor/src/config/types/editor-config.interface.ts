import type { QuillOptions } from 'quill'
import type { ScreenShotOptions } from '../../tools/screenshot'
import type { IEditorModules } from './editor-modules.interface'

export interface IEditorConfig extends QuillOptions {
  'modules'?: IEditorModules
  'screenshotOnStaticPage'?: boolean
  'scrollingContainer'?: HTMLElement | string | null
  // Auto protocol for link
  'autoProtocol'?: boolean | string
  'editorPaste'?: any
  'screenshot'?: Partial<ScreenShotOptions>
  'format-painter'?: {
    ignoreFormat?: string[]
  }
}

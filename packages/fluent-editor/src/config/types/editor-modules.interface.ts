import type { FileUploaderOptions } from '../../modules/custom-uploader'
import type { ToolbarOption } from './type'

export interface IEditorModules {
  [key: string]: any
  clipboard?:
    | {
      matchers?: any[]
      matchVisual?: boolean
    }
    | boolean
  history?:
    | {
      delay?: number
      maxStack?: number
      userOnly?: boolean
    }
    | boolean
  keyboard?:
    | {
      bindings?: any
    }
    | boolean
  syntax?:
    | {
      interval?: number
      languages?: { key: string, label: string }[]
      hljs?: any
    }
    | boolean
  toolbar?:
    | (string | string[])[][]
    | ToolbarOption
    | string
    | {
      container?: string | string[] | ToolbarOption
      handlers?: {
        [key: string]: any
      }
    }
    | boolean
  uploader?: boolean | Partial<FileUploaderOptions>
}

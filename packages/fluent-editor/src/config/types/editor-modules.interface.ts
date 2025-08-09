import type { ToolbarProps } from 'quill/modules/toolbar'
import type { I18NOptions, ICounterOption, MentionOption, ShortCutKeyInputOptions } from '../../modules'
import type { BlotFormatterOptionsInput } from '../../modules/custom-image/options'
import type { FileUploaderOptions } from '../../modules/custom-uploader'
import type { EmojiModuleOptions } from '../../modules/emoji'

export type ToolbarOptions = {
  container?: HTMLElement | (Record<string, any>[] | string[] | (string | Record<string, any>)[])[]
} & ToolbarProps
export interface IEditorModules {
  [key: string]: any
  'clipboard'?:
    | {
      matchers?: any[]
      matchVisual?: boolean
    }
    | boolean
  'history'?:
    | {
      delay?: number
      maxStack?: number
      userOnly?: boolean
    }
    | boolean
  'keyboard'?:
    | {
      bindings?: any
    }
    | boolean
  'syntax'?:
    | {
      interval?: number
      languages?: { key: string, label: string }[]
      hljs?: any
    }
    | boolean
  'toolbar'?: boolean | ToolbarOptions | ToolbarOptions['container'] | string[]
  'uploader'?: boolean | Partial<FileUploaderOptions>
  'shortcut-key'?: boolean | Partial<ShortCutKeyInputOptions>
  'mention'?: boolean | MentionOption
  'i18n'?: boolean | Partial<I18NOptions>
  'counter'?: boolean | ICounterOption
  'emoji'?: boolean | EmojiModuleOptions
  'file'?: boolean
  'mathlive'?: boolean
  'image'?: boolean | Partial<BlotFormatterOptionsInput>
  'flow-chart'?: boolean
  'mind-map'?: boolean
}

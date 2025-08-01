import FluentEditor from '../core/fluent-editor'
import {
  ALIGN_CENTER_ICON,
  ALIGN_JUSTIFY_ICON,
  ALIGN_LEFT_ICON,
  ALIGN_RIGHT_ICON,
  BACKGROUND_COLOR_ICON,
  BLOCKQUOTE_ICON,
  BOLD_ICON,
  CLEAN_ICON,
  CODE_BLOCK_ICON,
  CODE_ICON,
  COLOR_ICON,
  DIVIDER_ICON,
  EMOJI_ICON,
  FILE_ICON,
  FORMAT_PAINTER_ICON,
  FULLSCREEN_EXIT_ICON,
  FULLSCREEN_ICON,
  GLOBAL_LINK_ICON,
  HELP_ICON,
  IMAGE_ICON,
  ITALIC_ICON,
  LINK_ICON,
  LIST_CHECK_ICON,
  LIST_ORDERED_ICON,
  LIST_UNORDERED_ICON,
  MIND_ICON,
  REDO_ICON,
  SCREENSHOT_ICON,
  STRIKE_ICON,
  UNDERLINE_ICON,
  UNDO_ICON,
} from './icons.config'

const ICONS_CONFIG: { [key: string]: any } = {
  'undo': UNDO_ICON,
  'redo': REDO_ICON,
  'clean': CLEAN_ICON,

  'bold': BOLD_ICON,
  'italic': ITALIC_ICON,
  'underline': UNDERLINE_ICON,
  'strike': STRIKE_ICON,

  'font': '',
  'size': '',

  'color': COLOR_ICON,
  'background': BACKGROUND_COLOR_ICON,

  'align': {
    '': ALIGN_LEFT_ICON,
    'center': ALIGN_CENTER_ICON,
    'right': ALIGN_RIGHT_ICON,
    'justify': ALIGN_JUSTIFY_ICON,
  },
  'list': {
    bullet: LIST_UNORDERED_ICON,
    ordered: LIST_ORDERED_ICON,
    check: LIST_CHECK_ICON,
  },

  'code': CODE_ICON,
  'code-block': CODE_BLOCK_ICON,
  'blockquote': BLOCKQUOTE_ICON,

  'image': IMAGE_ICON,
  'file': FILE_ICON,
  'link': LINK_ICON,
  'global-link': GLOBAL_LINK_ICON,
  'fullscreen': FULLSCREEN_ICON,
  'fullscreen-exit': FULLSCREEN_EXIT_ICON,
  'emoji': EMOJI_ICON,
  'help': HELP_ICON,
  'screenshot': SCREENSHOT_ICON,
  'format-painter': FORMAT_PAINTER_ICON,
  'divider': DIVIDER_ICON,
  'mind': MIND_ICON,
}

const Icons = FluentEditor.import('ui/icons')
Object.entries(ICONS_CONFIG).forEach(([key, icon]) => {
  Icons[key] = icon
})

export { ICONS_CONFIG }

export default Icons

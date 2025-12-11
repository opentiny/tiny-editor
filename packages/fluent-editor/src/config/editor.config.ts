// Delta数据行太多超出该限制时，加载会比较慢，需要提示用户
export const BIG_DELTA_LIMIT = 2000

export const CHANGE_LANGUAGE_EVENT = 'change-language'
export const defaultLanguage = 'en-US'

// Image
export const IMAGE_UPLOADER_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
]

// 常用文件格式
export const OTHER_FILE_UPLOADER_MIME_TYPES = [
  'text/plain',
  'application/json',
  'application/pdf',
]

export const AUDIO_VIDEO_UPLOADER_MIME_TYPES = [
  'audio/wave',
  'audio/wav',
  'audio/x-wav',
  'audio/x-pn-wav',
  'audio/mpeg',
  'video/mpeg',
  'video/x-msvideo',
]

//  MS office
export const DOC_UPLOADER_MIME_TYPES = [
  'application/msword',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  'application/vnd.ms-word.document.macroEnabled.12',
  'application/vnd.ms-word.template.macroEnabled.12',
]

export const XSL_UPLOADER_MIME_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.ms-excel.template.macroEnabled.12',
  'application/vnd.ms-excel.addin.macroEnabled.12',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
]

export const PPT_UPLOADER_MIME_TYPES = [
  'application/vnd.ms-powerpoint',
  'application/vnd.ms-powerpoint',
  'application/vnd.ms-powerpoint',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.template',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  'application/vnd.ms-powerpoint.addin.macroEnabled.12',
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
  'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
]

// Compressed files
export const COMPRESSED_UPLOADER_MIME_TYPES = [
  'application/x-tar',
  'application/x-zip-compressed',
  'application/zip-compressed',
  'application/gzip',
  '.rar',
  '.7z',
]

// default
export const FILE_UPLOADER_MIME_TYPES = [
  ...OTHER_FILE_UPLOADER_MIME_TYPES,
  ...AUDIO_VIDEO_UPLOADER_MIME_TYPES,
  ...DOC_UPLOADER_MIME_TYPES,
  ...XSL_UPLOADER_MIME_TYPES,
  ...PPT_UPLOADER_MIME_TYPES,
  ...COMPRESSED_UPLOADER_MIME_TYPES,
]

export const DEFAULT_TOOLBAR = [
  [{ header: [] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
]

export const FULL_TOOLBAR = [
  ['undo', 'redo', 'clean', 'format-painter'],
  [
    { header: [1, 2, 3, 4, 5, 6, false] },
    { font: [false, '宋体', '微软雅黑', '楷体', '黑体', '隶书', 'andale mono', 'arial', 'arial black', 'comic sans ms', 'impact', 'times new roman'] },
    { size: [false, '12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px'] },
    { 'line-height': [false, '1.2', '1.5', '1.75', '2', '3', '4', '5'] },
  ],
  ['bold', 'italic', 'strike', 'underline', 'divider'],
  [{ color: [] }, { background: [] }],
  [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  ['link', 'blockquote', 'code', 'code-block'],
  ['image', 'file', { 'table-up': [] }],
  ['emoji', 'video', 'formula', 'screenshot', 'fullscreen'],
]


import {
    RICH_CONTENT_ICON,
    STREAMLINE_CONTENT_ICON,
    SYMBOL_ICON,
    TRANSLATE_ICON,
  } from './icons'

export const INPUT_PLACEHOLDER = '请输入问题或"/"获取提示词';
export const SELECT_PLACEHOLDER = '向我提问/选择操作';
export const STOP_ANSWER = '停止回答';
export const REPLACE_SELECT = '替换选中内容';
export const INSERT_TEXT = '插入内容';
export const INSERT_SUB_CONTENT_TEXT = '插入内容下方';
export const REGENERATE = '重新生成';
export const CLOSE = '关闭';
export const THINK_TEXT = '正在为您分析并总结答案';
export const RESULT_HEADER_TEXT = '根据您的诉求，已为您解答，具体如下：';

export const MENU_TITLE_DATA = {
    editor: [
      { id: '1-1', text: '丰富内容', icon: RICH_CONTENT_ICON },
      { id: '1-2', text: '精简内容', icon: STREAMLINE_CONTENT_ICON },
      { id: '1-3', text: '修改标点符号', icon: SYMBOL_ICON },
      { id: '1-4', text: '翻译', icon: TRANSLATE_ICON },
    ],
    tone: [
      { id: '2-1', text: '更专业的' },
      { id: '2-2', text: '更直接的' },
      { id: '2-3', text: '更友善的' },
      { id: '2-4', text: '更口语化的' },
    ],
    adjust: [
      { id: '3-1', text: '提炼要点' },
      { id: '3-2', text: '归纳总结' },
      { id: '3-3', text: '转写成[代码块]' },
    ]
};

export const MENU_ID_MAP = {
    editor: 'subMenuEditorEl',
    tone: 'subMenuToneEl',
    adjust: 'subMenuAdjustEl',
};
import { MIND_MAP_EN_US } from './en-us'
import { MIND_MAP_ZH_CN } from './zh-cn'

export function registerMindMapI18N(I18N: any) {
  I18N.register({
    'en-US': MIND_MAP_EN_US,
    'zh-CN': MIND_MAP_ZH_CN,
  }, false)
}

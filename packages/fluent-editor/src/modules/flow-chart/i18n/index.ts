import { FLOW_CHART_EN_US } from './en-us'
import { FLOW_CHART_ZH_CN } from './zh-cn'

export function registerFlowChartI18N(I18N: any) {
  I18N.register({
    'en-US': FLOW_CHART_EN_US,
    'zh-CN': FLOW_CHART_ZH_CN,
  }, false)
}

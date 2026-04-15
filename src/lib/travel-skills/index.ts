/**
 * 旅行技能库入口
 * 统一导出 + TravelSkillsEngine 路由引擎
 */

export * from './visa';
export * from './transport';
export * from './payment';
export * from './accommodation';

import { getVisaRequirements, generateVisaChecklist } from './visa';
import { getTransportGuide, getRouteRecommendation } from './transport';
import { getPaymentGuide, generatePaymentChecklist } from './payment';
import { getAccommodationGuide, generateBookingChecklist } from './accommodation';

// 关键词路由表
const SKILL_KEYWORDS = {
  visa: [
    'visa', 'passport', 'entry', 'border', 'immigration', 'nationality',
    '签证', '护照', '入境', '边境', '移民', '国籍',
  ],
  transport: [
    'transport', 'metro', 'subway', 'train', 'rail', 'taxi', 'didi', 'bus',
    'travel between', 'get to', 'how to go', 'directions', 'route',
    '交通', '地铁', '高铁', '火车', '出租车', '滴滴', '公交', '怎么去', '路线',
  ],
  payment: [
    'payment', 'pay', 'alipay', 'wechat pay', 'cash', 'money', 'card',
    'how to pay', 'currency', 'rmb', 'yuan',
    '支付', '付款', '支付宝', '微信支付', '现金', '钱', '人民币', '怎么付',
  ],
  accommodation: [
    'hotel', 'hostel', 'airbnb', 'stay', 'accommodation', 'book', 'room',
    'where to stay', 'check in', 'check-in',
    '住宿', '酒店', '旅馆', '民宿', '预订', '入住', '住哪',
  ],
};

type SkillName = 'visa' | 'transport' | 'payment' | 'accommodation';

/**
 * 检测查询匹配的技能
 */
function detectSkill(query: string): SkillName | null {
  const q = query.toLowerCase();
  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) {
      return skill as SkillName;
    }
  }
  return null;
}

/**
 * 旅行技能路由引擎
 */
export class TravelSkillsEngine {
  /**
   * 根据用户问题自动路由到对应技能，返回结构化结果和可操作清单
   */
  async processQuery(
    query: string,
    userContext: { nationality?: string; city?: string }
  ): Promise<{
    skill: string;
    result: any;
    actionItems: string[];
  }> {
    const skill = detectSkill(query);

    if (!skill) {
      return {
        skill: 'general',
        result: null,
        actionItems: [],
      };
    }

    switch (skill) {
      case 'visa': {
        const nationality = userContext.nationality || 'US';
        const result = getVisaRequirements(nationality);
        const actionItems = generateVisaChecklist(nationality);
        return { skill: 'visa', result, actionItems };
      }

      case 'transport': {
        // Try to extract from/to from query
        const result = getTransportGuide('metro');
        const guides = getRouteRecommendation(
          userContext.city || 'city',
          query
        );
        const actionItems = guides[0]?.howToUse || result.howToUse;
        return { skill: 'transport', result: guides.length ? guides : result, actionItems };
      }

      case 'payment': {
        // Detect specific payment method from query
        let method = 'alipay';
        if (query.toLowerCase().includes('wechat') || query.includes('微信')) method = 'wechat-pay';
        else if (query.toLowerCase().includes('cash') || query.includes('现金')) method = 'cash';
        else if (query.toLowerCase().includes('card') || query.includes('信用卡')) method = 'card';

        const result = getPaymentGuide(method);
        const actionItems = generatePaymentChecklist();
        return { skill: 'payment', result, actionItems };
      }

      case 'accommodation': {
        const city = userContext.city || 'China';
        const result = getAccommodationGuide(city);
        const actionItems = generateBookingChecklist(city);
        return { skill: 'accommodation', result, actionItems };
      }

      default:
        return { skill: 'general', result: null, actionItems: [] };
    }
  }
}

/**
 * 检查查询是否匹配任意旅行技能关键词
 * 供 chat route 快速判断使用
 */
export function matchesTravelSkill(query: string): SkillName | null {
  return detectSkill(query);
}

/**
 * 将技能结果格式化为 system prompt 附加内容
 */
export function formatSkillContext(skill: string, result: any, actionItems: string[]): string {
  if (!result || skill === 'general') return '';

  const lines: string[] = [
    `\n\n## Structured Travel Data (${skill.toUpperCase()} SKILL)`,
    '```json',
    JSON.stringify(result, null, 2),
    '```',
  ];

  if (actionItems.length > 0) {
    lines.push('\n## Action Items for User');
    actionItems.forEach(item => lines.push(`- ${item}`));
    lines.push('\nInclude these action items in your response as a practical checklist.');
  }

  return lines.join('\n');
}

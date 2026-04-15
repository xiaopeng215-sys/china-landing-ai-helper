/**
 * 签证技能模块
 * 根据用户国籍生成个性化签证指引和材料清单
 */

export interface VisaRequirement {
  nationality: string;
  visaType: 'visa-free' | 'visa-on-arrival' | 'e-visa' | 'embassy-visa';
  duration: string;
  requirements: string[];
  processingTime: string;
  cost: string;
  tips: string[];
}

// 主要国家签证数据库（基于2024年政策）
const VISA_DATABASE: Record<string, VisaRequirement> = {
  US: {
    nationality: 'United States',
    visaType: 'visa-free',
    duration: '10 days (transit) / 15 days (144-hour policy in select cities)',
    requirements: [
      'Valid passport (6+ months validity)',
      'Return/onward ticket',
      'Hotel booking confirmation',
      'Sufficient funds proof',
    ],
    processingTime: 'Immediate (on arrival)',
    cost: 'Free',
    tips: [
      '144-hour visa-free transit available in Beijing, Shanghai, Guangzhou, Chengdu, and other major cities',
      'Must enter and exit through designated ports',
      'For longer stays, apply for a tourist visa (L visa) at the Chinese embassy',
      'L visa typically allows 30-90 day stays with single or multiple entries',
    ],
  },
  GB: {
    nationality: 'United Kingdom',
    visaType: 'visa-free',
    duration: '15 days (visa-free, effective 2024)',
    requirements: [
      'Valid passport (6+ months validity)',
      'Return/onward ticket',
      'Hotel booking confirmation',
    ],
    processingTime: 'Immediate (on arrival)',
    cost: 'Free',
    tips: [
      'UK citizens now enjoy 15-day visa-free access to China (policy updated 2024)',
      'For stays beyond 15 days, apply for an L (tourist) or F (business) visa',
      'Visa applications: Chinese Embassy in London, processing 4-7 business days',
    ],
  },
  FR: {
    nationality: 'France',
    visaType: 'visa-free',
    duration: '15 days (visa-free, effective 2024)',
    requirements: [
      'Valid passport (6+ months validity)',
      'Return/onward ticket',
      'Hotel booking confirmation',
    ],
    processingTime: 'Immediate (on arrival)',
    cost: 'Free',
    tips: [
      'France is included in China\'s expanded visa-free program (2024)',
      'For longer stays, apply at the Chinese Embassy in Paris',
      'Schengen visa holders may also qualify for 144-hour transit',
    ],
  },
  DE: {
    nationality: 'Germany',
    visaType: 'visa-free',
    duration: '15 days (visa-free, effective 2024)',
    requirements: [
      'Valid passport (6+ months validity)',
      'Return/onward ticket',
      'Hotel booking confirmation',
    ],
    processingTime: 'Immediate (on arrival)',
    cost: 'Free',
    tips: [
      'Germany is included in China\'s expanded visa-free program (2024)',
      'For business or longer stays, apply for F or L visa at Chinese Embassy in Berlin',
    ],
  },
  JP: {
    nationality: 'Japan',
    visaType: 'visa-free',
    duration: '15 days (visa-free, effective 2024)',
    requirements: [
      'Valid passport (6+ months validity)',
      'Return/onward ticket',
      'Hotel booking confirmation',
    ],
    processingTime: 'Immediate (on arrival)',
    cost: 'Free',
    tips: [
      'Japan is included in China\'s expanded visa-free program (2024)',
      'For stays beyond 15 days, apply for L visa at Chinese Embassy in Tokyo or Osaka',
      'Processing time: 4-7 business days',
    ],
  },
  KR: {
    nationality: 'South Korea',
    visaType: 'visa-free',
    duration: '15 days (visa-free, effective 2024)',
    requirements: [
      'Valid passport (6+ months validity)',
      'Return/onward ticket',
      'Hotel booking confirmation',
    ],
    processingTime: 'Immediate (on arrival)',
    cost: 'Free',
    tips: [
      'South Korea is included in China\'s expanded visa-free program (2024)',
      'For longer stays, apply at Chinese Embassy in Seoul',
    ],
  },
  AU: {
    nationality: 'Australia',
    visaType: 'visa-free',
    duration: '15 days (visa-free, effective 2024)',
    requirements: [
      'Valid passport (6+ months validity)',
      'Return/onward ticket',
      'Hotel booking confirmation',
    ],
    processingTime: 'Immediate (on arrival)',
    cost: 'Free',
    tips: [
      'Australia is included in China\'s expanded visa-free program (2024)',
      'For longer stays, apply for L visa at Chinese Embassy in Canberra or consulates in Sydney/Melbourne',
    ],
  },
  CA: {
    nationality: 'Canada',
    visaType: 'embassy-visa',
    duration: '30-90 days (single/multiple entry)',
    requirements: [
      'Valid passport (6+ months validity)',
      'Completed visa application form (Form V.2013)',
      'Passport-size photo (white background, 33x48mm)',
      'Return/onward ticket',
      'Hotel booking confirmation or invitation letter',
      'Bank statements (last 3 months)',
      'Employment letter or proof of enrollment',
    ],
    processingTime: '4-7 business days (standard) / 2-3 days (express)',
    cost: 'CAD $150 (single entry) / CAD $200 (multiple entry)',
    tips: [
      'Canada does NOT currently qualify for China\'s visa-free program',
      'Apply at the Chinese Consulate in Toronto, Vancouver, Calgary, or Ottawa',
      'Online application available at visaforchina.cn',
      'Express processing available for additional fee',
      'Consider applying 4-6 weeks before travel',
    ],
  },
  SG: {
    nationality: 'Singapore',
    visaType: 'visa-free',
    duration: '15 days (visa-free, effective 2024)',
    requirements: [
      'Valid passport (6+ months validity)',
      'Return/onward ticket',
      'Hotel booking confirmation',
    ],
    processingTime: 'Immediate (on arrival)',
    cost: 'Free',
    tips: [
      'Singapore is included in China\'s expanded visa-free program (2024)',
      'For longer stays, apply at Chinese Embassy in Singapore',
    ],
  },
  TH: {
    nationality: 'Thailand',
    visaType: 'visa-free',
    duration: '30 days (visa-free)',
    requirements: [
      'Valid passport (6+ months validity)',
      'Return/onward ticket',
      'Hotel booking confirmation',
    ],
    processingTime: 'Immediate (on arrival)',
    cost: 'Free',
    tips: [
      'Thailand enjoys 30-day visa-free access to China',
      'For longer stays, apply at Chinese Embassy in Bangkok',
    ],
  },
};

const DEFAULT_VISA: VisaRequirement = {
  nationality: 'Other',
  visaType: 'embassy-visa',
  duration: '30-90 days (varies by visa type)',
  requirements: [
    'Valid passport (6+ months validity)',
    'Completed visa application form',
    'Passport-size photo',
    'Return/onward ticket',
    'Hotel booking confirmation or invitation letter',
    'Bank statements (last 3 months)',
  ],
  processingTime: '4-7 business days',
  cost: 'Varies by country',
  tips: [
    'Check the latest requirements at visaforchina.cn',
    'Apply at your nearest Chinese Embassy or Consulate',
    'Apply at least 4-6 weeks before your travel date',
    'Some nationalities may qualify for 144-hour visa-free transit',
  ],
};

/**
 * 根据国籍获取签证要求
 * @param nationality ISO 2-letter country code (e.g. 'US', 'GB') or country name
 */
export function getVisaRequirements(nationality: string): VisaRequirement {
  const code = nationality.toUpperCase().trim();
  return VISA_DATABASE[code] || DEFAULT_VISA;
}

/**
 * 生成签证材料清单
 * @param nationality ISO 2-letter country code or country name
 */
export function generateVisaChecklist(nationality: string): string[] {
  const visa = getVisaRequirements(nationality);

  const checklist: string[] = [
    `✅ Check visa type required: ${visa.visaType.replace(/-/g, ' ')}`,
    `✅ Passport validity: must be valid for 6+ months beyond travel dates`,
  ];

  if (visa.visaType === 'visa-free') {
    checklist.push(
      '✅ Book return/onward flight ticket',
      '✅ Book hotel accommodation (confirmation needed at border)',
      `✅ Note: visa-free stay limited to ${visa.duration}`,
      '✅ Download offline maps before arrival (Google Maps blocked in China)',
      '✅ Set up payment method (Alipay international or WeChat Pay)',
      '✅ Get a local SIM card or international roaming plan',
      '✅ Download VPN before departure (VPN sites blocked in China)',
    );
  } else if (visa.visaType === 'embassy-visa') {
    checklist.push(
      '✅ Download and complete visa application form from visaforchina.cn',
      '✅ Prepare passport-size photo (white background, 33x48mm)',
      '✅ Book return/onward flight ticket',
      '✅ Book hotel accommodation (confirmation letter)',
      '✅ Prepare bank statements (last 3 months)',
      '✅ Prepare employment letter or proof of enrollment',
      `✅ Allow ${visa.processingTime} for processing`,
      `✅ Budget for visa fee: ${visa.cost}`,
      '✅ Download offline maps before arrival',
      '✅ Set up payment method (Alipay international or WeChat Pay)',
      '✅ Download VPN before departure',
    );
  }

  return checklist;
}

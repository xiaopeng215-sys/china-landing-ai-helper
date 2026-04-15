/**
 * 支付技能模块
 * 中国支付方式完整指引
 */

export interface PaymentGuide {
  method: 'alipay' | 'wechat-pay' | 'cash' | 'card';
  setupSteps: string[];
  whereToUse: string[];
  limitations: string[];
  tips: string[];
}

const PAYMENT_GUIDES: Record<string, PaymentGuide> = {
  alipay: {
    method: 'alipay',
    setupSteps: [
      'Download "Alipay" from App Store or Google Play',
      'Open app → tap "Sign Up" → enter your phone number',
      'Verify with SMS code',
      'Go to: Me → Bank Cards → Add Card',
      'Enter your Visa or Mastercard details (foreign cards accepted)',
      'Verify with a small charge (usually $0.01-1.00, refunded)',
      'Notify your bank before adding the card to avoid blocks',
      'Set up Face ID or PIN for quick payments',
    ],
    whereToUse: [
      'Supermarkets and convenience stores (7-Eleven, FamilyMart, etc.)',
      'Restaurants and food courts',
      'Metro and bus (scan QR at gates)',
      'Taxis and Didi rides',
      'Street vendors and markets',
      'Online shopping (Taobao, JD.com)',
      'Hospital and pharmacy payments',
      'Tourist attractions ticket purchase',
    ],
    limitations: [
      'Some foreign cards may be declined during initial setup',
      'Daily transaction limit for foreign cards: ¥50,000',
      'Some features require Chinese ID verification (not available to foreigners)',
      'Peer-to-peer transfers may be limited without full verification',
      'Requires stable internet connection',
    ],
    tips: [
      'Alipay International version is specifically designed for foreign visitors',
      'Keep ¥200-500 cash as backup in case of payment failures',
      'Screenshot your QR code for offline use in areas with poor signal',
      'Alipay also works for bike sharing (Hellobike, Meituan bikes)',
      'Customer service available in English: 95188',
    ],
  },

  'wechat-pay': {
    method: 'wechat-pay',
    setupSteps: [
      'Download "WeChat" from App Store or Google Play',
      'Register with your phone number',
      'Go to: Me → Pay → Wallet → Bank Cards → Add Card',
      'Enter your Visa or Mastercard details',
      'Verify with SMS code sent to your phone',
      'Notify your bank before adding to avoid blocks',
      'Set up payment PIN (6 digits)',
      'Enable Face ID for faster payments',
    ],
    whereToUse: [
      'Most restaurants, cafes, and bars',
      'Retail stores and shopping malls',
      'Convenience stores',
      'Taxis and Didi',
      'Online services and apps',
      'Splitting bills with friends',
      'Red envelope (红包) gifting',
    ],
    limitations: [
      'Foreign card setup can be tricky — some banks block the initial charge',
      'Full features require Chinese phone number and ID',
      'Peer-to-peer transfers limited for foreign accounts',
      'Some merchants only accept Alipay, not WeChat Pay',
    ],
    tips: [
      'WeChat is also China\'s primary messaging app — install it regardless for communication',
      'Use WeChat to contact hotels, restaurants, and local contacts',
      'WeChat mini-programs (小程序) offer many services within the app',
      'If card setup fails, try a different card or use Alipay instead',
    ],
  },

  cash: {
    method: 'cash',
    setupSteps: [
      'Exchange currency before departure at your local bank (best rates)',
      'Or exchange at airport on arrival (Bank of China counters)',
      'Or withdraw from ATMs in China (UnionPay network)',
      'Recommended: bring USD/EUR and exchange in China for better rates',
      'Keep small bills (¥10, ¥20, ¥50) for markets and small vendors',
    ],
    whereToUse: [
      'Traditional markets and street food stalls',
      'Small local restaurants',
      'Rural areas and smaller towns',
      'Taxis (always accepted)',
      'Temple entrance fees',
      'Tips (though tipping is not customary)',
    ],
    limitations: [
      'Many modern shops and restaurants in cities are cashless',
      'Counterfeit notes exist — use official exchange channels only',
      'Large bills (¥100) may be refused at small vendors',
      'ATM withdrawal fees: ¥20-30 per transaction plus your bank\'s fees',
    ],
    tips: [
      'Always carry ¥200-500 cash as emergency backup',
      'Bank of China ATMs are most reliable for foreign cards',
      'Exchange rate: check xe.com before exchanging',
      'Keep exchange receipts — needed to convert RMB back when leaving',
      'Coins are rarely used — most transactions are in notes',
    ],
  },

  card: {
    method: 'card',
    setupSteps: [
      'Notify your bank of travel to China before departure',
      'Check if your card has foreign transaction fees (typically 1-3%)',
      'Confirm your card works on UnionPay or Visa/Mastercard networks',
      'Save your bank\'s international emergency number',
      'Consider getting a travel card with no foreign fees (Wise, Revolut)',
    ],
    whereToUse: [
      'International hotels (4-5 star)',
      'Airport duty-free shops',
      'Some high-end restaurants',
      'International chain stores (Starbucks, McDonald\'s)',
      'ATM cash withdrawals',
    ],
    limitations: [
      'Most local shops, restaurants, and markets do NOT accept foreign cards',
      'Foreign transaction fees: 1-3% per transaction',
      'ATM fees: ¥20-30 per withdrawal plus bank fees',
      'Visa/Mastercard acceptance is limited outside tourist areas',
      'UnionPay has wider acceptance than Visa/Mastercard in China',
    ],
    tips: [
      'Do NOT rely on credit/debit cards as primary payment in China',
      'Set up Alipay or WeChat Pay before arrival',
      'Wise or Revolut cards have better exchange rates and lower fees',
      'Keep card for hotel deposits and international purchases only',
    ],
  },
};

/**
 * 获取支付方式指引
 * @param method 支付方式
 */
export function getPaymentGuide(method: string): PaymentGuide {
  const key = method.toLowerCase().replace(/\s+/g, '-');
  return PAYMENT_GUIDES[key] || PAYMENT_GUIDES['alipay'];
}

/**
 * 生成来中国前的支付准备清单
 */
export function generatePaymentChecklist(): string[] {
  return [
    '📱 Download Alipay (international version) and set up with your foreign Visa/Mastercard',
    '📱 Download WeChat and set up WeChat Pay as backup',
    '💳 Notify your bank of travel to China to prevent card blocks',
    '💵 Exchange ¥500-1000 cash before departure or at airport on arrival',
    '🏧 Locate Bank of China ATMs at your destination (most reliable for foreign cards)',
    '📋 Save your bank\'s international emergency number',
    '💡 Check if your card has foreign transaction fees — consider a Wise/Revolut card',
    '🔔 Test Alipay payment before leaving tourist areas',
    '📸 Screenshot your Alipay QR code for offline use',
    '⚠️ Keep ¥200-500 cash as emergency backup at all times',
  ];
}

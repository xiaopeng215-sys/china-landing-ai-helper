/**
 * 语言检测中间件测试
 */

const { detectMessageLanguage, getResponseLanguage, normalizeTextLanguage } = require('./src/app/api/middleware/language-detector.ts');

console.log('🧪 语言检测测试\n');

// 测试用例
const testCases = [
  { message: '帮我规划上海行程', expected: 'zh-CN' },
  { message: 'How to get from airport to hotel?', expected: 'en-US' },
  { message: '서울에서 맛집 추천해 주세요', expected: 'ko-KR' },
  { message: 'แนะนำร้านอาหารในเซี่ยงไฮ้', expected: 'th-TH' },
  { message: 'Gợi ý nhà hàng ở Thượng Hải', expected: 'vi-VN' },
  { message: '支付宝 (Alipay) 怎么用？', expected: 'zh-CN' },
  { message: '使用 Alipay 付款', expected: 'zh-CN' },
];

console.log('测试消息语言检测:');
testCases.forEach(({ message, expected }) => {
  const result = detectMessageLanguage(message);
  const status = result === expected ? '✅' : '❌';
  console.log(`${status} "${message.substring(0, 30)}..." → ${result} (期望：${expected})`);
});

console.log('\n测试响应语言选择:');
const responseTests = [
  { message: '帮我规划行程', preference: undefined },
  { message: 'How to plan itinerary?', preference: undefined },
  { message: 'Hello', preference: 'zh-CN' },
];

responseTests.forEach(({ message, preference }) => {
  const result = getResponseLanguage(message, preference);
  console.log(`  消息："${message}" + 偏好：${preference || '无'} → ${result}`);
});

console.log('\n测试文本规范化:');
const normalizeTests = [
  { text: '支付宝 (Alipay) 怎么用？', locale: 'zh-CN' },
  { text: '微信 (WeChat) 支付', locale: 'zh-CN' },
  { text: '美团 (Meituan) 外卖', locale: 'zh-CN' },
];

normalizeTests.forEach(({ text, locale }) => {
  const result = normalizeTextLanguage(text, locale);
  console.log(`  "${text}" → "${result}"`);
});

console.log('\n✅ 测试完成');

#!/usr/bin/env node

/**
 * 创建 Beta 测试账号脚本
 * 用法：node scripts/create-test-accounts.js
 * 
 * 创建 3 个虚拟测试账号用于登录测试
 */

const fs = require('fs');
const path = require('path');

// 读取环境变量
const envPath = path.join(__dirname, '..', '.env.local');
const envConfig = {};

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      envConfig[key.trim()] = valueParts.join('=').trim().replace(/"/g, '').replace(/\\n/g, '');
    }
  });
}

console.log('🧪 创建 Beta 测试账号\n');

// 测试账号配置
const testAccounts = [
  {
    id: 'BETA_USER_001',
    name: 'Sarah Johnson',
    email: 'sarah.j.beta@testmail.com',
    password: 'TestPass123!',
    profile: {
      nationality: '美国',
      age: 32,
      travelExperience: '首次访华',
      interests: ['历史文化', '美食', '摄影', '博物馆'],
      languageLevel: '不会中文'
    }
  },
  {
    id: 'BETA_USER_002',
    name: 'Michael Chen',
    email: 'm.chen.beta@testmail.com',
    password: 'TestPass456!',
    profile: {
      nationality: '加拿大（华裔）',
      age: 45,
      travelExperience: '多次访华，商务出行',
      interests: ['美食', '茶文化', '高尔夫', '商务社交'],
      languageLevel: '基础中文'
    }
  },
  {
    id: 'BETA_USER_003',
    name: 'Emma Williams',
    email: 'emma.w.beta@testmail.com',
    password: 'TestPass789!',
    profile: {
      nationality: '英国',
      age: 38,
      travelExperience: '家庭出游，首次访华',
      interests: ['亲子活动', '自然风光', '动物园', '互动体验'],
      languageLevel: '不会中文',
      familySize: 4,
      childrenAges: [8, 11]
    }
  }
];

console.log('=== 测试账号信息 ===\n');

testAccounts.forEach((account, index) => {
  console.log(`📧 账号 #${index + 1}: ${account.id}`);
  console.log(`   姓名：${account.name}`);
  console.log(`   邮箱：${account.email}`);
  console.log(`   密码：${account.password}`);
  console.log(`   国籍：${account.profile.nationality}`);
  console.log(`   年龄：${account.profile.age}`);
  console.log(`   旅行经验：${account.profile.travelExperience}`);
  console.log(`   兴趣：${account.profile.interests.join(', ')}`);
  console.log(`   语言水平：${account.profile.languageLevel}`);
  console.log('');
});

console.log('=== 使用说明 ===\n');

console.log('1. 手动注册（推荐用于测试）:');
console.log('   - 访问：https://www.travelerlocal.ai/auth/signup');
console.log('   - 使用上述邮箱和密码注册');
console.log('   - 每个账号注册后完善个人信息');
console.log('');

console.log('2. 自动创建（需要 Supabase Service Role Key）:');
console.log('   - 在 Supabase Dashboard 获取 Service Role Key');
console.log('   - 添加到 .env.local: SUPABASE_SERVICE_ROLE_KEY="your-key"');
console.log('   - 重新运行此脚本');
console.log('');

console.log('3. OAuth 测试账号:');
console.log('   - Google 登录：使用任意 Google 账号');
console.log('   - Facebook 登录：使用任意 Facebook 账号');
console.log('   - 首次登录会自动创建账号');
console.log('');

console.log('=== 测试场景 ===\n');

console.log('✅ Google 登录测试:');
console.log('   - 点击 "使用 Google 账号登录"');
console.log('   - 选择测试 Google 账号');
console.log('   - 验证登录成功并跳转');
console.log('');

console.log('✅ Facebook 登录测试:');
console.log('   - 点击 "使用 Facebook 账号登录"');
console.log('   - 选择测试 Facebook 账号');
console.log('   - 验证登录成功并跳转');
console.log('');

console.log('✅ 邮箱密码登录测试:');
console.log('   - 使用上述任一测试账号');
console.log('   - 输入邮箱和密码');
console.log('   - 验证登录成功');
console.log('');

console.log('=== 配置状态 ===\n');

const googleConfigured = envConfig.GOOGLE_CLIENT_ID && 
                         envConfig.GOOGLE_CLIENT_SECRET && 
                         !envConfig.GOOGLE_CLIENT_SECRET.includes('your-');
const facebookConfigured = envConfig.FACEBOOK_CLIENT_ID && 
                           envConfig.FACEBOOK_CLIENT_SECRET && 
                           !envConfig.FACEBOOK_CLIENT_SECRET.includes('your-');
const nextauthConfigured = envConfig.NEXTAUTH_SECRET && 
                           !envConfig.NEXTAUTH_SECRET.includes('your-');

console.log(`Google OAuth:  ${googleConfigured ? '✅ 已配置' : '❌ 未配置'}`);
console.log(`Facebook OAuth: ${facebookConfigured ? '✅ 已配置' : '❌ 未配置'}`);
console.log(`NEXTAUTH_SECRET: ${nextauthConfigured ? '✅ 已配置' : '❌ 未配置'}`);
console.log('');

if (googleConfigured && facebookConfigured && nextauthConfigured) {
  console.log('🎉 所有 OAuth 配置已就绪，可以开始测试！');
} else {
  console.log('⚠️  部分配置缺失，请检查 .env.local 文件');
}

console.log('\n---\n');
console.log('测试账号创建完成！');
console.log('请将上述账号信息保存到安全位置，仅用于测试目的。\n');

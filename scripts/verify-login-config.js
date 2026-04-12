#!/usr/bin/env node

/**
 * 登录系统配置验证脚本
 * 用法：node scripts/verify-login-config.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '..', '.env.local');
const envProdPath = path.join(__dirname, '..', '.env.production.local');

console.log('🔐 登录系统配置验证工具\n');

// 读取环境变量文件
function readEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const config = {};
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && !key.startsWith('#')) {
      config[key.trim()] = valueParts.join('=').trim().replace(/"/g, '').replace(/\\n/g, '');
    }
  });
  return config;
}

// 验证配置是否有效
function isValidConfig(value) {
  return !!value && 
         !value.includes('your-') && 
         !value.includes('example') && 
         !value.includes('empty') &&
         value.trim() !== '' &&
         value !== '""';
}

// 生成随机密钥
function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

const localConfig = readEnv(envPath);
const prodConfig = readEnv(envProdPath);

if (!localConfig) {
  console.log('❌ .env.local 文件不存在');
  console.log('   请复制 .env.login-template 为 .env.local 并配置相应值\n');
  process.exit(1);
}

console.log('=== 开发环境配置 (.env.local) ===\n');

const checks = [
  {
    name: 'NEXTAUTH_SECRET',
    value: localConfig.NEXTAUTH_SECRET,
    required: true,
    hint: '运行 node scripts/verify-login-config.js --generate-secret 生成新密钥'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    value: localConfig.NEXT_PUBLIC_SUPABASE_URL,
    required: true,
    hint: '从 https://app.supabase.com 获取'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: localConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    required: true,
    hint: '从 Supabase 项目设置获取'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    value: localConfig.SUPABASE_SERVICE_ROLE_KEY,
    required: true,
    hint: '从 Supabase 项目设置获取 (保密)'
  },
  {
    name: 'GOOGLE_CLIENT_ID',
    value: localConfig.GOOGLE_CLIENT_ID,
    required: false,
    hint: '从 https://console.cloud.google.com/apis/credentials 获取'
  },
  {
    name: 'GOOGLE_CLIENT_SECRET',
    value: localConfig.GOOGLE_CLIENT_SECRET,
    required: false,
    hint: '从 Google Cloud Console 获取'
  },
  {
    name: 'FACEBOOK_CLIENT_ID',
    value: localConfig.FACEBOOK_CLIENT_ID,
    required: false,
    hint: '从 https://developers.facebook.com/apps 获取'
  },
  {
    name: 'FACEBOOK_CLIENT_SECRET',
    value: localConfig.FACEBOOK_CLIENT_SECRET,
    required: false,
    hint: '从 Facebook Developers 获取'
  },
  {
    name: 'EMAIL_SERVER',
    value: localConfig.EMAIL_SERVER,
    required: false,
    hint: '配置 SMTP 服务器或使用 SendGrid'
  },
];

let allPassed = true;
let oauthEnabled = 0;

checks.forEach(check => {
  const valid = isValidConfig(check.value);
  const status = valid ? '✅' : (check.required ? '❌' : '⚠️');
  
  if (check.required && !valid) {
    allPassed = false;
  }
  
  if (check.name.includes('SECRET') && valid) {
    console.log(`${status} ${check.name}: ✅ 已配置`);
  } else if (check.name.includes('KEY') && valid) {
    console.log(`${status} ${check.name}: ✅ 已配置`);
  } else if (valid) {
    console.log(`${status} ${check.name}: ✅ 已配置`);
  } else {
    console.log(`${status} ${check.name}: ${check.required ? '❌ 必需' : '⚠️ 可选'}`);
    if (check.hint) {
      console.log(`   💡 ${check.hint}`);
    }
  }
  
  // 统计 OAuth 启用情况
  if (check.name === 'GOOGLE_CLIENT_SECRET' && valid) oauthEnabled++;
  if (check.name === 'FACEBOOK_CLIENT_SECRET' && valid) oauthEnabled++;
});

console.log('\n=== 生产环境配置 (.env.production.local) ===\n');

if (prodConfig) {
  const prodChecks = [
    { name: 'NEXTAUTH_SECRET', value: prodConfig.NEXTAUTH_SECRET },
    { name: 'GOOGLE_CLIENT_SECRET', value: prodConfig.GOOGLE_CLIENT_SECRET },
    { name: 'FACEBOOK_CLIENT_SECRET', value: prodConfig.FACEBOOK_CLIENT_SECRET },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: prodConfig.NEXT_PUBLIC_SUPABASE_URL },
  ];
  
  prodChecks.forEach(check => {
    const valid = isValidConfig(check.value);
    const status = valid ? '✅' : '❌';
    console.log(`${status} ${check.name}: ${valid ? '已配置' : '未配置 (危险!)'}`);
    if (!valid && check.name === 'NEXTAUTH_SECRET') {
      console.log('   ⚠️ 生产环境必须配置 NEXTAUTH_SECRET');
    }
  });
} else {
  console.log('❌ .env.production.local 文件不存在');
  console.log('   生产部署前必须创建此文件并配置密钥\n');
}

console.log('\n=== 登录方式状态 ===\n');

const supabaseValid = isValidConfig(localConfig.NEXT_PUBLIC_SUPABASE_URL) && 
                      isValidConfig(localConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const googleValid = isValidConfig(localConfig.GOOGLE_CLIENT_ID) && 
                    isValidConfig(localConfig.GOOGLE_CLIENT_SECRET);
const facebookValid = isValidConfig(localConfig.FACEBOOK_CLIENT_ID) && 
                      isValidConfig(localConfig.FACEBOOK_CLIENT_SECRET);
const emailValid = isValidConfig(localConfig.EMAIL_SERVER);

console.log(`邮箱密码登录：${supabaseValid ? '✅ 可用 (Supabase)' : '⚠️ 开发模式 (内存 Fallback)'}`);
console.log(`Google 登录：   ${googleValid ? '✅ 可用' : '❌ 已禁用'}`);
console.log(`Facebook 登录： ${facebookValid ? '✅ 可用' : '❌ 已禁用'}`);
console.log(`Email Magic Link: ${emailValid ? '✅ 可用' : '❌ 已禁用'}`);

console.log('\n=== 总结 ===\n');

if (allPassed) {
  console.log('✅ 所有必需配置已就绪');
} else {
  console.log('❌ 存在必需配置缺失，请修复后重试');
}

if (oauthEnabled === 0) {
  console.log('⚠️  未配置任何 OAuth 登录方式');
} else if (oauthEnabled === 1) {
  console.log('⚠️  仅配置了 1 种 OAuth 登录方式，建议配置多种以提高用户体验');
} else {
  console.log(`✅ 已配置 ${oauthEnabled} 种 OAuth 登录方式`);
}

if (!prodConfig || !isValidConfig(prodConfig?.NEXTAUTH_SECRET)) {
  console.log('⚠️  生产环境配置不完整，部署前请修复');
}

console.log('\n💡 提示：');
console.log('   - 运行 node scripts/verify-login-config.js --generate-secret 生成 NEXTAUTH_SECRET');
console.log('   - 参考 docs/login-system-test-report.md 获取详细配置指南');
console.log('   - 使用 .env.login-template 作为配置参考\n');

// 命令行参数处理
if (process.argv.includes('--generate-secret')) {
  const secret = generateSecret();
  console.log('🔑 生成的 NEXTAUTH_SECRET:');
  console.log(`   ${secret}\n`);
  console.log('请将此值添加到 .env.local 和 .env.production.local 文件中\n');
}

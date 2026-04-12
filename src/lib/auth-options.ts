/**
 * NextAuth 配置选项
 * 单独导出以便在其他地方复用
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// 自定义 OpenAI Provider (NextAuth.js v4 格式)
const OpenAIProvider = {
  id: 'openai',
  name: 'OpenAI',
  type: 'oauth' as const,
  version: '2.0',
  authorization: {
    url: 'https://api.openai.com/oauth/authorize',
    params: { scope: 'openid profile email' },
  },
  token: 'https://api.openai.com/oauth/token',
  userinfo: 'https://api.openai.com/oauth/userinfo',
  clientId: process.env.OPENAI_CLIENT_ID,
  clientSecret: process.env.OPENAI_CLIENT_SECRET,
  profile(profile: any) {
    return {
      id: profile.sub,
      email: profile.email,
      name: profile.name || profile.email,
      avatar: profile.picture,
    };
  },
};

// 创建 Supabase 客户端
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // 检查是否为占位符值
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl.includes('your-project') || 
      supabaseKey === 'your-anon-key') {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// 辅助函数：检查配置是否为有效值（非占位符）
function isValidConfig(value: string | undefined): boolean {
  return !!value && 
         !value.includes('your-') && 
         value !== 'dummy-value' &&
         value.length > 10;
}

/**
 * NextAuth 配置选项
 */
export const authOptions: NextAuthOptions = {
  adapter: undefined,
  
  providers: [
    // 邮箱登录（无密码，发送魔法链接）
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      maxAge: 24 * 60 * 60, // 24 小时
    }),
    
    // 账号密码登录
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('邮箱和密码不能为空');
        }

        const supabase = getSupabaseClient();
        
        if (!supabase) {
          console.warn('Supabase 未配置，使用 Mock 认证');
          
          // 演示模式 - 允许任意邮箱登录（用于临时解决生产环境问题）
          if (process.env.USE_MOCK_AUTH === 'true' || process.env.NODE_ENV === 'development') {
            // 简单的密码验证（演示用，生产环境不应这样）
            if (credentials.password.length >= 6) {
              return {
                id: `mock-${credentials.email.replace(/[^a-zA-Z0-9]/g, '-')}`,
                email: credentials.email,
                name: credentials.email.split('@')[0],
                avatar: null,
              };
            }
            throw new Error('密码长度至少 6 位');
          }
          
          // 生产模式 - 仅允许测试账号
          if (credentials.email === 'test@example.com' && credentials.password === 'test123') {
            return {
              id: 'mock-user-1',
              email: credentials.email,
              name: '测试用户',
              avatar: null,
            };
          }
          throw new Error('认证服务未配置，请联系管理员');
        }

        // 从数据库查询用户
        const { data: user, error } = await supabase
          .from('users')
          .select('id, email, name, avatar, password_hash')
          .eq('email', credentials.email)
          .single();

        if (error || !user) {
          throw new Error('用户不存在');
        }

        // 验证密码
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        
        if (!isValid) {
          throw new Error('密码错误');
        }

        // 返回用户信息（不包含密码）
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        };
      },
    }),
    
    // Google 登录
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    
    // Facebook 登录
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
    
    // OpenAI 登录
    OpenAIProvider,
  ],
  
  // 使用 JWT 模式（无数据库 session）
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  
  // 数据库配置（用于存储账号关联信息）
  // 注意：我们使用自定义的 linkAccount 来避免创建 account 表
  
  // 页面配置
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  
  // 事件回调
  events: {
    async createUser({ user }) {
      // 新用户注册时初始化会员积分
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase
          .from('membership_points')
          .insert({
            user_id: user.id,
            points: 0,
            lifetime_points: 0,
            level: 1,
          });
      }
    },
    
    async linkAccount({ account, user }) {
      // 当用户关联新的 OAuth provider 时
      const supabase = getSupabaseClient();
      if (supabase) {
        // 检查用户是否已存在
        const { data: existingUser } = await supabase
          .from('users')
          .select('id, provider_accounts')
          .eq('id', user.id)
          .single();
        
        if (existingUser) {
          const currentAccounts = existingUser.provider_accounts || [];
          const accountInfo = {
            provider: account.provider,
            provider_account_id: account.providerAccountId,
          };
          
          // 检查是否已存在
          const exists = currentAccounts.some(
            (acc: any) => acc.provider === account.provider
          );
          
          if (!exists) {
            await supabase
              .from('users')
              .update({
                provider_accounts: [...currentAccounts, accountInfo]
              })
              .eq('id', existingUser.id);
          }
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.avatar = user.avatar || user.image;
      }
      // 保存 provider 信息
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.avatar = token.avatar as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
  
  // 安全配置
  secret: process.env.NEXTAUTH_SECRET,
  
  // 调试模式 (开发环境启用)
  debug: process.env.NODE_ENV === 'development',
};

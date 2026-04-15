/**
 * NextAuth 配置选项
 * 单独导出以便在其他地方复用
 *
 * 注意：providers 列表在每次请求时动态构建，确保运行时环境变量生效
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

// 辅助函数：检查配置是否为有效值（存在且非空即可）
function isValidConfig(value: string | undefined): boolean {
  return !!(value && value.length > 0);
}

/**
 * 动态构建 providers 列表（在请求时执行，确保运行时环境变量生效）
 */
function buildProviders() {
  const providers = [];

  // 邮箱登录（仅在 EMAIL_SERVER 配置了真实值时启用）
  if (isValidConfig(process.env.EMAIL_SERVER) && !process.env.EMAIL_SERVER?.includes('your-sendgrid')) {
    providers.push(EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM || 'no-reply@travelerlocal.ai',
      maxAge: 24 * 60 * 60,
    }));
  }

  // 账号密码登录（始终启用）
  providers.push(CredentialsProvider({
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
    }));

  // Google 登录（始终注册，环境变量在运行时注入）
  providers.push(GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }));

  // Facebook 登录（仅在配置了有效凭证时启用）
  if (isValidConfig(process.env.FACEBOOK_CLIENT_ID) && isValidConfig(process.env.FACEBOOK_CLIENT_SECRET)) {
    providers.push(FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }));
  }

  // OpenAI OAuth 暂不支持（OpenAI 未提供公开 OAuth 端点）
  // if (isValidConfig(process.env.OPENAI_CLIENT_ID) && isValidConfig(process.env.OPENAI_CLIENT_SECRET)) {
  //   providers.push(OpenAIProvider);
  // }

  return providers;
}

/**
 * 动态生成 NextAuth 配置选项（每次请求时调用，确保运行时环境变量生效）
 */
export function getAuthOptions(): NextAuthOptions {
  return {
  adapter: undefined,
  providers: buildProviders(),
  
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
  
  // JWT & Session 回调（必须在 callbacks 里，不能放 events）
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.avatar = (user as any).avatar || user.image;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).avatar = token.avatar as string;
        (session.user as any).provider = token.provider as string;
      }
      return session;
    },
  },

  // 事件回调
  events: {
    async createUser({ user }) {
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
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id, provider_accounts')
          .eq('id', user.id)
          .single();

        if (existingUser) {
          const currentAccounts = existingUser.provider_accounts || [];
          const exists = currentAccounts.some(
            (acc: any) => acc.provider === account.provider
          );
          if (!exists) {
            await supabase
              .from('users')
              .update({
                provider_accounts: [...currentAccounts, { provider: account.provider, provider_account_id: account.providerAccountId }]
              })
              .eq('id', existingUser.id);
          }
        }
      }
    },
  },
  
  // 安全配置
  secret: process.env.NEXTAUTH_SECRET,
  
  // 调试模式 (开发环境启用)
  debug: process.env.NODE_ENV === 'development',
  };
}

// 向后兼容：保留 authOptions 导出（注意：这是构建时的快照，生产环境请使用 getAuthOptions()）
export const authOptions: NextAuthOptions = getAuthOptions();


import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import { SupabaseAdapter } from '@auth/supabase-adapter';
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
         !value.includes('example') && 
         value.trim() !== '';
}

// 导出配置供 NextAuth 使用（不导出为 HTTP 路由）
const authOptions: NextAuthOptions = {
  providers: [
    // 邮箱密码登录
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('请输入邮箱和密码');
        }

        const supabase = getSupabaseClient();
        
        // 内存存储 Fallback - 仅用于本地开发测试
        if (!supabase) {
          console.warn('[Auth Fallback] ⚠️ 开发模式：使用内存存储，仅限本地测试');
          // 开发模式：仅允许特定测试邮箱
          const allowedDevEmails = ['test@example.com', 'demo@example.com', 'admin@example.com'];
          if (!allowedDevEmails.includes(credentials.email)) {
            throw new Error('开发模式仅允许测试账号登录：test@example.com / demo@example.com / admin@example.com');
          }
          // 开发模式密码：固定测试密码
          if (credentials.password !== 'Test123456') {
            throw new Error('开发模式测试密码：Test123456');
          }
          
          console.warn('[Auth Fallback] ⚠️ 警告：生产环境必须配置 Supabase 数据库！');
          return {
            id: `dev_user_${credentials.email.replace(/[^a-zA-Z0-9]/g, '_')}`,
            email: credentials.email,
            name: credentials.email.split('@')[0],
            avatar: undefined,
          };
        }

        // 查询用户
        const { data: user, error } = await supabase
          .from('users')
          .select('id, email, name, password_hash, avatar')
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

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        };
      }
    }),

    // 邮箱验证码登录 (Magic Link) - 仅在配置有效时启用
    ...(isValidConfig(process.env.EMAIL_SERVER) ? [EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM || 'noreply@china-landing-ai-helper.com',
    })] : []),
    
    // Google 登录 - 仅在配置有效时启用
    ...(isValidConfig(process.env.GOOGLE_CLIENT_ID) && isValidConfig(process.env.GOOGLE_CLIENT_SECRET) ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code'
          }
        }
      })
    ] : []),
    
    // Facebook 登录 - 仅在配置有效时启用
    ...(isValidConfig(process.env.FACEBOOK_CLIENT_ID) && isValidConfig(process.env.FACEBOOK_CLIENT_SECRET) ? [
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        authorization: {
          params: {
            scope: 'email,public_profile'
          }
        }
      })
    ] : []),
    
    // OpenAI 登录 - 仅在配置有效时启用
    ...(isValidConfig(process.env.OPENAI_CLIENT_ID) && isValidConfig(process.env.OPENAI_CLIENT_SECRET) ? [
      OpenAIProvider
    ] : []),
  ],
  
  adapter: (process.env.NEXT_PUBLIC_SUPABASE_URL && 
            !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project') &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key')
    ? (SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      }) as any) // 类型断言以解决 @auth/supabase-adapter 与 next-auth v4 的类型不兼容
    : undefined,
  
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 天
  },
  
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
    newUser: '/auth/signup',
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth 登录时的用户数据同步
      if (account?.provider && user?.email) {
        const supabase = getSupabaseClient();
        if (supabase) {
          // 检查是否已有相同邮箱的用户
          const { data: existingUser } = await supabase
            .from('users')
            .select('id, email, provider_accounts')
            .eq('email', user.email)
            .single();
          
          if (existingUser) {
            // 已有用户，更新 provider_accounts 以支持多账号关联
            const currentAccounts = existingUser.provider_accounts || [];
            const accountInfo = {
              provider: account.provider,
              provider_account_id: account.provider_account_id,
              linked_at: new Date().toISOString()
            };
            
            // 避免重复添加
            const exists = currentAccounts.some(
              (acc: any) => acc.provider === account.provider && acc.provider_account_id === account.provider_account_id
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

const handler = NextAuth(authOptions);

// 导出 handler 作为 HTTP 路由
export { handler as GET, handler as POST };

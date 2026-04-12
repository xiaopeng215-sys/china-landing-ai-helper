import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// 创建 Supabase 客户端
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

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
        if (!supabase) {
          throw new Error('数据库未配置');
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

    // 邮箱验证码登录 (Magic Link)
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM || 'noreply@china-landing-ai-helper.com',
    }),
    
    // Google 登录
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  
  adapter: process.env.NEXT_PUBLIC_SUPABASE_URL
    ? SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      })
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
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

export { handler as GET, handler as POST };

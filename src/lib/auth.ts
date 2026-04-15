/**
 * 自定义认证函数
 * 替代 NextAuth 用于登录
 */

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'travelerlocal-fallback-secret-2026'
);

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface SignInResult {
  ok: boolean;
  user?: User;
  error?: string;
  sessionId?: string;
}

/**
 * 创建 JWT token
 */
export async function createToken(user: User): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);

  return token;
}

/**
 * 验证 JWT token
 */
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      avatar: payload.avatar as string,
    };
  } catch {
    return null;
  }
}

/**
 * 凭证登录
 */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes('your-project') ||
    supabaseKey === 'your-anon-key'
  ) {
    return { ok: false, error: '认证服务未配置' };
  }

  const { createClient } = await import('@supabase/supabase-js');
  const bcrypt = await import('bcryptjs');
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, name, avatar, password_hash')
    .eq('email', email)
    .single();

  if (error || !user) {
    return { ok: false, error: '用户不存在' };
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return { ok: false, error: '密码错误' };
  }

  const userObj: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar ?? undefined,
  };
  const token = await createToken(userObj);

  return { ok: true, user: userObj, sessionId: token };
}

/**
 * 获取当前用户
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}

/**
 * 登出
 */
export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
}

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
  // Mock 认证逻辑
  if (process.env.USE_MOCK_AUTH === 'true' || process.env.NODE_ENV === 'development') {
    if (password.length >= 6) {
      const user: User = {
        id: `mock-${email.replace(/[^a-zA-Z0-9]/g, '-')}`,
        email,
        name: email.split('@')[0],
      };
      const token = await createToken(user);
      
      return {
        ok: true,
        user,
        sessionId: token,
      };
    }
    return { ok: false, error: '密码长度至少 6 位' };
  }

  // 生产模式需要连接数据库验证
  return { ok: false, error: '认证服务未配置' };
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

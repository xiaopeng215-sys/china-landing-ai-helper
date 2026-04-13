/**
 * 自定义认证客户端函数
 * 替代 next-auth/react 的 signIn, signOut
 */

import { useAuth, User } from '@/hooks/useAuth';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

export interface SignInResult {
  ok: boolean;
  error?: string;
  user?: User;
}

/**
 * 登录
 */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      return { ok: false, error: data.error || '登录失败' };
    }
    
    return { ok: true, user: data.user };
  } catch (error) {
    return { ok: false, error: '网络错误，请稍后重试' };
  }
}

/**
 * 登出
 */
export async function signOut(): Promise<void> {
  await fetch('/api/auth/logout', { credentials: 'include' });
  // 触发页面刷新
  window.location.href = '/';
}

/**
 * 获取当前用户
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

// Re-export useAuth hook
export { useAuth };

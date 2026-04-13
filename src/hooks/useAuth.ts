/**
 * 自定义认证 Hook
 * 替代 next-auth/react 的 useSession
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * 获取当前用户
 */
async function fetchUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

/**
 * 登录
 */
async function loginUser(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
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
    
    return { ok: true };
  } catch (error) {
    return { ok: false, error: '网络错误，请稍后重试' };
  }
}

/**
 * 登出
 */
async function logoutUser(): Promise<void> {
  await fetch('/api/auth/logout', { credentials: 'include' });
}

/**
 * 自定义认证 Hook
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始加载用户
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const u = await fetchUser();
        setUser(u);
        setError(null);
      } catch (e) {
        setError('获取用户信息失败');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // 登录
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser(email, password);
      if (result.ok) {
        const u = await fetchUser();
        setUser(u);
      } else {
        setError(result.error || '登录失败');
      }
      return result;
    } catch (e) {
      const error = '登录失败，请稍后重试';
      setError(error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (e) {
      setError('登出失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 刷新用户
  const refresh = useCallback(async () => {
    const u = await fetchUser();
    setUser(u);
  }, []);

  return { user, loading, error, login, logout, refresh };
}

export default useAuth;

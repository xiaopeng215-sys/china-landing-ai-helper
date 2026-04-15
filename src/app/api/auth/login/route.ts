/**
 * 自定义登录端点
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'travelerlocal-fallback-secret-2026'
);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 检查 Supabase 配置
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !supabaseKey ||
      supabaseUrl.includes('your-project') ||
      supabaseKey === 'your-anon-key'
    ) {
      return NextResponse.json(
        { error: 'Authentication service is not configured.' },
        { status: 503 }
      );
    }

    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 从数据库查询用户
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, avatar, password_hash')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar ?? null,
    };

    // 创建 JWT token
    const token = await new SignJWT({
      id: userPayload.id,
      email: userPayload.email,
      name: userPayload.name,
      avatar: userPayload.avatar,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(JWT_SECRET);

    // 设置 session cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 天
    });

    return NextResponse.json({ ok: true, user: userPayload });
  } catch (error) {
    console.error('[Auth Login] Error:', error);
    return NextResponse.json(
      { error: 'Sign in failed. Please try again later.' },
      { status: 500 }
    );
  }
}

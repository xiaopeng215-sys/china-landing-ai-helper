import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

/**
 * 用户注册 API
 * 支持邮箱密码注册，自动创建 Supabase 用户
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 密码强度验证 (至少 8 位，包含字母和数字)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: '密码必须至少 8 位，包含字母和数字' },
        { status: 400 }
      );
    }

    // 检查 Supabase 配置
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: '数据库未配置' },
        { status: 500 }
      );
    }

    // 创建 Supabase 客户端 (使用 service role key 进行管理员操作)
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 检查用户是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      );
    }

    // 密码加密
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建用户记录
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        name: name || email.split('@')[0],
        language: 'zh-CN',
        budget_range: 'medium',
        interests: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id, email, name')
      .single();

    if (insertError) {
      console.error('创建用户失败:', insertError);
      return NextResponse.json(
        { error: '注册失败，请稍后重试' },
        { status: 500 }
      );
    }

    // 返回成功响应 (不包含密码)
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error('注册 API 错误:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

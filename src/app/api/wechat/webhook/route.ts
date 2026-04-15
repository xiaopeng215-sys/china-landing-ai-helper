/**
 * 微信公众号 Webhook
 * GET  /api/wechat/webhook — 微信服务器验证
 * POST /api/wechat/webhook — 接收用户消息，返回 AI 回复
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyWechatSignature,
  parseWechatXml,
  buildTextReplyXml,
  WECHAT_EMPTY_REPLY,
} from '@/lib/wechat/parser';

// ── 环境变量 ──────────────────────────────────────────────────

const WECHAT_TOKEN = process.env.WECHAT_TOKEN ?? '';

// ── GET：服务器验证 ───────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;
  const signature = searchParams.get('signature') ?? '';
  const timestamp = searchParams.get('timestamp') ?? '';
  const nonce = searchParams.get('nonce') ?? '';
  const echostr = searchParams.get('echostr') ?? '';

  if (!WECHAT_TOKEN) {
    console.error('[WechatWebhook] WECHAT_TOKEN 未配置');
    return new NextResponse('Server misconfigured', { status: 500 });
  }

  if (verifyWechatSignature(WECHAT_TOKEN, signature, timestamp, nonce)) {
    // 验证通过，原样返回 echostr
    return new NextResponse(echostr, { status: 200 });
  }

  console.warn('[WechatWebhook] 签名验证失败');
  return new NextResponse('Forbidden', { status: 403 });
}

// ── POST：消息处理 ────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. 验证签名（防伪造请求）
  const { searchParams } = req.nextUrl;
  const signature = searchParams.get('signature') ?? '';
  const timestamp = searchParams.get('timestamp') ?? '';
  const nonce = searchParams.get('nonce') ?? '';

  if (WECHAT_TOKEN && !verifyWechatSignature(WECHAT_TOKEN, signature, timestamp, nonce)) {
    console.warn('[WechatWebhook] POST 签名验证失败');
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. 读取并解析 XML 消息体
  let xmlBody: string;
  try {
    xmlBody = await req.text();
  } catch {
    return new NextResponse(WECHAT_EMPTY_REPLY, { status: 200 });
  }

  const msg = parseWechatXml(xmlBody);
  if (!msg) {
    return new NextResponse(WECHAT_EMPTY_REPLY, { status: 200 });
  }

  const { FromUserName: openId, ToUserName: mpId, MsgType, Content, Event } = msg;

  // 3. 处理关注/取关事件
  if (MsgType === 'event') {
    if (Event === 'subscribe') {
      const welcomeXml = buildTextReplyXml({
        toUser: openId,
        fromUser: mpId,
        content:
          '👋 Welcome to China Landing Assistant!\n\n' +
          'I\'m here to help you navigate China like a pro.\n\n' +
          'Just ask me anything — payments, SIM cards, VPN, food, transport, or city guides! 🇨🇳',
      });
      return new NextResponse(welcomeXml, {
        status: 200,
        headers: { 'Content-Type': 'application/xml' },
      });
    }
    // 其他事件静默处理
    return new NextResponse(WECHAT_EMPTY_REPLY, { status: 200 });
  }

  // 4. 只处理文本消息，其他类型提示用户
  if (MsgType !== 'text' || !Content?.trim()) {
    const replyXml = buildTextReplyXml({
      toUser: openId,
      fromUser: mpId,
      content: 'Please send a text message and I\'ll be happy to help! 😊',
    });
    return new NextResponse(replyXml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
  }

  // 5. 调用 AI（复用 /api/chat）
  let aiReply: string;
  try {
    aiReply = await callChatApi(Content.trim(), openId);
  } catch (err) {
    console.error('[WechatWebhook] AI 调用失败:', err);
    aiReply = '⚠️ Something went wrong. Please try again later.';
  }

  // 6. 返回微信 XML 格式回复
  const replyXml = buildTextReplyXml({
    toUser: openId,
    fromUser: mpId,
    content: aiReply,
  });

  return new NextResponse(replyXml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  });
}

// ── 内部：调用 /api/chat ──────────────────────────────────────

async function callChatApi(message: string, userId: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, userId }),
  });

  if (!res.ok) {
    throw new Error(`Chat API responded with ${res.status}`);
  }

  const data = await res.json();
  // /api/chat 返回 { reply: string } 或 { text: string }
  return data.reply ?? data.text ?? 'Sorry, I could not generate a response.';
}

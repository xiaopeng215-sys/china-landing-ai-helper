/**
 * 微信消息解析工具
 * - XML 解析（使用 fast-xml-parser）
 * - 消息签名验证
 * - 响应 XML 生成
 */

import { createHash } from 'crypto';
import { XMLParser } from 'fast-xml-parser';

// ── 类型定义 ──────────────────────────────────────────────────

export interface WechatMessage {
  ToUserName: string;
  FromUserName: string;
  CreateTime: number;
  MsgType: 'text' | 'image' | 'voice' | 'event';
  Content?: string;       // text 消息
  MsgId?: string;
  Event?: string;         // event 类型（subscribe / unsubscribe）
  EventKey?: string;
}

export interface WechatTextReply {
  toUser: string;
  fromUser: string;
  content: string;
}

// ── XML 解析 ──────────────────────────────────────────────────

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: true,
  trimValues: true,
});

/**
 * 解析微信推送的 XML 消息体
 */
export function parseWechatXml(xmlStr: string): WechatMessage | null {
  try {
    const result = xmlParser.parse(xmlStr);
    const msg = result?.xml;
    if (!msg) return null;

    return {
      ToUserName: String(msg.ToUserName ?? ''),
      FromUserName: String(msg.FromUserName ?? ''),
      CreateTime: Number(msg.CreateTime ?? 0),
      MsgType: msg.MsgType as WechatMessage['MsgType'],
      Content: msg.Content ? String(msg.Content) : undefined,
      MsgId: msg.MsgId ? String(msg.MsgId) : undefined,
      Event: msg.Event ? String(msg.Event) : undefined,
      EventKey: msg.EventKey ? String(msg.EventKey) : undefined,
    };
  } catch (err) {
    console.error('[WechatParser] XML 解析失败:', err);
    return null;
  }
}

// ── 签名验证 ──────────────────────────────────────────────────

/**
 * 验证微信服务器签名
 * 微信签名算法：SHA1(sort([token, timestamp, nonce]).join(''))
 */
export function verifyWechatSignature(
  token: string,
  signature: string,
  timestamp: string,
  nonce: string,
): boolean {
  const arr = [token, timestamp, nonce].sort();
  const str = arr.join('');
  const hash = createHash('sha1').update(str).digest('hex');
  return hash === signature;
}

// ── 响应 XML 生成 ─────────────────────────────────────────────

/**
 * 生成微信文本回复 XML
 */
export function buildTextReplyXml({ toUser, fromUser, content }: WechatTextReply): string {
  const timestamp = Math.floor(Date.now() / 1000);
  // CDATA 包裹，防止特殊字符破坏 XML
  return `<xml>
  <ToUserName><![CDATA[${toUser}]]></ToUserName>
  <FromUserName><![CDATA[${fromUser}]]></FromUserName>
  <CreateTime>${timestamp}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${content}]]></Content>
</xml>`;
}

/**
 * 生成空回复（微信要求不处理时返回 "success" 字符串）
 */
export const WECHAT_EMPTY_REPLY = 'success';

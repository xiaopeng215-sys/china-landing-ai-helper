/**
 * Telegram Webhook API
 * POST /api/bot/telegram
 *
 * 验证 secret token → 解析 update → 处理指令 / AI 回答
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleBotMessage } from '@/lib/bot/message-handler';
import { sendMessage, sendMessageWithButtons } from '@/lib/bot/telegram-client';

// ── 指令回复内容 ──────────────────────────────────────────────

const WELCOME_MESSAGE = `👋 Welcome to *China Landing Assistant*!

I'm here to help you navigate China like a pro. Here's what I can do:

🔑 /essentials — Payments, SIM cards & VPN tips
🏨 /hotels — Find hotels in major cities
🍜 /food — Chinese food guide
📋 /timeline — Your 6-step landing checklist
🚨 /emergency — Emergency numbers

Or just *ask me anything* about traveling in China!`;

const ESSENTIALS_MESSAGE = `📱 *China Essentials*

💳 *Payments*
• Alipay (支付宝): Download international version → link Visa/Mastercard
• WeChat Pay: WeChat → Me → Pay → Add foreign card
• Cash: Keep ¥200–500 RMB as backup

📶 *SIM Card*
• Buy at airport on arrival (China Unicom recommended)
• Cost: ¥50–150 for 7–30 day plans (10–50GB)
• Bring your passport

🔒 *VPN — CRITICAL*
• Download BEFORE arriving (ExpressVPN / NordVPN / Astrill)
• Google, WhatsApp, Instagram are blocked without VPN`;

const EMERGENCY_MESSAGE = `🚨 *Emergency Numbers*

🚔 *110* — Police (报警)
🚑 *120* — Ambulance (急救)
🚒 *119* — Fire (消防)
🚗 *122* — Traffic accident
📞 *12301* — Tourist Hotline (English available)

Stay safe! 🙏`;

const TIMELINE_MESSAGE = `📋 *Your 6-Step China Landing Checklist*

1️⃣ *At the airport* — Buy a SIM card (China Unicom counter)
2️⃣ *Connect VPN* — Turn it on before opening any apps
3️⃣ *Set up payments* — Alipay or WeChat Pay with your foreign card
4️⃣ *Get to your hotel* — Use Didi (滴滴) or airport express train
5️⃣ *Exchange some cash* — ¥200–500 at airport Bank of China ATM
6️⃣ *Download offline maps* — Maps.me or Baidu Maps

You're all set! Ask me anything 🎉`;

const FOOD_MESSAGE = `🍜 *China Food Guide*

🥟 *Beijing*: Peking Duck, Jianbing, Zhajiangmian
🥟 *Shanghai*: Xiaolongbao (soup dumplings), Shengjianbao
🌶️ *Chengdu*: Hotpot, Mapo Tofu, Dan Dan Noodles
🫔 *Xi'an*: Roujiamo (Chinese burger), Biangbiang Noodles
🍜 *Guilin*: Rice Noodles (桂林米粉), Beer Fish

💡 *Tips*:
• Use Meituan (美团) or Eleme (饿了么) for food delivery
• Show the Chinese name to restaurant staff
• Most restaurants have picture menus

Ask me about a specific city or dish! 🍽️`;

const HOTELS_MESSAGE = `🏨 *Find Hotels in China*

Choose a city:`;

const HOTEL_BUTTONS = [
  [
    { text: '🏙️ Beijing', url: 'https://www.trip.com/hotels/beijing-hotel-list/' },
    { text: '🌆 Shanghai', url: 'https://www.trip.com/hotels/shanghai-hotel-list/' },
  ],
  [
    { text: '🐼 Chengdu', url: 'https://www.trip.com/hotels/chengdu-hotel-list/' },
    { text: '🏺 Xi\'an', url: 'https://www.trip.com/hotels/xian-hotel-list/' },
  ],
  [
    { text: '🌿 Guilin', url: 'https://www.trip.com/hotels/guilin-hotel-list/' },
    { text: '🌊 Guangzhou', url: 'https://www.trip.com/hotels/guangzhou-hotel-list/' },
  ],
];

// ── Webhook Handler ───────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 验证 Telegram secret token
  const secret = req.headers.get('x-telegram-bot-api-secret-token');
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = body?.message || body?.edited_message;
  if (!message?.text) {
    return NextResponse.json({ ok: true });
  }

  const chatId = String(message.chat.id);
  const userId = String(message.from?.id ?? chatId);
  const text: string = message.text.trim();

  // 立即返回 200，异步处理（Telegram 要求 5s 内响应）
  // 使用 waitUntil 模式：先 respond，再处理
  const responsePromise = handleUpdate(chatId, userId, text);

  // Next.js Edge/Node: 用 ctx.waitUntil 或直接 await（Vercel 会等 promise 完成）
  await responsePromise;

  return NextResponse.json({ ok: true });
}

async function handleUpdate(chatId: string, userId: string, text: string): Promise<void> {
  try {
    switch (text) {
      case '/start':
      case '/help':
        await sendMessage(chatId, WELCOME_MESSAGE);
        break;

      case '/essentials':
        await sendMessage(chatId, ESSENTIALS_MESSAGE);
        break;

      case '/emergency':
        await sendMessage(chatId, EMERGENCY_MESSAGE);
        break;

      case '/timeline':
        await sendMessage(chatId, TIMELINE_MESSAGE);
        break;

      case '/food':
        await sendMessage(chatId, FOOD_MESSAGE);
        break;

      case '/hotels':
        await sendMessageWithButtons(chatId, HOTELS_MESSAGE, HOTEL_BUTTONS);
        break;

      default: {
        // 其他文本 → 调用 AI
        const reply = await handleBotMessage(text, userId);
        await sendMessage(chatId, reply, { parse_mode: 'Markdown' });
        break;
      }
    }
  } catch (err) {
    console.error('[TelegramWebhook] handleUpdate error:', err);
    await sendMessage(chatId, '⚠️ Something went wrong. Please try again later.');
  }
}

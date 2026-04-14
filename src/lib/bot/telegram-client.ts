/**
 * Telegram Bot Client
 * 封装发送消息的函数，支持文本和 InlineKeyboard
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export interface InlineButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface SendMessageOptions {
  parse_mode?: 'Markdown' | 'HTML' | 'MarkdownV2';
  reply_markup?: {
    inline_keyboard: InlineButton[][];
  };
}

/**
 * 发送纯文本消息
 */
export async function sendMessage(
  chatId: string | number,
  text: string,
  options: SendMessageOptions = {}
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('[TelegramClient] TELEGRAM_BOT_TOKEN not set, skipping send');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = {
    chat_id: chatId,
    text,
    parse_mode: options.parse_mode ?? 'Markdown',
    ...(options.reply_markup ? { reply_markup: options.reply_markup } : {}),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[TelegramClient] sendMessage failed:', err);
  }
}

/**
 * 发送带 InlineKeyboard 的消息
 */
export async function sendMessageWithButtons(
  chatId: string | number,
  text: string,
  buttons: InlineButton[][],
  parseMode: 'Markdown' | 'HTML' = 'Markdown'
): Promise<void> {
  await sendMessage(chatId, text, {
    parse_mode: parseMode,
    reply_markup: { inline_keyboard: buttons },
  });
}

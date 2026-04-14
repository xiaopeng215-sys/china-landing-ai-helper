/**
 * Bot 统一消息处理层
 * 复用 Chat AI 的 system prompt 和 MiniMax 调用逻辑
 */

import { sendToAIWithCache } from '@/lib/ai-cache';

// 内存临时上下文（Supabase bot_sessions 表不存在时的 fallback）
const memoryContext = new Map<string, Array<{ role: 'user' | 'assistant'; content: string }>>();
const MAX_CONTEXT = 10;

// 复用 chat/route.ts 里的 system prompt（英文版，Bot 面向外国游客）
const BOT_SYSTEM_PROMPT = `You are a knowledgeable and friendly travel assistant for international visitors to China. Always respond in the same language the user writes in. Never mention the AI model name or provider. Keep responses concise and practical — this is a messaging app, not a web page. Use plain text, avoid heavy markdown.

## PAYMENTS IN CHINA
- Alipay (支付宝): Download international version, link Visa/Mastercard foreign card.
- WeChat Pay (微信支付): WeChat → Me → Pay → Add foreign Visa/Mastercard.
- Cash: Keep ¥200–500 RMB as backup. Exchange at airports or Bank of China ATMs.

## SIM CARDS
- Buy at airport on arrival. China Unicom (联通) most popular for foreigners.
- Cost: ¥50–150 for 7–30 day tourist plans with 10–50GB data. Passport required.

## VPN
- CRITICAL: Download and set up VPN BEFORE arriving in China.
- Recommended: ExpressVPN, NordVPN, Astrill. Google/WhatsApp/Instagram are blocked without VPN.

## EMERGENCY NUMBERS
- 110 Police | 120 Ambulance | 119 Fire | 12301 Tourist Hotline (English)

## TRANSPORTATION
- Didi (滴滴): China's Uber. Download app, link foreign card or Alipay.
- Metro: Available in major cities. ¥3–10 per trip.
- High-Speed Rail: Book on Trip.com for English interface.

## TOP CITIES
Beijing: Great Wall, Forbidden City, Peking Duck
Shanghai: The Bund, Xiaolongbao, French Concession
Chengdu: Giant Panda Base, Hotpot
Xi'an: Terracotta Warriors, Muslim Quarter street food
Guilin: Li River cruise, karst scenery
`;

/**
 * 从 Supabase 读取上下文（如果表存在）
 */
async function getContextFromSupabase(
  userId: string
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('bot_sessions')
      .select('role, content')
      .eq('user_hash', userId)
      .order('created_at', { ascending: false })
      .limit(MAX_CONTEXT);

    if (error) throw error;
    return ((data ?? []) as Array<{ role: 'user' | 'assistant'; content: string }>)
      .reverse();
  } catch {
    // 表不存在或连接失败，使用内存
    return memoryContext.get(userId) ?? [];
  }
}

/**
 * 保存上下文（Supabase 优先，fallback 内存）
 */
async function saveContext(
  userId: string,
  userText: string,
  assistantText: string
): Promise<void> {
  // 更新内存（始终维护，作为 fallback）
  const history = memoryContext.get(userId) ?? [];
  history.push({ role: 'user', content: userText });
  history.push({ role: 'assistant', content: assistantText });
  if (history.length > MAX_CONTEXT * 2) history.splice(0, 2);
  memoryContext.set(userId, history);

  // 尝试写 Supabase
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.from('bot_sessions').insert([
      { user_hash: userId, platform: 'telegram', role: 'user', content: userText },
      { user_hash: userId, platform: 'telegram', role: 'assistant', content: assistantText },
    ]);
  } catch {
    // 静默失败，内存已保存
  }
}

/**
 * 统一消息处理入口
 * @param text 用户消息文本
 * @param userId 用户唯一标识（Telegram user_id 的字符串形式）
 */
export async function handleBotMessage(text: string, userId: string): Promise<string> {
  const history = await getContextFromSupabase(userId);

  const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
    { role: 'system', content: BOT_SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: text },
  ];

  const aiResponse = await sendToAIWithCache(messages, {
    model: 'minimax',
    structured: false,
  });

  // sendToAIWithCache 可能返回 JSON 字符串，尝试解析
  let replyText = aiResponse.content;
  try {
    const parsed = JSON.parse(replyText);
    if (parsed.text) replyText = parsed.text;
  } catch {
    // 纯文本，直接用
  }

  await saveContext(userId, text, replyText);
  return replyText;
}

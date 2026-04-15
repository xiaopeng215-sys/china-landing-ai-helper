/**
 * AR Translator - 调用 /api/chat 翻译中文文字，带缓存
 */

const translationCache = new Map<string, string>();

export async function translateChineseText(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  // 命中缓存直接返回
  if (translationCache.has(trimmed)) {
    return translationCache.get(trimmed)!;
  }

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Translate this Chinese text to English. Reply with ONLY the translation, no explanation: "${trimmed}"`,
        sessionId: 'ar-translate',
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    // /api/chat 返回 { message: string } 或 { content: string }
    const translation: string =
      data.message || data.content || data.reply || trimmed;

    translationCache.set(trimmed, translation);
    return translation;
  } catch {
    // 翻译失败时返回原文
    return trimmed;
  }
}

export function clearTranslationCache() {
  translationCache.clear();
}

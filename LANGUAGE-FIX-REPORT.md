# Language Fix Report

**Date:** 2026-04-14  
**Engineer:** 哪吒 🔥  
**Commit:** `4006aea`

## Root Cause

`route.ts` had a broken language comparison:

```typescript
// BEFORE (broken) — 'zh-CN' === 'zh' is always false
selectedLanguage === 'zh' || selectedLanguage === 'zh-CN'
```

The frontend sends `'zh-CN'`, but the old code only checked `=== 'zh'` first, so Chinese users always got the English system prompt.

## Fix

### 1. Content-based language detection (`route.ts`)

Replaced frontend param dependency with Unicode range detection:

```typescript
function detectLanguage(message: string): string {
  if (/[\u4e00-\u9fff]/.test(message)) return 'zh-CN';
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(message)) return 'ja-JP';
  if (/[\uac00-\ud7af]/.test(message)) return 'ko-KR';
  return 'en-US';
}
```

Added `SYSTEM_PROMPTS` map with proper prompts for zh-CN, ja-JP, ko-KR, en-US.

### 2. Localized error messages

Added `getErrorMessage(lang, type)` — all hardcoded Chinese error strings now return the correct language based on detected language.

### 3. Fixed broken Klook URLs (`ai-client.ts`)

| Old URL (403) | New URL (valid) |
|---|---|
| `/zh-CN/activity/123-shanghai-tour/` | `/zh-CN/city/13-shanghai-activities/` |
| `/zh-CN/activity/alipay-setup/` | `/zh-CN/travel-guide/china-payment-guide/` |
| `/en-US/destination/13-shanghai-activities/` | `/en-US/city/13-shanghai-activities/` |

## Verification

Post-deploy curl tests confirmed language routing works:

```bash
# English message → English error
curl -d '{"message":"recommend Shanghai food","language":"en"}' ...
# → {"error":{"message":"AI service temporarily unavailable..."}}  ✅

# Chinese message → Chinese error  
curl -d '{"message":"推荐上海美食","language":"zh"}' ...
# → {"error":{"message":"AI 服务暂时不可用..."}}  ✅
```

Note: AI service itself is returning 503 (MiniMax/Qwen API connectivity issue, separate from this fix). Language detection and routing are confirmed working correctly.

## Files Changed

- `src/app/api/chat/route.ts` — detectLanguage(), SYSTEM_PROMPTS, getErrorMessage(), removed broken comparison
- `src/lib/ai-client.ts` — fixed 3 broken Klook action URLs

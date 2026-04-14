# AI 服务 503 修复报告

**时间：** 2026-04-14 02:51 GMT+8  
**处理人：** 白龙马 🐴  
**状态：** ✅ 已修复并验证

---

## 故障现象

```
POST https://www.travelerlocal.ai/api/chat
→ {"error":{"code":"AI_SERVICE_ERROR","message":"AI service temporarily unavailable"}}
```

---

## 根本原因

### Bug 1（致命）— `route.ts` 未定义变量

**文件：** `src/app/api/chat/route.ts` 第 228 行  
**问题：** 调用 `sendToAIWithCache` 时传入了未定义变量 `selectedLanguage`，应为 `detectedLanguage`

```ts
// ❌ 修复前
language: selectedLanguage,   // ReferenceError: selectedLanguage is not defined

// ✅ 修复后
language: detectedLanguage,
```

**影响：** 每次请求都抛出 `ReferenceError`，被 `catch` 捕获后转为 `AI_SERVICE_ERROR` 503，**100% 失败率**。

---

### Bug 2（潜在）— MiniMax 端点不支持 `thinking_budget`

**文件：** `src/lib/ai-client.ts` 第 449 行  
**问题：** 代码使用 `/v1/chat/completions` 端点，但 `thinking_budget` 参数仅在 `/v1/text/chatcompletion_v2` 端点有效

```ts
// ❌ 修复前 — thinking_budget 被忽略，推理 token 耗尽导致空回复
fetch(`${MINIMAX_API_URL}/chat/completions`, ...)

// ✅ 修复后 — 正确支持 thinking_budget=800
fetch(`${MINIMAX_API_URL}/text/chatcompletion_v2`, ...)
```

**影响：** M2.7 推理模型在 `max_tokens=2000` 时，所有 token 可能被 `<think>` 推理消耗，导致 `content` 为空，触发"空回复"检测并抛出错误。

---

## 排查过程

| 步骤 | 结论 |
|------|------|
| 直接测试 MiniMax API (`/v1/text/chatcompletion_v2`) | ✅ 可达，响应正常 |
| 检查 Vercel 环境变量 | ✅ `MINIMAX_API_KEY` 已配置（Production） |
| 检查 `route.ts` 代码 | ❌ 发现 `selectedLanguage` 未定义 |
| 测试 `/v1/chat/completions` 端点 | ❌ `thinking_budget` 无效，100 tokens 全被推理消耗 |
| 测试 `/v1/text/chatcompletion_v2` + `thinking_budget=800` | ✅ 正常返回 568 字符内容 |

---

## 修复内容

**Commit：** `3831e76`  
**Push：** `main` → `https://github.com/xiaopeng215-sys/china-landing-ai-helper.git`

```
fix: 修复 AI 服务 503 - selectedLanguage 未定义 + MiniMax 端点切换
```

修改文件：
- `src/app/api/chat/route.ts` — `selectedLanguage` → `detectedLanguage`
- `src/lib/ai-client.ts` — 端点 `/v1/chat/completions` → `/v1/text/chatcompletion_v2`

---

## 验证结果

```bash
curl -X POST https://www.travelerlocal.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"recommend Shanghai food","language":"en"}'
```

**响应（修复后）：**
```
✅ 成功！回复预览: # 🏙️ Shanghai Food Recommendations

Welcome to Shanghai! Here are some must-try local dishes and famous food spots:

## 🍜 Iconic Shanghai Dishes
...
```

---

## 后续建议

1. **加强 TypeScript 严格模式**：启用 `noUncheckedIndexedAccess` 和 `strict: true`，可在编译期捕获未定义变量
2. **端点文档化**：在 `ai-client.ts` 顶部注释说明各端点差异，避免混用
3. **监控告警**：建议对 `/api/chat` 的 5xx 错误率设置 Sentry 告警阈值（>1% 触发）

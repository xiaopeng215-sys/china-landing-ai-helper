# Telegram Bot Setup Guide

TravelerLocal.ai Telegram Bot — 让用户无需打开网页即可使用 AI 旅行助手。

---

## 1. 创建 Bot（BotFather）

1. 打开 Telegram，搜索 `@BotFather`
2. 发送 `/newbot`
3. 输入 Bot 名称，例如：`China Landing Assistant`
4. 输入 Bot 用户名（必须以 `bot` 结尾），例如：`ChinaLandingBot`
5. BotFather 返回 **Bot Token**，格式：`123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`
6. 将 Token 写入 `.env.local`：

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_SECRET=your_random_secret_here   # 任意随机字符串，用于验证请求来源
```

---

## 2. 设置 Webhook

部署到生产环境后，运行以下命令注册 Webhook：

```bash
# 方式一：直接传入环境变量
TELEGRAM_BOT_TOKEN=xxx WEBHOOK_URL=https://yourdomain.com \
  npx ts-node scripts/setup-telegram-webhook.ts

# 方式二：从 .env.local 读取（需安装 dotenv）
npx ts-node -r dotenv/config scripts/setup-telegram-webhook.ts
```

脚本会自动：
- 将 Webhook 注册到 `/api/bot/telegram`
- 注册 Bot 命令菜单
- 打印当前 Webhook 状态

### 验证 Webhook 状态

```bash
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo"
```

---

## 3. 支持的命令

| 命令 | 说明 |
|------|------|
| `/start` | 欢迎消息 + 功能概览 |
| `/help` | 显示所有命令 |
| `/essentials` | 支付、SIM 卡、VPN 指南 |
| `/hotels` | 主要城市酒店搜索（Trip.com 链接） |
| `/food` | 中国美食指南 |
| `/timeline` | 6 步入境清单 |
| `/emergency` | 中国紧急电话 |
| 任意文本 | AI 旅行助手回答 |

---

## 4. 本地测试

本地开发时 Telegram 无法直接访问 localhost，需要使用 ngrok 或类似工具：

```bash
# 安装 ngrok
brew install ngrok

# 暴露本地 3000 端口
ngrok http 3000

# 用 ngrok 提供的 HTTPS URL 设置 Webhook
TELEGRAM_BOT_TOKEN=xxx WEBHOOK_URL=https://xxxx.ngrok.io \
  npx ts-node scripts/setup-telegram-webhook.ts
```

### 手动测试 Webhook

```bash
curl -X POST https://xxxx.ngrok.io/api/bot/telegram \
  -H "Content-Type: application/json" \
  -H "X-Telegram-Bot-Api-Secret-Token: your_webhook_secret" \
  -d '{
    "message": {
      "chat": { "id": 123456 },
      "from": { "id": 123456 },
      "text": "/start"
    }
  }'
```

---

## 5. 架构说明

```
Telegram → POST /api/bot/telegram
              ↓
         route.ts (验证 secret token)
              ↓
    命令路由 (switch on text)
    ├── /start /help → 静态欢迎消息
    ├── /essentials /emergency /timeline /food → 静态内容
    ├── /hotels → InlineKeyboard (Trip.com 链接)
    └── 其他文本 → handleBotMessage()
                        ↓
                  message-handler.ts
                  (加载对话历史 → AI → 保存上下文)
                        ↓
                  telegram-client.ts
                  (sendMessage via Telegram API)
```

**对话上下文存储：**
- 优先使用 Supabase `bot_sessions` 表（持久化）
- 表不存在时自动 fallback 到内存（重启后丢失）

---

## 6. 生产部署注意事项

- Webhook URL 必须是 **HTTPS**（Telegram 要求）
- 设置 `TELEGRAM_WEBHOOK_SECRET` 防止伪造请求
- Telegram 要求 Webhook 在 **5 秒内**返回 200，AI 调用已异步处理
- 如需持久化对话历史，在 Supabase 创建 `bot_sessions` 表（见 `docs/supabase-schema.sql`）

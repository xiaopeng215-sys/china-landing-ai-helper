# 微信公众号 Bot 接入指南

## 概述

TravelerLocal.ai 通过微信公众号为用户提供 AI 旅行助手服务。用户关注公众号后，直接发送文字消息即可获得 AI 回复。

---

## 1. 注册微信公众号

1. 访问 [微信公众平台](https://mp.weixin.qq.com/) 注册账号
2. 选择账号类型：
   - **订阅号**：适合内容推送，每天可群发 1 条消息
   - **服务号**（推荐）：支持更多接口权限，每月可群发 4 条消息
3. 完成企业/个人认证（服务号需企业认证，订阅号个人可注册）
4. 注册完成后，在「开发 → 基本配置」页面获取：
   - `AppID`（即 `WECHAT_APP_ID`）
   - `AppSecret`（即 `WECHAT_APP_SECRET`）

---

## 2. 配置服务器 URL

### 2.1 设置环境变量

在 `.env.local` 中添加：

```env
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=your_app_secret_here
WECHAT_TOKEN=your_custom_token_here   # 自定义，任意字符串，用于签名验证
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2.2 在微信后台配置 Webhook

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入「开发 → 基本配置 → 服务器配置」
3. 点击「修改配置」，填写：

| 字段 | 值 |
|------|-----|
| 服务器地址 (URL) | `https://your-domain.com/api/wechat/webhook` |
| 令牌 (Token) | 与 `WECHAT_TOKEN` 环境变量一致 |
| 消息加解密密钥 | 随机生成（当前使用明文模式，可留空） |
| 消息加解密方式 | 明文模式（开发阶段推荐） |

4. 点击「提交」，微信会向你的服务器发送 GET 请求验证签名
5. 验证成功后，点击「启用」

---

## 3. Webhook 接口说明

### GET `/api/wechat/webhook` — 服务器验证

微信在配置时调用，验证服务器所有权。

**Query 参数：**
- `signature` — 微信签名
- `timestamp` — 时间戳
- `nonce` — 随机数
- `echostr` — 验证字符串（验证通过后原样返回）

### POST `/api/wechat/webhook` — 消息接收

微信将用户消息以 XML 格式 POST 到此接口。

**支持的消息类型：**
- `text` — 文字消息（转发给 AI 处理）
- `event/subscribe` — 用户关注事件（返回欢迎语）
- `event/unsubscribe` — 取关事件（静默处理）
- `image` / `voice` — 提示用户发送文字

**响应格式：** 微信 XML 文本回复

---

## 4. 本地测试

### 使用 ngrok 暴露本地服务

```bash
# 启动开发服务器
npm run dev

# 另开终端，用 ngrok 暴露本地端口
ngrok http 3000
```

将 ngrok 生成的 HTTPS URL 填入微信后台的服务器地址：
```
https://xxxx.ngrok.io/api/wechat/webhook
```

### 手动测试签名验证

```bash
# 计算签名（token=test, timestamp=1234567890, nonce=abc）
echo -n "1234567890abctest" | shasum -a 1
# 注意：需要将三个字符串排序后拼接

# 测试 GET 验证
curl "https://your-domain.com/api/wechat/webhook?signature=<hash>&timestamp=1234567890&nonce=abc&echostr=hello"
# 期望返回: hello
```

### 测试消息处理

```bash
curl -X POST "https://your-domain.com/api/wechat/webhook" \
  -H "Content-Type: application/xml" \
  -d '<xml>
    <ToUserName><![CDATA[gh_xxx]]></ToUserName>
    <FromUserName><![CDATA[oUser123]]></FromUserName>
    <CreateTime>1234567890</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[How do I set up Alipay?]]></Content>
    <MsgId>1234567890</MsgId>
  </xml>'
```

---

## 5. 注意事项

- **响应时间**：微信要求服务器在 **5 秒内**响应，否则会重试 3 次。AI 调用可能超时，建议后续优化为异步处理（先返回"处理中"，再通过客服消息接口主动推送）。
- **消息去重**：微信可能重复推送同一条消息（MsgId 相同），生产环境建议用 Redis 做去重。
- **加密模式**：生产环境建议启用「安全模式」（AES 加密），需额外实现解密逻辑。
- **客服消息**：服务号可使用客服消息接口主动推送，需要用户 48 小时内有互动。

---

## 6. 相关文件

```
src/
├── app/api/wechat/webhook/route.ts   # Webhook 路由
└── lib/wechat/parser.ts              # XML 解析 & 签名验证
```

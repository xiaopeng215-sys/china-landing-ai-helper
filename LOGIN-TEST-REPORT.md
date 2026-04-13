# 登录功能测试报告

**测试时间：** 2026-04-14 02:30 GMT+8  
**测试环境：** 生产环境 https://www.travelerlocal.ai  
**测试人员：** 哪吒 🔥  
**部署版本：** afa17f5（fix: 修复登出后 session 未清除的问题）

---

## 测试结果：✅ 全部通过（3/3 轮）

| 步骤 | 操作 | 预期结果 | 实际结果 | 状态 |
|------|------|----------|----------|------|
| a | 获取 CSRF token | 返回 csrfToken | ✅ 正常返回 | ✅ |
| b | 登录（credentials） | HTTP 302 + Set-Cookie session-token | ✅ 302 + cookie 已设置 | ✅ |
| c | 验证 session | 返回用户信息 | ✅ `{"user":{"name":"test","email":"test@test.com",...}}` | ✅ |
| d | 登出 | `{"ok":true,"url":"/"}` | ✅ 正常返回 | ✅ |
| e | 验证登出后 session | 返回 `{}` | ✅ `{}` | ✅ |

---

## 问题修复记录

### Bug：登出后 session 未清除

**发现时间：** 2026-04-14  
**严重程度：** 高（安全问题）

**根因：**  
`/api/auth/signout/route.ts` 使用 `response.cookies.delete()` 清除 cookie，但该方法无法正确清除带有 `Secure`、`HttpOnly` 属性的 cookie（`__Secure-next-auth.session-token`）。

**修复方案：**  
改用 `response.cookies.set()` 并设置 `expires: new Date(0)`，同时匹配原始 cookie 的所有属性（`path: '/'`、`secure: true`、`httpOnly: true`、`sameSite: 'lax'`）。

**修复文件：** `src/app/api/auth/signout/route.ts`

---

## /auth/signin 页面检查

- ✅ 页面全部使用中文，无中英文夹杂问题
- ✅ 表单标签、按钮文字、错误提示均为中文
- ✅ placeholder 使用英文（`your@email.com`、`••••••••`）属正常设计

---

## 测试命令参考

```bash
# 获取 CSRF token
curl -s -c /tmp/cookies.txt https://www.travelerlocal.ai/api/auth/csrf

# 登录
curl -s -X POST https://www.travelerlocal.ai/api/auth/callback/credentials \
  -c /tmp/cookies.txt -b /tmp/cookies.txt \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test%40test.com&password=test123&csrfToken=<token>&redirect=false"

# 验证 session
curl -s https://www.travelerlocal.ai/api/auth/session -b /tmp/cookies.txt

# 登出
curl -s -X POST https://www.travelerlocal.ai/api/auth/signout \
  -c /tmp/cookies.txt -b /tmp/cookies.txt \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "csrfToken=<token>"

# 验证登出后 session 为空
curl -s https://www.travelerlocal.ai/api/auth/session -b /tmp/cookies.txt
# 预期：{}
```

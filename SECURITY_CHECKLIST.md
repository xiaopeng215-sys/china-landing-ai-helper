# 🔐 安全检查清单 - China Landing AI Helper PWA

**最后更新**: 2026-04-12  
**负责人**: 安全团队  
**审查周期**: 月度

---

## 📋 日常检查 (每日)

- [ ] 检查 Sentry 错误日志中的安全相关错误
- [ ] 监控 API 速率限制触发情况
- [ ] 检查异常登录尝试
- [ ] 验证备份是否成功

---

## 📋 每周检查

### 访问控制

- [ ] 审查新注册的用户账号
- [ ] 检查管理员权限变更
- [ ] 验证 OAuth 应用权限
- [ ] 审查 API 密钥使用情况

### 密钥管理

- [ ] 检查环境变量是否过期
- [ ] 验证密钥轮换状态
- [ ] 审查 .env 文件未提交到 Git

### 日志审计

- [ ] 审查认证失败日志
- [ ] 检查 CSRF token 验证失败
- [ ] 分析速率限制触发模式
- [ ] 监控异常 IP 地址

---

## 📋 每月检查

### 漏洞扫描

- [ ] 运行 `npm audit --production`
- [ ] 检查依赖项安全更新
- [ ] 审查 Sentry 安全告警
- [ ] 执行渗透测试 (季度)

### 配置审查

- [ ] 验证 CSP 策略是否仍然适用
- [ ] 检查安全头配置
- [ ] 审查 CORS 设置
- [ ] 验证 RLS (Row Level Security) 规则

### 访问审查

- [ ] 审查所有服务账号权限
- [ ] 验证第三方集成权限
- [ ] 清理未使用的 API 密钥
- [ ] 更新访问控制列表

---

## 📋 季度检查

### 密钥轮换

- [ ] 轮换 Supabase 密钥
- [ ] 轮换 NextAuth Secret
- [ ] 轮换 OAuth 客户端密钥
- [ ] 轮换 AI API 密钥
- [ ] 轮换 Email 服务凭证

### 安全审计

- [ ] 全面安全审计 (内部或第三方)
- [ ] 代码审查安全关键部分
- [ ] 更新威胁模型
- [ ] 审查事件响应计划

### 合规性

- [ ] 检查隐私政策更新需求
- [ ] 验证数据保留策略
- [ ] 审查用户同意记录
- [ ] 更新数据处理协议

---

## 🚨 事件响应清单

### 发现密钥泄露时

1. **立即** 轮换泄露的密钥
2. 审查访问日志确定影响范围
3. 通知受影响的用户 (如需要)
4. 更新安全文档
5. 执行事后分析

### 发现未授权访问时

1. **立即** 撤销可疑会话
2. 禁用受影响账号
3. 审查访问日志
4. 修复漏洞根源
5. 通知相关方

### 发现 CSRF 攻击时

1. 加强 CSRF token 验证
2. 审查所有表单和 API 端点
3. 更新安全头 (SameSite, CSP)
4. 通知用户重新登录
5. 监控后续攻击

---

## 🛡️ 安全配置基线

### 必需的安全头

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin
Content-Security-Policy: [见 next.config.js]
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

### 必需的环境变量

- [ ] `NEXTAUTH_SECRET` - 至少 32 字符随机字符串
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - 仅服务端使用
- [ ] `EMAIL_SERVER` - 使用 API Key 而非密码
- [ ] 所有 OAuth 密钥 - 从官方控制台获取

### 必需的 Supabase 配置

- [ ] 启用 Row Level Security (RLS)
- [ ] 配置适当的 RLS 策略
- [ ] 限制匿名访问
- [ ] 启用审计日志

---

## 📊 安全指标

### 关键指标 (KPI)

- **密钥轮换合规率**: 目标 100%
- **安全更新延迟**: < 7 天
- **未授权访问尝试**: 监控趋势
- **CSRF 验证失败率**: < 0.1%

### 报告频率

- **日报**: 异常事件
- **周报**: 安全指标趋势
- **月报**: 完整安全状态
- **季报**: 战略审查

---

## 📚 参考文档

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js 安全最佳实践](https://nextjs.org/docs/pages/building-your-application/authentication)
- [Supabase 安全指南](https://supabase.com/docs/guides/auth/row-level-security)
- [CSP 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## ✅ 检查签署

| 日期 | 检查类型 | 检查人 | 状态 | 备注 |
|------|---------|--------|------|------|
| 2026-04-12 | 初始审计 | 沙僧 | ✅ 完成 | 修复 6 个高危问题 |
| | | | | |

---

**下次审查日期**: 2026-05-12  
**安全负责人**: [待指定]

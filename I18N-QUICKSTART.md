# 🌍 国际化 (i18n) 快速开始指南

**创建时间**: 2026-04-12  
**框架**: next-intl  
**支持语言**: en-US, ko-KR, th-TH, vi-VN  

---

## 📦 1. 安装依赖

```bash
cd products/china-landing-ai-helper/pwa
npm install next-intl
```

---

## 🚀 2. 快速测试

### 2.1 启动开发服务器
```bash
npm run dev
```

### 2.2 访问多语言路由
- 英文：http://localhost:3000/en-US
- 韩文：http://localhost:3000/ko-KR
- 泰文：http://localhost:3000/th-TH
- 越南文：http://localhost:3000/vi-VN

---

## 📁 3. 文件结构

```
pwa/
├── src/
│   ├── app/
│   │   └── [locale]/          # 语言路由 (需改造现有页面)
│   │       ├── page.tsx
│   │       └── layout.tsx
│   ├── components/
│   │   └── LocaleSwitcher.tsx # 语言切换器
│   ├── lib/
│   │   └── i18n/
│   │       ├── config.ts      # 配置
│   │       └── request.ts     # 请求处理
│   └── messages/              # 翻译文件
│       ├── en-US.json
│       ├── ko-KR.json
│       ├── th-TH.json
│       └── vi-VN.json
├── middleware.ts              # 语言检测中间件
└── next.config.js             # 已配置 next-intl
```

---

## 🔧 4. 改造现有页面

### 4.1 创建语言路由

将现有页面移动到 `[locale]` 目录下：

```bash
# 示例：移动首页
mv src/app/page.tsx src/app/[locale]/page.tsx

# 移动其他页面
mv src/app/profile/page.tsx src/app/[locale]/profile/page.tsx
mv src/app/auth/signin/page.tsx src/app/[locale]/auth/signin/page.tsx
# ... 其他页面
```

### 4.2 更新 layout.tsx

创建 `src/app/[locale]/layout.tsx`:

```tsx
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // 验证语言
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // 获取翻译消息
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

### 4.3 使用翻译 Hook

在组件中使用 `useTranslations`:

```tsx
'use client';

import {useTranslations} from 'next-intl';

export function HomePage() {
  const t = useTranslations('HomePage');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <button>{t('cta')}</button>
    </div>
  );
}
```

### 4.4 添加语言切换器

在 Header 或 Navigation 中添加：

```tsx
import {LocaleSwitcher} from '@/components/LocaleSwitcher';

function Header() {
  return (
    <header>
      {/* 其他导航项 */}
      <LocaleSwitcher />
    </header>
  );
}
```

---

## 📝 5. 添加新翻译

### 5.1 编辑翻译文件

打开 `src/messages/en-US.json` (或其他语言)，添加新 key:

```json
{
  "NewFeature": {
    "title": "New Feature Title",
    "description": "Description text here"
  }
}
```

### 5.2 同步其他语言

确保所有语言文件都有相同的 key 结构：

```bash
# 运行检查脚本
node scripts/generate-translations.js
```

这会生成 `.missing.json` 文件，列出缺失的翻译。

### 5.3 使用 DeepL 翻译

```bash
# 可以使用 DeepL API 或手动翻译
# 推荐：复制英文内容到 DeepL，翻译后粘贴到对应语言文件
```

---

## 🧪 6. 测试清单

### 功能测试
- [ ] 所有页面在 4 种语言下正常显示
- [ ] 语言切换器工作正常
- [ ] URL 随语言切换而改变
- [ ] 刷新页面后语言保持
- [ ] SEO 元数据正确 (title, description)

### 视觉测试
- [ ] 文本长度适配 (德语/泰语可能较长)
- [ ] 字体渲染正常 (韩语/泰语特殊字符)
- [ ] 布局无错位
- [ ] 按钮/标签无溢出

### 性能测试
- [ ] 语言切换无刷新
- [ ] 翻译文件加载快速
- [ ] Lighthouse 分数 >90

---

## 🐛 7. 常见问题

### Q: 页面显示 404
**A**: 确保页面已移动到 `[locale]` 目录下，并创建了正确的 layout.tsx

### Q: 翻译不显示
**A**: 检查 key 是否正确，确保使用了正确的命名空间 (如 `useTranslations('HomePage')`)

### Q: 语言切换后 URL 不变
**A**: 检查 middleware.ts 配置，确保 `localePrefix: 'required'`

### Q: 构建失败
**A**: 运行 `npm run build` 查看详细错误，通常是翻译文件格式问题

---

## 📚 8. 参考资料

- [next-intl 官方文档](https://next-intl-docs.vercel.app)
- [本项目翻译文件](./src/messages/)
- [多语言内容库](../content/multilingual.md)
- [实施报告](../ANTS-I18N-REPORT.md)

---

## 🎯 9. 下一步

1. ✅ 安装 next-intl
2. ✅ 创建翻译文件 (en-US, ko-KR 已完成)
3. ⏳ 改造现有页面到 `[locale]` 路由
4. ⏳ 添加语言切换器到 Header
5. ⏳ 完成 th-TH, vi-VN 翻译
6. ⏳ 测试验证
7. ⏳ 部署上线

---

**最后更新**: 2026-04-12  
**维护**: 魔法师 🧙 + 嫦娥 🌙

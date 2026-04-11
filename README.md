# 🇨🇳 China Landing AI Helper - PWA

**AI 驱动的中国旅行规划助手**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8)](https://web.dev/progressive-web-apps/)

---

## 🎯 产品定位

为首次来中国的外国游客提供 AI 驱动的旅行规划服务，整合：
- 🗺️ **行程规划** (Wanderlog 风格)
- 🍜 **美食推荐** (美团风格)
- 🚇 **交通指南** (Citymapper 风格)
- 💬 **智能助手** (对话式交互)

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 安装依赖

```bash
cd products/china-landing-ai-helper/pwa
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
npm run start
```

### PWA 测试

```bash
npm run build
npx serve out
```

---

## 📁 项目结构

```
pwa/
├── public/
│   ├── icons/              # PWA 图标
│   ├── manifest.json       # PWA 清单
│   └── images/             # 静态图片
├── src/
│   ├── app/
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 主页面
│   │   ├── globals.css     # 全局样式
│   │   └── favicon.ico
│   ├── components/
│   │   ├── TripCard.tsx    # 行程卡片
│   │   ├── DayCard.tsx     # 每日行程卡片
│   │   ├── RestaurantCard.tsx  # 餐厅卡片
│   │   ├── ChatBubble.tsx  # 聊天消息气泡
│   │   ├── BottomNav.tsx   # 底部导航
│   │   └── index.ts        # 组件导出
│   └── types/              # TypeScript 类型定义
├── next.config.js          # Next.js 配置
├── tailwind.config.ts      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── README.md
```

---

## 🎨 设计规范

### 颜色方案

```css
主色调:
- 清新绿：#10B981 (信任、旅行)
- 天空蓝：#3B82F6 (专业、可靠)
- 温暖橙：#F59E0B (美食、活力)

背景:
- 主背景：#FFFFFF
- 次级背景：#F9FAFB
- 卡片背景：#FFFFFF
```

### 响应式断点

```typescript
手机竖屏：< 480px (单列)
手机横屏：480px - 768px (双列)
平板：768px - 1024px (双列 + 侧边栏)
桌面：> 1024px (三列布局)
```

### 组件圆角

- 卡片：`rounded-2xl` (16px)
- 按钮：`rounded-xl` (12px)
- 图片：`rounded-xl` (12px)

---

## 📱 核心功能

### 1. 聊天助手 (首页)

- 对话式行程规划
- 快速开始问题
- 富文本消息 (行程预览卡片)

### 2. 我的行程

- Wanderlog 风格行程卡片
- 每日详细活动
- 地图 + 时间线视图

### 3. 美食地图

- 美团风格餐厅卡片
- 分类筛选
- 地图标记

### 4. 交通指南

- Citymapper 风格路线查询
- 多种交通方式对比
- 实时导航

### 5. 个人中心

- 行程管理
- 收藏夹
- 设置

---

## 🔧 技术亮点

### PWA 特性

- ✅ 离线可用 (Service Worker)
- ✅ 可添加到主屏幕
- ✅ 推送通知 (待实现)
- ✅ 后台同步 (待实现)

### 性能优化

- ✅ 自动代码分割
- ✅ 图片懒加载 + WebP
- ✅ 关键 CSS 内联
- ✅ Service Worker 缓存
- ✅ 响应式图片

### 移动端优化

- ✅ 安全区域适配 (刘海屏)
- ✅ 触摸优化
- ✅ 视口锁定
- ✅ 平滑滚动

---

## 📊 性能指标

| 指标 | 目标 | 实测 |
|------|------|------|
| FCP | < 1.5s | - |
| LCP | < 2.0s | - |
| TTI | < 3.0s | - |
| CLS | < 0.1 | - |

*待部署后实测*

---

## 🛠️ 开发命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产运行
npm start

# Lint
npm run lint

# 类型检查
npx tsc --noEmit

# Bundle 分析
ANALYZE=true npm run build
```

---

## 📝 待办事项

### P0 (已完成)
- [x] Next.js 14 + TypeScript 项目结构
- [x] Wanderlog 风格卡片组件 (5 个)
- [x] 响应式布局 (移动优先)
- [x] PWA 配置
- [x] 性能优化方案

### P1 (下一步)
- [ ] 真实 API 集成
- [ ] 地图组件 (高德/Google Maps)
- [ ] 用户认证
- [ ] 骨架屏加载状态

### P2
- [ ] 推送通知
- [ ] 离线数据同步
- [ ] 多语言支持
- [ ] 支付集成

---

## 📄 许可证

MIT License

---

*设计参考：Wanderlog + Citymapper + 美团*  
*创建时间：2026-04-10*

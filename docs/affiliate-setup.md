# Affiliate Setup Guide

## 注册链接

| 平台 | 注册地址 | 佣金比例 |
|------|---------|---------|
| Booking.com | https://www.booking.com/affiliate-program/v2/index.html | 4–6% |
| Klook | https://affiliate.klook.com/ | 5–8% |
| Ctrip/Trip.com | https://www.trip.com/affiliate/ | 3–5% |

## 配置

注册后将 ID 填入 `.env.local`：

```env
BOOKING_AFFILIATE_ID=your-aid
KLOOK_AFFILIATE_ID=your-aid
CTRIP_AFFILIATE_ID=your-aid
```

## 预期收益

月均 1,000 次酒店点击，转化率 2–3%，客单价 $150：
- Booking.com：约 **$180–270/月**
- Klook 景点：约 **$50–100/月**

链接逻辑见 `src/lib/affiliate/index.ts`。

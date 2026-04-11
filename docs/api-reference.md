# API Reference

China Landing AI Helper - API 接口文档

---

## 概述

本文档描述了 China Landing AI Helper PWA 应用的所有 API 接口。

**Base URL:** `/api`

**认证方式:** Bearer Token (部分接口需要)

**响应格式:** JSON

---

## 通用响应结构

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功",
  "timestamp": 1712736000000
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": { ... }
  },
  "timestamp": 1712736000000
}
```

---

## 错误码说明

| 错误码 | HTTP 状态码 | 说明 |
|--------|-------------|------|
| `SUCCESS` | 200 | 请求成功 |
| `BAD_REQUEST` | 400 | 请求参数错误 |
| `UNAUTHORIZED` | 401 | 未授权访问 |
| `FORBIDDEN` | 403 | 禁止访问 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |
| `RATE_LIMITED` | 429 | 请求频率超限 |
| `VALIDATION_ERROR` | 400 | 数据验证失败 |
| `TIMEOUT` | 408 | 请求超时 |
| `SERVICE_UNAVAILABLE` | 503 | 服务不可用 |

---

## 行程相关 API

### 1. 获取行程列表

**端点:** `GET /api/trips`

**描述:** 获取用户的所有行程列表

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `limit` | number | 否 | 每页数量，默认 10 |
| `status` | string | 否 | 筛选状态：planning, active, completed |

**响应示例:**

```json
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": "trip_001",
        "name": "北京 5 日游",
        "startDate": "2024-05-01",
        "endDate": "2024-05-05",
        "status": "planning",
        "dayCount": 5,
        "createdAt": 1712736000000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25
    }
  }
}
```

---

### 2. 创建新行程

**端点:** `POST /api/trips`

**描述:** 创建一个新的行程计划

**请求体:**

```json
{
  "name": "北京 5 日游",
  "startDate": "2024-05-01",
  "endDate": "2024-05-05",
  "preferences": {
    "budget": "medium",
    "interests": ["history", "food", "culture"],
    "pace": "moderate"
  }
}
```

**响应示例:**

```json
{
  "success": true,
  "data": {
    "id": "trip_001",
    "name": "北京 5 日游",
    "status": "planning",
    "createdAt": 1712736000000
  },
  "message": "行程创建成功"
}
```

---

### 3. 获取行程详情

**端点:** `GET /api/trips/:id`

**描述:** 获取指定行程的详细信息

**路径参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | string | 行程 ID |

**响应示例:**

```json
{
  "success": true,
  "data": {
    "id": "trip_001",
    "name": "北京 5 日游",
    "startDate": "2024-05-01",
    "endDate": "2024-05-05",
    "status": "planning",
    "days": [
      {
        "id": "day_001",
        "dayNumber": 1,
        "date": "2024-05-01",
        "activities": [
          {
            "id": "act_001",
            "type": "attraction",
            "name": "故宫",
            "startTime": "09:00",
            "endTime": "12:00",
            "location": "北京市东城区景山前街 4 号"
          }
        ]
      }
    ]
  }
}
```

---

### 4. 生成行程

**端点:** `POST /api/trips/:id/generate`

**描述:** 使用 AI 生成行程内容

**请求体:**

```json
{
  "regenerate": false,
  "focusAreas": ["history", "food"]
}
```

**响应示例:**

```json
{
  "success": true,
  "data": {
    "jobId": "job_12345",
    "estimatedTime": 30,
    "status": "processing"
  },
  "message": "行程生成中，预计等待 30 秒"
}
```

---

## 景点相关 API

### 1. 获取景点列表

**端点:** `GET /api/attractions`

**描述:** 获取所有景点列表

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `city` | string | 否 | 城市名称 |
| `category` | string | 否 | 分类：history, nature, entertainment |
| `page` | number | 否 | 页码 |
| `limit` | number | 否 | 每页数量 |

**响应示例:**

```json
{
  "success": true,
  "data": {
    "attractions": [
      {
        "id": "att_001",
        "name": "故宫",
        "city": "北京",
        "rating": 4.8,
        "category": "history",
        "description": "中国明清两代的皇家宫殿",
        "location": "北京市东城区景山前街 4 号",
        "openingHours": "08:30-17:00",
        "ticketPrice": "60 元",
        "tags": ["历史", "文化", "必游"]
      }
    ]
  }
}
```

---

### 2. 获取景点详情

**端点:** `GET /api/attractions/:id`

**响应示例:**

```json
{
  "success": true,
  "data": {
    "id": "att_001",
    "name": "故宫",
    "description": "中国明清两代的皇家宫殿，旧称紫禁城...",
    "images": [
      "https://example.com/img1.jpg",
      "https://example.com/img2.jpg"
    ],
    "rating": 4.8,
    "reviewCount": 15234,
    "location": {
      "address": "北京市东城区景山前街 4 号",
      "latitude": 39.9163,
      "longitude": 116.3972
    },
    "openingHours": {
      "weekday": "08:30-17:00",
      "weekend": "08:30-17:00",
      "holiday": "08:30-17:00"
    },
    "ticketPrice": {
      "adult": "60 元",
      "student": "20 元",
      "senior": "免费"
    },
    "tips": [
      "建议游玩时间：3-4 小时",
      "需提前预约门票",
      "周一闭馆（法定节假日除外）"
    ]
  }
}
```

---

## 餐厅相关 API

### 1. 获取餐厅列表

**端点:** `GET /api/restaurants`

**请求参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `city` | string | 城市名称 |
| `cuisine` | string | 菜系：川菜、粤菜、京菜等 |
| `priceRange` | string | 价格区间：$, $$, $$$ |
| `page` | number | 页码 |
| `limit` | number | 每页数量 |

**响应示例:**

```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": "rest_001",
        "name": "全聚德烤鸭店",
        "city": "北京",
        "cuisine": "京菜",
        "rating": 4.5,
        "priceRange": "$$$",
        "address": "北京市东城区前门大街",
        "tags": ["烤鸭", "老字号", "必吃"]
      }
    ]
  }
}
```

---

## 交通相关 API

### 1. 查询交通方式

**端点:** `GET /api/transport`

**请求参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `from` | string | 起点 |
| `to` | string | 终点 |
| `date` | string | 日期 |
| `mode` | string | 交通方式：metro, bus, taxi, walk |

**响应示例:**

```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "route_001",
        "mode": "metro",
        "duration": 25,
        "distance": 8.5,
        "steps": [
          {
            "instruction": "步行至天安门东站",
            "distance": 300
          },
          {
            "instruction": "乘坐 1 号线，往四惠东方向",
            "stops": 5
          }
        ],
        "cost": "4 元"
      }
    ]
  }
}
```

---

## 用户相关 API

### 1. 获取用户信息

**端点:** `GET /api/user/profile`

**认证:** 需要 Bearer Token

**响应示例:**

```json
{
  "success": true,
  "data": {
    "id": "user_001",
    "name": "张三",
    "email": "user@example.com",
    "preferences": {
      "language": "zh-CN",
      "currency": "CNY",
      "interests": ["history", "food"]
    }
  }
}
```

---

### 2. 更新用户偏好

**端点:** `PUT /api/user/preferences`

**请求体:**

```json
{
  "interests": ["history", "culture", "nature"],
  "budget": "medium",
  "pace": "moderate"
}
```

---

## WebSocket API

### 行程生成实时状态

**端点:** `ws://localhost:3000/ws/trip/:id`

**描述:** 建立 WebSocket 连接以接收行程生成的实时状态更新

**消息格式:**

```json
{
  "type": "progress",
  "data": {
    "stage": "processing",
    "progress": 45,
    "message": "正在规划第 2 天行程..."
  }
}
```

---

## 速率限制

| 接口类型 | 限制 |
|----------|------|
| 普通 GET 请求 | 100 次/分钟 |
| POST 请求 | 30 次/分钟 |
| AI 生成接口 | 5 次/小时 |

**超限响应:**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "请求频率超限，请稍后重试",
    "retryAfter": 60
  }
}
```

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-04-10 | 初始版本 |

---

## 联系支持

如有问题，请联系：support@chinalanding.ai

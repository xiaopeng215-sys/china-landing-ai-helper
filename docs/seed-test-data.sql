-- ============================================
-- 虚拟测试数据 - China Landing AI Helper
-- 创建时间：2026-04-12
-- 用途：创建 3 个虚拟会员账号及测试数据
-- ============================================

-- ============================================
-- 1. 创建 3 个虚拟会员账号
-- ============================================

-- 用户 1: 张三 (Premium 会员)
INSERT INTO users (id, email, password_hash, name, avatar, language, budget_range, interests, email_verified, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'zhangsan.test@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- 密码：Test1234
  '张三',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  'zh-CN',
  'premium',
  ARRAY['美食', '文化', '摄影'],
  TRUE,
  NOW() - INTERVAL '30 days',
  NOW()
);

-- 用户 2: 李四 (Basic 会员)
INSERT INTO users (id, email, password_hash, name, avatar, language, budget_range, interests, email_verified, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'lisi.test@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- 密码：Test1234
  '李四',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
  'zh-CN',
  'medium',
  ARRAY['购物', '自然', '徒步'],
  TRUE,
  NOW() - INTERVAL '15 days',
  NOW()
);

-- 用户 3: 王五 (VIP 会员)
INSERT INTO users (id, email, password_hash, name, avatar, language, budget_range, interests, email_verified, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'wangwu.test@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- 密码：Test1234
  '王五',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
  'en-US',
  'high',
  ARRAY['豪华', '美食', '历史'],
  TRUE,
  NOW() - INTERVAL '60 days',
  NOW()
);

-- ============================================
-- 2. 创建会员等级数据 (如果不存在)
-- ============================================

INSERT INTO membership_tiers (id, name, name_zh, level, icon, color, benefits, price_monthly, price_yearly, max_daily_queries, max_concurrent_sessions, priority_support, custom_themes, data_export)
VALUES 
  ('tier-free', 'free', '免费版', 1, '🆓', '#6B7280', ARRAY['每日 10 次查询', '基础行程规划', '社区支持'], 0, 0, 10, 1, FALSE, FALSE, FALSE),
  ('tier-basic', 'basic', '基础版', 2, '🥉', '#3B82F6', ARRAY['每日 50 次查询', '优先支持', '行程导出'], 29, 299, 50, 3, TRUE, FALSE, TRUE),
  ('tier-premium', 'premium', '高级版', 3, '🥈', '#8B5CF6', ARRAY['每日 200 次查询', '专属客服', '自定义主题', '数据分析'], 69, 699, 200, 5, TRUE, TRUE, TRUE),
  ('tier-vip', 'vip', '至尊版', 4, '🥇', '#F59E0B', ARRAY['无限查询', '24/7 VIP 支持', '私人定制', '优先新功能'], 199, 1999, 9999, 10, TRUE, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. 创建会员订阅信息
-- ============================================

-- 张三 - Premium 会员
INSERT INTO user_memberships (id, user_id, tier_id, status, started_at, expires_at, auto_renew, created_at, updated_at)
VALUES (
  'mem-001',
  '550e8400-e29b-41d4-a716-446655440001',
  'tier-premium',
  'active',
  NOW() - INTERVAL '25 days',
  NOW() + INTERVAL '5 days',
  TRUE,
  NOW() - INTERVAL '25 days',
  NOW()
);

-- 李四 - Basic 会员
INSERT INTO user_memberships (id, user_id, tier_id, status, started_at, expires_at, auto_renew, created_at, updated_at)
VALUES (
  'mem-002',
  '550e8400-e29b-41d4-a716-446655440002',
  'tier-basic',
  'active',
  NOW() - INTERVAL '10 days',
  NOW() + INTERVAL '20 days',
  TRUE,
  NOW() - INTERVAL '10 days',
  NOW()
);

-- 王五 - VIP 会员
INSERT INTO user_memberships (id, user_id, tier_id, status, started_at, expires_at, auto_renew, created_at, updated_at)
VALUES (
  'mem-003',
  '550e8400-e29b-41d4-a716-446655440003',
  'tier-vip',
  'active',
  NOW() - INTERVAL '50 days',
  NOW() + INTERVAL '10 days',
  TRUE,
  NOW() - INTERVAL '50 days',
  NOW()
);

-- ============================================
-- 4. 创建会员积分
-- ============================================

INSERT INTO membership_points (id, user_id, points, lifetime_points, level, last_activity_at, created_at, updated_at)
VALUES 
  ('points-001', '550e8400-e29b-41d4-a716-446655440001', 2500, 3000, 3, NOW(), NOW() - INTERVAL '25 days', NOW()),
  ('points-002', '550e8400-e29b-41d4-a716-446655440002', 800, 1000, 2, NOW(), NOW() - INTERVAL '10 days', NOW()),
  ('points-003', '550e8400-e29b-41d4-a716-446655440003', 8500, 10000, 4, NOW(), NOW() - INTERVAL '50 days', NOW());

-- ============================================
-- 5. 创建收藏数据
-- ============================================

-- 张三的收藏
INSERT INTO favorites (id, user_id, type, item_id, created_at)
VALUES 
  ('fav-001', '550e8400-e29b-41d4-a716-446655440001', 'itinerary', 'shanghai-4d', NOW() - INTERVAL '20 days'),
  ('fav-002', '550e8400-e29b-41d4-a716-446655440001', 'itinerary', 'beijing-5d', NOW() - INTERVAL '18 days'),
  ('fav-003', '550e8400-e29b-41d4-a716-446655440001', 'food', 'restaurant-001', NOW() - INTERVAL '15 days'),
  ('fav-004', '550e8400-e29b-41d4-a716-446655440001', 'attraction', 'attraction-001', NOW() - INTERVAL '10 days');

-- 李四的收藏
INSERT INTO favorites (id, user_id, type, item_id, created_at)
VALUES 
  ('fav-005', '550e8400-e29b-41d4-a716-446655440002', 'itinerary', 'guilin-3d', NOW() - INTERVAL '8 days'),
  ('fav-006', '550e8400-e29b-41d4-a716-446655440002', 'attraction', 'attraction-002', NOW() - INTERVAL '5 days');

-- 王五的收藏
INSERT INTO favorites (id, user_id, type, item_id, created_at)
VALUES 
  ('fav-007', '550e8400-e29b-41d4-a716-446655440003', 'itinerary', 'xian-3d', NOW() - INTERVAL '40 days'),
  ('fav-008', '550e8400-e29b-41d4-a716-446655440003', 'itinerary', 'chengdu-3d', NOW() - INTERVAL '35 days'),
  ('fav-009', '550e8400-e29b-41d4-a716-446655440003', 'food', 'restaurant-002', NOW() - INTERVAL '30 days'),
  ('fav-010', '550e8400-e29b-41d4-a716-446655440003', 'attraction', 'attraction-003', NOW() - INTERVAL '25 days'),
  ('fav-011', '550e8400-e29b-41d4-a716-446655440003', 'attraction', 'attraction-004', NOW() - INTERVAL '20 days');

-- ============================================
-- 6. 创建行程数据
-- ============================================

-- 张三的行程 - 上海 4 天深度游
INSERT INTO itineraries (id, user_id, title, destination, days, budget, days_plan, created_at, updated_at)
VALUES (
  'trip-001',
  '550e8400-e29b-41d4-a716-446655440001',
  '上海 4 天深度游',
  '上海',
  4,
  3500.00,
  '[
    {"day": 1, "title": "抵达 & 初识上海", "activities": [
      {"time": "14:00", "type": "attraction", "name": "南京路步行街", "description": "中国最著名的商业街之一", "price": 0, "location": "黄浦区"},
      {"time": "18:00", "type": "food", "name": "南翔馒头店", "description": "品尝正宗上海小笼包", "price": 80, "location": "豫园路"},
      {"time": "20:00", "type": "attraction", "name": "外滩夜景", "description": "欣赏浦江两岸美景", "price": 0, "location": "中山东一路"}
    ]},
    {"day": 2, "title": "老上海 & 租界文化", "activities": [
      {"time": "09:00", "type": "attraction", "name": "豫园", "description": "明代古典园林", "price": 40, "location": "安仁街"},
      {"time": "12:00", "type": "food", "name": "绿波廊", "description": "本帮菜老字号", "price": 150, "location": "豫园路"},
      {"time": "15:00", "type": "attraction", "name": "田子坊", "description": "创意艺术街区", "price": 0, "location": "泰康路"}
    ]},
    {"day": 3, "title": "现代上海", "activities": [
      {"time": "10:00", "type": "attraction", "name": "上海博物馆", "description": "中国古代艺术宝库", "price": 0, "location": "人民大道"},
      {"time": "15:00", "type": "attraction", "name": "东方明珠", "description": "上海地标建筑", "price": 199, "location": "陆家嘴"}
    ]},
    {"day": 4, "title": "送别", "activities": [
      {"time": "10:00", "type": "attraction", "name": "新天地", "description": "石库门改造的时尚街区", "price": 0, "location": "太仓路"},
      {"time": "14:00", "type": "transport", "name": "前往机场", "description": "磁悬浮列车", "price": 50, "location": "龙阳路站"}
    ]}
  ]'::jsonb,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '5 days'
);

-- 张三的行程 - 北京 3 天文化游
INSERT INTO itineraries (id, user_id, title, destination, days, budget, days_plan, created_at, updated_at)
VALUES (
  'trip-002',
  '550e8400-e29b-41d4-a716-446655440001',
  '北京 3 天文化游',
  '北京',
  3,
  2800.00,
  '[
    {"day": 1, "title": "皇城核心区", "activities": [
      {"time": "08:00", "type": "attraction", "name": "天安门广场", "description": "世界最大城市广场", "price": 0, "location": "东城区"},
      {"time": "10:00", "type": "attraction", "name": "故宫", "description": "明清皇家宫殿", "price": 60, "location": "景山前街"}
    ]},
    {"day": 2, "title": "长城一日游", "activities": [
      {"time": "07:00", "type": "attraction", "name": "八达岭长城", "description": "世界文化遗产", "price": 40, "location": "延庆区"}
    ]},
    {"day": 3, "title": "老北京生活", "activities": [
      {"time": "09:00", "type": "attraction", "name": "天坛", "description": "明清皇帝祭天场所", "price": 15, "location": "东城区"},
      {"time": "14:00", "type": "attraction", "name": "什刹海", "description": "老北京胡同区", "price": 0, "location": "西城区"}
    ]}
  ]'::jsonb,
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '3 days'
);

-- 李四的行程 - 桂林 3 天山水游
INSERT INTO itineraries (id, user_id, title, destination, days, budget, days_plan, created_at, updated_at)
VALUES (
  'trip-003',
  '550e8400-e29b-41d4-a716-446655440002',
  '桂林 3 天山水游',
  '桂林',
  3,
  2200.00,
  '[
    {"day": 1, "title": "漓江精华", "activities": [
      {"time": "09:00", "type": "attraction", "name": "漓江竹筏", "description": "杨堤 - 兴坪精华段", "price": 218, "location": "阳朔县"},
      {"time": "15:00", "type": "attraction", "name": "兴坪古镇", "description": "20 元人民币背景取景地", "price": 0, "location": "阳朔县"}
    ]},
    {"day": 2, "title": "阳朔田园", "activities": [
      {"time": "09:00", "type": "attraction", "name": "十里画廊骑行", "description": "田园风光骑行", "price": 30, "location": "阳朔县"},
      {"time": "14:00", "type": "attraction", "name": "遇龙河漂流", "description": "悠闲竹筏漂流", "price": 160, "location": "阳朔县"}
    ]},
    {"day": 3, "title": "喀斯特探秘", "activities": [
      {"time": "09:00", "type": "attraction", "name": "银子岩", "description": "喀斯特溶洞", "price": 65, "location": "荔浦县"},
      {"time": "15:00", "type": "attraction", "name": "象鼻山", "description": "桂林城徽", "price": 75, "location": "桂林市区"}
    ]}
  ]'::jsonb,
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '2 days'
);

-- 王五的行程 - 西安 3 天历史游
INSERT INTO itineraries (id, user_id, title, destination, days, budget, days_plan, created_at, updated_at)
VALUES (
  'trip-004',
  '550e8400-e29b-41d4-a716-446655440003',
  '西安 3 天历史游',
  '西安',
  3,
  4500.00,
  '[
    {"day": 1, "title": "历史震撼", "activities": [
      {"time": "08:00", "type": "attraction", "name": "秦始皇兵马俑", "description": "世界第八大奇迹", "price": 150, "location": "临潼区"},
      {"time": "14:00", "type": "attraction", "name": "华清池", "description": "唐玄宗与杨贵妃故事发生地", "price": 120, "location": "临潼区"}
    ]},
    {"day": 2, "title": "古城穿越", "activities": [
      {"time": "09:00", "type": "attraction", "name": "西安城墙", "description": "中国保存最完整的古城墙", "price": 54, "location": "碑林区"},
      {"time": "14:00", "type": "attraction", "name": "陕西历史博物馆", "description": "古都明珠", "price": 0, "location": "雁塔区"}
    ]},
    {"day": 3, "title": "大唐盛世", "activities": [
      {"time": "09:00", "type": "attraction", "name": "大雁塔", "description": "玄奘译经之地", "price": 40, "location": "雁塔区"},
      {"time": "19:00", "type": "attraction", "name": "大唐不夜城", "description": "盛唐主题步行街", "price": 0, "location": "雁塔区"}
    ]}
  ]'::jsonb,
  NOW() - INTERVAL '40 days',
  NOW() - INTERVAL '10 days'
);

-- 王五的行程 - 成都 3 天美食游
INSERT INTO itineraries (id, user_id, title, destination, days, budget, days_plan, created_at, updated_at)
VALUES (
  'trip-005',
  '550e8400-e29b-41d4-a716-446655440003',
  '成都 3 天美食游',
  '成都',
  3,
  3800.00,
  '[
    {"day": 1, "title": "萌宠 & 老成都", "activities": [
      {"time": "08:00", "type": "attraction", "name": "熊猫基地", "description": "看滚滚最佳时间", "price": 55, "location": "成华区"},
      {"time": "14:00", "type": "attraction", "name": "宽窄巷子", "description": "清代古街道", "price": 0, "location": "青羊区"},
      {"time": "19:00", "type": "food", "name": "小龙坎火锅", "description": "正宗四川火锅", "price": 150, "location": "锦江区"}
    ]},
    {"day": 2, "title": "三国文化", "activities": [
      {"time": "09:00", "type": "attraction", "name": "武侯祠", "description": "纪念诸葛亮的祠堂", "price": 50, "location": "武侯区"},
      {"time": "14:00", "type": "attraction", "name": "锦里古街", "description": "三国文化主题街区", "price": 0, "location": "武侯区"}
    ]},
    {"day": 3, "title": "美食探路", "activities": [
      {"time": "09:00", "type": "food", "name": "建设路小吃街", "description": "成都小吃集中地", "price": 100, "location": "成华区"},
      {"time": "15:00", "type": "attraction", "name": "春熙路", "description": "成都最繁华商业街", "price": 0, "location": "锦江区"}
    ]}
  ]'::jsonb,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '7 days'
);

-- ============================================
-- 7. 创建聊天会话
-- ============================================

-- 张三的聊天会话
INSERT INTO chat_sessions (id, user_id, title, created_at, updated_at)
VALUES 
  ('session-001', '550e8400-e29b-41d4-a716-446655440001', '上海行程咨询', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'),
  ('session-002', '550e8400-e29b-41d4-a716-446655440001', '北京美食推荐', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),
  ('session-003', '550e8400-e29b-41d4-a716-446655440001', '交通方式咨询', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

-- 李四的聊天会话
INSERT INTO chat_sessions (id, user_id, title, created_at, updated_at)
VALUES 
  ('session-004', '550e8400-e29b-41d4-a716-446655440002', '桂林行程规划', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),
  ('session-005', '550e8400-e29b-41d4-a716-446655440002', '阳朔住宿推荐', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

-- 王五的聊天会话
INSERT INTO chat_sessions (id, user_id, title, created_at, updated_at)
VALUES 
  ('session-006', '550e8400-e29b-41d4-a716-446655440003', '西安历史讲解', NOW() - INTERVAL '45 days', NOW() - INTERVAL '44 days'),
  ('session-007', '550e8400-e29b-41d4-a716-446655440003', '成都美食攻略', NOW() - INTERVAL '35 days', NOW() - INTERVAL '34 days'),
  ('session-008', '550e8400-e29b-41d4-a716-446655440003', 'VIP 定制服务咨询', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- ============================================
-- 8. 创建聊天消息
-- ============================================

-- 张三 - 上海行程咨询会话
INSERT INTO messages (id, session_id, user_id, role, content, tokens, created_at)
VALUES 
  ('msg-001', 'session-001', '550e8400-e29b-41d4-a716-446655440001', 'user', '你好，我想规划一个上海 4 天的行程，喜欢美食和骑行', 20, NOW() - INTERVAL '20 days'),
  ('msg-002', 'session-001', '550e8400-e29b-41d4-a716-446655440001', 'assistant', '你好！很高兴为你规划上海 4 天深度游。上海是美食和骑行的绝佳目的地！\n\n我为你推荐以下行程亮点：\n\n🍜 **美食推荐**：\n- 南翔馒头店：正宗上海小笼包\n- 老吉士酒家：本帮菜经典\n- 佳家汤包：鲜美汤包\n\n🚴 **骑行路线**：\n- 徐汇滨江：11 公里滨江道\n- 浦东滨江：23 公里骑行道\n- 衡山路 - 余庆路：法租界风情\n\n需要我为你生成详细的每日行程吗？', 150, NOW() - INTERVAL '20 days'),
  ('msg-003', 'session-001', '550e8400-e29b-41d4-a716-446655440001', 'user', '好的，请帮我生成详细行程', 10, NOW() - INTERVAL '20 days'),
  ('msg-004', 'session-001', '550e8400-e29b-41d4-a716-446655440001', 'assistant', '已为你生成上海 4 天深度游行程！\n\n**Day 1: 抵达 & 初识上海**\n- 南京路步行街 → 人民广场 → 外滩夜景\n- 晚餐：南翔馒头店\n\n**Day 2: 老上海 & 租界文化**\n- 豫园 → 城隍庙 → 田子坊 → 新天地\n- 骑行：衡山路历史风貌区\n\n**Day 3: 现代上海 & 艺术**\n- 上海博物馆 → 东方明珠 → 上海中心\n- 骑行：徐汇滨江 11km\n\n**Day 4: 近郊 & 送别**\n- 朱家角古镇 or 淮海路购物\n\n预算估算：¥3500/人\n需要我帮你预订吗？', 180, NOW() - INTERVAL '20 days');

-- 张三 - 北京美食推荐会话
INSERT INTO messages (id, session_id, user_id, role, content, tokens, created_at)
VALUES 
  ('msg-005', 'session-002', '550e8400-e29b-41d4-a716-446655440001', 'user', '北京有哪些必吃的美食？', 10, NOW() - INTERVAL '15 days'),
  ('msg-006', 'session-002', '550e8400-e29b-41d4-a716-446655440001', 'assistant', '北京美食太多了！给你推荐这些必吃的：\n\n🦆 **北京烤鸭**\n- 全聚德：老字号，¥200-300/人\n- 便宜坊：焖炉烤鸭，¥150-250/人\n- 大董：创意烤鸭，¥400-600/人\n\n🍜 **面食类**\n- 炸酱面：海碗居、方砖厂 69 号\n- 打卤面：老北京家常菜\n\n🥟 **小吃类**\n- 卤煮火烧：小肠陈、北新桥卤煮\n- 炒肝：姚记炒肝\n- 豆汁儿配焦圈：护国寺小吃\n\n🍢 **其他**\n- 涮羊肉：东来顺、南门涮肉\n- 宫廷点心：仿膳饭庄\n\n需要我推荐具体店铺地址吗？', 200, NOW() - INTERVAL '15 days');

-- 李四 - 桂林行程规划会话
INSERT INTO messages (id, session_id, user_id, role, content, tokens, created_at)
VALUES 
  ('msg-007', 'session-004', '550e8400-e29b-41d4-a716-446655440002', 'user', '桂林 3 天怎么玩比较好？', 10, NOW() - INTERVAL '10 days'),
  ('msg-008', 'session-004', '550e8400-e29b-41d4-a716-446655440002', 'assistant', '桂林 3 天建议这样安排：\n\n🎋 **Day 1: 漓江精华游**\n- 杨堤码头乘竹筏 → 九马画山 → 兴坪古镇\n- 晚上住阳朔，逛西街\n- 必做：20 元人民币背景打卡\n\n🚴 **Day 2: 阳朔田园骑行**\n- 十里画廊电动车骑行\n- 遇龙河竹筏漂流\n- 大榕树、月亮山\n\n⛰️ **Day 3: 喀斯特探秘**\n- 银子岩溶洞\n- 返回桂林市区\n- 象鼻山、两江四湖夜景\n\n预算：¥2000-2500/人\n最佳季节：4-6 月、9-11 月（烟雨漓江最美）\n\n需要我帮你细化每天的安排吗？', 180, NOW() - INTERVAL '10 days'),
  ('msg-009', 'session-004', '550e8400-e29b-41d4-a716-446655440002', 'user', '阳朔有什么好吃的？', 8, NOW() - INTERVAL '10 days'),
  ('msg-010', 'session-004', '550e8400-e29b-41d4-a716-446655440002', 'assistant', '阳朔美食推荐：\n\n🐟 **阳朔啤酒鱼**\n- 必吃！用漓江鲜鱼 + 啤酒烹制\n- 推荐：谢三姐啤酒鱼、大师傅啤酒鱼\n- 价格：¥68-98/斤\n\n🍜 **桂林米粉**\n- 当地人早餐首选\n- 推荐：崇善米粉、又轩米粉\n- 价格：¥5-8/碗\n\n🦀 **田螺酿**\n- 田螺肉 + 猪肉 + 薄荷\n- 推荐：西街大排档\n\n🍵 **油茶**\n- 恭城油茶最有名\n- 配炒米、花生、糍粑\n\n🍰 **其他小吃**\n- 马蹄糕、桂花糕、艾叶粑粑\n\n西街晚上很热闹，可以边吃边逛！', 150, NOW() - INTERVAL '10 days');

-- 王五 - 西安历史讲解会话
INSERT INTO messages (id, session_id, user_id, role, content, tokens, created_at)
VALUES 
  ('msg-011', 'session-006', '550e8400-e29b-41d4-a716-446655440003', 'user', '兵马俑有什么历史背景？', 10, NOW() - INTERVAL '45 days'),
  ('msg-012', 'session-006', '550e8400-e29b-41d4-a716-446655440003', 'assistant', '兵马俑是中国历史上最伟大的考古发现之一！\n\n📜 **历史背景**\n- 建造时间：公元前 246-208 年\n- 建造者：秦始皇嬴政\n- 目的：守护秦始皇陵的地下军队\n\n🎖️ **规模**\n- 已发掘 3 个坑，总面积 2 万多平方米\n- 出土陶俑、陶马近 8000 件\n- 战车 100 多辆，兵器数万件\n\n🔍 **特点**\n- 每个俑面部表情都不一样\n- 按照真实秦军编制排列\n-  originally 都是彩色的（出土后氧化褪色）\n\n💡 **参观建议**\n- 请导游（否则就是看泥人）\n- 重点看：一号坑（最大）、铜车马馆\n- 时间：至少 3 小时\n\n门票：¥150（含秦始皇陵）\n交通：从西安市区乘游 5 路或地铁 9 号线', 220, NOW() - INTERVAL '45 days'),
  ('msg-013', 'session-006', '550e8400-e29b-41d4-a716-446655440003', 'user', '西安城墙有多长？可以骑行吗？', 15, NOW() - INTERVAL '44 days'),
  ('msg-014', 'session-006', '550e8400-e29b-41d4-a716-446655440003', 'assistant', '西安城墙信息：\n\n📏 **基本数据**\n- 周长：13.74 公里\n- 高度：12 米\n- 顶宽：12-14 米\n- 底宽：15-18 米\n- 中国保存最完整的古代城垣\n\n🚴 **骑行信息**\n- ✅ 可以骑行！这是最受欢迎的体验方式\n- 租车点：永宁门、安定门、安远门、含光门\n- 单人车：¥45/3 小时\n- 双人车：¥90/3 小时\n- 建议时间：傍晚（看日落）或清晨（人少）\n\n⏰ **开放时间**\n- 夏季：8:00-22:00\n- 冬季：8:00-19:00\n\n🎫 **门票**\n- 成人票：¥54\n- 学生票：¥27\n\n💡 **建议路线**\n永宁门 → 含光门 → 安定门 → 安远门 → 永宁门（完整一圈约 2-3 小时）\n\n骑完城墙可以去回民街吃美食！', 200, NOW() - INTERVAL '44 days');

-- 王五 - VIP 定制服务咨询
INSERT INTO messages (id, session_id, user_id, role, content, tokens, created_at)
VALUES 
  ('msg-015', 'session-008', '550e8400-e29b-41d4-a716-446655440003', 'user', 'VIP 会员有什么专属服务？', 12, NOW() - INTERVAL '10 days'),
  ('msg-016', 'session-008', '550e8400-e29b-41d4-a716-446655440003', 'assistant', '尊敬的 VIP 会员，您享有以下专属权益：\n\n👑 **VIP 至尊权益**\n\n✨ **无限查询**\n- 每日查询次数无限制\n- 同时支持 10 个并发会话\n\n🎯 **私人定制**\n- 专属旅行规划师 1 对 1 服务\n- 根据您的需求定制行程\n- 可随时调整行程细节\n\n📞 **24/7 VIP 支持**\n- 专属客服热线\n- 优先响应（<5 分钟）\n- 紧急协助服务\n\n🎨 **个性化功能**\n- 自定义主题皮肤\n- 专属数据面板\n- 行程数据导出（PDF/Excel）\n\n🎁 **合作伙伴优惠**\n- 合作酒店 8 折起\n- 景点门票 VIP 通道\n- 餐厅预订优先权\n\n💰 **积分加速**\n- 消费积分 2 倍累积\n- 生日月额外赠送 1000 积分\n\n您当前的积分：8500 分\n可兑换：机场接送、酒店升级、景点门票等\n\n需要我帮您安排什么服务吗？', 250, NOW() - INTERVAL '10 days');

-- ============================================
-- 9. 创建浏览历史
-- ============================================

-- 张三的浏览历史
INSERT INTO browse_history (id, user_id, page_type, page_id, page_title, viewed_at)
VALUES 
  ('history-001', '550e8400-e29b-41d4-a716-446655440001', 'itinerary', 'shanghai-4d', '上海 4 天深度游', NOW() - INTERVAL '20 days'),
  ('history-002', '550e8400-e29b-41d4-a716-446655440001', 'itinerary', 'beijing-5d', '北京 5 天文化游', NOW() - INTERVAL '18 days'),
  ('history-003', '550e8400-e29b-41d4-a716-446655440001', 'food', 'restaurant-001', '南翔馒头店', NOW() - INTERVAL '15 days'),
  ('history-004', '550e8400-e29b-41d4-a716-446655440001', 'attraction', 'attraction-001', '外滩', NOW() - INTERVAL '12 days'),
  ('history-005', '550e8400-e29b-41d4-a716-446655440001', 'itinerary', 'hangzhou-2d', '杭州 2 天休闲游', NOW() - INTERVAL '5 days');

-- 李四的浏览历史
INSERT INTO browse_history (id, user_id, page_type, page_id, page_title, viewed_at)
VALUES 
  ('history-006', '550e8400-e29b-41d4-a716-446655440002', 'itinerary', 'guilin-3d', '桂林 3 天山水游', NOW() - INTERVAL '10 days'),
  ('history-007', '550e8400-e29b-41d4-a716-446655440002', 'attraction', 'attraction-002', '漓江', NOW() - INTERVAL '8 days'),
  ('history-008', '550e8400-e29b-41d4-a716-446655440002', 'food', 'restaurant-003', '谢三姐啤酒鱼', NOW() - INTERVAL '7 days');

-- 王五的浏览历史
INSERT INTO browse_history (id, user_id, page_type, page_id, page_title, viewed_at)
VALUES 
  ('history-009', '550e8400-e29b-41d4-a716-446655440003', 'itinerary', 'xian-3d', '西安 3 天历史游', NOW() - INTERVAL '45 days'),
  ('history-010', '550e8400-e29b-41d4-a716-446655440003', 'itinerary', 'chengdu-3d', '成都 3 天美食游', NOW() - INTERVAL '40 days'),
  ('history-011', '550e8400-e29b-41d4-a716-446655440003', 'attraction', 'attraction-003', '秦始皇兵马俑', NOW() - INTERVAL '38 days'),
  ('history-012', '550e8400-e29b-41d4-a716-446655440003', 'food', 'restaurant-004', '小龙坎火锅', NOW() - INTERVAL '35 days'),
  ('history-013', '550e8400-e29b-41d4-a716-446655440003', 'attraction', 'attraction-004', '宽窄巷子', NOW() - INTERVAL '32 days'),
  ('history-014', '550e8400-e29b-41d4-a716-446655440003', 'itinerary', 'beijing-5d', '北京 5 天文化游', NOW() - INTERVAL '15 days');

-- ============================================
-- 10. 积分流水记录
-- ============================================

INSERT INTO points_transactions (id, user_id, points_change, balance_after, transaction_type, reason, reference_id, created_at)
VALUES 
  -- 张三的积分流水
  ('tx-001', '550e8400-e29b-41d4-a716-446655440001', 500, 500, 'earn', '新用户注册奖励', NULL, NOW() - INTERVAL '30 days'),
  ('tx-002', '550e8400-e29b-41d4-a716-446655440001', 1000, 1500, 'earn', '购买 Premium 会员', 'mem-001', NOW() - INTERVAL '25 days'),
  ('tx-003', '550e8400-e29b-41d4-a716-446655440001', 200, 1700, 'earn', '完成首次行程规划', 'trip-001', NOW() - INTERVAL '20 days'),
  ('tx-004', '550e8400-e29b-41d4-a716-446655440001', 300, 2000, 'earn', '每日签到奖励（7 天）', NULL, NOW() - INTERVAL '15 days'),
  ('tx-005', '550e8400-e29b-41d4-a716-446655440001', 500, 2500, 'earn', '推荐好友注册', NULL, NOW() - INTERVAL '10 days'),
  ('tx-006', '550e8400-e29b-41d4-a716-446655440001', 500, 3000, 'earn', '购买 Premium 会员续费', 'mem-001', NOW() - INTERVAL '5 days'),
  ('tx-007', '550e8400-e29b-41d4-a716-446655440001', -500, 2500, 'spend', '兑换机场接送服务', 'redeem-001', NOW() - INTERVAL '3 days'),
  
  -- 李四的积分流水
  ('tx-008', '550e8400-e29b-41d4-a716-446655440002', 500, 500, 'earn', '新用户注册奖励', NULL, NOW() - INTERVAL '15 days'),
  ('tx-009', '550e8400-e29b-41d4-a716-446655440002', 300, 800, 'earn', '购买 Basic 会员', 'mem-002', NOW() - INTERVAL '10 days'),
  ('tx-010', '550e8400-e29b-41d4-a716-446655440002', 200, 1000, 'earn', '完成行程规划', 'trip-003', NOW() - INTERVAL '8 days'),
  
  -- 王五的积分流水
  ('tx-011', '550e8400-e29b-41d4-a716-446655440003', 500, 500, 'earn', '新用户注册奖励', NULL, NOW() - INTERVAL '60 days'),
  ('tx-012', '550e8400-e29b-41d4-a716-446655440003', 2000, 2500, 'earn', '购买 VIP 会员', 'mem-003', NOW() - INTERVAL '50 days'),
  ('tx-013', '550e8400-e29b-41d4-a716-446655440003', 500, 3000, 'earn', '完成首次行程规划', 'trip-004', NOW() - INTERVAL '40 days'),
  ('tx-014', '550e8400-e29b-41d4-a716-446655440003', 1000, 4000, 'earn', '推荐 3 位好友注册', NULL, NOW() - INTERVAL '30 days'),
  ('tx-015', '550e8400-e29b-41d4-a716-446655440003', 1500, 5500, 'earn', 'VIP 会员月度奖励', 'mem-003', NOW() - INTERVAL '20 days'),
  ('tx-016', '550e8400-e29b-41d4-a716-446655440003', 3000, 8500, 'earn', 'VIP 会员续费', 'mem-003', NOW() - INTERVAL '10 days'),
  ('tx-017', '550e8400-e29b-41d4-a716-446655440003', 1500, 10000, 'bonus', 'VIP 用户生日奖励', NULL, NOW() - INTERVAL '5 days');

-- ============================================
-- 数据验证查询（可选执行）
-- ============================================

-- 验证用户数量
-- SELECT COUNT(*) FROM users WHERE email LIKE '%test@example.com';

-- 验证每个用户的收藏数量
-- SELECT u.name, COUNT(f.id) as favorite_count 
-- FROM users u 
-- LEFT JOIN favorites f ON u.id = f.user_id 
-- WHERE u.email LIKE '%test@example.com'
-- GROUP BY u.name;

-- 验证每个用户的行程数量
-- SELECT u.name, COUNT(i.id) as itinerary_count 
-- FROM users u 
-- LEFT JOIN itineraries i ON u.id = i.user_id 
-- WHERE u.email LIKE '%test@example.com'
-- GROUP BY u.name;

-- 验证每个用户的聊天消息数量
-- SELECT u.name, COUNT(m.id) as message_count 
-- FROM users u 
-- LEFT JOIN messages m ON u.id = m.user_id 
-- WHERE u.email LIKE '%test@example.com'
-- GROUP BY u.name;

-- ============================================
-- 测试数据创建完成！
-- ============================================

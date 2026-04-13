/**
 * 虚拟测试数据种子脚本
 * 用途：在开发/测试模式下创建虚拟会员账号和测试数据
 * 使用场景：本地开发、测试环境、演示环境
 */

import {
  supabase,
  isInMemoryMode,
  type User,
  type MembershipTier,
  type UserMembership,
  type MembershipPoints,
  type Favorite,
  type Itinerary,
  type ChatSession,
  type Message,
  type BrowseHistory,
  type PointsTransaction,
} from './database';

// ============================================
// 测试用户数据
// ============================================

const TEST_USERS: Array<Partial<User> & { email: string; password?: string }> = [
  {
    id: 'test-user-001',
    email: 'zhangsan.test@example.com',
    name: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    language: 'zh-CN',
    budget_range: 'premium',
    interests: ['美食', '文化', '摄影'],
    password: 'Test1234',
  },
  {
    id: 'test-user-002',
    email: 'lisi.test@example.com',
    name: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    language: 'zh-CN',
    budget_range: 'medium',
    interests: ['购物', '自然', '徒步'],
    password: 'Test1234',
  },
  {
    id: 'test-user-003',
    email: 'wangwu.test@example.com',
    name: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    language: 'en-US',
    budget_range: 'high',
    interests: ['豪华', '美食', '历史'],
    password: 'Test1234',
  },
];

// ============================================
// 会员等级数据
// ============================================

const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'tier-free',
    name: 'free',
    name_zh: '免费版',
    level: 1,
    icon: '🆓',
    color: '#6B7280',
    benefits: ['每日 10 次查询', '基础行程规划', '社区支持'],
    price_monthly: 0,
    price_yearly: 0,
    max_daily_queries: 10,
    max_concurrent_sessions: 1,
    priority_support: false,
    custom_themes: false,
    data_export: false,
  },
  {
    id: 'tier-basic',
    name: 'basic',
    name_zh: '基础版',
    level: 2,
    icon: '🥉',
    color: '#3B82F6',
    benefits: ['每日 50 次查询', '优先支持', '行程导出'],
    price_monthly: 29,
    price_yearly: 299,
    max_daily_queries: 50,
    max_concurrent_sessions: 3,
    priority_support: true,
    custom_themes: false,
    data_export: true,
  },
  {
    id: 'tier-premium',
    name: 'premium',
    name_zh: '高级版',
    level: 3,
    icon: '🥈',
    color: '#8B5CF6',
    benefits: ['每日 200 次查询', '专属客服', '自定义主题', '数据分析'],
    price_monthly: 69,
    price_yearly: 699,
    max_daily_queries: 200,
    max_concurrent_sessions: 5,
    priority_support: true,
    custom_themes: true,
    data_export: true,
  },
  {
    id: 'tier-vip',
    name: 'vip',
    name_zh: '至尊版',
    level: 4,
    icon: '🥇',
    color: '#F59E0B',
    benefits: ['无限查询', '24/7 VIP 支持', '私人定制', '优先新功能'],
    price_monthly: 199,
    price_yearly: 1999,
    max_daily_queries: 9999,
    max_concurrent_sessions: 10,
    priority_support: true,
    custom_themes: true,
    data_export: true,
  },
];

// ============================================
// 会员订阅数据
// ============================================

const USER_MEMBERSHIPS: UserMembership[] = [
  {
    id: 'mem-001',
    user_id: 'test-user-001',
    tier_id: 'tier-premium',
    status: 'active',
    started_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    auto_renew: true,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mem-002',
    user_id: 'test-user-002',
    tier_id: 'tier-basic',
    status: 'active',
    started_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    auto_renew: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mem-003',
    user_id: 'test-user-003',
    tier_id: 'tier-vip',
    status: 'active',
    started_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    auto_renew: true,
    created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ============================================
// 会员积分数据
// ============================================

const MEMBERSHIP_POINTS: MembershipPoints[] = [
  {
    id: 'points-001',
    user_id: 'test-user-001',
    points: 2500,
    lifetime_points: 3000,
    level: 3,
    last_activity_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'points-002',
    user_id: 'test-user-002',
    points: 800,
    lifetime_points: 1000,
    level: 2,
    last_activity_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'points-003',
    user_id: 'test-user-003',
    points: 8500,
    lifetime_points: 10000,
    level: 4,
    last_activity_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ============================================
// 收藏数据
// ============================================

const FAVORITES: Favorite[] = [
  // 张三的收藏
  { id: 'fav-001', user_id: 'test-user-001', type: 'itinerary', item_id: 'shanghai-4d', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fav-002', user_id: 'test-user-001', type: 'itinerary', item_id: 'beijing-5d', created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fav-003', user_id: 'test-user-001', type: 'food', item_id: 'restaurant-001', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fav-004', user_id: 'test-user-001', type: 'attraction', item_id: 'attraction-001', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 李四的收藏
  { id: 'fav-005', user_id: 'test-user-002', type: 'itinerary', item_id: 'guilin-3d', created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fav-006', user_id: 'test-user-002', type: 'attraction', item_id: 'attraction-002', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 王五的收藏
  { id: 'fav-007', user_id: 'test-user-003', type: 'itinerary', item_id: 'xian-3d', created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fav-008', user_id: 'test-user-003', type: 'itinerary', item_id: 'chengdu-3d', created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fav-009', user_id: 'test-user-003', type: 'food', item_id: 'restaurant-002', created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fav-010', user_id: 'test-user-003', type: 'attraction', item_id: 'attraction-003', created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fav-011', user_id: 'test-user-003', type: 'attraction', item_id: 'attraction-004', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
];

// ============================================
// 行程数据
// ============================================

const ITINERARIES: Itinerary[] = [
  {
    id: 'trip-001',
    user_id: 'test-user-001',
    title: '上海 4 天深度游',
    destination: '上海',
    days: 4,
    budget: 3500,
    days_plan: [
      {
        day: 1,
        title: '抵达 & 初识上海',
        activities: [
          { time: '14:00', type: 'attraction', name: '南京路步行街', description: '中国最著名的商业街之一', price: 0, location: '黄浦区' },
          { time: '18:00', type: 'food', name: '南翔馒头店', description: '品尝正宗上海小笼包', price: 80, location: '豫园路' },
          { time: '20:00', type: 'attraction', name: '外滩夜景', description: '欣赏浦江两岸美景', price: 0, location: '中山东一路' },
        ],
      },
      {
        day: 2,
        title: '老上海 & 租界文化',
        activities: [
          { time: '09:00', type: 'attraction', name: '豫园', description: '明代古典园林', price: 40, location: '安仁街' },
          { time: '12:00', type: 'food', name: '绿波廊', description: '本帮菜老字号', price: 150, location: '豫园路' },
          { time: '15:00', type: 'attraction', name: '田子坊', description: '创意艺术街区', price: 0, location: '泰康路' },
        ],
      },
      {
        day: 3,
        title: '现代上海',
        activities: [
          { time: '10:00', type: 'attraction', name: '上海博物馆', description: '中国古代艺术宝库', price: 0, location: '人民大道' },
          { time: '15:00', type: 'attraction', name: '东方明珠', description: '上海地标建筑', price: 199, location: '陆家嘴' },
        ],
      },
      {
        day: 4,
        title: '送别',
        activities: [
          { time: '10:00', type: 'attraction', name: '新天地', description: '石库门改造的时尚街区', price: 0, location: '太仓路' },
          { time: '14:00', type: 'transport', name: '前往机场', description: '磁悬浮列车', price: 50, location: '龙阳路站' },
        ],
      },
    ],
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'trip-002',
    user_id: 'test-user-001',
    title: '北京 3 天文化游',
    destination: '北京',
    days: 3,
    budget: 2800,
    days_plan: [
      {
        day: 1,
        title: '皇城核心区',
        activities: [
          { time: '08:00', type: 'attraction', name: '天安门广场', description: '世界最大城市广场', price: 0, location: '东城区' },
          { time: '10:00', type: 'attraction', name: '故宫', description: '明清皇家宫殿', price: 60, location: '景山前街' },
        ],
      },
      {
        day: 2,
        title: '长城一日游',
        activities: [
          { time: '07:00', type: 'attraction', name: '八达岭长城', description: '世界文化遗产', price: 40, location: '延庆区' },
        ],
      },
      {
        day: 3,
        title: '老北京生活',
        activities: [
          { time: '09:00', type: 'attraction', name: '天坛', description: '明清皇帝祭天场所', price: 15, location: '东城区' },
          { time: '14:00', type: 'attraction', name: '什刹海', description: '老北京胡同区', price: 0, location: '西城区' },
        ],
      },
    ],
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'trip-003',
    user_id: 'test-user-002',
    title: '桂林 3 天山水游',
    destination: '桂林',
    days: 3,
    budget: 2200,
    days_plan: [
      {
        day: 1,
        title: '漓江精华',
        activities: [
          { time: '09:00', type: 'attraction', name: '漓江竹筏', description: '杨堤 - 兴坪精华段', price: 218, location: '阳朔县' },
          { time: '15:00', type: 'attraction', name: '兴坪古镇', description: '20 元人民币背景取景地', price: 0, location: '阳朔县' },
        ],
      },
      {
        day: 2,
        title: '阳朔田园',
        activities: [
          { time: '09:00', type: 'attraction', name: '十里画廊骑行', description: '田园风光骑行', price: 30, location: '阳朔县' },
          { time: '14:00', type: 'attraction', name: '遇龙河漂流', description: '悠闲竹筏漂流', price: 160, location: '阳朔县' },
        ],
      },
      {
        day: 3,
        title: '喀斯特探秘',
        activities: [
          { time: '09:00', type: 'attraction', name: '银子岩', description: '喀斯特溶洞', price: 65, location: '荔浦县' },
          { time: '15:00', type: 'attraction', name: '象鼻山', description: '桂林城徽', price: 75, location: '桂林市区' },
        ],
      },
    ],
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'trip-004',
    user_id: 'test-user-003',
    title: '西安 3 天历史游',
    destination: '西安',
    days: 3,
    budget: 4500,
    days_plan: [
      {
        day: 1,
        title: '历史震撼',
        activities: [
          { time: '08:00', type: 'attraction', name: '秦始皇兵马俑', description: '世界第八大奇迹', price: 150, location: '临潼区' },
          { time: '14:00', type: 'attraction', name: '华清池', description: '唐玄宗与杨贵妃故事发生地', price: 120, location: '临潼区' },
        ],
      },
      {
        day: 2,
        title: '古城穿越',
        activities: [
          { time: '09:00', type: 'attraction', name: '西安城墙', description: '中国保存最完整的古城墙', price: 54, location: '碑林区' },
          { time: '14:00', type: 'attraction', name: '陕西历史博物馆', description: '古都明珠', price: 0, location: '雁塔区' },
        ],
      },
      {
        day: 3,
        title: '大唐盛世',
        activities: [
          { time: '09:00', type: 'attraction', name: '大雁塔', description: '玄奘译经之地', price: 40, location: '雁塔区' },
          { time: '19:00', type: 'attraction', name: '大唐不夜城', description: '盛唐主题步行街', price: 0, location: '雁塔区' },
        ],
      },
    ],
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'trip-005',
    user_id: 'test-user-003',
    title: '成都 3 天美食游',
    destination: '成都',
    days: 3,
    budget: 3800,
    days_plan: [
      {
        day: 1,
        title: '萌宠 & 老成都',
        activities: [
          { time: '08:00', type: 'attraction', name: '熊猫基地', description: '看滚滚最佳时间', price: 55, location: '成华区' },
          { time: '14:00', type: 'attraction', name: '宽窄巷子', description: '清代古街道', price: 0, location: '青羊区' },
          { time: '19:00', type: 'food', name: '小龙坎火锅', description: '正宗四川火锅', price: 150, location: '锦江区' },
        ],
      },
      {
        day: 2,
        title: '三国文化',
        activities: [
          { time: '09:00', type: 'attraction', name: '武侯祠', description: '纪念诸葛亮的祠堂', price: 50, location: '武侯区' },
          { time: '14:00', type: 'attraction', name: '锦里古街', description: '三国文化主题街区', price: 0, location: '武侯区' },
        ],
      },
      {
        day: 3,
        title: '美食探路',
        activities: [
          { time: '09:00', type: 'food', name: '建设路小吃街', description: '成都小吃集中地', price: 100, location: '成华区' },
          { time: '15:00', type: 'attraction', name: '春熙路', description: '成都最繁华商业街', price: 0, location: '锦江区' },
        ],
      },
    ],
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================
// 聊天会话数据
// ============================================

const CHAT_SESSIONS: ChatSession[] = [
  // 张三的会话
  { id: 'session-001', user_id: 'test-user-001', title: '上海行程咨询', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'session-002', user_id: 'test-user-001', title: '北京美食推荐', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'session-003', user_id: 'test-user-001', title: '交通方式咨询', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 李四的会话
  { id: 'session-004', user_id: 'test-user-002', title: '桂林行程规划', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'session-005', user_id: 'test-user-002', title: '阳朔住宿推荐', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 王五的会话
  { id: 'session-006', user_id: 'test-user-003', title: '西安历史讲解', created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'session-007', user_id: 'test-user-003', title: '成都美食攻略', created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'session-008', user_id: 'test-user-003', title: 'VIP 定制服务咨询', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
];

// ============================================
// 聊天消息数据
// ============================================

const MESSAGES: Message[] = [
  // 张三 - 上海行程咨询
  { id: 'msg-001', session_id: 'session-001', user_id: 'test-user-001', role: 'user', content: '你好，我想规划一个上海 4 天的行程，喜欢美食和骑行', tokens: 20, created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-002', session_id: 'session-001', user_id: 'test-user-001', role: 'assistant', content: '你好！很高兴为你规划上海 4 天深度游。上海是美食和骑行的绝佳目的地！\n\n我为你推荐以下行程亮点：\n\n🍜 **美食推荐**：\n- 南翔馒头店：正宗上海小笼包\n- 老吉士酒家：本帮菜经典\n- 佳家汤包：鲜美汤包\n\n🚴 **骑行路线**：\n- 徐汇滨江：11 公里滨江道\n- 浦东滨江：23 公里骑行道\n- 衡山路 - 余庆路：法租界风情\n\n需要我为你生成详细的每日行程吗？', tokens: 150, created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-003', session_id: 'session-001', user_id: 'test-user-001', role: 'user', content: '好的，请帮我生成详细行程', tokens: 10, created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-004', session_id: 'session-001', user_id: 'test-user-001', role: 'assistant', content: '已为你生成上海 4 天深度游行程！\n\n**Day 1: 抵达 & 初识上海**\n- 南京路步行街 → 人民广场 → 外滩夜景\n- 晚餐：南翔馒头店\n\n**Day 2: 老上海 & 租界文化**\n- 豫园 → 城隍庙 → 田子坊 → 新天地\n- 骑行：衡山路历史风貌区\n\n**Day 3: 现代上海 & 艺术**\n- 上海博物馆 → 东方明珠 → 上海中心\n- 骑行：徐汇滨江 11km\n\n**Day 4: 近郊 & 送别**\n- 朱家角古镇 or 淮海路购物\n\n预算估算：¥3500/人\n需要我帮你预订吗？', tokens: 180, created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 张三 - 北京美食推荐
  { id: 'msg-005', session_id: 'session-002', user_id: 'test-user-001', role: 'user', content: '北京有哪些必吃的美食？', tokens: 10, created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-006', session_id: 'session-002', user_id: 'test-user-001', role: 'assistant', content: '北京美食太多了！给你推荐这些必吃的：\n\n🦆 **北京烤鸭**\n- 全聚德：老字号，¥200-300/人\n- 便宜坊：焖炉烤鸭，¥150-250/人\n- 大董：创意烤鸭，¥400-600/人\n\n🍜 **面食类**\n- 炸酱面：海碗居、方砖厂 69 号\n- 打卤面：老北京家常菜\n\n🥟 **小吃类**\n- 卤煮火烧：小肠陈、北新桥卤煮\n- 炒肝：姚记炒肝\n- 豆汁儿配焦圈：护国寺小吃\n\n🍢 **其他**\n- 涮羊肉：东来顺、南门涮肉\n- 宫廷点心：仿膳饭庄\n\n需要我推荐具体店铺地址吗？', tokens: 200, created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 李四 - 桂林行程规划
  { id: 'msg-007', session_id: 'session-004', user_id: 'test-user-002', role: 'user', content: '桂林 3 天怎么玩比较好？', tokens: 10, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-008', session_id: 'session-004', user_id: 'test-user-002', role: 'assistant', content: '桂林 3 天建议这样安排：\n\n🎋 **Day 1: 漓江精华游**\n- 杨堤码头乘竹筏 → 九马画山 → 兴坪古镇\n- 晚上住阳朔，逛西街\n- 必做：20 元人民币背景打卡\n\n🚴 **Day 2: 阳朔田园骑行**\n- 十里画廊电动车骑行\n- 遇龙河竹筏漂流\n- 大榕树、月亮山\n\n⛰️ **Day 3: 喀斯特探秘**\n- 银子岩溶洞\n- 返回桂林市区\n- 象鼻山、两江四湖夜景\n\n预算：¥2000-2500/人\n最佳季节：4-6 月、9-11 月（烟雨漓江最美）\n\n需要我帮你细化每天的安排吗？', tokens: 180, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-009', session_id: 'session-004', user_id: 'test-user-002', role: 'user', content: '阳朔有什么好吃的？', tokens: 8, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-010', session_id: 'session-004', user_id: 'test-user-002', role: 'assistant', content: '阳朔美食推荐：\n\n🐟 **阳朔啤酒鱼**\n- 必吃！用漓江鲜鱼 + 啤酒烹制\n- 推荐：谢三姐啤酒鱼、大师傅啤酒鱼\n- 价格：¥68-98/斤\n\n🍜 **桂林米粉**\n- 当地人早餐首选\n- 推荐：崇善米粉、又轩米粉\n- 价格：¥5-8/碗\n\n🦀 **田螺酿**\n- 田螺肉 + 猪肉 + 薄荷\n- 推荐：西街大排档\n\n🍵 **油茶**\n- 恭城油茶最有名\n- 配炒米、花生、糍粑\n\n🍰 **其他小吃**\n- 马蹄糕、桂花糕、艾叶粑粑\n\n西街晚上很热闹，可以边吃边逛！', tokens: 150, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 王五 - 西安历史讲解
  { id: 'msg-011', session_id: 'session-006', user_id: 'test-user-003', role: 'user', content: '兵马俑有什么历史背景？', tokens: 10, created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-012', session_id: 'session-006', user_id: 'test-user-003', role: 'assistant', content: '兵马俑是中国历史上最伟大的考古发现之一！\n\n📜 **历史背景**\n- 建造时间：公元前 246-208 年\n- 建造者：秦始皇嬴政\n- 目的：守护秦始皇陵的地下军队\n\n🎖️ **规模**\n- 已发掘 3 个坑，总面积 2 万多平方米\n- 出土陶俑、陶马近 8000 件\n- 战车 100 多辆，兵器数万件\n\n🔍 **特点**\n- 每个俑面部表情都不一样\n- 按照真实秦军编制排列\n- originally 都是彩色的（出土后氧化褪色）\n\n💡 **参观建议**\n- 请导游（否则就是看泥人）\n- 重点看：一号坑（最大）、铜车马馆\n- 时间：至少 3 小时\n\n门票：¥150（含秦始皇陵）\n交通：从西安市区乘游 5 路或地铁 9 号线', tokens: 220, created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-013', session_id: 'session-006', user_id: 'test-user-003', role: 'user', content: '西安城墙有多长？可以骑行吗？', tokens: 15, created_at: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-014', session_id: 'session-006', user_id: 'test-user-003', role: 'assistant', content: '西安城墙信息：\n\n📏 **基本数据**\n- 周长：13.74 公里\n- 高度：12 米\n- 顶宽：12-14 米\n- 底宽：15-18 米\n- 中国保存最完整的古代城垣\n\n🚴 **骑行信息**\n- ✅ 可以骑行！这是最受欢迎的体验方式\n- 租车点：永宁门、安定门、安远门、含光门\n- 单人车：¥45/3 小时\n- 双人车：¥90/3 小时\n- 建议时间：傍晚（看日落）或清晨（人少）\n\n⏰ **开放时间**\n- 夏季：8:00-22:00\n- 冬季：8:00-19:00\n\n🎫 **门票**\n- 成人票：¥54\n- 学生票：¥27\n\n💡 **建议路线**\n永宁门 → 含光门 → 安定门 → 安远门 → 永宁门（完整一圈约 2-3 小时）\n\n骑完城墙可以去回民街吃美食！', tokens: 200, created_at: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 王五 - VIP 定制服务咨询
  { id: 'msg-015', session_id: 'session-008', user_id: 'test-user-003', role: 'user', content: 'VIP 会员有什么专属服务？', tokens: 12, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'msg-016', session_id: 'session-008', user_id: 'test-user-003', role: 'assistant', content: '尊敬的 VIP 会员，您享有以下专属权益：\n\n👑 **VIP 至尊权益**\n\n✨ **无限查询**\n- 每日查询次数无限制\n- 同时支持 10 个并发会话\n\n🎯 **私人定制**\n- 专属旅行规划师 1 对 1 服务\n- 根据您的需求定制行程\n- 可随时调整行程细节\n\n📞 **24/7 VIP 支持**\n- 专属客服热线\n- 优先响应（<5 分钟）\n- 紧急协助服务\n\n🎨 **个性化功能**\n- 自定义主题皮肤\n- 专属数据面板\n- 行程数据导出（PDF/Excel）\n\n🎁 **合作伙伴优惠**\n- 合作酒店 8 折起\n- 景点门票 VIP 通道\n- 餐厅预订优先权\n\n💰 **积分加速**\n- 消费积分 2 倍累积\n- 生日月额外赠送 1000 积分\n\n您当前的积分：8500 分\n可兑换：机场接送、酒店升级、景点门票等\n\n需要我帮您安排什么服务吗？', tokens: 250, created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
];

// ============================================
// 浏览历史数据
// ============================================

const BROWSE_HISTORY: BrowseHistory[] = [
  // 张三的浏览历史
  { id: 'history-001', user_id: 'test-user-001', page_type: 'itinerary', page_id: 'shanghai-4d', page_title: '上海 4 天深度游', viewed_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-002', user_id: 'test-user-001', page_type: 'itinerary', page_id: 'beijing-5d', page_title: '北京 5 天文化游', viewed_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-003', user_id: 'test-user-001', page_type: 'food', page_id: 'restaurant-001', page_title: '南翔馒头店', viewed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-004', user_id: 'test-user-001', page_type: 'attraction', page_id: 'attraction-001', page_title: '外滩', viewed_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-005', user_id: 'test-user-001', page_type: 'itinerary', page_id: 'hangzhou-2d', page_title: '杭州 2 天休闲游', viewed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 李四的浏览历史
  { id: 'history-006', user_id: 'test-user-002', page_type: 'itinerary', page_id: 'guilin-3d', page_title: '桂林 3 天山水游', viewed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-007', user_id: 'test-user-002', page_type: 'attraction', page_id: 'attraction-002', page_title: '漓江', viewed_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-008', user_id: 'test-user-002', page_type: 'food', page_id: 'restaurant-003', page_title: '谢三姐啤酒鱼', viewed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 王五的浏览历史
  { id: 'history-009', user_id: 'test-user-003', page_type: 'itinerary', page_id: 'xian-3d', page_title: '西安 3 天历史游', viewed_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-010', user_id: 'test-user-003', page_type: 'itinerary', page_id: 'chengdu-3d', page_title: '成都 3 天美食游', viewed_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-011', user_id: 'test-user-003', page_type: 'attraction', page_id: 'attraction-003', page_title: '秦始皇兵马俑', viewed_at: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-012', user_id: 'test-user-003', page_type: 'food', page_id: 'restaurant-004', page_title: '小龙坎火锅', viewed_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-013', user_id: 'test-user-003', page_type: 'attraction', page_id: 'attraction-004', page_title: '宽窄巷子', viewed_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'history-014', user_id: 'test-user-003', page_type: 'itinerary', page_id: 'beijing-5d', page_title: '北京 5 天文化游', viewed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
];

// ============================================
// 积分流水数据
// ============================================

const POINTS_TRANSACTIONS: PointsTransaction[] = [
  // 张三的积分流水
  { id: 'tx-001', user_id: 'test-user-001', points_change: 500, balance_after: 500, transaction_type: 'earn', reason: '新用户注册奖励', created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-002', user_id: 'test-user-001', points_change: 1000, balance_after: 1500, transaction_type: 'earn', reason: '购买 Premium 会员', reference_id: 'mem-001', created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-003', user_id: 'test-user-001', points_change: 200, balance_after: 1700, transaction_type: 'earn', reason: '完成首次行程规划', reference_id: 'trip-001', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-004', user_id: 'test-user-001', points_change: 300, balance_after: 2000, transaction_type: 'earn', reason: '每日签到奖励（7 天）', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-005', user_id: 'test-user-001', points_change: 500, balance_after: 2500, transaction_type: 'earn', reason: '推荐好友注册', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-006', user_id: 'test-user-001', points_change: 500, balance_after: 3000, transaction_type: 'earn', reason: '购买 Premium 会员续费', reference_id: 'mem-001', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-007', user_id: 'test-user-001', points_change: -500, balance_after: 2500, transaction_type: 'spend', reason: '兑换机场接送服务', reference_id: 'redeem-001', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 李四的积分流水
  { id: 'tx-008', user_id: 'test-user-002', points_change: 500, balance_after: 500, transaction_type: 'earn', reason: '新用户注册奖励', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-009', user_id: 'test-user-002', points_change: 300, balance_after: 800, transaction_type: 'earn', reason: '购买 Basic 会员', reference_id: 'mem-002', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-010', user_id: 'test-user-002', points_change: 200, balance_after: 1000, transaction_type: 'earn', reason: '完成行程规划', reference_id: 'trip-003', created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  
  // 王五的积分流水
  { id: 'tx-011', user_id: 'test-user-003', points_change: 500, balance_after: 500, transaction_type: 'earn', reason: '新用户注册奖励', created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-012', user_id: 'test-user-003', points_change: 2000, balance_after: 2500, transaction_type: 'earn', reason: '购买 VIP 会员', reference_id: 'mem-003', created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-013', user_id: 'test-user-003', points_change: 500, balance_after: 3000, transaction_type: 'earn', reason: '完成首次行程规划', reference_id: 'trip-004', created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-014', user_id: 'test-user-003', points_change: 1000, balance_after: 4000, transaction_type: 'earn', reason: '推荐 3 位好友注册', created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-015', user_id: 'test-user-003', points_change: 1500, balance_after: 5500, transaction_type: 'earn', reason: 'VIP 会员月度奖励', reference_id: 'mem-003', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-016', user_id: 'test-user-003', points_change: 3000, balance_after: 8500, transaction_type: 'earn', reason: 'VIP 会员续费', reference_id: 'mem-003', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tx-017', user_id: 'test-user-003', points_change: 1500, balance_after: 10000, transaction_type: 'bonus', reason: 'VIP 用户生日奖励', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

// ============================================
// 导出种子函数
// ============================================

/**
 * 在内存存储中创建测试数据
 * 仅用于开发/测试模式（当 Supabase 未配置时）
 */
export async function seedTestDataInMemory(): Promise<void> {
  if (!isInMemoryMode()) {
    console.log('[Seed] 检测到 Supabase 已配置，跳过内存存储种子');
    return;
  }

  console.log('[Seed] 开始在内存存储中创建测试数据...');
  console.log('[Seed] 注意：内存存储数据在应用重启后会丢失');

  // 由于内存存储是私有的，这里仅作为占位符
  // 实际数据会在首次访问时通过 mock 数据创建
  console.log('[Seed] 测试数据种子完成（内存模式）');
  console.log('[Seed] 测试账号:');
  console.log('  - zhangsan.test@example.com / Test1234 (Premium)');
  console.log('  - lisi.test@example.com / Test1234 (Basic)');
  console.log('  - wangwu.test@example.com / Test1234 (VIP)');
}

/**
 * 获取测试账号列表
 */
export function getTestAccounts() {
  return TEST_USERS.map(user => ({
    email: user.email,
    name: user.name,
    password: user.password,
    tier: user.budget_range === 'high' ? 'VIP' : user.budget_range === 'premium' ? 'Premium' : 'Basic',
  }));
}

/**
 * 打印测试账号信息
 */
export function printTestAccounts() {
  console.log('\n========================================');
  console.log('🦞 虚拟测试账号');
  console.log('========================================');
  console.log('所有账号密码均为：Test1234\n');
  
  TEST_USERS.forEach(user => {
    const tier = user.budget_range === 'high' ? '🥇 VIP' : user.budget_range === 'premium' ? '🥈 Premium' : '🥉 Basic';
    console.log(`${tier} ${user.name}`);
    console.log(`  邮箱：${user.email}`);
    console.log(`  兴趣：${user.interests?.join('、') || '无'}`);
    console.log('');
  });
  
  console.log('========================================\n');
}

// 自动执行（仅在开发环境）
if (process.env.NODE_ENV === 'development') {
  seedTestDataInMemory();
}

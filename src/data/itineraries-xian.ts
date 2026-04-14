/**
 * 西安行程数据 - 3 天历史之旅
 * Xi'an 3-Day Historical Tour
 */

import type { ItineraryRoute } from './types';

export const xian3Days: ItineraryRoute = {
  id: 'xian-3days',
  city: '西安',
  cityEn: "Xi'an",
  country: '中国',
  days: 3,
  title: '西安 3 天历史之旅',
  titleEn: "Xi'an 3-Day Historical Tour",
  subtitle: '兵马俑 · 古城墙 · 大唐不夜城',
  subtitleEn: 'Terracotta Army · City Wall · Great Tang Dynasty Block',
  theme: ['历史', '美食', '文化', '古迹'],
  themeEn: ['History', 'Food', 'Culture', 'Ancient Sites'],
  budget: '¥2800',
  bestSeason: '3 月 -5 月 / 9 月 -11 月',
  bestSeasonEn: 'Mar–May / Sep–Nov',
  highlights: ['兵马俑', '古城墙', '大雁塔', '回民街', '大唐不夜城'],
  highlightsEn: ['Terracotta Army', 'City Wall', 'Giant Wild Goose Pagoda', 'Hui Street', 'Great Tang Dynasty Block'],
  description: '十三朝古都，世界四大文明古都之一，从兵马俑到大唐盛世，感受中华文明 5000 年厚重。',
  descriptionEn: "Capital of 13 dynasties and one of the world's four great ancient civilizations — from the Terracotta Army to the Tang Dynasty's golden age.",
  practicalInfo: {
    transport: '地铁覆盖主要景点，打车便宜，共享单车在城墙内很方便',
    weather: '春秋最佳，夏季干热，冬季较冷',
    food: '肉夹馍、羊肉泡馍、凉皮、biangbiang 面、葫芦鸡',
    safety: '治安良好，回民街注意尊重少数民族习俗'
  },
  dayPlans: [
    {
      day: 1,
      title: '奇迹一日游',
      titleEn: 'Day of Wonders',
      theme: '兵马俑 · 华清池',
      themeEn: 'Terracotta Army · Huaqing Palace',
      activities: [
        { time: '08:00', name: '秦始皇兵马俑博物馆', nameEn: 'Terracotta Army', type: 'attraction', duration: '4 小时', description: '世界第八大奇迹，秦始皇陵陪葬坑，8000 陶俑千人千面。', price: '¥120 (旺季)', location: '临潼区秦陵镇', locationLat: 34.3845, locationLng: 109.2785, highlights: ['一号坑', '二号坑', '铜车马展厅', '360°影院'], tips: '请导游讲解很重要！可以在携程订半日游或现场拼团' },
        { time: '13:00', name: '临潼农家乐', nameEn: 'Lintong Rural Restaurant', type: 'food', duration: '1.5 小时', description: '临潼当地特色，裤带面、凉皮、农家菜。', price: '¥50-80/人', location: '临潼区秦陵镇', locationLat: 34.3845, locationLng: 109.2785, highlights: ['裤带面', '凉皮', '臊子面'], tips: '兵马俑景区出来有很多餐厅，选择多' },
        { time: '15:00', name: '华清池', nameEn: 'Huaqing Palace', type: 'attraction', duration: '2.5 小时', description: '唐代皇家温泉行宫，杨贵妃沐浴地，《长恨歌》故事发生地。', price: '¥120 (旺季联票)', location: '临潼区华清路', locationLat: 34.3685, locationLng: 109.2935, highlights: ['九龙汤', '芙蓉殿', '西安事变旧址', '长恨歌演出'], tips: '如果看《长恨歌》演出需要另外买票，建议提前订座' },
        { time: '18:00', name: '返回市区', nameEn: 'Return to City', type: 'transport', duration: '1 小时', description: '从临潼乘游 5 路或地铁返回西安市区。', price: '¥7-15', location: '临潼区→新城区', locationLat: 34.3685, locationLng: 109.2935, highlights: [], tips: '游 5 路在兵马俑停车场坐，到西安火车站' },
        { time: '20:00', name: '大唐不夜城', nameEn: 'Great Tang Dynasty Block', type: 'attraction', duration: '2 小时', description: '盛唐主题步行街，大雁塔下，灯光璀璨，各种演出。', price: '免费', location: '雁塔区慈恩路', locationLat: 34.2195, locationLng: 108.9605, highlights: ['不倒翁小姐姐', '灯光秀', '大雁塔夜景', '文艺演出'], tips: '晚上去灯光最美，7-9 点演出集中' }
      ],
      tips: ['兵马俑距离市区约 40 公里，往返建议预留 3 小时交通时间', '建议一早去兵马俑，错开旅游团高峰', '大唐不夜城和大雁塔广场相连，可以一起逛'],
      tipsEn: ['Terracotta Army is ~40 km from the city — allow 3 hours round-trip travel', 'Go early to beat the tour groups', 'Great Tang Dynasty Block connects to the Giant Wild Goose Pagoda plaza']
    },
    {
      day: 2,
      title: '古城深度日',
      titleEn: 'Ancient City Deep Dive',
      theme: '城墙 · 大雁塔 · 回民街',
      themeEn: 'City Wall · Giant Wild Goose Pagoda · Hui Street',
      activities: [
        { time: '09:00', name: '西安古城墙', nameEn: "Xi'an City Wall", type: 'attraction', duration: '2.5 小时', description: '中国现存最完整古代城垣，13.7 公里，骑自行车绕城一周。', price: '¥54 + 租车¥45', location: '碑林区南门', locationLat: 34.2655, locationLng: 108.9465, highlights: ['南门', '东南城角', '骑行一圈', '护城河'], tips: '建议骑自行车游览，走路太累，租车在南门' },
        { time: '12:00', name: '老孙家泡馍', nameEn: 'Lao Sunjia Paomo', type: 'food', duration: '1.5 小时', description: '西安最著名的泡馍店，羊肉泡馍是招牌，需要自己掰馍。', price: '¥60-100/人', location: '碑林区东大街', locationLat: 34.2615, locationLng: 108.9535, highlights: ['羊肉泡馍', '牛肉泡馍', '糖蒜'], tips: '泡馍饼要自己掰成黄豆大小，不然煮不透' },
        { time: '14:00', name: '大雁塔', nameEn: 'Giant Wild Goose Pagoda', type: 'attraction', duration: '2 小时', description: '唐代玄奘主持建造，用于保存佛经，登塔可观西安全景。', price: '¥50 (登塔额外¥25)', location: '雁塔区雁塔路', locationLat: 34.2185, locationLng: 108.9635, highlights: ['大雁塔', '玄奘雕像', '北广场音乐喷泉'], tips: '音乐喷泉在北广场，晚上 9 点有演出（时长 20 分钟）' },
        { time: '16:30', name: '大唐芙蓉园', nameEn: 'Tang Paradise', type: 'attraction', duration: '3 小时', description: '中国最大唐代文化主题公园，再现盛唐风貌。', price: '¥120', location: '雁塔区芙蓉西路', locationLat: 34.1935, locationLng: 108.9755, highlights: ['紫云楼', '仕女馆', '激光秀'], tips: '下午 4 点进，可以看到白天和夜景两个时段' },
        { time: '19:30', name: '回民街', nameEn: 'Hui Street (Muslim Quarter)', type: 'food', duration: '2.5 小时', description: '西安著名美食街，羊肉串、肉夹馍、石榴汁应有尽有。', price: '¥80-150/人', location: '莲湖区北院门', locationLat: 34.2615, locationLng: 108.9435, highlights: ['贾三清真灌汤包', '红红酸菜炒米', '老米家泡馍'], tips: '回民街是游客区，价格偏贵，想省钱去小巷子当地人吃的店' }
      ],
      tips: ['古城墙骑行建议从南门上，顺时针骑，约 1.5-2 小时', '回民街下午 5 点后人很多，注意保管财物', '尊重回民饮食习惯，不要带非清真食品进入'],
      tipsEn: ['Start cycling the City Wall from the South Gate, go clockwise (~1.5–2 hrs)', 'Hui Street gets very crowded after 5 PM — watch your belongings', 'Respect Muslim dietary customs; do not bring non-halal food into the area']
    },
    {
      day: 3,
      title: '历史遗迹 + 返程',
      titleEn: 'Historic Sites & Departure',
      theme: '陕西历史博物馆 · 小雁塔',
      themeEn: 'Shaanxi History Museum · Small Wild Goose Pagoda',
      activities: [
        { time: '09:00', name: '陕西历史博物馆', nameEn: 'Shaanxi History Museum', type: 'attraction', duration: '3 小时', description: '中国第一座大型现代化历史博物馆，周秦汉唐文物精华。', price: '免费 (预约)', location: '雁塔区小寨东路', locationLat: 34.2095, locationLng: 108.9595, highlights: ['唐朝壁画馆', '青铜器', '鎏金竹节熏炉', '兽首玛瑙杯'], tips: '必须提前在官方公众号预约！珍宝馆¥30 值得一看' },
        { time: '12:30', name: '赛格国际购物中心', nameEn: 'Saige International', type: 'food', duration: '1.5 小时', description: '小寨商圈核心，餐饮选择极多，亚洲第一长扶梯。', price: '¥80-150/人', location: '雁塔区小寨', locationLat: 34.2235, locationLng: 108.9485, highlights: ['长安大排档', '饮食区', '瀑布阶梯'], tips: '长安大排档可以吃到各种陕西小吃' },
        { time: '14:30', name: '小雁塔/西安博物院', nameEn: 'Small Wild Goose Pagoda', type: 'attraction', duration: '2 小时', description: '唐代佛教建筑，与大雁塔齐名，院内西安博物院免费参观。', price: '免费 (需预约)', location: '碑林区友谊西路', locationLat: 34.2345, locationLng: 108.9395, highlights: ['小雁塔', '西安博物院', '古银杏'], tips: '人比大雁塔少很多，体验更好' },
        { time: '17:00', name: '返程', nameEn: 'Departure', type: 'transport', duration: '1-2 小时', description: '前往机场或火车站。', price: '¥30-50', location: '西安市区', locationLat: 34.2655, locationLng: 108.9465, highlights: [], tips: '西安咸阳机场距市区约 40 公里，高铁站距市中心较近' }
      ],
      tips: ['陕西历史博物馆是西安最值得去的博物馆，请务必提前预约', '如果还有时间，可以去永兴坊吃陕西小吃，比回民街更地道更便宜', '西安博物院和小雁塔在一起，可以安排在一起游玩'],
      tipsEn: ['Shaanxi History Museum is the best museum in Xi\'an — book in advance', 'If time allows, Yongxingfang has more authentic and cheaper Shaanxi snacks than Hui Street', 'Xi\'an Museum and Small Wild Goose Pagoda are in the same complex']
    }
  ]
};

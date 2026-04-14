/**
 * 上海行程数据 - 4 天深度游
 * Shanghai 4-Day Itinerary
 */

import type { ItineraryRoute } from './types';

export const shanghai4Days: ItineraryRoute = {
  id: 'shanghai-4days',
  city: '上海',
  cityEn: 'Shanghai',
  country: '中国',
  days: 4,
  title: '上海 4 天深度游',
  titleEn: 'Shanghai 4-Day Deep Dive',
  subtitle: '魔都魅力 · 美食探索 · 骑行体验',
  subtitleEn: 'Magic City · Food Exploration · Cycling Experience',
  theme: ['美食', '骑行', '历史文化', '现代都市'],
  themeEn: ['Food', 'Cycling', 'History & Culture', 'Modern City'],
  budget: '¥3500',
  bestSeason: '3 月 -5 月 / 9 月 -11 月',
  bestSeasonEn: 'Mar–May / Sep–Nov',
  highlights: ['外滩夜景', '豫园城隍庙', '田子坊', '苏州河骑行', '武康路历史建筑'],
  highlightsEn: ['Bund Night View', 'Yu Garden & Temple', 'Tianzifang', 'Suzhou Creek Cycling', 'Wukang Road Architecture'],
  description: '深入体验上海的历史与摩登，从百年外滩到法租界老洋房，从弄堂美食到国际大餐，感受这座永远在前的城市。',
  descriptionEn: 'Dive deep into Shanghai\'s history and modernity — from the century-old Bund to French Concession mansions, from alley snacks to international dining.',

  practicalInfo: {
    transport: '地铁 + 共享单车为主，打车用 Didi，中文地址给司机看即可',
    weather: '春秋最佳，夏季闷热多雨，冬季阴冷',
    food: '南翔小笼、浓汤生煎、蟹壳黄、本帮菜',
    safety: '治安良好，夜间外滩/南京路步行街很安全'
  },
  dayPlans: [
    {
      day: 1,
      title: '浦西经典之旅',
      titleEn: 'Puxi Classic Tour',
      theme: '历史建筑 · 经典地标',
      themeEn: 'Historic Architecture · Iconic Landmarks',

      activities: [
        {
          time: '09:00',
          name: '外滩',
          nameEn: 'The Bund',
          type: 'attraction',
          duration: '2 小时',
          description: '沿着黄浦江畔漫步，欣赏万国建筑博览群，52 栋风格各异的近代建筑见证上海百年风云。',
          price: '免费',
          location: '黄浦区中山东一路',
          locationLat: 31.2405,
          locationLng: 121.4901,
          highlights: ['外白渡桥', '黄浦公园', '和平饭店', '中国银行大楼'],
          tips: '建议从金陵东路步行至外滩隧道，逆人流走更舒适'
        },
        {
          time: '11:30',
          name: '南京路步行街',
          nameEn: 'Nanjing Road Pedestrian Street',
          type: 'shopping',
          duration: '1.5 小时',
          description: '中国最繁华的商业街之一，百年老店与国际品牌并存。',
          price: '免费逛',
          location: '黄浦区南京东路',
          locationLat: 31.2375,
          locationLng: 121.4835,
          highlights: ['第一百货', '世茂广场', '杜莎夫人蜡像馆'],
          tips: '购物可以讲价，尤其是服装和特产'
        },
        {
          time: '13:00',
          name: '上海老饭店 (豫园店)',
          nameEn: 'Shanghai Old Restaurant (Yuyuan)',
          type: 'food',
          duration: '1.5 小时',
          description: '正宗本帮菜餐厅，红烧肉、糖醋小排、清炒虾仁是招牌。',
          price: '¥150-200/人',
          location: '黄浦区豫园路 85 号',
          locationLat: 31.2279,
          locationLng: 121.4897,
          highlights: ['红烧肉', '蟹粉小笼', '八宝辣酱'],
          tips: '高峰期需等位，建议提前通过大众点评取号'
        },
        {
          time: '15:00',
          name: '豫园',
          nameEn: 'Yu Garden',
          type: 'attraction',
          duration: '1.5 小时',
          description: '明代园林典范，亭台楼阁、假山池塘，精巧玲珑。',
          price: '¥40',
          location: '黄浦区豫园路 218 号',
          locationLat: 31.2276,
          locationLng: 121.4905,
          highlights: ['九曲桥', '玉玲珑', '仰山堂'],
          tips: '与城隍庙小吃街相连，可以一起游玩'
        },
        {
          time: '17:00',
          name: '城隍庙小吃广场',
          nameEn: 'Chenghuang Temple Food Court',
          type: 'food',
          duration: '1.5 小时',
          description: '上海特色小吃大集合，南翔小笼、蟹壳黄、绿波廊下午茶。',
          price: '¥50-100/人',
          location: '黄浦区豫园路',
          locationLat: 31.2273,
          locationLng: 121.4908,
          highlights: ['南翔小笼', '绿波廊点心', '宁波汤团'],
          tips: '小吃偏贵但体验感强，想省钱可以去附近小巷子'
        },
        {
          time: '19:30',
          name: '外滩观景台',
          nameEn: 'Bund Night View',

          type: 'attraction',
          duration: '1 小时',
          description: '夜幕降临后，外滩建筑灯火通明，与浦东陆家嘴隔江相望。',
          price: '免费',
          location: '黄浦区外滩观景平台',
          locationLat: 31.2405,
          locationLng: 121.4901,
          highlights: ['东方明珠夜景', '金融中心灯光秀', '浦江游览'],
          tips: '19:00-21:00 是最佳观赏时间，人最多'
        }
      ],
      tips: [
        '今日步行较多，穿舒适鞋子',
        '外滩至豫园可以步行约 15 分钟，沿途有上海老城厢风貌',
        '豫园出来往东走 10 分钟就是外滩'
      ],
      tipsEn: [
        'Lots of walking today — wear comfortable shoes',
        'The Bund to Yu Garden is about 15 min on foot through the old city',
        'Exit Yu Garden and walk east 10 min to reach the Bund'
      ]
    },
    {
      day: 2,
      title: '法租界骑行日',
      titleEn: 'French Concession Cycling Day',
      theme: '梧桐树下 · 老洋房 · 文艺咖啡',
      themeEn: 'Plane Trees · Old Mansions · Artsy Cafés',

      activities: [
        {
          time: '09:00',
          name: '淮海路租界骑行',
          nameEn: 'Former French Concession Cycling',
          type: 'transport',
          duration: '3 小时',
          description: '骑着共享单车穿梭在梧桐树下的法租界，途经武康路、湖南路、复兴路，欣赏百年老洋房。',
          price: '¥3-6 (共享单车)',
          location: '徐汇区武康路',
          locationLat: 31.2085,
          locationLng: 121.4372,
          highlights: ['武康大楼', '巴金故居', '宋庆龄故居', '湖南路老洋房'],
          tips: '推荐从淮海路骑到武康路，注意避让行人'
        },
        {
          time: '12:30',
          name: '老吉士酒家',
          nameEn: 'Old Jesse',
          type: 'food',
          duration: '1.5 小时',
          description: '藏在弄堂里的本帮菜小馆，张国荣来过，浓油赤酱正宗上海味道。',
          price: '¥150-250/人',
          location: '徐汇区天平路 39 号 (近淮海路)',
          locationLat: 31.2095,
          locationLng: 121.4375,
          highlights: ['红烧肉', '吉士招牌蟹粉', '蟹粉蛋'],
          tips: '必须提前订位，现场基本没位'
        },
        {
          time: '14:30',
          name: '徐家汇商圈',
          nameEn: 'Xujiahui',
          type: 'shopping',
          duration: '2 小时',
          description: '上海四大商圈之一，百联港汇、东方商厦、美罗城汇聚。',
          price: '视购买情况',
          location: '徐汇区漕溪北路',
          locationLat: 31.2005,
          locationLng: 121.4380,
          highlights: ['港汇恒隆广场', '美罗城', '徐家汇天主堂'],
          tips: '想买国际大牌的在这里选择多'
        },
        {
          time: '17:00',
          name: '田子坊',
          nameEn: 'Tianzifang',
          type: 'attraction',
          duration: '2 小时',
          description: '法租界里弄改造的创意街区，艺术家工作室、精品店、咖啡馆林立。',
          price: '免费',
          location: '黄浦区泰康路 210 弄',
          locationLat: 31.2145,
          locationLng: 121.4735,
          highlights: ['创意小店', '弄堂博物馆', '空中邮筒'],
          tips: '傍晚去光线好，拍照出片'
        },
        {
          time: '19:30',
          name: '新天地',
          nameEn: 'Xintiandi',
          type: 'attraction',
          duration: '2 小时',
          description: '石库门改造的时尚地标，中西合璧，既有历史又有腔调。',
          price: '免费逛',
          location: '黄浦区太仓路',
          locationLat: 31.2215,
          locationLng: 121.4755,
          highlights: ['石库门建筑', '美食餐厅', '思南路法国梧桐'],
          tips: '晚餐可以在这里解决，消费偏高但体验好'
        }
      ],
      tips: [
        '骑行路线建议：淮海路→武康路→湖南路→复兴路→思南路，全程约 8 公里',
        '共享单车用微信/支付宝扫一扫即可，哈啰、美团、青桔都可以',
        '武康路周末人多，建议工作日去'
      ],
      tipsEn: [
        'Suggested cycling route: Huaihai Rd → Wukang Rd → Hunan Rd → Fuxing Rd → Sinan Rd (~8 km)',
        'Scan a shared bike with WeChat or Alipay — Hello Bike, Meituan, or Qingju all work',
        'Wukang Road gets crowded on weekends; weekdays are better'
      ]
    },
    {
      day: 3,
      title: '浦东摩登之旅',
      titleEn: 'Pudong Modern Tour',
      theme: '陆家嘴 · 摩天大楼 · 艺术展览',
      themeEn: 'Lujiazui · Skyscrapers · Art Exhibitions',

      activities: [
        {
          time: '09:00',
          name: '陆家嘴环形天桥',
          nameEn: 'Lujiazui Loop',
          type: 'attraction',
          duration: '1 小时',
          description: '360 度欣赏陆家嘴三件套：环球金融中心、金茂大厦、上海中心。',
          price: '免费',
          location: '浦东新区陆家嘴环路',
          locationLat: 31.2397,
          locationLng: 121.5012,
          highlights: ['东方明珠', '上海中心', 'IFC 国金中心'],
          tips: '日出时分光线最美，但商场还没开门'
        },
        {
          time: '10:30',
          name: '上海中心大厦观光厅',
          nameEn: 'Shanghai Tower Observation',
          type: 'attraction',
          duration: '1.5 小时',
          description: '中国最高楼，118 层观光厅可以俯瞰整个上海。',
          price: '¥210',
          location: '浦东新区陆家嘴环路 501 号',
          locationLat: 31.2355,
          locationLng: 121.5015,
          highlights: ['118 层观光厅', '上海之巅', '阻尼器展示'],
          tips: '提前订票可以省排队时间，特殊天气可能关闭'
        },
        {
          time: '12:30',
          name: '上海环球金融中心 Café',
          nameEn: 'SKP Dining',
          type: 'food',
          duration: '1.5 小时',
          description: '陆家嘴高端美食选择，或到国金中心商场内觅食。',
          price: '¥200-500/人',
          location: '浦东新区世纪大道国金中心',
          locationLat: 31.2390,
          locationLng: 121.5010,
          highlights: ['鼎泰丰', '鼎暉', '江师傅'],
          tips: '不想花太多可以在便利店买简餐'
        },
        {
          time: '14:30',
          name: '上海当代艺术博物馆',
          nameEn: 'Power Station of Art',
          type: 'attraction',
          duration: '2.5 小时',
          description: '中国第一家公立当代艺术博物馆，工业风建筑很出片。',
          price: '免费',
          location: '黄浦区花园港路 178 号',
          locationLat: 31.2075,
          locationLng: 121.4812,
          highlights: ['PSA 双年展', '建筑本身', '黄浦江景'],
          tips: '周二是公众免费日，人会比较多'
        },
        {
          time: '17:30',
          name: '陆家嘴滨江步道',
          nameEn: 'Lujiazui Riverside Walk',
          type: 'attraction',
          duration: '1.5 小时',
          description: '沿着黄浦江东岸骑行或漫步，看对岸外滩万国建筑亮灯。',
          price: '免费',
          location: '浦东新区陆家嘴滨江',
          locationLat: 31.2405,
          locationLng: 121.5025,
          highlights: ['骑行道', '对岸夜景', '浦东美术馆'],
          tips: '傍晚 5-7 点光线最佳，可以看到亮灯瞬间'
        }
      ],
      tips: [
        '浦东建议地铁 2 号线到陆家嘴站，不要开车，停车很贵',
        '三件套最佳观景点：环形天桥、对外滩观景平台',
        '艺术博物馆在黄浦滨江，可以骑共享单车过去'
      ],
      tipsEn: [
        'Take Metro Line 2 to Lujiazui — driving is expensive and slow',
        'Best viewpoints for the three towers: the Loop bridge and the Bund promenade',
        'The art museum is on the Huangpu riverside — a shared bike ride away'
      ]
    },
    {
      day: 4,
      title: '水乡古镇 + 返程',
      titleEn: 'Water Town & Departure',
      theme: '朱家角 · 江南水乡 · 告别上海',
      themeEn: 'Zhujiajiao · Jiangnan Water Town · Farewell Shanghai',

      activities: [
        {
          time: '08:30',
          name: '朱家角古镇',
          nameEn: 'Zhujiajiao Water Town',
          type: 'attraction',
          duration: '4 小时',
          description: '上海保存最完整的水乡古镇，明清建筑，小桥流水人家。',
          price: '免费进入，景点联票¥20',
          location: '青浦区朱家角镇',
          locationLat: 31.0935,
          locationLng: 121.0512,
          highlights: ['放生桥', '大清邮局', '明清老街', '漕港河'],
          tips: '从上海市区开车约 1 小时，或坐地铁 17 号线到朱家角站'
        },
        {
          time: '12:30',
          name: '古镇美食',
          nameEn: 'Water Town Cuisine',
          type: 'food',
          duration: '1.5 小时',
          description: '扎肉、粽子、糖藕、臭豆腐，本地人推荐：石板街汤圆。',
          price: '¥50-100/人',
          location: '青浦区朱家角古镇内',
          locationLat: 31.0935,
          locationLng: 121.0515,
          highlights: ['扎肉', '糖藕', '臭豆腐', '河鲜'],
          tips: '古镇内吃饭偏贵，可以砍价'
        },
        {
          time: '15:00',
          name: '返程/上海虹桥站',
          nameEn: 'Departure / Hongqiao Station',
          type: 'transport',
          duration: '1.5 小时',
          description: '从朱家角返回市区，前往机场或火车站。',
          price: '¥30-50',
          location: '青浦区→闵行区',
          locationLat: 31.2005,
          locationLng: 121.3205,
          highlights: [],
          tips: '建议购买 18:00 后的离开交通，留有余地'
        }
      ],
      tips: [
        '如果航班在晚上，可以把行李存放在虹桥站或市区的酒店',
        '朱家角回程在地铁 17 号线朱家角站乘至虹桥火车站，约 50 分钟',
        '如果不想去古镇，可以换成 M50 创意园或 1933 老场坊'
      ],
      tipsEn: [
        'If your flight is in the evening, store luggage at Hongqiao Station or your hotel',
        'Return from Zhujiajiao on Metro Line 17 to Hongqiao Railway Station (~50 min)',
        'Skip the water town? Swap for M50 Creative Park or 1933 Old Millfun instead'
      ]
    }
  ]
};

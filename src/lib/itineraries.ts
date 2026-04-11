/**
 * 推荐线路数据 - 中国热门城市行程规划
 * China Landing AI Helper
 */

import type { Trip } from './types';

export interface DayPlan {
  day: number;
  title: string;
  theme: string;
  activities: Activity[];
  tips: string[];
}

export interface Activity {
  time: string;
  name: string;
  nameEn: string;
  type: 'attraction' | 'food' | 'transport' | 'shopping';
  duration: string;
  description: string;
  price: string;
  location: string;
  locationLat: number;
  locationLng: number;
  highlights: string[];
  tips: string;
}

export interface ItineraryRoute {
  id: string;
  city: string;
  cityEn: string;
  country: string;
  days: number;
  title: string;
  subtitle: string;
  theme: string[];
  budget: '¥1500' | '¥2000' | '¥2500' | '¥2800' | '¥3500' | '¥5000';
  bestSeason: string;
  highlights: string[];
  description: string;
  dayPlans: DayPlan[];
  practicalInfo: {
    transport: string;
    weather: string;
    food: string;
    safety: string;
  };
}

// ─── 上海 4 天深度游 ──────────────────────────────────────────────────────────

export const shanghai4Days: ItineraryRoute = {
  id: 'shanghai-4days',
  city: '上海',
  cityEn: 'Shanghai',
  country: '中国',
  days: 4,
  title: '上海 4 天深度游',
  subtitle: '魔都魅力 · 美食探索 · 骑行体验',
  theme: ['美食', '骑行', '历史文化', '现代都市'],
  budget: '¥3500',
  bestSeason: '3月-5月 / 9月-11月',
  highlights: ['外滩夜景', '豫园城隍庙', '田子坊', '苏州河骑行', '武康路历史建筑'],
  description: '深入体验上海的历史与摩登，从百年外滩到法租界老洋房，从弄堂美食到国际大餐，感受这座永远在前的城市。',
  practicalInfo: {
    transport: '地铁+共享单车为主，打车用 Didi，中文地址给司机看即可',
    weather: '春秋最佳，夏季闷热多雨，冬季阴冷',
    food: '南翔小笼、浓汤生煎、蟹壳黄、本帮菜',
    safety: '治安良好，夜间外滩/南京路步行街很安全'
  },
  dayPlans: [
    {
      day: 1,
      title: '浦西经典之旅',
      theme: '历史建筑 · 经典地标',
      activities: [
        {
          time: '09:00',
          name: '外滩',
          nameEn: 'The Bund',
          type: 'attraction',
          duration: '2小时',
          description: '沿着黄浦江畔漫步，欣赏万国建筑博览群，52栋风格各异的近代建筑见证上海百年风云。',
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
          duration: '1.5小时',
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
          name: '上海老饭店(豫园店)',
          nameEn: 'Shanghai Old Restaurant (Yuyuan)',
          type: 'food',
          duration: '1.5小时',
          description: '正宗本帮菜餐厅，红烧肉、糖醋小排、清炒虾仁是招牌。',
          price: '¥150-200/人',
          location: '黄浦区豫园路85号',
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
          duration: '1.5小时',
          description: '明代园林典范，亭台楼阁、假山池塘，精巧玲珑。',
          price: '¥40',
          location: '黄浦区豫园路218号',
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
          duration: '1.5小时',
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
          nameEn: 'Bund夜景',
          type: 'attraction',
          duration: '1小时',
          description: '夜幕降临后，外滩建筑灯火通明，与浦东陆家嘴隔江相望。',
          price: '免费',
          location: '黄浦区外滩观景平台',
          locationLat: 31.2405,
          locationLng: 121.4901,
          highlights: ['东方明珠夜景', '金融中心灯光秀', '浦江游览'],
          tips: '19:00-21:00是最佳观赏时间，人最多'
        }
      ],
      tips: [
        '今日步行较多，穿舒适鞋子',
        '外滩至豫园可以步行约15分钟，沿途有上海老城厢风貌',
        '豫园出来往东走10分钟就是外滩'
      ]
    },
    {
      day: 2,
      title: '法租界骑行日',
      theme: '梧桐树下 · 老洋房 · 文艺咖啡',
      activities: [
        {
          time: '09:00',
          name: '淮海路租界骑行',
          nameEn: 'Former French Concession Cycling',
          type: 'transport',
          duration: '3小时',
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
          duration: '1.5小时',
          description: '藏在弄堂里的本帮菜小馆，张国荣来过，浓油赤酱正宗上海味道。',
          price: '¥150-250/人',
          location: '徐汇区天平路39号(近淮海路)',
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
          duration: '2小时',
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
          duration: '2小时',
          description: '法租界里弄改造的创意街区，艺术家工作室、精品店、咖啡馆林立。',
          price: '免费',
          location: '黄浦区泰康路210弄',
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
          duration: '2小时',
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
        '骑行路线建议：淮海路→武康路→湖南路→复兴路→思南路，全程约8公里',
        '共享单车用微信/支付宝扫一扫即可，哈啰、美团、青桔都可以',
        '武康路周末人多，建议工作日去'
      ]
    },
    {
      day: 3,
      title: '浦东摩登之旅',
      theme: '陆家嘴 · 摩天大楼 · 艺术展览',
      activities: [
        {
          time: '09:00',
          name: '陆家嘴环形天桥',
          nameEn: 'Lujiazui Loop',
          type: 'attraction',
          duration: '1小时',
          description: '360度欣赏陆家嘴三件套：环球金融中心、金茂大厦、上海中心。',
          price: '免费',
          location: '浦东新区陆家嘴环路',
          locationLat: 31.2397,
          locationLng: 121.5012,
          highlights: ['东方明珠', '上海中心', 'IFC国金中心'],
          tips: '日出时分光线最美，但商场还没开门'
        },
        {
          time: '10:30',
          name: '上海中心大厦观光厅',
          nameEn: 'Shanghai Tower Observation',
          type: 'attraction',
          duration: '1.5小时',
          description: '中国最高楼，118层观光厅可以俯瞰整个上海。',
          price: '¥180',
          location: '浦东新区陆家嘴环路501号',
          locationLat: 31.2355,
          locationLng: 121.5015,
          highlights: ['118层观光厅', '上海之巅', '阻尼器展示'],
          tips: '提前订票可以省排队时间，特殊天气可能关闭'
        },
        {
          time: '12:30',
          name: '上海环球金融中心 Café',
          nameEn: 'SKP Dining',
          type: 'food',
          duration: '1.5小时',
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
          duration: '2.5小时',
          description: '中国第一家公立当代艺术博物馆，工业风建筑很出片。',
          price: '免费',
          location: '黄浦区花园港路178号',
          locationLat: 31.2075,
          locationLng: 121.4812,
          highlights: ['PSA双年展', '建筑本身', '黄浦江景'],
          tips: '周二是公众免费日，人会比较多'
        },
        {
          time: '17:30',
          name: '陆家嘴滨江步道',
          nameEn: 'Lujiazui Riverside Walk',
          type: 'attraction',
          duration: '1.5小时',
          description: '沿着黄浦江东岸骑行或漫步，看对岸外滩万国建筑亮灯。',
          price: '免费',
          location: '浦东新区陆家嘴滨江',
          locationLat: 31.2405,
          locationLng: 121.5025,
          highlights: ['骑行道', '对岸夜景', '浦东美术馆'],
          tips: '傍晚5-7点光线最佳，可以看到亮灯瞬间'
        }
      ],
      tips: [
        '浦东建议地铁2号线到陆家嘴站，不要开车，停车很贵',
        '三件套最佳观景点：环形天桥、对外滩观景平台',
        '艺术博物馆在黄浦滨江，可以骑共享单车过去'
      ]
    },
    {
      day: 4,
      title: '水乡古镇 + 返程',
      theme: '朱家角 · 江南水乡 · 告别上海',
      activities: [
        {
          time: '08:30',
          name: '朱家角古镇',
          nameEn: 'Zhujiajiao Water Town',
          type: 'attraction',
          duration: '4小时',
          description: '上海保存最完整的水乡古镇，明清建筑，小桥流水人家。',
          price: '免费进入，景点联票¥20',
          location: '青浦区朱家角镇',
          locationLat: 31.0935,
          locationLng: 121.0512,
          highlights: ['放生桥', '大清邮局', '明清老街', '漕港河'],
          tips: '从上海市区开车约1小时，或坐地铁17号线到朱家角站'
        },
        {
          time: '12:30',
          name: '古镇美食',
          nameEn: 'Water Town Cuisine',
          type: 'food',
          duration: '1.5小时',
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
          duration: '1.5小时',
          description: '从朱家角返回市区，前往机场或火车站。',
          price: '¥30-50',
          location: '青浦区→闵行区',
          locationLat: 31.2005,
          locationLng: 121.3205,
          highlights: [],
          tips: '建议购买18:00后的离开交通，留有余地'
        }
      ],
      tips: [
        '如果航班在晚上，可以把行李存放在虹桥站或市区的酒店',
        '朱家角回程在地铁17号线朱家角站乘至虹桥火车站，约50分钟',
        '如果不想去古镇，可以换成M50创意园或1933老场坊'
      ]
    }
  ]
};

// ─── 北京 5 天文化之旅 ────────────────────────────────────────────────────────

export const beijing5Days: ItineraryRoute = {
  id: 'beijing-5days',
  city: '北京',
  cityEn: 'Beijing',
  country: '中国',
  days: 5,
  title: '北京 5 天文化之旅',
  subtitle: '皇城古迹 · 京味美食 · 胡同文化',
  theme: ['历史', '文化', '美食', '胡同'],
  budget: '¥5000',
  bestSeason: '4月-6月 / 9月-10月',
  highlights: ['故宫', '长城', '胡同骑游', '天坛', '颐和园'],
  description: '从紫禁城到八达岭，从胡同深处到后海酒吧街，全方位感受中国政治文化中心3000年历史。',
  practicalInfo: {
    transport: '地铁最方便，支付宝/微信乘车码可直接用，打车用百度地图',
    weather: '春秋最佳，夏季闷热，冬季干冷需保湿',
    food: '北京烤鸭、铜锅涮肉、炸酱面、豆汁焦圈',
    safety: '治安极好，重要景点周边注意扒手'
  },
  dayPlans: [
    {
      day: 1,
      title: '中轴线探索',
      theme: '天安门 · 故宫 · 国家博物馆',
      activities: [
        {
          time: '08:00',
          name: '天安门广场',
          nameEn: 'Tiananmen Square',
          type: 'attraction',
          duration: '1小时',
          description: '世界最大的城市广场，每天升降旗仪式是必看项目。',
          price: '免费',
          location: '东城区天安门广场',
          locationLat: 39.9042,
          locationLng: 116.3975,
          highlights: ['人民英雄纪念碑', '毛主席纪念堂', '人民大会堂'],
          tips: '周一毛纪念堂闭馆，请携带身份证'
        },
        {
          time: '09:30',
          name: '故宫博物院',
          nameEn: 'Forbidden City',
          type: 'attraction',
          duration: '4小时',
          description: '明清两代皇宫，世界最大宫殿建筑群，建议租讲解器。',
          price: '¥60 (旺季¥80)',
          location: '东城区景山前街',
          locationLat: 39.9163,
          locationLng: 116.3972,
          highlights: ['午门', '太和殿', '乾清宫', '御花园'],
          tips: '从午门进，神武门出，建议租用讲解器¥20'
        },
        {
          time: '14:00',
          name: '景山公园',
          nameEn: 'Jingshan Park',
          type: 'attraction',
          duration: '1小时',
          description: '故宫最佳观景点，俯瞰紫禁城全貌。',
          price: '¥2',
          location: '西城区景山前街',
          locationLat: 39.9183,
          locationLng: 116.3970,
          highlights: ['万春亭俯瞰故宫', '南北中轴线'],
          tips: '下午3-4点光线最好，拍照绝美'
        },
        {
          time: '16:00',
          name: '国家博物馆',
          nameEn: 'National Museum of China',
          type: 'attraction',
          duration: '2小时',
          description: '中华文化最高殿堂，古代中国展品丰富。',
          price: '免费 (预约)',
          location: '东城区东长安街',
          locationLat: 39.9045,
          locationLng: 116.4036,
          highlights: ['古代中国展', '复兴之路', '特展'],
          tips: '必须提前在官方小程序预约，周一闭馆'
        }
      ],
      tips: [
        '天安门广场+故宫建议安排一整天，上午进场人少',
        '故宫内没有餐厅，请自备干粮或下午出来后再吃饭',
        '带好身份证原件，安检严格'
      ]
    },
    {
      day: 2,
      title: '长城一日游',
      theme: '八达岭 · 户外挑战',
      activities: [
        {
          time: '07:30',
          name: '八达岭长城',
          nameEn: 'Badaling Great Wall',
          type: 'attraction',
          duration: '4小时',
          description: '最具代表性的长城段落，交通最便利，设施最完善。',
          price: '¥40 + 往返缆车¥140',
          location: '延庆区八达岭镇',
          locationLat: 40.3652,
          locationLng: 116.6015,
          highlights: ['北八楼好汉坡', '缆车观光', '好汉石'],
          tips: '建议一早出发避高峰，体力好爬北线，想省力坐缆车'
        },
        {
          time: '13:00',
          name: '长城脚下农家乐',
          nameEn: 'Great Wall Rural Restaurant',
          type: 'food',
          duration: '1.5小时',
          description: '延庆本地农家菜，山野菜、炖鸡、烙饼。',
          price: '¥80-120/人',
          location: '延庆区八达岭镇',
          locationLat: 40.3580,
          locationLng: 116.5950,
          highlights: ['山野菜', '柴鸡蛋', '农家炖菜'],
          tips: '选择农家乐前先看点评，避开拉客的'
        },
        {
          time: '15:00',
          name: '返回市区',
          nameEn: 'Return to City',
          type: 'transport',
          duration: '2小时',
          description: '从八达岭乘坐919路或S2线返回市区。',
          price: '¥15-20',
          location: '延庆区→东城区',
          locationLat: 40.3652,
          locationLng: 116.6015,
          highlights: [],
          tips: '919路到德胜门，步行至积水潭地铁站'
        },
        {
          time: '18:00',
          name: '簋街',
          nameEn: 'Gui Street',
          type: 'food',
          duration: '2小时',
          description: '北京著名夜市一条街，麻辣小龙虾是招牌。',
          price: '¥100-200/人',
          location: '东城区东直门大街',
          locationLat: 39.9415,
          locationLng: 116.4345,
          highlights: ['胡大饭馆', '便宜坊', '小龙虾'],
          tips: '簋街晚上才热闹，11点后更热闹'
        }
      ],
      tips: [
        '八达岭交通：去程S2线黄土店站（地铁霍营站）→八达岭，回程919路快到德胜门',
        '体力有限可以坐缆车到北八楼，再走下来',
        '春秋季节长城风大，带外套'
      ]
    },
    {
      day: 3,
      title: '胡同骑游日',
      theme: '胡同 · 四合院 · 老北京',
      activities: [
        {
          time: '09:00',
          name: '南锣鼓巷',
          nameEn: 'Nanluoguxiang',
          type: 'attraction',
          duration: '2小时',
          description: '北京最时尚的胡同区，咖啡馆、文创店、老字号并存。',
          price: '免费',
          location: '东城区南锣鼓巷',
          locationLat: 39.9375,
          locationLng: 116.4035,
          highlights: ['文创小店', '齐白石故居', '中央戏剧学院'],
          tips: '早上9点前人少，拍照好'
        },
        {
          time: '11:30',
          name: '什刹海胡同骑游',
          nameEn: 'Shichahai Hutong Cycling',
          type: 'transport',
          duration: '3小时',
          description: '骑共享单车穿梭老北京胡同，经过烟袋斜街、银锭桥、宋庆龄故居。',
          price: '¥10-20 (共享单车)',
          location: '西城区什刹海',
          locationLat: 39.9395,
          locationLng: 116.3935,
          highlights: ['银锭桥', '后海酒吧街', '恭王府', '郭沫若故居'],
          tips: '建议请一个胡同导游讲解，可以在大咖说约导游'
        },
        {
          time: '14:30',
          name: '恭王府',
          nameEn: 'Prince Gong\'s Mansion',
          type: 'attraction',
          duration: '2小时',
          description: '清代规模最大王府，和珅旧宅，建筑精美绝伦。',
          price: '¥40',
          location: '西城区恭王府',
          locationLat: 39.9365,
          locationLng: 116.3835,
          highlights: ['福字碑', '后罩楼', '西洋门'],
          tips: '请讲解很重要，不然看不出门道'
        },
        {
          time: '17:30',
          name: '后海/三里屯',
          nameEn: 'Houhai / Sanlitun',
          type: 'attraction',
          duration: '3小时',
          description: '后海酒吧街老北京风情，三里屯太古里国际时尚。',
          price: '视消费情况',
          location: '西城区/朝阳区',
          locationLat: 39.9415,
          locationLng: 116.3935,
          highlights: ['后海酒吧', '三里屯SOHO', '优衣库旗舰店'],
          tips: '后海适合晚上小酌一杯，三里屯可以购物'
        }
      ],
      tips: [
        '胡同骑游全程约5-6公里，共享单车足够',
        '南锣鼓巷和什刹海很近，可以步行串联',
        '胡同里有些院子是私人的，不要擅自进入'
      ]
    },
    {
      day: 4,
      title: '皇家园林之旅',
      theme: '天坛 · 颐和园 · 北大清华',
      activities: [
        {
          time: '08:00',
          name: '天坛公园',
          nameEn: 'Temple of Heaven',
          type: 'attraction',
          duration: '2.5小时',
          description: '明清皇帝祭天场所，三音石、回音壁是声学奇观。',
          price: '¥34 (联票)',
          location: '东城区天坛东路',
          locationLat: 39.8835,
          locationLng: 116.4135,
          highlights: ['祈年殿', '回音壁', '圜丘'],
          tips: '建议清晨来，本地人晨练很有生活气息'
        },
        {
          time: '11:00',
          name: '颐和园',
          nameEn: 'Summer Palace',
          type: 'attraction',
          duration: '4小时',
          description: '中国现存最大皇家园林昆明湖、十七孔桥、长廊必看。',
          price: '¥60 (旺季)',
          location: '海淀区新建宫门路',
          locationLat: 39.9935,
          locationLng: 116.2755,
          highlights: ['昆明湖', '十七孔桥', '长廊', '佛香阁'],
          tips: '从北宫门进可以先爬山看全景，再沿湖边走'
        },
        {
          time: '15:30',
          name: '北大清华外景',
          nameEn: 'PKU & THU Exterior',
          type: 'attraction',
          duration: '1小时',
          description: '中国最顶尖两所大学，在校门外观光打卡。',
          price: '免费',
          location: '海淀区中关村',
          locationLat: 39.9895,
          locationLng: 116.3135,
          highlights: ['清华西门', '北大东门', '中关村大街'],
          tips: '校园不对外开放，如果想进可以联系学生带进'
        },
        {
          time: '17:30',
          name: '中关村食街',
          nameEn: 'Zhongguancun Dining',
          type: 'food',
          duration: '1.5小时',
          description: '中关村各大商场内美食汇聚，连锁快餐到正餐都有。',
          price: '¥80-150/人',
          location: '海淀区中关村',
          locationLat: 39.9855,
          locationLng: 116.3135,
          highlights: ['新中关', '欧美汇', '食宝街'],
          tips: '清华科技园附近有便宜快餐'
        }
      ],
      tips: [
        '颐和园很大，建议购买联票，不然很多景点进不去',
        '天坛和颐和园一天会比较累，注意体力',
        '北大清华现在需要预约才能进'
      ]
    },
    {
      day: 5,
      title: '现代北京 + 返程',
      theme: '798艺术区 · 返程',
      activities: [
        {
          time: '09:00',
          name: '798艺术区',
          nameEn: '798 Art District',
          type: 'attraction',
          duration: '3小时',
          description: '原电子工业厂房改造的当代艺术区，画廊、设计店、咖啡馆林立。',
          price: '免费',
          location: '朝阳区酒仙桥路',
          locationLat: 39.9835,
          locationLng: 116.5035,
          highlights: ['尤伦斯当代艺术中心UCCA', '建筑本身', '设计商店'],
          tips: '艺术区很大，建议租讲解或者跟导览'
        },
        {
          time: '12:30',
          name: '蓝色港湾',
          nameEn: 'SOLANA',
          type: 'food',
          duration: '1.5小时',
          description: '欧美风格购物公园，餐饮选择丰富，紧邻798。',
          price: '¥100-200/人',
          location: '朝阳区朝阳公园路',
          locationLat: 39.9515,
          locationLng: 116.4735,
          highlights: ['餐饮一条街', '湖边美食', '进口超市'],
          tips: '有室内和室外座位，选择多'
        },
        {
          time: '14:30',
          name: '返程准备',
          nameEn: 'Departure Prep',
          type: 'transport',
          duration: '2小时',
          description: '返回市区/酒店取行李，前往机场或火车站。',
          price: '地铁¥30-50',
          location: '朝阳区→机场/车站',
          locationLat: 39.9042,
          locationLng: 116.4075,
          highlights: [],
          tips: '建议购买16:00后的交通，有充足缓冲时间'
        }
      ],
      tips: [
        '798艺术区可以购买一些文创产品作为伴手礼',
        '如果航班在晚上，可以把行李存酒店，轻装逛',
        '北京堵车严重，去机场留足时间'
      ]
    }
  ]
};

// ─── 西安 3 天历史之旅 ───────────────────────────────────────────────────────

export const xian3Days: ItineraryRoute = {
  id: 'xian-3days',
  city: '西安',
  cityEn: "Xi'an",
  country: '中国',
  days: 3,
  title: '西安 3 天历史之旅',
  subtitle: '兵马俑 · 古城墙 · 大唐不夜城',
  theme: ['历史', '美食', '文化', '古迹'],
  budget: '¥2800',
  bestSeason: '3月-5月 / 9月-11月',
  highlights: ['兵马俑', '古城墙', '大雁塔', '回民街', '大唐不夜城'],
  description: '十三朝古都，世界四大文明古都之一，从兵马俑到大唐盛世，感受中华文明5000年厚重。',
  practicalInfo: {
    transport: '地铁覆盖主要景点，打车便宜，共享单车在城墙内很方便',
    weather: '春秋最佳，夏季干热，冬季较冷',
    food: '肉夹馍、羊肉泡馍、凉皮、biangbiang面、葫芦鸡',
    safety: '治安良好，回民街注意尊重少数民族习俗'
  },
  dayPlans: [
    {
      day: 1,
      title: '奇迹一日游',
      theme: '兵马俑 · 华清池',
      activities: [
        {
          time: '08:00',
          name: '秦始皇兵马俑博物馆',
          nameEn: "Terracotta Army",
          type: 'attraction',
          duration: '4小时',
          description: '世界第八大奇迹，秦始皇陵陪葬坑，8000陶俑千人千面。',
          price: '¥120 (旺季)',
          location: '临潼区秦陵镇',
          locationLat: 34.3845,
          locationLng: 109.2785,
          highlights: ['一号坑', '二号坑', '铜车马展厅', '360°影院'],
          tips: '请导游讲解很重要！可以在携程订半日游或现场拼团'
        },
        {
          time: '13:00',
          name: '临潼农家乐',
          nameEn: 'Lintong Rural Restaurant',
          type: 'food',
          duration: '1.5小时',
          description: '临潼当地特色，裤带面、凉皮、农家菜。',
          price: '¥50-80/人',
          location: '临潼区秦陵镇',
          locationLat: 34.3845,
          locationLng: 109.2785,
          highlights: ['裤带面', '凉皮', '臊子面'],
          tips: '兵马俑景区出来有很多餐厅，选择多'
        },
        {
          time: '15:00',
          name: '华清池',
          nameEn: 'Huaqing Palace',
          type: 'attraction',
          duration: '2.5小时',
          description: '唐代皇家温泉行宫，杨贵妃沐浴地，《长恨歌》故事发生地。',
          price: '¥120 (旺季联票)',
          location: '临潼区华清路',
          locationLat: 34.3685,
          locationLng: 109.2935,
          highlights: ['九龙汤', '芙蓉殿', '西安事变旧址', '长恨歌演出'],
          tips: '如果看《长恨歌》演出需要另外买票，建议提前订座'
        },
        {
          time: '18:00',
          name: '返回市区',
          nameEn: 'Return to City',
          type: 'transport',
          duration: '1小时',
          description: '从临潼乘游5路或地铁返回西安市区。',
          price: '¥7-15',
          location: '临潼区→新城区',
          locationLat: 34.3685,
          locationLng: 109.2935,
          highlights: [],
          tips: '游5路在兵马俑停车场坐，到西安火车站'
        },
        {
          time: '20:00',
          name: '大唐不夜城',
          nameEn: 'Great Tang Dynasty Block',
          type: 'attraction',
          duration: '2小时',
          description: '盛唐主题步行街，大雁塔下，灯光璀璨，各种演出。',
          price: '免费',
          location: '雁塔区慈恩路',
          locationLat: 34.2195,
          locationLng: 108.9605,
          highlights: ['不倒翁小姐姐', '灯光秀', '大雁塔夜景', '文艺演出'],
          tips: '晚上去灯光最美，7-9点演出集中'
        }
      ],
      tips: [
        '兵马俑距离市区约40公里，往返建议预留3小时交通时间',
        '建议一早去兵马俑，错开旅游团高峰',
        '大唐不夜城和大雁塔广场相连，可以一起逛'
      ]
    },
    {
      day: 2,
      title: '古城深度日',
      theme: '城墙 · 大雁塔 · 回民街',
      activities: [
        {
          time: '09:00',
          name: '西安古城墙',
          nameEn: "Xi'an City Wall",
          type: 'attraction',
          duration: '2.5小时',
          description: '中国现存最完整古代城垣，13.7公里，骑自行车绕城一周。',
          price: '¥54 + 租车¥45',
          location: '碑林区南门',
          locationLat: 34.2655,
          locationLng: 108.9465,
          highlights: ['南门', '东南城角', '骑行一圈', '护城河'],
          tips: '建议骑自行车游览，走路太累，租车在南门'
        },
        {
          time: '12:00',
          name: '老孙家泡馍',
          nameEn: 'Lao Sunjia Paomo',
          type: 'food',
          duration: '1.5小时',
          description: '西安最著名的泡馍店，羊肉泡馍是招牌，需要自己掰馍。',
          price: '¥60-100/人',
          location: '碑林区东大街',
          locationLat: 34.2615,
          locationLng: 108.9535,
          highlights: ['羊肉泡馍', '牛肉泡馍', '糖蒜'],
          tips: '泡馍饼要自己掰成黄豆大小，不然煮不透'
        },
        {
          time: '14:00',
          name: '大雁塔',
          nameEn: 'Giant Wild Goose Pagoda',
          type: 'attraction',
          duration: '2小时',
          description: '唐代玄奘主持建造，用于保存佛经，登塔可观西安全景。',
          price: '¥50 (登塔额外¥25)',
          location: '雁塔区雁塔路',
          locationLat: 34.2185,
          locationLng: 108.9635,
          highlights: ['大雁塔', '玄奘雕像', '北广场音乐喷泉'],
          tips: '音乐喷泉在北广场，晚上9点有演出（时长20分钟）'
        },
        {
          time: '16:30',
          name: '大唐芙蓉园',
          nameEn: 'Tang Paradise',
          type: 'attraction',
          duration: '3小时',
          description: '中国最大唐代文化主题公园，再现盛唐风貌。',
          price: '¥120',
          location: '雁塔区芙蓉西路',
          locationLat: 34.1935,
          locationLng: 108.9755,
          highlights: ['紫云楼', '仕女馆', '激光秀'],
          tips: '下午4点进，可以看到白天和夜景两个时段'
        },
        {
          time: '19:30',
          name: '回民街',
          nameEn: 'Hui Street (Muslim Quarter)',
          type: 'food',
          duration: '2.5小时',
          description: '西安著名美食街，羊肉串、肉夹馍、石榴汁应有尽有。',
          price: '¥80-150/人',
          location: '莲湖区北院门',
          locationLat: 34.2615,
          locationLng: 108.9435,
          highlights: ['贾三清真灌汤包', '红红酸菜炒米', '老米家泡馍'],
          tips: '回民街是游客区，价格偏贵，想省钱去小巷子当地人吃的店'
        }
      ],
      tips: [
        '古城墙骑行建议从南门上，顺时针骑，约1.5-2小时',
        '回民街下午5点后人很多，注意保管财物',
        '尊重回民饮食习惯，不要带非清真食品进入'
      ]
    },
    {
      day: 3,
      title: '历史遗迹 + 返程',
      theme: '陕西历史博物馆 · 小雁塔',
      activities: [
        {
          time: '09:00',
          name: '陕西历史博物馆',
          nameEn: "Shaanxi History Museum",
          type: 'attraction',
          duration: '3小时',
          description: '中国第一座大型现代化历史博物馆，周秦汉唐文物精华。',
          price: '免费 (预约)',
          location: '雁塔区小寨东路',
          locationLat: 34.2095,
          locationLng: 108.9595,
          highlights: ['唐朝壁画馆', '青铜器', '鎏金竹节熏炉', '兽首玛瑙杯'],
          tips: '必须提前在官方公众号预约！珍宝馆¥30值得一看'
        },
        {
          time: '12:30',
          name: '赛格国际购物中心',
          nameEn: 'Saige International',
          type: 'food',
          duration: '1.5小时',
          description: '小寨商圈核心，餐饮选择极多，亚洲第一长扶梯。',
          price: '¥80-150/人',
          location: '雁塔区小寨',
          locationLat: 34.2235,
          locationLng: 108.9485,
          highlights: ['长安大排档', '饮食区', '瀑布阶梯'],
          tips: '长安大排档可以吃到各种陕西小吃'
        },
        {
          time: '14:30',
          name: '小雁塔/西安博物院',
          nameEn: 'Small Wild Goose Pagoda',
          type: 'attraction',
          duration: '2小时',
          description: '唐代佛教建筑，与大雁塔齐名，院内西安博物院免费参观。',
          price: '免费 (需预约)',
          location: '碑林区友谊西路',
          locationLat: 34.2345,
          locationLng: 108.9395,
          highlights: ['小雁塔', '西安博物院', '古银杏'],
          tips: '人比大雁塔少很多，体验更好'
        },
        {
          time: '17:00',
          name: '返程',
          nameEn: 'Departure',
          type: 'transport',
          duration: '1-2小时',
          description: '前往机场或火车站。',
          price: '¥30-50',
          location: '西安市区',
          locationLat: 34.2655,
          locationLng: 108.9465,
          highlights: [],
          tips: '西安咸阳机场距市区约40公里，高铁站距市中心较近'
        }
      ],
      tips: [
        '陕西历史博物馆是西安最值得去的博物馆，请务必提前预约',
        '如果还有时间，可以去永兴坊吃陕西小吃，比回民街更地道更便宜',
        '西安博物院和小雁塔在一起，可以安排在一起游玩'
      ]
    }
  ]
};

// ─── 成都 3 天美食之旅 ───────────────────────────────────────────────────────

export const chengdu3Days: ItineraryRoute = {
  id: 'chengdu-3days',
  city: '成都',
  cityEn: 'Chengdu',
  country: '中国',
  days: 3,
  title: '成都 3 天美食之旅',
  subtitle: '川菜天堂 · 熊猫基地 · 茶馆文化',
  theme: ['美食', '熊猫', '文化', '休闲'],
  budget: '¥2500',
  bestSeason: '3月-5月 / 9月-11月',
  highlights: ['大熊猫基地', '宽窄巷子', '锦里', '武侯祠', '都江堰'],
  description: '天府之国，世界美食之都，看熊猫、吃火锅、摆龙门阵，感受成都人的慢生活哲学。',
  practicalInfo: {
    transport: '地铁+打车为主，景区间有直通车，共享单车城区很方便',
    weather: '春秋最佳，夏季闷热多雨，冬季阴冷但室内有暖',
    food: '火锅、串串香、担担面、龙抄手、钟水饺、赖汤圆',
    safety: '治安极好，武侯祠/锦里周边注意扒手'
  },
  dayPlans: [
    {
      day: 1,
      title: '熊猫卖萌日',
      theme: '大熊猫 · 宽窄巷子',
      activities: [
        {
          time: '07:30',
          name: '成都大熊猫繁育研究基地',
          nameEn: 'Chengdu Panda Base',
          type: 'attraction',
          duration: '4小时',
          description: '全球最大熊猫繁育研究基地，近距离观赏大熊猫卖萌。',
          price: '¥55',
          location: '成华区外北熊猫大道',
          locationLat: 30.7385,
          locationLng: 104.1465,
          highlights: ['成年熊猫别墅', '亚成年熊猫', '小熊猫区', '熊猫幼儿园'],
          tips: '必须早上去！熊猫上午活跃，下午大多在睡觉，8-10点是最佳观赏时间'
        },
        {
          time: '12:30',
          name: '玉林路美食',
          nameEn: 'Yulin Road Food',
          type: 'food',
          duration: '2小时',
          description: '成都本地人最爱的美食街，串串香、火锅、冒菜汇聚。',
          price: '¥60-100/人',
          location: '武侯区玉林路',
          locationLat: 30.6415,
          locationLng: 104.0535,
          highlights: ['玉林串串香', '飘香火锅', '王妈手撕兔'],
          tips: '玉林路是成都本地人吃东西的地方，比网红店更正宗'
        },
        {
          time: '15:30',
          name: '宽窄巷子',
          nameEn: 'Wide and Narrow Alleys',
          type: 'attraction',
          duration: '2.5小时',
          description: '清朝古街道，保留了老成都建筑风貌，文艺小店和地道小吃并存。',
          price: '免费',
          location: '青羊区长顺街',
          locationLat: 30.6635,
          locationLng: 104.0565,
          highlights: ['宽巷子', '窄巷子', '井巷子', '采耳体验'],
          tips: '下午去可以喝喝茶看川剧变脸，晚上灯光更美'
        },
        {
          time: '18:30',
          name: '小龙坎老火锅',
          nameEn: 'Xiaolongkan Hotpot',
          type: 'food',
          duration: '2小时',
          description: '成都最火爆的火锅店之一，牛油红锅配鸭肠毛肚。',
          price: '¥120-180/人',
          location: '春熙路/太古里附近',
          locationLat: 30.6585,
          locationLng: 104.0855,
          highlights: ['鲜毛肚', '鸭肠', '嫩牛肉', '冰粉'],
          tips: '必须提前在大众点评取号，否则等2小时以上'
        }
      ],
      tips: [
        '去熊猫基地要早，回程在景区门口坐景区直通车',
        '成都火锅微辣是底线，外地人不要轻易尝试特辣',
        '吃完火锅可以来一碗冰粉解辣'
      ]
    },
    {
      day: 2,
      title: '文化探索日',
      theme: '武侯祠 · 锦里 · 杜甫草堂',
      activities: [
        {
          time: '09:00',
          name: '武侯祠',
          nameEn: 'Wuhou Shrine',
          type: 'attraction',
          duration: '2.5小时',
          description: '纪念诸葛亮的三国圣地，中国唯一君臣合祠的祠庙。',
          price: '¥50',
          location: '武侯区武侯祠大街',
          locationLat: 30.6515,
          locationLng: 104.0435,
          highlights: ['刘备殿', '诸葛亮殿', '红墙竹影', '三义庙'],
          tips: '请导游讲解才能看懂三国文化，红墙竹影很适合拍照'
        },
        {
          time: '12:00',
          name: '锦里古街',
          nameEn: 'Jinli Ancient Street',
          type: 'food',
          duration: '2.5小时',
          description: '武侯祠旁边的仿古商业街，三国文化和四川小吃汇聚。',
          price: '¥80-120/人',
          location: '武侯区武侯祠大街',
          locationLat: 30.6535,
          locationLng: 104.0425,
          highlights: ['三大炮', '糖油果子', '张飞牛肉', '叶儿粑'],
          tips: '锦里和武侯祠在一起，可以一起游玩，小吃比宽窄贵'
        },
        {
          time: '15:00',
          name: '杜甫草堂',
          nameEn: 'Du Fu Thatched Cottage',
          type: 'attraction',
          duration: '2.5小时',
          description: '唐代诗人杜甫成都故居，茅屋建筑清雅秀丽。',
          price: '¥50',
          location: '青羊区草堂路',
          locationLat: 30.6835,
          locationLng: 104.0235,
          highlights: ['杜甫草堂', '大雅堂', '花径', '红墙'],
          tips: '园林很美，喜欢唐诗的朋友不要错过'
        },
        {
          time: '18:00',
          name: '春熙路/太古里',
          nameEn: 'Chunxi Road / Taikoo Li',
          type: 'shopping',
          duration: '3小时',
          description: '成都最繁华商圈，国际品牌汇聚，美女也是风景线。',
          price: '视购买情况',
          location: '锦江区春熙路',
          locationLat: 30.6585,
          locationLng: 104.0855,
          highlights: ['太古里', 'IFS熊猫', '春熙路步行街'],
          tips: '太古里有免费WiFi，逛街累了可以进星巴克休息'
        }
      ],
      tips: [
        '武侯祠出来就是锦里，但锦里晚上更好看，可以调整顺序',
        '杜甫草堂离武侯祠较远，建议单独安排半天',
        '春熙路是成都时尚地标，可以看到成都的潮流一面'
      ]
    },
    {
      day: 3,
      title: '休闲体验 + 返程',
      theme: '都江堰 · 采耳 · 返程',
      activities: [
        {
          time: '08:30',
          name: '都江堰景区',
          nameEn: 'Dujiangyan Irrigation System',
          type: 'attraction',
          duration: '4小时',
          description: '世界文化遗产，2200年前李冰父子建造的水利工程，至今仍在使用。',
          price: '¥90 (门票+摆渡车)',
          location: '都江堰市幸福路',
          locationLat: 31.0035,
          locationLng: 103.6135,
          highlights: ['鱼嘴分水堤', '飞沙堰', '宝瓶口', '安澜索桥'],
          tips: '从成都乘坐城际高铁约30分钟到都江堰站，早去早回'
        },
        {
          time: '13:00',
          name: '都江堰当地美食',
          nameEn: 'Dujiangyan Local Food',
          type: 'food',
          duration: '1.5小时',
          description: '都江堰本地特色，太平老街有各种地道小吃。',
          price: '¥50-80/人',
          location: '都江堰市太平老街',
          locationLat: 31.0035,
          locationLng: 103.6135,
          highlights: ['尤兔头', '渣渣面', '冰粉'],
          tips: '都江堰市区不大，步行可以逛完'
        },
        {
          time: '15:00',
          name: '返回成都 + 鹤鸣茶社',
          nameEn: 'Return & Hemy Tea House',
          type: 'food',
          duration: '2小时',
          description: '回到成都，去人民公园鹤鸣茶社体验成都茶馆文化。',
          price: '¥30-50/人',
          location: '青羊区人民公园',
          locationLat: 30.6555,
          locationLng: 104.0535,
          highlights: ['盖碗茶', '采耳', '掏耳朵'],
          tips: '成渝高铁都江堰→成都约30分钟，鹤鸣茶社可以体验成都慢生活'
        },
        {
          time: '18:00',
          name: '返程',
          nameEn: 'Departure',
          type: 'transport',
          duration: '1-2小时',
          description: '前往机场或火车站。',
          price: '¥30-50',
          location: '成都双流/天府机场',
          locationLat: 30.5785,
          locationLng: 104.0655,
          highlights: [],
          tips: '成都双流机场距市区约18公里，天府机场较远但有地铁18号线'
        }
      ],
      tips: [
        '如果不想去都江堰，可以换成青城山（道教名山），但需要一整天',
        '成都茶馆体验推荐人民公园鹤鸣茶社或锦江剧场旁茶馆',
        '走之前可以买一些张飞牛肉、郫县豆瓣作为伴手礼'
      ]
    }
  ]
};

// ─── 桂林 3 天山水之旅 ───────────────────────────────────────────────────────

export const guilin3Days: ItineraryRoute = {
  id: 'guilin-3days',
  city: '桂林',
  cityEn: 'Guilin',
  country: '中国',
  days: 3,
  title: '桂林 3 天山水之旅',
  subtitle: '漓江竹筏 · 阳朔骑行 · 溶洞探秘',
  theme: ['山水', '摄影', '骑行', '户外'],
  budget: '¥2500',
  bestSeason: '4月-10月（5月涨水期最美）',
  highlights: ['漓江竹筏', '阳朔西街', '十里画廊', '象鼻山', '龙脊梯田'],
  description: '桂林山水甲天下，乘竹筏游漓江，骑行十里画廊，住阳朔西街，看尽喀斯特地貌精华。',
  practicalInfo: {
    transport: '租电动车游阳朔，漓江竹筏是精华，桂林市区打车很便宜',
    weather: '4-10月最佳，夏季注意防晒，5月雨季漓江水量大',
    food: '桂林米粉、田螺酿、啤酒鱼、黄焖鸡',
    safety: '漂流/竹筏要穿救生衣，注意防晒防蚊'
  },
  dayPlans: [
    {
      day: 1,
      title: '漓江精华游',
      theme: '竹筏 · 兴坪 · 西街',
      activities: [
        {
          time: '08:00',
          name: '漓江竹筏漂流（杨堤-九马画山）',
          nameEn: 'Li River Bamboo Raft (Yangdi-Jiumahua)',
          type: 'attraction',
          duration: '3小时',
          description: '漓江最精华段，20元人民币背景图案取景地，九马画山。',
          price: '¥218/人',
          location: '阳朔县杨堤乡',
          locationLat: 24.9435,
          locationLng: 110.4535,
          highlights: ['九马画山', '20元人民币背景', '杨堤风光', '浪石村'],
          tips: '必须早起出发，漂流约2-3小时，注意防晒和防水'
        },
        {
          time: '12:00',
          name: '兴坪古镇',
          nameEn: 'Xingping Ancient Town',
          type: 'food',
          duration: '1.5小时',
          description: '漓江精华游终点，古镇老街上吃桂林米粉，买工艺品。',
          price: '¥30-50/人',
          location: '阳朔县兴坪镇',
          locationLat: 24.9235,
          locationLng: 110.4835,
          highlights: ['兴坪老街', '漓江渔火', '桂林米粉'],
          tips: '兴坪古镇很小，1小时足够，可以骑车去相公山'
        },
        {
          time: '14:00',
          name: '阳朔十里画廊',
          nameEn: 'Yangshuo Ten Li Gallery',
          type: 'transport',
          duration: '3小时',
          description: '骑电动车沿遇龙河畔穿行，月亮山、大榕树、蝴蝶泉。',
          price: '¥50-80 (租电动车)',
          location: '阳朔县十里画廊',
          locationLat: 24.7835,
          locationLng: 110.5035,
          highlights: ['月亮山', '大榕树', '遇龙河畔', '工农桥'],
          tips: '租电动车¥50/天，记得砍价！沿途风景很美'
        },
        {
          time: '17:30',
          name: '阳朔西街',
          nameEn: 'Yangshuo West Street',
          type: 'attraction',
          duration: '3小时',
          description: '阳朔最繁华的步行街，中西结合，酒吧林立，夜生活丰富。',
          price: '视消费情况',
          location: '阳朔县城中心',
          locationLat: 24.7735,
          locationLng: 110.4935,
          highlights: ['西街夜景', '酒吧一条街', '手工艺品', '啤酒鱼'],
          tips: '啤酒鱼是阳朔招牌，¥60-80/斤，可以在西街选评分高的店'
        }
      ],
      tips: [
        '杨堤-九马画山竹筏漂流必须提前订，尤其是在旺季',
        '阳朔租电动车可以讲价到40-50元/天，电量不够可以换车',
        '西街晚上人很多，注意保管财物'
      ]
    },
    {
      day: 2,
      title: '阳朔深度日',
      theme: '相公山 · 遇龙河 · 银子岩',
      activities: [
        {
          time: '06:00',
          name: '相公山日出',
          nameEn: 'Xianggong Mountain Sunrise',
          type: 'attraction',
          duration: '3小时',
          description: '漓江最佳日出观景点，俯瞰漓江第一湾，摄影爱好者必去。',
          price: '¥60',
          location: '阳朔县葡萄镇',
          locationLat: 24.9035,
          locationLng: 110.4535,
          highlights: ['漓江第一湾', '日出云海', '摄影圣地'],
          tips: '日出前1小时出发，看完日出8点左右下山'
        },
        {
          time: '09:30',
          name: '遇龙河漂流（金龙桥-旧县）',
          nameEn: 'Yulong River Drift',
          type: 'attraction',
          duration: '3小时',
          description: '比漓江更安静舒适的漂流，两岸田园风光，9个落差。',
          price: '¥255/人',
          location: '阳朔县金宝乡',
          locationLat: 24.8135,
          locationLng: 110.4735,
          highlights: ['金龙桥', '富里桥', '田园风光', '冲坝'],
          tips: '早上第一漂人少，漂流中途可以下船拍照'
        },
        {
          time: '13:00',
          name: '旧县午餐',
          nameEn: 'Jiuxian Village Lunch',
          type: 'food',
          duration: '1.5小时',
          description: '旧县古村落的农家乐，啤酒鱼、黄焖鸡、新鲜蔬菜。',
          price: '¥60-100/人',
          location: '阳朔县旧县村',
          locationLat: 24.8035,
          locationLng: 110.4735,
          highlights: ['农家乐', '新鲜蔬菜', '土鸡'],
          tips: '旧县村有保存完好的明清古民居，可以顺道参观'
        },
        {
          time: '15:00',
          name: '银子岩',
          nameEn: 'Silver Cave',
          type: 'attraction',
          duration: '2小时',
          description: '桂林最大最漂亮的溶洞，钟乳石在灯光下如银子般闪烁。',
          price: '¥65',
          location: '荔浦市马岭镇',
          locationLat: 24.8535,
          locationLng: 110.1435,
          highlights: ['混元珍珠伞', '雪山飞瀑', '神奇石柱'],
          tips: '银子岩在阳朔和荔浦之间，可以安排在去程或回程的路上'
        },
        {
          time: '18:00',
          name: '阳朔西街夜晚',
          nameEn: 'Yangshuo Night',
          type: 'attraction',
          duration: '3小时',
          description: '第二天晚上继续西街，享受阳朔夜生活。',
          price: '视消费情况',
          location: '阳朔县城中心',
          locationLat: 24.7735,
          locationLng: 110.4935,
          highlights: ['西街夜景', '张艺谋印象演出', '酒吧'],
          tips: '如果没看过张艺谋的《印象·刘三姐》，值得一看'
        }
      ],
      tips: [
        '相公山日出要拼车或包车前往，建议找酒店前台帮忙拼车',
        '遇龙河漂流比漓江更休闲，两人一个竹筏，老人小孩都适合',
        '银子岩是溶洞，洞内恒温，夏季是避暑好去处'
      ]
    },
    {
      day: 3,
      title: '桂林市区 + 返程',
      theme: '象鼻山 · 两江四湖',
      activities: [
        {
          time: '09:00',
          name: '返回桂林市区',
          nameEn: 'Return to Guilin City',
          type: 'transport',
          duration: '2小时',
          description: '从阳朔乘大巴或高铁返回桂林市区。',
          price: '¥25-40',
          location: '阳朔→桂林',
          locationLat: 25.2735,
          locationLng: 110.2935,
          highlights: [],
          tips: '高铁阳朔站到桂林约40分钟，或乘大巴约1.5小时'
        },
        {
          time: '11:00',
          name: '象鼻山',
          nameEn: 'Elephant Trunk Hill',
          type: 'attraction',
          duration: '2小时',
          description: '桂林城徽，漓江标志性景点，因山形像一头饮水的大象而得名。',
          price: '¥55 (免费入园需预约)',
          location: '象山区象山南路',
          locationLat: 25.2635,
          locationLng: 110.2935,
          highlights: ['象鼻岩', '水月洞', '爱情岛'],
          tips: '现在免费预约入园，但名额有限，建议提前预约'
        },
        {
          time: '13:30',
          name: '椿记烧鹅',
          nameEn: 'Chunji Roast Goose',
          type: 'food',
          duration: '1.5小时',
          description: '桂林最著名的粤菜馆，烧鹅是招牌，本地人推荐。',
          price: '¥80-120/人',
          location: '叠彩区中山北路',
          locationLat: 25.2835,
          locationLng: 110.2835,
          highlights: ['椿记烧鹅', '白切鸡', '荔浦芋扣肉'],
          tips: '桂林椿记有多家分店，选择离象山近的'
        },
        {
          time: '15:30',
          name: '两江四湖景区',
          nameEn: 'Two Rivers and Four Lakes',
          type: 'attraction',
          duration: '2小时',
          description: '桂林市区内漓江、桃花江、杉湖、榕湖、桂湖、木龙湖的统称。',
          price: '¥80 (夜游船票)',
          location: '桂林市区',
          locationLat: 25.2735,
          locationLng: 110.2935,
          highlights: ['日月双塔', '玻璃桥', '古南门'],
          tips: '建议下午4-5点开始游，可以看到白天和夜景两个时段'
        },
        {
          time: '18:00',
          name: '返程',
          nameEn: 'Departure',
          type: 'transport',
          duration: '1-2小时',
          description: '前往桂林两江国际机场或桂林站/北站。',
          price: '¥50-80',
          location: '桂林市区',
          locationLat: 25.2235,
          locationLng: 110.0335,
          highlights: [],
          tips: '桂林机场距市区约28公里，建议提前2小时出发'
        }
      ],
      tips: [
        '桂林美食：桂林米粉（早餐必吃）、荔浦芋扣肉、阳朔啤酒鱼',
        '如果还有时间，可以加一天去龙脊梯田，壮观程度超过想象',
        '桂林市区不大，打车很便宜，共享单车也很方便'
      ]
    }
  ]
};

// ─── 杭州 2 天休闲之旅 ───────────────────────────────────────────────────────

export const hangzhou2Days: ItineraryRoute = {
  id: 'hangzhou-2days',
  city: '杭州',
  cityEn: 'Hangzhou',
  country: '中国',
  days: 2,
  title: '杭州 2 天休闲之旅',
  subtitle: '西湖美景 · 龙井问茶 · 千年宋韵',
  theme: ['西湖', '茶文化', '园林', '休闲'],
  budget: '¥2000',
  bestSeason: '3月-5月（西湖春天最美）/ 9月-11月（桂花飘香）',
  highlights: ['西湖', '灵隐寺', '龙井村', '河坊街', '宋城'],
  description: '上有天堂，下有苏杭。杭州之美在西湖，西湖之美在山水与人文的完美融合。来这里过个慢周末。',
  practicalInfo: {
    transport: '地铁+打车，景区内骑共享单车或租景区自行车，西湖一圈约10公里',
    weather: '春秋最佳，夏季闷热，冬季湿冷',
    food: '东坡肉、西湖醋鱼、龙井虾仁、叫化鸡、片儿川',
    safety: '治安极好，旅游热门城市无安全隐患'
  },
  dayPlans: [
    {
      day: 1,
      title: '西湖深度日',
      theme: '西湖 · 灵隐寺 · 河坊街',
      activities: [
        {
          time: '08:00',
          name: '断桥残雪',
          nameEn: 'Broken Bridge',
          type: 'attraction',
          duration: '1小时',
          description: '西湖标志景点，白堤起点，一年四季都是杭州最美画面。',
          price: '免费',
          location: '西湖区北山街',
          locationLat: 30.2585,
          locationLng: 120.1485,
          highlights: ['断桥', '白堤', '保俶塔远景'],
          tips: '清晨6-7点到断桥，可以避开人流看到本地人晨练'
        },
        {
          time: '09:30',
          name: '苏堤春晓',
          nameEn: 'Su Causeway',
          type: 'attraction',
          duration: '1.5小时',
          description: '苏轼任杭州知州时修建，堤上有6座拱桥，春天最美。',
          price: '免费',
          location: '西湖区苏堤',
          locationLat: 30.2435,
          locationLng: 120.1335,
          highlights: ['苏堤六桥', '花港观鱼', '雷峰塔远景'],
          tips: '苏堤骑自行车比走路舒服，约30分钟走完'
        },
        {
          time: '11:30',
          name: '楼外楼',
          nameEn: 'Louwailou Restaurant',
          type: 'food',
          duration: '1.5小时',
          description: '百年老店，杭州最著名的杭帮菜餐厅，就在西湖边上。',
          price: '¥150-250/人',
          location: '西湖区孤山路',
          locationLat: 30.2535,
          locationLng: 120.1485,
          highlights: ['东坡肉', '西湖醋鱼', '叫化鸡', '龙井虾仁'],
          tips: '楼外楼是游客餐厅，价格偏贵但位置绝佳，想省钱可以去外婆家'
        },
        {
          time: '13:30',
          name: '雷峰塔',
          nameEn: 'Leifeng Pagoda',
          type: 'attraction',
          duration: '1.5小时',
          description: '西湖标志性建筑，白娘子传说所在地，登塔俯瞰西湖。',
          price: '¥40',
          location: '西湖区南山路',
          locationLat: 30.2335,
          locationLng: 120.1485,
          highlights: ['雷峰塔远景', '西湖全景', '白娘子传说展'],
          tips: '雷峰塔可以坐电梯登顶，注意防晒'
        },
        {
          time: '15:30',
          name: '花港观鱼',
          nameEn: 'Flowers and Fish View',
          type: 'attraction',
          duration: '1小时',
          description: '西湖十景之一，苏堤南端，池中锦鲤成群。',
          price: '免费',
          location: '西湖区花港观鱼',
          locationLat: 30.2385,
          locationLng: 120.1335,
          highlights: ['红鱼池', '大草坪', '魏庐'],
          tips: '花港观鱼出来可以坐游船去小瀛洲（三潭印月）'
        },
        {
          time: '17:30',
          name: '河坊街',
          nameEn: 'Hefang Street',
          type: 'attraction',
          duration: '2.5小时',
          description: '杭州最具烟火气的古街，清河坊历史街区，小吃手工艺品汇聚。',
          price: '免费',
          location: '上城区河坊街',
          locationLat: 30.2485,
          locationLng: 120.1685,
          highlights: ['胡庆余堂', '张小泉剪刀', '定胜糕', '臭豆腐'],
          tips: '河坊街下午4点后人开始多，8点后店铺陆续关门，合理安排时间'
        }
      ],
      tips: [
        '西湖很大，建议骑共享单车绕湖，约3-4小时可以环湖一圈',
        '断桥→苏堤→花港观鱼→雷峰塔是经典路线，全程步行约6公里',
        '河坊街离西湖约2公里，可以骑车或步行'
      ]
    },
    {
      day: 2,
      title: '文化体验日',
      theme: '灵隐寺 · 龙井村 · 宋城',
      activities: [
        {
          time: '08:00',
          name: '灵隐寺',
          nameEn: 'Lingyin Temple',
          type: 'attraction',
          duration: '3小时',
          description: '杭州最著名寺庙，始建于东晋，香火极旺，环境清幽。',
          price: '¥75 (灵隐+飞来峰)',
          location: '西湖区灵隐路',
          locationLat: 30.2385,
          locationLng: 120.1035,
          highlights: ['飞来峰', '灵隐寺', '永福寺', '素面'],
          tips: '早上8点前进香人少，灵隐寺素面是特色'
        },
        {
          time: '11:30',
          name: '龙井村',
          nameEn: 'Longjing Village',
          type: 'attraction',
          duration: '2.5小时',
          description: '中国十大名茶龙井的产地，可以在茶农家品茶买茶。',
          price: '免费品茶',
          location: '西湖区龙井村',
          locationLat: 30.2235,
          locationLng: 120.0835,
          highlights: ['龙井茶园', '茶农家品茶', '十里锒铛徒步道'],
          tips: '从灵隐出来打车约15分钟，可以买一些正宗龙井带回家'
        },
        {
          time: '14:00',
          name: '中国茶叶博物馆',
          nameEn: 'China Tea Museum',
          type: 'attraction',
          duration: '1.5小时',
          description: '中国唯一以茶文化为主题的国家级博物馆，了解中国茶文化。',
          price: '免费',
          location: '西湖区龙井路',
          locationLat: 30.2135,
          locationLng: 120.0735,
          highlights: ['茶文化展厅', '龙井茶展区', '茶艺表演'],
          tips: '博物馆就在龙井村旁边，可以一起参观'
        },
        {
          time: '16:00',
          name: '宋城',
          nameEn: 'Songcheng',
          type: 'attraction',
          duration: '3小时',
          description: '大型宋代文化主题公园，《宋城千古情》是必看演出。',
          price: '¥300 (含演出)',
          location: '西湖区转塘镇',
          locationLat: 30.1535,
          locationLng: 120.0635,
          highlights: ['宋城千古情', '清明上河图', '鬼屋', '丽江古城'],
          tips: '《宋城千古情》是张艺谋导演的演出，值得一看，建议提前订座'
        },
        {
          time: '20:00',
          name: '返程/西湖音乐喷泉',
          nameEn: 'Return / West Lake Music Fountain',
          type: 'attraction',
          duration: '1小时',
          description: '如果还有时间，晚上的西湖音乐喷泉是杭州一景。',
          price: '免费',
          location: '西湖区湖滨路',
          locationLat: 30.2485,
          locationLng: 120.1535,
          highlights: ['音乐喷泉', '湖滨夜景'],
          tips: '音乐喷泉每晚7点和8点各一场，每场15分钟，提前20分钟到'
        }
      ],
      tips: [
        '灵隐寺和龙井村可以安排在同一天，但距离市区较远',
        '龙井村买茶要会讲价，外地人容易被宰，可以去茶叶博物馆买更放心',
        '宋城在杭州西南角，如果下午不去可以换成河坊街二次深度游'
      ]
    }
  ]
};

// ─── 所有线路汇总 ────────────────────────────────────────────────────────────

export const allItineraries: ItineraryRoute[] = [
  shanghai4Days,
  beijing5Days,
  xian3Days,
  chengdu3Days,
  guilin3Days,
  hangzhou2Days,
];

// ─── 工具函数 ────────────────────────────────────────────────────────────────

/**
 * 根据城市获取线路
 */
export function getItineraryByCity(cityEn: string): ItineraryRoute | undefined {
  return allItineraries.find(
    r => r.cityEn.toLowerCase() === cityEn.toLowerCase()
  );
}

/**
 * 根据天数获取线路
 */
export function getItinerariesByDays(days: number): ItineraryRoute[] {
  return allItineraries.filter(r => r.days === days);
}

/**
 * 根据预算获取线路
 */
export function getItinerariesByBudget(budget: string): ItineraryRoute[] {
  return allItineraries.filter(r => r.budget === budget);
}

/**
 * 获取所有可用城市
 */
export function getAvailableCities(): { city: string; cityEn: string; country: string }[] {
  return allItineraries.map(r => ({
    city: r.city,
    cityEn: r.cityEn,
    country: r.country,
  }));
}

/**
 * 获取热门推荐线路（用于首页展示）
 */
export function getFeaturedItineraries(limit = 3): ItineraryRoute[] {
  return allItineraries.slice(0, limit);
}

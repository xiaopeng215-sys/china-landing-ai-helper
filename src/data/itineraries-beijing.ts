/**
 * 北京行程数据 - 5 天文化之旅
 * Beijing 5-Day Cultural Tour
 */

import type { ItineraryRoute } from './types';

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
  bestSeason: '4 月 -6 月 / 9 月 -10 月',
  highlights: ['故宫', '长城', '胡同骑游', '天坛', '颐和园'],
  description: '从紫禁城到八达岭，从胡同深处到后海酒吧街，全方位感受中国政治文化中心 3000 年历史。',
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
        { time: '08:00', name: '天安门广场', nameEn: 'Tiananmen Square', type: 'attraction', duration: '1 小时', description: '世界最大的城市广场，每天升降旗仪式是必看项目。', price: '免费', location: '东城区天安门广场', locationLat: 39.9042, locationLng: 116.3975, highlights: ['人民英雄纪念碑', '毛主席纪念堂', '人民大会堂'], tips: '周一毛纪念堂闭馆，请携带身份证' },
        { time: '09:30', name: '故宫博物院', nameEn: 'Forbidden City', type: 'attraction', duration: '4 小时', description: '明清两代皇宫，世界最大宫殿建筑群，建议租讲解器。', price: '¥60 (旺季¥80)', location: '东城区景山前街', locationLat: 39.9163, locationLng: 116.3972, highlights: ['午门', '太和殿', '乾清宫', '御花园'], tips: '从午门进，神武门出，建议租用讲解器¥20' },
        { time: '14:00', name: '景山公园', nameEn: 'Jingshan Park', type: 'attraction', duration: '1 小时', description: '故宫最佳观景点，俯瞰紫禁城全貌。', price: '¥2', location: '西城区景山前街', locationLat: 39.9183, locationLng: 116.3970, highlights: ['万春亭俯瞰故宫', '南北中轴线'], tips: '下午 3-4 点光线最好，拍照绝美' },
        { time: '16:00', name: '国家博物馆', nameEn: 'National Museum of China', type: 'attraction', duration: '2 小时', description: '中华文化最高殿堂，古代中国展品丰富。', price: '免费 (预约)', location: '东城区东长安街', locationLat: 39.9045, locationLng: 116.4036, highlights: ['古代中国展', '复兴之路', '特展'], tips: '必须提前在官方小程序预约，周一闭馆' }
      ],
      tips: ['天安门广场 + 故宫建议安排一整天，上午进场人少', '故宫内没有餐厅，请自备干粮或下午出来后再吃饭', '带好身份证原件，安检严格']
    },
    {
      day: 2,
      title: '长城一日游',
      theme: '八达岭 · 户外挑战',
      activities: [
        { time: '07:30', name: '八达岭长城', nameEn: 'Badaling Great Wall', type: 'attraction', duration: '4 小时', description: '最具代表性的长城段落，交通最便利，设施最完善。', price: '¥40 + 往返缆车¥140', location: '延庆区八达岭镇', locationLat: 40.3652, locationLng: 116.6015, highlights: ['北八楼好汉坡', '缆车观光', '好汉石'], tips: '建议一早出发避高峰，体力好爬北线，想省力坐缆车' },
        { time: '13:00', name: '长城脚下农家乐', nameEn: 'Great Wall Rural Restaurant', type: 'food', duration: '1.5 小时', description: '延庆本地农家菜，山野菜、炖鸡、烙饼。', price: '¥80-120/人', location: '延庆区八达岭镇', locationLat: 40.3580, locationLng: 116.5950, highlights: ['山野菜', '柴鸡蛋', '农家炖菜'], tips: '选择农家乐前先看点评，避开拉客的' },
        { time: '15:00', name: '返回市区', nameEn: 'Return to City', type: 'transport', duration: '2 小时', description: '从八达岭乘坐 919 路或 S2 线返回市区。', price: '¥15-20', location: '延庆区→东城区', locationLat: 40.3652, locationLng: 116.6015, highlights: [], tips: '919 路到德胜门，步行至积水潭地铁站' },
        { time: '18:00', name: '簋街', nameEn: 'Gui Street', type: 'food', duration: '2 小时', description: '北京著名夜市一条街，麻辣小龙虾是招牌。', price: '¥100-200/人', location: '东城区东直门大街', locationLat: 39.9415, locationLng: 116.4345, highlights: ['胡大饭馆', '便宜坊', '小龙虾'], tips: '簋街晚上才热闹，11 点后更热闹' }
      ],
      tips: ['八达岭交通：去程 S2 线黄土店站（地铁霍营站）→八达岭，回程 919 路快到德胜门', '体力有限可以坐缆车到北八楼，再走下来', '春秋季节长城风大，带外套']
    },
    {
      day: 3,
      title: '胡同骑游日',
      theme: '胡同 · 四合院 · 老北京',
      activities: [
        { time: '09:00', name: '南锣鼓巷', nameEn: 'Nanluoguxiang', type: 'attraction', duration: '2 小时', description: '北京最时尚的胡同区，咖啡馆、文创店、老字号并存。', price: '免费', location: '东城区南锣鼓巷', locationLat: 39.9375, locationLng: 116.4035, highlights: ['文创小店', '齐白石故居', '中央戏剧学院'], tips: '早上 9 点前人少，拍照好' },
        { time: '11:30', name: '什刹海胡同骑游', nameEn: 'Shichahai Hutong Cycling', type: 'transport', duration: '3 小时', description: '骑共享单车穿梭老北京胡同，经过烟袋斜街、银锭桥、宋庆龄故居。', price: '¥10-20 (共享单车)', location: '西城区什刹海', locationLat: 39.9395, locationLng: 116.3935, highlights: ['银锭桥', '后海酒吧街', '恭王府', '郭沫若故居'], tips: '建议请一个胡同导游讲解，可以在大咖说约导游' },
        { time: '14:30', name: '恭王府', nameEn: 'Prince Gong\'s Mansion', type: 'attraction', duration: '2 小时', description: '清代规模最大王府，和珅旧宅，建筑精美绝伦。', price: '¥40', location: '西城区恭王府', locationLat: 39.9365, locationLng: 116.3835, highlights: ['福字碑', '后罩楼', '西洋门'], tips: '请讲解很重要，不然看不出门道' },
        { time: '17:30', name: '后海/三里屯', nameEn: 'Houhai / Sanlitun', type: 'attraction', duration: '3 小时', description: '后海酒吧街老北京风情，三里屯太古里国际时尚。', price: '视消费情况', location: '西城区/朝阳区', locationLat: 39.9415, locationLng: 116.3935, highlights: ['后海酒吧', '三里屯 SOHO', '优衣库旗舰店'], tips: '后海适合晚上小酌一杯，三里屯可以购物' }
      ],
      tips: ['胡同骑游全程约 5-6 公里，共享单车足够', '南锣鼓巷和什刹海很近，可以步行串联', '胡同里有些院子是私人的，不要擅自进入']
    },
    {
      day: 4,
      title: '皇家园林之旅',
      theme: '天坛 · 颐和园 · 北大清华',
      activities: [
        { time: '08:00', name: '天坛公园', nameEn: 'Temple of Heaven', type: 'attraction', duration: '2.5 小时', description: '明清皇帝祭天场所，三音石、回音壁是声学奇观。', price: '¥34 (联票)', location: '东城区天坛东路', locationLat: 39.8835, locationLng: 116.4135, highlights: ['祈年殿', '回音壁', '圜丘'], tips: '建议清晨来，本地人晨练很有生活气息' },
        { time: '11:00', name: '颐和园', nameEn: 'Summer Palace', type: 'attraction', duration: '4 小时', description: '中国现存最大皇家园林昆明湖、十七孔桥、长廊必看。', price: '¥60 (旺季)', location: '海淀区新建宫门路', locationLat: 39.9935, locationLng: 116.2755, highlights: ['昆明湖', '十七孔桥', '长廊', '佛香阁'], tips: '从北宫门进可以先爬山看全景，再沿湖边走' },
        { time: '15:30', name: '北大清华外景', nameEn: 'PKU & THU Exterior', type: 'attraction', duration: '1 小时', description: '中国最顶尖两所大学，在校门外观光打卡。', price: '免费', location: '海淀区中关村', locationLat: 39.9895, locationLng: 116.3135, highlights: ['清华西门', '北大东门', '中关村大街'], tips: '校园不对外开放，如果想进可以联系学生带进' },
        { time: '17:30', name: '中关村食街', nameEn: 'Zhongguancun Dining', type: 'food', duration: '1.5 小时', description: '中关村各大商场内美食汇聚，连锁快餐到正餐都有。', price: '¥80-150/人', location: '海淀区中关村', locationLat: 39.9855, locationLng: 116.3135, highlights: ['新中关', '欧美汇', '食宝街'], tips: '清华科技园附近有便宜快餐' }
      ],
      tips: ['颐和园很大，建议购买联票，不然很多景点进不去', '天坛和颐和园一天会比较累，注意体力', '北大清华现在需要预约才能进']
    },
    {
      day: 5,
      title: '现代北京 + 返程',
      theme: '798 艺术区 · 返程',
      activities: [
        { time: '09:00', name: '798 艺术区', nameEn: '798 Art District', type: 'attraction', duration: '3 小时', description: '原电子工业厂房改造的当代艺术区，画廊、设计店、咖啡馆林立。', price: '免费', location: '朝阳区酒仙桥路', locationLat: 39.9835, locationLng: 116.5035, highlights: ['尤伦斯当代艺术中心 UCCA', '建筑本身', '设计商店'], tips: '艺术区很大，建议租讲解或者跟导览' },
        { time: '12:30', name: '蓝色港湾', nameEn: 'SOLANA', type: 'food', duration: '1.5 小时', description: '欧美风格购物公园，餐饮选择丰富，紧邻 798。', price: '¥100-200/人', location: '朝阳区朝阳公园路', locationLat: 39.9515, locationLng: 116.4735, highlights: ['餐饮一条街', '湖边美食', '进口超市'], tips: '有室内和室外座位，选择多' },
        { time: '14:30', name: '返程准备', nameEn: 'Departure Prep', type: 'transport', duration: '2 小时', description: '返回市区/酒店取行李，前往机场或火车站。', price: '地铁¥30-50', location: '朝阳区→机场/车站', locationLat: 39.9042, locationLng: 116.4075, highlights: [], tips: '建议购买 16:00 后的交通，有充足缓冲时间' }
      ],
      tips: ['798 艺术区可以购买一些文创产品作为伴手礼', '如果航班在晚上，可以把行李存酒店，轻装逛', '北京堵车严重，去机场留足时间']
    }
  ]
};

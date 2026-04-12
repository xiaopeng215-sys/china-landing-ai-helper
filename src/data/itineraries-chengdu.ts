/**
 * 成都行程数据 - 3 天美食之旅
 * Chengdu 3-Day Food Tour
 */

import type { ItineraryRoute } from './types';

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
  bestSeason: '3 月 -5 月 / 9 月 -11 月',
  highlights: ['大熊猫基地', '宽窄巷子', '锦里', '武侯祠', '都江堰'],
  description: '天府之国，世界美食之都，看熊猫、吃火锅、摆龙门阵，感受成都人的慢生活哲学。',
  practicalInfo: {
    transport: '地铁 + 打车为主，景区间有直通车，共享单车城区很方便',
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
        { time: '07:30', name: '成都大熊猫繁育研究基地', nameEn: 'Chengdu Panda Base', type: 'attraction', duration: '4 小时', description: '全球最大熊猫繁育研究基地，近距离观赏大熊猫卖萌。', price: '¥55', location: '成华区外北熊猫大道', locationLat: 30.7385, locationLng: 104.1465, highlights: ['成年熊猫别墅', '亚成年熊猫', '小熊猫区', '熊猫幼儿园'], tips: '必须早上去！熊猫上午活跃，下午大多在睡觉，8-10 点是最佳观赏时间' },
        { time: '12:30', name: '玉林路美食', nameEn: 'Yulin Road Food', type: 'food', duration: '2 小时', description: '成都本地人最爱的美食街，串串香、火锅、冒菜汇聚。', price: '¥60-100/人', location: '武侯区玉林路', locationLat: 30.6415, locationLng: 104.0535, highlights: ['玉林串串香', '飘香火锅', '王妈手撕兔'], tips: '玉林路是成都本地人吃东西的地方，比网红店更正宗' },
        { time: '15:30', name: '宽窄巷子', nameEn: 'Wide and Narrow Alleys', type: 'attraction', duration: '2.5 小时', description: '清朝古街道，保留了老成都建筑风貌，文艺小店和地道小吃并存。', price: '免费', location: '青羊区长顺街', locationLat: 30.6635, locationLng: 104.0565, highlights: ['宽巷子', '窄巷子', '井巷子', '采耳体验'], tips: '下午去可以喝喝茶看川剧变脸，晚上灯光更美' },
        { time: '18:30', name: '小龙坎老火锅', nameEn: 'Xiaolongkan Hotpot', type: 'food', duration: '2 小时', description: '成都最火爆的火锅店之一，牛油红锅配鸭肠毛肚。', price: '¥120-180/人', location: '春熙路/太古里附近', locationLat: 30.6585, locationLng: 104.0855, highlights: ['鲜毛肚', '鸭肠', '嫩牛肉', '冰粉'], tips: '必须提前在大众点评取号，否则等 2 小时以上' }
      ],
      tips: ['去熊猫基地要早，回程在景区门口坐景区直通车', '成都火锅微辣是底线，外地人不要轻易尝试特辣', '吃完火锅可以来一碗冰粉解辣']
    },
    {
      day: 2,
      title: '文化探索日',
      theme: '武侯祠 · 锦里 · 杜甫草堂',
      activities: [
        { time: '09:00', name: '武侯祠', nameEn: 'Wuhou Shrine', type: 'attraction', duration: '2.5 小时', description: '纪念诸葛亮的三国圣地，中国唯一君臣合祠的祠庙。', price: '¥50', location: '武侯区武侯祠大街', locationLat: 30.6515, locationLng: 104.0435, highlights: ['刘备殿', '诸葛亮殿', '红墙竹影', '三义庙'], tips: '请导游讲解才能看懂三国文化，红墙竹影很适合拍照' },
        { time: '12:00', name: '锦里古街', nameEn: 'Jinli Ancient Street', type: 'food', duration: '2.5 小时', description: '武侯祠旁边的仿古商业街，三国文化和四川小吃汇聚。', price: '¥80-120/人', location: '武侯区武侯祠大街', locationLat: 30.6535, locationLng: 104.0425, highlights: ['三大炮', '糖油果子', '张飞牛肉', '叶儿粑'], tips: '锦里和武侯祠在一起，可以一起游玩，小吃比宽窄贵' },
        { time: '15:00', name: '杜甫草堂', nameEn: 'Du Fu Thatched Cottage', type: 'attraction', duration: '2.5 小时', description: '唐代诗人杜甫成都故居，茅屋建筑清雅秀丽。', price: '¥50', location: '青羊区草堂路', locationLat: 30.6835, locationLng: 104.0235, highlights: ['杜甫草堂', '大雅堂', '花径', '红墙'], tips: '园林很美，喜欢唐诗的朋友不要错过' },
        { time: '18:00', name: '春熙路/太古里', nameEn: 'Chunxi Road / Taikoo Li', type: 'shopping', duration: '3 小时', description: '成都最繁华商圈，国际品牌汇聚，美女也是风景线。', price: '视购买情况', location: '锦江区春熙路', locationLat: 30.6585, locationLng: 104.0855, highlights: ['太古里', 'IFS 熊猫', '春熙路步行街'], tips: '太古里有免费 WiFi，逛街累了可以进星巴克休息' }
      ],
      tips: ['武侯祠出来就是锦里，但锦里晚上更好看，可以调整顺序', '杜甫草堂离武侯祠较远，建议单独安排半天', '春熙路是成都时尚地标，可以看到成都的潮流一面']
    },
    {
      day: 3,
      title: '休闲体验 + 返程',
      theme: '都江堰 · 采耳 · 返程',
      activities: [
        { time: '08:30', name: '都江堰景区', nameEn: 'Dujiangyan Irrigation System', type: 'attraction', duration: '4 小时', description: '世界文化遗产，2200 年前李冰父子建造的水利工程，至今仍在使用。', price: '¥90 (门票 + 摆渡车)', location: '都江堰市幸福路', locationLat: 31.0035, locationLng: 103.6135, highlights: ['鱼嘴分水堤', '飞沙堰', '宝瓶口', '安澜索桥'], tips: '从成都乘坐城际高铁约 30 分钟到都江堰站，早去早回' },
        { time: '13:00', name: '都江堰当地美食', nameEn: 'Dujiangyan Local Food', type: 'food', duration: '1.5 小时', description: '都江堰本地特色，太平老街有各种地道小吃。', price: '¥50-80/人', location: '都江堰市太平老街', locationLat: 31.0035, locationLng: 103.6135, highlights: ['尤兔头', '渣渣面', '冰粉'], tips: '都江堰市区不大，步行可以逛完' },
        { time: '15:00', name: '返回成都 + 鹤鸣茶社', nameEn: 'Return & Hemy Tea House', type: 'food', duration: '2 小时', description: '回到成都，去人民公园鹤鸣茶社体验成都茶馆文化。', price: '¥30-50/人', location: '青羊区人民公园', locationLat: 30.6555, locationLng: 104.0535, highlights: ['盖碗茶', '采耳', '掏耳朵'], tips: '成渝高铁都江堰→成都约 30 分钟，鹤鸣茶社可以体验成都慢生活' },
        { time: '18:00', name: '返程', nameEn: 'Departure', type: 'transport', duration: '1-2 小时', description: '前往机场或火车站。', price: '¥30-50', location: '成都双流/天府机场', locationLat: 30.5785, locationLng: 104.0655, highlights: [], tips: '成都双流机场距市区约 18 公里，天府机场较远但有地铁 18 号线' }
      ],
      tips: ['如果不想去都江堰，可以换成青城山（道教名山），但需要一整天', '成都茶馆体验推荐人民公园鹤鸣茶社或锦江剧场旁茶馆', '走之前可以买一些张飞牛肉、郫县豆瓣作为伴手礼']
    }
  ]
};

/**
 * 杭州行程数据 - 2 天休闲之旅
 * Hangzhou 2-Day Leisure Tour
 */

import type { ItineraryRoute } from './types';

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
  bestSeason: '3 月 -5 月（西湖春天最美）/ 9 月 -11 月（桂花飘香）',
  highlights: ['西湖', '灵隐寺', '龙井村', '河坊街', '宋城'],
  description: '上有天堂，下有苏杭。杭州之美在西湖，西湖之美在山水与人文的完美融合。来这里过个慢周末。',
  practicalInfo: {
    transport: '地铁 + 打车，景区内骑共享单车或租景区自行车，西湖一圈约 10 公里',
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
        { time: '08:00', name: '断桥残雪', nameEn: 'Broken Bridge', type: 'attraction', duration: '1 小时', description: '西湖标志景点，白堤起点，一年四季都是杭州最美画面。', price: '免费', location: '西湖区北山街', locationLat: 30.2585, locationLng: 120.1485, highlights: ['断桥', '白堤', '保俶塔远景'], tips: '清晨 6-7 点到断桥，可以避开人流看到本地人晨练' },
        { time: '09:30', name: '苏堤春晓', nameEn: 'Su Causeway', type: 'attraction', duration: '1.5 小时', description: '苏轼任杭州知州时修建，堤上有 6 座拱桥，春天最美。', price: '免费', location: '西湖区苏堤', locationLat: 30.2435, locationLng: 120.1335, highlights: ['苏堤六桥', '花港观鱼', '雷峰塔远景'], tips: '苏堤骑自行车比走路舒服，约 30 分钟走完' },
        { time: '11:30', name: '楼外楼', nameEn: 'Louwailou Restaurant', type: 'food', duration: '1.5 小时', description: '百年老店，杭州最著名的杭帮菜餐厅，就在西湖边上。', price: '¥150-250/人', location: '西湖区孤山路', locationLat: 30.2535, locationLng: 120.1485, highlights: ['东坡肉', '西湖醋鱼', '叫化鸡', '龙井虾仁'], tips: '楼外楼是游客餐厅，价格偏贵但位置绝佳，想省钱可以去外婆家' },
        { time: '13:30', name: '雷峰塔', nameEn: 'Leifeng Pagoda', type: 'attraction', duration: '1.5 小时', description: '西湖标志性建筑，白娘子传说所在地，登塔俯瞰西湖。', price: '¥40', location: '西湖区南山路', locationLat: 30.2335, locationLng: 120.1485, highlights: ['雷峰塔远景', '西湖全景', '白娘子传说展'], tips: '雷峰塔可以坐电梯登顶，注意防晒' },
        { time: '15:30', name: '花港观鱼', nameEn: 'Flowers and Fish View', type: 'attraction', duration: '1 小时', description: '西湖十景之一，苏堤南端，池中锦鲤成群。', price: '免费', location: '西湖区花港观鱼', locationLat: 30.2385, locationLng: 120.1335, highlights: ['红鱼池', '大草坪', '魏庐'], tips: '花港观鱼出来可以坐游船去小瀛洲（三潭印月）' },
        { time: '17:30', name: '河坊街', nameEn: 'Hefang Street', type: 'attraction', duration: '2.5 小时', description: '杭州最具烟火气的古街，清河坊历史街区，小吃手工艺品汇聚。', price: '免费', location: '上城区河坊街', locationLat: 30.2485, locationLng: 120.1685, highlights: ['胡庆余堂', '张小泉剪刀', '定胜糕', '臭豆腐'], tips: '河坊街下午 4 点后人开始多，8 点后店铺陆续关门，合理安排时间' }
      ],
      tips: ['西湖很大，建议骑共享单车绕湖，约 3-4 小时可以环湖一圈', '断桥→苏堤→花港观鱼→雷峰塔是经典路线，全程步行约 6 公里', '河坊街离西湖约 2 公里，可以骑车或步行']
    },
    {
      day: 2,
      title: '文化体验日',
      theme: '灵隐寺 · 龙井村 · 宋城',
      activities: [
        { time: '08:00', name: '灵隐寺', nameEn: 'Lingyin Temple', type: 'attraction', duration: '3 小时', description: '杭州最著名寺庙，始建于东晋，香火极旺，环境清幽。', price: '¥75 (灵隐 + 飞来峰)', location: '西湖区灵隐路', locationLat: 30.2385, locationLng: 120.1035, highlights: ['飞来峰', '灵隐寺', '永福寺', '素面'], tips: '早上 8 点前进香人少，灵隐寺素面是特色' },
        { time: '11:30', name: '龙井村', nameEn: 'Longjing Village', type: 'attraction', duration: '2.5 小时', description: '中国十大名茶龙井的产地，可以在茶农家品茶买茶。', price: '免费品茶', location: '西湖区龙井村', locationLat: 30.2235, locationLng: 120.0835, highlights: ['龙井茶园', '茶农家品茶', '十里锒铛徒步道'], tips: '从灵隐出来打车约 15 分钟，可以买一些正宗龙井带回家' },
        { time: '14:00', name: '中国茶叶博物馆', nameEn: 'China Tea Museum', type: 'attraction', duration: '1.5 小时', description: '中国唯一以茶文化为主题的国家级博物馆，了解中国茶文化。', price: '免费', location: '西湖区龙井路', locationLat: 30.2135, locationLng: 120.0735, highlights: ['茶文化展厅', '龙井茶展区', '茶艺表演'], tips: '博物馆就在龙井村旁边，可以一起参观' },
        { time: '16:00', name: '宋城', nameEn: 'Songcheng', type: 'attraction', duration: '3 小时', description: '大型宋代文化主题公园，《宋城千古情》是必看演出。', price: '¥300 (含演出)', location: '西湖区转塘镇', locationLat: 30.1535, locationLng: 120.0635, highlights: ['宋城千古情', '清明上河图', '鬼屋', '丽江古城'], tips: '《宋城千古情》是张艺谋导演的演出，值得一看，建议提前订座' },
        { time: '20:00', name: '返程/西湖音乐喷泉', nameEn: 'Return / West Lake Music Fountain', type: 'attraction', duration: '1 小时', description: '如果还有时间，晚上的西湖音乐喷泉是杭州一景。', price: '免费', location: '西湖区湖滨路', locationLat: 30.2485, locationLng: 120.1535, highlights: ['音乐喷泉', '湖滨夜景'], tips: '音乐喷泉每晚 7 点和 8 点各一场，每场 15 分钟，提前 20 分钟到' }
      ],
      tips: ['灵隐寺和龙井村可以安排在同一天，但距离市区较远', '龙井村买茶要会讲价，外地人容易被宰，可以去茶叶博物馆买更放心', '宋城在杭州西南角，如果下午不去可以换成河坊街二次深度游']
    }
  ]
};

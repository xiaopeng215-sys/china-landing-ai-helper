/**
 * 桂林行程数据 - 3 天山水之旅
 * Guilin 3-Day Landscape Tour
 */

import type { ItineraryRoute } from './types';

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
  bestSeason: '4 月 -10 月（5 月涨水期最美）',
  highlights: ['漓江竹筏', '阳朔西街', '十里画廊', '象鼻山', '龙脊梯田'],
  description: '桂林山水甲天下，乘竹筏游漓江，骑行十里画廊，住阳朔西街，看尽喀斯特地貌精华。',
  practicalInfo: {
    transport: '租电动车游阳朔，漓江竹筏是精华，桂林市区打车很便宜',
    weather: '4-10 月最佳，夏季注意防晒，5 月雨季漓江水量大',
    food: '桂林米粉、田螺酿、啤酒鱼、黄焖鸡',
    safety: '漂流/竹筏要穿救生衣，注意防晒防蚊'
  },
  dayPlans: [
    {
      day: 1,
      title: '漓江精华游',
      theme: '竹筏 · 兴坪 · 西街',
      activities: [
        { time: '08:00', name: '漓江竹筏漂流（杨堤 - 九马画山）', nameEn: 'Li River Bamboo Raft (Yangdi-Jiumahua)', type: 'attraction', duration: '3 小时', description: '漓江最精华段，20 元人民币背景图案取景地，九马画山。', price: '¥218/人', location: '阳朔县杨堤乡', locationLat: 24.9435, locationLng: 110.4535, highlights: ['九马画山', '20 元人民币背景', '杨堤风光', '浪石村'], tips: '必须早起出发，漂流约 2-3 小时，注意防晒和防水' },
        { time: '12:00', name: '兴坪古镇', nameEn: 'Xingping Ancient Town', type: 'food', duration: '1.5 小时', description: '漓江精华游终点，古镇老街上吃桂林米粉，买工艺品。', price: '¥30-50/人', location: '阳朔县兴坪镇', locationLat: 24.9235, locationLng: 110.4835, highlights: ['兴坪老街', '漓江渔火', '桂林米粉'], tips: '兴坪古镇很小，1 小时足够，可以骑车去相公山' },
        { time: '14:00', name: '阳朔十里画廊', nameEn: 'Yangshuo Ten Li Gallery', type: 'transport', duration: '3 小时', description: '骑电动车沿遇龙河畔穿行，月亮山、大榕树、蝴蝶泉。', price: '¥50-80 (租电动车)', location: '阳朔县十里画廊', locationLat: 24.7835, locationLng: 110.5035, highlights: ['月亮山', '大榕树', '遇龙河畔', '工农桥'], tips: '租电动车¥50/天，记得砍价！沿途风景很美' },
        { time: '17:30', name: '阳朔西街', nameEn: 'Yangshuo West Street', type: 'attraction', duration: '3 小时', description: '阳朔最繁华的步行街，中西结合，酒吧林立，夜生活丰富。', price: '视消费情况', location: '阳朔县城中心', locationLat: 24.7735, locationLng: 110.4935, highlights: ['西街夜景', '酒吧一条街', '手工艺品', '啤酒鱼'], tips: '啤酒鱼是阳朔招牌，¥60-80/斤，可以在西街选评分高的店' }
      ],
      tips: ['杨堤 - 九马画山竹筏漂流必须提前订，尤其是在旺季', '阳朔租电动车可以讲价到 40-50 元/天，电量不够可以换车', '西街晚上人很多，注意保管财物']
    },
    {
      day: 2,
      title: '阳朔深度日',
      theme: '相公山 · 遇龙河 · 银子岩',
      activities: [
        { time: '06:00', name: '相公山日出', nameEn: 'Xianggong Mountain Sunrise', type: 'attraction', duration: '3 小时', description: '漓江最佳日出观景点，俯瞰漓江第一湾，摄影爱好者必去。', price: '¥60', location: '阳朔县葡萄镇', locationLat: 24.9035, locationLng: 110.4535, highlights: ['漓江第一湾', '日出云海', '摄影圣地'], tips: '日出前 1 小时出发，看完日出 8 点左右下山' },
        { time: '09:30', name: '遇龙河漂流（金龙桥 - 旧县）', nameEn: 'Yulong River Drift', type: 'attraction', duration: '3 小时', description: '比漓江更安静舒适的漂流，两岸田园风光，9 个落差。', price: '¥255/人', location: '阳朔县金宝乡', locationLat: 24.8135, locationLng: 110.4735, highlights: ['金龙桥', '富里桥', '田园风光', '冲坝'], tips: '早上第一漂人少，漂流中途可以下船拍照' },
        { time: '13:00', name: '旧县午餐', nameEn: 'Jiuxian Village Lunch', type: 'food', duration: '1.5 小时', description: '旧县古村落的农家乐，啤酒鱼、黄焖鸡、新鲜蔬菜。', price: '¥60-100/人', location: '阳朔县旧县村', locationLat: 24.8035, locationLng: 110.4735, highlights: ['农家乐', '新鲜蔬菜', '土鸡'], tips: '旧县村有保存完好的明清古民居，可以顺道参观' },
        { time: '15:00', name: '银子岩', nameEn: 'Silver Cave', type: 'attraction', duration: '2 小时', description: '桂林最大最漂亮的溶洞，钟乳石在灯光下如银子般闪烁。', price: '¥65', location: '荔浦市马岭镇', locationLat: 24.8535, locationLng: 110.1435, highlights: ['混元珍珠伞', '雪山飞瀑', '神奇石柱'], tips: '银子岩在阳朔和荔浦之间，可以安排在去程或回程的路上' },
        { time: '18:00', name: '阳朔西街夜晚', nameEn: 'Yangshuo Night', type: 'attraction', duration: '3 小时', description: '第二天晚上继续西街，享受阳朔夜生活。', price: '视消费情况', location: '阳朔县城中心', locationLat: 24.7735, locationLng: 110.4935, highlights: ['西街夜景', '张艺谋印象演出', '酒吧'], tips: '如果没看过张艺谋的《印象·刘三姐》，值得一看' }
      ],
      tips: ['相公山日出要拼车或包车前往，建议找酒店前台帮忙拼车', '遇龙河漂流比漓江更休闲，两人一个竹筏，老人小孩都适合', '银子岩是溶洞，洞内恒温，夏季是避暑好去处']
    },
    {
      day: 3,
      title: '桂林市区 + 返程',
      theme: '象鼻山 · 两江四湖',
      activities: [
        { time: '09:00', name: '返回桂林市区', nameEn: 'Return to Guilin City', type: 'transport', duration: '2 小时', description: '从阳朔乘大巴或高铁返回桂林市区。', price: '¥25-40', location: '阳朔→桂林', locationLat: 25.2735, locationLng: 110.2935, highlights: [], tips: '高铁阳朔站到桂林约 40 分钟，或乘大巴约 1.5 小时' },
        { time: '11:00', name: '象鼻山', nameEn: 'Elephant Trunk Hill', type: 'attraction', duration: '2 小时', description: '桂林城徽，漓江标志性景点，因山形像一头饮水的大象而得名。', price: '¥55 (免费入园需预约)', location: '象山区象山南路', locationLat: 25.2635, locationLng: 110.2935, highlights: ['象鼻岩', '水月洞', '爱情岛'], tips: '现在免费预约入园，但名额有限，建议提前预约' },
        { time: '13:30', name: '椿记烧鹅', nameEn: 'Chunji Roast Goose', type: 'food', duration: '1.5 小时', description: '桂林最著名的粤菜馆，烧鹅是招牌，本地人推荐。', price: '¥80-120/人', location: '叠彩区中山北路', locationLat: 25.2835, locationLng: 110.2835, highlights: ['椿记烧鹅', '白切鸡', '荔浦芋扣肉'], tips: '桂林椿记有多家分店，选择离象山近的' },
        { time: '15:30', name: '两江四湖景区', nameEn: 'Two Rivers and Four Lakes', type: 'attraction', duration: '2 小时', description: '桂林市区内漓江、桃花江、杉湖、榕湖、桂湖、木龙湖的统称。', price: '¥80 (夜游船票)', location: '桂林市区', locationLat: 25.2735, locationLng: 110.2935, highlights: ['日月双塔', '玻璃桥', '古南门'], tips: '建议下午 4-5 点开始游，可以看到白天和夜景两个时段' },
        { time: '18:00', name: '返程', nameEn: 'Departure', type: 'transport', duration: '1-2 小时', description: '前往桂林两江国际机场或桂林站/北站。', price: '¥50-80', location: '桂林市区', locationLat: 25.2235, locationLng: 110.0335, highlights: [], tips: '桂林机场距市区约 28 公里，建议提前 2 小时出发' }
      ],
      tips: ['桂林美食：桂林米粉（早餐必吃）、荔浦芋扣肉、阳朔啤酒鱼', '如果还有时间，可以加一天去龙脊梯田，壮观程度超过想象', '桂林市区不大，打车很便宜，共享单车也很方便']
    }
  ]
};

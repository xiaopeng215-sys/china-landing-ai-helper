export interface EssentialStep {
  step: number;
  title: string;
  description: string;
}

export interface EssentialTip {
  icon: string;
  title: string;
  content: string;
}

export interface EmergencyNumber {
  icon: string;
  label: string;
  number: string;
  description: string;
}

export interface EmbassyEntry {
  flag: string;
  name: string;
  phone: string;
}

export interface EmbassyCity {
  city: string;
  entries: EmbassyEntry[];
}

export interface EmergencyPhrase {
  chinese: string;
  pinyin: string;
  english: string;
}

export interface EmergencyGuide {
  icon: string;
  title: string;
  steps: string[];
}

export interface EmergencySection {
  id: 'emergency';
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  nationalNumbers: EmergencyNumber[];
  embassies: EmbassyCity[];
  guides: EmergencyGuide[];
  phrases: EmergencyPhrase[];
}

export interface EssentialSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  tips: EssentialTip[];
  steps?: EssentialStep[];
}

export const ESSENTIALS_DATA: Record<string, EssentialSection> = {
  payment: {
    id: 'payment',
    title: 'Mobile Payment',
    subtitle: 'Alipay & WeChat Pay for foreigners',
    icon: '💳',
    color: 'blue',
    steps: [
      {
        step: 1,
        title: 'Download Alipay',
        description: 'Download Alipay from App Store or Google Play. Select your country/region during setup.',
      },
      {
        step: 2,
        title: 'Verify your identity',
        description: 'Tap "International" on the home screen. Enter your passport number and take a selfie for verification.',
      },
      {
        step: 3,
        title: 'Add a foreign card',
        description: 'Go to Me → Bank Cards → Add Card. Supports Visa, Mastercard, and some Amex cards issued outside China.',
      },
      {
        step: 4,
        title: 'Top up & pay',
        description: 'You can now scan QR codes at shops, restaurants, and transit. Most places accept Alipay.',
      },
      {
        step: 5,
        title: 'Set spending limit → ready to scan & pay!',
        description: 'Set a spending limit in Alipay settings for security. ⚠️ Tip: Carry ¥200–500 cash as backup — some small vendors are cash-only.',
      },
    ],
    tips: [
      {
        icon: '💡',
        title: 'WeChat Pay Alternative',
        content: 'WeChat Pay also supports foreign cards. Open WeChat → Me → Services → Wallet → Cards → Add Card.',
      },
      {
        icon: '🏦',
        title: 'Backup: Cash',
        content: 'Carry some RMB cash as backup. Exchange at airport banks or use ATMs (UnionPay network). Most ATMs accept Visa/Mastercard.',
      },
      {
        icon: '🏪',
        title: 'Backup: Hotel & Convenience Stores',
        content: 'FamilyMart, 7-Eleven, and Lawson accept international cards. Large hotels and malls often accept Visa/Mastercard directly.',
      },
      {
        icon: '⚠️',
        title: 'Common Issue',
        content: 'If card binding fails, try a different card or contact your bank to allow international transactions. Some prepaid cards are not supported.',
      },
    ],
  },

  simcard: {
    id: 'simcard',
    title: 'SIM Card',
    subtitle: 'Stay connected in China',
    icon: '📱',
    color: 'green',
    steps: [
      {
        step: 1,
        title: 'Arrive at airport',
        description: 'All major airports have China Mobile, China Unicom, and China Telecom counters in the arrivals hall.',
      },
      {
        step: 2,
        title: 'Show your passport',
        description: 'A passport is required to register a SIM card. The process takes about 5–10 minutes.',
      },
      {
        step: 3,
        title: 'Choose a plan',
        description: 'Tourist SIM cards typically offer 7–30 day plans with data + calls. Ask for an "international tourist SIM".',
      },
      {
        step: 4,
        title: 'Insert & activate',
        description: 'Insert the SIM and follow the activation SMS. You\'re online within minutes.',
      },
    ],
    tips: [
      {
        icon: '🇨🇳',
        title: 'China Unicom Tourist SIM',
        content: '¥99/30 days, 10GB data + calls. Available at airport counters and official stores. Show your passport to register.',
      },
      {
        icon: '📱',
        title: 'Airalo eSIM',
        content: '~$15/5GB, instant activation before departure. Download the Airalo app and activate your eSIM before boarding.',
      },
      {
        icon: '🌐',
        title: 'Nomad eSIM',
        content: '~$18/10GB, good China coverage. Activate instantly via the Nomad app before you arrive.',
      },
      {
        icon: '💡',
        title: 'Pro Tip: Buy eSIM BEFORE Arriving',
        content: 'Airport SIM queues can be 30+ min. Buy and activate an eSIM before departure for instant connectivity on landing.',
      },
      {
        icon: '📡',
        title: 'China Mobile',
        content: 'Best coverage nationwide, especially in rural areas. Tourist SIM: ¥50–¥100 for 7–30 days, 10–30GB data. Supports 5G.',
      },
      {
        icon: '📡',
        title: 'China Unicom',
        content: 'Good coverage in cities. Tourist SIM: ¥50–¥80 for 7–30 days. Often has better international roaming add-ons.',
      },
      {
        icon: '📡',
        title: 'China Telecom',
        content: 'Strong in southern China. Tourist SIM: ¥50–¥90 for 7–30 days. Good option if Mobile/Unicom are out of stock.',
      },
      {
        icon: '🌐',
        title: 'eSIM Option',
        content: 'Consider buying an eSIM before departure (Airalo, Nomad, etc.) for instant connectivity on arrival. Prices from ~$5/week.',
      },
      {
        icon: '⚠️',
        title: 'Note on VPN',
        content: 'Chinese SIMs do NOT bypass the Great Firewall. You still need a VPN to access Google, Instagram, etc.',
      },
    ],
  },

  vpn: {
    id: 'vpn',
    title: 'VPN & Blocked Apps',
    subtitle: 'Access your apps before you land',
    icon: '🔒',
    color: 'purple',
    steps: [
      {
        step: 1,
        title: 'Download VPN before arrival',
        description: 'VPN app stores are blocked in China. Download and set up your VPN BEFORE you board the plane.',
      },
      {
        step: 2,
        title: 'Test it works',
        description: 'Connect to a server and verify you can access Google. Test at home, not at the airport.',
      },
      {
        step: 3,
        title: 'Save offline maps',
        description: 'Download offline maps (Google Maps, Maps.me) before arrival. Apple Maps works in China without VPN.',
      },
      {
        step: 4,
        title: 'Use VPN on hotel WiFi',
        description: 'Hotel WiFi often has fewer restrictions. Connect your VPN as soon as you join any network.',
      },
    ],
    tips: [
      {
        icon: '✅',
        title: 'Recommended VPNs',
        content: 'ExpressVPN — Most reliable in China, ~$8.32/month | NordVPN — Good value, ~$3.99/month | Astrill — Optimized for China, ~$10/month | ⚠️ CRITICAL: Download & test VPN BEFORE entering China. Cannot download inside China.',
      },
      {
        icon: '🚫',
        title: 'Blocked: Google Services',
        content: 'Google Search, Gmail, Google Maps, Google Drive, YouTube, Google Translate — all blocked.',
      },
      {
        icon: '🚫',
        title: 'Blocked: Social Media',
        content: 'Facebook, Instagram, Twitter/X, Snapchat, TikTok (international version), WhatsApp (sometimes unstable).',
      },
      {
        icon: '🚫',
        title: 'Blocked: Other Services',
        content: 'Telegram, Slack (sometimes), Dropbox, many news sites (NYT, BBC, etc.), and most VPN provider websites.',
      },
      {
        icon: '✅',
        title: 'Works Without VPN',
        content: 'WeChat, Alipay, Baidu Maps, Didi (ride-hailing), Meituan (food delivery), Apple Maps, iMessage, LINE.',
      },
    ],
  },

  // emergency is handled separately via EMERGENCY_DATA
  // kept as stub for type compatibility
  emergency: {
    id: 'emergency',
    title: 'Emergency',
    subtitle: 'SOS & Critical Contacts',
    icon: '🆘',
    color: 'red',
    tips: [],
  } as EssentialSection,
};

export type EssentialsTab = 'payment' | 'simcard' | 'vpn' | 'emergency';

export const ESSENTIALS_TABS: { id: EssentialsTab; label: string; icon: string }[] = [
  { id: 'payment', label: 'Payment', icon: '💳' },
  { id: 'simcard', label: 'SIM Card', icon: '📱' },
  { id: 'vpn', label: 'VPN', icon: '🔒' },
  { id: 'emergency', label: 'Emergency', icon: '🆘' },
];

export const EMERGENCY_DATA: EmergencySection = {
  id: 'emergency',
  title: 'Emergency',
  subtitle: 'SOS & Critical Contacts',
  icon: '🆘',
  color: 'red',
  nationalNumbers: [
    { icon: '🚔', label: 'Police', number: '110', description: 'Theft, assault, accidents. Say "English please" if needed.' },
    { icon: '🚑', label: 'Ambulance', number: '120', description: 'Medical emergencies. Also Poison Control.' },
    { icon: '🚒', label: 'Fire', number: '119', description: 'Fire & rescue. State your address clearly.' },
    { icon: '🚗', label: 'Traffic Accident', number: '122', description: 'Road accidents & traffic police.' },
    { icon: '📞', label: 'Tourist Hotline', number: '12301', description: '24/7 English service. Scams, complaints, assistance.' },
    { icon: '⛑️', label: 'Search & Rescue', number: '12395', description: 'Mountain, water, wilderness rescue.' },
  ],
  embassies: [
    {
      city: 'Beijing',
      entries: [
        { flag: '🇺🇸', name: 'US Embassy', phone: '+86-10-8531-3000' },
        { flag: '🇬🇧', name: 'UK Embassy', phone: '+86-10-5192-4000' },
        { flag: '🇦🇺', name: 'Australian Embassy', phone: '+86-10-5140-4111' },
        { flag: '🇨🇦', name: 'Canadian Embassy', phone: '+86-10-5139-4000' },
        { flag: '🇩🇪', name: 'German Embassy', phone: '+86-10-8532-9000' },
        { flag: '🇫🇷', name: 'French Embassy', phone: '+86-10-8531-2000' },
        { flag: '🇯🇵', name: 'Japanese Embassy', phone: '+86-10-6532-2361' },
        { flag: '🇰🇷', name: 'Korean Embassy', phone: '+86-10-8531-0700' },
      ],
    },
    {
      city: 'Shanghai',
      entries: [
        { flag: '🇺🇸', name: 'US Consulate', phone: '+86-21-8011-2000' },
        { flag: '🇬🇧', name: 'UK Consulate', phone: '+86-21-3279-2000' },
        { flag: '🇦🇺', name: 'Australian Consulate', phone: '+86-21-2215-5200' },
        { flag: '🇯🇵', name: 'Japanese Consulate', phone: '+86-21-5257-4766' },
        { flag: '🇰🇷', name: 'Korean Consulate', phone: '+86-21-6295-5000' },
      ],
    },
    {
      city: 'Guangzhou',
      entries: [
        { flag: '🇺🇸', name: 'US Consulate', phone: '+86-20-3814-5000' },
        { flag: '🇦🇺', name: 'Australian Consulate', phone: '+86-20-3814-0111' },
        { flag: '🇯🇵', name: 'Japanese Consulate', phone: '+86-20-8334-3009' },
      ],
    },
    {
      city: 'Chengdu',
      entries: [
        { flag: '🇺🇸', name: 'US Consulate', phone: '+86-28-8558-3992' },
        { flag: '🇩🇪', name: 'German Consulate', phone: '+86-28-8528-0800' },
      ],
    },
  ],
  guides: [
    {
      icon: '🚔',
      title: 'How to Call Police (110)',
      steps: [
        'Dial 110 — available 24/7 nationwide.',
        'Say "English please" — some operators can assist or transfer.',
        'State your location first (street name, landmark, hotel name).',
        'If you can\'t speak, send an SMS to 110 in some cities.',
        'Stay on the line until help arrives.',
      ],
    },
    {
      icon: '🚑',
      title: 'How to Call an Ambulance (120)',
      steps: [
        'Dial 120 immediately.',
        'Give your exact address — use a nearby landmark if unsure.',
        'Describe the emergency briefly (chest pain, unconscious, etc.).',
        'Send someone to the street to guide the ambulance.',
        'Keep the patient still and warm while waiting.',
      ],
    },
    {
      icon: '🏛️',
      title: 'How to Contact Your Embassy',
      steps: [
        'Call the embassy number for your country (see list below).',
        'For passport loss: report to police (110) first, get a report number.',
        'For detention: you have the right to contact your embassy — insist on it.',
        'For medical emergency: embassy can provide a list of English-speaking doctors.',
        'After hours: most embassies have a 24/7 duty officer — press 0 or follow prompts.',
      ],
    },
  ],
  phrases: [
    { chinese: '救命！', pinyin: 'Jiù mìng!', english: 'Help! / Save me!' },
    { chinese: '报警！', pinyin: 'Bào jǐng!', english: 'Call the police!' },
    { chinese: '叫救护车！', pinyin: 'Jiào jiùhùchē!', english: 'Call an ambulance!' },
    { chinese: '我需要医生。', pinyin: 'Wǒ xūyào yīshēng.', english: 'I need a doctor.' },
    { chinese: '我迷路了。', pinyin: 'Wǒ mílù le.', english: 'I am lost.' },
    { chinese: '我的护照丢了。', pinyin: 'Wǒ de hùzhào diū le.', english: 'My passport is lost.' },
    { chinese: '请说英语。', pinyin: 'Qǐng shuō Yīngyǔ.', english: 'Please speak English.' },
    { chinese: '这里是哪里？', pinyin: 'Zhèlǐ shì nǎlǐ?', english: 'Where is this place?' },
  ],
};

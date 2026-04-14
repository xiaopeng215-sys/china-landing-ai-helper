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
        content: 'ExpressVPN, NordVPN, Astrill, and Surfshark have good track records in China. Astrill is often most reliable. Prices: $5–$15/month.',
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

  emergency: {
    id: 'emergency',
    title: 'Emergency',
    subtitle: 'Critical numbers & contacts',
    icon: '🆘',
    color: 'red',
    tips: [
      {
        icon: '🚔',
        title: '110 — Police',
        content: 'Call 110 for police emergencies: theft, assault, accidents. Some operators speak basic English. Stay calm and state your location.',
      },
      {
        icon: '🚑',
        title: '120 — Ambulance',
        content: 'Call 120 for medical emergencies. Response time varies by city. In major cities, some hospitals have English-speaking staff.',
      },
      {
        icon: '🚒',
        title: '119 — Fire',
        content: 'Call 119 for fire emergencies. Also handles some rescue situations. State your address clearly.',
      },
      {
        icon: '✈️',
        title: '12301 — Tourism Hotline',
        content: 'Call 12301 for tourist complaints, scams, or assistance. Available 24/7. English service available.',
      },
      {
        icon: '🏥',
        title: 'Hospitals with English Service',
        content: 'Beijing: Peking Union Medical College Hospital (+86-10-6915-6114). Shanghai: Huashan Hospital International (+86-21-5288-9999). Ask for the "international department".',
      },
      {
        icon: '🏛️',
        title: 'US Embassy & Consulates',
        content: 'Beijing Embassy: +86-10-8531-4000. Shanghai Consulate: +86-21-8011-2000. For emergencies after hours, press 0 for duty officer.',
      },
      {
        icon: '🇬🇧',
        title: 'UK Embassy & Consulates',
        content: 'Beijing Embassy: +86-10-5192-4000. Shanghai Consulate: +86-21-3279-2000. Emergency: +86-10-5192-4000.',
      },
      {
        icon: '🇪🇺',
        title: 'Other Embassies',
        content: 'Search "[your country] embassy Beijing" for contact info. Save the number before you travel. Most embassies have 24/7 emergency lines.',
      },
      {
        icon: '📋',
        title: 'Travel Insurance',
        content: 'Always carry your insurance card and policy number. Most Chinese hospitals require upfront payment — keep receipts for reimbursement.',
      },
    ],
  },
};

export type EssentialsTab = 'payment' | 'simcard' | 'vpn' | 'emergency';

export const ESSENTIALS_TABS: { id: EssentialsTab; label: string; icon: string }[] = [
  { id: 'payment', label: 'Payment', icon: '💳' },
  { id: 'simcard', label: 'SIM Card', icon: '📱' },
  { id: 'vpn', label: 'VPN', icon: '🔒' },
  { id: 'emergency', label: 'Emergency', icon: '🆘' },
];

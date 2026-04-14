export interface TimelineStep {
  id: string;
  title: string;
  duration: string;
  icon: string;
  steps: string[];
  tips: string[];
}

export const timelineSteps: TimelineStep[] = [
  {
    id: "sim-card",
    title: "Buy SIM Card",
    duration: "10-15 min",
    icon: "📱",
    steps: [
      "Head to the airport telecom counter (China Unicom, China Mobile, or China Telecom)",
      "Show your passport — it's required for SIM registration",
      "Choose a 30-day data plan (50–100 RMB, ~30GB data)",
      "Ask staff to help activate and insert the SIM",
      "Test your connection before leaving the counter",
    ],
    tips: [
      "China Unicom tends to have the most English-speaking staff",
      "Get at least 20GB — maps and translation apps eat data fast",
      "Keep your original SIM in a safe place (the small envelope they give you)",
      "Counters are usually in the arrivals hall, before customs exit",
    ],
  },
  {
    id: "vpn",
    title: "Set Up VPN",
    duration: "5-10 min",
    icon: "🔒",
    steps: [
      "⚠️ Ideally download your VPN BEFORE arriving in China",
      "If not done yet, connect to airport WiFi and download ExpressVPN or NordVPN",
      "Open the app and connect to a server (Hong Kong or Singapore work well)",
      "Test by opening Google or Instagram",
      "Keep the VPN running whenever you need Google, WhatsApp, or Instagram",
    ],
    tips: [
      "Download the VPN app BEFORE you land — the App Store is blocked in China",
      "ExpressVPN and NordVPN are the most reliable options in China",
      "Free VPNs rarely work — invest in a paid one before your trip",
      "VPN is legal for tourists to use in China",
      "If VPN drops, switch server locations and reconnect",
    ],
  },
  {
    id: "mobile-payment",
    title: "Set Up Mobile Payment",
    duration: "15-20 min",
    icon: "💳",
    steps: [
      "Download Alipay (支付宝) — it's the most widely accepted",
      "Open Alipay and tap 'International' or sign up with your phone number",
      "Add your foreign Visa or Mastercard credit card",
      "Verify your identity with your passport number",
      "Test with a small transaction (e.g., buy a bottle of water)",
    ],
    tips: [
      "Alipay International version works without a Chinese bank account",
      "WeChat Pay also works — link your foreign card in the Wallet section",
      "Most places in China are cashless — this step is critical",
      "Some older markets still prefer cash; keep 200–300 RMB as backup",
      "If card linking fails, try a different card or contact your bank to allow international transactions",
    ],
  },
  {
    id: "didi",
    title: "Download Didi",
    duration: "5 min",
    icon: "🚗",
    steps: [
      "Download the Didi app (DiDi - Ride Hailing App) from the App Store",
      "Sign up with your phone number (your new SIM works great here)",
      "Add your payment method (Alipay or foreign credit card)",
      "Enter your destination — the app supports English",
      "Your driver's location and ETA will show on the map",
    ],
    tips: [
      "Didi is China's Uber — reliable, safe, and widely available",
      "The app has an English interface — no Chinese needed",
      "Show the driver your destination on the map if there's a language barrier",
      "Didi Express is the standard option; Didi Premier is more comfortable",
      "Prices are fixed — no haggling needed unlike some taxis",
    ],
  },
  {
    id: "hotel-checkin",
    title: "Hotel Check-in",
    duration: "10-15 min",
    icon: "🏨",
    steps: [
      "Have your passport ready — Chinese hotels are required to scan it",
      "Confirm your booking reference (screenshot it in case of no internet)",
      "Ask for a hotel card with the address in Chinese — useful for showing taxi/Didi drivers",
      "Check if breakfast is included and what time it starts",
      "Ask the front desk about the nearest convenience store and subway station",
    ],
    tips: [
      "All hotels in China must register foreign guests with the police — this is normal",
      "If you booked on a foreign site (Booking.com), have the confirmation email ready",
      "Ask for a hotel business card — it has the address in Chinese for getting back",
      "Most international hotels have English-speaking staff",
      "Check if the hotel has a VPN-friendly WiFi policy",
    ],
  },
  {
    id: "find-food",
    title: "Find Food Nearby",
    duration: "Ongoing",
    icon: "🍜",
    steps: [
      "Step outside and look for any restaurant with photos on the menu — easy to order",
      "Use Didi Food (in the Didi app) for delivery to your hotel",
      "Convenience stores (7-Eleven, FamilyMart, Lawson) have hot food and snacks",
      "Look for 'set meal' (套餐, tào cān) signs — usually good value",
      "Use Google Translate camera mode to read Chinese menus",
    ],
    tips: [
      "Street food is generally safe and delicious — don't be afraid to try it",
      "Noodle shops (面馆) and dumpling places (饺子馆) are cheap and filling",
      "Point at what other people are eating if you can't read the menu",
      "Most restaurants accept Alipay — just show the QR code",
      "Lunch sets (11am–2pm) are often 30–50% cheaper than dinner",
    ],
  },
];

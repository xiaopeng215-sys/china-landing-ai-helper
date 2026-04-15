// Emergency contacts data for TravelerLocal.ai
// Full emergency data (including embassies, guides, phrases) lives in src/data/essentials.ts
// This file provides the simplified contact list as specified in P3 requirements.

export const emergencyContacts = [
  { name: "Police", number: "110", icon: "🚔", description: "Crime, theft, accidents" },
  { name: "Fire", number: "119", icon: "🚒", description: "Fire emergencies" },
  { name: "Ambulance", number: "120", icon: "🚑", description: "Medical emergencies" },
  { name: "Traffic Police", number: "122", icon: "🚦", description: "Traffic accidents" },
  { name: "Tourist Hotline", number: "12301", icon: "ℹ️", description: "Tourism complaints & help" },
  { name: "US Embassy Beijing", number: "+86-10-8531-4000", icon: "🇺🇸", description: "American citizens" },
  { name: "UK Embassy Beijing", number: "+86-10-5192-4000", icon: "🇬🇧", description: "British citizens" },
];

export type EmergencyContact = typeof emergencyContacts[number];

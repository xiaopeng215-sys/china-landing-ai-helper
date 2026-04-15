'use client';

import React from 'react';
import { emergencyContacts, type EmergencyContact } from '@/data/emergency-contacts';

function ContactCard({ contact }: { contact: EmergencyContact }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-2xl flex-shrink-0">{contact.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{contact.name}</p>
        <p className="text-xs text-gray-500 truncate">{contact.description}</p>
      </div>
      <a
        href={`tel:${contact.number}`}
        className="flex-shrink-0 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
      >
        {contact.number}
      </a>
    </div>
  );
}

export default function EmergencyContacts() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
      <div className="px-4 py-3 bg-red-600 flex items-center gap-2">
        <span className="text-lg">🆘</span>
        <h2 className="text-sm font-bold text-white">Emergency Contacts</h2>
        <span className="text-red-200 text-xs ml-auto">Tap number to call</span>
      </div>
      <div className="divide-y divide-gray-100">
        {emergencyContacts.map((contact) => (
          <ContactCard key={contact.number} contact={contact} />
        ))}
      </div>
    </div>
  );
}

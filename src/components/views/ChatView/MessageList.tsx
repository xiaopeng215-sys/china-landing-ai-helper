'use client';

import React from 'react';
import { ExternalLink, MapPin, Star, Camera, Plane, Train } from 'lucide-react';
import type { Message, Recommendation, Action, ChatImage } from './types';
import { useClientI18n } from '@/lib/i18n/client';

interface TransportCardData {
  type: 'flight' | 'train';
  from: string;
  to: string;
  date: string;
  link: string;
}

function parseTransportCard(content: string): { text: string; card: TransportCardData | null } {
  const match = content.match(/\[TRANSPORT_CARD\](.*?)\[\/TRANSPORT_CARD\]/s);
  if (!match) return { text: content, card: null };
  try {
    const card = JSON.parse(match[1]) as TransportCardData;
    const text = content.replace(/\[TRANSPORT_CARD\].*?\[\/TRANSPORT_CARD\]/s, '').trim();
    return { text, card };
  } catch {
    return { text: content, card: null };
  }
}

function TransportBookingCard({ card }: { card: TransportCardData }) {
  const isFlights = card.type === 'flight';
  const url = new URL(card.link);
  if (card.from) url.searchParams.set(isFlights ? 'dcity' : 'from', card.from);
  if (card.to) url.searchParams.set(isFlights ? 'acity' : 'to', card.to);
  if (card.date) url.searchParams.set(isFlights ? 'ddate' : 'date', card.date);

  return (
    <div className={`mt-3 rounded-xl border p-3 ${
      isFlights ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {isFlights
          ? <Plane className="w-4 h-4 text-orange-500" />
          : <Train className="w-4 h-4 text-blue-500" />}
        <span className={`text-xs font-semibold ${
          isFlights ? 'text-orange-700' : 'text-blue-700'
        }`}>
          {isFlights ? 'Flight Search' : 'Train Search'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-[#484848] mb-1">
        <span>{card.from}</span>
        <span className="text-[#767676]">→</span>
        <span>{card.to}</span>
        {card.date && (
          <span className="text-xs text-[#767676] ml-auto">{card.date}</span>
        )}
      </div>
      <a
        href={url.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-xs font-semibold transition-colors ${
          isFlights
            ? 'bg-orange-500 hover:bg-orange-600'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Search Now on Trip.com
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  const { t, locale } = useClientI18n();

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <div className="text-6xl mb-4">💬</div>
          <p className="text-[#767676]">{t('ChatViewPage.startConversation')}</p>
          <p className="text-sm text-[#767676] mt-2">{t('ChatViewPage.askAnything')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white'
                : 'bg-white text-[#484848] shadow-md border border-gray-100'
            }`}
          >
            {/* 文本内容 + Transport Card 解析 */}
            {(() => {
              const { text, card } = parseTransportCard(message.content);
              return (
                <>
                  <p className="text-sm whitespace-pre-wrap">{text}</p>
                  {card && <TransportBookingCard card={card} />}
                </>
              );
            })()}
            
            {/* 图片卡片 */}
            {message.images && message.images.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.images.map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={img.url} 
                      alt={img.caption}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    {img.caption && (
                      <p className="text-xs p-2 bg-gray-50 text-[#767676]">{img.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* 推荐卡片 */}
            {message.recommendations && message.recommendations.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.recommendations.map((rec, idx) => (
                  <RecommendationCard key={idx} recommendation={rec} />
                ))}
              </div>
            )}
            
            {/* 操作按钮 */}
            {message.actions && message.actions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.actions.map((action, idx) => (
                  <ActionButton key={idx} action={action} />
                ))}
              </div>
            )}
            
            {/* 时间戳 */}
            <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-[#767676]'}`}>
              {typeof message.timestamp === 'string' 
                ? new Date(message.timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
                : message.timestamp.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
              }
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const typeIcons = {
    attraction: '🎯',
    restaurant: '🍜',
    hotel: '🏨',
    transport: '🚇',
  };

  const typeColors = {
    attraction: 'bg-orange-50 border-orange-200',
    restaurant: 'bg-orange-50 border-orange-200',
    hotel: 'bg-purple-50 border-purple-200',
    transport: 'bg-green-50 border-green-200',
  };

  return (
    <div className={`p-3 rounded-lg border ${typeColors[recommendation.type]}`}>
      <div className="flex items-start gap-2">
        <span className="text-xl">{typeIcons[recommendation.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-[#484848]">{recommendation.name}</h4>
            {recommendation.nameEn && (
              <span className="text-xs text-[#767676]">{recommendation.nameEn}</span>
            )}
          </div>
          {recommendation.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-[#767676]" />
              <span className="text-xs text-[#767676]">{recommendation.location}</span>
            </div>
          )}
          {recommendation.price && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs font-medium text-[#ff5a5f]">{recommendation.price}</span>
            </div>
          )}
          <p className="text-xs text-[#767676] mt-2">{recommendation.reason}</p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ action }: { action: Action }) {
  const providerIcons = {
    klook: '🎫',
    trip: '🏨',
    amap: '🗺️',
    didi: '🚕',
    meituan: '🍽️',
  };

  return (
    <a
      href={action.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-3 py-2 bg-[#ff5a5f] text-white text-xs font-medium rounded-lg hover:bg-[#ff3b3f] transition-colors"
    >
      <span>{providerIcons[action.provider]}</span>
      <span>{action.text}</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}

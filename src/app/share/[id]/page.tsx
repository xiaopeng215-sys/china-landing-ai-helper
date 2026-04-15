import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allItineraries } from '@/lib/itineraries';
import SharePageClient from './SharePageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.travelerlocal.ai';

// City cover images from Unsplash (free, no auth required)
const CITY_IMAGES: Record<string, string> = {
  Shanghai: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=1200&h=630&fit=crop',
  Beijing: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&h=630&fit=crop',
  "Xi'an": 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&h=630&fit=crop',
  Chengdu: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=1200&h=630&fit=crop',
  Guilin: 'https://images.unsplash.com/photo-1537531383496-f4748f8c9f7e?w=1200&h=630&fit=crop',
  Hangzhou: 'https://images.unsplash.com/photo-1591543620767-582b2e76369e?w=1200&h=630&fit=crop',
};
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&h=630&fit=crop';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const trip = allItineraries.find((t) => t.id === id);
  if (!trip) return { title: 'Itinerary Not Found' };

  const title = `${trip.titleEn ?? trip.title} | TravelerLocal.ai`;
  const description = trip.descriptionEn ?? trip.description;
  const imageUrl = CITY_IMAGES[trip.cityEn] ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/share/${id}`,
      siteName: 'TravelerLocal.ai',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  return allItineraries.map((t) => ({ id: t.id }));
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const trip = allItineraries.find((t) => t.id === id);
  if (!trip) notFound();

  return <SharePageClient trip={trip} />;
}

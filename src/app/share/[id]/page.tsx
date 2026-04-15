import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allItineraries } from '@/lib/itineraries';
import SharePageClient from './SharePageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.travelerlocal.ai';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const trip = allItineraries.find((t) => t.id === id);
  if (!trip) return { title: 'Itinerary Not Found' };

  const title = `${trip.titleEn ?? trip.title} | TravelerLocal.ai`;
  const description = trip.descriptionEn ?? trip.description;
  const imageUrl = `${SITE_URL}/og/share/${id}.png`;

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

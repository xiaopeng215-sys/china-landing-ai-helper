'use client';

import { useEffect, useRef } from 'react';
import type { MapPoint } from '@/lib/map/offline-data';
import { TYPE_COLORS } from '@/lib/map/offline-data';

interface TravelMapProps {
  points: MapPoint[];
  center: [number, number];
  zoom?: number;
  onPointClick?: (point: MapPoint) => void;
  selectedPointId?: string;
}

export default function TravelMap({
  points,
  center,
  zoom = 13,
  onPointClick,
  selectedPointId,
}: TravelMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet (SSR-safe)
    import('leaflet').then((L) => {
      // Fix default icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: false,
        // Mobile touch optimizations
        tap: true,
        tapTolerance: 15,
        touchZoom: true,
        bounceAtZoomLimits: false,
      });

      // OpenStreetMap tiles — works offline once cached by SW
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Attribution (compact)
      L.control.attribution({ prefix: '© OSM' }).addTo(map);

      mapInstanceRef.current = map;

      // Add markers
      addMarkers(L, map, points, onPointClick, selectedPointId);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center/zoom when city changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(center, zoom, { animate: true });
  }, [center, zoom]);

  // Re-render markers when points or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      addMarkers(L, mapInstanceRef.current, points, onPointClick, selectedPointId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, selectedPointId]);

  function addMarkers(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: any,
    pts: MapPoint[],
    onClick?: (p: MapPoint) => void,
    activeId?: string,
  ) {
    pts.forEach((point) => {
      const isSelected = point.id === activeId;
      const color = TYPE_COLORS[point.type];
      const size = isSelected ? 36 : 28;

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:${size}px;height:${size}px;
          background:${color};
          border:3px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.8)'};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
          transition:all 0.2s;
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });

      const marker = L.marker([point.lat, point.lng], { icon })
        .addTo(map)
        .bindTooltip(point.nameEn, {
          permanent: false,
          direction: 'top',
          offset: [0, -size],
          className: 'leaflet-tooltip-custom',
        });

      if (onClick) {
        marker.on('click', () => onClick(point));
      }

      markersRef.current.push(marker);
    });
  }

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <style>{`
        .leaflet-tooltip-custom {
          background: rgba(0,0,0,0.75);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          padding: 4px 8px;
          white-space: nowrap;
        }
        .leaflet-tooltip-custom::before { display: none; }
      `}</style>
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '300px' }}
        aria-label="Interactive travel map"
      />
    </>
  );
}

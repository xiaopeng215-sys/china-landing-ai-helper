'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { CITIES, MAP_POINTS, TYPE_LABELS } from '@/lib/map/offline-data';
import type { MapPoint } from '@/lib/map/offline-data';

// SSR-safe: Leaflet requires browser APIs
const TravelMap = dynamic(() => import('@/components/map/TravelMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Loading map…</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [activeCityId, setActiveCityId] = useState('beijing');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const city = useMemo(
    () => CITIES.find((c) => c.id === activeCityId)!,
    [activeCityId],
  );

  const cityPoints = useMemo(
    () => MAP_POINTS.filter((p) => p.city === activeCityId),
    [activeCityId],
  );

  function handlePointClick(point: MapPoint) {
    setSelectedPoint(point);
    setDrawerOpen(true);
  }

  function handleCityChange(cityId: string) {
    setActiveCityId(cityId);
    setSelectedPoint(null);
    setDrawerOpen(false);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex-none bg-white border-b border-gray-200 px-4 pt-safe-top">
        <div className="flex items-center justify-between py-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Offline Map</h1>
            <p className="text-xs text-teal-600 font-medium flex items-center gap-1">
              <span>✅</span> Map works offline!
            </p>
          </div>
          <span className="text-2xl">🗺️</span>
        </div>

        {/* City selector */}
        <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
          {CITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCityChange(c.id)}
              className={`flex-none px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCityId === c.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map — fills remaining space */}
      <div className="flex-1 relative">
        <TravelMap
          points={cityPoints}
          center={[city.lat, city.lng]}
          zoom={13}
          onPointClick={handlePointClick}
          selectedPointId={selectedPoint?.id}
        />

        {/* Point count badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600 shadow-sm pointer-events-none">
          {cityPoints.length} spots
        </div>
      </div>

      {/* Bottom drawer — point detail */}
      <div
        className={`flex-none bg-white border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          drawerOpen && selectedPoint ? 'max-h-64' : 'max-h-0'
        }`}
      >
        {selectedPoint && (
          <div className="px-4 py-4 pb-safe-bottom">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {TYPE_LABELS[selectedPoint.type]}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-gray-900 truncate">
                  {selectedPoint.nameEn}
                </h2>
                <p className="text-sm text-gray-500">{selectedPoint.name}</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="ml-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 flex-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {selectedPoint.description}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
              <span>📍</span>
              <span>
                {selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Spacer for bottom nav */}
      <div className="flex-none h-16" />
    </div>
  );
}

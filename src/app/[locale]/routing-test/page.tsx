'use client';

import * as React from 'react';
import { useState } from 'react';
import destinationsData from '@/data/destinations.json';
import { Destination } from '@/types/destination';
import { DailyRoute } from '@/types/itinerary';
import { planRegionDays, INTENSITY_CONSTRAINTS } from '@/lib/daily-router';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { haversineDistance } from '@/lib/distance';

export default function RoutingTestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const { destinations } = destinationsData as { destinations: Destination[] };
  
  const [selectedRegion, setSelectedRegion] = useState<string>('sharqiya');
  const [daysInRegion, setDaysInRegion] = useState<number>(2);
  const [intensity, setIntensity] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');
  const [month, setMonth] = useState<number>(3);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['nature', 'culture']);
  
  // Filter destinations by region
  const regionDestinations = destinations.filter(d => d.region.en === selectedRegion);
  
  // Region center coordinates (approximate)
  const regionCenters: Record<string, { lat: number; lng: number }> = {
    muscat: { lat: 23.5880, lng: 58.3829 },
    dakhiliya: { lat: 22.9333, lng: 57.5333 },
    sharqiya: { lat: 22.5667, lng: 59.0289 },
    dhofar: { lat: 17.0500, lng: 54.1000 },
    batinah: { lat: 23.8000, lng: 57.5000 },
    dhahira: { lat: 23.5000, lng: 56.5000 }
  };
  
  // Plan routes
  const dailyRoutes = planRegionDays(
    regionDestinations,
    daysInRegion,
    regionCenters[selectedRegion] || regionCenters.muscat,
    selectedCategories,
    month,
    intensity
  );
  
  const constraints = INTENSITY_CONSTRAINTS[intensity];
  
  const allCategories = ['mountain', 'beach', 'culture', 'desert', 'nature', 'food'];
  
  return (
    <main className="min-h-screen bg-zinc-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href={`/${locale}`} className="text-2xl font-bold text-oman-green">🇴🇲 Visit Oman</a>
            </div>
            <div className="flex items-center gap-4">
              <a href={`/${locale}`} className="text-gray-700 hover:text-oman-green">Home</a>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">🚗 Daily Routing Test</h1>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Region Select */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-medium mb-2">Region</label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {Object.keys(regionCenters).map(region => (
                <option key={region} value={region}>
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Days in Region */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-medium mb-2">Days in Region</label>
            <input
              type="range"
              min="1"
              max="4"
              value={daysInRegion}
              onChange={(e) => setDaysInRegion(parseInt(e.target.value))}
              className="w-full accent-oman-green"
            />
            <div className="text-center mt-2">
              <span className="text-lg font-bold text-oman-green">{daysInRegion} days</span>
            </div>
          </div>
          
          {/* Intensity */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-medium mb-2">Travel Intensity</label>
            <div className="grid grid-cols-3 gap-2">
              {(['relaxed', 'balanced', 'packed'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setIntensity(opt)}
                  className={`py-2 px-1 rounded text-sm ${
                    intensity === opt
                      ? 'bg-oman-green text-black font-medium'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Month */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-medium mb-2">Month</label>
            <select 
              className="w-full p-2 border rounded"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>
                  {new Date(2024, m-1).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          
          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md p-4 md:col-span-2">
            <label className="block text-sm font-medium mb-2">Interests</label>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    if (selectedCategories.includes(cat)) {
                      setSelectedCategories(selectedCategories.filter(c => c !== cat));
                    } else {
                      setSelectedCategories([...selectedCategories, cat]);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(cat)
                      ? 'bg-oman-green text-black font-medium'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Constraints Display */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <h3 className="font-semibold mb-2">Active Constraints</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>Max stops/day: <span className="font-bold">{constraints.maxStops}</span></div>
            <div>Max hours/day: <span className="font-bold">{constraints.maxDailyHours}h</span></div>
            <div>Min break: <span className="font-bold">{constraints.minBreakMinutes}min</span></div>
            <div>Max distance: <span className="font-bold">250km</span></div>
          </div>
        </div>
        
        {/* Results */}
        <div className="space-y-6">
          {dailyRoutes.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              No valid routes found. Try adjusting constraints or selecting different categories.
            </div>
          ) : (
            dailyRoutes.map((route, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-oman-green/10 p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    Day {route.day} in {route.region.charAt(0).toUpperCase() + route.region.slice(1)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {route.stops.length} stops • {route.totalDistance.toFixed(1)} km total • 
                    {Math.floor(route.totalDuration / 60)}h {route.totalDuration % 60}m
                  </p>
                </div>
                
                <div className="p-4">
                  {route.stops.map((stop, idx) => (
                    <div key={idx} className="flex items-start gap-4 py-3 border-b last:border-0">
                      <div className="w-8 h-8 bg-oman-green/20 rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {locale === 'en' ? stop.destinationName.en : stop.destinationName.ar}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stop.arrivalTime} - {stop.departureTime} ({stop.duration} min)
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Category: {stop.category} • Cost: {stop.cost} OMR
                        </div>
                      </div>
                      {idx < route.stops.length - 1 && (
                        <div className="text-xs text-gray-400">
                          Travel: {haversineDistance(
                            stop.location,
                            route.stops[idx + 1].location
                          ).toFixed(1)} km
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Rhythm validation */}
                  <div className="mt-4 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      validateStopRhythm(route.stops) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {validateStopRhythm(route.stops) 
                        ? '✓ Valid stop rhythm' 
                        : '✗ Invalid rhythm (long stops adjacent)'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Test Cases */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setSelectedRegion('sharqiya');
              setDaysInRegion(2);
              setIntensity('relaxed');
              setSelectedCategories(['beach', 'nature']);
            }}
            className="p-3 border rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium">Relaxed Beach Tour</div>
            <div className="text-sm">Sharqiya • 2 days • 3 stops/day</div>
          </button>
          
          <button
            onClick={() => {
              setSelectedRegion('dakhiliya');
              setDaysInRegion(2);
              setIntensity('packed');
              setSelectedCategories(['culture', 'mountain']);
            }}
            className="p-3 border rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium">Packed Mountain Adventure</div>
            <div className="text-sm">Dakhiliya • 2 days • 5 stops/day</div>
          </button>
          
          <button
            onClick={() => {
              setSelectedRegion('muscat');
              setDaysInRegion(1);
              setIntensity('balanced');
              setSelectedCategories(['culture', 'food']);
            }}
            className="p-3 border rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium">Muscat City Tour</div>
            <div className="text-sm">1 day • 4 stops</div>
          </button>
        </div>
      </div>
    </main>
  );
}

// Helper function to validate stop rhythm (add at bottom)
function validateStopRhythm(stops: any[]): boolean {
  for (let i = 0; i < stops.length - 1; i++) {
    const currentLong = stops[i].duration > 90;
    const nextLong = stops[i + 1].duration > 90;
    if (currentLong && nextLong) return false;
  }
  return true;
}
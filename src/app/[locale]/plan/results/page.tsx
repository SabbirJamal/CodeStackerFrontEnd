'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import destinationsData from '@/data/destinations.json';
import { Destination } from '@/types/destination';
import { UserPreferences, Itinerary, DailyRoute } from '@/types/itinerary';
import { generateItinerary, getStopExplanation, isOverBudget, getCostSavingSuggestions } from '@/lib/itinerary-generator';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import dynamic from 'next/dynamic';

// Dynamically import map (client-side only)
const ItineraryMap = dynamic(() => import('@/components/ItineraryMap'), { ssr: false });

export default function ResultsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const router = useRouter();
  const { destinations } = destinationsData as { destinations: Destination[] };
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure DOM is ready for map
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Load preferences from sessionStorage
    const savedPrefs = sessionStorage.getItem('itinerary-preferences');
    
    if (!savedPrefs) {
      router.push(`/${locale}/plan`);
      return;
    }
    
    try {
      const preferences: UserPreferences = JSON.parse(savedPrefs);
      
      // Generate itinerary
      const newItinerary = generateItinerary(destinations, preferences);
      setItinerary(newItinerary);
      
      // Save to localStorage for persistence
      localStorage.setItem('last-itinerary', JSON.stringify(newItinerary));
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
    } finally {
      setLoading(false);
    }
  }, [destinations, locale, router]);
  
  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🕒</div>
          <h2 className="text-xl font-semibold">Generating your perfect itinerary...</h2>
        </div>
      </main>
    );
  }
  
  if (!itinerary) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No itinerary found</h2>
          <button
            onClick={() => router.push(`/${locale}/plan`)}
            className="bg-oman-green text-black px-6 py-2 rounded-lg"
          >
            Start Over
          </button>
        </div>
      </main>
    );
  }
  
  // Safe access to current day route
  const currentDayRoute = itinerary.dailyItineraries.find(d => d.day === selectedDay);
  const overBudget = isOverBudget(itinerary.totalCost.total, itinerary.preferences.budget, itinerary.preferences.duration);
  const suggestions = getCostSavingSuggestions(itinerary, destinations);
  
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
              <a href={`/${locale}/plan`} className="bg-oman-green text-black px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition">
                Plan New Trip
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Your Personalized Oman Itinerary</h1>
        <p className="text-gray-600 mb-8">
          {itinerary.preferences.duration} days • {itinerary.preferences.intensity} pace • {itinerary.preferences.budget} budget
        </p>
        
        {/* Budget Warning */}
        {overBudget && (
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
            <p className="font-semibold">⚠️ This itinerary exceeds your budget</p>
            <p className="text-sm mt-1">Total: {itinerary.totalCost.total} OMR</p>
          </div>
        )}
        
        {/* Cost Saving Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="font-semibold mb-2">💡 Cost-Saving Tips</p>
            <ul className="list-disc list-inside text-sm">
              {suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Day Selection & Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-xl font-semibold mb-4">Trip Overview</h2>
              <div className="space-y-2">
                {itinerary.regionAllocation.map((region, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded">
                    <span className="font-medium capitalize">{region.region}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      Days {region.dayNumbers.join('-')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Select Day</h2>
              <div className="grid grid-cols-4 gap-2">
                {itinerary.dailyItineraries.map(day => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`p-3 rounded-lg text-center ${
                      selectedDay === day.day
                        ? 'bg-oman-green text-black font-medium'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Middle Column - Daily Itinerary */}
          <div className="lg:col-span-1">
            {currentDayRoute ? (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4">
                  Day {currentDayRoute.day} - {currentDayRoute.region}
                </h2>
                
                <div className="space-y-4">
                  {currentDayRoute.stops.map((stop, idx) => {
                    const destination = destinations.find(d => d.id === stop.destinationId);
                    const reasons = getStopExplanation(stop, destination, itinerary.preferences);
                    
                    return (
                      <div key={idx} className="border-l-4 border-oman-green pl-4">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">
                            {locale === 'en' ? stop.destinationName.en : stop.destinationName.ar}
                          </h3>
                          <span className="text-sm text-gray-500">{stop.arrivalTime}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          {stop.duration} min • {stop.cost} OMR
                        </p>
                        
                        <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                          {reasons.map((reason, i) => (
                            <div key={i} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                        
                        {idx < currentDayRoute.stops.length - 1 && (
                          <p className="text-xs text-gray-400 mt-2">
                            ↓ Travel to next stop
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm">
                    <span className="font-medium">Total distance:</span> {currentDayRoute.totalDistance.toFixed(1)} km
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Day starts:</span> {currentDayRoute.startTime} • 
                    <span className="font-medium"> ends:</span> {currentDayRoute.endTime}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
                No itinerary for this day
              </div>
            )}
          </div>
          
          {/* Right Column - Map & Costs */}
          <div className="lg:col-span-1">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-80">
              {currentDayRoute && mapReady ? (
                <ItineraryMap 
                  route={currentDayRoute} 
                  allDestinations={destinations}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-500">
                    {mapReady ? 'No route to display' : 'Loading map...'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Cost Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Fuel</span>
                  <span className="font-medium">{itinerary.totalCost.fuel} OMR</span>
                </div>
                <div className="flex justify-between">
                  <span>Tickets</span>
                  <span className="font-medium">{itinerary.totalCost.tickets} OMR</span>
                </div>
                <div className="flex justify-between">
                  <span>Food ({itinerary.preferences.duration} days)</span>
                  <span className="font-medium">{itinerary.totalCost.food} OMR</span>
                </div>
                <div className="flex justify-between">
                  <span>Hotel ({itinerary.preferences.duration-1} nights)</span>
                  <span className="font-medium">{itinerary.totalCost.hotel} OMR</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-oman-green">{itinerary.totalCost.total} OMR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
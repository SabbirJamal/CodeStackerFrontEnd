'use client';

import * as React from 'react';
import { useState } from 'react';
import destinationsData from '@/data/destinations.json';
import { Destination, Category } from '@/types/destination';
import { UserPreferences } from '@/types/itinerary';
import { 
  calculateRegionScores, 
  allocateRegionDays, 
  formatRegionAllocation,
  validateAllocation 
} from '@/lib/region-planner';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function RegionTestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const { destinations } = destinationsData as { destinations: Destination[] };
  
  const [duration, setDuration] = useState<number>(5);
  const [month, setMonth] = useState<number>(3); // March
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['culture', 'nature']);
  
  const allCategories: Category[] = ['mountain', 'beach', 'culture', 'desert', 'nature', 'food'];
  
  const preferences: UserPreferences = {
    duration,
    budget: 'medium',
    month,
    intensity: 'balanced',
    preferredCategories: selectedCategories
  };
  
  // Calculate region scores
  const regionScores = calculateRegionScores(destinations, preferences);
  
  // Allocate days
  const allocation = allocateRegionDays(regionScores, duration);
  
  // Validate
  const validation = validateAllocation(allocation, duration);
  
  const categoryInfo = {
    mountain: { en: 'Mountains', ar: 'الجبال', icon: '🏔️' },
    beach: { en: 'Beach', ar: 'الشاطئ', icon: '🏖️' },
    culture: { en: 'Culture', ar: 'الثقافة', icon: '🕌' },
    desert: { en: 'Desert', ar: 'الصحراء', icon: '🏜️' },
    nature: { en: 'Nature', ar: 'الطبيعة', icon: '🌿' },
    food: { en: 'Food', ar: 'الطعام', icon: '🍽️' }
  };
  
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
        <h1 className="text-3xl font-bold mb-8">🗺️ Region-Level Planning Test</h1>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Duration */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-medium mb-2">Trip Duration (days)</label>
            <input
              type="range"
              min="1"
              max="7"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full accent-oman-green"
            />
            <div className="text-center mt-2">
              <span className="text-lg font-bold text-oman-green">{duration} days</span>
            </div>
          </div>
          
          {/* Month */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-medium mb-2">Travel Month</label>
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
          <div className="bg-white rounded-lg shadow-md p-4">
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
                  className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                    selectedCategories.includes(cat)
                      ? 'bg-oman-green text-black font-medium'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <span>{categoryInfo[cat].icon}</span>
                  <span>{categoryInfo[cat].en}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Validation Status */}
        <div className={`mb-6 p-4 rounded-lg ${
          validation.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="font-semibold">
            {validation.valid ? '✅ Allocation Valid' : '❌ Allocation Invalid'}
          </div>
          {validation.errors.length > 0 && (
            <ul className="list-disc list-inside mt-2">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Region Scores */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Region Scores</h2>
            <div className="space-y-4">
              {regionScores.map((region, index) => (
                <div key={region.region} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium capitalize">{region.region}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({region.destinationCount} destinations)
                      </span>
                    </div>
                    <div className="text-lg font-bold text-oman-green">
                      {(region.baseScore * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-oman-green h-2 rounded-full"
                      style={{ width: `${region.baseScore * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {region.topDestinations.map(d => (
                      <span key={d.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {d.name.en}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Allocation Plan */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Region Allocation</h2>
            <div className="space-y-3">
              {formatRegionAllocation(allocation, locale).map((line, i) => (
                <div key={i} className="p-3 bg-oman-green/5 rounded-lg border-l-4 border-oman-green">
                  {line}
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Summary</h3>
              <p>
                {allocation.length} region{allocation.length > 1 ? 's' : ''} • 
                {duration} days total
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Max days per region: {Math.ceil(duration / 2)} • 
                Min regions required: {duration >= 3 ? 2 : 1}
              </p>
            </div>
          </div>
        </div>
        
        {/* Test Cases */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setDuration(3);
                setMonth(3);
                setSelectedCategories(['culture', 'nature']);
              }}
              className="p-3 border rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="font-medium">3-Day Culture Trip</div>
              <div className="text-sm text-gray-600">March • Culture + Nature</div>
            </button>
            
            <button
              onClick={() => {
                setDuration(5);
                setMonth(8);
                setSelectedCategories(['beach', 'nature']);
              }}
              className="p-3 border rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="font-medium">5-Day Summer Beach</div>
              <div className="text-sm text-gray-600">August • Beach + Nature</div>
            </button>
            
            <button
              onClick={() => {
                setDuration(7);
                setMonth(12);
                setSelectedCategories(['desert', 'culture']);
              }}
              className="p-3 border rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="font-medium">7-Day Winter Explorer</div>
              <div className="text-sm text-gray-600">December • Desert + Culture</div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
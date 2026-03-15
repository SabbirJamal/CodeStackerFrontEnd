'use client';

import * as React from 'react';
import { useState } from 'react';
import destinationsData from '@/data/destinations.json';
import { Destination, Category } from '@/types/destination';
import { 
  calculateDestinationScore, 
  getScoreBreakdown,
  WEIGHTS 
} from '@/lib/scoring';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ScoreTestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const { destinations } = destinationsData as { destinations: Destination[] };
  
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['culture', 'nature']);
  const [selectedDestination, setSelectedDestination] = useState<string>(destinations[0]?.id || '');
  
  const allCategories: Category[] = ['mountain', 'beach', 'culture', 'desert', 'nature', 'food'];
  
  const destination = destinations.find(d => d.id === selectedDestination);
  
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
        <h1 className="text-3xl font-bold mb-8">🎯 Multi-Objective Scoring Test</h1>
        
        {/* Weights Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Weights</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Object.entries(WEIGHTS).map(([key, value]) => (
              <div key={key} className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">{key}</div>
                <div className="text-lg font-bold text-oman-green">{(value * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Month Selector */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-medium mb-2">Travel Month</label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                <option key={m} value={m}>
                  {new Date(2024, m-1).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          
          {/* Category Selector */}
          <div className="bg-white rounded-lg shadow-md p-4 md:col-span-2">
            <label className="block text-sm font-medium mb-2">User Interests</label>
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
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                    selectedCategories.includes(cat)
                        ? 'bg-oman-green text-black font-medium'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  <span>{categoryInfo[cat].icon}</span>
                  <span>{categoryInfo[cat].en}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Destination Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label className="block text-sm font-medium mb-2">Select Destination</label>
          <select 
            className="w-full p-2 border rounded"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
          >
            {destinations.map(d => (
              <option key={d.id} value={d.id}>{d.name.en}</option>
            ))}
          </select>
        </div>
        
        {/* Score Results */}
        {destination && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Score Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Score Breakdown</h2>
              {(() => {
                const breakdown = getScoreBreakdown(destination, selectedCategories, selectedMonth);
                return (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-oman-green">
                        {(breakdown.total * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">Total Score</div>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(breakdown.components).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{key}</span>
                            <span className="font-medium">{(value * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-oman-green h-2 rounded-full"
                              style={{ width: `${value * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-oman-green/5 rounded-lg">
                      <h3 className="font-semibold mb-2">Top Reasons to Visit:</h3>
                      <ul className="list-disc list-inside">
                        {breakdown.topReasons.map((reason, i) => (
                          <li key={i} className="text-sm text-gray-700">{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Destination Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{destination.name.en}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="flex gap-2">
                    {destination.categories.map(cat => (
                      <span key={cat} className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Recommended Months</h3>
                  <div className="grid grid-cols-6 gap-1">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                      <div 
                        key={m}
                        className={`text-center text-xs p-1 rounded ${
                          destination.recommended_months.includes(m)
                            ? 'bg-oman-green text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Crowd Level</div>
                    <div className="font-bold">{destination.crowd_level}/5</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Ticket Cost</div>
                    <div className="font-bold">{destination.ticket_cost_omr} OMR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
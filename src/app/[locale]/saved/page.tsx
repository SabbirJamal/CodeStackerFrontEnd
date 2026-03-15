'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import destinationsData from '@/data/destinations.json';
import { Destination } from '@/types/destination';
import { useInterestsStore } from '@/store/useInterestsStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DestinationCard from '@/components/DestinationCard';

export default function SavedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const router = useRouter();
  const { savedInterests, clearAll } = useInterestsStore();
  
  const { destinations } = destinationsData as { destinations: Destination[] };
  
  // Get saved destinations
  const savedDestinations = destinations.filter(d => savedInterests.includes(d.id));
  
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href={`/${locale}`} className="text-2xl font-bold text-oman-green">🇴🇲 Visit Oman</a>
            </div>
            <div className="flex items-center gap-4">
              <a href={`/${locale}/destinations`} className="text-gray-700 hover:text-oman-green">
                {locale === 'en' ? 'Destinations' : 'الوجهات'}
              </a>
              <a 
                href={`/${locale}/plan`}
                className="bg-oman-green text-black px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition"
              >
                {locale === 'en' ? 'Plan Trip' : 'خطط لرحلتك'}
              </a>
              <a href={`/${locale}/saved`} className="text-gray-700 hover:text-oman-green">
                {locale === 'en' ? 'Saved' : 'المحفوظات'}
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {locale === 'en' ? 'My Saved Interests' : 'اهتماماتي المحفوظة'}
              </h1>
              <p className="text-gray-600">
                {locale === 'en' 
                  ? `You have ${savedDestinations.length} saved destinations` 
                  : `لديك ${savedDestinations.length} وجهة محفوظة`}
              </p>
            </div>
            {savedDestinations.length > 0 && (
              <button
                onClick={clearAll}
                className="text-red-600 hover:text-red-800 transition"
              >
                {locale === 'en' ? 'Clear all' : 'مسح الكل'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Saved Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {savedDestinations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">☆</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {locale === 'en' ? 'No saved interests yet' : 'لا توجد اهتمامات محفوظة بعد'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'en' 
                ? 'Start exploring destinations and save your favorites'
                : 'ابدأ باستكشاف الوجهات واحفظ المفضلة لديك'}
            </p>
            <button
              onClick={() => router.push(`/${locale}/destinations`)}
              className="bg-oman-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {locale === 'en' ? 'Browse Destinations' : 'تصفح الوجهات'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedDestinations.map((dest) => (
              <DestinationCard 
                key={dest.id} 
                destination={dest} 
                locale={locale} 
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
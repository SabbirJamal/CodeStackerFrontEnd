'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import destinationsData from '@/data/destinations.json';
import { Destination, Category, Region } from '@/types/destination';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DestinationCard from '@/components/DestinationCard';

// all the availble filter options that has to be displayed
const categories: Category[] = ['mountain', 'beach', 'culture', 'desert', 'nature', 'food'];
const regions: Region[] = ['muscat', 'dakhiliya', 'sharqiya', 'dhofar', 'batinah', 'dhahira'];
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function DestinationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const t = useTranslations('Destinations');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { destinations } = destinationsData as { destinations: Destination[] };
  
  // Get filter values from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedRegion = searchParams.get('region') || '';
  const selectedMonth = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;
  const sortBy = searchParams.get('sort') || 'popularity';
  
  // destinations filters
  const filteredDestinations = destinations.filter(dest => {
    // filter by category
    if (selectedCategory && !dest.categories.includes(selectedCategory as Category)) {
      return false;
    }
    
    // filter by region
    if (selectedRegion && dest.region.en !== selectedRegion) {
      return false;
    }
    // filter by month 
    if (selectedMonth !== null && !dest.recommended_months.includes(selectedMonth)) {
      return false;
    }
    return true;
  });
  
  // sorting destinations
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortBy === 'cost') {
      return a.ticket_cost_omr - b.ticket_cost_omr;
    } else {
      return a.crowd_level - b.crowd_level;
    }
  });
  
  // updating URL with filters
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/${locale}/destinations?${params.toString()}`);
  };
  
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* top navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href={`/${locale}`} className="text-2xl font-bold text-oman-green">🇴🇲 {t('appTitle')}</a>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {locale === 'en' ? 'Explore All Destinations' : 'استكشف جميع الوجهات'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en' 
              ? `Found ${sortedDestinations.length} destinations` 
              : `تم العثور على ${sortedDestinations.length} وجهة`}
          </p>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            {locale === 'en' ? 'Filters' : 'تصفية'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Category' : 'الفئة'}
              </label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={selectedCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
              >
                <option value="">{locale === 'en' ? 'All Categories' : 'جميع الفئات'}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Region' : 'المنطقة'}
              </label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={selectedRegion}
                onChange={(e) => updateFilter('region', e.target.value)}
              >
                <option value="">{locale === 'en' ? 'All Regions' : 'جميع المناطق'}</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region.charAt(0).toUpperCase() + region.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Travel Month' : 'شهر السفر'}
              </label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={selectedMonth || ''}
                onChange={(e) => updateFilter('month', e.target.value)}
              >
                <option value="">{locale === 'en' ? 'Any Month' : 'أي شهر'}</option>
                {months.map(month => (
                  <option key={month} value={month}>
                    {new Date(2024, month-1).toLocaleString(locale === 'en' ? 'en-US' : 'ar-SA', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'en' ? 'Sort By' : 'ترتيب حسب'}
              </label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
              >
                <option value="popularity">
                  {locale === 'en' ? 'Popularity (Least Crowded)' : 'الشعبية (الأقل ازدحاماً)'}
                </option>
                <option value="cost">
                  {locale === 'en' ? 'Cost (Lowest First)' : 'التكلفة (الأقل أولاً)'}
                </option>
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory || selectedRegion || selectedMonth) && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">
                  {locale === 'en' ? 'Active filters:' : 'الفلاتر النشطة:'}
                </span>
                {selectedCategory && (
                  <span className="bg-oman-green/10 text-oman-green px-3 py-1 rounded-full text-sm">
                    {selectedCategory} ✕
                  </span>
                )}
                {selectedRegion && (
                  <span className="bg-oman-green/10 text-oman-green px-3 py-1 rounded-full text-sm">
                    {selectedRegion} ✕
                  </span>
                )}
                {selectedMonth && (
                  <span className="bg-oman-green/10 text-oman-green px-3 py-1 rounded-full text-sm">
                    {new Date(2024, selectedMonth-1).toLocaleString(locale === 'en' ? 'en-US' : 'ar-SA', { month: 'long' })} ✕
                  </span>
                )}
                <button 
                  onClick={() => {
                    router.push(`/${locale}/destinations`);
                  }}
                  className="text-sm text-gray-500 hover:text-oman-green"
                >
                  {locale === 'en' ? 'Clear all' : 'مسح الكل'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {sortedDestinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {locale === 'en' 
                ? 'No destinations match your filters' 
                : 'لا توجد وجهات تطابق معايير البحث'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedDestinations.map((dest) => (
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
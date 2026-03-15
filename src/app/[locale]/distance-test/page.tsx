'use client';

import * as React from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DistanceDemo from '@/components/DistanceDemo';

interface DistanceTestPageProps {
  params: Promise<{ locale: string }>;
}

export default function DistanceTestPage({ params }: DistanceTestPageProps) {
  const { locale } = React.use(params);
  
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href={`/${locale}`} className="text-2xl font-bold text-oman-green">🇴🇲 Visit Oman</a>
            </div>
            <div className="flex items-center gap-4">
              <a href={`/${locale}`} className="text-gray-700 hover:text-oman-green">
                {locale === 'en' ? 'Home' : 'الرئيسية'}
              </a>
              <a href={`/${locale}/plan`} className="bg-oman-green text-black px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition">
                {locale === 'en' ? 'Plan Trip' : 'خطط لرحلتك'}
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-oman-green/20 to-oman-red/20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {locale === 'en' ? 'Distance Calculator Test' : 'اختبار حاسبة المسافات'}
          </h1>
          <p className="text-xl text-gray-600">
            {locale === 'en' 
              ? 'Testing Haversine formula implementation' 
              : 'اختبار تنفيذ صيغة هافرسين'}
          </p>
        </div>
      </div>

      {/* Demo Component */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <DistanceDemo locale={locale} />
      </div>
    </main>
  );
}
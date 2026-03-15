'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ItineraryForm from '@/components/ItineraryForm';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PlanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  
  const handleGenerateItinerary = async (formData: any) => {
    setIsLoading(true);
    setShowLoading(true);
    
    // Save form data
    sessionStorage.setItem('itinerary-preferences', JSON.stringify(formData));
    
    // Simulate processing time (remove this in production)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to results
    router.push(`/${locale}/plan/results`);
  };
  
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Loading Overlay */}
      {showLoading && <LoadingSpinner locale={locale} />}
      
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
      <div className="bg-gradient-to-r from-oman-green/20 to-oman-red/20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {locale === 'en' ? 'Plan Your Perfect Oman Journey' : 'خطط لرحلتك المثالية في عمان'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {locale === 'en'
              ? 'Tell us your preferences and we\'ll create a personalized itinerary just for you'
              : 'أخبرنا بتفضيلاتك وسنقوم بإنشاء برنامج رحلة مخصص لك'}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ItineraryForm 
          locale={locale} 
          onSubmit={handleGenerateItinerary}
          isLoading={isLoading}
        />
      </div>

      {/* Info Section */}
      <div className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {locale === 'en' ? 'How It Works' : 'كيف يعمل'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="font-semibold mb-2">
                {locale === 'en' ? 'Set Your Preferences' : 'حدد تفضيلاتك'}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === 'en'
                  ? 'Choose duration, budget, and travel style'
                  : 'اختر المدة والميزانية وأسلوب السفر'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="font-semibold mb-2">
                {locale === 'en' ? 'AI-Powered Planning' : 'تخطيط بالذكاء الاصطناعي'}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === 'en'
                  ? 'Our algorithm creates optimal daily routes'
                  : 'تقوم خوارزميتنا بإنشاء مسارات يومية مثالية'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="font-semibold mb-2">
                {locale === 'en' ? 'Get Your Itinerary' : 'احصل على برنامج رحلتك'}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === 'en'
                  ? 'View day-by-day plan with maps and costs'
                  : 'عرض خطة يوم بيوم مع الخرائط والتكاليف'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import destinationsData from '@/data/destinations.json';
import { Destination } from '@/types/destination';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SaveButton from '@/components/SaveButton';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// for importing Map component (client-side only)
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// helper function to get crowd level stars
const getCrowdStars = (level: number) => {
  const stars = 6 - level; 
  return '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
};

// helper function to get month names
const getMonthName = (month: number, locale: string) => {
  return new Date(2024, month - 1).toLocaleString(locale === 'en' ? 'en-US' : 'ar-SA', { month: 'long' });
};

export default function DestinationDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = React.use(params);
  const t = useTranslations('Destination');
  const router = useRouter();
  
  const { destinations } = destinationsData as { destinations: Destination[] };
  
  // finding the destination by id
  const destination = destinations.find(d => d.id === id);
  
  // a function to handle back navigation with animation
  const handleBack = () => {
    router.back();
  };
  
  // if destination not found, then an error 404 will be shown
  if (!destination) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {locale === 'en' ? 'Destination not found' : 'الوجهة غير موجودة'}
          </h1>
          <button 
            onClick={() => router.push(`/${locale}/destinations`)}
            className="bg-oman-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {locale === 'en' ? 'Back to Destinations' : 'العودة إلى الوجهات'}
          </button>
        </div>
      </main>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <main key={destination.id} className="min-h-screen bg-zinc-50">
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

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <motion.button 
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-oman-green transition"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">←</span>
            {locale === 'en' ? 'Back' : 'رجوع'}
          </motion.button>
        </div>

        {/* Hero Image */}
        {destination.image && (
          <div className="max-w-7xl mx-auto px-4 mb-8">
            <motion.div
              layoutId={`card-${destination.id}`}
              className="h-96 rounded-lg overflow-hidden shadow-xl"
            >
              <motion.img
                layoutId={`image-${destination.id}`}
                src={destination.image}
                alt={locale === 'en' ? destination.name.en : destination.name.ar}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              {/* Title */}
              <motion.h1
                layoutId={`title-${destination.id}`}
                className="text-4xl font-bold text-gray-800 mb-2"
              >
                {locale === 'en' ? destination.name.en : destination.name.ar}
              </motion.h1>
              
              {/* Region and Categories */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                <span className="bg-oman-green/10 text-oman-green px-3 py-1 rounded-full text-sm">
                  {locale === 'en' ? destination.region.en : destination.region.ar}
                </span>
                {destination.categories.map(cat => (
                  <span key={cat} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {cat}
                  </span>
                ))}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {locale === 'en' ? 'About' : 'عن'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {locale === 'en' 
                      ? `Experience the beauty of ${destination.name.en} in the ${destination.region.en} region. This ${destination.categories.join(', ')} destination offers a unique glimpse into Oman's rich heritage and natural beauty.`
                      : `استمتع بجمال ${destination.name.ar} في منطقة ${destination.region.ar}. هذه الوجهة ${destination.categories.join('، ')} تقدم لمحة فريدة عن تراث عمان الغني وجمالها الطبيعي.`}
                  </p>
                </div>
              </motion.div>

              {/* Quick Info Grid */}
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.5 }
                  }
                }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
              >
                {/* Duration Card */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="bg-white rounded-lg shadow-md p-4 text-center"
                >
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Duration' : 'المدة'}
                  </div>
                  <div className="font-semibold">
                    {Math.floor(destination.avg_visit_duration_minutes / 60)}h {destination.avg_visit_duration_minutes % 60}m
                  </div>
                </motion.div>
                
                {/* Ticket Card */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="bg-white rounded-lg shadow-md p-4 text-center"
                >
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Ticket' : 'التذكرة'}
                  </div>
                  <div className="font-semibold">
                    {destination.ticket_cost_omr === 0 ? 'FREE' : `${destination.ticket_cost_omr} OMR`}
                  </div>
                </motion.div>
                
                {/* Crowd Level Card */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="bg-white rounded-lg shadow-md p-4 text-center"
                >
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Crowd Level' : 'مستوى الزحام'}
                  </div>
                  <div className="font-semibold">
                    {getCrowdStars(destination.crowd_level)}
                  </div>
                </motion.div>
                
                {/* Best Time Card */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="bg-white rounded-lg shadow-md p-4 text-center"
                >
                  <div className="text-2xl mb-2">📅</div>
                  <div className="text-sm text-gray-600">
                    {locale === 'en' ? 'Best Time' : 'أفضل وقت'}
                  </div>
                  <div className="font-semibold text-sm">
                    {destination.recommended_months.length} {locale === 'en' ? 'months' : 'أشهر'}
                  </div>
                </motion.div>
              </motion.div>

              {/* Recommended Months */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {locale === 'en' ? 'Recommended Months' : 'الأشهر الموصى بها'}
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                    <div 
                      key={month}
                      className={`p-2 text-center rounded-lg text-sm ${
                        destination.recommended_months.includes(month as any)
                          ? 'bg-green-300 text-black font-medium'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {getMonthName(month, locale).substring(0, 3)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  {locale === 'en' 
                    ? 'Green months are the best time to visit'
                    : 'الأشهر الخضراء هي أفضل وقت للزيارة'}
                </p>
              </motion.div>
            </div>

            {/* Right Column - Map and Actions */}
            <div className="lg:col-span-1">
              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-lg shadow-md p-4 mb-4 sticky top-4"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {locale === 'en' ? 'Location' : 'الموقع'}
                </h2>
                <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <Map 
                    lat={destination.lat} 
                    lng={destination.lng} 
                    name={locale === 'en' ? destination.name.en : destination.name.ar}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {destination.lat.toFixed(4)}°, {destination.lng.toFixed(4)}°
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <SaveButton destinationId={destination.id} locale={locale} />
                
                <button className="w-full border border-oman-green text-oman-green py-3 rounded-lg font-semibold hover:bg-oman-green/5 transition mt-3">
                  {locale === 'en' ? 'Add to Trip' : 'إضافة إلى الرحلة'}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </AnimatePresence>
  );
}
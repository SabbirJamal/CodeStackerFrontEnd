'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useState, useEffect } from 'react';
import destinationsData from '@/data/destinations.json';
import { Destination } from '@/types/destination';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DestinationCard from '@/components/DestinationCard';
import CategoryCard from '@/components/CategoryCard';
import LottieAnimation from '@/components/LottieAnimation';

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const { destinations } = destinationsData as { destinations: Destination[] };
  const t = useTranslations('Home');
  const appT = useTranslations('App');
  
  // slideshow state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // array of hero images (update these filenames to match your actual files)
  const heroImages = [
    { url: '/images/hero/jebel-akhdar.jpg', alt: 'Jebel Akhdar Mountains' },
    { url: '/images/hero/wahiba-sands.jpg', alt: 'Wahiba Sands Desert' },
    { url: '/images/hero/wadi-shab.jpg', alt: 'Wadi Shab' },
    { url: '/images/hero/salalah.webp', alt: 'Salalah Khareef' },
    { url: '/images/hero/sultan-mosque.jpg', alt: 'Sultan Qaboos Grand Mosque' },
    { url: '/images/hero/sur.jpg', alt: 'Sur Beach' },
  ];
  
  // auto-rotate hero images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  // calculate category counts
  const categoryCounts = {
    mountain: destinations.filter(d => d.categories.includes('mountain')).length,
    desert: destinations.filter(d => d.categories.includes('desert')).length,
    beach: destinations.filter(d => d.categories.includes('beach')).length,
    culture: destinations.filter(d => d.categories.includes('culture')).length,
  };
  
  // get all destinations for featured carousel
  const featuredDestinations = destinations; // Use all 8 destinations
  
  // carousel navigation handlers
  const totalSlides = Math.ceil(featuredDestinations.length / 4);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === totalSlides - 1 ? 0 : prev + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };
  
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href={`/${locale}`} className="text-2xl font-bold text-oman-green">🇴🇲 {appT('title')}</a>
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

      {/* Hero Section with Slideshow */}
      <div className="relative h-[600px] mt-16 overflow-hidden">
        {/* Background Images Slideshow */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            onError={(e) => {
              // Fallback gradient if image doesn't exist
              e.currentTarget.style.background = 'linear-gradient(135deg, #2E7D32 0%, #D32F2F 100%)';
            }}
          />
        ))}
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Image indicators (dots) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`transition-all ${
                index === currentImageIndex 
                  ? 'w-8 h-2 bg-white rounded-full' 
                  : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
              {locale === 'en' ? 'Discover the Magic of Oman' : 'اكتشف سحر عمان'}
            </h1>
            <p className="text-xl mb-8 text-white/90 drop-shadow">
              {locale === 'en' 
                ? 'From golden deserts to turquoise waters, experience authentic Arabian hospitality'
                : 'من الصحاري الذهبية إلى المياه الفيروزية، استمتع بتجربة الضيافة العربية الأصيلة'}
            </p>
            <a 
              href={`/${locale}/plan`}
              className="bg-white text-oman-green px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-300 transition shadow-lg inline-block"
            >
              {locale === 'en' ? 'Plan Your Trip →' : 'خطط لرحلتك ←'}
            </a>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          {locale === 'en' ? 'Explore by Category' : 'استكشف حسب الفئة'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard
            icon="🏔️"
            title={locale === 'en' ? 'Mountains' : 'الجبال'}
            count={categoryCounts.mountain}
            color="bg-emerald-100 text-emerald-900"
            locale={locale}
          />
          <CategoryCard
            icon="🏜️"
            title={locale === 'en' ? 'Desert' : 'الصحراء'}
            count={categoryCounts.desert}
            color="bg-amber-100 text-amber-900"
            locale={locale}
          />
          <CategoryCard
            icon="🌊"
            title={locale === 'en' ? 'Beaches' : 'الشواطئ'}
            count={categoryCounts.beach}
            color="bg-sky-100 text-sky-900"
            locale={locale}
          />
          <CategoryCard
            icon="🕌"
            title={locale === 'en' ? 'Culture' : 'الثقافة'}
            count={categoryCounts.culture}
            color="bg-rose-100 text-rose-900"
            locale={locale}
          />
        </div>
      </div>

      {/* Featured Destinations Carousel */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
            {locale === 'en' ? 'Featured Destinations' : 'الوجهات المميزة'}
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {locale === 'en' 
              ? 'Hand-picked locations that showcase the best of Oman'
              : 'مواقع مختارة بعناية تعرض أفضل ما في عمان'}
          </p>
          
          {/* Carousel Container */}
          <div className="relative px-4 md:px-8">
            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextSlide}
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Slides */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Create slides - each slide shows 4 cards on desktop, 1 on mobile */}
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {featuredDestinations
                        .slice(slideIndex * 4, (slideIndex + 1) * 4)
                        .map((dest) => (
                          <DestinationCard 
                            key={dest.id} 
                            destination={dest} 
                            locale={locale} 
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8 md:hidden">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all ${
                    currentSlide === index 
                      ? 'w-6 h-2 bg-oman-green rounded-full' 
                      : 'w-2 h-2 bg-gray-300 rounded-full'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-gradient-to-r from-oman-green/20 to-oman-red/20 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {locale === 'en' ? 'Ready to explore Oman?' : 'مستعد لاستكشاف عمان؟'}
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Start planning your personalized itinerary today'
              : 'ابدأ التخطيط لرحلتك المخصصة اليوم'}
          </p>
          <a 
            href={`/${locale}/plan`}
            className="bg-oman-green text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition shadow-lg inline-block"
          >
            {locale === 'en' ? 'Plan Your Trip Now' : 'خطط لرحلتك الآن'}
          </a>
        </div>
      </div>

      {/* Footer with Social Media Animations */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1">
              <h3 className="text-xl font-bold mb-4 text-white">🇴🇲 Visit Oman</h3>
              <p className="text-gray-400 text-sm">
                {locale === 'en'
                  ? 'Discover the beauty and culture of the Sultanate of Oman'
                  : 'اكتشف جمال وثقافة سلطنة عمان'}
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4 text-white">{locale === 'en' ? 'Quick Links' : 'روابط سريعة'}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href={`/${locale}/destinations`} className="hover:text-white cursor-pointer">{locale === 'en' ? 'Destinations' : 'الوجهات'}</a></li>
                <li><a href={`/${locale}/plan`} className="hover:text-white cursor-pointer">{locale === 'en' ? 'Plan Trip' : 'خطط لرحلتك'}</a></li>
                <li><a href={`/${locale}/saved`} className="hover:text-white cursor-pointer">{locale === 'en' ? 'Saved' : 'المحفوظات'}</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4 text-white">{locale === 'en' ? 'Contact' : 'اتصل بنا'}</h4>
              <p className="text-gray-400 text-sm mb-4">
                {locale === 'en' ? 'Email: info@visitoman.com' : 'البريد الإلكتروني: info@visitoman.com'}
              </p>
              <p className="text-gray-400 text-sm">© 2026 Visit Oman. All rights reserved.</p>
            </div>

            {/* Social Media Animations */}
            <div className="col-span-1">
              <h4 className="font-semibold mb-4 text-white">{locale === 'en' ? 'Follow Us' : 'تابعنا'}</h4>
              <div className="flex gap-4 items-center">
                <a 
                  href="https://discord.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <LottieAnimation 
                    animationPath="/animations/discordlogo.json"
                    className="w-12 h-12"
                  />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <LottieAnimation 
                    animationPath="/animations/facebooklogo.json"
                    className="w-12 h-12"
                  />
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <LottieAnimation 
                    animationPath="/animations/tiktoklogo.json"
                    className="w-12 h-12"
                  />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <LottieAnimation 
                    animationPath="/animations/instagramlogo.json"
                    className="w-12 h-12"
                  />
                </a>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                {locale === 'en' 
                  ? 'Follow us on social media for updates' 
                  : 'تابعنا على وسائل التواصل الاجتماعي للحصول على آخر التحديثات'}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
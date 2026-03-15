'use client';

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LoadingSpinnerProps {
  locale: string;
}

export default function LoadingSpinner({ locale }: LoadingSpinnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/animations/loading.json',
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center">
        <div ref={containerRef} className="w-48 h-48 mx-auto" />
        <p className="text-gray-700 mt-4">
          {locale === 'en' ? 'Creating your perfect itinerary...' : 'جاري إنشاء برنامج رحلتك المثالي...'}
        </p>
      </div>
    </div>
  );
}
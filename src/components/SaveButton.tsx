'use client';

import { useState, useEffect } from 'react';
import { useInterestsStore } from '@/store/useInterestsStore';

interface SaveButtonProps {
  destinationId: string;
  locale: string;
  showText?: boolean;
}

export default function SaveButton({ destinationId, locale, showText = true }: SaveButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { isSaved, toggleInterest } = useInterestsStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <button className="w-full border border-gray-300 text-gray-400 py-3 rounded-lg font-semibold cursor-wait">
        {showText ? (locale === 'en' ? 'Loading...' : 'جاري التحميل...') : '⋯'}
      </button>
    );
  }
  
  const saved = isSaved(destinationId);
  
  return (
    <button
      onClick={() => toggleInterest(destinationId)}
      className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
        saved 
          ? 'bg-oman-green text-black hover:bg-green-600' 
          : 'border border-oman-green text-oman-green hover:bg-oman-green/5'
      }`}
    >
      <span className="text-lg">{saved ? '✓' : '☆'}</span>
      {showText && (saved 
        ? (locale === 'en' ? 'Saved' : 'تم الحفظ')
        : (locale === 'en' ? 'Save to Interests' : 'حفظ في الاهتمامات')
      )}
    </button>
  );
}
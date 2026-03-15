'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInterestsStore } from '@/store/useInterestsStore';
import destinationsData from '@/data/destinations.json';
import { Category, Destination } from '@/types/destination';
import { UserPreferences, BudgetTier, Intensity } from '@/types/itinerary';

interface ItineraryFormProps {
  locale: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function ItineraryForm({ locale, onSubmit, isLoading }: ItineraryFormProps) {
  const router = useRouter();
  const { savedInterests } = useInterestsStore();
  const { destinations } = destinationsData as { destinations: Destination[] };
  
  // getting user's saved categories
  const savedDestinations = destinations.filter(d => savedInterests.includes(d.id));
  const savedCategories = [...new Set(savedDestinations.flatMap(d => d.categories))];
  
  // form state
  const [duration, setDuration] = useState<number>(3);
  const [budget, setBudget] = useState<BudgetTier>('medium');
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [intensity, setIntensity] = useState<Intensity>('balanced');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(savedCategories);
  
  // validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (duration < 1 || duration > 7) {
      newErrors.duration = locale === 'en' 
        ? 'Duration must be between 1 and 7 days' 
        : 'يجب أن تكون المدة بين 1 و 7 أيام';
    }
    
    if (selectedCategories.length === 0) {
      newErrors.categories = locale === 'en'
        ? 'Please select at least one category'
        : 'الرجاء اختيار فئة واحدة على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const preferences: UserPreferences = {
      duration,
      budget,
      month,
      intensity,
      preferredCategories: selectedCategories
    };
    
    onSubmit(preferences);
  };
  
  // all the available categories
  const allCategories: Category[] = ['mountain', 'beach', 'culture', 'desert', 'nature', 'food'];
  
  // all category icons and names
  const categoryInfo = {
    mountain: { en: 'Mountains', ar: 'الجبال', icon: '🏔️' },
    beach: { en: 'Beach', ar: 'الشاطئ', icon: '🏖️' },
    culture: { en: 'Culture', ar: 'الثقافة', icon: '🕌' },
    desert: { en: 'Desert', ar: 'الصحراء', icon: '🏜️' },
    nature: { en: 'Nature', ar: 'الطبيعة', icon: '🌿' },
    food: { en: 'Food', ar: 'الطعام', icon: '🍽️' }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {locale === 'en' ? 'Plan Your Oman Trip' : 'خطط لرحلتك في عمان'}
      </h2>
      
      {/* Trip Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {locale === 'en' ? 'Trip Duration (days)' : 'مدة الرحلة (أيام)'}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="7"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-oman-green"
          />
          <span className="text-lg font-semibold text-oman-green min-w-[3rem] text-center">
            {duration} {locale === 'en' ? 'days' : 'أيام'}
          </span>
        </div>
        {errors.duration && (
          <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
        )}
      </div>
      
      {/* Budget Tier */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {locale === 'en' ? 'Budget' : 'الميزانية'}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['low', 'medium', 'luxury'] as BudgetTier[]).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setBudget(tier)}
              className={`py-2 px-4 rounded-lg border transition ${
                budget === tier
                  ? 'bg-oman-green text-black border-oman-green'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {locale === 'en' 
                ? tier.charAt(0).toUpperCase() + tier.slice(1)
                : tier === 'low' ? 'محدودة'
                : tier === 'medium' ? 'متوسطة'
                : 'فاخرة'
              }
            </button>
          ))}
        </div>
      </div>
      
      {/* Travel Month */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {locale === 'en' ? 'Travel Month' : 'شهر السفر'}
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="w-full p-2 border rounded-lg"
        >
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
            <option key={m} value={m}>
              {new Date(2024, m-1).toLocaleString(locale === 'en' ? 'en-US' : 'ar-SA', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>
      
      {/* Travel Intensity */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {locale === 'en' ? 'Travel Pace' : 'وتيرة السفر'}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['relaxed', 'balanced', 'packed'] as Intensity[]).map((pace) => (
            <button
              key={pace}
              type="button"
              onClick={() => setIntensity(pace)}
              className={`py-2 px-4 rounded-lg border transition ${
                intensity === pace
                  ? 'bg-oman-green text-black border-oman-green'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {locale === 'en'
                ? pace.charAt(0).toUpperCase() + pace.slice(1)
                : pace === 'relaxed' ? 'مريحة'
                : pace === 'balanced' ? 'متوازنة'
                : 'مكثفة'
              }
            </button>
          ))}
        </div>
      </div>
      
      {/* Preferred Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {locale === 'en' ? 'Preferred Categories' : 'الفئات المفضلة'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                if (selectedCategories.includes(cat)) {
                  setSelectedCategories(selectedCategories.filter(c => c !== cat));
                } else {
                  setSelectedCategories([...selectedCategories, cat]);
                }
              }}
              className={`p-3 rounded-lg border transition flex items-center gap-2 ${
                selectedCategories.includes(cat)
                  ? 'bg-oman-green text-black font-medium border-oman-green'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <span>{categoryInfo[cat].icon}</span>
              <span className="text-sm">
                {locale === 'en' ? categoryInfo[cat].en : categoryInfo[cat].ar}
              </span>
            </button>
          ))}
        </div>
        {errors.categories && (
          <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
        )}
      </div>
      
      {/* Saved Interests Summary */}
      {savedDestinations.length > 0 && (
        <div className="mb-6 p-4 bg-oman-green/5 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            {locale === 'en'
              ? `Based on your ${savedDestinations.length} saved interests:`
              : `بناءً على ${savedDestinations.length} من اهتماماتك المحفوظة:`}
          </p>
          <div className="flex flex-wrap gap-2">
            {savedCategories.map(cat => (
              <span key={cat} className="bg-oman-green/10 text-oman-green px-2 py-1 rounded-full text-xs">
                {categoryInfo[cat].icon} {locale === 'en' ? categoryInfo[cat].en : categoryInfo[cat].ar}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-oman-green text-black py-3 rounded-lg font-semibold transition ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
        }`}
      >
        {isLoading 
          ? (locale === 'en' ? 'Generating...' : 'جاري الإنشاء...')
          : (locale === 'en' ? 'Generate My Itinerary' : 'إنشاء برنامج رحلتي')
        }
      </button>
    </form>
  );
}
'use client';

import { Destination } from '@/types/destination';
import SaveButton from './SaveButton';
import { motion } from 'framer-motion'; 
import Link from 'next/link'; 

interface DestinationCardProps {
  destination: Destination;
  locale: string;
}

export default function DestinationCard({ destination, locale }: DestinationCardProps) {
  // calculate "star rating" from crowd_level (inverse - less crowd = more stars)
  const starRating = 6 - destination.crowd_level;
  const stars = '⭐'.repeat(starRating);
  
  return (
    <motion.div // 
      layoutId={`card-${destination.id}`} 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image section */}
      <div className="h-48 overflow-hidden">
        <motion.img 
          layoutId={`image-${destination.id}`} 
          src={destination.image}
          alt={locale === 'en' ? destination.name.en : destination.name.ar}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // fallback if image fails to load
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Oman';
          }}
        />
      </div>
      
      <div className="p-5">
        <motion.h3 
          layoutId={`title-${destination.id}`} 
          className="text-xl font-semibold text-oman-red mb-2"
        >
          {locale === 'en' ? destination.name.en : destination.name.ar}
        </motion.h3>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            {locale === 'en' ? destination.region.en : destination.region.ar}
          </span>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            {destination.categories[0]}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">{stars}</span>
            <span className="text-gray-600 text-sm">({destination.crowd_level})</span>
          </div>
          <div className="flex items-center gap-2">
            <SaveButton destinationId={destination.id} locale={locale} showText={false} />
            <span className="text-sm font-medium">
              {destination.avg_visit_duration_minutes} min
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-oman-green">
            {destination.ticket_cost_omr === 0 ? 'FREE' : `${destination.ticket_cost_omr} OMR`}
          </span>
          <Link // change from <a> to <Link>
            href={`/${locale}/destinations/${destination.id}`}
            className="bg-oman-green text-black px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition inline-block text-center"
          >
            {locale === 'en' ? 'View Details' : 'عرض التفاصيل'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
'use client';

import { useState } from 'react';
import destinationsData from '@/data/destinations.json';
import { Destination } from '@/types/destination';
import { haversineDistance, totalRouteDistance, formatDistance } from '@/lib/distance';

interface DistanceDemoProps {
  locale: string;
}

export default function DistanceDemo({ locale }: DistanceDemoProps) {
  const [selected1, setSelected1] = useState<string>('');
  const [selected2, setSelected2] = useState<string>('');
  
  const { destinations } = destinationsData as { destinations: Destination[] };
  
  const dest1 = destinations.find(d => d.id === selected1);
  const dest2 = destinations.find(d => d.id === selected2);
  
  let distance: number | null = null;
  if (dest1 && dest2) {
    distance = haversineDistance(
      { lat: dest1.lat, lng: dest1.lng },
      { lat: dest2.lat, lng: dest2.lng }
    );
  }
  
  // Sample route: first 3 destinations
  const sampleRoute = destinations.slice(0, 3).map(d => ({
    lat: d.lat,
    lng: d.lng
  }));
  const routeDistance = totalRouteDistance(sampleRoute);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Distance Calculator Demo</h2>
      
      {/* Point to Point */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Point to Point Distance</h3>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <select 
            className="p-2 border rounded"
            value={selected1}
            onChange={(e) => setSelected1(e.target.value)}
          >
            <option value="">Select destination 1</option>
            {destinations.map(d => (
              <option key={d.id} value={d.id}>{d.name.en}</option>
            ))}
          </select>
          
          <select 
            className="p-2 border rounded"
            value={selected2}
            onChange={(e) => setSelected2(e.target.value)}
          >
            <option value="">Select destination 2</option>
            {destinations.map(d => (
              <option key={d.id} value={d.id}>{d.name.en}</option>
            ))}
          </select>
        </div>
        
        {distance !== null && (
          <div className="text-center p-3 bg-oman-green/10 rounded">
            <span className="font-medium">Distance: </span>
            <span className="text-oman-green font-bold">{formatDistance(distance)}</span>
          </div>
        )}
      </div>
      
      {/* Sample Route */}
      <div>
        <h3 className="font-semibold mb-2">Sample Route Distance</h3>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm mb-2">
            Route: {destinations.slice(0, 3).map(d => d.name.en).join(' → ')}
          </p>
          <p className="text-center font-bold text-oman-green">
            Total: {formatDistance(routeDistance)}
          </p>
        </div>
      </div>
    </div>
  );
}
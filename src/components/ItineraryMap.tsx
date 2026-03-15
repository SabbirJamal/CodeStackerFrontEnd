'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DailyRoute, Stop } from '@/types/itinerary';
import { Destination } from '@/types/destination';

const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

interface ItineraryMapProps {
  route: DailyRoute;
  allDestinations: Destination[];
}

export default function ItineraryMap({ route, allDestinations }: ItineraryMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current && mapContainerRef.current) {
      fixLeafletIcons();

      // initialize map
      const map = L.map(mapContainerRef.current).setView([23.5880, 58.3829], 7);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // updating map if route changes
  useEffect(() => {
    if (!mapRef.current || !route) return;

    const map = mapRef.current;
    
    // clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // adding markers for each stop
    const markers: L.Marker[] = [];
    const latLngs: L.LatLngExpression[] = [];

    route.stops.forEach((stop, index) => {
      const marker = L.marker([stop.location.lat, stop.location.lng])
        .addTo(map)
        .bindPopup(`
          <b>Stop ${index + 1}: ${stop.destinationName.en}</b><br>
          ${stop.arrivalTime} - ${stop.departureTime}<br>
          Duration: ${stop.duration} min
        `);
      
      markers.push(marker);
      latLngs.push([stop.location.lat, stop.location.lng]);
    });

    // draw route line
    if (latLngs.length > 1) {
      L.polyline(latLngs, { color: '#D32F2F', weight: 4 }).addTo(map);
    }

    // fit bounds to show all markers
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [route]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-lg" />;
}
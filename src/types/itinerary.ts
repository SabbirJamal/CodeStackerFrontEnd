import { Category } from './destination';

export type BudgetTier = 'low' | 'medium' | 'luxury';
export type Intensity = 'relaxed' | 'balanced' | 'packed';

export interface UserPreferences {
  duration: number; // 1-7 days
  budget: BudgetTier;
  month: number; // 1-12
  intensity: Intensity;
  preferredCategories: Category[]; // from saved interests
}

export interface Itinerary {
  id: string;
  preferences: UserPreferences;
  regionAllocation: RegionAllocation[];
  dailyItineraries: DailyItinerary[];
  totalCost: CostBreakdown;
  createdAt: string;
}

export interface RegionAllocation {
  region: string;
  days: number;
  dayNumbers: number[]; // e.g., [1,2] for days 1-2
}

export interface DailyItinerary {
  day: number;
  region: string;
  stops: Stop[];
  totalDistance: number;
  totalDuration: number;
  startTime: string;
  endTime: string;
}

export interface Stop {
  destinationId: string;
  arrivalTime: string; // "09:00"
  departureTime: string; // "11:30"
  duration: number; // in minutes
  cost: number;
}

export interface CostBreakdown {
  fuel: number;
  tickets: number;
  food: number;
  hotel: number;
  total: number;
}

// Add to existing types
export interface TimeWindow {
  start: string; // trip starting at "09:00"
  end: string;   // tring ending at "18:00"
}

export interface Stop {
  destinationId: string;
  destinationName: {
    en: string;
    ar: string;
  };
  arrivalTime: string;
  departureTime: string;
  duration: number; // in minutes
  cost: number;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface DailyRoute {
  day: number;
  region: string;
  stops: Stop[];
  totalDistance: number;
  totalDuration: number;
  startTime: string;
  endTime: string;
}

export interface RoutingConstraints {
  maxDailyDistance: number; // 250 km
  maxDailyHours: number;     // 8 hours
  maxStops: number;          // based on intensity
  longStopThreshold: number; // 90 minutes
  shortStopThreshold: number; // 45 minutes
}
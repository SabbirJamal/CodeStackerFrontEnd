import { Destination } from '@/types/destination';
import { 
  UserPreferences, 
  Itinerary, 
  DailyRoute, 
  RegionAllocation,
  CostBreakdown,
  Stop 
} from '@/types/itinerary';
import { calculateRegionScores, allocateRegionDays, RegionAllocation as RegionPlan } from './region-planner';
import { planRegionDays } from './daily-router';
import { haversineDistance } from './distance';
import { v4 as uuidv4 } from 'uuid';

// Fuel price in OMR per liter
const FUEL_PRICE = 0.240; // average fuel price approx
const FUEL_EFFICIENCY = 12; // km per liter

// hotel costs per night
const HOTEL_COSTS = {
  low: 20,
  medium: 45,
  luxury: 90
};

// food cost per person per day
const FOOD_COST_PER_DAY = 6; // OMR

// region centers for start/end points
const REGION_CENTERS: Record<string, { lat: number; lng: number }> = {
  muscat: { lat: 23.5880, lng: 58.3829 },
  dakhiliya: { lat: 22.9333, lng: 57.5333 },
  sharqiya: { lat: 22.5667, lng: 59.0289 },
  dhofar: { lat: 17.0500, lng: 54.1000 },
  batinah: { lat: 23.8000, lng: 57.5000 },
  dhahira: { lat: 23.5000, lng: 56.5000 }
};

// main function for generating a complete itinerary
export function generateItinerary(
  destinations: Destination[],
  preferences: UserPreferences
): Itinerary {
  
  // performance calculation starts here
  const startTime = performance.now();
  
  // first, calculate region scores
  const regionScores = calculateRegionScores(destinations, preferences);
  
  // second, allocate days to regions
  const regionAllocation = allocateRegionDays(regionScores, preferences.duration);
  
  // third, generate daily routes for each region
  const dailyRoutes: DailyRoute[] = [];
  
  regionAllocation.forEach(regionPlan => {
    // Getting destinations in this region
    const regionDests = destinations.filter(d => d.region.en === regionPlan.region);
    
    if (regionDests.length === 0) return;
    
    // Getting region center
    const regionCenter = REGION_CENTERS[regionPlan.region] || regionDests[0];
    
    // plan days for this region
    const regionRoutes = planRegionDays(
      regionDests,
      regionPlan.days,
      regionCenter,
      preferences.preferredCategories,
      preferences.month,
      preferences.intensity
    );
    
    // adjust day numbers based on allocation
    regionRoutes.forEach((route, index) => {
      route.day = regionPlan.dayNumbers[index];
    });
    
    dailyRoutes.push(...regionRoutes);
  });
  
  // sort routes by day
  dailyRoutes.sort((a, b) => a.day - b.day);
  
  // fourth, calculate total costs
  const totalCost = calculateTotalCost(dailyRoutes, preferences);
  
  // fifth, creating final itinerary object
  const itinerary: Itinerary = {
    id: uuidv4(),
    preferences,
    regionAllocation: regionAllocation.map(r => ({
      region: r.region,
      days: r.days,
      dayNumbers: r.dayNumbers
    })),
    dailyItineraries: dailyRoutes,
    totalCost,
    createdAt: new Date().toISOString()
  };
  
  // performance calcutation ends here with displaying the results
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  console.log(`Itinerary generated in ${totalTime.toFixed(3)} ms`);
  
  return itinerary;
}

// total cost breakdown
export function calculateTotalCost(
  dailyRoutes: DailyRoute[],
  preferences: UserPreferences
): CostBreakdown {
  
  // Calculate total distance across all days
  const totalDistance = dailyRoutes.reduce((sum, day) => sum + day.totalDistance, 0);
  
  // Fuel cost which will be total km / 12 * fuel price
  const fuelCost = (totalDistance / FUEL_EFFICIENCY) * FUEL_PRICE;
  
  // Ticket costs sum of all stop tickets
  const ticketCost = dailyRoutes.reduce((sum, day) => 
    sum + day.stops.reduce((daySum, stop) => daySum + stop.cost, 0), 0
  );
  
  // Food cost 6 OMR × days
  const foodCost = FOOD_COST_PER_DAY * preferences.duration;
  
  // Hotel cost based on budget tier
  const hotelCostPerNight = HOTEL_COSTS[preferences.budget];
  const hotelCost = hotelCostPerNight * (preferences.duration - 1); // the -1 means no hotel cost on last day
  
  const total = fuelCost + ticketCost + foodCost + hotelCost;
  
  return {
    fuel: Math.round(fuelCost * 100) / 100,
    tickets: Math.round(ticketCost * 100) / 100,
    food: Math.round(foodCost * 100) / 100,
    hotel: Math.round(hotelCost * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}

// Get explanation for why a stop was selected
export function getStopExplanation(
  stop: Stop,
  destination: Destination | undefined,
  preferences: UserPreferences
): string[] {
  if (!destination) return ['Destination not found'];
  
  const reasons: string[] = [];
  
  // Category match
  const matchingCategories = destination.categories.filter(cat => 
    preferences.preferredCategories.includes(cat as any)
  );
  
  if (matchingCategories.length > 0) {
    reasons.push(`Matches your interests: ${matchingCategories.join(', ')}`);
  }
  
  // Season fit - ensure month is treated as number
  const month = preferences.month;
  if (destination.recommended_months.includes(month as any)) {
    reasons.push(`Perfect time to visit (${new Date(2024, month-1).toLocaleString('en-US', { month: 'long'})} is ideal)`);
  } else {
    reasons.push(`Not the peak season - fewer crowds`);
  }
  
  // Cost
  if (destination.ticket_cost_omr === 0) {
    reasons.push(`Free admission`);
  } else if (destination.ticket_cost_omr < 3) {
    reasons.push(`Affordable ticket (${destination.ticket_cost_omr} OMR)`);
  }
  
  // Duration
  if (destination.avg_visit_duration_minutes < 60) {
    reasons.push(`Quick visit - fits easily into schedule`);
  }
  
  return reasons.slice(0, 2); // Return top 2 reasons
}

// Check if total cost exceeds budget threshold
export function isOverBudget(
  totalCost: number,
  budgetTier: string,
  duration: number
): boolean {
  // define budget thresholds per day
  const thresholds = {
    low: 40,    // 40 OMR per day max
    medium: 80,  // 80 OMR per day max
    luxury: 150  // 150 OMR per day max
  };
  
  const maxTotal = thresholds[budgetTier as keyof typeof thresholds] * duration;
  return totalCost > maxTotal;
}

// Suggest cost-saving alternatives
export function getCostSavingSuggestions(
  itinerary: Itinerary,
  destinations: Destination[]
): string[] {
  const suggestions: string[] = [];
  
  if (itinerary.totalCost.fuel > 20) {
    suggestions.push('Consider grouping destinations closer together to save on fuel');
  }
  
  const paidStops = itinerary.dailyItineraries.filter(day => 
    day.stops.some(stop => stop.cost > 0)
  ).length;
  
  if (paidStops > 3) {
    suggestions.push('Replace some paid attractions with free alternatives');
  }
  
  if (itinerary.preferences.budget === 'low' && itinerary.totalCost.hotel > 100) {
    suggestions.push('Consider budget accommodations or hostels');
  }
  
  return suggestions;
}
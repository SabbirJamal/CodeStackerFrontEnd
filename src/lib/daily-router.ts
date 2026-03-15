import { Destination } from '@/types/destination';
import { Stop, DailyRoute, RoutingConstraints } from '@/types/itinerary';
import { haversineDistance, totalRouteDistance } from './distance';
import { calculateDestinationScore } from './scoring';

// intensity-based constraints
export const INTENSITY_CONSTRAINTS = {
  relaxed: { maxStops: 3, maxDailyHours: 6, minBreakMinutes: 60 },
  balanced: { maxStops: 4, maxDailyHours: 8, minBreakMinutes: 45 },
  packed: { maxStops: 5, maxDailyHours: 10, minBreakMinutes: 30 }
};

// time helpers
export function timeToMinutes(time: string): number {
  if (!time) return 0;
  const parts = time.split(':');
  if (parts.length !== 2) return 0;
  const [hours, minutes] = parts.map(Number);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  if (minutes < 0) minutes = 0;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const currentMinutes = timeToMinutes(time);
  return minutesToTime(currentMinutes + minutesToAdd);
}

// checking if a stop is long which is more than 90 min
export function isLongStop(duration: number): boolean {
  return duration > 90;
}

// checking if a stop is short which will be less than 45 min
export function isShortStop(duration: number): boolean {
  return duration < 45;
}

// validating the stop rhythm 
export function validateStopRhythm(stops: Stop[]): boolean {
  for (let i = 0; i < stops.length - 1; i++) {
    const currentLong = isLongStop(stops[i].duration);
    const nextLong = isLongStop(stops[i + 1].duration);
    
    // if there are 2 long stops, then it would be placed within same day
    if (currentLong && nextLong) {
      return false;
    }
  }
  return true;
}

// Calculate travel time between stops
export function calculateTravelTime(distanceKm: number): number {
  return Math.ceil((distanceKm / 60) * 60); //the first 60 means60km/p and 2nd 60 means 60 mins
}

// main routing function for a single day
export function planDailyRoute(
  availableDestinations: Destination[],
  selectedDestinations: string[], 
  startPoint: { lat: number; lng: number },
  endPoint: { lat: number; lng: number },
  constraints: RoutingConstraints,
  userCategories: string[],
  travelMonth: number
): { route: Stop[]; score: number } {
  
  if (availableDestinations.length === 0) {
    return { route: [], score: 0 };
  }
  
  // start with first stop which will be the closest to start point
  let currentPoint = startPoint;
  let currentTimeMinutes = timeToMinutes('09:00'); // this states that the traveling time starts from 9 AM
  let remainingHours = constraints.maxDailyHours * 60;
  let selectedStopIds: string[] = [...selectedDestinations];
  let route: Stop[] = [];
  let totalScore = 0;
  
  const categoryCounts: Record<string, number> = {};
  
  while (route.length < constraints.maxStops && availableDestinations.length > 0) {
    // score remaining destinations
    const candidates = availableDestinations
      .filter(d => !selectedStopIds.includes(d.id))
      .map(dest => {
        // distance from current point
        const distance = haversineDistance(
          currentPoint,
          { lat: dest.lat, lng: dest.lng }
        );
        
        // travel time
        const travelTime = calculateTravelTime(distance);
        
        // checking is there is another stop and IF IT'LL FIT IN THE REMAINING TIME AVAILBLE
        const totalStopTime = travelTime + dest.avg_visit_duration_minutes;
        if (totalStopTime > remainingHours) {
          return null;
        }
        
        // checking category variety
        const categoryRepeat = dest.categories.some(cat => 
          (categoryCounts[cat] || 0) >= 2
        );
        
        if (categoryRepeat) {
          return null;
        }
        
        // createing potential stop
        const arrivalTimeMinutes = currentTimeMinutes + travelTime;
        const departureTimeMinutes = arrivalTimeMinutes + dest.avg_visit_duration_minutes;
        
        const potentialStop: Stop = {
          destinationId: dest.id,
          destinationName: dest.name,
          arrivalTime: minutesToTime(arrivalTimeMinutes),
          departureTime: minutesToTime(departureTimeMinutes),
          duration: dest.avg_visit_duration_minutes,
          cost: dest.ticket_cost_omr,
          category: dest.categories[0],
          location: { lat: dest.lat, lng: dest.lng }
        };
        
        // Checking for stop rhythm
        if (route.length > 0) {
          const tempRoute = [...route, potentialStop];
          if (!validateStopRhythm(tempRoute)) {
            return null;
          }
        }
        
        // score calculation
        const baseScore = calculateDestinationScore(
          dest,
          userCategories as any,
          travelMonth,
          [], 
          availableDestinations
        );
        
        // Distance penalty (closer is better)
        const distancePenalty = Math.min(distance / 100, 1); // 0-1 penalty
        
        return {
          destination: dest,
          stop: potentialStop,
          score: baseScore * (1 - distancePenalty * 0.3), // 30% weight on distance
          travelTime,
          distance
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .sort((a, b) => b.score - a.score);
    
    if (candidates.length === 0) break;
    
    const best = candidates[0];
    
    // Update Counts
    best.destination.categories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    // update Route
    route.push(best.stop);
    selectedStopIds.push(best.destination.id);
    
    // update current point and time
    currentPoint = { lat: best.destination.lat, lng: best.destination.lng };
    const timeSpent = best.travelTime + best.destination.avg_visit_duration_minutes;
    currentTimeMinutes += timeSpent;
    remainingHours -= timeSpent;
    totalScore += best.score;
  }
  
  // dd travel Back to end point if needed
  if (route.length > 0) {
    const lastStop = route[route.length - 1];
    const returnDistance = haversineDistance(
      { lat: lastStop.location.lat, lng: lastStop.location.lng },
      endPoint
    );
    const returnTime = calculateTravelTime(returnDistance);
    
    // checking if return trip fits
    if (returnTime > remainingHours && route.length > 0) {
      // if too far to return - remove last stop
      route.pop();
    }
  }
  
  return { route, score: totalScore };
}

// 2-opt optimization to improve route order
export function optimizeRouteWith2Opt(
  stops: Stop[],
  startPoint: { lat: number; lng: number },
  endPoint: { lat: number; lng: number }
): Stop[] {
  if (stops.length < 3) return stops;
  
  let improved = true;
  let bestRoute = [...stops];
  
  while (improved) {
    improved = false;
    
    for (let i = 0; i < bestRoute.length - 1; i++) {
      for (let j = i + 1; j < bestRoute.length; j++) {
        // create new route by reversing segment i to j
        const newRoute = [
          ...bestRoute.slice(0, i),
          ...bestRoute.slice(i, j + 1).reverse(),
          ...bestRoute.slice(j + 1)
        ];
        
        // calculate total distance for both routes
        const currentDistance = calculateRouteDistance(bestRoute, startPoint, endPoint);
        const newDistance = calculateRouteDistance(newRoute, startPoint, endPoint);
        
        if (newDistance < currentDistance) {
          bestRoute = newRoute;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }
  
  return bestRoute;
}

// Calculate total distance for a route including start and end
export function calculateRouteDistance(
  stops: Stop[],
  startPoint: { lat: number; lng: number },
  endPoint: { lat: number; lng: number }
): number {
  if (stops.length === 0) return 0;
  
  let total = 0;
  let prev = startPoint;
  
  for (const stop of stops) {
    total += haversineDistance(prev, stop.location);
    prev = stop.location;
  }
  
  total += haversineDistance(prev, endPoint);
  return total;
}

// this is the main function tonplan all days 
export function planRegionDays(
  regionDestinations: Destination[],
  daysInRegion: number,
  regionCenter: { lat: number; lng: number },
  userCategories: string[],
  travelMonth: number,
  intensity: 'relaxed' | 'balanced' | 'packed'
): DailyRoute[] {
  
  const constraints = INTENSITY_CONSTRAINTS[intensity];
  const dailyRoutes: DailyRoute[] = [];
  
  let availableDestinations = [...regionDestinations];
  let selectedDestinationIds: string[] = [];
  
  for (let day = 1; day <= daysInRegion; day++) {
    // filter out already selected destinations
    const remainingDests = availableDestinations.filter(
      d => !selectedDestinationIds.includes(d.id)
    );
    
    if (remainingDests.length === 0) break;
    
    // plan single day
    const { route, score } = planDailyRoute(
      remainingDests,
      selectedDestinationIds,
      regionCenter, // start from region center
      regionCenter, // end at region center
      {
        maxDailyDistance: 250,
        maxDailyHours: constraints.maxDailyHours,
        maxStops: constraints.maxStops,
        longStopThreshold: 90,
        shortStopThreshold: 45
      },
      userCategories,
      travelMonth
    );
    
    if (route.length > 0) {
      // optimize route order
      const optimizedRoute = optimizeRouteWith2Opt(route, regionCenter, regionCenter);
      
      // calculate total distance
      const totalDistance = calculateRouteDistance(optimizedRoute, regionCenter, regionCenter);
      
      // calculate times
      const startTime = '09:00';
      let lastTime = timeToMinutes(startTime);
      
      const stopsWithTimes = optimizedRoute.map((stop) => {
        //create a new stop object with updated times
        return {
          ...stop
        };
      });
      
      dailyRoutes.push({
        day,
        region: regionDestinations[0]?.region.en || 'unknown',
        stops: stopsWithTimes,
        totalDistance,
        totalDuration: constraints.maxDailyHours * 60,
        startTime,
        endTime: stopsWithTimes.length > 0 
          ? stopsWithTimes[stopsWithTimes.length - 1].departureTime 
          : startTime
      });
      
      // mark destinations as used
      route.forEach(stop => {
        selectedDestinationIds.push(stop.destinationId);
      });
    }
  }
  
  return dailyRoutes;
}
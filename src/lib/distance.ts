/**
 * Calculates the distance between two points on Earth using the Haversine formula
 * @param point1 { lat: number, lng: number }
 * @param point2 { lat: number, lng: number }
 * @returns Distance in kilometers
 */
export function haversineDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in kilometers
  
  const lat1 = toRadians(point1.lat);
  const lat2 = toRadians(point2.lat);
  const deltaLat = toRadians(point2.lat - point1.lat);
  const deltaLng = toRadians(point2.lng - point1.lng);
  
  const a = 
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates total distance for a sequence of points
 * @param points Array of { lat, lng } coordinates in order
 * @returns Total distance in kilometers
 */
export function totalRouteDistance(
  points: Array<{ lat: number; lng: number }>
): number {
  if (points.length < 2) return 0;
  
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += haversineDistance(points[i], points[i + 1]);
  }
  return total;
}

/**
 * Calculates the detour penalty when adding a new stop to an existing route
 * @param route Original route points
 * @param newStop The new point to insert
 * @param insertAtIndex Position to insert (0 = start, route.length = end)
 * @returns Additional distance in kilometers
 */
export function calculateDetour(
  route: Array<{ lat: number; lng: number }>,
  newStop: { lat: number; lng: number },
  insertAtIndex: number
): number {
  if (route.length === 0) return 0;
  if (route.length === 1) {
    return haversineDistance(route[0], newStop) * 2; // Round trip
  }
  
  // Validate index
  const index = Math.max(0, Math.min(insertAtIndex, route.length));
  
  if (index === 0) {
    // Insert at start: newStop -> old start
    return haversineDistance(newStop, route[0]);
  } else if (index === route.length) {
    // Insert at end: old end -> newStop
    return haversineDistance(route[route.length - 1], newStop);
  } else {
    // Insert in middle: A -> newStop -> B instead of A -> B
    const prev = route[index - 1];
    const next = route[index];
    const originalDistance = haversineDistance(prev, next);
    const newDistance = haversineDistance(prev, newStop) + haversineDistance(newStop, next);
    return newDistance - originalDistance;
  }
}

/**
 * Formats distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}
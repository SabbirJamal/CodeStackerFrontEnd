import { Destination, Category } from '@/types/destination';
import { haversineDistance } from './distance';

// Weights (must be documented and justified)
export const WEIGHTS = {
  interest: 0.30,  // 30% - User preferences matter most
  season: 0.25,     // 25% - Seasonal suitability is important
  crowd: -0.15,     // -15% - Penalty for crowded places
  cost: -0.15,      // -15% - Penalty for expensive tickets
  detour: -0.10,    // -10% - Penalty for out-of-way stops
  diversity: 0.05   // 5%  - Bonus for variety
};

// Normalize a value to [0,1] range
export function normalize(
  value: number,
  min: number,
  max: number
): number {
  if (max === min) return 0.5; // Avoid division by zero
  return (value - min) / (max - min);
}

// calculate Jaccard similarity between two sets of categories
export function jaccardSimilarity(
  userCategories: Category[],
  destinationCategories: Category[]
): number {
  if (userCategories.length === 0) return 0;
  if (destinationCategories.length === 0) return 0;
  
  // findin the intersection
  const intersection = destinationCategories.filter(cat => 
    userCategories.includes(cat)
  ).length;
  
  // Find union
  const union = new Set([...userCategories, ...destinationCategories]).size;
  
  return intersection / union;
}

// Calculate season fit score
export function seasonFit(
  travelMonth: number,
  recommendedMonths: number[]
): number {
  if (recommendedMonths.length === 0) return 0.5; // Neutral if no data
  
  // Check if current month is recommended
  if (recommendedMonths.includes(travelMonth)) {
    return 1.0; // if return is 1.0, then is it Perfect fit
  }
  
  // Find closest recommended month and calculate distance
  let minDistance = 12; // Max distance between months
  for (const month of recommendedMonths) {
    let distance = Math.abs(travelMonth - month);
    // Handle wrap-around 
    distance = Math.min(distance, 12 - distance);
    minDistance = Math.min(minDistance, distance);
  }
  
  // Convert distance to score: 1 month away = 0.8, 2 months = 0.5, 3+ months = 0.2
  if (minDistance === 1) return 0.8;
  if (minDistance === 2) return 0.5;
  return 0.2;
}

// Normalize crowd level (1-5 to 0-1, where 1 is least crowded)
export function normalizeCrowd(crowdLevel: number): number {
  return normalize(6 - crowdLevel, 1, 5); // Invert so lower crowd = higher score
}

// Normalize cost (0-20 OMR range)
export function normalizeCost(cost: number): number {
  const MAX_TICKET_COST = 20; // Assume max ticket is 20 OMR
  return normalize(Math.min(cost, MAX_TICKET_COST), 0, MAX_TICKET_COST);
}

// Calculate detour penalty when adding a stop to existing route
export function calculateDetourScore(
  destination: Destination,
  currentRoute: Destination[],
  allDestinations: Destination[]
): number {
  if (currentRoute.length === 0) return 0; // No penalty for first stop
  
  // find closest point in current route
  let minDistance = Infinity;
  for (const stop of currentRoute) {
    const dist = haversineDistance(
      { lat: stop.lat, lng: stop.lng },
      { lat: destination.lat, lng: destination.lng }
    );
    minDistance = Math.min(minDistance, dist);
  }
  
  // Normalize: 0km = 0 penalty, 200km+ = max penalty
  const MAX_DETOUR = 200; // km
  return normalize(Math.min(minDistance, MAX_DETOUR), 0, MAX_DETOUR);
}

// Calculate diversity gain (how different is this from already selected)
export function calculateDiversityGain(
  destination: Destination,
  selectedSet: Destination[]
): number {
  if (selectedSet.length === 0) return 0.5; // Neutral for first selection
  
  // Check category overlap
  const selectedCategories = new Set(
    selectedSet.flatMap(d => d.categories)
  );
  
  const newCategories = destination.categories.filter(
    cat => !selectedCategories.has(cat)
  ).length;
  
  const totalNewCategories = destination.categories.length;
  
  // More new categories = higher diversity gain
  return totalNewCategories > 0 ? newCategories / totalNewCategories : 0;
}

// Main scoring function
export function calculateDestinationScore(
  destination: Destination,
  userCategories: Category[],
  travelMonth: number,
  currentRoute: Destination[] = [],
  allDestinations: Destination[] = []
): number {
  // Calculate individual components
  const interestScore = jaccardSimilarity(userCategories, destination.categories);
  const seasonScore = seasonFit(travelMonth, destination.recommended_months);
  const crowdScore = normalizeCrowd(destination.crowd_level);
  const costScore = normalizeCost(destination.ticket_cost_omr);
  const detourScore = calculateDetourScore(destination, currentRoute, allDestinations);
  const diversityScore = calculateDiversityGain(destination, currentRoute);
  
  // Apply weights, actual weights are negative
  const totalScore = 
    WEIGHTS.interest * interestScore +
    WEIGHTS.season * seasonScore +
    WEIGHTS.crowd * crowdScore +      
    WEIGHTS.cost * costScore +         
    WEIGHTS.detour * (1 - detourScore) + // Convert detour penalty to positive score
    WEIGHTS.diversity * diversityScore;
  
  return totalScore;
}

// Get explanation of score components
export function getScoreBreakdown(
  destination: Destination,
  userCategories: Category[],
  travelMonth: number
): {
  components: Record<string, number>;
  total: number;
  topReasons: string[];
} {
  const interestScore = jaccardSimilarity(userCategories, destination.categories);
  const seasonScore = seasonFit(travelMonth, destination.recommended_months);
  const crowdScore = normalizeCrowd(destination.crowd_level);
  const costScore = normalizeCost(destination.ticket_cost_omr);
  
  const components = {
    interest: interestScore,
    season: seasonScore,
    crowd: crowdScore,
    cost: costScore
  };
  
  const total = 
    WEIGHTS.interest * interestScore +
    WEIGHTS.season * seasonScore +
    WEIGHTS.crowd * crowdScore +
    WEIGHTS.cost * costScore;
  
  // Find top 2 contributing factors
  const reasons: string[] = [];
  const weightedComponents = [
    { name: 'Category Match', value: WEIGHTS.interest * interestScore },
    { name: 'Season Fit', value: WEIGHTS.season * seasonScore },
    { name: 'Low Crowds', value: WEIGHTS.crowd * crowdScore },
    { name: 'Affordable', value: WEIGHTS.cost * costScore }
  ];
  
  weightedComponents
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .forEach(c => reasons.push(c.name));
  
  return {
    components,
    total,
    topReasons: reasons
  };
}
import { Destination, Region } from '@/types/destination';
import { UserPreferences } from '@/types/itinerary';
import { seasonFit } from './scoring';

export interface RegionAllocation {
  region: string;
  days: number;
  dayNumbers: number[]; // [1,2] for days 1-2
  score: number; // How well this region matches preferences
}

export interface RegionScore {
  region: string;
  baseScore: number; // Average score of destinations in region
  seasonScore: number; // Season fit for this region
  destinationCount: number;
  topDestinations: Destination[];
}

/**
 * Calculate region scores based on user preferences
 */
export function calculateRegionScores(
  destinations: Destination[],
  preferences: UserPreferences
): RegionScore[] {
  const regions = new Map<string, Destination[]>();
  
  // Group destinations by region
  destinations.forEach(dest => {
    const region = dest.region.en;
    if (!regions.has(region)) {
      regions.set(region, []);
    }
    regions.get(region)!.push(dest);
  });
  
  const regionScores: RegionScore[] = [];
  
  regions.forEach((dests, region) => {
    // Calculate average season fit for this region
    let totalSeasonScore = 0;
    dests.forEach(dest => {
      totalSeasonScore += seasonFit(preferences.month, dest.recommended_months);
    });
    const avgSeasonScore = totalSeasonScore / dests.length;
    
    // calculate interest match (based on categories)
    let totalInterestScore = 0;
    dests.forEach(dest => {
      const matchCount = dest.categories.filter(cat => 
        preferences.preferredCategories.includes(cat)
      ).length;
      totalInterestScore += matchCount / Math.max(dest.categories.length, 1);
    });
    const avgInterestScore = totalInterestScore / dests.length;
    
    // Combined base score (interest + season)
    const baseScore = (avgInterestScore * 0.6 + avgSeasonScore * 0.4);
    
    // get top destinations in this region
    const topDestinations = [...dests]
      .sort((a, b) => {
        const scoreA = avgInterestScore; // Simplified for now
        const scoreB = avgInterestScore;
        return scoreB - scoreA;
      })
      .slice(0, 3);
    
    regionScores.push({
      region,
      baseScore,
      seasonScore: avgSeasonScore,
      destinationCount: dests.length,
      topDestinations
    });
  });
  
  return regionScores.sort((a, b) => b.baseScore - a.baseScore);
}

 // allocate days to regions based on scores and constraints
export function allocateRegionDays(
  regionScores: RegionScore[],
  totalDays: number
): RegionAllocation[] {
  if (totalDays === 0 || regionScores.length === 0) return [];
  
  const maxDaysPerRegion = Math.ceil(totalDays / 2);
  const minRegions = totalDays >= 3 ? 2 : 1;
  
  // initialize allocation
  let remainingDays = totalDays;
  const allocation: RegionAllocation[] = [];
  
  // first, ensure minimum region count if needed
  if (minRegions > 1 && regionScores.length >= 2) {
    // Give at least 1 day to top 2 regions
    for (let i = 0; i < Math.min(minRegions, regionScores.length); i++) {
      allocation.push({
        region: regionScores[i].region,
        days: 1,
        dayNumbers: [],
        score: regionScores[i].baseScore
      });
      remainingDays--;
    }
  }
  
  // distribute remaining days based on scores
  while (remainingDays > 0) {
    // Find region with highest score that hasn't reached max
    let bestRegionIndex = -1;
    let bestScore = -1;
    
    for (let i = 0; i < regionScores.length; i++) {
      const region = regionScores[i];
      const currentAllocation = allocation.find(a => a.region === region.region);
      const currentDays = currentAllocation?.days || 0;
      
      if (currentDays < maxDaysPerRegion) {
        // calculate effective score (slightly reduce score if region already has days)
        const effectiveScore = region.baseScore * (1 - (currentDays * 0.1));
        if (effectiveScore > bestScore) {
          bestScore = effectiveScore;
          bestRegionIndex = i;
        }
      }
    }
    
    if (bestRegionIndex === -1) break; // no region can take more days
    
    const selectedRegion = regionScores[bestRegionIndex];
    const existingAlloc = allocation.find(a => a.region === selectedRegion.region);
    
    if (existingAlloc) {
      existingAlloc.days++;
    } else {
      allocation.push({
        region: selectedRegion.region,
        days: 1,
        dayNumbers: [],
        score: selectedRegion.baseScore
      });
    }
    
    remainingDays--;
  }
  
  // Sort allocation by score (best regions first)
  const sortedAllocation = allocation.sort((a, b) => b.score - a.score);
  
  // assigning day numbers
  let currentDay = 1;
  sortedAllocation.forEach(alloc => {
    alloc.dayNumbers = [];
    for (let i = 0; i < alloc.days; i++) {
      alloc.dayNumbers.push(currentDay++);
    }
  });
  
  return sortedAllocation;
}

 // Generation of human-readable region allocation plan
export function formatRegionAllocation(
  allocation: RegionAllocation[],
  locale: string
): string[] {
  return allocation.map(alloc => {
    const dayRange = alloc.days === 1 
      ? `Day ${alloc.dayNumbers[0]}`
      : `Days ${alloc.dayNumbers[0]}-${alloc.dayNumbers[alloc.dayNumbers.length - 1]}`;
    
    const regionName = alloc.region.charAt(0).toUpperCase() + alloc.region.slice(1);
    
    if (locale === 'en') {
      return `${dayRange}: ${regionName} (${alloc.days} day${alloc.days > 1 ? 's' : ''})`;
    } else {
      // Arabic version
      const days = alloc.days === 1 ? 'يوم' : 'أيام';
      return `${dayRange}: ${regionName} (${alloc.days} ${days})`;
    }
  });
}

 // Check if allocation meets all constraints
export function validateAllocation(
  allocation: RegionAllocation[],
  totalDays: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // check for total days
  const allocatedDays = allocation.reduce((sum, a) => sum + a.days, 0);
  if (allocatedDays !== totalDays) {
    errors.push(`Total days mismatch: allocated ${allocatedDays}, expected ${totalDays}`);
  }
  
  // checking minimum regions constraint
  if (totalDays >= 3 && allocation.length < 2) {
    errors.push(`Need at least 2 regions for ${totalDays}-day trip`);
  }
  
  // checkong max days per region
  const maxPerRegion = Math.ceil(totalDays / 2);
  allocation.forEach(a => {
    if (a.days > maxPerRegion) {
      errors.push(`Region ${a.region} has ${a.days} days, max is ${maxPerRegion}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
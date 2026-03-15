export type Region = 'muscat' | 'dakhiliya' | 'sharqiya' | 'dhofar' | 'batinah' | 'dhahira';
export type Category = 'mountain' | 'beach' | 'culture' | 'desert' | 'nature' | 'food';
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type CrowdLevel = 1 | 2 | 3 | 4 | 5;

export interface Destination {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  lat: number;
  lng: number;
  image: string;
  region: {
    en: Region;
    ar: string;
  };
  categories: Category[];
  avg_visit_duration_minutes: number;
  ticket_cost_omr: number;
  recommended_months: Month[];
  crowd_level: CrowdLevel;
}

export interface DestinationsData {
  destinations: Destination[];
}
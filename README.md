Visit Oman - Discover & Plan
This is a bilingual (English/Arabic) tourism platform for Oman that helps visitors discover destinations and generate optimized travel itineraries entirely in the browser.
This website basically helps users/tourists to get a guide on what places to visit in Oman by selecting there budget, crowd intensity, month of travel. 

Project Overview
This project was built for the CODESTACKER 2026 Frontend Development Challenge. It consists of two main parts:
  1.Marketing Site (SSR)** - Destination discovery with bilingual support
  2.Itinerary Generator (CSR)** - Intelligent trip planning with constraint-based optimization

Techs/tools used
 -Framework: Next.js 15 with App Router
 -Language: TypeScript
 -Styling: Tailwind CSS
 -State Management: Zustand with localStorage persistence
 -Maps: Leaflet + React-Leaflet
 -Internationalization: next-intl
 -Utilities: date-fns, uuid

 Features
 This project aimed to complete 2 main features (competition requriments)
   Part 1: Marketing Site
     -Bilingual (English/Arabic) with RTL support
     -Landing page with hero, categories, featured destinations
     -Destination browsing with filters (category, region, season)
     -URL query parameters for shareable filters
     -Destination detail pages with maps
     -Save interests with localStorage persistence
     -Saved interests page

   Part 2: Itinerary Generator
     -User preferences form (duration, budget, month, intensity)
     -Multi-objective scoring with normalized weights
     -Region-level planning with day allocation
     -Daily routing with hard constraints:
        -Max 250km driving distance per day
        -Max 8 hours visit time per day
        -Stop rhythm (long/short alternation)
        -Category variety
        -Intensity-based stop limits
     -Haversine distance calculations
     -2-opt optimization for route improvement
     -Budget calculations (fuel, tickets, food, hotel)
     -Interactive maps with route visualization
     -Explanation panel for stop selections
     -Full persistence across refresh

Explanation of Algorithm
    Scoring Weights
        | Component       | Weight | Justification                            |
        |-----------------|--------|------------------------------------------|
        | Interest Match  | 30%    | User preferences should drive selections |
        | Season Fit      | 25%    | Timing is crucial for experience quality |
        | Crowd Level     | -15%   | Penalty for overcrowded locations        |
        | Ticket Cost     | -15%   | Budget consciousness                     |
        | Detour Penalty  | -10%   | Efficiency matters                       |
        | Diversity Bonus | 5%     | Encourage variety                        |
        All components are normalized to [0,1] before weighting.
    
    Optimization Approach
        2-opt local search was implemented for route optimization as:
          -Deterministic (no randomness)
          -Guarantees improvement over greedy solution
          -Computationally feasible in browser
          -Well-suited for TSP-like routing problems

    Constrains Implementation
        -Daily distance: Hard cap at 250km using Haversine formula
        -Visit time: Sum of durations + travel time ≤ intensity limit
        -Stop rhythm: Long stops (>90min) cannot be adjacent
        -Category variety: Same category ≤ 2 times per day
        -Region consistency: Each day starts/ends in same region

Pre-requisites required
-node.js v20.18.3 or later
-npm or yarn


Installation (```bash)
1. git clone []

# Navigate to project (code could be different based on file location)
2. cd fecomp

# Install required dependencies for running the project
3. npm install

# Run development server
4. npm run dev

Go to browser abd paste the url that was achieved for bash or copy paste this url `http://localhost:3000/en`


Addition to the main website, there are 4 other pages that was used for testing. 
These are the different algorithms use but not combined into 1
-`/en/distance-test` - Haversine distance calculator
-`/en/score-test` - Multi-objective scoring
-`/en/region-test` - Region allocation
-`/en/routing-test` - Daily routing with constraints

 Performance Considerations
    -All calculations run client-side (no API calls)
    -Haversine formula is O(n²) but n ≤ 5 stops/day
    -2-opt optimization runs in O(n³) but n is small
    -Dynamic imports for map components
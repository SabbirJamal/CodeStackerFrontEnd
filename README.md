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

Rendering Strategy (SSR,CSR)
 For this project SSR (server side rendering) was choseing for marketing the pages. Here is a breakdown why SSR is choosen-
   Home page - Search engines require SEO content to be visible. if it is client-rendered, search engine will fail
   Destination Page- when using filters for contents, the preview should show actual content and crash or loading screen.
   Destination detail page - these pages works completed on the json dataset file. So using SSR, the pages can load faster when shared.

 For the interactive parts, CSR (Client side rending) is used. Below is breakdown - 
   Plan Form - this has details like sliders buttin real time validation etc which is easy for client render to handle.
   Results page - the map which is leaflet will not at all work in CSR isnt utilised. The internary changes based on inputs.

  The SSR is fast when is comes to displaying content, but can be slow when generating on server. And CSR pages shows complete blank screen without js.

Weigh Selection Reationale (Algorithm)
 The competition had given formula's but not the actual weights. Here is the final weight decided after multiple tries
   Interest Match   -   30%  -  Users choosing there intrest such as beach or mountain or anything like tht plays the most important curcial rule. If the users look for beach, they should get beach.
                                so for this intrest match, first 40% weight was given. But this resulted the algorithm to be very aggresive. towards 35, it was decent but not giveing a good match. 30% fit perfect.
   Season Fit       -   25%  -  Timings gives a big impact. FOr example salalah is good for visiting during khareef (march) but other times its just hot desert. So had to give a good weight for season but not 
                                overide preferences completely. 25% seemed perfect.
   Crowd Level      -   15%  -  Crowd is something that different people have different opinion on. Some places are fun with more crowd but some arent. The weight was given of 15%. This means crowded placess can still be
                                chosen even if they are perfect for other categories. 
   Ticket Cost      -   15%  -  Tickets and crowds logic is similar. Budget maaters, but if the paid locations are perfect, then why not. Torusit would still visit.
   Detour Penalty   -   10%  -  Detours cannot be penalized heavily as there could be sometimes amazing spots which are often off rarely visited or remote places which toursists often miss. 10% means it shows that  
                                maybe theres a slight chance that it might be worth visitng.
   Diversity Bonus  -   5%   -  It just a small encouragements to mix up things but not very strong to force a different variety.
   
   If takeing interest match more than 35%, always same category locations are found. If season fit is less tha 20%, same suggestions happen for example salalah gets suggested in march which is a big no. These weights seem most balanced at this point.

Normalization Strategy
  Normalization is basically converting scores into 0 and 1. Why requried to convert, bcz we need to take values of crowd level, entry fee etc to compare and give results to user. Now if we dont convert the values in 0 and 1, entry cost will be more than crown level. For example say entry cost is 15 and crownd level is 2, it just doesnt give perfect solution if not normalised. So the solution is to normalise the values to 0 and 1.  is for worst case adn 1 is for the best case.
  The components are nomarlized as
    Interest Match	  0-1 (already)	    Jaccard similarity naturally returns 0-1 - no transformation needed
    Season Fit	      0-1 (custom)	    Perfect month = 1.0, 1 month off = 0.8, 2 months off = 0.5, 3+ months off = 0.2
    Crowd Level	      1-5	              Invert (so 1 becomes best) then scale: (6 - crowdLevel) / 4
    Ticket Cost	      0-20+ OMR	        Cap at 20 OMR (reasonable maximum), then divide by 20
    Detour Penalty	  0-200+ km        	Cap at 200km (extreme detour), then divide by 200
    Diversity Bonus	  0-1 (already)	    Ratio of new categories to total categories
    Since we do normalization, it becomes eaasy to
    -To have a air comparison as each component contributes based on its weight, not its raw magnitude
    -Weighted math works as we can multiply weights (0.30) by normalized values (0-1)
    -Intuitive results as score of 0.75 clearly means "75% of perfect"


Limitations and tradeoffs
-The destination dataset is limited. Having more number of destinations can make better accurate results. The itineraries would be showing better results
-No real road distance are used. the challenge requirement was to huse haversine formula to calculate distance. Unfortunately this formula calculates straight path only. and the roads are ofcourse not straight.
-mobile experience would be bad expereince. Everything will be packed.

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



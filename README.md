#Visit Oman - Discover & Plan
This is a bilingual (English/Arabic) tourism platform for Oman that helps visitors discover destinations and generate optimized travel itineraries entirely in the browser.
This website basically helps users/tourists to get a guide on what places to visit in Oman by selecting there budget, crowd intensity, month of travel. 

Project Overview
This project was built for the CODESTACKER 2026 Frontend Development Challenge. It consists of two main parts:
  1.Marketing Site (SSR) - Destination discovery with bilingual support
  2.Itinerary Generator (CSR) - Intelligent trip planning with constraint-based optimization

#Techs/tools used
 -Framework: Next.js 15 with App Router
 -Language: TypeScript
 -Styling: Tailwind CSS
 -State Management: Zustand with localStorage persistence
 -Maps: Leaflet + React-Leaflet
 -Internationalization: next-intl
 -Utilities: date-fns, uuid


 #Features
 This project aimed to complete 2 main features (competition requriments)

   ##Part 1: Marketing Site
     -Bilingual (English/Arabic) with RTL support
     -Landing page with hero, categories, featured destinations
     -Destination browsing with filters (category, region, season)
     -URL query parameters for shareable filters
     -Destination detail pages with maps
     -Save interests with localStorage persistence
     -Saved interests page

   ##Part 2: Itinerary Generator
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


Pre-requisites required
- node.js v20.18.3 or later
- npm or yarn


@@setup and Installation (```bash)

     1.git clone https://github.com/SabbirJamal/CodeStackerFrontEnd
    
     2.Navigate to project (code could be different based on file location)
    cd fecomp

     3.Install required dependencies for running the project
    npm install

     4.Run development server
    npm run dev

     Go to browser abd paste the url that was achieved for bash or copy paste this url `http://localhost:3000/en`

#architecture overview
  ##Core Application Files (The Foundation)
    File Path	                         Purpose	                                        Architecture Role
      src/app/layout.tsx	            Root layout with HTML structure	                  Foundation of all pages
      src/app/[locale]/layout.tsx   	Locale-specific layout (English/Arabic)	          Handles RTL/LTR switching
      src/middleware.ts             	Language detection & routing	                    Redirects to correct locale
      src/i18n/request.ts	            Internationalization config	                      Loads translations
      src/i18n/routing.ts	            Route definitions for locales	                    Defines supported languages

  ##SSR Pages (Marketing Site)
    File Path                                                   	Purpose                                     	reason
    src/app/[locale]/page.tsx	                          Landing page with hero + categories	        SEO critical, fast initial load
    src/app/[locale]/destinations/page.tsx	            estination browsing with filters	          Shareable URLs need server rendering
    src/app/[locale]/destinations/[id]/page.tsx	         ndividual destination details	            Static generation possible

  ##CSR Pages (Interactive Planner)
    File Path	                                                    Purpose	                             reason
    src/app/[locale]/plan/page.tsx	                  Itinerary form with user inputs	      Needs client-side interactivity
    src/app/[locale]/plan/results/page.tsx	          Generated itinerary display	          Maps require browser
    src/app/[locale]/saved/page.tsx	                  Saved interests page	                Dynamic data from localStorage

  ##Test Pages (Algorithm Verification)
    File Path	                                                          Purpose
      src/app/[locale]/distance-test/page.tsx	            haversine distance calculator test
      src/app/[locale]/score-test/page.tsx	              Multi-objective scoring test
      src/app/[locale]/region-test/page.tsx	                Region allocation test
      src/app/[locale]/routing-test/page.tsx	              Daily routing constraints test

  ##Reusable Components     
    File Path	                                            Purpose
      src/components/LanguageSwitcher.tsx	        English/Arabic toggle
      src/components/DestinationCard.tsx	        reusable destination card with image
      src/components/CategoryCard.tsx	            Category display card
      src/components/SaveButton.tsx	            Save/unsave toggle with localStorage
      src/components/Map.tsx	                   ingle destinataion map
      src/components/ItineraryMap.tsx	           Multi-stop route map
      src/components/ItineraryForm.tsx	         user input form
      src/components/LoadingSpinner.tsx	          Lottie animation loader

  ##State Management
          File Path	Purpose	                                         Technology
      src/store/useInterestsStore.ts	    Saved interests with localStorage	Zustand + persist middleware

  ##Core Algorithms (The Brain)
      File Path	                                Purpose	Key                                    Functions
      src/lib/distance.ts             	Haversine calculations	              haversineDistance(), totalRouteDistance()
      src/lib/scoring.ts	              Multi-objective scoring	               calculateDestinationScore(), Jaccard similarity
      src/lib/region-planner.ts	        Region allocation	                    calculateRegionScores(), allocateRegionDays()
      src/lib/daily-router.ts	          Daily routing with 2-opt	          planDailyRoute(), optimizeRouteWith2Opt()
      src/lib/itinerary-generator.ts	  Main orchestration	                  generateItinerary(), budget calculations

  ##Data & Types
    File Path                                   	Purpose
    src/data/destinations.json	      All destination data (15 destinations)
    src/types/destination.ts	        TypeScript interfaces for destinations
    src/types/itinerary.ts	          TypeScript interfaces for itineraries

  Internationalization
    File Path	                        Purpose
    messages/en.json	          English translations
      messages/ar.json	      Arabic translations (RTL support)

  Configuration Files
      File                                  Path	Purpose
    next.config.ts	Next.js       configuration with i18n plugin
      tailwind.config.ts	        Tailwind CSS with Oman theme colors
      tsconfig.json	              TypeScript configuration
      package.json	               Dependencies and scripts

#State Management Approach.
  The state management approach choosen for this project is Zustand. The reason of choosing zustand is its very simple, persistence and lightweight. For this project the only global state management required is the s'saved interests'. Remaing all are urls, form inputs, generative itinerary  and language prefereances. How zustand works is very simple:
    -It keeps an array of ids of saved destinations
    -provides add,remove and view saved items function. pretty much curd operations.
    -it automatically syncs with local sotarage.
    -any components can access it.
  This way i able to do simpler work by meeting the challenge requirements.


#Rendering Strategy (SSR,CSR).
 For this project SSR (server side rendering) was choseing for marketing the pages. Here is a breakdown why SSR is choosen-
   Home page - Search engines require SEO content to be visible. if it is client-rendered, search engine will fail
   Destination Page- when using filters for contents, the preview should show actual content and crash or loading screen.
   Destination detail page - these pages works completed on the json dataset file. So using SSR, the pages can load faster when shared.

 For the interactive parts, CSR (Client side rending) is used. Below is breakdown - 
   Plan Form - this has details like sliders buttin real time validation etc which is easy for client render to handle.
   Results page - the map which is leaflet will not at all work in CSR isnt utilised. The internary changes based on inputs.

  The SSR is fast when is comes to displaying content, but can be slow when generating on server. And CSR pages shows complete blank screen without js.



#Itinerary generation algorithm

  The itinerary is where the main core feature of this website happens. It takes the users requrest and produces atravel plan. There are different phases on how it works.
    ##Phase 1: In this phase, the user decides and selects there preferences such as the month of travel, budget, duration of travel, categories, etc. So what happens in background process is, all the destinaitions are    goruped into respectiv regios. Each region then gets a score based on the user preferences choosen in categories and how suitable the travel month is for the destination.The coded algorithm then gets applied here.
      -if trips are >=3 days, 2 regions must be visited.
      -no region can have 2 days to visit
      -regions which gets high scores, they'll be given priority. Say for example user selects month as september and nature category, Dhofar region will have more score.
    AThe traveling days,meaning the time spent on each regions is distributed by checking the score. The region that has higher score gets more days. 
    So the ouput comes like a plan 'Day 1-2 inmuscat, day 3-4 sharqiya'

    ##Phase 2: Here dauly routing happens. A detailed optimized route gets created. The input of calculating this are the destinations within a region an dthe number of days spent on that rehion. These doesnt come from user, it is achieved from phase 1. nOw in phase 2 there are 3 steps:
      1. Greedy selection- Here each day gets started from the center of the region, and repeatedly add the hihest scoring destination which
        - fits withing the time left (visit duration + treavel time)
        - doesnt exceedmore than 250km per day.
        - diesnt repeat any same category more than twice
        - maintains not having 2 long adjacent stops.
      
      2. 2 Opt optimization- Since greedy selection is done, now optimizationhas to be done. How it works is by taking segments of the routes and reversing them. This is done to check if the reversed order reduces the total distance. Additionally keeping improvements which can make the route more efficient.

      3. Validation- After sucesfull optimization, the routes has to be checked with the constraints and find if it falls between the constraints. The contrainsts are:
        - tht total distance cannot be <=250km
        - The total visitn time <= intensity limit (6 for relaxed / 8 for balanced /10 for rush hours)
        - stop rhythm validation (long/short alternation)
        - category variety maintained
    This gives an output of all the stops that can happen perdat with corresponding arrival and departure timings

    ##Pahse 3: This phase calculated the coast. The calcualtions are provided from the challenge. The calcultations are as follwos
      - fuel cost = (totalkilometer/12) * 0.240
      - ticket cost = different mticket costs are mentioned in within the destination. So sum of all ticket costs
      - food cost = 6 * number of days
      - hotel cost = per night rate * (days -1)
         hotel costs differ based of the budget selected. low budget costs hotel of 20, medium budget cost 45 and luxury cost 90. These costs are per night
      - budget validations - comparing the final budget agasint the expected budget per tier.
        - low budget <=40 omr perday
        - medium budget <=80 omr perday
        - luxury budget <=150 omr perday
  
    ##Phase 4: Here, the user understand y each stop is chosen. They pretty much explanation about there plan. The process is that or each destinations, 2 top contibution factors are identifiied from:
      - category match the user interest
      - excellent season fit
      -l low crowds
      - afforadable pricing
      - quick visit duration 
    
    Just giving an example to show how the algorithm work. 
    Lets say the user selected or has give the input as Duration - 5 days,Month - March, Budget - Medium, Intensity - Balanced,Interests-nature, Saved interests - Wadi Shab, Jebel Akhdar, Salalah.
    ##Phase 1: Calcualtion happens for each adn every region. 
      formula: Region Score = (Avg Interest Match × 0.6) + (Avg Season Fit × 0.4)
      ###results:
        Dhofar Region Destinations:
         Salalah: categories ["nature", "beach"], months [6,7,8,9].
         Wadi Darbat: categories ["nature", "food"], months [8,9,10].
         Ayn Khoor: categories ["food", "nature", "mountain"], months [9,10,11,12].
         Ayn Athum: categories ["food", "nature", "mountain"], months [9,10,11,12].
        
         Interest match calcualtion (Jaccard Similarity).
           Jaccard(user_categories, dest_categories) = intersection / union
            For Salalah with user ["nature"]:
            - intersection = ["nature"] → 1
            - union = ["nature", "beach"] → 2
            - Jaccard = 1/2 = 0.50
            For Wadi Darbat:
            - intersection = ["nature"] → 1
            - union = ["nature", "food"] → 2
            - Jaccard = 0.50
            For Ayn Khoor:
            - intersection = ["nature"] → 1
            - union = ["nature", "food", "mountain"] → 3
            - Jaccard = 0.33

          Season fit.
            For Salalah: months [6,7,8,9] → closest is 6 (3 months away) → Season Score = 0.2
            For Wadi Darbat: months [8,9,10] → closest is 8 (5 months away) → Season Score = 0.2
            For Ayn Khoor: months [9,10,11,12] → closest is 9 (6 months away) → Season Score = 0.2
            Avg Interest for Dhofar = (0.50 + 0.50 + 0.33 + 0.33) / 4 = 0.415
            Avg Season for Dhofar = (0.2 + 0.2 + 0.2 + 0.2) / 4 = 0.2
            Dhofar Region Score = (0.415 × 0.6) + (0.2 × 0.4) = 0.249 + 0.08 = 0.329

          Just like how for dhofar region, score was achieved same way all region scores gets achieved.
            Region	      Destinations	          Avg Interest	       Avg Season	       Final Score
            Dhofar	    4 destinations	           0.415	              0.20	           0.329
            Sharqiya	  3 destinations	            0.33	              0.80	           0.518
            Dakhiliya	  2 destinations	            0.50	              0.80	           0.620
            Muscat	    2 destinations	            0.25	              0.80	           0.470

            After calculation, allocation of days with constraints is requried. the rules are 
              Min regions for 5 days = 2 regions  
              Max days per region = ceil(5/2) = 3 days
            Start with top regions:
              - Dakhiliya (0.620) gets 1 day (remaining: 4 days)
              - Sharqiya (0.518) gets 1 day (remaining: 3 days)

            Distribute remaining days based on scores:
              - Dakhiliya gets +1 (total 2 days)
              - Sharqiya gets +1 (total 2 days) 
              - Dhofar gets +1 (total 1 day)

            Final Allocation:
              - Dakhiliya: 2 days (Days 1-2)
              - Sharqiya: 2 days (Days 3-4)
              - Dhofar: 1 day (Day 5)
        
      and this is how days gets allocated.
    
    ##Phase 2: Routing.
      Day 1-2: Dakhiliya Region
        Available destinations in Dakhiliya:
        Jebel Akhdar: duration 240 min, cost 3 OMR, crowd 3
        Bahla Fort: duration 120 min, cost 2 OMR, crowd 3

      Greedy Selection for Day 1:
        Starting point: Region center (22.9333°N, 57.5333°E)
        Calculate scores for each destination using the full formula:
      
      score = (0.30 × Interest) + (0.25 × Season) - (0.15 × CrowdNorm) - (0.15 × costNorm) - (0.10 × detour) + (0.05 × Diversity)
      For Jebel Akhdar:
        - Interest: user ["nature"] vs ["mountain","nature"] = 1/2 = 0.50
        - Season: March is recommended [3,4,5,9,10,11] → Perfect = 1.0
        - Crowd: level 3 → normalized = (5 - (3-1))/4 = 0.5
        - cos: 3 OMR → normalized = 3/20 = 0.15
        - detour: first stop → 0
        - diversity: first stop → 0.5
      Score = (0.30×0.50) + (0.25×1.0) - (0.15×0.5) - (0.15×0.15) - (0.10×0) + (0.05×0.5)
            = 0.15 + 0.25 - 0.075 - 0.0225 - 0 + 0.025
            = 0.3275 (32.75%)

      for Bahla Fort:
        - Interest: user ["nature"] vs ["culture"] = 0/1 = 0
        - Season: March vs [10,11,12,1,2,3,4] → March is recommended = 1.0
        - Crowd: level 3 → 0.5
        - Cost: 2 OMR → 2/20 = 0.10
        - Detour: first stop → 0
        - Diversity: 0.5
      Score = (0.30×0) + (0.25×1.0) - (0.15×0.5) - (0.15×0.10) - (0.10×0) + (0.05×0.5)
            = 0 + 0.25 - 0.075 - 0.015 - 0 + 0.025
            = 0.185 (18.5%)
      
      Jebel Akhdar gets selected for day 1 as it has the highest score (32.75%)

      Now travel time calculation:
      for this the distance is taken from the region center to jebel akhdar destination. it is calculated usign Haversine formila.
        Haversine(22.9333,57.5333 → 23.0667,57.6500) = 18.2 km
        Travel time at 60 km/h = 18.2/60 × 60 = 18 minutes

      and thus day 1 for jabel akhdar and  day 2 for bahla fort schedules is made. And similarly other schedules are made

    ##Phase 3: Cost calculation
      fuel estimation
        Total distance = Day1 36.4 + Day2 96.8 + Day3 145.2 + Day4 102.7 + Day5 180.3 = 561.4 km
        fuel consumption = 561.4 km ÷ 12 km/liter = 46.78 liters
        fuel price = 0.240 OMR/liter
        fuel cost = 46.78 × 0.640 = 11.22 OMR
        
      ticket cost
        day 1: Jebel Akhdar → 3 OMR
        day 2: Bahla Fort → 2 OMR
        day 3: Wadi Shab → 0 OMR
        day 4: Sur → 0 OMR
        day 5: Salalah → 0 OMR
        Total ticket cost = 5
      
      food cost
        6 OMR × 5 days = 30 OMR

      jhotel cost
        45 OMR × 4 nights = 180 OMR
      
      total cost
        Fuel: 29.94 OMR
        Tickets: 5.00 OMR
        Food: 30.00 OMR
        Hotel: 180.00 OMR
      TOTAL: 226.22 OMR

      budget for medium tier is 80 * 5 = 400
      226.22 < 400 OmR, hence it is within the budget

    ##Pagse 4: Generation
      For Jebel Akhdar selection, the algorithm explains:
      "Perfect match with your nature interests" (30% weight contribution)
      "March is ideal for visiting" (25% weight contribution)
      For Salalah selection in August, the explanation would highlight the Khareef season benefit.



#Weight selectiuon and Normalization Strategy.
  ##Weigh Selection Reationale.
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

  ##Normalization.
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


#Performance consideration and optimization.
  all the perfomance happen locally, no backend api calls. 
  console.time() was implemented on itinenary page to check out performance of the code algorithm. This performance is checked and measured within the browser (google)
  The reuslts where acchieved as follows (a screen shot has been provided in the following file path - additional\performanceTEST1.png)
    Itinerary generated in 2.600 ms (first run)
    Itinerary generated in 0.700 ms
    Itinerary generated in 0.400 ms
    Itinerary generated in 0.400 ms
  The above test was done for 1 day trip. There are multiple speed shown because multiple checks happen at the background.

  Test has been done with a 7 days and medium budget 
  Results were (screenshot available in following file path - additional\performanceTEST2.png)
    Itinerary generated in 3.400 ms (first run)
    Itinerary generated in 0.700 ms
    Itinerary generated in 0.400 ms
    Itinerary generated in 0.500 ms
  
  The first run was slower which could be due to sloading the codes, compiling the funciton,seeting up memory, etc. SUsequently the second run the performance seem to have a good boost as caches kick in.

  Key Optimizations Implemented
    Efficient Algorithms
      -Greedy selection with 2-opt optimization runs in O(n³) where n ≤ 5 stops
      -Haversine formula is O(1) per distance calculation
      -All calculations complete in under 5ms total

    Smart Data Structures
      -Destinations stored in memory for fast access
      -No expensive API calls - all calculations local
      -Minimal object creation to reduce garbage collection

    Lazy Loading
      -Map components load only when needed
      -Images load asynchronously

    Early Bailout Conditions
      -If no destinations match filters, skip expensive routing
      -Region allocation uses pre-computed scores
      -Stop adding to route when constraints can't be met


#Limitations and tradeoffs
-The destination dataset is limited. Having more number of destinations can make better accurate results. The itineraries would be showing better results
-No real road distance are used. the challenge requirement was to huse haversine formula to calculate distance. Unfortunately this formula calculates straight path only. and the roads are ofcourse not straight.
-mobile experience would be bad expereince. Everything will be packed.

Addition to the main website, there are 4 other pages that was used for testing. 
These are the different algorithms use but not combined into 1
-`http://localhost:3000/en/distance-test` - Haversine distance calculator
-`http://localhost:3000/en/score-test` - Multi-objective scoring
-`http://localhost:3000/en/region-test` - Region allocation
-`http://localhost:3000/en/routing-test` - Daily routing with constraints

#Additional test Cases
  as shown above, there where 4 seperate pages made to test. then these 3 pages were combinied to 1 to generate itinerary.
  1. Distance test
    1.1 Sultan Qaboos Grand Mosque to Jebel Akhdar
        Sultan Qaboos Grand Mosque
          lat: 23.5842,
          lng: 58.3888,
        Jebel Akhdar 
          lat: 22.5000,
          lng: 58.8000,
        Now how is this calculated, haverinse has there own formula which i have used in distance.ts file.
        First step is to convert the values into raddians
          lat1 = 23.5842 × π/180 = 0.4116 rad
          lat2 = 23.0667 × π/180 = 0.4026 rad
          lng1 = 58.3888 × π/180 = 1.0190 rad  
          lng2 = 57.6500 × π/180 = 1.0062 rad

        Second step is to find the difference between both lattitudes and longitutdes
          dlat = 0.4116 - 0.4026 = 0.0090 rad
          dlng = 1.0190 - 1.0062 = 0.0128 rad
        
        third step is to apply haversine formula
          a = sin²(dlat/2) + cos(lat1) × cos(lat2) × sin²(dlng/2)
          a = sin²(0.0045) + cos(0.4116) × cos(0.4026) × sin²(0.0064)

          sin(0.0045) ≈ 0.0045 → square = 0.00002025
          cos(0.4116) ≈ 0.9165
          cos(0.4026) ≈ 0.9201
          sin(0.0064) ≈ 0.0064 → square = 0.00004096

          a = 0.00002025 + (0.9165 × 0.9201 × 0.00004096)
          a = 0.00002025 + (0.8433 × 0.00004096)
          a = 0.00002025 + 0.00003454
          a = 0.00005479

        4th step
          c = 2 × atan2(√a, √(1-a))
          c = 2 × atan2(0.0074, 0.99997)
          c = 2 × 0.0074
          c = 0.0148 radians
        
        fifth step is to calculate distance = R*c (R stands for earth's average equatorial radius)
          R = 6371 km
          Distance = 6371 × 0.0148 = 94.3 km
      You can find this results screen shot in the file path 'additiontional\testcase\distanceTest1.1.png' or try yourself in the url 'http://localhost:3000/en/distance-test'

    1.2 Sultan Qaboos to Sultan Qaboos
        This test is just to check that the map distance works even if same results are given.
        The distance comes as 0km. You can find screen shot in the file path additiontional\testcase\distanceTest1.2.png

  2. Distance Test
    2.1 Perfect Match
      Input are Month:	March, User Interests: mountain, nature, Destination: Jebel Akhdar
      Results
      Interest: mountain,nature vs mountain,nature = 2/2 = 1.0 × 30% = 0.30
      Season: March in recommended [3,4,5,9,10,11] = 1.0 × 25% = 0.25
      Crowd: Level 3 → normalized = 0.5 × -15% = -0.075     
      Cost: 3 OMR → 3/20 = 0.15 × -15% = -0.0225
      Total = 0.30 + 0.25 - 0.075 - 0.0225 = 0.4525 (45.3%)
      Screenshot available in file path 'additiontional\testcase\scoreTest2.1.png'
    
    2.2 Poor Match Test
      Input are Month:	August, User Interests:	beach, Destination:	Jebel Akhdar
      Resutls
      Interest: beach vs mountain,nature = 0/2 = 0 × 30% = 0
      Season: August not in recommended = 0.2 × 25% = 0.05
      Crowd: Level 3 → 0.5 × -15% = -0.075
      Cost: 3 OMR → 0.15 × -15% = -0.0225
      Total = 0 + 0.05 - 0.075 - 0.0225 = -0.0475 → 10.3%
      Screenshot available in file path 'additiontional\testcase\scoreTest2.2.png'
      for self test follow the url 'http://localhost:3000/en/distance-test'

  3. Region Test
     3 day cultural trip
      Input are Duration: 3 days, Month: March, Interests: culture, nature.
      Region Score = (Avg Interest Match × 0.6) + (Avg Season Fit × 0.4)

      Each destination and region score gets calculated.
      Example
      For Jebel Akhdar: 
        User [culture, nature] vs [mountain, nature]
        Intersection = [nature] → 1
        Union = [culture, nature, mountain] → 3
        Score = 1/3 = 0.33

      For Bahla Fort:
        User [culture, nature] vs [culture]
        Intersection = [culture] → 1
        Union = [culture, nature] → 2
        Score = 1/2 = 0.50

      Average Interest = (0.33 + 0.50) / 2 = 0.415
      Jebel Akhdar: months [3,4,5,9,10,11] → March is IN list → 1.0
      Bahla Fort: months [10,11,12,1,2,3,4] → March is IN list → 1.0
      Average Season = (1.0 + 1.0) / 2 = 1.0

      Similarly all locations are found. the best match as Day 1 = 2 Days in Dakhiliya and Day 2 = 1 day in Sharqiya.
      Screenshot available in file path 'additiontional\testcase\regionTest1.png'
      for self test follow the url 'http://localhost:3000/en/region-test'
    
  4. Routing testing
    4.1 Relaxed Routing
    Input are - Region: Muscat,Days: 1, Intensity: Relaxed (max 3 stops), Month:	November, Interests:	culture, food
      Start: 9:00 AM
      Travel to Sultan Mosque: 0 min (starting point)
      Visit Sultan Mosque: 90 min (9:00-10:30)
      Travel to Mutrah Souq: 15 min (10:30-10:45)
      Visit Mutrah Souq: 120 min (10:45-12:45)
      Return: 15 min (12:45-1:00 PM)
      Total time: 4 hours, under 6 hour limit
      Screenshot available in file path 'additiontional\testcase\routingTest4.1.png'
      for self test follow the url 'http://localhost:3000/en/routing-test'
    
    4.2 Packed Routing
    Input are - Region: Dakhliya,Days: 2, Intensity: Packed (max 5 stops), Month:	March, Interests:	culture, mountain
      Results:
      Jebel Akhdar: 240 min (4 hours)
      Travel to Bahla Fort: 45 min
      Bahla Fort: 120 min (2 hours)
      Total: 6.75 hours, under 10 hour limit
      But can't add 3rd stop due to time
      Screenshot available in file path 'additiontional\testcase\routingTest4.2.png'
  All test cases were made individually and surpased with excellence.

##A compelete generation of itinerary test.
The inputs are - 
  Duration: 5 days
  Budget:	Medium
  Month:	March
  Intensity:	Balanced
  Interests:	culture, nature
  Saved Interests:	Sultan Mosque, Jebel Akhdar, Wadi Shab

Step 1 - Region Calculation
  Dakhiliya Region - Destinations:
    Jebel Akhdar: categories [mountain, nature]
    Bahla Fort: categories [culture]

    interest match calcualtion
    For Jebel Akhdar:
      User [culture, nature] vs [mountain, nature]
      Intersection = [nature] → 1
      Union = [culture, nature, mountain] → 3
      Score = 1/3 = 0.33

    For Bahla Fort:
      User [culture, nature] vs [culture]
      Intersection = [culture] → 1
      Union = [culture, nature] → 2
      Score = 1/2 = 0.50

    For Nizwa:
      User [culture, nature] vs [food, mountain, beach]
      Intersection = [] → 0
      Union = [culture, nature, food, mountain, beach] → 5
      Score = 0/5 = 0
    
    Average Interest = (0.33 + 0.50 + 0) / 3 = 0.83 / 3 = 0.277

    season fit
      Jebel Akhdar: recommended months [3,4,5,9,10,11] → March is IN → 1.0
      Bahla Fort: recommended months [10,11,12,1,2,3,4] → March is IN → 1.0
      Nizwa: [1,2,10,11,12] → March is 3 → NOT in list → 0.2

      Average Season = (1.0 + 1.0 + 0.2) / 3 = 2.2 / 3 = 0.733

    saved interest bonus
      Jebel Akhdar is in saved interests → +0.05
      Bahla Fort not saved → 0
      Nizwa not saved → 0
      Total Bonus = 0.05


    Dakhiliya regon score
      Base Score = (0.277 × 0.6) + (0.733 × 0.4) = 0.166 + 0.293 = 0.459
      With Bonus = 0.459 + 0.05 = 0.509 (50.9%)

  Sharqiya Region - Destinations:
    Wadi Shab: categories [nature]
    Wahiba Sands: categories [desert]
    Sur: categories [beach, culture, food]

    interest score
    For Wadi Shab:
      User [culture, nature] vs [nature]
      Intersection = [nature] → 1
      Union = [culture, nature] → 2
      Score = 1/2 = 0.50

    For Wahiba Sands:
      User [culture, nature] vs [desert]
      Intersection = [] → 0
      Union = [culture, nature, desert] → 3
      Score = 0/3 = 0

    For Sur:
      User [culture, nature] vs [beach, culture, food]
      Intersection = [culture] → 1
      Union = [culture, nature, beach, food] → 4
      Score = 1/4 = 0.25

    Average Interest = (0.50 + 0 + 0.25) / 3 = 0.75 / 3 = 0.25

    season fit
      Wadi Shab: [10,11,12,1,2,3,4] → March IN → 1.0
      Wahiba Sands: [10,11,12,1,2,3,4] → March IN → 1.0
      Sur: [10,11,12,1,2,3,4] → March IN → 1.0

      Average Season = (1.0 + 1.0 + 1.0) / 3 = 1.0

    saved interest bonus
      Wadi Shab is in saved interests → +0.05
      Wahiba Sands not saved → 0
      Sur not saved → 0
      Total Bonus = 0.05

    sharkiya region score
      Base Score = (0.25 × 0.6) + (1.0 × 0.4) = 0.15 + 0.4 = 0.55
      With Bonus = 0.55 + 0.05 = 0.60 (60%)

  Muscat Region Destinations:
    Sultan Mosque: categories [culture]
    Mutrah Souq: categories [culture, food]
    OAA: [food, culture] 
    Bandar Al Khairan: [food, mountain, beach] 

    inetrest match
    For Sultan Mosque:
      User [culture, nature] vs [culture]
      Intersection = [culture] → 1
      Union = [culture, nature] → 2
      Score = 1/2 = 0.50

    For Mutrah Souq:
      User [culture, nature] vs [culture, food]
      Intersection = [culture] → 1
      Union = [culture, nature, food] → 3
      Score = 1/3 = 0.33
    
    for oman auto mobile association 
      User [food,culture] vs [culture,nature] 
      intersetion = [culture] -> 1
      ubion = [food, culture, anture]  ->3
      score 1/3 = 0.33

    for bandar al khairan
      Useer [food,mountain,beach] vs [culture,nature] 
      Intersection = [] → 0
      Union = [food, mountain , beach, food] → 3
      score 0/5 = 0

      average Interest = (0.50 + 0.33 + 0.33 + 0) / 4 = 1.16 / 4 = 0.29

    Seson fit
      Sultan Mosque: [10,11,12,1,2,3,4] → March IN → 1.0
      Mutrah Souq: [1,2,3,4,5,6,7,8,9,10,11,12] → March IN → 1.0
      OAA: [9,10,11,12] → March is 3 → NOT in → 0.2
      Bandar: [1,2,10,11,12] → March is 3 → NOT in → 0.2

      Average Season = (1.0 + 1.0 + 0.2 + 0.2) / 4 = 2.4 / 4 = 0.6

    saved interest bonus
      Sultan Mosque is in saved interests → +0.05
      Mutrah Souq not saved → 0
      OAA not saved → 0
      Bandar not saved → 0
      Total Bonus = 0.05

    muscat region score
      base Score = (0.29 × 0.6) + (0.6 × 0.4) = 0.174 + 0.24 = 0.414
      With Bonus = 0.414 + 0.05 = 0.464 (46.4%)

  Dhofar Region Destinations:
    Salalah: [nature, beach]
    Wadi Darbat: [nature, food]
    Ayn Khoor: [food, nature, mountain]
    Ayn Athum: [food, nature, mountain]
    Al Bustan Beach: [food, nature, mountain]

    interest match
    For Salalah:
      [culture,nature] vs [nature,beach] → intersection [nature] → 1
      union [culture,nature,beach] → 3 → 1/3 = 0.33

    For Wadi Darbat:
      [culture,nature] vs [nature,food] → intersection [nature] → 1
      union [culture,nature,food] → 3 → 1/3 = 0.33

    For Ayn Khoor:
      [culture,nature] vs [food,nature,mountain] → intersection [nature] → 1
      union [culture,nature,food,mountain] → 4 → 1/4 = 0.25

    For Ayn Athum:
      [culture,nature] vs [food,nature,mountain] → intersection [nature] → 1
      union [culture,nature,food,mountain] → 4 → 1/4 = 0.25

    For Al Bustan Beach:
      [culture,nature] vs [food,nature,mountain] → intersection [nature] → 1
      union [culture,nature,food,mountain] → 4 → 1/4 = 0.25

    Average Interest = (0.33 + 0.33 + 0.25 + 0.25 + 0.25) / 5 = 1.41 / 5 = 0.282

    season fit
      Salalah: [6,7,8,9] → closest month 6 (3 away) → 0.2
      Wadi Darbat: [8,9,10] → closest 8 (5 away) → 0.2
      Ayn Khoor: [9,10,11,12] → closest 9 (6 away) → 0.2
      Ayn Athum: [9,10,11,12] → closest 9 (6 away) → 0.2
      Al Bustan Beach: [9,10,11,12] → closest 9 (6 away) → 0.2

      Average Season = (0.2 + 0.2 + 0.2 + 0.2 + 0.2) / 5 = 1.0 / 5 = 0.2

    
    dhofar region score
      Score = (0.282 × 0.6) + (0.2 × 0.4)
      Score = 0.169 + 0.08
      Score = 0.249 (24.9%)

  step 2 is to rank the regions
	    Region	      Score
	    Sharqiya	    0.60
	    Dakhiliya     0.509
	    Muscat  	    0.464
	    Dhofar	      0.249
    
  step 4 allocation of days
    Round 1: Sharqiya → Day 1
    Round 2: Sharqiya → Day 2
    Round 3: Dakhiliya (for variety) → Day 3
    Round 4: Dakhiliya → Day 4
    Round 5: Muscat → Day 5
  
  step 5 routing
    day 1 (dakhiliya (bahla fort))
      Distance from region center: 48.4 km, Travel time: 48 minutes
      09:00 Start and at 09:48 Arrive Bahla Fort
      09:48-11:48 Visit (120 min)
      11:48 Return
      13:24 End
      Distance: 48.4 km
    
    day 2 (Dakhiliya (jebel akhder))
      Distance from region center: 36.4 km, travel time: 36 minutes
      09:00 Start and 09:36 Arrive Jebel Akhdar
      09:36-13:36 Visit (240 min)
      13:36 Return
      14:12 End
      Distance: 38.1 km

    day 3 (sharqiya (wadi shab))
      Distance from region center: 73 km, travel time: 73 minutes
      09:00 Start and 10:13 Arrive Wadi Shab
      10:13-13:13 Visit (180 min)
      13:13 Return, 14:26 End
      Distance: 145.2 km

    dayb 4 (sharqiya (sur))
      Distance from region center: 78 km, travel time: 78 minutes
      09:00 Start, 10:18 Arrive Sur
      10:18-12:48 Visit (150 min)
      12:48 Return, 14:06 End
      Distance: 102.7 km

    day 5 (muscat )(sultan qaboos grand mosque and mutrah souq)
      09:00 Start at Sultan Mosque, 09:00-10:30 Visit Sultan Mosque (90 min)
      10:30-10:45 Travel to Mutrah Souq (15 min), 10:45-12:45 Visit Mutrah Souq (120 min)
      12:45 Return
      Distance: 38 km total
  
  step 6, cost calculation
    Total Distance = 96.8 + 72.8 + 146 + 156 + 38 = 372.4 km
    Fuel Cost = (372.4 / 12) × 0.240 = 31.033 × 0.240 = 7.4 OMR

    Ticket Costs:
      - Bahla Fort: 2 OMR
      - Jebel Akhdar: 3 OMR
      - Wadi Shab: 0 OMR
      - Sur: 0 OMR
      - Sultan Mosque: 0 OMR
      - Mutrah Souq: 0 OMR
      Total Tickets = 5 OMR

    Food Cost = 6 OMR × 5 days = 30 OMR

    Hotel Cost (Medium = 45 OMR/night):
    45 OMR × 4 nights = 180 OMR

    Total Cost = 7.4 + 5 + 30 + 180 = 222.4 OMR
    checkout screenshot available in file path 'additiontional\testcase\finalTest.png'. or you can try the checking yourself.


    






    

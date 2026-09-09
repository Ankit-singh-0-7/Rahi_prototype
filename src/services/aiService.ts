/**
 * Rahi AI Travel Intelligence Service
 * 
 * Works seamlessly in both:
 * 1. Full-Stack deployments (dev, Cloud Run, custom Node/Express backend)
 * 2. Static deployments (GitHub Pages, Vercel SPA, Netlify, offline)
 * 
 * Includes comprehensive local knowledge engine for India tourism, travel hacks,
 * safety, bargaining phrases, and day-by-day itinerary generation.
 */

interface ChatHistoryItem {
  sender: 'user' | 'ai' | string;
  text: string;
}

export interface SmartTripRequest {
  destination: string;
  daysCount: number;
  budgetTotal: number;
  travelStyle: string;
  companions: string;
}

export interface SmartTripResult {
  success: boolean;
  trip: {
    destination: string;
    days: Array<{
      day: number;
      title: string;
      activities: Array<{
        timeSlot: 'Morning' | 'Afternoon' | 'Evening';
        activityTitle: string;
        description: string;
        location: string;
        cost: number;
        category: 'sightseeing' | 'food' | 'culture' | 'adventure' | 'nature';
      }>;
    }>;
  };
  plan: any;
  isLiveAI: boolean;
}

// Compute API base URL safely across relative base paths (e.g. /Rahi_prototype/ on GitHub Pages)
function getApiEndpoint(route: string): string {
  const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}${cleanRoute}`;
}

/**
 * Main chat interface for Rahi AI Travel Copilot
 */
export async function askTravelCopilot(
  userText: string,
  history: ChatHistoryItem[] = []
): Promise<{ reply: string; isLiveAI: boolean }> {
  const trimmed = userText.trim();
  if (!trimmed) {
    return { reply: 'Namaste! Where would you like to explore in India today?', isLiveAI: false };
  }

  // 1. Try server-side API first (works in full-stack, dev, and Cloud Run)
  const endpoint = getApiEndpoint('api/ai/chat');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: trimmed,
        history: history.slice(-6),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // Check if the response is valid JSON (not an HTML 404/fallback page from static hosting)
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.reply) {
        return { reply: data.reply, isLiveAI: Boolean(data.isLiveAI) };
      }
    }
  } catch (err) {
    console.debug('Server AI endpoint unavailable, switching to local intelligence:', err);
  }

  // 2. Client-Side Generative Travel Intelligence Engine
  // Tailored specifically to the user's destination, query, and context
  const dynamicReply = synthesizeTravelGuidance(trimmed, history);
  return { reply: dynamicReply, isLiveAI: false };
}

/**
 * Intelligent client-side response synthesizer
 * Comprehensive coverage of destinations, budgeting, phrases, safety, and transport
 */
function synthesizeTravelGuidance(query: string, history: ChatHistoryItem[] = []): string {
  const q = query.toLowerCase();

  // Destination: Goa
  if (q.includes('goa') || q.includes('beach') || q.includes('panaji') || q.includes('calangute') || q.includes('arambol')) {
    if (q.includes('quiet') || q.includes('peaceful') || q.includes('secret') || q.includes('hidden') || q.includes('offbeat')) {
      return `### 🌴 Peaceful & Hidden Gems in Goa\n\n` +
        `Escape the crowded commercial strips of Baga and Calangute with these serene spots:\n\n` +
        `* **Butterfly & Kakolem Beach (South Goa):** Accessible via small hiking trails or local fishermen boats. Pristine sands and dramatic cliffs with nearly zero commercial hawkers.\n` +
        `* **Galgibaga Beach (Canacona):** Known as Olive Ridley Turtle nesting grounds. Protected, quiet pine groves with strict no-loud-music rules.\n` +
        `* **Querim (Keri) Beach (Far North):** Tranquil coastline flanked by Casuarina trees and an old Portuguese ferry crossing to Tiracol Fort.\n` +
        `* **Fontainhas Latin Quarter (Panaji):** Stroll through 18th-century brightly colored heritage villas, quiet bakeries serving warm *poee*, and art galleries.\n\n` +
        `💡 **Rahi Pro-Tip:** Rent a 110cc scooter for ~₹350–₹450/day. Always ask for two helmets (traffic police enforce strictly) and take the Betim-Panaji ferry (free for two-wheelers) for scenic estuary views!`;
    }
    return `### 🌊 The Smart Goa Explorer Guide\n\n` +
      `* **North vs. South:** Choose North Goa for lively beach markets, water sports, and vibrant cafe culture (Anjuna, Assagao, Mandrem). Choose South Goa for sleepy coastal villages, heritage mansions, and untouched coastlines (Palolem, Agonda, Benaulim).\n` +
      `* **Food Highlights:** Try authentic Goan Fish Thali at *Vinayak Family Restaurant* (Assagao) or *Anand Seafood* (Siolim) for ~₹250–₹350.\n` +
      `* **Transport:** Goa Taxi App or pre-negotiated pilot bikes / scooter rentals. Avoid unmetered roadside private cabs at airport arrival gates; use the Goa Miles or Kadamba EV airport buses.\n` +
      `* **Best Season:** Mid-November to February for beach weather; July to September for breathtaking lush monsoon waterfalls like Dudhsagar.`;
  }

  // Destination: Ladakh / Leh / Himalayas
  if (q.includes('ladakh') || q.includes('leh') || q.includes('monaster') || q.includes('pangong') || q.includes('nubra') || q.includes('zanskar')) {
    return `### 🏔️ Ladakh & High Himalayan Travel Intelligence\n\n` +
      `* **Non-Negotiable Rule:** Acclimatize in Leh (3,500m) for **at least 48 hours**. Avoid strenuous walking or driving to Khardung La on Day 1 to prevent Acute Mountain Sickness (AMS). Drink 3–4 liters of water with electrolytes.\n` +
      `* **Serene Monasteries:**\n` +
      `  - **Phugtal Gompa (Zanskar):** Built directly into the mouth of a massive limestone cliff cave. Reached by a scenic river trek.\n` +
      `  - **Stongdey & Thiksey:** Attend the 6:30 AM morning prayer chants (*Puja*). Monks lighting butter lamps amidst echoing horns is deeply meditative.\n` +
      `* **Inner Line Permits:** Required for Nubra Valley, Pangong Tso, and Hanle. Apply online through the official Leh portal (LAHDCS) or ask your local guesthouse to arrange for ~₹500.\n` +
      `* **Cash & Connectivity:** Only Postpaid BSNL, Jio, and Airtel work in Ladakh. ATMs in Leh frequently run out of cash during tourist surges—carry sufficient physical currency.`;
  }

  // Destination: Varanasi / Kashi
  if (q.includes('varanasi') || q.includes('banaras') || q.includes('kashi') || q.includes('ghat') || q.includes('ganga')) {
    return `### 🛕 The Essential Varanasi (Banaras) Guide\n\n` +
      `* **Dawn Experience:** Take a non-motorized wooden rowboat from **Assi Ghat to Manikarnika Ghat** at sunrise (5:30 AM – 6:30 AM). Witness the morning rituals, Vedic chants (*Subah-e-Banaras*), and morning mist over ancient palaces.\n` +
      `* **Iconic Street Food Spots:**\n` +
      `  1. **Tamatar Chaat** at *Kashi Chaat Bhandar* or *Deena Chaat Bhandar* (served scalding hot in earthen *kulhad* bowls).\n` +
      `  2. **Kachori Sabzi & Jalebi** at *Ram Bhandar* (Thatheri Bazaar) before 9:00 AM.\n` +
      `  3. **Malaiyo / Peda** at *Rajbandhu Sweets* and creamy lassi at *Blue Lassi Shop*.\n` +
      `* **Boat Bargaining:** Fix rates clearly before boarding. Standard shared rowboats cost ₹100–₹150/person; private rowboats range from ₹500–₹800 for 1.5 hours.\n` +
      `* **Cultural Etiquette:** Never take photos at Manikarnika or Harishchandra burning ghats out of respect for grieving families.`;
  }

  // Destination: Jaipur / Rajasthan
  if (q.includes('jaipur') || q.includes('rajasthan') || q.includes('udaipur') || q.includes('jodhpur') || q.includes('palace') || q.includes('fort')) {
    return `### 🏰 Royal Rajasthan & Jaipur Travel Wisdom\n\n` +
      `* **Heritage Architecture Hacks:**\n` +
      `  - **Hawa Mahal:** Best photographed at 8:00 AM from *Tattoo Cafe* or street level opposite before traffic builds up.\n` +
      `  - **Panna Meena ka Kund:** Hidden 16th-century geometric stepwell right next to Amber Fort—often missed by tour buses.\n` +
      `  - **Nahargarh Fort Sunset:** Panoramic vantage point over the Pink City as city lights illuminate.\n` +
      `* **Smart Savings:** Buy the **Jaipur Composite Ticket** (₹300 for Indians / ₹1000 for foreign travelers). It includes entry to Amber Fort, Albert Hall, Hawa Mahal, Jantar Mantar, and Nahargarh, saving over 40%!\n` +
      `* **Culinary Gems:** *Rawat Mishtan Bhandar* for crisp *Pyaz Kachori*, *LMB (Laxmi Mishtan Bhandar)* for Ghewar, and *Lassiwala* (MI Road, Shop 312 since 1944).\n` +
      `* **Bargaining Rule:** In Bapu Bazaar and Johari Bazaar, begin by politely countering at 50–60% of the quote for textiles and block prints.`;
  }

  // Destination: Kerala / South India
  if (q.includes('kerala') || q.includes('alleppey') || q.includes('munnar') || q.includes('varkala') || q.includes('kochi') || q.includes('backwater')) {
    return `### 🌴 God's Own Country: Kerala Travel Guide\n\n` +
      `* **Budget Backwaters:** Instead of expensive overnight houseboats (₹8,000–₹15,000/night), take the **Kerala State Water Transport (SWTD)** public commuter ferry from Alleppey to Kottayam for just ₹25–₹40, or hire a 2-hour non-motorized canoe (₹500/hr) to navigate narrow, quiet canal villages.\n` +
      `* **Munnar Tea Trails:** Visit *Kolukkumalai* (highest organic tea estate in the world) for a sunrise cloud-bed view via a 4x4 Jeep trail.\n` +
      `* **Varkala Cliff:** Laid-back coastal sanctuary with perched cafes, yoga retreats, and natural mineral springs on Papanasam Beach.\n` +
      `* **Authentic Dining:** Order a traditional vegetarian *Kerala Sadhya* served on a fresh plantain leaf with red rice and 15+ delicacies.`;
  }

  // Destination: Himachal / Manali / Rishikesh / Uttarakhand
  if (q.includes('himachal') || q.includes('manali') || q.includes('rishikesh') || q.includes('kasol') || q.includes('dharamshala') || q.includes('spiti')) {
    return `### 🌲 Himachal & Uttarakhand Mountain Guide\n\n` +
      `* **Rishikesh:** Explore the historic *Beatles Ashram (Chaurasi Kutia)* covered in murals. Book river rafting with government-certified operators (ask to see the license plate and life jackets). Attend evening aarti at *Triveni Ghat*.\n` +
      `* **Manali & Beyond:** Stay in **Old Manali** or **Naggar** rather than the crowded Mall Road. Naggar Castle offers stunning pine valley views and authentic Himachali wood-and-stone architecture.\n` +
      `* **Transport:** Book state-run **HRTC Himsuta Volvo** buses through the official HRTC portal for reliable mountain drivers and punctuality over unregulated private operators.\n` +
      `* **Local Cuisine:** Try *Siddu* (steamed wheat bun stuffed with walnut/poppy paste and ghee) and *Chha Gosht* / *Himachali Dham*.`;
  }

  // Topic: Bargaining & Hindi Phrases
  if (q.includes('bargain') || q.includes('phrase') || q.includes('hindi') || q.includes('language') || q.includes('speak') || q.includes('how to say')) {
    return `### 🗣️ Practical Bargaining Phrases & Cultural Etiquette\n\n` +
      `Bargaining in India is a cheerful, polite social dance. Always smile and maintain a friendly demeanor:\n\n` +
      `1. **"Bhaiya, thoda theek lagaiye na."**\n` +
      `   *(Brother, please give me a fair/reasonable price.)*\n` +
      `2. **"Ye thoda mehenga hai, kuch discount milega?"**\n` +
      `   *(This is a bit expensive, can you offer a discount?)*\n` +
      `3. **"Aakhri kitna loge?"**\n` +
      `   *(What is your final price?)*\n` +
      `4. **"Hum do/teen le rahe hain, kuch kam karo."**\n` +
      `   *(We are buying two or three, reduce the rate please.)*\n` +
      `5. **"Dhanyavaad, main baad mein dekhunga."**\n` +
      `   *(Thank you, I will check later — useful for polite walk-aways!)*\n\n` +
      `💡 **Pro-Tip:** The "gentle walk-away" is your best negotiating tool. If a seller really has margin, they will usually call you back with a 20–30% lowered counter!`;
  }

  // Topic: Budgeting / Money Saving Hacks
  if (q.includes('budget') || q.includes('cheap') || q.includes('save money') || q.includes('cost') || q.includes('afford') || q.includes('train')) {
    return `### 💰 Master Budget Hacks for Travelling in India\n\n` +
      `1. **Train Travel (IRCTC):** Book **3AC or AC Chair Car** for the best balance of comfort, safety, and price. Sleeper class is great for adventure, while Vande Bharat Express offers world-class speeds between key tourist corridors.\n` +
      `2. **Digital Payments (UPI):** UPI (Google Pay, PhonePe, Paytm) is accepted everywhere—from coconut vendors to royal palaces. International travelers can activate **UPI One World** at major international airports.\n` +
      `3. **Accommodations:** Stay in family-run Homestays, Zostel hostels, or verified eco-resorts. They often include organic home-cooked meals for ₹150–₹250/meal, cutting restaurant costs by half.\n` +
      `4. **City Transit:** Use Metro systems in Delhi, Bengaluru, Mumbai, and Jaipur. Download Uber/Ola or use pre-paid taxi counters inside railway stations to avoid inflated roadside tourist fares.`;
  }

  // Topic: Safety & Emergency
  if (q.includes('safe') || q.includes('emergency') || q.includes('police') || q.includes('solo') || q.includes('female') || q.includes('scam')) {
    return `### 🛡️ India Travel Safety & Scam Prevention Guide\n\n` +
      `* **Emergency Helplines (Pan-India):**\n` +
      `  - **112:** All-in-one Emergency (Police, Fire, Ambulance)\n` +
      `  - **1091:** Women Safety Helpline\n` +
      `  - **1363:** Ministry of Tourism 24/7 Multi-lingual Tourist Helpline\n` +
      `* **Common Tourist Scams to Avoid:**\n` +
      `  1. *"The monument/station ticket office is closed today, let me take you to a special government emporium."* — False! Verify open hours on official ASI websites.\n` +
      `  2. **Unmetered Taxis:** Always agree on rate beforehand, insist on the digital meter, or book through verified apps like Uber/Ola.\n` +
      `* **Solo & Women Travellers:** Stay in verified central neighborhoods with active 24/7 receptions. Share live WhatsApp/Google Maps location with trusted friends. Use ladies-only coaches in Delhi/Kolkata Metros.`;
  }

  // Topic: Food & Water Hygiene
  if (q.includes('food') || q.includes('eat') || q.includes('water') || q.includes('stomach') || q.includes('restaurant') || q.includes('cuisine')) {
    return `### 🍲 Authentic Dining & Food Hygiene Wisdom\n\n` +
      `* **The Golden Street Food Rule:** Only eat at food carts with a long queue of local families and continuous high heat. High turnover guarantees fresh ingredients; boiling oils and piping steam kill bacteria.\n` +
      `* **Safe Drinking Water:** Drink sealed bottled mineral water (check the plastic neck seal) or carry a filter bottle. Avoid raw tap water, ice cubes from unknown roadside carts, and pre-cut peeled fruit exposed to air.\n` +
      `* **Must-Try Pan-India Regional Dishes:**\n` +
      `  - **North:** Dal Makhani, Amritsari Chole Kulche, Kashmiri Rogan Josh.\n` +
      `  - **South:** Crispy Ghee Roast Dosa, Idli-Vada with piping Sambar, Malabar Parotta.\n` +
      `  - **East:** Luchi Alur Dom, Sandesh, Kolkata Kathi Rolls.\n` +
      `  - **West:** Pav Bhaji, Dhokla, Rajasthani Dal Baati Churma.`;
  }

  // Dynamic contextual synthesis based on query keywords
  return `### 🧭 Rahi Travel Intelligence: Insights for "${query}"\n\n` +
    `* **Timing & Best Hours:** For popular monuments and historical sites, plan your visit between **6:30 AM and 8:30 AM**. You'll encounter softer light for photography, pleasant temperatures, and zero tour bus congestion.\n` +
    `* **Local Connections:** Homestays and local teashops (*Chai Ki Tapri*) are treasure troves of unlisted viewpoints, folklore, and seasonal cultural festivals.\n` +
    `* **Smart Mobility:** When traveling between towns, state-run RTC buses and IRCTC trains offer verified, picturesque transit. Rent scooters or use app-cabs for intra-city flexibility.\n` +
    `* **Emergency Readiness:** Keep the Pan-India emergency number **112** saved and maintain digital copies of your passport/Aadhaar in the Rahi offline vault.\n\n` +
    `Feel free to ask me for a **detailed day-wise itinerary**, **budget estimate**, or **hidden gem recommendation** for any specific Indian state!`;
}

/**
 * Intelligent Trip Plan Generator
 * Synthesizes comprehensive itineraries with realistic day-by-day schedules
 */
export async function generateSmartTripPlan(params: SmartTripRequest): Promise<SmartTripResult> {
  const endpoint = getApiEndpoint('api/ai/plan-trip');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.trip && Array.isArray(data.trip.days)) {
        return data as SmartTripResult;
      }
    }
  } catch (err) {
    console.debug('Trip planning API call failed, generating via local travel engine:', err);
  }

  // Client-Side Plan Generator
  return buildCustomLocalTrip(params);
}

function buildCustomLocalTrip(params: SmartTripRequest): SmartTripResult {
  const dest = params.destination || 'Jaipur, Rajasthan';
  const totalDays = Math.max(1, Math.min(10, Number(params.daysCount) || 3));
  const totalBudget = Number(params.budgetTotal) || 25000;

  const transportShare = Math.round(totalBudget * 0.25);
  const stayShare = Math.round(totalBudget * 0.35);
  const foodShare = Math.round(totalBudget * 0.20);
  const actShare = Math.round(totalBudget * 0.15);
  const bufferShare = totalBudget - (transportShare + stayShare + foodShare + actShare);

  const activitiesPool: Record<string, Array<{ title: string; desc: string; loc: string; cost: number; cat: any }>> = {
    sightseeing: [
      { title: `Iconic Heritage Monument Walk in ${dest}`, desc: 'Early morning golden-hour exploration with architectural photography.', loc: `${dest} Old City`, cost: 400, cat: 'sightseeing' },
      { title: `Panoramic Hilltop Fort & Sunset`, desc: 'Witness the sweeping sunset view over the valley.', loc: `${dest} Heights`, cost: 350, cat: 'nature' },
      { title: `Ancient Stepwell & Temple Complex`, desc: 'Explore historic water conservation architecture and sacred courtyards.', loc: `${dest} Heritage Enclave`, cost: 250, cat: 'culture' },
    ],
    food: [
      { title: `Legendary Street Food Trail`, desc: 'Savor regional specialties, authentic breakfast savory pastries, and sweet lassi.', loc: `${dest} Central Bazaar`, cost: 450, cat: 'food' },
      { title: `Traditional Thali & Folk Courtyard Dinner`, desc: 'Authentic multi-course regional delicacies prepared using heritage recipes.', loc: `${dest} Traditional Haveli`, cost: 850, cat: 'food' },
    ],
    culture: [
      { title: `Artisan Craft & Handloom Workshop`, desc: 'Meet local weavers and pottery artisans carrying forward ancestral techniques.', loc: `${dest} Craft Village`, cost: 300, cat: 'culture' },
      { title: `Evening Sacred River / Temple Aarti`, desc: 'Immerse in rhythmic brass bells, incense, and floating oil lamps.', loc: `${dest} Main Ghat / Sacred Shrine`, cost: 150, cat: 'culture' },
    ],
    adventure: [
      { title: `Sunrise Nature Trail / Valley Cycling`, desc: 'Quiet early morning trail through natural ridges and scenic lookouts.', loc: `${dest} Countryside`, cost: 500, cat: 'adventure' },
      { title: `Local Canoe / Lake Boat Cruise`, desc: 'Serene water cruise observing endemic birds and peaceful landscapes.', loc: `${dest} Waters`, cost: 600, cat: 'nature' },
    ],
  };

  const days = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    const morningAct = activitiesPool.sightseeing[i % activitiesPool.sightseeing.length];
    const afternoonAct = (i % 2 === 0 ? activitiesPool.culture : activitiesPool.food)[i % 2];
    const eveningAct = (i % 2 === 0 ? activitiesPool.food[1] : activitiesPool.adventure[0]);

    return {
      day: dayNum,
      title: `Day ${dayNum}: Exploring ${dest}'s Living Heritage & Landscapes`,
      activities: [
        {
          timeSlot: 'Morning' as const,
          activityTitle: morningAct.title,
          description: morningAct.desc,
          location: morningAct.loc,
          cost: morningAct.cost,
          category: morningAct.cat,
        },
        {
          timeSlot: 'Afternoon' as const,
          activityTitle: afternoonAct.title,
          description: afternoonAct.desc,
          location: afternoonAct.loc,
          cost: afternoonAct.cost,
          category: afternoonAct.cat,
        },
        {
          timeSlot: 'Evening' as const,
          activityTitle: eveningAct.title,
          description: eveningAct.desc,
          location: eveningAct.loc,
          cost: eveningAct.cost,
          category: eveningAct.cat,
        },
      ],
    };
  });

  const plan = {
    tripTitle: `Customized Discovery of ${dest}`,
    summary: `A carefully balanced ${totalDays}-day itinerary for ${params.companions || 'travellers'} featuring authentic heritage, local culinary spots, and tranquil offbeat explorations.`,
    recommendedSeason: 'October to March (Pleasant weather across most of India)',
    weatherNote: 'Comfortable daytime temperatures; cool mornings and evenings suitable for walking tours.',
    transportation: {
      recommendedMode: 'Express Train (IRCTC 3AC) / Electric Cab',
      estimatedCost: transportShare,
      details: 'Comfortable point-to-point transit with pre-paid counter options.',
      cheaperAlternative: 'State RTC Semi-Sleeper bus saves up to 30%.',
    },
    accommodation: {
      recommendedType: 'Verified Heritage Homestay or Boutique Eco-Lodge',
      estimatedCostPerNight: Math.round(stayShare / totalDays),
      totalCost: stayShare,
      suggestions: [`${dest} Green Haven Heritage Retreat`, `${dest} Travelers Sanctuary`],
    },
    budgetBreakdown: {
      transport: transportShare,
      stay: stayShare,
      food: foodShare,
      activities: actShare,
      emergencyBuffer: bufferShare > 0 ? bufferShare : 1500,
      totalEstimated: totalBudget,
      perPersonCost: Math.round(totalBudget / Math.max(1, parseInt(params.companions) || 1)),
    },
    dailyItinerary: days,
    hiddenGems: [
      `Secluded sunrise vantage point 5km outside central ${dest}`,
      'Family-owned third-generation spice/tea trading outlet',
      'Ancient stone water reservoir with tranquil steps',
    ],
    safetyTips: [
      'Keep offline Google Maps saved before venturing into hilly roads.',
      'Always confirm auto-rickshaw fares or book via ride apps with digital billing.',
      'Stay hydrated with sealed coconut water or certified packaged mineral water.',
    ],
    savingsTips: [
      'Look for city composite monument passes which bundle entry to 5+ landmarks.',
      'Eat breakfast at busy local sweetshops where food is prepared fresh right in front of you.',
    ],
  };

  return {
    success: true,
    trip: {
      destination: dest,
      days,
    },
    plan,
    isLiveAI: false,
  };
}

/**
 * Intelligent Translation Service
 */
export async function translateTravelText(
  text: string,
  sourceLang = 'English',
  targetLang = 'Hindi'
) {
  const endpoint = getApiEndpoint('api/ai/translate');

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        sourceLang,
        targetLang,
        context: 'Travel, bargaining, dining, direction, emergency',
      }),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.debug('Translation API unavailable, utilizing multilingual dictionary:', err);
  }

  // Multilingual Travel Vocabulary
  const phrases: Record<string, Record<string, { trans: string; pron: string; note: string }>> = {
    'how much is this': {
      Hindi: { trans: 'यह कितने का है? (Yeh kitne ka hai?)', pron: 'Yeh kit-nay ka hai?', note: 'Polite way to ask price in North India.' },
      Bengali: { trans: 'এটার দাম কত? (Etar daam koto?)', pron: 'Ay-tar daam ko-to?', note: 'Standard query in Kolkata and West Bengal.' },
      Tamil: { trans: 'இதன் விலை என்ன? (Idhan vilai enna?)', pron: 'E-dan ve-lay en-na?', note: 'Common shopping phrase in Tamil Nadu.' },
    },
    'where is the station': {
      Hindi: { trans: 'रेलवे स्टेशन कहाँ है? (Railway station kahan hai?)', pron: 'Railway station ka-haan hai?', note: 'Add "Bhaiya" (brother) at the beginning for warmth.' },
      Tamil: { trans: 'ரயில் நிலையம் எங்கே உள்ளது? (Rail nilaiyam engae ulladhu?)', pron: 'Rail ni-lay-am eng-gay ul-la-dhu?', note: 'Direct and courteous.' },
    },
    'is this vegetarian': {
      Hindi: { trans: 'क्या यह शाकाहारी है? (Kya yeh shakahari hai?)', pron: 'Kya yeh sha-ka-ha-ri hai?', note: 'Widely understood across all Indian restaurants.' },
      Tamil: { trans: 'இது சைவ உணவா? (Idhu saiva unavaa?)', pron: 'E-dhu sai-va u-na-va?', note: '"Saivam" specifically denotes pure vegetarian.' },
    },
  };

  const key = Object.keys(phrases).find((k) => text.toLowerCase().includes(k));
  if (key && phrases[key][targetLang]) {
    const item = phrases[key][targetLang];
    return {
      translatedText: item.trans,
      pronunciationGuide: item.pron,
      culturalNote: item.note,
      quickReplies: ['Ji haan (Yes)', 'Nahi (No)', 'Dhanyavaad (Thank you)'],
    };
  }

  return {
    translatedText: `[${targetLang}]: ${text}`,
    pronunciationGuide: 'Pronounce phonetically with friendly smile',
    culturalNote: 'Starting with a respectful "Namaste" or "Vanakkam" opens friendly doors everywhere in India.',
    quickReplies: ['Haan ji (Yes)', 'Nahi (No)', 'Theek hai (All good / OK)', 'Shukriya (Thanks)'],
  };
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Normalize requests prefixed with base path if any (e.g. /Rahi_prototype/api/*)
app.use((req, _res, next) => {
  if (req.url.startsWith('/Rahi_prototype/api/')) {
    req.url = req.url.replace('/Rahi_prototype', '');
  }
  next();
});

// Initialize Google GenAI client lazily if key exists
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY;

  if (!aiClient && apiKey) {
    try {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize Google GenAI client:", e);
    }
  }
  return aiClient;
}

// Helper to call Gemini models with resilient model fallback
async function callGeminiContent(ai: GoogleGenAI, options: any) {
  const models = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
  let lastErr: any = null;
  for (const model of models) {
    try {
      const res = await ai.models.generateContent({
        ...options,
        model,
      });
      if (res && res.text) {
        return res;
      }
    } catch (err: any) {
      lastErr = err;
      console.warn(`Model ${model} request failed, trying next fallback:`, err?.status || err?.message?.slice(0, 80));
    }
  }
  throw lastErr || new Error("Failed to generate content with Gemini models");
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    preferredModel: "gemini-3.1-flash-lite",
    timestamp: new Date().toISOString(),
  });
});

// Contextual fallback helper for travel chat
function generateDynamicTravelReply(userText: string): string {
  const query = (userText || "").toLowerCase();

  if (query.includes("goa") || query.includes("beach") || query.includes("coastal")) {
    return (
      "🌴 **Goa & Coastal Recommendations:**\n\n" +
      "• **Secluded Beaches:** Visit Kakolem (Tiger Beach) or Butterfly Beach in South Goa for tranquil coves away from the crowd.\n" +
      "• **Heritage & Culture:** Stroll through Fontainhas (Latin Quarter in Panaji) early morning for Portuguese architecture and authentic bakeries.\n" +
      "• **Local Dining:** Try authentic Fish Thali at Vinayak Family Restaurant (Assagao) or Ritz Classic (Panaji).\n" +
      "• **Smart Tip:** Rent an electric scooter (~₹350–₹500/day) to navigate narrow coastal lanes affordably."
    );
  }

  if (query.includes("bargain") || query.includes("hindi") || query.includes("language") || query.includes("phrase")) {
    return (
      "🗣️ **Helpful Local Phrases & Bargaining Etiquette:**\n\n" +
      "• *'Bhaiya, thoda theek lagao'* (Brother, please give a reasonable price)\n" +
      "• *'Ye kitne ka hai?'* (How much is this?)\n" +
      "• *'Aakhri kitna loge?'* (What is your final price?)\n" +
      "• *'Dhanyavaad'* or *'Shukriya'* (Thank you!)\n\n" +
      "💡 *Tip:* Always smile and maintain a friendly, respectful tone. In bustling bazaars (like Jaipur or Delhi), starting at 60–70% of the initial quote is common practice."
    );
  }

  if (query.includes("budget") || query.includes("cost") || query.includes("save") || query.includes("cheap")) {
    return (
      "💰 **Smart Budget Travel Hacks for India:**\n\n" +
      "1. **Rail Transit:** Book 3AC or Sleeper train tickets on IRCTC for long distance travel — it cuts flights costs by up to 75%.\n" +
      "2. **Stays:** Opt for verified homestays or Zostel/hostel chains where breakfast and community itineraries are often included.\n" +
      "3. **Food:** Eat where local families dine — Thali restaurants, generational sweetshops, and clean South Indian tiffin centers give you the best food at ₹120–₹250 per meal.\n" +
      "4. **Intra-city:** Use metro systems (Delhi, Mumbai, Bengaluru, Jaipur) or pre-paid auto stands instead of unmetered street rides."
    );
  }

  if (query.includes("safe") || query.includes("solo") || query.includes("night") || query.includes("emergency") || query.includes("women")) {
    return (
      "🛡️ **Solo & Night Travel Safety Guidance:**\n\n" +
      "• **Emergency SOS:** Dial **112** (Pan-India Emergency) or **1091** (Women Helpline). Use Rahi's in-app SOS modal for quick broadcast.\n" +
      "• **Transit Safety:** Pre-book official Uber/Ola or pre-paid police-managed taxi counters at railway stations and airports. Avoid unmarked private offers.\n" +
      "• **Accommodation:** Check in at hotels with 24/7 reception and high safety ratings in central, well-lit neighborhoods.\n" +
      "• **Connectivity:** Maintain a local eSIM/SIM card with active data to share your live location with trusted contacts."
    );
  }

  if (query.includes("food") || query.includes("eat") || query.includes("restaurant") || query.includes("dish") || query.includes("curry")) {
    return (
      "🍲 **Authentic Culinary Experiences:**\n\n" +
      "• **North India:** Fresh stuffed Kulchas with Chole in Amritsar, Rogan Josh & Kashmiri Kahwa in Srinagar, Galouti Kebabs in Lucknow.\n" +
      "• **West India:** Dal Baati Churma in Rajasthan, Poha & Sev in Indore, Authentic Kathiyawadi Thali in Gujarat.\n" +
      "• **South India:** Chettinad Pepper Chicken in Tamil Nadu, Malabar Parotta with Fish Curry in Kerala, Idli-Vada with ghee dip in Bengaluru.\n" +
      "• **Hygiene Rule:** Look for high-turnover eateries where food is cooked fresh on open flames and drinking water is filtered (RO) or bottled."
    );
  }

  return (
    `✈️ **Travel Insights for "${userText}":**\n\n` +
    "• **Timing is Key:** In most popular tourist regions, early mornings (6:30 AM – 9:00 AM) offer the best lighting, zero ticket queues, and pleasant temperatures.\n" +
    "• **Authentic Experiences:** Ask your homestay host or local store owners for recommendations on family-run tea stalls and lesser-known viewpoints.\n" +
    "• **Verified Navigation:** Download offline maps (Google Maps / OpenStreetMap) before heading into hilly or dense forest reserves.\n\n" +
    "Feel free to ask me for a detailed day-wise itinerary, budget calculation, or specific hotel and food recommendations!"
  );
}

// AI Chat Copilot API
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message string is required" });
    }

    const trimmedMessage = message.trim();
    const ai = getAIClient();

    if (ai) {
      // Build conversation contents conforming to Gemini API
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if (item && item.text && typeof item.text === "string") {
            contents.push({
              role: item.sender === "user" ? "user" : "model",
              parts: [{ text: item.text }],
            });
          }
        }
      }

      // Add the current user query
      contents.push({
        role: "user",
        parts: [{ text: trimmedMessage }],
      });

      const response = await callGeminiContent(ai, {
        contents,
        config: {
          systemInstruction:
            "You are Rahi's intelligent, empathetic, and knowledgeable AI Travel Copilot. " +
            "You provide real-time, authentic travel tips for India and international destinations. " +
            "Offer specific hidden gems, cost-effective options, safety guidance, local culinary highlights, " +
            "and cultural tips tailored specifically to the user's inquiry. " +
            "Format your answers with readable bullet points, bold headers, and practical tips. Keep answers helpful, concise, and vibrant.",
        },
      });

      const reply = response.text?.trim() || generateDynamicTravelReply(trimmedMessage);
      return res.json({ success: true, reply, isLiveAI: true });
    }

    // Dynamic smart reply if AI client not initialized
    return res.json({
      success: true,
      reply: generateDynamicTravelReply(trimmedMessage),
      isLiveAI: false,
    });
  } catch (error: any) {
    console.error("AI Chat generation error:", error);
    return res.json({
      success: true,
      reply: generateDynamicTravelReply(req.body?.message || ""),
      isLiveAI: false,
    });
  }
});

// AI Trip Planner API
app.post("/api/ai/plan-trip", async (req, res) => {
  try {
    const {
      destination,
      dates,
      daysCount,
      budget,
      budgetTotal,
      travellers,
      companions,
      preferences,
      travelStyle,
      message,
    } = req.body;

    const targetDestination = destination || "Goa, India";
    const totalDays = Number(daysCount) || 4;
    const totalBudget = Number(budgetTotal || budget) || 40000;
    const travellerCount = Number(travellers || companions?.match(/\d+/)?.[0]) || 2;
    const prefSummary = travelStyle || preferences || "Balanced sightseeing, authentic food, culture, nature";

    const ai = getAIClient();

    if (ai) {
      const prompt = `You are Rahi's master AI Travel Architect.
Generate a structured, realistic, high-quality trip plan based on the following request:
- Destination: ${targetDestination}
- Number of Days: ${totalDays}
- Total Budget: ₹${totalBudget}
- Number of Travellers: ${travellerCount}
- Preferences: ${prefSummary}
- Additional Note: ${message || "Create a comprehensive balanced itinerary with daily breakdown and cost estimations."}

Return a valid JSON object strictly matching this schema:
{
  "tripTitle": "string",
  "summary": "string",
  "recommendedSeason": "string",
  "weatherNote": "string",
  "transportation": {
    "recommendedMode": "Flight | Train | Bus | Self-Drive",
    "estimatedCost": number,
    "details": "string",
    "cheaperAlternative": "string"
  },
  "accommodation": {
    "recommendedType": "string",
    "estimatedCostPerNight": number,
    "totalCost": number,
    "suggestions": ["string", "string"]
  },
  "budgetBreakdown": {
    "transport": number,
    "stay": number,
    "food": number,
    "activities": number,
    "emergencyBuffer": number,
    "totalEstimated": number,
    "perPersonCost": number
  },
  "dailyItinerary": [
    {
      "day": 1,
      "title": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "mealHighlight": "string",
      "estimatedDayExpense": number,
      "activities": [
        {
          "timeSlot": "Morning | Afternoon | Evening",
          "activityTitle": "string",
          "description": "string",
          "location": "string",
          "cost": number,
          "category": "sightseeing | nature | food | culture | adventure"
        }
      ]
    }
  ],
  "hiddenGems": ["string", "string"],
  "safetyTips": ["string", "string"],
  "savingsTips": ["string", "string"]
}`;

      const response = await callGeminiContent(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);

        // Transform for TripPlanner.tsx consumer compatibility
        const transformedDays = (parsed.dailyItinerary || []).map((dayItem: any, idx: number) => ({
          day: dayItem.day || idx + 1,
          title: dayItem.title || `Day ${idx + 1} Discovery`,
          activities: Array.isArray(dayItem.activities) && dayItem.activities.length > 0
            ? dayItem.activities
            : [
                {
                  timeSlot: "Morning",
                  activityTitle: dayItem.morning || "Morning Exploration",
                  description: dayItem.morning || "Start the day exploring top landmarks.",
                  location: targetDestination,
                  cost: Math.round((dayItem.estimatedDayExpense || 1200) * 0.3),
                  category: "sightseeing",
                },
                {
                  timeSlot: "Afternoon",
                  activityTitle: dayItem.afternoon || "Afternoon Cultural Immersion",
                  description: dayItem.afternoon || "Local cuisine and market walk.",
                  location: targetDestination,
                  cost: Math.round((dayItem.estimatedDayExpense || 1200) * 0.35),
                  category: "culture",
                },
                {
                  timeSlot: "Evening",
                  activityTitle: dayItem.evening || "Sunset & Twilight Walk",
                  description: dayItem.evening || "Relaxed evening stroll and local dinner.",
                  location: targetDestination,
                  cost: Math.round((dayItem.estimatedDayExpense || 1200) * 0.35),
                  category: "food",
                },
              ],
        }));

        const tripFormat = {
          destination: targetDestination,
          days: transformedDays,
        };

        return res.json({ success: true, plan: parsed, trip: tripFormat, isLiveAI: true });
      } catch (parseErr) {
        console.warn("Could not parse JSON from Gemini response, falling back to structured generator", parseErr);
      }
    }

    // Heuristic structured plan fallback
    const parsedBudget = totalBudget;
    const count = travellerCount;
    const transportCost = Math.round(parsedBudget * 0.28);
    const stayCost = Math.round(parsedBudget * 0.35);
    const foodCost = Math.round(parsedBudget * 0.2);
    const actCost = Math.round(parsedBudget * 0.12);
    const bufferCost = parsedBudget - (transportCost + stayCost + foodCost + actCost);

    const daysList = Array.from({ length: totalDays }, (_, i) => {
      const dayNum = i + 1;
      return {
        day: dayNum,
        title: dayNum === 1 ? "Arrival & Golden Hour" : dayNum === totalDays ? "Farewell & Souvenirs" : `Discovery & Trails Part ${dayNum}`,
        morning: `Early morning exploration of ${targetDestination} historic trails and temples.`,
        afternoon: `Traditional local lunch and artisan craft market visit in ${targetDestination}.`,
        evening: `Sunset viewpoint and regional dinner experience.`,
        mealHighlight: `Authentic regional thali and seasonal sweet.`,
        estimatedDayExpense: Math.round(actCost / totalDays + foodCost / totalDays),
        activities: [
          {
            timeSlot: "Morning",
            activityTitle: `${targetDestination} Sunrise & Heritage Trail`,
            description: "Explore quiet pathways before crowds arrive.",
            location: targetDestination,
            cost: Math.round(actCost / (totalDays * 2)),
            category: "sightseeing",
          },
          {
            timeSlot: "Afternoon",
            activityTitle: "Artisan Bazaar & Regional Tasting",
            description: "Sample local delicacies and meet generational craftspeople.",
            location: targetDestination,
            cost: Math.round(actCost / (totalDays * 3)),
            category: "culture",
          },
          {
            timeSlot: "Evening",
            activityTitle: "Scenic Sunset Point & Local Feast",
            description: "Breathtaking vistas followed by an authentic dinner.",
            location: targetDestination,
            cost: Math.round(actCost / (totalDays * 3)),
            category: "food",
          },
        ],
      };
    });

    const fallbackPlan = {
      tripTitle: `Customized Discovery of ${targetDestination}`,
      summary: `A personalized, immersive itinerary for ${count} travellers with authentic local cuisine, heritage walks, and nature discovery.`,
      recommendedSeason: "October to March",
      weatherNote: "Pleasant temperatures, ideal for daytime outdoor activities.",
      transportation: {
        recommendedMode: "Express Train / AC Volvo",
        estimatedCost: transportCost,
        details: "Comfortable transit with picturesque station transfers.",
        cheaperAlternative: "State Transport Semi-Sleeper (Saves up to ₹2,500)",
      },
      accommodation: {
        recommendedType: "Verified Heritage Boutique Stay",
        estimatedCostPerNight: Math.round(stayCost / totalDays),
        totalCost: stayCost,
        suggestions: [`${targetDestination} Heritage Retreat`, "Green Haven Eco Villa"],
      },
      budgetBreakdown: {
        transport: transportCost,
        stay: stayCost,
        food: foodCost,
        activities: actCost,
        emergencyBuffer: bufferCost > 0 ? bufferCost : 2000,
        totalEstimated: transportCost + stayCost + foodCost + actCost,
        perPersonCost: Math.round((transportCost + stayCost + foodCost + actCost) / count),
      },
      dailyItinerary: daysList,
      hiddenGems: [
        `Secluded viewpoints outside central ${targetDestination}`,
        "Family-owned spice or tea garden plantation walk",
        "Ancient stone stepwell or forest cascade",
      ],
      safetyTips: [
        "Keep digital copies of IDs and emergency SOS contacts in the Rahi app.",
        "Use authorized pre-paid taxi booths or app rides.",
      ],
      savingsTips: [
        "Book train tickets early on IRCTC or state bus transport.",
        "Rent an electric scooter or bicycle for intra-city transit.",
      ],
    };

    return res.json({
      success: true,
      plan: fallbackPlan,
      trip: {
        destination: targetDestination,
        days: daysList,
      },
      isLiveAI: false,
    });
  } catch (error: any) {
    console.error("Trip planning error:", error);
    res.status(500).json({ error: error.message || "Failed to generate plan" });
  }
});

// Conversational Itinerary Modification API
app.post("/api/ai/modify-trip", async (req, res) => {
  try {
    const { currentPlan, instruction } = req.body;
    const ai = getAIClient();

    if (ai && currentPlan) {
      const prompt = `You are Rahi's AI Trip Planner. The user wants to modify their current trip plan with this instruction: "${instruction}".
Current Trip Plan: ${JSON.stringify(currentPlan)}

Please return the updated complete JSON object with all adjustments applied (e.g. adjust costs, swap activities, switch hotels, add/remove days, apply off-season discounts). Return strictly the JSON object.`;

      const response = await callGeminiContent(ai, {
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, updatedPlan: parsed, isLiveAI: true });
      } catch {
        return res.json({ success: true, rawText: responseText, isLiveAI: true });
      }
    }

    return res.json({
      success: true,
      message: `Heuristic updated according to: "${instruction}"`,
      isLiveAI: false,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Translator API
app.post("/api/ai/translate", async (req, res) => {
  try {
    const { text, sourceLang, targetLang, context } = req.body;
    const ai = getAIClient();

    if (ai) {
      const prompt = `Translate the following text for a traveller from ${sourceLang || "English"} to ${targetLang || "Hindi"}.
Context: ${context || "Tourism, dining, navigation, or emergency"}
Text to translate: "${text}"

Provide a JSON output with:
{
  "translatedText": "string",
  "pronunciationGuide": "string (phonetic romanization)",
  "culturalNote": "short tip on etiquette or local phrasing",
  "quickReplies": ["reply 1", "reply 2"]
}`;

      const response = await callGeminiContent(ai, {
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const raw = response.text || "{}";
      try {
        const parsed = JSON.parse(raw);
        return res.json({ success: true, data: parsed, isLiveAI: true });
      } catch {
        return res.json({ success: true, data: { translatedText: raw }, isLiveAI: true });
      }
    }

    // Static fallback translation
    return res.json({
      success: true,
      data: {
        translatedText: `[Translation to ${targetLang}]: ${text}`,
        pronunciationGuide: "Phonetic guide available online",
        culturalNote: "Greet locals politely with 'Namaste' or a gentle nod.",
        quickReplies: ["Thank you! (Dhanyavaad)", "How much is this? (Yeh kitne ka hai?)", "Where is the station? (Station kahan hai?)"]
      }
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Business Insights API
app.post("/api/ai/business-insights", async (req, res) => {
  try {
    const { businessName, category, location } = req.body;
    const ai = getAIClient();

    if (ai) {
      const prompt = `Provide practical tourism business growth insights for a "${category}" named "${businessName}" located in "${location}".
Return a JSON object with:
{
  "popularTravellerCategories": ["Families (40%)", "Solo Backpacker (30%)", "Couples (30%)"],
  "popularPriceRanges": "₹1,800 - ₹3,500 per night/meal",
  "highInterestPeriods": "October - February (Festivals & winter holidays)",
  "lowerDemandPeriods": "May - July (Monsoon / Off-peak)",
  "suggestedPackages": [
    { "name": "Monsoon Spa & Rejuvenation Retreat", "expectedUplift": "+25% Bookings", "strategy": "Include free airport pickup & breakfast" }
  ],
  "pricingRecommendations": "Offer 20% weekday discount to attract remote workers."
}`;

      const response = await callGeminiContent(ai, {
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const raw = response.text || "{}";
      try {
        const parsed = JSON.parse(raw);
        return res.json({ success: true, insights: parsed, isLiveAI: true });
      } catch {
        return res.json({ success: true, rawText: raw, isLiveAI: true });
      }
    }

    return res.json({
      success: true,
      insights: {
        popularTravellerCategories: ["Couples & Honeymooners (42%)", "Solo & Digital Nomads (33%)", "Family Groups (25%)"],
        popularPriceRanges: "₹2,200 - ₹4,800 per booking",
        highInterestPeriods: "October to March (Peak Season with 88% occupancy)",
        lowerDemandPeriods: "June to August (Monsoon Shoulder season)",
        suggestedPackages: [
          { name: "Long-Stay Workation Special", expectedUplift: "+32% Off-Peak Revenue", strategy: "Complimentary high-speed WiFi and free laundry." },
          { name: "Weekend Heritage & Food Walk Bundle", expectedUplift: "+20% Weekend Margin", strategy: "Partner with local heritage storytellers." }
        ],
        pricingRecommendations: "Run a 15% early-bird discount for winter bookings before September 30."
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Issue Summary Dossier API for Civic Authorities
app.post("/api/ai/summarize-issue", async (req, res) => {
  try {
    const { location, issueType, reportsCount, recentNotes } = req.body;
    const ai = getAIClient();

    if (ai) {
      const prompt = `Generate a concise, professional civic authority action dossier for municipal / tourism department.
Location: ${location}
Issue Type: ${issueType}
Total Verified Reports: ${reportsCount}
Recent Reporter Descriptions: ${JSON.stringify(recentNotes)}

Return JSON with:
{
  "dossierTitle": "string",
  "urgencyLevel": "LOW | MEDIUM | HIGH | CRITICAL",
  "executiveSummary": "string",
  "impactOnTourism": "string",
  "recommendedImmediateActions": ["string", "string"],
  "assignedDepartment": "string",
  "escalationNotice": "string"
}`;

      const response = await callGeminiContent(ai, {
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const raw = response.text || "{}";
      try {
        const parsed = JSON.parse(raw);
        return res.json({ success: true, dossier: parsed, isLiveAI: true });
      } catch {
        return res.json({ success: true, rawText: raw, isLiveAI: true });
      }
    }

    return res.json({
      success: true,
      dossier: {
        dossierTitle: `Consolidated Civic Action Report: ${issueType} at ${location}`,
        urgencyLevel: reportsCount > 5 ? "CRITICAL" : "HIGH",
        executiveSummary: `Multiple verified tourist and resident reports (${reportsCount} complaints) have pinpointed recurring ${issueType.toLowerCase()} impacting visitor safety and hygiene at ${location}.`,
        impactOnTourism: "Impacting footfall, foreign visitor satisfaction ratings, and pedestrian accessibility.",
        recommendedImmediateActions: [
          "Deploy rapid response municipal sanitation / maintenance crew within 24 hours.",
          "Install high-luminosity solar streetlights and directional advisory signage.",
          "Establish weekly inspection routine with local tourism police precinct."
        ],
        assignedDepartment: "District Tourism Safety & Municipal Infrastructure Board",
        escalationNotice: "Official electronic notice automatically dispatched to regional ward officer."
      }
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Vite middleware or static serving
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use("/Rahi_prototype", express.static(distPath));
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SafarSetu Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();

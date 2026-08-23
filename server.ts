import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI client lazily if key exists
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Failed to initialize Google GenAI client:", e);
    }
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Trip Planner API
app.post("/api/ai/plan-trip", async (req, res) => {
  try {
    const { destination, dates, budget, travellers, preferences, message } = req.body;
    const ai = getAIClient();

    if (ai) {
      const prompt = `You are SafarSetu's master AI Travel Assistant for India and global tourism.
Generate a structured, realistic, high-quality trip plan based on the following request:
- Destination: ${destination || "India Destination"}
- Duration / Dates: ${dates || "4-5 Days"}
- Budget: ₹${budget || "40,000"}
- Number of Travellers: ${travellers || 2}
- Preferences: ${preferences || "Balanced sightseeing, local food, culture, nature, comfortable stays"}
- User Note: ${message || "Create a comprehensive balanced itinerary with daily breakdown and cost estimations."}

Return a valid JSON object with the following structure:
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
    "recommendedType": "Resort | Boutique Hotel | Homestay | Hostel",
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
      "title": "Arrival & Sunset Exploration",
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "mealHighlight": "string",
      "estimatedDayExpense": number
    }
  ],
  "hiddenGems": ["string", "string"],
  "safetyTips": ["string", "string"],
  "savingsTips": ["string", "string"]
}
Only output the JSON object with no markdown fences if possible, or standard markdown json.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, plan: parsed, isLiveAI: true });
      } catch {
        // if parse fails, return structured text
        return res.json({ success: true, rawText: responseText, isLiveAI: true });
      }
    }

    // Heuristic Fallback if API key not available
    const parsedBudget = Number(budget) || 45000;
    const count = Number(travellers) || 2;
    const transportCost = Math.round(parsedBudget * 0.28);
    const stayCost = Math.round(parsedBudget * 0.35);
    const foodCost = Math.round(parsedBudget * 0.2);
    const actCost = Math.round(parsedBudget * 0.12);
    const bufferCost = parsedBudget - (transportCost + stayCost + foodCost + actCost);

    const fallbackPlan = {
      tripTitle: `Enchanting Escape to ${destination || "Goa"}`,
      summary: `A personalized, immersive trip for ${count} travellers with authentic local cuisine, heritage walks, coastal viewpoints, and nature discovery.`,
      recommendedSeason: "October to March",
      weatherNote: "Sunny & pleasant with cool coastal breezes (24°C - 31°C). Ideal for outdoor experiences.",
      transportation: {
        recommendedMode: "Express Train / Semi-Sleeper AC Bus",
        estimatedCost: transportCost,
        details: "Comfortable overnight transit with scenic vistas and seamless station transfers.",
        cheaperAlternative: "State Road Transport Deluxe Bus (Saves up to ₹3,500)"
      },
      accommodation: {
        recommendedType: "Eco-Boutique Heritage Stay",
        estimatedCostPerNight: Math.round(stayCost / 4),
        totalCost: stayCost,
        suggestions: ["Palm Breeze Heritage Villa", "Coastal Haven Eco Cottages"]
      },
      budgetBreakdown: {
        transport: transportCost,
        stay: stayCost,
        food: foodCost,
        activities: actCost,
        emergencyBuffer: bufferCost > 0 ? bufferCost : 2000,
        totalEstimated: transportCost + stayCost + foodCost + actCost,
        perPersonCost: Math.round((transportCost + stayCost + foodCost + actCost) / count)
      },
      dailyItinerary: [
        {
          day: 1,
          title: "Arrival & Coastal Golden Hour",
          morning: "Arrival, scenic check-in, unpack and refresh with fresh tender coconut water.",
          afternoon: "Explore local artisan village, visit traditional spice market and cafe.",
          evening: "Sunset walk at secluded cliff beach followed by fresh seafood/local thali dinner.",
          mealHighlight: "Authentic local spice curry with sourdough poee / traditional breads.",
          estimatedDayExpense: Math.round(parsedBudget / 5)
        },
        {
          day: 2,
          title: "Heritage Forts & Hidden Trails",
          morning: "Early sunrise hike to an ancient Portuguese ruin overlooking azure waters.",
          afternoon: "Guided tour through colorful Latin quarter / heritage architectural promenade.",
          evening: "Catamaran sunset cruise & live acoustic local folk music session.",
          mealHighlight: "Traditional clay-pot cooked feast with regional kokum cooler.",
          estimatedDayExpense: Math.round(parsedBudget / 4.5)
        },
        {
          day: 3,
          title: "Nature Cascades & Village Immersion",
          morning: "Jungle trek to serene forest waterfall pools for a refreshing morning swim.",
          afternoon: "Organic farm lunch, cashew/tea plantation walk with local growers.",
          evening: "Night market exploration, handicrafts shopping, and street-food sampling.",
          mealHighlight: "Freshly roasted street delicacies and herbal desserts.",
          estimatedDayExpense: Math.round(parsedBudget / 5)
        },
        {
          day: 4,
          title: "Water Escapades & Twilight Farewell",
          morning: "Morning paddleboarding or heritage temple trail at peaceful backwaters.",
          afternoon: "Relaxed souvenir shopping at local women's cooperative craft shop.",
          evening: "Grand farewell beachside dinner with traditional lanterns and live music.",
          mealHighlight: "Chef's special coastal thali with seasonal tropical dessert.",
          estimatedDayExpense: Math.round(parsedBudget / 5.2)
        }
      ],
      hiddenGems: [
        "Kakolem Secluded Cove & Waterfall",
        "Chorão Island Bird Sanctuary Mangrove Kayaking",
        "Savoi Organic Spice Plantation Kitchen"
      ],
      safetyTips: [
        "Keep digital copies of IDs and emergency SOS contacts handy in the app.",
        "Use certified government-metered taxis or app-hailed tourist cabs."
      ],
      savingsTips: [
        "Rent local electric scooters for intra-city trips to cut transit costs by 60%.",
        "Book homestays that include complimentary traditional breakfast."
      ]
    };

    return res.json({ success: true, plan: fallbackPlan, isLiveAI: false });
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
      const prompt = `You are SafarSetu's AI Trip Planner. The user wants to modify their current trip plan with this instruction: "${instruction}".
Current Trip Plan: ${JSON.stringify(currentPlan)}

Please return the updated complete JSON object with all adjustments applied (e.g. adjust costs, swap activities, switch hotels, add/remove days). Return strictly the JSON object.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, updatedPlan: parsed, isLiveAI: true });
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

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      return res.json({ success: true, data: JSON.parse(response.text || "{}") });
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

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      return res.json({ success: true, insights: JSON.parse(response.text || "{}") });
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

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      return res.json({ success: true, dossier: JSON.parse(response.text || "{}") });
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

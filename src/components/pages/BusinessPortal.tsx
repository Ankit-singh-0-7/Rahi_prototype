import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import {
  Briefcase,
  Plus,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Calendar,
  IndianRupee,
  Users,
  CheckCircle,
  Building,
  Phone,
  Mail,
  Lightbulb,
  FileCheck,
} from 'lucide-react';

export const BusinessPortal: React.FC = () => {
  const { businessProfile, updateReservationStatus, showToast } = useTravel();

  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'reservations' | 'ai-marketing'>('overview');

  // AI Marketing insight generation state
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [marketingInsights, setMarketingInsights] = useState<any>(null);

  // Business registration state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState<'Hotel' | 'Restaurant' | 'Tour Guide' | 'Transport'>('Hotel');
  const [bizDest, setBizDest] = useState('Goa');
  const [bizPhone, setBizPhone] = useState('+91 98765 43210');
  const [bizEmail, setBizEmail] = useState('host@rahi.travel');
  const [bizDesc, setBizDesc] = useState('');

  const handleGenerateBusinessInsights = async () => {
    setIsGeneratingInsights(true);
    showToast('Analyzing tourism trends and generating business insights with Gemini AI...');

    try {
      const res = await fetch('/api/ai/business-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessProfile.name,
          category: businessProfile.category,
          destination: businessProfile.destination,
          season: 'Upcoming Shoulder Season (Oct - Nov)',
        }),
      });

      const data = await res.json();
      if (data.insights) {
        setMarketingInsights(data.insights);
        showToast('AI Business Promotion & Seasonal Optimization Plan ready!');
      }
    } catch (e) {
      console.warn('AI insights fallback', e);
      setMarketingInsights({
        recommendedPromotions: [
          'Launch a "Work-from-Heritage-Homestay" 7-day discounted package with high-speed Wi-Fi & complimentary homecooked breakfast.',
          'Partner with local bicycle rental owners to offer eco-friendly heritage sunset tours.',
        ],
        pricingStrategy: 'Keep base tariffs at ₹2,600 during weekdays and bump to ₹3,400 for weekend festival rush.',
        seasonalTips: 'Stock monsoon rainwear and organize cozy indoor Goan spice-tasting sessions during heavy rain hours.',
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName || !bizName.trim()) return;

    setShowRegisterModal(false);
    showToast(`"${bizName.trim()}" submitted for verified zero-commission listing! Direct caller connectivity enabled.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-sky-900/40">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span>Local Tourism Business & Host Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
            {businessProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Manage direct guest reservations, respond to customer inquiries, and boost your bookings with AI marketing tools with 0% platform commission.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Property / Shop</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs">
        {[
          { id: 'overview', label: '📊 Dashboard Overview' },
          { id: 'reservations', label: `📅 Direct Reservations (${businessProfile.reservations.length})` },
          { id: 'enquiries', label: `💬 Customer Enquiries (${businessProfile.enquiries.length})` },
          { id: 'ai-marketing', label: '✨ AI Marketing Engine' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Monthly Views</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">4,280 Views</span>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">↑ 24% vs last month</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Direct Enquiries</span>
              <span className="text-2xl font-black text-sky-600 mt-1 block">
                {businessProfile.enquiries.length} Inquiries
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">100% direct customer leads</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Confirmed Bookings</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {businessProfile.reservations.filter((r) => r.status === 'Confirmed').length} Confirmed
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">₹0 middleman fee deducted</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Guest Rating</span>
              <span className="text-2xl font-black text-amber-500 mt-1 block">{businessProfile.rating} / 5.0 ★</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Based on {businessProfile.reviewsCount} reviews</span>
            </div>
          </div>

          {/* Business Profile Details Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <Building className="w-6 h-6 text-sky-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{businessProfile.name}</h3>
                  <p className="text-slate-500">{businessProfile.category} • {businessProfile.destination}</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold text-[10px]">
                Active & Verified Host
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Direct Contact Phone</span>
                <span className="font-bold text-sm text-slate-900">{businessProfile.phone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Official Business Email</span>
                <span className="font-bold text-sm text-slate-900">{businessProfile.email}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Host Description</span>
              <p className="text-slate-600 mt-1 leading-relaxed">{businessProfile.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. DIRECT RESERVATIONS TAB */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Direct Customer Reservation Requests</h3>
            <span className="text-slate-500">Contact guests directly to confirm check-ins</span>
          </div>

          <div className="space-y-3">
            {businessProfile.reservations.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{res.guestName}</span>
                    <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.2 rounded-md">
                      {res.roomTypeOrTable}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                        res.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : res.status === 'Declined'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Dates: <strong>{res.dates}</strong> • {res.guestsCount} Guests
                  </p>
                  {res.notes && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">Notes: "{res.notes}"</p>
                  )}
                  <div className="flex items-center space-x-4 text-[11px] text-slate-500 mt-1.5">
                    <span>Phone: {res.guestPhone}</span>
                    <span>Email: {res.guestEmail}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {res.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => updateReservationStatus(res.id, 'Confirmed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateReservationStatus(res.id, 'Declined')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  <a
                    href={`tel:${res.guestPhone}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Guest</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CUSTOMER ENQUIRIES TAB */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Incoming Guest Queries & Questions</h3>
            <span className="text-slate-500">Respond to questions about group rates & amenities</span>
          </div>

          <div className="space-y-3">
            {businessProfile.enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{enq.senderName}</span>
                    <span className="text-[10px] text-slate-400">{enq.timestamp}</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.2 rounded-md">
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-slate-700 mt-1 bg-white p-2.5 rounded-xl border border-slate-200/80">
                    "{enq.message}"
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Phone: {enq.senderPhone}</p>
                </div>

                <div className="shrink-0">
                  <a
                    href={`tel:${enq.senderPhone}`}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Reply by Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. AI MARKETING ENGINE TAB */}
      {activeTab === 'ai-marketing' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-sky-600 tracking-wider">
                Intelligent Promotion Copilot
              </span>
              <h3 className="text-base font-black text-slate-900 mt-0.5">
                AI Seasonal Revenue & Promotion Optimizer
              </h3>
              <p className="text-slate-500">
                Generate high-converting packages and dynamic pricing strategies tailored for {businessProfile.destination}.
              </p>
            </div>

            <button
              onClick={handleGenerateBusinessInsights}
              disabled={isGeneratingInsights}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>{isGeneratingInsights ? 'Synthesizing Market Intelligence...' : '✨ Generate AI Promotion Plan'}</span>
            </button>
          </div>

          {marketingInsights ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <span className="font-bold text-sky-900 flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-sky-600" />
                  <span>Recommended High-Conversion Packages</span>
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-700">
                  {marketingInsights.recommendedPromotions.map((promo: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{promo}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <span className="font-bold text-emerald-900 block">Dynamic Pricing Recommendation</span>
                  <p className="text-slate-700 leading-relaxed">{marketingInsights.pricingStrategy}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <span className="font-bold text-amber-900 block">Seasonal Tourism Tips</span>
                  <p className="text-slate-700 leading-relaxed">{marketingInsights.seasonalTips}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-sky-400 opacity-60 animate-pulse" />
              <p>Click "Generate AI Promotion Plan" above to analyze regional trends and craft custom package deals.</p>
            </div>
          )}
        </div>
      )}

      {/* REGISTER NEW BUSINESS MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-sky-600 text-white p-4 font-bold flex items-center justify-between">
              <span>List Your Local Tourism Business (0% Commission)</span>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="hover:bg-white/20 p-1 rounded-full cursor-pointer text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Business / Property Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whispering Pines Eco Lodge & Cafe"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Category *</label>
                  <select
                    value={bizCategory}
                    onChange={(e) => setBizCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Hotel">Hotel / Homestay / Eco Lodge</option>
                    <option value="Restaurant">Local Eatery / Cafe</option>
                    <option value="Tour Guide">Certified Local Tour Guide</option>
                    <option value="Transport">Local Taxi / Scooter Rental</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={bizDest}
                    onChange={(e) => setBizDest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Direct Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={bizPhone}
                    onChange={(e) => setBizPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={bizEmail}
                    onChange={(e) => setBizEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">About Your Services</label>
                <textarea
                  rows={3}
                  placeholder="Describe your property, tariff ranges, organic farm meals, or special local experiences..."
                  value={bizDesc}
                  onChange={(e) => setBizDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition cursor-pointer"
                >
                  Publish Free Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AIAssistantPage: React.FC = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Namaste! I am your Rahi AI Travel Copilot. Ask me anything about off-beat hidden gems, budget tricks, local cuisine recommendations, safety advisories, or translation help in Hindi and regional languages.',
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const quickPrompts = [
    'What are 3 secluded hidden beaches in South Goa away from crowds?',
    'How do I politely bargain at Jaipur Johari Bazaar in Hindi?',
    'Suggest an affordable 4-day itinerary for Manali under ₹15,000.',
    'Is it safe for solo female travellers in Varanasi at night?',
    'Where can I eat authentic Malabar fish curry in Kerala?',
  ];

  const handleSendMessage = async (userText: string) => {
    if (!userText || !userText.trim() || isAiGenerating) return;

    const trimmedText = userText.trim();
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsAiGenerating(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedText,
          history: chatHistory.slice(-6),
        }),
      });

      const data = await res.json();
      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'I am ready to help you plan your journey across India!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiReply]);
    } catch (e) {
      console.warn('AI chat fallback', e);
      const fallbackReply = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Here is local guidance for "${trimmedText}": \n\n• For peaceful, affordable travel: Early morning heritage walks (6 AM - 8:30 AM) beat crowds and midday sun.\n• Transport: Prefer prepaid state counters at railway stations or app cabs with fixed fares to avoid overcharging.\n• Dining: Look for bustling generational sweetshops and banana-leaf messes frequented by local families for pristine hygiene and authentic flavor.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, fallbackReply]);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 via-indigo-700 to-sky-800 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-6 h-6 text-sky-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black font-display">Rahi AI Travel Copilot</h1>
              <span className="bg-emerald-400/20 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                Online & Verified
              </span>
            </div>
            <p className="text-xs text-sky-100 mt-0.5">
              Powered by Gemini 2.5 Flash. Real-time Indian travel tips, bargaining phrases, safety alerts & hidden gem recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 min-h-[480px] max-h-[600px] flex flex-col justify-between space-y-4">
        {/* Messages List */}
        <div className="space-y-4 overflow-y-auto pr-1">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 text-xs ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                  msg.sender === 'user' ? 'bg-sky-600' : 'bg-indigo-600'
                }`}
              >
                {msg.sender === 'user' ? 'You' : 'AI'}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs whitespace-pre-line'
                }`}
              >
                {msg.text}
                <span
                  className={`block text-[9px] mt-1.5 font-medium ${
                    msg.sender === 'user' ? 'text-sky-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isAiGenerating && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl w-fit border border-slate-200 animate-pulse">
              <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
              <span>Rahi AI is analyzing travel databases...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Carousel */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Quick Inquiries
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-[11px]">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 border border-slate-200/80 text-slate-700 whitespace-nowrap transition cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          className="flex gap-2 pt-1"
        >
          <input
            id="ai-chat-input"
            type="text"
            placeholder="Ask anything about destinations, scams, local transport, bargaining..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isAiGenerating}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 text-slate-900"
          />
          <button
            type="submit"
            disabled={isAiGenerating || !(inputMessage || '').trim()}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-2xl font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-sky-500/20"
          >
            <span>Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};

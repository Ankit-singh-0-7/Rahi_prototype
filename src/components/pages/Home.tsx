import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { DestinationCard } from '../cards/DestinationCard';
import { HotelCard } from '../cards/HotelCard';
import { RestaurantCard } from '../cards/RestaurantCard';
import { OfferCard, EventCard } from '../cards/AttractionCard';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Flame,
  ArrowRight,
  Search,
  IndianRupee,
  Hotel,
  Utensils,
  ChevronRight,
  Award,
  Users,
  HeartHandshake,
  CheckCircle2,
  CloudSun,
} from 'lucide-react';

export const Home: React.FC = () => {
  const {
    destinations,
    hotels,
    restaurants,
    offers,
    events,
    setActiveTab,
    setSelectedDestination,
    setIsSOSOpen,
    setIsReportIssueOpen,
    setIsTranslatorOpen,
    updateTripPlan,
    showToast,
  } = useTravel();

  // Quick Trip Finder State
  const [quickDest, setQuickDest] = useState('');
  const [quickDuration, setQuickDuration] = useState('3 Days');
  const [quickBudget, setQuickBudget] = useState('Affordable (₹2,500/day)');
  const [quickStyle, setQuickStyle] = useState('Culture & Nature');

  const handleQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const destName = quickDest || 'Goa';
    updateTripPlan({
      destination: destName,
      durationDays: parseInt(quickDuration) || 3,
      travelStyle: quickStyle,
    });
    setActiveTab('plan-trip');
    showToast(`Smart itinerary generator initiated for ${destName}!`);
  };

  const trendingDestinations = destinations.slice(0, 4);
  const hiddenGems = destinations.filter((d) => d.isHiddenGem).slice(0, 4);
  const featuredHotels = hotels.slice(0, 3);
  const featuredEateries = restaurants.slice(0, 3);

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl bg-slate-900 min-h-[560px] sm:min-h-[620px] flex items-center justify-center p-6 sm:p-12 lg:p-16 border border-slate-800">
          {/* Background Photography with sophisticated overlay */}
          <img
            src="https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=2000&q=80"
            alt="Majestic India Heritage"
            className="absolute inset-0 w-full h-full object-cover opacity-35 filter saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-sky-500/20 border border-sky-400/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-200 shadow-lg animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Next-Gen Unified Tourism & Safety Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none font-display">
              Discover Unseen India. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                Plan Smarter. Travel Safer.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect directly with verified local homestays, explore untrodden hidden gems, optimize customized travel budgets, and stay protected with our 24x7 tourist safety network.
            </p>

            {/* QUICK TRIP FINDER CARD */}
            <div className="mt-8 bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/40 text-left">
              <form onSubmit={handleQuickPlan} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-sky-600 absolute left-3 top-3" />
                    <input
                      id="hero-dest-input"
                      type="text"
                      placeholder="e.g. Goa, Jaipur, Manali..."
                      value={quickDest}
                      onChange={(e) => setQuickDest(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Duration
                  </label>
                  <select
                    id="hero-duration-select"
                    value={quickDuration}
                    onChange={(e) => setQuickDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  >
                    <option value="2 Days">Weekend (2 Days)</option>
                    <option value="3 Days">Short Getaway (3 Days)</option>
                    <option value="5 Days">Explorer (5 Days)</option>
                    <option value="7 Days">Grand Tour (7 Days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Budget Preference
                  </label>
                  <select
                    id="hero-budget-select"
                    value={quickBudget}
                    onChange={(e) => setQuickBudget(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  >
                    <option value="Backpacker (₹1,200/day)">Backpacker (₹1,200/day)</option>
                    <option value="Affordable (₹2,500/day)">Affordable (₹2,500/day)</option>
                    <option value="Comfort (₹5,000/day)">Comfort (₹5,000/day)</option>
                    <option value="Luxury (₹10,000+/day)">Heritage Luxury (₹10,000+/day)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Travel Vibe
                  </label>
                  <select
                    id="hero-vibe-select"
                    value={quickStyle}
                    onChange={(e) => setQuickStyle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  >
                    <option value="Culture & Nature">Culture & Nature</option>
                    <option value="Beaches & Relax">Beaches & Chill</option>
                    <option value="Trekking & Adventure">Trekking & Adventure</option>
                    <option value="Spiritual & Wellness">Spiritual & Wellness</option>
                    <option value="Food & Street Trails">Food & Street Trails</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    id="hero-find-trip-btn"
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black text-xs shadow-lg shadow-sky-600/30 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-sky-200" />
                    <span>Plan My Trip</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
              <button
                onClick={() => setIsSOSOpen(true)}
                className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 px-3 py-1 rounded-full flex items-center space-x-1.5 font-bold transition cursor-pointer backdrop-blur-xs"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>24x7 Emergency SOS</span>
              </button>

              <button
                onClick={() => setActiveTab('hidden-gems')}
                className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 px-3 py-1 rounded-full flex items-center space-x-1.5 font-bold transition cursor-pointer backdrop-blur-xs"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>100+ Hidden Gems</span>
              </button>

              <button
                onClick={() => setIsTranslatorOpen(true)}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-full flex items-center space-x-1.5 font-bold transition cursor-pointer backdrop-blur-xs"
              >
                <span>Travel Translator</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM VALUE PROPOSITION (3-PILLAR BANNER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-sky-50 to-white p-6 rounded-3xl border border-sky-100 shadow-xs flex flex-col justify-between space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Direct Local Empowerment</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Connect directly with family-run homestays, local taxi cooperatives, and certified regional guides with 0% middleman commission.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('hotels')}
              className="text-xs font-bold text-sky-600 flex items-center space-x-1 hover:text-sky-700 cursor-pointer"
            >
              <span>Explore Homestays</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-3xl border border-emerald-100 shadow-xs flex flex-col justify-between space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Affordable Off-Peak Insights</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Unlock secret shoulder-season dates to save up to 45% on accommodation and explore crowd-free scenic sanctuaries.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('offers')}
              className="text-xs font-bold text-emerald-700 flex items-center space-x-1 hover:text-emerald-800 cursor-pointer"
            >
              <span>View Seasonal Offers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-3xl border border-rose-100 shadow-xs flex flex-col justify-between space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Community Safety & Civic Voice</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Emergency broadcast network, instant GPS distress sharing, and crowdsourced municipal issue resolution dossiers.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('safety')}
              className="text-xs font-bold text-rose-600 flex items-center space-x-1 hover:text-rose-700 cursor-pointer"
            >
              <span>Civic Priority Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. TRENDING DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Top Travel Picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-display">
              Trending Destinations in India
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curated itineraries, authentic stays, and verified tourist reviews.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center space-x-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Destinations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* 4. HIDDEN GEMS SPOTLIGHT */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30 mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Untouched & Offbeat Escapes</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
                Discover Secret Hidden Gems
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Lesser-known villages, tranquil valleys, and cultural sanctuaries away from heavy tourist crowds.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('hidden-gems')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer self-start sm:self-auto shadow-lg"
            >
              <span>Explore All Hidden Gems</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hiddenGems.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOMESTAYS & LOCAL STAYS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
              <Hotel className="w-4 h-4" />
              <span>Direct Stays</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-display">
              Eco-Resorts & Local Homestays
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Book directly with local families and heritage hosts. Zero platform markups.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('hotels')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center space-x-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Browse All Stays</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>

      {/* 6. LOCAL FOOD TRAILS & STREET EATERIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <Utensils className="w-4 h-4" />
              <span>Gastronomic Trails</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 font-display">
              Iconic Eateries & Street Food
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Taste regional spices, generational thalis, and secret roadside cafes.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('food')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center space-x-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View Food Map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEateries.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 7. FESTIVALS & CULTURAL EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Upcoming Fairs & Cultural Festivals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Time your visit with ancient music celebrations, camel fairs, and river rituals.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('events')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition hidden sm:flex items-center space-x-1 cursor-pointer"
          >
            <span>All Festivals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* 8. PROMO OFFERS & DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Exclusive Host Discounts
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
              Save up to 40% with Verified Homestay Partners
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100">
              Claim instant seasonal vouchers, free heritage breakfasts, and guided trekking passes direct from hosts.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('offers')}
            className="px-6 py-3 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs shadow-lg hover:bg-emerald-50 transition cursor-pointer shrink-0"
          >
            Browse All Active Coupons
          </button>
        </div>
      </section>

      {/* 9. TOURIST SAFETY & CIVIC ACTION CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Active Tourist Welfare & Civic Safety Infrastructure</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
              Have you noticed broken streetlights, hazardous roads, or tourist scams?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Submit a quick photo report. Our algorithmic prioritization system aggregates similar complaints and directly dispatches formal action dossiers to the district tourism commissioner.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                id="home-report-issue-btn"
                onClick={() => setIsReportIssueOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Report a Tourist Problem
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
              >
                View Civic Action Board
              </button>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Emergency Helpline:</span>
              <span className="font-mono font-bold text-rose-400 text-sm">112 / 1363</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-slate-400">Escalated Civic Reports:</span>
              <span className="font-bold text-emerald-400">14 Wards Resolved</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Live Tourist Safety Score:</span>
              <span className="font-bold text-sky-400">98.2% Safe Zones</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

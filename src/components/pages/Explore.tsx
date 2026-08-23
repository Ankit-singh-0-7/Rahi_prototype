import React, { useState, useMemo } from 'react';
import { useTravel } from '../../context/TravelContext';
import { DestinationCard } from '../cards/DestinationCard';
import {
  Compass,
  Search,
  SlidersHorizontal,
  MapPin,
  Flame,
  ArrowUpDown,
  Sparkles,
  DollarSign,
  Calendar,
} from 'lucide-react';

export const Explore: React.FC = () => {
  const { destinations, searchQuery, setSearchQuery } = useTravel();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(6000);
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'budget_asc' | 'budget_desc' | 'savings'>('rating');

  const categories = [
    'All',
    'Beaches & Coastal',
    'Mountains & Treks',
    'Heritage & Forts',
    'Spiritual & Ghats',
    'Backwaters & Nature',
    'Waterfalls & Caves',
  ];

  const states = ['All', 'Goa', 'Rajasthan', 'Himachal Pradesh', 'Uttar Pradesh', 'Kerala', 'West Bengal', 'Meghalaya', 'Uttarakhand'];

  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        // Search query
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const matchName = dest.name.toLowerCase().includes(q);
          const matchState = dest.state.toLowerCase().includes(q);
          const matchTags = dest.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchState && !matchTags) return false;
        }

        // Category filter
        if (selectedCategory !== 'All') {
          if (selectedCategory === 'Beaches & Coastal' && !dest.tags.includes('beaches') && !dest.tags.includes('nightlife')) return false;
          if (selectedCategory === 'Mountains & Treks' && !dest.tags.includes('snow') && !dest.tags.includes('mountains') && !dest.tags.includes('tea-gardens')) return false;
          if (selectedCategory === 'Heritage & Forts' && !dest.tags.includes('palaces') && !dest.tags.includes('heritage') && !dest.tags.includes('lakes')) return false;
          if (selectedCategory === 'Spiritual & Ghats' && !dest.tags.includes('spiritual') && !dest.tags.includes('yoga')) return false;
          if (selectedCategory === 'Backwaters & Nature' && !dest.tags.includes('backwaters') && !dest.tags.includes('houseboats') && !dest.tags.includes('caves')) return false;
          if (selectedCategory === 'Waterfalls & Caves' && !dest.tags.includes('waterfalls') && !dest.tags.includes('cleanest-village')) return false;
        }

        // State filter
        if (selectedState !== 'All' && dest.state !== selectedState) return false;

        // Budget filter
        if (dest.budgetEstimate > maxBudget) return false;

        // Season filter
        if (selectedSeason !== 'All') {
          if (selectedSeason === 'Monsoon' && !dest.bestSeason.toLowerCase().includes('jul') && !dest.bestSeason.toLowerCase().includes('aug') && !dest.bestSeason.toLowerCase().includes('monsoon')) return false;
          if (selectedSeason === 'Winter' && !dest.bestSeason.toLowerCase().includes('nov') && !dest.bestSeason.toLowerCase().includes('dec') && !dest.bestSeason.toLowerCase().includes('jan') && !dest.bestSeason.toLowerCase().includes('feb')) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'budget_asc') return a.budgetEstimate - b.budgetEstimate;
        if (sortBy === 'budget_desc') return b.budgetEstimate - a.budgetEstimate;
        if (sortBy === 'savings') return b.seasonSavingsPercent - a.seasonSavingsPercent;
        return 0;
      });
  }, [destinations, searchQuery, selectedCategory, selectedState, maxBudget, selectedSeason, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Destination Explorer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
            Explore All Travel Destinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified travel gems, scenic regions, weather advisories, and estimated daily budgets.
          </p>
        </div>

        {/* Search bar inside Explore */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="explore-search-input"
            type="text"
            placeholder="Search by city, state, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100 text-xs">
          {/* State Filter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">State / Territory</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Max Budget / Day</label>
              <span className="font-black text-emerald-700">₹{maxBudget}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={6000}
              step={200}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Season Filter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Travel Season</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs"
            >
              <option value="All">All Seasons</option>
              <option value="Winter">Winter (Nov - Feb)</option>
              <option value="Monsoon">Monsoon / Lush Green (Jul - Sep)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Sort Destinations</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs"
            >
              <option value="rating">Top Rated First ★</option>
              <option value="budget_asc">Budget: Low to High (₹)</option>
              <option value="budget_desc">Budget: High to Low (₹)</option>
              <option value="savings">Biggest Off-Peak Savings (%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{filteredDestinations.length}</strong> matching destination{filteredDestinations.length === 1 ? '' : 's'}
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-sky-600 hover:underline font-semibold cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Destination Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Compass className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No destinations match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your budget slider, resetting the category pills, or searching for another keyword.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedState('All');
              setMaxBudget(6000);
              setSelectedSeason('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
};

export const HiddenGems: React.FC = () => {
  const { destinations, setSelectedDestination } = useTravel();

  const hiddenGemsList = destinations.filter((d) => d.isHiddenGem);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-200" />
            <span>Off-The-Beaten-Track Sanctuaries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
            India's Most Enchanting Hidden Gems
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Escape the tourist congestion. Experience sacred root bridges, ancient Stepwell corridors, tranquil pine forests, and authentic tribal village traditions.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 w-full sm:w-auto">
          <span className="text-3xl font-black">{hiddenGemsList.length}</span>
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-100">Verified Secret Spots</p>
        </div>
      </div>

      {/* Sustainable Tourism Guidelines */}
      <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 font-bold">🌿</span>
          <div>
            <h4 className="font-bold text-slate-900">Responsible & Low-Impact Travel Pledge</h4>
            <p className="text-slate-600 text-[11px]">
              Carry your waste back, respect tribal village protocols, and buy local handicrafts directly from artisans.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden Gems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hiddenGemsList.map((dest) => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useTravel } from '../../context/TravelContext';
import { Search, MapPin, Hotel, Utensils, Sparkles, Tag, Users, Flame, X, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    destinations,
    hotels,
    restaurants,
    attractions,
    offers,
    events,
    communityPosts,
    setSelectedDestination,
    setSelectedHotel,
    setSelectedRestaurant,
    setActiveTab,
  } = useTravel();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'destinations' | 'hotels' | 'food' | 'attractions' | 'hidden_gems'>('all');

  if (!isSearchOpen) return null;

  const results = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      return {
        destinations: destinations.slice(0, 4),
        hotels: hotels.slice(0, 3),
        restaurants: restaurants.slice(0, 3),
        attractions: attractions.slice(0, 3),
      };
    }

    return {
      destinations: destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      ),
      hotels: hotels.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.destinationName.toLowerCase().includes(q) ||
          h.type.toLowerCase().includes(q)
      ),
      restaurants: restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.signatureDishes.some((s) => s.toLowerCase().includes(q))
      ),
      attractions: attractions.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.destinationName.toLowerCase().includes(q)
      ),
    };
  }, [query, destinations, hotels, restaurants, attractions]);

  const totalCount =
    results.destinations.length +
    results.hotels.length +
    results.restaurants.length +
    results.attractions.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-20 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search input bar */}
        <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-sky-600 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            autoFocus
            placeholder="Search destinations (Goa, Jaipur...), stays, cafes, hidden gems..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none text-slate-800 font-medium placeholder-slate-400"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter tags */}
        <div className="flex items-center space-x-2 px-4 py-2 bg-white border-b border-slate-100 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'destinations', label: `Destinations (${results.destinations.length})` },
            { id: 'hotels', label: `Hotels (${results.hotels.length})` },
            { id: 'food', label: `Food & Dining (${results.restaurants.length})` },
            { id: 'attractions', label: `Attractions (${results.attractions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
          {totalCount === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}". Try "Goa", "Heritage", "Thali", or "Resort".</p>
            </div>
          ) : (
            <>
              {/* Destinations */}
              {(activeFilter === 'all' || activeFilter === 'destinations') &&
                results.destinations.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" />
                      <span>Destinations</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {results.destinations.map((dest) => (
                        <div
                          key={dest.id}
                          onClick={() => {
                            setSelectedDestination(dest);
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/50 transition cursor-pointer"
                        >
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 truncate">
                            <div className="flex items-center space-x-1">
                              <span className="font-bold text-slate-900 truncate">{dest.name}</span>
                              {dest.isHiddenGem && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded">
                                  Hidden Gem
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-[11px] truncate">{dest.state}</p>
                            <p className="text-emerald-600 font-semibold text-[10px]">
                              Est. ₹{dest.budgetEstimate}/day
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Hotels */}
              {(activeFilter === 'all' || activeFilter === 'hotels') &&
                results.hotels.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                      <Hotel className="w-3.5 h-3.5 text-sky-600" />
                      <span>Hotels & Stays</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {results.hotels.map((hotel) => (
                        <div
                          key={hotel.id}
                          onClick={() => {
                            setSelectedHotel(hotel);
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/50 transition cursor-pointer"
                        >
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 truncate">
                            <span className="font-bold text-slate-900 truncate block">{hotel.name}</span>
                            <p className="text-slate-500 text-[11px] truncate">{hotel.destinationName}</p>
                            <span className="font-bold text-sky-700 text-[11px]">
                              ₹{hotel.pricePerNight} <span className="font-normal text-slate-400">/ night</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Food & Dining */}
              {(activeFilter === 'all' || activeFilter === 'food') &&
                results.restaurants.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                      <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Food & Local Eateries</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {results.restaurants.map((rest) => (
                        <div
                          key={rest.id}
                          onClick={() => {
                            setSelectedRestaurant(rest);
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition cursor-pointer"
                        >
                          <img
                            src={rest.image}
                            alt={rest.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 truncate">
                            <span className="font-bold text-slate-900 truncate block">{rest.name}</span>
                            <p className="text-slate-500 text-[11px] truncate">{rest.cuisine}</p>
                            <span className="font-semibold text-emerald-700 text-[10px]">
                              Avg ₹{rest.avgCostForTwo} for two
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Attractions */}
              {(activeFilter === 'all' || activeFilter === 'attractions') &&
                results.attractions.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Attractions & Experiences</span>
                    </h4>
                    <div className="space-y-2">
                      {results.attractions.map((attr) => (
                        <div
                          key={attr.id}
                          onClick={() => {
                            setActiveTab('attractions');
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/40 transition cursor-pointer"
                        >
                          <div className="flex items-center space-x-3 truncate">
                            <img
                              src={attr.image}
                              alt={attr.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="truncate">
                              <span className="font-bold text-slate-900 truncate block">{attr.name}</span>
                              <p className="text-slate-500 text-[11px] truncate">{attr.destinationName}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 shrink-0 ml-2">
                            {attr.cost === 0 ? 'Free' : `₹${attr.cost}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

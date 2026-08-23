import React, { useState, useMemo } from 'react';
import { useTravel } from '../../context/TravelContext';
import { HotelCard } from '../cards/HotelCard';
import { RestaurantCard } from '../cards/RestaurantCard';
import {
  Hotel,
  Search,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  Home,
  ShieldCheck,
  Building,
  TreePine,
  Utensils,
  Coffee,
  Heart,
} from 'lucide-react';

export const HotelsStays: React.FC = () => {
  const { hotels } = useTravel();

  const [filterType, setFilterType] = useState<string>('All');
  const [selectedDest, setSelectedDest] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [search, setSearch] = useState<string>('');

  const types = ['All', 'Eco Resort', 'Heritage Haveli', 'Homestay', 'Boutique Hotel', 'Hostel'];
  const destinationsList = ['All', 'Goa', 'Jaipur', 'Manali', 'Varanasi', 'Kerala', 'Darjeeling', 'Shillong'];

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !hotel.name.toLowerCase().includes(q) &&
          !hotel.destinationName.toLowerCase().includes(q) &&
          !hotel.address.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filterType !== 'All' && hotel.type !== filterType) return false;
      if (selectedDest !== 'All' && !hotel.destinationName.toLowerCase().includes(selectedDest.toLowerCase())) return false;
      if (hotel.pricePerNight > maxPrice) return false;
      return true;
    });
  }, [hotels, filterType, selectedDest, maxPrice, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Hotel className="w-4 h-4" />
            <span>Direct Accommodations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
            Hotels, Homestays & Eco-Resorts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified local hosts with transparent direct rates and zero surge fees.
          </p>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search stays by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
        {/* Type pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                filterType === t
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Destination Region</label>
            <select
              value={selectedDest}
              onChange={(e) => setSelectedDest(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              {destinationsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Max Tariff / Night</label>
              <span className="font-black text-sky-700">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={800}
              max={8000}
              step={200}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export const FoodCulture: React.FC = () => {
  const { restaurants, setIsTranslatorOpen } = useTravel();

  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const cuisines = ['All', 'Goan & Coastal Seafood', 'Rajasthani Heritage Thali', 'Himachali & Tibetan', 'Banarasi Street Food & Sweets', 'Kerala Malabar Sadya', 'Khasi & North-East Local'];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !r.name.toLowerCase().includes(q) &&
          !r.location.toLowerCase().includes(q) &&
          !r.signatureDishes.some((d) => d.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      if (selectedCuisine !== 'All' && !r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())) return false;
      if (isVegOnly && !r.dietary.some((d) => d.toLowerCase().includes('pure veg') || d.toLowerCase().includes('vegetarian'))) return false;
      return true;
    });
  }, [restaurants, selectedCuisine, isVegOnly, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Utensils className="w-4 h-4" />
            <span>Gastronomy & Cultural Eateries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
            Local Food & Street Food Trails
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centuries-old recipes, generational sweetshops, and iconic coastal shacks.
          </p>
        </div>

        <button
          onClick={() => setIsTranslatorOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 transition flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <span>Translate Food Menus</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCuisine === c
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="veg-only-checkbox"
              checked={isVegOnly}
              onChange={(e) => setIsVegOnly(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
            <label htmlFor="veg-only-checkbox" className="font-bold text-slate-800 cursor-pointer">
              Pure Vegetarian / Vegan Friendly Places Only
            </label>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search dish (e.g. Thali, Chaat, Fish Curry)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

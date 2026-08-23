import React, { useState, useMemo } from 'react';
import { useTravel } from '../../context/TravelContext';
import { AttractionCard, OfferCard, EventCard } from '../cards/AttractionCard';
import {
  Sparkles,
  Tag,
  Calendar,
  Search,
  MapPin,
  Clock,
  Flame,
  CheckCircle,
  Building,
  TreePine,
  DollarSign,
} from 'lucide-react';

export const AttractionsPage: React.FC = () => {
  const { attractions } = useTravel();

  const [category, setCategory] = useState<string>('All');
  const [selectedDest, setSelectedDest] = useState<string>('All');

  const categories = ['All', 'heritage', 'nature', 'spiritual', 'adventure', 'hidden_gem'];
  const destinationsList = ['All', 'Goa', 'Jaipur', 'Manali', 'Varanasi', 'Kerala', 'Darjeeling', 'Shillong'];

  const filteredAttractions = useMemo(() => {
    return attractions.filter((a) => {
      if (category !== 'All' && a.category !== category) return false;
      if (selectedDest !== 'All' && !a.destinationName.toLowerCase().includes(selectedDest.toLowerCase())) return false;
      return true;
    });
  }, [attractions, category, selectedDest]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Monuments, Trails & Sacred Sites</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
            Attractions & Experiences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Opening timings, entry fees, ideal times of day, and weather readiness for top sites.
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap capitalize transition cursor-pointer ${
                category === c
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-60">
          <select
            value={selectedDest}
            onChange={(e) => setSelectedDest(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
          >
            {destinationsList.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Destinations' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttractions.map((attraction) => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </div>
    </div>
  );
};

export const OffersPage: React.FC = () => {
  const { offers } = useTravel();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Tag className="w-4 h-4 text-emerald-200" />
            <span>Seasonal Travel Discounts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
            Exclusive Deals & Host Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            Copy verified promo codes for direct discounts on heritage homestays, trekking gear rentals, and authentic thalis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
};

export const EventsPage: React.FC = () => {
  const { events } = useTravel();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Cultural Calendar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
            Festivals, Melas & Cultural Fairs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Time your journeys with India's most vibrant traditional celebrations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

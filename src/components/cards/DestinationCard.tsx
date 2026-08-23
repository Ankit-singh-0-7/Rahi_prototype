import React from 'react';
import { Destination } from '../../types';
import { useTravel } from '../../context/TravelContext';
import { Star, MapPin, Calendar, IndianRupee, Flame, Bookmark, ArrowRight, CloudSun } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const { setSelectedDestination, toggleSaveDestination, userProfile } = useTravel();

  const isSaved = userProfile.savedDestinationIds.includes(destination.id);

  return (
    <div
      id={`dest-card-${destination.id}`}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      {/* Image Container */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {destination.isHiddenGem ? (
              <span className="bg-amber-500 text-white font-extrabold px-2.5 py-0.5 rounded-full text-[11px] flex items-center space-x-1 shadow-md">
                <Flame className="w-3 h-3" />
                <span>Hidden Gem</span>
              </span>
            ) : (
              <span className="bg-sky-600/90 backdrop-blur-xs text-white font-bold px-2.5 py-0.5 rounded-full text-[11px] shadow-md">
                {destination.state}
              </span>
            )}
            {destination.weather && (
              <span className="bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <CloudSun className="w-3 h-3 text-amber-300" />
                <span>{destination.weather.temp}°C</span>
              </span>
            )}
          </div>

          <button
            id={`bookmark-dest-${destination.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveDestination(destination.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition cursor-pointer shadow-md ${
              isSaved
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save destination'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Destination Name & Rating on Banner */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight font-display drop-shadow-xs">
              {destination.name}
            </h3>
            <div className="flex items-center space-x-1 text-xs font-bold bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{destination.rating}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-200 line-clamp-1 mt-0.5 font-medium">
            {destination.tagline}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {destination.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-medium"
            >
              #{tag}
            </span>
          ))}
          {destination.tags.length > 3 && (
            <span className="text-slate-400 text-[10px] self-center">
              +{destination.tags.length - 3}
            </span>
          )}
        </div>

        {/* Pricing & Best Season Grid */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Avg Budget</span>
            <span className="font-extrabold text-slate-900">
              ₹{destination.budgetEstimate}
              <span className="font-normal text-slate-500 text-[10px]">/day</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Best Time</span>
            <span className="font-bold text-emerald-700 truncate block">
              {destination.bestSeason}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex items-center space-x-2">
          <button
            id={`explore-btn-${destination.id}`}
            onClick={() => setSelectedDestination(destination)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer group/btn"
          >
            <span>Explore Destination</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};

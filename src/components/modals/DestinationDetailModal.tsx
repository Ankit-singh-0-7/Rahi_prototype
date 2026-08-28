import React from 'react';
import { useTravel } from '../../context/TravelContext';
import {
  MapPin,
  Calendar,
  IndianRupee,
  Star,
  CloudSun,
  Flame,
  Bookmark,
  Share2,
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export const DestinationDetailModal: React.FC = () => {
  const {
    selectedDestination,
    setSelectedDestination,
    toggleSaveDestination,
    toggleBucketList,
    userProfile,
    setActiveTab,
    updateTripPlan,
    showToast,
  } = useTravel();

  if (!selectedDestination) return null;

  const isSaved = userProfile.savedDestinationIds.includes(selectedDestination.id);
  const inBucketList = userProfile.bucketListIds.includes(selectedDestination.id);

  const handleStartTripWithDestination = () => {
    updateTripPlan({
      destination: selectedDestination.name,
      totalBudget: selectedDestination.budgetEstimate * 2 * 4,
    });
    setSelectedDestination(null);
    setActiveTab('plan-trip');
    showToast(`Trip configured for ${selectedDestination.name}! Customize your itinerary below.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Top Image Hero Banner */}
        <div className="relative h-64 sm:h-80 w-full">
          <img
            src={selectedDestination.image}
            alt={selectedDestination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedDestination(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition cursor-pointer backdrop-blur-xs"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            {selectedDestination.isHiddenGem && (
              <span className="bg-amber-500 text-white font-black px-2.5 py-1 rounded-full text-xs flex items-center space-x-1 shadow-md">
                <Flame className="w-3.5 h-3.5" />
                <span>Hidden Gem</span>
              </span>
            )}
            <span className="bg-sky-600/90 backdrop-blur-xs text-white font-bold px-2.5 py-1 rounded-full text-xs">
              {selectedDestination.state}
            </span>
          </div>

          {/* Title on Hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center space-x-2 text-xs text-sky-300 font-semibold mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{selectedDestination.rating}</span>
              <span>•</span>
              <span>{selectedDestination.reviewsCount} verified reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
              {selectedDestination.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-1 mt-0.5">
              {selectedDestination.tagline}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs max-h-[55vh] overflow-y-auto">
          {/* Key Metrics Quick Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
                Approx. Budget
              </span>
              <span className="text-sm font-black text-sky-900 mt-0.5 block">
                ₹{selectedDestination.budgetEstimate}
                <span className="text-[10px] font-normal text-slate-500"> / day</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
                Best Season
              </span>
              <span className="text-sm font-black text-emerald-900 mt-0.5 block truncate">
                {selectedDestination.bestSeason}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
                Live Weather
              </span>
              <span className="text-sm font-black text-amber-900 mt-0.5 block flex items-center space-x-1">
                <CloudSun className="w-4 h-4 text-amber-600" />
                <span>{selectedDestination.weather.temp}°C ({selectedDestination.weather.condition})</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
                Season Savings
              </span>
              <span className="text-sm font-black text-purple-900 mt-0.5 block">
                Save ~{selectedDestination.seasonSavingsPercent}% Off-Peak
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-1.5 uppercase tracking-wide">
              About this destination
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              {selectedDestination.description}
            </p>
          </div>

          {/* Live Weather Advisory */}
          {selectedDestination.weather.advisory && (
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 flex items-start space-x-2.5">
              <CloudSun className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sky-950 text-xs">Destination Weather Advisory</p>
                <p className="text-sky-800 text-[11px] mt-0.5">
                  {selectedDestination.weather.advisory} (Rain Probability: {selectedDestination.weather.rainProbability}%, Air Quality: {selectedDestination.weather.airQuality})
                </p>
              </div>
            </div>
          )}

          {/* Off-Season Smart Fee Savings Breakdown */}
          {selectedDestination.offSeasonDetails ? (
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-black text-emerald-950 text-xs sm:text-sm">
                        Off-Season Less Fee & Bargain Guide
                      </h4>
                      <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Save {selectedDestination.seasonSavingsPercent}%
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      {selectedDestination.offSeasonDetails.offSeasonPeriod}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-emerald-100 self-start sm:self-auto">
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block line-through">
                      Peak: ₹{selectedDestination.offSeasonDetails.peakDailyFee}/day
                    </span>
                    <span className="text-xs font-black text-emerald-700 block">
                      Off-Season: ₹{selectedDestination.offSeasonDetails.offSeasonDailyFee}/day
                    </span>
                  </div>
                </div>
              </div>

              {/* Discount Rates Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-bold block">Resorts & Stays</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-700">
                    -{selectedDestination.offSeasonDetails.stayDiscountPercent}% Fee
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-bold block">Cabs & Rentals</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-700">
                    -{selectedDestination.offSeasonDetails.cabsDiscountPercent}% Fee
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-bold block">Activities / Entry</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-700">
                    -{selectedDestination.offSeasonDetails.activitiesDiscountPercent}% Fee
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 font-bold block">Tourist Crowds</span>
                  <span className="text-xs sm:text-sm font-black text-sky-700">
                    -{selectedDestination.offSeasonDetails.crowdReductionPercent}% Less Rush
                  </span>
                </div>
              </div>

              {/* Reason & Perks */}
              <div className="space-y-2 text-xs">
                <p className="text-slate-700 leading-relaxed font-medium bg-white/60 p-2.5 rounded-xl border border-emerald-100">
                  💡 <strong>Why tariffs drop:</strong> {selectedDestination.offSeasonDetails.savingsReason}
                </p>

                <div>
                  <span className="font-bold text-emerald-900 block text-[11px] mb-1">
                    Off-Season Exclusive Perks:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {selectedDestination.offSeasonDetails.offSeasonPerks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-start space-x-1.5 text-slate-700 text-[11px]">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-950 text-xs">Off-Peak Season Travel Bargain</p>
                <p className="text-emerald-800 text-[11px]">
                  Traveling in off-season months ({selectedDestination.offSeasonMonths?.join(', ') || 'shoulder months'}) reduces hotel and travel fees by approximately <strong>{selectedDestination.seasonSavingsPercent}%</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Top Attractions Highlights */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wide">
              Top Attractions & Highlights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedDestination.topAttractions.map((attr, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800 text-xs">{attr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedDestination.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-lg text-[11px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleSaveDestination(selectedDestination.id)}
              className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'Saved in Wishlist' : 'Save Destination'}</span>
            </button>

            <button
              onClick={() => toggleBucketList(selectedDestination.id)}
              className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer ${
                inBucketList
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>{inBucketList ? 'In Bucket List' : 'Add to Bucket List'}</span>
            </button>
          </div>

          <button
            id="modal-plan-trip-btn"
            onClick={handleStartTripWithDestination}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-sky-500/20 transition cursor-pointer"
          >
            <span>Plan My Trip to {selectedDestination.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

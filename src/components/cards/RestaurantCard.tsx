import React from 'react';
import { Restaurant } from '../../types';
import { useTravel } from '../../context/TravelContext';
import { Star, MapPin, Utensils, MessageSquare, Phone, Check } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { setSelectedRestaurant, setIsEnquiryModalOpen, setEnquiryTarget } = useTravel();

  const handleBookTable = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEnquiryTarget({
      name: restaurant.name,
      type: 'restaurant',
      phone: restaurant.contact.phone,
    });
    setIsEnquiryModalOpen(true);
  };

  return (
    <div
      id={`rest-card-${restaurant.id}`}
      onClick={() => setSelectedRestaurant(restaurant)}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-emerald-600/90 backdrop-blur-xs text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]">
            {restaurant.cuisine}
          </span>
          {restaurant.isStreetFood && (
            <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
              Street Food
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs font-bold bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{restaurant.rating}</span>
            <span className="text-slate-300 font-normal">({restaurant.reviewsCount})</span>
          </div>
          <span className="text-xs text-emerald-300 font-semibold">{restaurant.priceRange}</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition">
            {restaurant.name}
          </h3>
          <p className="text-slate-500 text-[11px] flex items-center space-x-1 mt-1 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{restaurant.location} ({restaurant.distanceKm} km)</span>
          </p>
        </div>

        {/* Must Try Dish */}
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-[11px]">
          <span className="text-slate-400 font-bold uppercase text-[9px] block">Must-Try Specialty</span>
          <p className="font-semibold text-slate-800 line-clamp-1 mt-0.5">
            {restaurant.signatureDishes[0]}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Avg Cost</span>
            <span className="font-bold text-slate-900 text-xs">₹{restaurant.avgCostForTwo} for 2</span>
          </div>

          <button
            onClick={handleBookTable}
            className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Enquire / Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};

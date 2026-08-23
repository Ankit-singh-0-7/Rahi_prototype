import React from 'react';
import { Hotel } from '../../types';
import { useTravel } from '../../context/TravelContext';
import { Star, MapPin, CheckCircle, MessageSquare, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const { setSelectedHotel, setIsEnquiryModalOpen, setEnquiryTarget } = useTravel();

  const handleEnquire = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEnquiryTarget({
      name: hotel.name,
      type: 'hotel',
      phone: hotel.contact.phone,
    });
    setIsEnquiryModalOpen(true);
  };

  return (
    <div
      id={`hotel-card-${hotel.id}`}
      onClick={() => setSelectedHotel(hotel)}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-sky-600/90 backdrop-blur-xs text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]">
            {hotel.type}
          </span>
          {hotel.isHiddenStay && (
            <span className="bg-amber-500 text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]">
              Hidden Stay
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs font-bold bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{hotel.rating}</span>
            <span className="text-slate-300 font-normal">({hotel.reviewsCount})</span>
          </div>
          <span className="text-xs text-slate-200 font-medium">{hotel.destinationName}</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition">
            {hotel.name}
          </h3>
          <p className="text-slate-500 text-[11px] flex items-center space-x-1 mt-1 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{hotel.address}</span>
          </p>
        </div>

        {/* Facilities snippet */}
        <div className="flex flex-wrap gap-1">
          {hotel.facilities.slice(0, 3).map((f, i) => (
            <span key={i} className="bg-slate-50 text-slate-600 border border-slate-100 text-[10px] px-2 py-0.5 rounded-md">
              {f}
            </span>
          ))}
          {hotel.facilities.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{hotel.facilities.length - 3} more
            </span>
          )}
        </div>

        {/* Price and CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">From</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-base font-black text-slate-900">₹{hotel.pricePerNight}</span>
              <span className="text-[10px] text-slate-500">/ night</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleEnquire}
              className="py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition shadow-xs flex items-center space-x-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Enquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

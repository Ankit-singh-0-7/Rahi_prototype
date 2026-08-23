import React from 'react';
import { useTravel } from '../../context/TravelContext';
import {
  Hotel,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Wifi,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Calendar,
  X,
  MessageSquare,
  Building,
} from 'lucide-react';

export const HotelDetailModal: React.FC = () => {
  const { selectedHotel, setSelectedHotel, setIsEnquiryModalOpen, setEnquiryTarget, updateTripPlan, showToast } = useTravel();

  if (!selectedHotel) return null;

  const handleBookOrEnquire = () => {
    setEnquiryTarget({
      name: selectedHotel.name,
      type: 'hotel',
      phone: selectedHotel.contact.phone,
    });
    setIsEnquiryModalOpen(true);
  };

  const handleAddToTripAsStay = () => {
    updateTripPlan({
      selectedHotel: selectedHotel,
    });
    setSelectedHotel(null);
    showToast(`"${selectedHotel.name}" set as your preferred stay in the Trip Planner!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Image header */}
        <div className="relative h-60 w-full">
          <img
            src={selectedHotel.image}
            alt={selectedHotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            onClick={() => setSelectedHotel(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 left-4 flex gap-1.5">
            <span className="bg-sky-600 text-white font-bold px-2.5 py-1 rounded-full text-xs">
              {selectedHotel.type}
            </span>
            {selectedHotel.isHiddenStay && (
              <span className="bg-amber-500 text-white font-bold px-2.5 py-1 rounded-full text-xs">
                Hidden Stay
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-bold mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{selectedHotel.rating}</span>
              <span className="text-slate-300 font-normal">({selectedHotel.reviewsCount} reviews)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">{selectedHotel.name}</h2>
            <p className="text-xs text-slate-200 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{selectedHotel.address}</span>
            </p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 space-y-4 text-xs max-h-[50vh] overflow-y-auto">
          {/* Price banner */}
          <div className="flex items-center justify-between p-3.5 bg-sky-50 rounded-2xl border border-sky-100">
            <div>
              <span className="text-slate-500 text-[11px] block">Nightly Tariff</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-black text-sky-900">₹{selectedHotel.pricePerNight}</span>
                {selectedHotel.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">₹{selectedHotel.originalPrice}</span>
                )}
                <span className="text-[11px] text-slate-500 font-normal">/ night (Taxes incl.)</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-emerald-700 font-bold">
              <span>Max Capacity: {selectedHotel.maxGroupSize} Guests</span>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wide">
              Property Amenities & Facilities
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {selectedHotel.facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-medium"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              Host & Property Direct Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                <span>{selectedHotel.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2 truncate">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <span className="truncate">{selectedHotel.contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleAddToTripAsStay}
            className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Select for My Trip Itinerary
          </button>

          <button
            onClick={handleBookOrEnquire}
            className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enquire / Request Reservation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const RestaurantDetailModal: React.FC = () => {
  const { selectedRestaurant, setSelectedRestaurant, setIsEnquiryModalOpen, setEnquiryTarget, showToast } = useTravel();

  if (!selectedRestaurant) return null;

  const handleEnquiry = () => {
    setEnquiryTarget({
      name: selectedRestaurant.name,
      type: 'restaurant',
      phone: selectedRestaurant.contact.phone,
    });
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="relative h-60 w-full">
          <img
            src={selectedRestaurant.image}
            alt={selectedRestaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            onClick={() => setSelectedRestaurant(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 left-4 flex gap-1.5">
            <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-full text-xs">
              {selectedRestaurant.cuisine}
            </span>
            {selectedRestaurant.isLocalSpecialty && (
              <span className="bg-amber-500 text-white font-bold px-2.5 py-1 rounded-full text-xs">
                Local Specialty
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-bold mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{selectedRestaurant.rating}</span>
              <span className="text-slate-300 font-normal">({selectedRestaurant.reviewsCount} foodies)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">{selectedRestaurant.name}</h2>
            <p className="text-xs text-slate-200 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedRestaurant.location} ({selectedRestaurant.distanceKm} km from center)</span>
            </p>
          </div>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[50vh] overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Avg Cost</span>
              <span className="text-sm font-black text-emerald-900">₹{selectedRestaurant.avgCostForTwo} for two</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Timings</span>
              <span className="text-xs font-bold text-slate-800 line-clamp-1">{selectedRestaurant.timings}</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Dietary</span>
              <span className="text-xs font-bold text-sky-900">{selectedRestaurant.dietary.join(', ')}</span>
            </div>
          </div>

          {/* Signature Must-Try Dishes */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wide">
              Signature Must-Try Dishes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedRestaurant.signatureDishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                    ★
                  </span>
                  <span className="font-semibold text-slate-800">{dish}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Contact: <strong>{selectedRestaurant.contact.phone}</strong></span>
            </div>
            <a
              href={`tel:${selectedRestaurant.contact.phone}`}
              className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold hover:bg-emerald-200 transition"
            >
              Call Table Desk
            </a>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
          <button
            onClick={() => setSelectedRestaurant(null)}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleEnquiry}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enquire / Book Table</span>
          </button>
        </div>
      </div>
    </div>
  );
};

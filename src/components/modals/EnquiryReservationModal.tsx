import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { Mail, Calendar, Users, Phone, MessageSquare, CheckCircle, X, Sparkles, Building } from 'lucide-react';

export const EnquiryReservationModal: React.FC = () => {
  const {
    isEnquiryModalOpen,
    setIsEnquiryModalOpen,
    enquiryTarget,
    addBusinessEnquiry,
    addBusinessReservation,
    userProfile,
  } = useTravel();

  const [mode, setMode] = useState<'enquiry' | 'reservation'>('reservation');
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState('+91 98112 34567');
  const [email, setEmail] = useState(userProfile.email);
  const [dates, setDates] = useState('2026-10-15 to 2026-10-18');
  const [guests, setGuests] = useState(2);
  const [roomOrTable, setRoomOrTable] = useState('Deluxe Heritage Room / Standard Table');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isEnquiryModalOpen || !enquiryTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'enquiry') {
      addBusinessEnquiry({
        senderName: name,
        senderPhone: phone,
        message: notes || `Inquiry regarding availability and services at ${enquiryTarget.name}`,
      });
    } else {
      addBusinessReservation({
        guestName: name,
        guestPhone: phone,
        guestEmail: email,
        dates,
        guestsCount: guests,
        roomTypeOrTable: roomOrTable,
        notes,
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsEnquiryModalOpen(false);
      setNotes('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-white/10">
              <Building className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Contact & Connect with Host</h3>
              <p className="text-xs text-sky-100">{enquiryTarget.name}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEnquiryModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              {mode === 'reservation' ? 'Reservation Request Sent!' : 'Enquiry Dispatched!'}
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              The manager of <strong>{enquiryTarget.name}</strong> has received your request and will call/email you directly.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4 text-xs">
            {/* Mode toggle */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode('reservation')}
                className={`flex-1 py-2 rounded-lg font-bold transition cursor-pointer ${
                  mode === 'reservation' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Request Reservation
              </button>
              <button
                type="button"
                onClick={() => setMode('enquiry')}
                className={`flex-1 py-2 rounded-lg font-bold transition cursor-pointer ${
                  mode === 'enquiry' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Send General Enquiry
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              {mode === 'reservation' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Preferred Dates *</label>
                      <input
                        type="text"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        placeholder="e.g. 15 Oct - 18 Oct"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Number of Guests</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Room / Table Preference</label>
                    <input
                      type="text"
                      value={roomOrTable}
                      onChange={(e) => setRoomOrTable(e.target.value)}
                      placeholder="e.g. Balcony Suite, Courtyard Table, Extra Bed"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 text-xs"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {mode === 'reservation' ? 'Special Requests & Notes' : 'Your Message / Inquiry *'}
                </label>
                <textarea
                  rows={3}
                  required={mode === 'enquiry'}
                  placeholder={
                    mode === 'reservation'
                      ? 'e.g. Early check-in requested, airport cab pickup, dietary preferences...'
                      : 'Ask about prices, group packages, seasonal offers, pet friendliness...'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 text-xs"
                />
              </div>

              {/* Direct host info note */}
              {enquiryTarget.phone && (
                <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between text-[11px] text-sky-900">
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>Direct Host Line: <strong>{enquiryTarget.phone}</strong></span>
                  </div>
                  <a
                    href={`tel:${enquiryTarget.phone}`}
                    className="font-bold text-sky-700 hover:underline"
                  >
                    Call Now
                  </a>
                </div>
              )}

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-enquiry-modal-btn"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md transition cursor-pointer"
                >
                  {mode === 'reservation' ? 'Submit Reservation Request' : 'Send Direct Inquiry'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

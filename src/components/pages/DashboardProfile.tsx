import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { DestinationCard } from '../cards/DestinationCard';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  Heart,
  Bookmark,
  Calendar,
  Sparkles,
  Award,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Compass,
  Flame,
} from 'lucide-react';

export const DashboardProfile: React.FC = () => {
  const {
    userProfile,
    destinations,
    updateUserProfile,
    activeTrip,
    setActiveTab,
    showToast,
  } = useTravel();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'saved' | 'trips' | 'safety'>('profile');

  // Emergency contact add form state
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRelation, setContactRelation] = useState('Family');

  const savedDestinationsList = destinations.filter((d) =>
    userProfile.savedDestinationIds.includes(d.id)
  );

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactName.trim() || !contactPhone || !contactPhone.trim()) return;

    const newContact = {
      id: `ec-${Date.now()}`,
      name: contactName.trim(),
      phone: contactPhone.trim(),
      relation: contactRelation,
    };

    updateUserProfile({
      emergencyContacts: [...userProfile.emergencyContacts, newContact],
    });

    setShowAddContact(false);
    setContactName('');
    setContactPhone('');
    showToast('Emergency contact added successfully.');
  };

  const handleRemoveContact = (id: string) => {
    updateUserProfile({
      emergencyContacts: userProfile.emergencyContacts.filter((c) => c.id !== id),
    });
    showToast('Emergency contact removed.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover ring-4 ring-sky-100 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{userProfile.name}</h1>
              <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Verified Explorer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{userProfile.email} • {userProfile.bio}</p>
            <div className="flex items-center space-x-3 text-xs text-slate-600 mt-2">
              <span>{userProfile.savedDestinationIds.length} Saved Destinations</span>
              <span>•</span>
              <span>{userProfile.bucketListIds.length} Bucket List Goals</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('plan-trip')}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <span>Open Active Trip Planner</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs">
        {[
          { id: 'profile', label: '👤 Account & Travel Profile' },
          { id: 'saved', label: `❤️ Saved Destinations (${savedDestinationsList.length})` },
          { id: 'trips', label: '🗺️ Active Itinerary' },
          { id: 'safety', label: `🛡️ Emergency SOS Contacts (${userProfile.emergencyContacts.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. PROFILE DETAILS */}
      {activeSubTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 text-xs">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            Personal Travel Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => updateUserProfile({ name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={userProfile.email}
                onChange={(e) => updateUserProfile({ email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Travel Style / Bio</label>
              <input
                type="text"
                value={userProfile.bio}
                onChange={(e) => updateUserProfile({ bio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred Budget Range</label>
              <select
                value={userProfile.preferredBudget}
                onChange={(e) => updateUserProfile({ preferredBudget: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
              >
                <option value="Budget (< ₹20k)">Budget (&lt; ₹20k)</option>
                <option value="Moderate (₹20k - ₹50k)">Moderate (₹20k - ₹50k)</option>
                <option value="Luxury (> ₹50k)">Luxury (&gt; ₹50k)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">Favorite Travel Themes</label>
            <div className="flex flex-wrap gap-2">
              {['Heritage & Forts', 'Eco Homestays', 'Mountain Treks', 'Street Food Trails', 'Spiritual Retreats', 'Coastal Beaches'].map((style) => (
                <span
                  key={style}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 font-bold border border-sky-200 text-xs"
                >
                  ✓ {style}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. SAVED DESTINATIONS */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          {savedDestinationsList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No saved destinations yet</h3>
              <p className="text-xs text-slate-500">
                Click the bookmark button on any destination card to save it for your next trip.
              </p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition cursor-pointer"
              >
                Explore Destinations
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedDestinationsList.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ACTIVE ITINERARY */}
      {activeSubTab === 'trips' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Current Scheduled Trip: {activeTrip.destination} ({activeTrip.days.length} Days)
              </h3>
              <p className="text-slate-500">Budget: ₹{activeTrip.totalBudget.toLocaleString()}</p>
            </div>
            <button
              onClick={() => setActiveTab('plan-trip')}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition cursor-pointer"
            >
              Open Trip Editor
            </button>
          </div>

          <div className="space-y-2">
            {activeTrip.days.map((day) => (
              <div key={day.day} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Day {day.day}: {day.title}</span>
                <p className="text-slate-600 text-[11px] mt-0.5">Stay: {day.stayName}</p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                  <span>{day.items.length} activities scheduled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EMERGENCY CONTACTS */}
      {activeSubTab === 'safety' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Designated Emergency Contacts</h3>
              <p className="text-slate-500">These numbers receive your live GPS coordinate distress alerts during SOS activation.</p>
            </div>
            <button
              onClick={() => setShowAddContact(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold flex items-center space-x-1 hover:bg-rose-700 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Emergency Contact</span>
            </button>
          </div>

          <div className="space-y-3">
            {userProfile.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{contact.name}</span>
                    <span className="bg-rose-200 text-rose-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                      {contact.relation}
                    </span>
                  </div>
                  <p className="text-slate-600 font-mono text-xs mt-0.5">{contact.phone}</p>
                </div>

                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="Remove contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {showAddContact && (
            <form onSubmit={handleAddContactSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800">Add New Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Contact Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="tel"
                  required
                  placeholder="+91 Phone Number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
                <select
                  value={contactRelation}
                  onChange={(e) => setContactRelation(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Family">Family</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700"
                >
                  Save Contact
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export const BucketListPage: React.FC = () => {
  const { destinations, userProfile, setActiveTab } = useTravel();

  const bucketListDestinations = destinations.filter((d) =>
    userProfile.bucketListIds.includes(d.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-200" />
            <span>Lifetime Travel Goals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
            Your Personal Travel Bucket List
          </h1>
          <p className="text-xs sm:text-sm text-amber-100">
            Track dream destinations, mark off milestones, and celebrate journeys across India and the globe.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 text-center shrink-0 w-full sm:w-auto">
          <span className="text-3xl font-black">{bucketListDestinations.length}</span>
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-100">Destinations in Wishlist</p>
        </div>
      </div>

      {bucketListDestinations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Your bucket list is currently empty</h3>
          <p className="text-xs text-slate-500">
            Browse destinations and click "Add to Bucket List" to begin curating your journey.
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition cursor-pointer"
          >
            Browse Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bucketListDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
};

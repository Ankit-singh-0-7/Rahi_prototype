import React, { useState } from 'react';
import { useTravel, ActiveTab } from '../../context/TravelContext';
import {
  Home,
  Compass,
  Calendar,
  Users,
  User,
  ShieldAlert,
  MoreHorizontal,
  Hotel,
  Utensils,
  Sparkles,
  Flame,
  Bot,
  Tag,
  Briefcase,
  Bookmark,
  Languages,
  X,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsSOSOpen, setIsTranslatorOpen } = useTravel();
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const primaryMobileTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'plan-trip', label: 'Trips', icon: <Calendar className="w-5 h-5" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-5 h-5" /> },
  ];

  const moreCategoryItems: { id: ActiveTab; label: string; desc: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'hotels', label: 'Hotels & Stays', desc: 'Verified heritage stays & cottages', icon: <Hotel className="w-4 h-4 text-sky-600" /> },
    { id: 'food', label: 'Food & Dining', desc: 'Local delicacies & hygiene ratings', icon: <Utensils className="w-4 h-4 text-orange-600" /> },
    { id: 'attractions', label: 'Attractions', desc: 'Must-visit spots & timing', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: 'hidden-gems', label: 'Hidden Gems', desc: 'Curated secret trails', icon: <Flame className="w-4 h-4 text-rose-500" />, badge: 'New' },
    { id: 'ai-assistant', label: 'AI Travel Assistant', desc: 'Instant smart guidance & budget', icon: <Bot className="w-4 h-4 text-emerald-600" />, badge: 'AI' },
    { id: 'offers', label: 'Offers & Passes', desc: 'Monsoon discounts & city passes', icon: <Tag className="w-4 h-4 text-emerald-600" /> },
    { id: 'bucket-list', label: 'Bucket List', desc: 'Saved places & wishlists', icon: <Bookmark className="w-4 h-4 text-indigo-600" /> },
    { id: 'safety', label: 'Safety & Issues', desc: 'Report issues & civic safety', icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
    { id: 'business', label: 'Business Portal', desc: 'Manage listings & reservations', icon: <Briefcase className="w-4 h-4 text-slate-700" /> },
    { id: 'profile', label: 'Profile & Account', desc: 'User history & preferences', icon: <User className="w-4 h-4 text-sky-700" /> },
  ];

  const isMoreTabActive = moreCategoryItems.some((item) => item.id === activeTab);

  return (
    <>
      {/* Floating permanent SOS button on mobile */}
      <div className="fixed bottom-20 right-4 z-50 xl:hidden">
        <button
          id="mobile-floating-sos-btn"
          onClick={() => setIsSOSOpen(true)}
          className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-xl shadow-rose-600/40 flex flex-col items-center justify-center font-bold animate-pulse ring-4 ring-rose-300/50 cursor-pointer"
          title="Emergency SOS"
        >
          <ShieldAlert className="w-6 h-6" />
          <span className="text-[9px] font-black tracking-tighter uppercase">SOS</span>
        </button>
      </div>

      {/* Slide-Up Mobile Sheet for "More" Menu */}
      {isMoreSheetOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMoreSheetOpen(false)}
          />

          {/* Sheet Container */}
          <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 flex flex-col z-50 animate-in slide-in-from-bottom duration-200">
            {/* Grab Bar & Header */}
            <div className="pt-3 px-5 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Explore All Sections</h3>
              </div>
              <button
                id="mobile-more-sheet-close-btn"
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                aria-label="Close sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Utility Strip */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-2 shrink-0">
              <button
                id="mobile-sheet-translator-btn"
                onClick={() => {
                  setIsTranslatorOpen(true);
                  setIsMoreSheetOpen(false);
                }}
                className="flex items-center space-x-2 p-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs cursor-pointer hover:bg-sky-50 transition"
              >
                <Languages className="w-4 h-4 text-sky-600" />
                <span>Travel Translator</span>
              </button>
              <button
                id="mobile-sheet-sos-btn"
                onClick={() => {
                  setIsSOSOpen(true);
                  setIsMoreSheetOpen(false);
                }}
                className="flex items-center space-x-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 shadow-xs cursor-pointer hover:bg-rose-100 transition"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>SOS Assistance</span>
              </button>
            </div>

            {/* Scrollable Category Grid */}
            <div className="overflow-y-auto p-4 space-y-2 pb-8">
              {moreCategoryItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    id={`mobile-sheet-item-${item.id}`}
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMoreSheetOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-sky-50 border-sky-300 text-sky-900 ring-1 ring-sky-300'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-sky-100' : 'bg-slate-100'}`}>
                        {item.icon}
                      </div>
                      <div className="truncate">
                        <p className={`text-xs font-bold ${isActive ? 'text-sky-900' : 'text-slate-900'}`}>
                          {item.label}
                        </p>
                        <p className="text-[11px] text-slate-700 truncate">{item.desc}</p>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0 ml-2">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 xl:hidden shadow-lg">
        <div className="flex items-center justify-around">
          {primaryMobileTabs.map((tab) => (
            <button
              id={`mobile-bottom-${tab.id}`}
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMoreSheetOpen(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${
                activeTab === tab.id
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          ))}

          {/* More Tab Trigger */}
          <button
            id="mobile-bottom-more-btn"
            onClick={() => setIsMoreSheetOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer relative ${
              isMoreTabActive || isMoreSheetOpen
                ? 'text-sky-600 font-bold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">More</span>
            {isMoreTabActive && !isMoreSheetOpen && (
              <span className="absolute top-1 right-3.5 w-1.5 h-1.5 rounded-full bg-sky-600" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export const Toast: React.FC = () => {
  const { toastMessage } = useTravel();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-5">
      <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
      <p className="text-xs font-medium leading-relaxed">{toastMessage}</p>
    </div>
  );
};

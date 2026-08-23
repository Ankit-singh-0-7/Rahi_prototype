import React from 'react';
import { useTravel, ActiveTab } from '../../context/TravelContext';
import { Home, Compass, Calendar, Users, User, ShieldAlert } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsSOSOpen } = useTravel();

  const mobileTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'plan-trip', label: 'Trips', icon: <Calendar className="w-5 h-5" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

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

      {/* Mobile bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 xl:hidden shadow-lg">
        <div className="flex items-center justify-around">
          {mobileTabs.map((tab) => (
            <button
              id={`mobile-bottom-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

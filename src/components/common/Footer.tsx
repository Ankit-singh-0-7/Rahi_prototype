import React from 'react';
import { useTravel, ActiveTab } from '../../context/TravelContext';
import {
  Compass,
  MapPin,
  Calendar,
  Hotel,
  Utensils,
  Sparkles,
  ShieldAlert,
  Briefcase,
  Heart,
  PhoneCall,
  Mail,
  Flame,
  Globe,
  Share2,
  Lock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsSOSOpen, setIsTranslatorOpen, setIsReportIssueOpen } = useTravel();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-28 sm:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-lg">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                Safar<span className="text-sky-400">Setu</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover destinations, local businesses, affordable trips, hidden gems, and travel with greater safety — all in one unified ecosystem.
            </p>
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 max-w-sm space-y-1.5">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>24x7 Tourist Emergency Network</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Instant SOS location broadcasting, nearby police/hospital directory & multilingual civic issue reporting.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Discovery</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-sky-400 transition cursor-pointer">
                  Explore Destinations
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('hidden-gems')} className="hover:text-sky-400 transition cursor-pointer flex items-center space-x-1">
                  <span>Hidden Gems</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">Top</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('hotels')} className="hover:text-sky-400 transition cursor-pointer">
                  Hotels & Eco-Stays
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('food')} className="hover:text-sky-400 transition cursor-pointer">
                  Local Food & Street Eateries
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('attractions')} className="hover:text-sky-400 transition cursor-pointer">
                  Attractions & Heritage
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('events')} className="hover:text-sky-400 transition cursor-pointer">
                  Festivals & Cultural Fairs
                </button>
              </li>
            </ul>
          </div>

          {/* Planning & AI Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Smart Planning</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('ai-assistant')} className="hover:text-sky-400 transition cursor-pointer text-emerald-400 font-semibold flex items-center space-x-1">
                  <span>AI Travel Assistant</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('plan-trip')} className="hover:text-sky-400 transition cursor-pointer">
                  Interactive Trip Planner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('offers')} className="hover:text-sky-400 transition cursor-pointer">
                  Seasonal Offers & Deals
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bucket-list')} className="hover:text-sky-400 transition cursor-pointer">
                  Personal Bucket List
                </button>
              </li>
              <li>
                <button onClick={() => setIsTranslatorOpen(true)} className="hover:text-sky-400 transition cursor-pointer">
                  Multilingual Travel Translator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('community')} className="hover:text-sky-400 transition cursor-pointer">
                  Community Travel Stories
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Local Business */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Safety & Business</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setIsSOSOpen(true)} className="hover:text-rose-400 text-rose-400 font-bold transition cursor-pointer flex items-center space-x-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Emergency SOS Protocol</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('safety')} className="hover:text-sky-400 transition cursor-pointer">
                  Civic Issue Priority Board
                </button>
              </li>
              <li>
                <button onClick={() => setIsReportIssueOpen(true)} className="hover:text-amber-400 transition cursor-pointer">
                  Report Destination Issue
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('business')} className="hover:text-sky-400 text-sky-300 font-semibold transition cursor-pointer">
                  Local Business Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-sky-400 transition cursor-pointer">
                  Traveller Hub Dashboard
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© 2026 SafarSetu Platform. Empowering sustainable, affordable & safer tourism across India & worldwide.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1 text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Location data encrypted & consent-bound</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

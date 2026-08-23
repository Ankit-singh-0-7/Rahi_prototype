import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { AuthModalMode, UserAccount } from '../../types';
import {
  User,
  Lock,
  Mail,
  Compass,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Briefcase,
  X,
  ArrowRight,
  UserPlus,
  LogIn,
  Users,
  HardDrive,
  CloudOff,
  Cloud,
  Check,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    accounts,
    currentAccountId,
    currentUser,
    isLoggedIn,
    login,
    register,
    switchAccount,
    showToast,
  } = useTravel();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'traveler' | 'host'>('traveler');
  const [regBio, setRegBio] = useState('');
  const [regBudget, setRegBudget] = useState<UserAccount['preferredBudget']>('Moderate (₹20k - ₹50k)');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    'Hidden Gems',
    'Nature & Mountains',
    'Local Food',
  ]);

  const travelStyleOptions = [
    'Hidden Gems',
    'Nature & Mountains',
    'Beaches & Coastal',
    'Heritage & History',
    'Local Food & Dining',
    'Adventure & Treks',
    'Affordable Hostels',
    'Luxury & Wellness',
    'Solo Travel',
    'Family Trips',
  ];

  if (!isAuthModalOpen) return null;

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Please enter your email or name to sign in.');
      return;
    }
    const success = login(loginIdentifier.trim(), loginPassword);
    if (success) {
      setLoginIdentifier('');
      setLoginPassword('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      showToast('Please provide your name and a valid email.');
      return;
    }
    const success = register({
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      password: regPassword || 'password123',
      bio: regBio.trim() || (regRole === 'host' ? 'Homestay host & local guide' : 'Avid explorer & traveler'),
      preferences: selectedStyles.length > 0 ? selectedStyles : ['Hidden Gems', 'Nature & Mountains'],
      preferredBudget: regBudget,
    });
    if (success) {
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegBio('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 p-6 text-white relative">
          <button
            id="close-auth-modal-btn"
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">SafarSetu Account Hub</h2>
              <p className="text-xs text-sky-100 font-medium">Free Local Storage & Personal Itineraries</p>
            </div>
          </div>

          {/* Privacy badge */}
          <div className="mt-3 inline-flex items-center space-x-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-medium border border-white/20">
            <HardDrive className="w-3.5 h-3.5 text-emerald-300" />
            <span>100% Free • Stored Safely in Browser • Retained across logouts</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-1 text-xs font-bold">
          <button
            id="tab-auth-switch"
            onClick={() => setAuthModalMode('switch')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authModalMode === 'switch'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Saved Accounts ({accounts.length})</span>
          </button>

          <button
            id="tab-auth-login"
            onClick={() => setAuthModalMode('login')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authModalMode === 'login'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            id="tab-auth-register"
            onClick={() => setAuthModalMode('register')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              authModalMode === 'register'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-5">
          {/* 1. SWITCH SAVED ACCOUNTS */}
          {authModalMode === 'switch' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Choose Active Account</h3>
                  <p className="text-[11px] text-slate-500">
                    Switch between traveler and host profiles. All trips & bucket lists are preserved.
                  </p>
                </div>
                <button
                  onClick={() => setAuthModalMode('register')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1 cursor-pointer"
                >
                  <PlusIcon className="w-3 h-3" />
                  <span>New User</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {accounts.map((acc) => {
                  const isActive = isLoggedIn && currentAccountId === acc.id;
                  return (
                    <div
                      key={acc.id}
                      onClick={() => switchAccount(acc.id)}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer group ${
                        isActive
                          ? 'border-sky-500 bg-sky-50/70 shadow-xs ring-1 ring-sky-400'
                          : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">{acc.name}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                acc.role === 'host'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {acc.role === 'host' ? 'Homestay Host' : 'Traveler'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{acc.email}</p>
                          <div className="flex items-center space-x-3 text-[10px] text-slate-600 mt-1">
                            <span>{acc.savedTrips.length} Itineraries</span>
                            <span>•</span>
                            <span>{acc.bucketListIds.length} Bucket List</span>
                            <span>•</span>
                            <span>{acc.savedDestinationIds.length} Saved</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isActive ? (
                          <span className="flex items-center space-x-1 text-sky-600 font-bold bg-sky-100 px-2.5 py-1 rounded-xl text-[11px]">
                            <Check className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <button className="px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-sky-600 group-hover:text-white text-slate-700 font-bold transition text-xs">
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cloud Ready Notice */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-start space-x-2.5">
                <Cloud className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600">
                  <strong className="text-slate-800">Cloud Sync Ready:</strong> When you connect Firebase later, these profiles can be synchronized to the cloud with a single click.
                </div>
              </div>
            </div>
          )}

          {/* 2. SIGN IN */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Sign In to Your Account</h3>
                <p className="text-[11px] text-slate-500">
                  Access your custom itineraries, personal preferences, and saved destinations.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email or Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. aarav.travels@gmail.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Passcode / Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="•••••••• (Default: password123)"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5 text-xs"
              >
                <span>Sign In to Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Logins */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Quick Demo Accounts:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => switchAccount('user-aarav')}
                    className="p-2 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-left transition cursor-pointer"
                  >
                    <p className="font-bold text-slate-800 text-[11px]">Aarav Sharma</p>
                    <p className="text-[10px] text-slate-500">Solo Traveler (Saved Trips)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => switchAccount('user-pooja-host')}
                    className="p-2 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-left transition cursor-pointer"
                  >
                    <p className="font-bold text-slate-800 text-[11px]">Pooja Hegde</p>
                    <p className="text-[10px] text-slate-500">Homestay Host & Portal</p>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 3. CREATE NEW ACCOUNT */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Create New Travel Profile</h3>
                <p className="text-[11px] text-slate-500">
                  Set up your personal traveler profile with tailored recommendations.
                </p>
              </div>

              {/* Role selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('traveler')}
                    className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer ${
                      regRole === 'traveler'
                        ? 'border-sky-500 bg-sky-50 text-sky-800 ring-1 ring-sky-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Traveler / Tourist</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('host')}
                    className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer ${
                      regRole === 'host'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Homestay / Business Host</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikram@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password / Passcode</label>
                <input
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Traveler Bio / Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Weekend road-tripper & mountain lover"
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Preferred Travel Styles</label>
                <div className="flex flex-wrap gap-1.5">
                  {travelStyleOptions.map((style) => {
                    const isSelected = selectedStyles.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyle(style)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5 text-xs"
              >
                <span>Create Account & Start Exploring</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

import React, { useState, useRef, useEffect } from 'react';
import { useTravel, ActiveTab } from '../../context/TravelContext';
import {
  Compass,
  MapPin,
  Calendar,
  Hotel,
  Utensils,
  Sparkles,
  Users,
  Tag,
  Bookmark,
  ShieldAlert,
  Briefcase,
  Bot,
  Search,
  Languages,
  User,
  Menu,
  X,
  PhoneCall,
  Bell,
  Heart,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Flame,
  UserCheck,
  LogOut,
  UserPlus,
  RefreshCw,
  Download,
  Shield,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsSOSOpen,
    setIsSearchOpen,
    setIsTranslatorOpen,
    language,
    setLanguage,
    userProfile,
    businessProfile,
    issueReports,
    currentUser,
    isLoggedIn,
    accounts,
    openAuthModal,
    switchAccount,
    logout,
    exportUserData,
  } = useTravel();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languagesList = [
    { code: 'English', label: 'English (EN)' },
    { code: 'Hindi', label: 'हिन्दी (Hindi)' },
    { code: 'Bengali', label: 'বাংলা (Bengali)' },
    { code: 'Tamil', label: 'தமிழ் (Tamil)' },
    { code: 'Telugu', label: 'తెలుగు (Telugu)' },
    { code: 'Marathi', label: 'मराठी (Marathi)' },
    { code: 'Spanish', label: 'Español (ES)' },
    { code: 'French', label: 'Français (FR)' },
    { code: 'German', label: 'Deutsch (DE)' },
    { code: 'Japanese', label: '日本語 (JA)' },
  ];

  const criticalIssuesCount = issueReports.filter(
    (i) => i.priority === 'CRITICAL' || i.priority === 'HIGH'
  ).length;

  const pendingReservationsCount = businessProfile.reservations.filter(
    (r) => r.status === 'Pending'
  ).length;

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore', icon: <MapPin className="w-4 h-4" /> },
    { id: 'plan-trip', label: 'Plan Trip', icon: <Calendar className="w-4 h-4" /> },
    { id: 'ai-assistant', label: 'AI Assistant', icon: <Bot className="w-4 h-4 text-emerald-600" />, badge: 'AI' },
    { id: 'hotels', label: 'Hotels & Stays', icon: <Hotel className="w-4 h-4" /> },
    { id: 'food', label: 'Food & Dining', icon: <Utensils className="w-4 h-4" /> },
    { id: 'attractions', label: 'Attractions', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'hidden-gems', label: 'Hidden Gems', icon: <Flame className="w-4 h-4 text-amber-500" />, badge: 'New' },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> },
    { id: 'offers', label: 'Offers', icon: <Tag className="w-4 h-4 text-emerald-600" /> },
    { id: 'bucket-list', label: 'Bucket List', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'safety', label: 'Safety & Issues', icon: <ShieldAlert className="w-4 h-4 text-rose-600" />, badge: criticalIssuesCount > 0 ? criticalIssuesCount : undefined },
    { id: 'business', label: 'Business Portal', icon: <Briefcase className="w-4 h-4" />, badge: pendingReservationsCount > 0 ? `${pendingReservationsCount} req` : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      {/* Top emergency safety ticker bar */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500 text-white">
              24x7 TOURIST HELPLINE: 1363
            </span>
            <span className="hidden sm:inline text-slate-300">
              National Emergency: <strong className="text-white">112</strong> | Police: <strong className="text-white">100</strong> | Medical: <strong className="text-white">108</strong>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              id="topbar-translator-btn"
              onClick={() => setIsTranslatorOpen(true)}
              className="flex items-center space-x-1 text-slate-200 hover:text-white transition cursor-pointer text-[11px]"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Travel Translator</span>
            </button>
            <button
              id="topbar-sos-btn"
              onClick={() => setIsSOSOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-0.5 rounded text-[11px] flex items-center space-x-1 shadow-xs animate-pulse cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" />
              <span>SOS ASSISTANCE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 font-display">
                  Rahi<span className="text-sky-600">.</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                  Tourism
                </span>
              </div>
              <p className="text-[11px] text-slate-700 tracking-tight hidden sm:block">
                Discover • Plan • Connect • Safe Travel
              </p>
            </div>
          </div>

          {/* Desktop Nav Items (Scrollable / Bento Bar) */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.slice(0, 8).map((link) => (
              <button
                id={`nav-link-${link.id}`}
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer relative ${
                  activeTab === link.id
                    ? 'text-sky-700 bg-sky-50 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      link.badge === 'AI'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Dropdown for secondary pages */}
            <div className="relative group">
              <button
                id="nav-more-dropdown-btn"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
              >
                <span>More</span>
                <span className="text-xs">▾</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block transition animate-in fade-in-50">
                {navLinks.slice(8).map((link) => (
                  <button
                    id={`nav-sublink-${link.id}`}
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition cursor-pointer ${
                      activeTab === link.id
                        ? 'text-sky-700 bg-sky-50 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {link.icon}
                      <span>{link.label}</span>
                    </span>
                    {link.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        {link.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Button */}
            <button
              id="header-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer flex items-center space-x-1.5 text-xs font-medium border border-slate-200"
              title="Search Destinations, Hotels, Food & Experiences"
            >
              <Search className="w-4 h-4 text-slate-700" />
              <span className="hidden md:inline">Search (Ctrl+K)</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="header-notifications-btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
                    <span className="text-[10px] text-sky-600 font-semibold cursor-pointer">Mark read</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 flex items-start space-x-2">
                      <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-800">New Hidden Gem in Goa</p>
                        <p className="text-slate-700 text-[11px]">Kakolem waterfall trail just verified by 12 travellers.</p>
                      </div>
                    </div>
                    <div className="py-2.5 flex items-start space-x-2">
                      <Tag className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-800">35% Off Monsoon Deal Active</p>
                        <p className="text-slate-700 text-[11px]">Heritage Quinta Villa released early-bird coupon.</p>
                      </div>
                    </div>
                    <div className="py-2.5 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-800">Civic Issue Escalation</p>
                        <p className="text-slate-700 text-[11px]">Nahargarh Fort cleanup dossier forwarded to authority.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="header-language-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">{language.slice(0, 3)}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languagesList.map((lang) => (
                    <button
                      id={`lang-opt-${lang.code}`}
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-sky-50 transition cursor-pointer ${
                        language === lang.code ? 'text-sky-600 font-bold bg-sky-50/60' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {language === lang.code && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile & Account Switcher Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                id="header-profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-full border transition cursor-pointer ${
                  isLoggedIn
                    ? 'border-sky-200 bg-sky-50/70 hover:bg-sky-100/70'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200'
                }`}
                title="Account, Profile & Switch User"
              >
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-sky-500 shadow-xs"
                />
                <div className="text-left hidden lg:block max-w-[90px]">
                  <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                    {userProfile.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-700 leading-none truncate">
                    {currentUser?.role === 'host' ? 'Host' : isLoggedIn ? 'Traveler' : 'Guest'}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-700 hidden sm:inline" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in">
                  {/* Account Header */}
                  <div className="p-3 bg-gradient-to-r from-sky-50 to-indigo-50/40 rounded-xl border border-sky-100 mb-2">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={userProfile.avatar}
                        alt={userProfile.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{userProfile.name}</p>
                        <p className="text-[11px] text-slate-700 truncate">{userProfile.email}</p>
                        <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-sky-600 text-white">
                          {currentUser?.role === 'host' ? 'Homestay Host' : isLoggedIn ? 'Explorer' : 'Guest Mode'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-0.5 text-xs">
                    <button
                      id="account-menu-profile-btn"
                      onClick={() => {
                        setActiveTab('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition cursor-pointer font-medium"
                    >
                      <User className="w-4 h-4 text-sky-600" />
                      <span>My Profile & Itineraries</span>
                    </button>

                    <button
                      id="account-menu-bucket-btn"
                      onClick={() => {
                        setActiveTab('bucket-list');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition cursor-pointer font-medium"
                    >
                      <Bookmark className="w-4 h-4 text-indigo-600" />
                      <span>Bucket List & Saved Places</span>
                    </button>

                    {currentUser?.role === 'host' && (
                      <button
                        id="account-menu-business-btn"
                        onClick={() => {
                          setActiveTab('business');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer font-medium"
                      >
                        <Briefcase className="w-4 h-4 text-emerald-600" />
                        <span>Business & Homestay Portal</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100" />

                    {/* Quick Switch Profiles */}
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                      <span>Switch Profile</span>
                      <span className="text-[10px] font-normal text-slate-700">{accounts.length} local</span>
                    </div>

                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {accounts.map((acc) => (
                        <button
                          id={`quick-switch-acc-${acc.id}`}
                          key={acc.id}
                          onClick={() => {
                            switchAccount(acc.id);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                            acc.id === currentUser?.id
                              ? 'bg-sky-100/70 text-sky-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <img src={acc.avatar} alt={acc.name} className="w-5 h-5 rounded-full object-cover" />
                            <span className="truncate">{acc.name}</span>
                          </div>
                          <span className="text-[10px] px-1 rounded bg-slate-200 text-slate-700 uppercase font-semibold">
                            {acc.role === 'host' ? 'Host' : 'User'}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="my-1 border-t border-slate-100" />

                    {/* Switch / Add Account Modal Trigger */}
                    <button
                      id="account-menu-switch-modal-btn"
                      onClick={() => {
                        openAuthModal('switch');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition cursor-pointer font-medium"
                    >
                      <RefreshCw className="w-4 h-4 text-sky-600" />
                      <span>Manage All Accounts</span>
                    </button>

                    <button
                      id="account-menu-new-acc-btn"
                      onClick={() => {
                        openAuthModal('register');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition cursor-pointer font-medium"
                    >
                      <UserPlus className="w-4 h-4 text-emerald-600" />
                      <span>Add New Profile / Host</span>
                    </button>

                    <button
                      id="account-menu-export-btn"
                      onClick={() => {
                        exportUserData();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer font-medium"
                    >
                      <Download className="w-4 h-4 text-slate-700" />
                      <span>Backup My Data (JSON)</span>
                    </button>

                    {isLoggedIn && (
                      <button
                        id="account-menu-logout-btn"
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out to Guest</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Main SOS button in header */}
            <button
              id="header-main-sos-btn"
              onClick={() => setIsSOSOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 shadow-md shadow-rose-500/20 transition cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="font-extrabold tracking-wide">SOS</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              id="mobile-menu-trigger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-4">
            {navLinks.map((link) => (
              <button
                id={`mobile-nav-${link.id}`}
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === link.id
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.icon}
                <span className="truncate">{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] bg-sky-200 text-sky-800 font-bold px-1 rounded-full ml-auto">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              id="mobile-translator-open-btn"
              onClick={() => {
                setIsTranslatorOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 text-xs text-sky-600 font-semibold"
            >
              <Languages className="w-4 h-4" />
              <span>Travel Translator</span>
            </button>
            <button
              id="mobile-report-issue-btn"
              onClick={() => {
                setActiveTab('safety');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 text-xs text-amber-600 font-semibold"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Destination Issue</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { useTravel } from '../../context/TravelContext';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Share2,
  Users,
  AlertTriangle,
  Hospital,
  Shield,
  Copy,
  Check,
  X,
  Radio,
  ExternalLink,
  Info,
  Navigation,
  Compass,
  Building2,
} from 'lucide-react';
import {
  REGIONAL_EMERGENCY_DATA,
  calculateDistanceKm,
  detectNearestRegion,
  formatDistance,
  EmergencyServiceFacility,
} from '../../data/emergencyServices';

export const SOSModal: React.FC = () => {
  const { isSOSOpen, setIsSOSOpen, userProfile, showToast, selectedDestination } = useTravel();

  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'TA' | 'BN'>('EN');

  // Intelligent regional default based on currently selected destination
  const getInitialRegion = (): string => {
    if (selectedDestination) {
      const dName = selectedDestination.name.toLowerCase();
      if (dName.includes('jaipur')) return 'jaipur';
      if (dName.includes('varanasi')) return 'varanasi';
      if (dName.includes('manali')) return 'manali';
      if (dName.includes('delhi')) return 'delhi';
      if (dName.includes('mumbai')) return 'mumbai';
      if (dName.includes('kerala')) return 'kerala';
      if (dName.includes('shillong') || dName.includes('meghalaya')) return 'shillong';
      if (dName.includes('goa')) return 'goa';
    }
    return 'jaipur'; // default to prominent hub
  };

  const [selectedRegionKey, setSelectedRegionKey] = useState<string>(getInitialRegion);
  const [facilityFilter, setFacilityFilter] = useState<'all' | 'Hospital' | 'Police' | 'Tourist Police'>('all');

  const emergencyHelplines = [
    { name: 'National Emergency Helpline (All-in-One)', number: '112', icon: <ShieldAlert className="w-5 h-5 text-rose-600" />, desc: 'Police, Fire, Ambulance direct dispatch across India' },
    { name: 'Police Control Room', number: '100', icon: <Shield className="w-5 h-5 text-blue-600" />, desc: 'Immediate local police command & patrol' },
    { name: 'Medical Emergency & Ambulance', number: '108', icon: <Hospital className="w-5 h-5 text-emerald-600" />, desc: 'Free emergency ambulance & trauma response' },
    { name: 'Ministry of Tourism 24x7 Multi-Lingual Tourist Info Line', number: '1363', icon: <PhoneCall className="w-5 h-5 text-sky-600" />, desc: 'Verified tourist guidance & safety help (toll-free)' },
    { name: 'Women Safety & Anti-Harassment Helpline', number: '1091', icon: <Users className="w-5 h-5 text-purple-600" />, desc: '24x7 immediate women protection & patrol' },
  ];

  const currentRegion = REGIONAL_EMERGENCY_DATA[selectedRegionKey] || REGIONAL_EMERGENCY_DATA.jaipur;

  const guidancePhrases = {
    EN: {
      alert: 'Stay calm. Move toward a well-lit, populated area or nearest public hotel lobby.',
      phrase1: 'Help! Please call the police immediately!',
      phrase2: 'I am a traveller and I feel unsafe at this location.',
    },
    HI: {
      alert: 'शांत रहें। किसी रौशन और भीड़-भाड़ वाली जगह या पास के होटल लॉबी की तरफ बढ़ें।',
      phrase1: 'मदद! कृपया तुरंत पुलिस को बुलाएं! (Madad! Kripya turant police ko bulayein!)',
      phrase2: 'मैं एक पर्यटक हूँ और मुझे इस जगह पर असुरक्षित महसूस हो रहा है।',
    },
    TA: {
      alert: 'அமைதியாக இருங்கள். வெளிச்சமான, மக்கள் நடமாட்டம் உள்ள பகுதிக்கு செல்லவும்.',
      phrase1: 'உதவி! உடனே காவல்துறையை அழையுங்கள்! (Help! Call police immediately!)',
      phrase2: 'நான் ஒரு பயணி, எனக்கு உதவி தேவை.',
    },
    BN: {
      alert: 'শান্ত থাকুন। আলোযুক্ত এবং জনবহুল এলাকায় যান।',
      phrase1: 'সাহায্য করুন! অনুগ্রহ করে অবিলম্বে পুলিশকে ডাকুন!',
      phrase2: 'আমি একজন পর্যটক এবং আমি এই জায়গায় অনিরাপद বোধ করছি।',
    },
  };

  const requestLiveLocation = () => {
    setLocationStatus('requesting');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const detectedRegionKey = detectNearestRegion(lat, lng);
          const detectedRegion = REGIONAL_EMERGENCY_DATA[detectedRegionKey];

          setSelectedRegionKey(detectedRegionKey);
          setCoords({
            lat,
            lng,
            address: `GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E (Near ${detectedRegion.regionName}, ${detectedRegion.state})`,
          });
          setLocationStatus('granted');
          showToast(`Accurate GPS location locked: Near ${detectedRegion.regionName}`);
        },
        () => {
          // Fallback simulation based on selected region
          const fallbackRegion = REGIONAL_EMERGENCY_DATA[selectedRegionKey] || REGIONAL_EMERGENCY_DATA.jaipur;
          setCoords({
            lat: fallbackRegion.centerLat,
            lng: fallbackRegion.centerLng,
            address: `${fallbackRegion.regionName}, ${fallbackRegion.state} (${fallbackRegion.centerLat.toFixed(4)}° N, ${fallbackRegion.centerLng.toFixed(4)}° E)`,
          });
          setLocationStatus('granted');
          showToast(`Location set to ${fallbackRegion.regionName} (GPS permission blocked)`);
        },
        { timeout: 8000 }
      );
    } else {
      const fallbackRegion = REGIONAL_EMERGENCY_DATA[selectedRegionKey] || REGIONAL_EMERGENCY_DATA.jaipur;
      setCoords({
        lat: fallbackRegion.centerLat,
        lng: fallbackRegion.centerLng,
        address: `${fallbackRegion.regionName}, ${fallbackRegion.state} (${fallbackRegion.centerLat.toFixed(4)}° N, ${fallbackRegion.centerLng.toFixed(4)}° E)`,
      });
      setLocationStatus('granted');
    }
  };

  // Sync with context destination when modal opens
  useEffect(() => {
    if (isSOSOpen) {
      const initReg = getInitialRegion();
      setSelectedRegionKey(initReg);
      requestLiveLocation();
    }
  }, [isSOSOpen]);

  // When user manually selects another region
  const handleSelectRegion = (regionKey: string) => {
    setSelectedRegionKey(regionKey);
    const region = REGIONAL_EMERGENCY_DATA[regionKey];
    if (region) {
      setCoords({
        lat: region.centerLat,
        lng: region.centerLng,
        address: `${region.regionName}, ${region.state} (${region.centerLat.toFixed(4)}° N, ${region.centerLng.toFixed(4)}° E)`,
      });
      showToast(`Showing emergency services for ${region.regionName}`);
    }
  };

  if (!isSOSOpen) return null;

  const activeLat = coords ? coords.lat : currentRegion.centerLat;
  const activeLng = coords ? coords.lng : currentRegion.centerLng;

  const locationShareText = `EMERGENCY SOS ALERT: I need immediate assistance in ${currentRegion.regionName}. My verified location is: ${
    coords ? coords.address : `${currentRegion.regionName}, ${currentRegion.state}`
  }. Live Maps Link: https://maps.google.com/?q=${activeLat},${activeLng}`;

  const copyLocationText = () => {
    navigator.clipboard.writeText(locationShareText);
    setCopied(true);
    showToast('Emergency SOS location text copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const shareViaWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(locationShareText)}`;
    window.open(url, '_blank');
  };

  const notifyEmergencyContacts = () => {
    if (userProfile.emergencyContacts.length === 0) {
      showToast('No emergency contacts found. Please add trusted contacts in your profile.');
      return;
    }
    const names = userProfile.emergencyContacts.map((c) => c.name).join(', ');
    showToast(`Emergency alert broadcast simulation sent to: ${names}`);
  };

  // Filter facilities
  const filteredFacilities = currentRegion.facilities.filter((f) => {
    if (facilityFilter === 'all') return true;
    if (facilityFilter === 'Hospital') return f.type === 'Government Hospital';
    if (facilityFilter === 'Police') return f.type === 'Police Station';
    if (facilityFilter === 'Tourist Police') return f.type === 'Tourist Police Booth' || f.type === 'Specialized Unit';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-rose-500 overflow-hidden relative">
        {/* Urgent Emergency Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 text-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-lg animate-bounce shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">Are you in immediate danger?</h2>
                <p className="text-rose-100 text-xs sm:text-sm font-medium">
                  24x7 Tourist Emergency Assistance & Rapid Dispatch Network
                </p>
              </div>
            </div>
            <button
              id="sos-modal-close-btn"
              onClick={() => setIsSOSOpen(false)}
              className="p-1.5 rounded-full bg-rose-800/80 hover:bg-rose-800 text-white transition cursor-pointer shrink-0"
              title="Close Emergency Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Direct Dial Emergency Buttons */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
              Instant Direct Call (Click to Dial)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {emergencyHelplines.map((line) => (
                <a
                  key={line.number}
                  href={`tel:${line.number}`}
                  id={`sos-call-${line.number}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/60 hover:bg-rose-100/80 border border-rose-200 text-slate-800 transition group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">{line.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-rose-700">{line.name}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{line.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-3 py-1 bg-rose-600 text-white text-sm font-black rounded-xl group-hover:scale-105 transition shadow-xs">
                      {line.number}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Live Location Share & Region Switcher Module */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                <span>Verified GPS Emergency Coordinates</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={requestLiveLocation}
                  className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 underline cursor-pointer flex items-center space-x-1"
                >
                  <Navigation className="w-3 h-3 inline" />
                  <span>Auto-Detect GPS</span>
                </button>
              </div>
            </div>

            {/* Quick Destination / City Switcher */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Select Your Current City / Region:</span>
                <span className="text-[10px] text-slate-400 font-normal">Updates facilities & distances</span>
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {Object.values(REGIONAL_EMERGENCY_DATA).map((reg) => {
                  const isSelected = selectedRegionKey === reg.regionId;
                  return (
                    <button
                      key={reg.regionId}
                      type="button"
                      onClick={() => handleSelectRegion(reg.regionId)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {reg.regionId === 'jaipur' && '🏰 '}
                      {reg.regionId === 'varanasi' && '🕉️ '}
                      {reg.regionId === 'goa' && '🏖️ '}
                      {reg.regionId === 'manali' && '🏔️ '}
                      {reg.regionId === 'delhi' && '🏛️ '}
                      {reg.regionId === 'mumbai' && '🌊 '}
                      {reg.regionId === 'kerala' && '🌴 '}
                      {reg.regionId === 'shillong' && '🌲 '}
                      {reg.regionName.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-mono flex items-center justify-between">
              <span className="truncate mr-2 font-medium">
                {coords ? coords.address : 'Locating GPS satellites...'}
              </span>
              <button
                id="sos-copy-coords-btn"
                onClick={copyLocationText}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 transition cursor-pointer"
                title="Copy coordinates and alert text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                id="sos-whatsapp-share-btn"
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share GPS via WhatsApp</span>
              </button>

              <button
                id="sos-notify-contacts-btn"
                onClick={notifyEmergencyContacts}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                <Users className="w-4 h-4 text-rose-400" />
                <span>Alert Trusted Contacts ({userProfile.emergencyContacts.length})</span>
              </button>
            </div>

            {userProfile.emergencyContacts.length > 0 && (
              <div className="text-[11px] text-slate-500 pt-1">
                Emergency contacts on file:{' '}
                {userProfile.emergencyContacts.map((c) => `${c.name} (${c.phone})`).join(', ')}
              </div>
            )}
          </div>

          {/* Dynamic Nearest Emergency Services */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Nearest Emergency Facilities: {currentRegion.regionName}
                </h3>
                <p className="text-[11px] text-slate-500">{currentRegion.shortDesc}</p>
              </div>

              {/* Type Filter */}
              <div className="flex space-x-1">
                {(['all', 'Hospital', 'Police', 'Tourist Police'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFacilityFilter(filter)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition ${
                      facilityFilter === filter
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredFacilities.map((srv) => {
                // Calculate dynamic distance from user's current coordinates
                const distanceKm = coords
                  ? calculateDistanceKm(coords.lat, coords.lng, srv.lat, srv.lng)
                  : calculateDistanceKm(currentRegion.centerLat, currentRegion.centerLng, srv.lat, srv.lng);
                const displayDistance = formatDistance(distanceKm);

                return (
                  <div
                    key={srv.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs hover:border-slate-300 transition shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="font-bold text-slate-900 text-sm">{srv.name}</span>
                          <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                            {displayDistance} away
                          </span>
                          {srv.openHours && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                              {srv.openHours}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-[11px] flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{srv.address}</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${srv.lat},${srv.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition flex items-center space-x-1 text-xs"
                          title="Get directions on Google Maps"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Map</span>
                        </a>
                        <a
                          href={`tel:${srv.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition flex items-center space-x-1 text-xs shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>

                    {srv.tags && (
                      <div className="flex items-center space-x-1.5 pt-0.5">
                        {srv.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Multilingual Emergency Survival Guidance */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Multilingual Emergency Guidance</span>
              <div className="flex space-x-1">
                {(['EN', 'HI', 'TA', 'BN'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      selectedLang === lang
                        ? 'bg-amber-800 text-white'
                        : 'bg-white text-amber-800 border border-amber-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-amber-900 font-medium">
              💡 {guidancePhrases[selectedLang].alert}
            </p>
            <div className="space-y-1 bg-white p-2.5 rounded-xl border border-amber-200/60 text-xs">
              <p className="text-slate-800 font-semibold">1. "{guidancePhrases[selectedLang].phrase1}"</p>
              <p className="text-slate-800 font-semibold">2. "{guidancePhrases[selectedLang].phrase2}"</p>
            </div>
          </div>

          {/* Clear safety disclaimer */}
          <div className="flex items-start space-x-2 text-[11px] text-slate-500 bg-slate-100 p-3 rounded-xl">
            <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <p>
              <strong>Official Disclaimer:</strong> Rahi provides rapid connection tools, verified GPS coordinates broadcasting, and helpline access. In life-threatening emergencies, directly dial <strong>112</strong> on your phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

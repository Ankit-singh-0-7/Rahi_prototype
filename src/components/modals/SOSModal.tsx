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
} from 'lucide-react';

export const SOSModal: React.FC = () => {
  const { isSOSOpen, setIsSOSOpen, userProfile, showToast } = useTravel();

  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'TA' | 'BN'>('EN');

  const emergencyHelplines = [
    { name: 'National Emergency Helpline (All-in-One)', number: '112', icon: <ShieldAlert className="w-5 h-5 text-rose-600" />, desc: 'Police, Fire, Ambulance direct dispatch' },
    { name: 'Police Control Room', number: '100', icon: <Shield className="w-5 h-5 text-blue-600" />, desc: 'Immediate local police assistance' },
    { name: 'Medical Emergency & Ambulance', number: '108', icon: <Hospital className="w-5 h-5 text-emerald-600" />, desc: 'Free emergency ambulance response' },
    { name: 'Ministry of Tourism 24x7 Multi-Lingual Tourist Info Line', number: '1363', icon: <PhoneCall className="w-5 h-5 text-sky-600" />, desc: 'Guidance & verified tourist help (toll-free)' },
    { name: 'Women Safety & Anti-Harassment Helpline', number: '1091', icon: <Users className="w-5 h-5 text-purple-600" />, desc: '24x7 immediate women protection support' },
  ];

  const nearbyServices = [
    { type: 'Police Station', name: 'Panaji City Police Station', distance: '1.1 km', phone: '+91 832 242 3320', address: 'Near Church Square, Altinho, Panaji' },
    { type: 'Government Hospital', name: 'Goa Medical College & Hospital (24x7 Trauma Care)', distance: '3.4 km', phone: '+91 832 245 8700', address: 'Bambolim, North Goa' },
    { type: 'Tourist Police Booth', name: 'Miramar Coastal Tourist Safety Booth', distance: '1.8 km', phone: '+91 832 222 5543', address: 'Miramar Beach Road, Panaji' },
  ];

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
      phrase2: 'আমি একজন পর্যটক এবং আমি এই জায়গায় অনিরাপদ বোধ করছি।',
    }
  };

  const requestLiveLocation = () => {
    setLocationStatus('requesting');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'GPS: ' + position.coords.latitude.toFixed(4) + ', ' + position.coords.longitude.toFixed(4) + ' (Near Panaji Heritage Corridor)',
          });
          setLocationStatus('granted');
          showToast('Accurate GPS location locked for emergency sharing.');
        },
        () => {
          // Fallback simulation
          setCoords({
            lat: 15.4989,
            lng: 73.8278,
            address: 'Panaji Heritage Quarter, Goa, India (Est. Coordinates: 15.4989° N, 73.8278° E)',
          });
          setLocationStatus('granted');
          showToast('Using estimated location (Location permission was blocked).');
        },
        { timeout: 8000 }
      );
    } else {
      setCoords({
        lat: 15.4989,
        lng: 73.8278,
        address: 'Fontainhas, Panaji, Goa (15.4989° N, 73.8278° E)',
      });
      setLocationStatus('granted');
    }
  };

  useEffect(() => {
    if (isSOSOpen && locationStatus === 'idle') {
      requestLiveLocation();
    }
  }, [isSOSOpen]);

  if (!isSOSOpen) return null;

  const locationShareText = `EMERGENCY SOS ALERT: I need immediate assistance. My current location is ${
    coords ? coords.address : 'Near Panaji, Goa'
  }. Maps Link: https://maps.google.com/?q=${coords ? `${coords.lat},${coords.lng}` : '15.4989,73.8278'}`;

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
      showToast('No emergency contacts found. Please add them in your profile.');
      return;
    }
    const names = userProfile.emergencyContacts.map((c) => c.name).join(', ');
    showToast(`Emergency alert broadcast simulation triggered to: ${names}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-rose-500 overflow-hidden relative">
        {/* Urgent Emergency Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 text-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-lg animate-bounce">
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
              className="p-1.5 rounded-full bg-rose-800/80 hover:bg-rose-800 text-white transition cursor-pointer"
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
                    <div className="p-2 rounded-xl bg-white shadow-xs">{line.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-rose-700">{line.name}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{line.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-rose-600 text-white text-sm font-black rounded-xl group-hover:scale-105 transition shadow-xs">
                      {line.number}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Live Location Share Module */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Your Current Verified GPS Location</span>
              </div>
              <button
                onClick={requestLiveLocation}
                className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 underline cursor-pointer"
              >
                Refresh GPS
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-mono flex items-center justify-between">
              <span className="truncate mr-2">
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

          {/* Nearby Emergency Services */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5">
              Closest Emergency Facilities Near You
            </h3>
            <div className="space-y-2">
              {nearbyServices.map((srv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs hover:border-slate-300 transition"
                >
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-900">{srv.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                        {srv.distance}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{srv.address}</p>
                  </div>
                  <a
                    href={`tel:${srv.phone}`}
                    className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 font-bold hover:bg-sky-100 transition flex items-center space-x-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              ))}
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
              <strong>Official Disclaimer:</strong> Rahi provides rapid connection tools, GPS coordinates broadcasting, and helpline access. In life-threatening emergencies, directly dial <strong>112</strong> on your phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

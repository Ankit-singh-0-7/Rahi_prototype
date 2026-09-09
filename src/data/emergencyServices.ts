export interface EmergencyServiceFacility {
  id: string;
  type: 'Police Station' | 'Government Hospital' | 'Tourist Police Booth' | 'Specialized Unit';
  name: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  openHours?: string;
  tags?: string[];
}

export interface RegionEmergencyData {
  regionId: string;
  regionName: string;
  state: string;
  centerLat: number;
  centerLng: number;
  shortDesc: string;
  facilities: EmergencyServiceFacility[];
}

export const REGIONAL_EMERGENCY_DATA: Record<string, RegionEmergencyData> = {
  jaipur: {
    regionId: 'jaipur',
    regionName: 'Jaipur (Pink City)',
    state: 'Rajasthan',
    centerLat: 26.9124,
    centerLng: 75.7873,
    shortDesc: 'Pink City heritage corridor, Amer Fort & old walled bazaar zone',
    facilities: [
      {
        id: 'jp-sms-hosp',
        type: 'Government Hospital',
        name: 'SMS Hospital (Sawai Man Singh Medical College 24x7 Trauma Centre)',
        phone: '+91 141 251 8224',
        address: 'JLN Marg, Ashok Nagar, Jaipur',
        lat: 26.8972,
        lng: 75.8152,
        openHours: '24x7 Open (Apex Level 1 Trauma)',
        tags: ['Emergency', 'ICU', 'Ambulance'],
      },
      {
        id: 'jp-comm-police',
        type: 'Police Station',
        name: 'Jaipur Police Commissionerate & MI Road Central Kotwali',
        phone: '+91 141 222 9311',
        address: 'Govt Hostel Crossing, MI Road, Jaipur',
        lat: 26.9192,
        lng: 75.8015,
        openHours: '24x7 Control Room',
        tags: ['Police', 'Rapid Response'],
      },
      {
        id: 'jp-tourist-police',
        type: 'Tourist Police Booth',
        name: 'Jaipur Tourist Police & Assistance Bureau (Hawa Mahal Post)',
        phone: '+91 141 260 0300',
        address: 'Opposite Hawa Mahal, Badi Chaupar, Old Walled City, Jaipur',
        lat: 26.9239,
        lng: 75.8267,
        openHours: '8:00 AM - 10:00 PM (Emergency Patrol 24x7)',
        tags: ['Tourist Help', 'Scam Protection'],
      },
      {
        id: 'jp-women-patrol',
        type: 'Specialized Unit',
        name: 'Nirbhaya Women Safety Rapid Patrol Unit',
        phone: '+91 141 274 4555',
        address: 'Jaipur Police Headquarters, Lal Kothi, Jaipur',
        lat: 26.8856,
        lng: 75.8031,
        openHours: '24x7 Emergency Patrol',
        tags: ['Women Safety', 'SOS Escort'],
      },
    ],
  },
  varanasi: {
    regionId: 'varanasi',
    regionName: 'Varanasi (Kashi)',
    state: 'Uttar Pradesh',
    centerLat: 25.3176,
    centerLng: 82.9739,
    shortDesc: 'Ganga Ghats, Kashi Vishwanath Corridor, Assi & Godowlia sector',
    facilities: [
      {
        id: 'vns-bhu-trauma',
        type: 'Government Hospital',
        name: 'Sir Sunderlal Hospital (BHU Apex Trauma Centre & 24x7 Emergency)',
        phone: '+91 542 236 9251',
        address: 'Banaras Hindu University Campus, Lanka, Varanasi',
        lat: 25.2758,
        lng: 82.9995,
        openHours: '24x7 Emergency Trauma Unit',
        tags: ['Trauma Center', 'ICU', 'Ambulance'],
      },
      {
        id: 'vns-dasha-police',
        type: 'Police Station',
        name: 'Dashashwamedh Ghat Police Station & Kashi Security Zone',
        phone: '+91 542 227 5555',
        address: 'Godowlia - Dashashwamedh Ghat Road, Varanasi',
        lat: 25.3094,
        lng: 83.0101,
        openHours: '24x7 Active Dispatch',
        tags: ['Police', 'Ghat Patrol'],
      },
      {
        id: 'vns-tourist-kiosk',
        type: 'Tourist Police Booth',
        name: 'Varanasi Ghats Tourist Police & Assistance Kiosk',
        phone: '+91 542 250 8033',
        address: 'Assi Ghat Promenade & Subah-e-Banaras Pavilion, Varanasi',
        lat: 25.2891,
        lng: 83.0068,
        openHours: '24x7 Tourist Assistance',
        tags: ['Tourist Facilitation', 'Boat Safety'],
      },
      {
        id: 'vns-river-police',
        type: 'Specialized Unit',
        name: 'Ganga River Police (Jal Police) Emergency Boat Rescue Station',
        phone: '+91 542 245 1200',
        address: 'Rajghat to Assi Ghat River Patrol Base, Varanasi',
        lat: 25.3125,
        lng: 83.0142,
        openHours: '24x7 Water Rescue & River Patrol',
        tags: ['Water Safety', 'River Rescue'],
      },
    ],
  },
  goa: {
    regionId: 'goa',
    regionName: 'Goa (Panaji & Coasts)',
    state: 'Goa',
    centerLat: 15.4989,
    centerLng: 73.8278,
    shortDesc: 'Panaji Latin Quarter, Miramar, Calangute, & coastal safety belt',
    facilities: [
      {
        id: 'goa-gmc-hosp',
        type: 'Government Hospital',
        name: 'Goa Medical College & Hospital (24x7 Apex Trauma Care)',
        phone: '+91 832 245 8700',
        address: 'Bambolim, North Goa',
        lat: 15.4636,
        lng: 73.8552,
        openHours: '24x7 Emergency & Trauma Care',
        tags: ['Trauma Ward', 'ICU', 'Helpline'],
      },
      {
        id: 'goa-panaji-police',
        type: 'Police Station',
        name: 'Panaji City Police Station',
        phone: '+91 832 242 3320',
        address: 'Near Church Square, Altinho, Panaji, Goa',
        lat: 15.4989,
        lng: 73.8278,
        openHours: '24x7 Control Room',
        tags: ['Police', 'City Patrol'],
      },
      {
        id: 'goa-miramar-tourist',
        type: 'Tourist Police Booth',
        name: 'Miramar Coastal Tourist Safety Booth',
        phone: '+91 832 222 5543',
        address: 'Miramar Beach Road, Panaji, Goa',
        lat: 15.4828,
        lng: 73.8078,
        openHours: '24x7 Coastal Tourist Safety',
        tags: ['Tourist Police', 'Beach Safety'],
      },
      {
        id: 'goa-calangute-post',
        type: 'Specialized Unit',
        name: 'North Goa Coastal Police & Lifeguard Command',
        phone: '+91 832 227 6185',
        address: 'Calangute - Baga Beach Road, North Goa',
        lat: 15.5439,
        lng: 73.7553,
        openHours: '24x7 Lifeguard & Coastal Security',
        tags: ['Lifeguard', 'Coastal Safety'],
      },
    ],
  },
  manali: {
    regionId: 'manali',
    regionName: 'Manali (Himachal Pradesh)',
    state: 'Himachal Pradesh',
    centerLat: 32.2396,
    centerLng: 77.1887,
    shortDesc: 'Old Manali, Mall Road, Solang Valley & mountain passes',
    facilities: [
      {
        id: 'manali-civil-hosp',
        type: 'Government Hospital',
        name: 'Civil Hospital Manali (24x7 Emergency Trauma Unit)',
        phone: '+91 1902 252 233',
        address: 'Hospital Road, Siyal, Manali, Himachal Pradesh',
        lat: 32.2415,
        lng: 77.1895,
        openHours: '24x7 Emergency & Altitude Sickness Ward',
        tags: ['High Altitude Care', 'Ambulance'],
      },
      {
        id: 'manali-police-stn',
        type: 'Police Station',
        name: 'Manali Police Station & Himalayan Rescue Base',
        phone: '+91 1902 252 322',
        address: 'Mall Road, Manali, Himachal Pradesh',
        lat: 32.2392,
        lng: 77.1882,
        openHours: '24x7 Mountain Search & Police Base',
        tags: ['Police', 'Mountain Rescue'],
      },
      {
        id: 'manali-tourist-help',
        type: 'Tourist Police Booth',
        name: 'Tourist Information & Safety Assistance Post',
        phone: '+91 1902 253 531',
        address: 'The Mall Square, Old Manali Crossing, Manali',
        lat: 32.2428,
        lng: 77.1874,
        openHours: '8:00 AM - 9:00 PM',
        tags: ['Tourist Info', 'Transit Help'],
      },
    ],
  },
  delhi: {
    regionId: 'delhi',
    regionName: 'Delhi / NCR',
    state: 'Delhi',
    centerLat: 28.6139,
    centerLng: 77.209,
    shortDesc: 'Connaught Place, New Delhi Railway Station, India Gate & Ring Road',
    facilities: [
      {
        id: 'delhi-aiims-trauma',
        type: 'Government Hospital',
        name: 'AIIMS (All India Institute of Medical Sciences) Jai Prakash Narayan Apex Trauma Centre',
        phone: '+91 11 2659 3677',
        address: 'Ring Road, Ansari Nagar East, New Delhi',
        lat: 28.5672,
        lng: 77.2100,
        openHours: '24x7 Apex National Level 1 Trauma Center',
        tags: ['Apex Trauma', 'Emergency ICU'],
      },
      {
        id: 'delhi-cp-police',
        type: 'Police Station',
        name: 'Connaught Place Police Station & Central Control',
        phone: '+91 11 2336 4100',
        address: 'Parliament Street, Connaught Place, New Delhi',
        lat: 28.6289,
        lng: 77.2155,
        openHours: '24x7 Delhi Police Dispatch',
        tags: ['Police', 'Emergency Patrol'],
      },
      {
        id: 'delhi-tourist-unit',
        type: 'Tourist Police Booth',
        name: 'Delhi Tourist Police Special Assistance Unit',
        phone: '+91 11 2331 4300',
        address: 'Janpath & Paharganj Tourist Police Booth, New Delhi',
        lat: 28.6255,
        lng: 77.2185,
        openHours: '24x7 Multilingual Assistance',
        tags: ['Tourist Police', 'Airport/Transit Guide'],
      },
    ],
  },
  mumbai: {
    regionId: 'mumbai',
    regionName: 'Mumbai (South & Coastal)',
    state: 'Maharashtra',
    centerLat: 18.922,
    centerLng: 72.8347,
    shortDesc: 'Colaba, Marine Drive, Fort, CST & South Mumbai tourism zone',
    facilities: [
      {
        id: 'mum-kem-hosp',
        type: 'Government Hospital',
        name: 'KEM Hospital & 24x7 Emergency Trauma Centre',
        phone: '+91 22 2410 7000',
        address: 'Acharya Donde Marg, Parel, Mumbai',
        lat: 19.0028,
        lng: 72.8428,
        openHours: '24x7 Emergency Services',
        tags: ['Trauma Center', 'Ambulance'],
      },
      {
        id: 'mum-colaba-police',
        type: 'Police Station',
        name: 'Colaba Police Station & Tourist Assistance Post',
        phone: '+91 22 2285 2885',
        address: 'Shahid Bhagat Singh Road, Colaba, Mumbai',
        lat: 18.9155,
        lng: 72.8285,
        openHours: '24x7 Rapid Police Dispatch',
        tags: ['Police', 'Tourist Patrol'],
      },
      {
        id: 'mum-gateway-kiosk',
        type: 'Tourist Police Booth',
        name: 'Marine Drive & Gateway of India Tourist Safety Booth',
        phone: '+91 22 2262 0111',
        address: 'Opposite Taj Mahal Palace, Apollo Bunder, Colaba, Mumbai',
        lat: 18.9218,
        lng: 72.8347,
        openHours: '24x7 Waterfront Safety',
        tags: ['Harbor Safety', 'Tourist Help'],
      },
    ],
  },
  kerala: {
    regionId: 'kerala',
    regionName: 'Kerala (Kochi & Backwaters)',
    state: 'Kerala',
    centerLat: 9.9656,
    centerLng: 76.2421,
    shortDesc: 'Fort Kochi, Mattancherry, Marine Drive & lagoon routes',
    facilities: [
      {
        id: 'ker-gen-hosp',
        type: 'Government Hospital',
        name: 'Ernakulam General Hospital (24x7 Emergency & Trauma Care)',
        phone: '+91 484 236 1251',
        address: 'Hospital Road, Marine Drive, Kochi, Kerala',
        lat: 9.9725,
        lng: 76.2825,
        openHours: '24x7 Emergency Hospital',
        tags: ['Emergency Care', 'Trauma Ward'],
      },
      {
        id: 'ker-kochi-police',
        type: 'Police Station',
        name: 'Fort Kochi Coastal Police Station',
        phone: '+91 484 221 6800',
        address: 'Calvathy Road, Fort Kochi, Kerala',
        lat: 9.9656,
        lng: 76.2421,
        openHours: '24x7 Coastal & Tourist Police',
        tags: ['Police', 'Coastal Security'],
      },
      {
        id: 'ker-tourist-kiosk',
        type: 'Tourist Police Booth',
        name: 'Fort Kochi Tourist Police Facilitation Kiosk',
        phone: '+91 484 221 5200',
        address: 'Vasco da Gama Square, Fort Kochi Beach, Kerala',
        lat: 9.9682,
        lng: 76.2405,
        openHours: '24x7 Tourist Support',
        tags: ['Tourist Info', 'Ferry Guidance'],
      },
    ],
  },
  shillong: {
    regionId: 'shillong',
    regionName: 'Shillong & Meghalaya',
    state: 'Meghalaya',
    centerLat: 25.5788,
    centerLng: 91.8933,
    shortDesc: 'Police Bazar, Ward’s Lake, Cherrapunji mountain trails',
    facilities: [
      {
        id: 'shl-neigrihms-hosp',
        type: 'Government Hospital',
        name: 'NEIGRIHMS Super Specialty Hospital & Apex Trauma Care',
        phone: '+91 364 253 8011',
        address: 'Mawdiangdiang, Shillong, Meghalaya',
        lat: 25.5895,
        lng: 91.9385,
        openHours: '24x7 Regional Apex Care',
        tags: ['Trauma Centre', 'Helicopter Evac'],
      },
      {
        id: 'shl-sadar-police',
        type: 'Police Station',
        name: 'Sadar Police Station',
        phone: '+91 364 222 4400',
        address: 'Police Bazar Central, Shillong, Meghalaya',
        lat: 25.5788,
        lng: 91.8845,
        openHours: '24x7 Central Control',
        tags: ['Police', 'Bazaar Patrol'],
      },
      {
        id: 'shl-tourist-booth',
        type: 'Tourist Police Booth',
        name: 'Meghalaya Tourist Assistance & Safety Bureau',
        phone: '+91 364 222 6220',
        address: 'Ward’s Lake Road, Shillong, Meghalaya',
        lat: 25.5742,
        lng: 91.8892,
        openHours: '8:30 AM - 8:00 PM',
        tags: ['Tourist Helpline', 'Hill Travel Info'],
      },
    ],
  },
};

/**
 * Calculates Great-Circle distance in kilometers using the Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Detects the nearest regional emergency hub based on user coordinates.
 */
export function detectNearestRegion(lat: number, lng: number): string {
  let closestRegion = 'jaipur';
  let minDistance = Infinity;

  Object.values(REGIONAL_EMERGENCY_DATA).forEach((region) => {
    const dist = calculateDistanceKm(lat, lng, region.centerLat, region.centerLng);
    if (dist < minDistance) {
      minDistance = dist;
      closestRegion = region.regionId;
    }
  });

  return closestRegion;
}

/**
 * Formats distance in km (e.g. "1.2 km" or "850 m")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

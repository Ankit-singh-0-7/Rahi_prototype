export type DestinationType =
  | 'popular'
  | 'hidden_gem'
  | 'nature'
  | 'culture'
  | 'adventure'
  | 'food'
  | 'family'
  | 'solo'
  | 'coastal'
  | 'mountain'
  | 'one_day';

export interface WeatherInfo {
  temp: number; // in Celsius
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Thunderstorm' | 'Misty' | 'Pleasant';
  rainProbability: number; // in percentage
  advisory?: string;
  airQuality: 'Good' | 'Moderate' | 'Poor';
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  tagline: string;
  description: string;
  image: string;
  gallery?: string[];
  rating: number;
  reviewsCount: number;
  budgetEstimate: number; // in INR per day/person
  bestSeason: string;
  peakSeasonMonths: string[];
  shoulderSeasonMonths: string[];
  offSeasonMonths: string[];
  seasonSavingsPercent: number;
  travelDurationHours: number;
  distanceKm: number;
  tags: string[];
  types: DestinationType[];
  isPopular: boolean;
  isHiddenGem: boolean;
  isOneDayTrip?: boolean;
  coordinates: { lat: number; lng: number };
  weather: WeatherInfo;
  topAttractions: string[];
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  type: 'Luxury Resort' | 'Boutique Hotel' | 'Eco-Lodge' | 'Heritage Haveli' | 'Homestay' | 'Backpacker Hostel';
  pricePerNight: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  facilities: string[];
  address: string;
  contact: { phone: string; email: string; website?: string };
  isHiddenStay: boolean;
  isRecommended: boolean;
  coordinates: { lat: number; lng: number };
  maxGroupSize: number;
}

export interface Restaurant {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  cuisine: string;
  dietary: ('Vegetarian' | 'Vegan' | 'Non-Veg' | 'Halal' | 'Jain Friendly')[];
  priceRange: '₹' | '₹₹' | '₹₹₹';
  avgCostForTwo: number;
  rating: number;
  reviewsCount: number;
  image: string;
  signatureDishes: string[];
  location: string;
  distanceKm: number;
  contact: { phone: string; email?: string };
  timings: string;
  isStreetFood: boolean;
  isLocalSpecialty: boolean;
  coordinates: { lat: number; lng: number };
}

export interface Attraction {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  category: 'famous' | 'hidden_gem' | 'cultural' | 'adventure' | 'nature';
  description: string;
  cost: number; // ticket/entry fee
  rating: number;
  reviewsCount: number;
  durationHours: number;
  bestTimeOfDay: 'Early Morning' | 'Morning' | 'Afternoon' | 'Sunset' | 'Night';
  image: string;
  openingHours: string;
  isCommunityDiscovered: boolean;
  coordinates: { lat: number; lng: number };
  weatherSuitability: 'all' | 'sunny_only' | 'indoor_friendly';
}

export interface EventFestival {
  id: string;
  title: string;
  destinationName: string;
  date: string;
  duration: string;
  description: string;
  image: string;
  category: 'Cultural' | 'Music & Dance' | 'Food & Wine' | 'Religious' | 'Seasonal Fair';
  relatedAttractions: string[];
  nearbyHotels: string[];
  isHappeningSoon: boolean;
  whyVisitNow: string;
}

export interface OfferDiscount {
  id: string;
  businessName: string;
  businessCategory: 'Hotels & Resorts' | 'Dining & Cafes' | 'Transport & Cabs' | 'Activities & Tours';
  title: string;
  discountPercent: number;
  promoCode: string;
  originalPrice: number;
  discountedPrice: number;
  validUntil: string;
  conditions: string;
  image: string;
  destinationName: string;
  dealType: 'Off-Season' | 'Weekday Special' | 'Group Deal' | 'Early Bird';
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge: 'Local Guide' | 'Explorer' | 'Backpacker' | 'Verified Traveller';
  destinationTag: string;
  businessTag?: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  isLiked?: boolean;
  comments: { id: string; author: string; avatar: string; text: string; date: string }[];
  date: string;
  category: 'travel_story' | 'hidden_gem' | 'photo' | 'review' | 'tip';
  rating?: number;
}

export interface IssueReport {
  id: string;
  location: string;
  coordinates: { lat: number; lng: number };
  issueType:
    | 'Garbage / Cleanliness'
    | 'Damaged Road / Access'
    | 'Broken Streetlights'
    | 'Unsafe / Dark Area'
    | 'Lack of Public Restrooms'
    | 'Damaged Heritage Infrastructure'
    | 'Missing Signboards / Scams'
    | 'Overcharging / Harassment';
  description: string;
  mediaUrl?: string;
  reportCount: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'Open' | 'Under Review' | 'Escalated to Authority' | 'Resolved';
  reportedAt: string;
  lastReportedAt: string;
  escalatedTo?: string;
}

export interface EnRouteStop {
  id: string;
  name: string;
  category: 'Food' | 'Rest' | 'Attractions' | 'Fuel/Useful' | 'Local Experience';
  distanceFromStartKm: number;
  detourMinutes: number;
  description: string;
  image: string;
  rating: number;
}

export interface DayItineraryItem {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  activityTitle: string;
  description: string;
  location: string;
  cost: number;
  weatherRecommendation?: string;
  category: 'sightseeing' | 'food' | 'relaxation' | 'adventure' | 'shopping';
}

export interface DayItinerary {
  day: number;
  date: string;
  title: string;
  items: DayItineraryItem[];
  stayName: string;
  stayCost: number;
  transportMode: string;
  transportCost: number;
  foodCost: number;
  activitiesCost: number;
  totalDayCost: number;
}

export interface TripPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  travellers: number;
  totalBudget: number;
  preferences: string[];
  transportMode: 'Flight' | 'Express Train' | 'AC Bus' | 'Self-Drive Cab';
  transportCost: number;
  outboundHours: number;
  returnHours: number;
  stayHours: number;
  totalDurationHours: number;
  selectedHotel: Hotel | null;
  days: DayItinerary[];
  enRouteStops: EnRouteStop[];
  totalCost: number;
  remainingBudget: number;
  status: 'Draft' | 'Saved' | 'Active';
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  avatar: string;
  password?: string;
  role: 'traveler' | 'host' | 'guide';
  bio: string;
  preferences: string[];
  preferredBudget: 'Budget (< ₹20k)' | 'Moderate (₹20k - ₹50k)' | 'Luxury (> ₹50k)';
  savedDestinationIds: string[];
  visitedDestinationIds: string[];
  bucketListIds: string[];
  emergencyContacts: { id: string; name: string; relation: string; phone: string }[];
  language: string;
  savedTrips: TripPlan[];
  activeTrip?: TripPlan;
  businessProfile?: BusinessProfile;
  createdAt: string;
  lastLoginAt: string;
}

export type AuthModalMode = 'login' | 'register' | 'switch';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  preferences: string[];
  preferredBudget: 'Budget (< ₹20k)' | 'Moderate (₹20k - ₹50k)' | 'Luxury (> ₹50k)';
  savedDestinationIds: string[];
  visitedDestinationIds: string[];
  bucketListIds: string[];
  emergencyContacts: { id: string; name: string; relation: string; phone: string }[];
  language: string;
}

export interface BusinessReservationRequest {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  dates: string;
  guestsCount: number;
  roomTypeOrTable: string;
  status: 'Pending' | 'Confirmed' | 'Declined';
  notes?: string;
  timestamp: string;
}

export interface BusinessEnquiry {
  id: string;
  senderName: string;
  senderPhone: string;
  message: string;
  timestamp: string;
  status: 'New' | 'Replied';
}

export interface BusinessProfile {
  id: string;
  name: string;
  category: 'Hotel' | 'Restaurant' | 'Tour Guide' | 'Transport';
  destination: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  services: string[];
  startingPrice: number;
  offers: OfferDiscount[];
  enquiries: BusinessEnquiry[];
  reservations: BusinessReservationRequest[];
}

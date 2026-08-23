import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Destination,
  Hotel,
  Restaurant,
  Attraction,
  EventFestival,
  OfferDiscount,
  CommunityPost,
  IssueReport,
  UserProfile,
  TripPlan,
  BusinessProfile,
  DayItinerary,
  DayItineraryItem,
  EnRouteStop,
} from '../types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_HOTELS,
  INITIAL_RESTAURANTS,
  INITIAL_ATTRACTIONS,
  INITIAL_EVENTS,
  INITIAL_OFFERS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_ISSUE_REPORTS,
  INITIAL_USER_PROFILE,
  INITIAL_BUSINESS_PROFILE,
  INITIAL_EN_ROUTE_STOPS,
} from '../data/sampleData';
import confetti from 'canvas-confetti';

export type ActiveTab =
  | 'home'
  | 'explore'
  | 'plan-trip'
  | 'hotels'
  | 'food'
  | 'attractions'
  | 'hidden-gems'
  | 'events'
  | 'community'
  | 'offers'
  | 'bucket-list'
  | 'safety'
  | 'business'
  | 'ai-assistant'
  | 'map'
  | 'profile'
  | 'dashboard';

interface TravelContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  destinations: Destination[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  attractions: Attraction[];
  events: EventFestival[];
  offers: OfferDiscount[];
  communityPosts: CommunityPost[];
  issueReports: IssueReport[];
  userProfile: UserProfile;
  businessProfile: BusinessProfile;
  activeTrip: TripPlan;
  savedTrips: TripPlan[];
  selectedDestination: Destination | null;
  setSelectedDestination: (dest: Destination | null) => void;
  selectedHotel: Hotel | null;
  setSelectedHotel: (hotel: Hotel | null) => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (rest: Restaurant | null) => void;
  
  // Modals state
  isSOSOpen: boolean;
  setIsSOSOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isTranslatorOpen: boolean;
  setIsTranslatorOpen: (open: boolean) => void;
  isReportIssueOpen: boolean;
  setIsReportIssueOpen: (open: boolean) => void;
  isEnquiryModalOpen: boolean;
  setIsEnquiryModalOpen: (open: boolean) => void;
  enquiryTarget: { name: string; type: 'hotel' | 'restaurant' | 'business'; phone?: string } | null;
  setEnquiryTarget: (target: { name: string; type: 'hotel' | 'restaurant' | 'business'; phone?: string } | null) => void;

  // Actions
  toggleSaveDestination: (id: string) => void;
  toggleBucketList: (id: string) => void;
  toggleVisited: (id: string) => void;
  likeCommunityPost: (postId: string) => void;
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'date'>) => void;
  addCommentToPost: (postId: string, commentText: string) => void;
  reportNewIssue: (location: string, issueType: IssueReport['issueType'], description: string, mediaUrl?: string) => void;
  saveCurrentTrip: () => void;
  updateTripPlan: (updatedPlan: Partial<TripPlan>) => void;
  addActivityToTrip: (dayIndex: number, item: DayItineraryItem) => void;
  removeActivityFromTrip: (dayIndex: number, itemId: string) => void;
  addEnRouteStop: (stop: EnRouteStop) => void;
  removeEnRouteStop: (stopId: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addBusinessEnquiry: (enquiry: { senderName: string; senderPhone: string; message: string }) => void;
  addBusinessReservation: (res: { guestName: string; guestPhone: string; guestEmail: string; dates: string; guestsCount: number; roomTypeOrTable: string; notes?: string }) => void;
  updateReservationStatus: (id: string, status: 'Confirmed' | 'Declined') => void;
  addNewOffer: (offer: Omit<OfferDiscount, 'id'>) => void;
  triggerCelebration: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [hotels, setHotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [attractions, setAttractions] = useState<Attraction[]>(INITIAL_ATTRACTIONS);
  const [events, setEvents] = useState<EventFestival[]>(INITIAL_EVENTS);
  const [offers, setOffers] = useState<OfferDiscount[]>(INITIAL_OFFERS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [issueReports, setIssueReports] = useState<IssueReport[]>(INITIAL_ISSUE_REPORTS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(INITIAL_BUSINESS_PROFILE);
  const [language, setLanguage] = useState<string>('English');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected items for modals
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Modals
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryTarget, setEnquiryTarget] = useState<{ name: string; type: 'hotel' | 'restaurant' | 'business'; phone?: string } | null>(null);

  // Default active trip
  const [activeTrip, setActiveTrip] = useState<TripPlan>({
    id: 'trip-active-1',
    destination: 'Goa',
    startDate: '2026-10-15',
    endDate: '2026-10-19',
    travellers: 2,
    totalBudget: 45000,
    preferences: ['Beaches', 'Heritage Culture', 'Local Seafood', 'Scenic Sunsets'],
    transportMode: 'Express Train',
    transportCost: 4800,
    outboundHours: 8,
    returnHours: 8,
    stayHours: 96,
    totalDurationHours: 112,
    selectedHotel: INITIAL_HOTELS[0],
    enRouteStops: [INITIAL_EN_ROUTE_STOPS[0]],
    totalCost: 38400,
    remainingBudget: 6600,
    status: 'Saved',
    days: [
      {
        day: 1,
        date: 'Day 1 (15 Oct)',
        title: 'Arrival, Heritage Check-in & Latin Quarter Walk',
        stayName: 'Heritage Portuguese Quinta Villa',
        stayCost: 3400,
        transportMode: 'Station Cab',
        transportCost: 800,
        foodCost: 1400,
        activitiesCost: 300,
        totalDayCost: 5900,
        items: [
          {
            id: 'item-1-1',
            timeSlot: 'Morning',
            activityTitle: 'Scenic Train Arrival & Check-in',
            description: 'Arrive at Madgaon junction, transfer to Fontainhas Latin quarter, refresh with tender coconut drink.',
            location: 'Panaji, Goa',
            cost: 400,
            category: 'relaxation',
          },
          {
            id: 'item-1-2',
            timeSlot: 'Afternoon',
            activityTitle: 'Fontainhas Pastel Heritage Walking Trail',
            description: 'Stroll through 18th-century cobblestone alleys, visit indie art galleries and heritage bakeries.',
            location: 'Fontainhas, Panaji',
            cost: 0,
            category: 'sightseeing',
          },
          {
            id: 'item-1-3',
            timeSlot: 'Evening',
            activityTitle: 'Dinner at Mum’s Kitchen Traditional Goan Cuisine',
            description: 'Savour Kingfish Recheado and traditional Goan Prawn Curry with red rice.',
            location: 'Panaji Promenade',
            cost: 950,
            category: 'food',
          }
        ]
      },
      {
        day: 2,
        date: 'Day 2 (16 Oct)',
        title: 'Hidden Beaches & Secluded Cliff Waterfall',
        stayName: 'Heritage Portuguese Quinta Villa',
        stayCost: 3400,
        transportMode: 'Electric Scooter Rental',
        transportCost: 600,
        foodCost: 1100,
        activitiesCost: 500,
        totalDayCost: 5600,
        items: [
          {
            id: 'item-2-1',
            timeSlot: 'Morning',
            activityTitle: 'Trek to Kakolem Secret Beach & Waterfall',
            description: 'Hike the quiet cliff trail down to a private golden sand cove where freshwater streams meet the sea.',
            location: 'Kakolem, South Goa',
            cost: 0,
            category: 'adventure',
          },
          {
            id: 'item-2-2',
            timeSlot: 'Afternoon',
            activityTitle: 'Lunch at Vinayak Family Fish Thali Stall',
            description: 'Feast on authentic local Rava fish fry, crab xec xec, and sol kadhi.',
            location: 'Assagao Village',
            cost: 450,
            category: 'food',
          },
          {
            id: 'item-2-3',
            timeSlot: 'Evening',
            activityTitle: 'Catamaran Sunset Sailing',
            description: 'Golden hour cruise with dolphin spotting and acoustic Konkani music.',
            location: 'Miramar Bay',
            cost: 500,
            category: 'relaxation',
          }
        ]
      },
      {
        day: 3,
        date: 'Day 3 (17 Oct)',
        title: 'Spice Plantation Walk & Dudhsagar Cascades',
        stayName: 'Heritage Portuguese Quinta Villa',
        stayCost: 3400,
        transportMode: 'Shared Tourist Cab',
        transportCost: 1200,
        foodCost: 1200,
        activitiesCost: 900,
        totalDayCost: 6700,
        items: [
          {
            id: 'item-3-1',
            timeSlot: 'Morning',
            activityTitle: 'Dudhsagar Jeep Safari & Rainforest Trek',
            description: 'Witness the milky 4-tier waterfall cascading through dense Western Ghats canopy.',
            location: 'Bhagwan Mahaveer Sanctuary',
            cost: 650,
            category: 'adventure',
          },
          {
            id: 'item-3-2',
            timeSlot: 'Afternoon',
            activityTitle: 'Organic Spice Farm Tour & Banana Leaf Buffet',
            description: 'Learn about cardamom, vanilla, and pepper cultivation followed by hot traditional village buffet.',
            location: 'Savoi Spice Plantation',
            cost: 250,
            category: 'food',
          },
          {
            id: 'item-3-3',
            timeSlot: 'Evening',
            activityTitle: 'Twilight Souvenir Shopping & Live Music',
            description: 'Handicrafts, cashew fenny tasting, and handcrafted Goan tiles.',
            location: 'Panaji Market',
            cost: 300,
            category: 'shopping',
          }
        ]
      }
    ]
  });

  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([activeTrip]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#059669', '#3b82f6', '#10b981'],
      });
    } catch {
      // ignore
    }
  };

  const toggleSaveDestination = (id: string) => {
    setUserProfile((prev) => {
      const exists = prev.savedDestinationIds.includes(id);
      const updated = exists
        ? prev.savedDestinationIds.filter((item) => item !== id)
        : [...prev.savedDestinationIds, id];
      showToast(exists ? 'Removed from saved places' : 'Saved to your travel wishlist!');
      if (!exists) triggerCelebration();
      return { ...prev, savedDestinationIds: updated };
    });
  };

  const toggleBucketList = (id: string) => {
    setUserProfile((prev) => {
      const exists = prev.bucketListIds.includes(id);
      const updated = exists
        ? prev.bucketListIds.filter((item) => item !== id)
        : [...prev.bucketListIds, id];
      showToast(exists ? 'Removed from Bucket List' : 'Added to your Bucket List!');
      if (!exists) triggerCelebration();
      return { ...prev, bucketListIds: updated };
    });
  };

  const toggleVisited = (id: string) => {
    setUserProfile((prev) => {
      const exists = prev.visitedDestinationIds.includes(id);
      const updated = exists
        ? prev.visitedDestinationIds.filter((item) => item !== id)
        : [...prev.visitedDestinationIds, id];
      showToast(exists ? 'Marked as unvisited' : 'Marked as Visited! Great milestone!');
      if (!exists) triggerCelebration();
      return { ...prev, visitedDestinationIds: updated };
    });
  };

  const likeCommunityPost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const addCommunityPost = (post: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'date'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      likes: 1,
      isLiked: true,
      comments: [],
      date: 'Just now',
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
    showToast('Your travel story has been published to the community feed!');
    triggerCelebration();
  };

  const addCommentToPost = (postId: string, commentText: string) => {
    if (!commentText || !commentText.trim()) return;
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: userProfile.name,
            avatar: userProfile.avatar,
            text: commentText.trim(),
            date: 'Just now',
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
    showToast('Comment posted!');
  };

  const reportNewIssue = (
    location: string,
    issueType: IssueReport['issueType'],
    description: string,
    mediaUrl?: string
  ) => {
    // Check if similar issue exists at the same location to group
    setIssueReports((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.location.toLowerCase().includes(location.toLowerCase()) && i.issueType === issueType
      );

      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const newCount = existing.reportCount + 1;
        let newPriority: IssueReport['priority'] = 'LOW';
        let newStatus: IssueReport['status'] = existing.status;

        if (newCount >= 10) {
          newPriority = 'CRITICAL';
          newStatus = 'Escalated to Authority';
        } else if (newCount >= 5) {
          newPriority = 'HIGH';
          newStatus = 'Escalated to Authority';
        } else if (newCount >= 3) {
          newPriority = 'MEDIUM';
          newStatus = 'Under Review';
        }

        const updated = [...prev];
        updated[existingIdx] = {
          ...existing,
          reportCount: newCount,
          priority: newPriority,
          status: newStatus,
          lastReportedAt: new Date().toISOString().split('T')[0],
          escalatedTo: newPriority === 'HIGH' || newPriority === 'CRITICAL' ? 'Regional Tourism & Municipal Board' : existing.escalatedTo,
        };
        showToast(`Report submitted! Grouped with ${newCount - 1} existing report(s). Priority escalated to ${newPriority}.`);
        return updated;
      } else {
        const newReport: IssueReport = {
          id: `issue-${Date.now()}`,
          location,
          coordinates: { lat: 15.2993 + (Math.random() - 0.5) * 0.1, lng: 74.124 + (Math.random() - 0.5) * 0.1 },
          issueType,
          description,
          mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
          reportCount: 1,
          priority: 'LOW',
          status: 'Open',
          reportedAt: new Date().toISOString().split('T')[0],
          lastReportedAt: new Date().toISOString().split('T')[0],
        };
        showToast('Your report has been submitted. Thank you for making tourism safer!');
        return [newReport, ...prev];
      }
    });
  };

  const updateTripPlan = (updatedPlan: Partial<TripPlan>) => {
    setActiveTrip((prev) => {
      const next = { ...prev, ...updatedPlan };
      // Recalculate total cost
      let daysCost = 0;
      if (next.days) {
        next.days.forEach((day) => {
          const itemsCost = day.items.reduce((sum, item) => sum + item.cost, 0);
          day.activitiesCost = itemsCost;
          day.totalDayCost = (day.stayCost || 0) + (day.transportCost || 0) + (day.foodCost || 0) + itemsCost;
          daysCost += day.totalDayCost;
        });
      }
      next.totalCost = (next.transportCost || 0) + daysCost;
      next.remainingBudget = (next.totalBudget || 0) - next.totalCost;
      return next;
    });
  };

  const addActivityToTrip = (dayIndex: number, item: DayItineraryItem) => {
    setActiveTrip((prev) => {
      const newDays = [...prev.days];
      if (newDays[dayIndex]) {
        newDays[dayIndex] = {
          ...newDays[dayIndex],
          items: [...newDays[dayIndex].items, item],
        };
      }
      const next = { ...prev, days: newDays };
      let daysCost = 0;
      next.days.forEach((day) => {
        const itemsCost = day.items.reduce((sum, i) => sum + i.cost, 0);
        day.activitiesCost = itemsCost;
        day.totalDayCost = (day.stayCost || 0) + (day.transportCost || 0) + (day.foodCost || 0) + itemsCost;
        daysCost += day.totalDayCost;
      });
      next.totalCost = (next.transportCost || 0) + daysCost;
      next.remainingBudget = (next.totalBudget || 0) - next.totalCost;
      showToast(`Added "${item.activityTitle}" to Day ${dayIndex + 1}!`);
      return next;
    });
  };

  const removeActivityFromTrip = (dayIndex: number, itemId: string) => {
    setActiveTrip((prev) => {
      const newDays = [...prev.days];
      if (newDays[dayIndex]) {
        newDays[dayIndex] = {
          ...newDays[dayIndex],
          items: newDays[dayIndex].items.filter((i) => i.id !== itemId),
        };
      }
      const next = { ...prev, days: newDays };
      let daysCost = 0;
      next.days.forEach((day) => {
        const itemsCost = day.items.reduce((sum, i) => sum + i.cost, 0);
        day.activitiesCost = itemsCost;
        day.totalDayCost = (day.stayCost || 0) + (day.transportCost || 0) + (day.foodCost || 0) + itemsCost;
        daysCost += day.totalDayCost;
      });
      next.totalCost = (next.transportCost || 0) + daysCost;
      next.remainingBudget = (next.totalBudget || 0) - next.totalCost;
      showToast('Activity removed from itinerary');
      return next;
    });
  };

  const addEnRouteStop = (stop: EnRouteStop) => {
    setActiveTrip((prev) => {
      if (prev.enRouteStops.some((s) => s.id === stop.id)) {
        showToast('Stop is already in your route plan');
        return prev;
      }
      showToast(`Added "${stop.name}" to your route stops!`);
      return { ...prev, enRouteStops: [...prev.enRouteStops, stop] };
    });
  };

  const removeEnRouteStop = (stopId: string) => {
    setActiveTrip((prev) => ({
      ...prev,
      enRouteStops: prev.enRouteStops.filter((s) => s.id !== stopId),
    }));
    showToast('En-route stop removed');
  };

  const saveCurrentTrip = () => {
    setSavedTrips((prev) => {
      const exists = prev.some((t) => t.id === activeTrip.id);
      if (exists) {
        return prev.map((t) => (t.id === activeTrip.id ? activeTrip : t));
      }
      return [...prev, activeTrip];
    });
    showToast('Trip itinerary saved to your profile!');
    triggerCelebration();
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
    showToast('Profile updated successfully!');
  };

  const addBusinessEnquiry = (enquiry: { senderName: string; senderPhone: string; message: string }) => {
    const newEnq = {
      id: `enq-${Date.now()}`,
      senderName: enquiry.senderName,
      senderPhone: enquiry.senderPhone,
      message: enquiry.message,
      timestamp: 'Just now',
      status: 'New' as const,
    };
    setBusinessProfile((prev) => ({
      ...prev,
      enquiries: [newEnq, ...prev.enquiries],
    }));
    showToast('Enquiry sent directly to the local business host!');
    triggerCelebration();
  };

  const addBusinessReservation = (res: {
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    dates: string;
    guestsCount: number;
    roomTypeOrTable: string;
    notes?: string;
  }) => {
    const newRes = {
      id: `res-${Date.now()}`,
      guestName: res.guestName,
      guestPhone: res.guestPhone,
      guestEmail: res.guestEmail,
      dates: res.dates,
      guestsCount: res.guestsCount,
      roomTypeOrTable: res.roomTypeOrTable,
      status: 'Pending' as const,
      notes: res.notes,
      timestamp: new Date().toISOString().split('T')[0],
    };
    setBusinessProfile((prev) => ({
      ...prev,
      reservations: [newRes, ...prev.reservations],
    }));
    showToast('Reservation request submitted! Business will contact you shortly.');
    triggerCelebration();
  };

  const updateReservationStatus = (id: string, status: 'Confirmed' | 'Declined') => {
    setBusinessProfile((prev) => ({
      ...prev,
      reservations: prev.reservations.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
    showToast(`Reservation marked as ${status}`);
  };

  const addNewOffer = (offer: Omit<OfferDiscount, 'id'>) => {
    const newOffer: OfferDiscount = {
      ...offer,
      id: `offer-${Date.now()}`,
    };
    setOffers((prev) => [newOffer, ...prev]);
    setBusinessProfile((prev) => ({
      ...prev,
      offers: [newOffer, ...prev.offers],
    }));
    showToast('New special promotion published!');
    triggerCelebration();
  };

  return (
    <TravelContext.Provider
      value={{
        activeTab,
        setActiveTab,
        destinations,
        hotels,
        restaurants,
        attractions,
        events,
        offers,
        communityPosts,
        issueReports,
        userProfile,
        businessProfile,
        activeTrip,
        savedTrips,
        selectedDestination,
        setSelectedDestination,
        selectedHotel,
        setSelectedHotel,
        selectedRestaurant,
        setSelectedRestaurant,
        isSOSOpen,
        setIsSOSOpen,
        isSearchOpen,
        setIsSearchOpen,
        isTranslatorOpen,
        setIsTranslatorOpen,
        isReportIssueOpen,
        setIsReportIssueOpen,
        isEnquiryModalOpen,
        setIsEnquiryModalOpen,
        enquiryTarget,
        setEnquiryTarget,
        toggleSaveDestination,
        toggleBucketList,
        toggleVisited,
        likeCommunityPost,
        addCommunityPost,
        addCommentToPost,
        reportNewIssue,
        saveCurrentTrip,
        updateTripPlan,
        addActivityToTrip,
        removeActivityFromTrip,
        addEnRouteStop,
        removeEnRouteStop,
        updateUserProfile,
        addBusinessEnquiry,
        addBusinessReservation,
        updateReservationStatus,
        addNewOffer,
        triggerCelebration,
        language,
        setLanguage,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};

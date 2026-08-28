import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  UserAccount,
  AuthModalMode,
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
  INITIAL_ACCOUNTS,
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

const STORAGE_ACCOUNTS_KEY = 'rahi_accounts_v2';
const STORAGE_CURRENT_USER_KEY = 'rahi_current_user_id_v2';

const GUEST_PROFILE: UserProfile = {
  name: 'Guest Explorer',
  email: 'guest@rahi.local',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  bio: 'Browsing in Guest Mode. Sign in or choose an account to save itineraries and sync your travel bucket list.',
  preferences: ['Hidden Gems', 'Nature & Mountains', 'Local Food'],
  preferredBudget: 'Moderate (₹20k - ₹50k)',
  savedDestinationIds: [],
  visitedDestinationIds: [],
  bucketListIds: [],
  emergencyContacts: [],
  language: 'English',
};

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
  
  // Accounts & Authentication
  accounts: UserAccount[];
  currentAccountId: string | null;
  currentUser: UserAccount | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthModalMode;
  setAuthModalMode: (mode: AuthModalMode) => void;
  openAuthModal: (mode?: AuthModalMode) => void;
  login: (identifier: string, password?: string) => boolean;
  register: (accountData: {
    name: string;
    email: string;
    role: 'traveler' | 'host' | 'guide';
    password?: string;
    preferences?: string[];
    bio?: string;
    preferredBudget?: UserAccount['preferredBudget'];
  }) => boolean;
  logout: () => void;
  switchAccount: (accountId: string) => boolean;
  deleteAccount: (accountId: string) => void;
  exportUserData: () => void;
  importUserData: (jsonString: string) => boolean;

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
  const [language, setLanguage] = useState<string>('English');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Accounts state
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACCOUNTS_KEY) || localStorage.getItem('safarsetu_accounts_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ACCOUNTS;
  });

  const [currentAccountId, setCurrentAccountId] = useState<string | null>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_CURRENT_USER_KEY) || localStorage.getItem('safarsetu_current_user_id_v2');
      if (savedId && savedId !== 'guest') return savedId;
      if (savedId === 'guest') return null;
    } catch {
      // fallback
    }
    return 'user-aarav';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('switch');

  const initialAccount = accounts.find((a) => a.id === currentAccountId) || accounts[0] || null;

  // Active user data states
  const [userProfile, setUserProfile] = useState<UserProfile>(
    initialAccount
      ? {
          name: initialAccount.name,
          email: initialAccount.email,
          avatar: initialAccount.avatar,
          bio: initialAccount.bio,
          preferences: initialAccount.preferences,
          preferredBudget: initialAccount.preferredBudget,
          savedDestinationIds: initialAccount.savedDestinationIds,
          visitedDestinationIds: initialAccount.visitedDestinationIds,
          bucketListIds: initialAccount.bucketListIds,
          emergencyContacts: initialAccount.emergencyContacts,
          language: initialAccount.language || 'English',
        }
      : GUEST_PROFILE
  );

  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(
    initialAccount?.businessProfile || INITIAL_BUSINESS_PROFILE
  );

  const defaultActiveTrip: TripPlan = {
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
          }
        ]
      }
    ]
  };

  const [activeTrip, setActiveTrip] = useState<TripPlan>(
    initialAccount?.activeTrip || initialAccount?.savedTrips?.[0] || defaultActiveTrip
  );

  const [savedTrips, setSavedTrips] = useState<TripPlan[]>(
    initialAccount?.savedTrips && initialAccount.savedTrips.length > 0
      ? initialAccount.savedTrips
      : [activeTrip]
  );

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

  const isInitialized = useRef(false);

  // Persist accounts array into localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to save accounts to localStorage', e);
    }
  }, [accounts]);

  // Sync active user state changes back into accounts array
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    if (!currentAccountId) return;

    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (acc.id === currentAccountId) {
          return {
            ...acc,
            name: userProfile.name,
            email: userProfile.email,
            avatar: userProfile.avatar,
            bio: userProfile.bio,
            preferences: userProfile.preferences,
            preferredBudget: userProfile.preferredBudget,
            savedDestinationIds: userProfile.savedDestinationIds,
            visitedDestinationIds: userProfile.visitedDestinationIds,
            bucketListIds: userProfile.bucketListIds,
            emergencyContacts: userProfile.emergencyContacts,
            language: userProfile.language,
            savedTrips,
            activeTrip,
            businessProfile: acc.role === 'host' ? businessProfile : acc.businessProfile,
            lastLoginAt: new Date().toISOString().split('T')[0],
          };
        }
        return acc;
      })
    );
  }, [userProfile, savedTrips, activeTrip, businessProfile, currentAccountId]);

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

  const currentUser = accounts.find((a) => a.id === currentAccountId) || null;
  const isLoggedIn = currentUser !== null;

  const openAuthModal = (mode: AuthModalMode = 'switch') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const switchAccount = (accountId: string) => {
    const target = accounts.find((a) => a.id === accountId);
    if (!target) {
      showToast('Account not found on this device.');
      return false;
    }

    setCurrentAccountId(target.id);
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, target.id);

    setUserProfile({
      name: target.name,
      email: target.email,
      avatar: target.avatar,
      bio: target.bio,
      preferences: target.preferences,
      preferredBudget: target.preferredBudget,
      savedDestinationIds: target.savedDestinationIds,
      visitedDestinationIds: target.visitedDestinationIds,
      bucketListIds: target.bucketListIds,
      emergencyContacts: target.emergencyContacts,
      language: target.language || 'English',
    });

    const userTrips = target.savedTrips || [];
    setSavedTrips(userTrips);
    if (target.activeTrip) {
      setActiveTrip(target.activeTrip);
    } else if (userTrips.length > 0) {
      setActiveTrip(userTrips[0]);
    }

    if (target.businessProfile) {
      setBusinessProfile(target.businessProfile);
    }

    setIsAuthModalOpen(false);
    triggerCelebration();
    showToast(`Switched to ${target.name} (${target.role === 'host' ? 'Homestay Host' : 'Traveler'}). All personal data loaded.`);
    return true;
  };

  const login = (identifier: string, password?: string) => {
    const q = identifier.trim().toLowerCase();
    const account = accounts.find(
      (a) => a.email.toLowerCase() === q || a.name.toLowerCase() === q || a.id === identifier
    );

    if (!account) {
      showToast('No local account found with that email or name. You can create a new profile in 1 click.');
      return false;
    }

    if (account.password && password && account.password !== password && password !== 'password123') {
      showToast('Incorrect password. (Tip: Demo accounts use password123)');
      return false;
    }

    return switchAccount(account.id);
  };

  const register = (accountData: {
    name: string;
    email: string;
    role: 'traveler' | 'host' | 'guide';
    password?: string;
    preferences?: string[];
    bio?: string;
    preferredBudget?: UserAccount['preferredBudget'];
  }) => {
    const existing = accounts.find(
      (a) => a.email.toLowerCase() === accountData.email.toLowerCase()
    );

    if (existing) {
      showToast('An account with this email already exists on this device. Switching to it.');
      return switchAccount(existing.id);
    }

    const newId = `user-${Date.now()}`;
    const newAccount: UserAccount = {
      id: newId,
      name: accountData.name,
      email: accountData.email,
      role: accountData.role,
      password: accountData.password || 'password123',
      avatar:
        accountData.role === 'host'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: accountData.bio || (accountData.role === 'host' ? 'Local homestay host & guide' : 'Curious explorer'),
      preferences: accountData.preferences || ['Hidden Gems', 'Nature & Mountains', 'Local Food'],
      preferredBudget: accountData.preferredBudget || 'Moderate (₹20k - ₹50k)',
      savedDestinationIds: [],
      visitedDestinationIds: [],
      bucketListIds: [],
      emergencyContacts: [],
      language: 'English',
      savedTrips: [],
      activeTrip: defaultActiveTrip,
      businessProfile: accountData.role === 'host' ? INITIAL_BUSINESS_PROFILE : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: new Date().toISOString().split('T')[0],
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    setCurrentAccountId(newId);
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, newId);

    setUserProfile({
      name: newAccount.name,
      email: newAccount.email,
      avatar: newAccount.avatar,
      bio: newAccount.bio,
      preferences: newAccount.preferences,
      preferredBudget: newAccount.preferredBudget,
      savedDestinationIds: [],
      visitedDestinationIds: [],
      bucketListIds: [],
      emergencyContacts: [],
      language: 'English',
    });

    setSavedTrips([]);
    setActiveTrip(defaultActiveTrip);

    if (newAccount.role === 'host') {
      setBusinessProfile(INITIAL_BUSINESS_PROFILE);
    }

    setIsAuthModalOpen(false);
    triggerCelebration();
    showToast(`Welcome to Rahi, ${newAccount.name}! Account created & stored locally.`);
    return true;
  };

  const logout = () => {
    setCurrentAccountId(null);
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, 'guest');
    setUserProfile(GUEST_PROFILE);
    setSavedTrips([]);
    showToast('Logged out to Guest Mode. Your local profile & trips are safely stored.');
  };

  const deleteAccount = (accountId: string) => {
    const updated = accounts.filter((a) => a.id !== accountId);
    setAccounts(updated);
    if (currentAccountId === accountId) {
      if (updated.length > 0) {
        switchAccount(updated[0].id);
      } else {
        logout();
      }
    }
    showToast('Account removed from local storage.');
  };

  const exportUserData = () => {
    try {
      const exportObject = {
        exportedAt: new Date().toISOString(),
        version: '2.0',
        accounts,
        currentAccountId,
        communityPosts: communityPosts.slice(0, 10),
        issueReports: issueReports.slice(0, 10),
      };
      const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonStr);
      downloadAnchor.setAttribute('download', `rahi-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerCelebration();
      showToast('Backup JSON downloaded successfully!');
    } catch {
      showToast('Could not export backup JSON.');
    }
  };

  const importUserData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.accounts) && parsed.accounts.length > 0) {
        setAccounts(parsed.accounts);
        if (parsed.currentAccountId) {
          switchAccount(parsed.currentAccountId);
        } else {
          switchAccount(parsed.accounts[0].id);
        }
        triggerCelebration();
        showToast('Backup successfully imported! All accounts and trips restored.');
        return true;
      } else {
        showToast('Invalid backup file structure.');
        return false;
      }
    } catch {
      showToast('Failed to parse backup JSON file.');
      return false;
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
        accounts,
        currentAccountId,
        currentUser,
        isLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        login,
        register,
        logout,
        switchAccount,
        deleteAccount,
        exportUserData,
        importUserData,
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

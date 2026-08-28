import React from 'react';
import { TravelProvider, useTravel, ActiveTab } from './context/TravelContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav, Toast } from './components/common/MobileBottomNav';

// Pages
import { Home } from './components/pages/Home';
import { Explore, HiddenGems } from './components/pages/Explore';
import { TripPlanner } from './components/pages/TripPlanner';
import { HotelsStays, FoodCulture } from './components/pages/HotelsStays';
import { AttractionsPage, OffersPage, EventsPage } from './components/pages/AttractionsPage';
import { CommunityFeed, SafetyCivicPortal } from './components/pages/CommunityFeed';
import { BusinessPortal, AIAssistantPage } from './components/pages/BusinessPortal';
import { DashboardProfile, BucketListPage } from './components/pages/DashboardProfile';

// Modals
import { SOSModal } from './components/modals/SOSModal';
import { ReportIssueModal } from './components/modals/ReportIssueModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { TranslatorModal } from './components/modals/TranslatorModal';
import { EnquiryReservationModal } from './components/modals/EnquiryReservationModal';
import { DestinationDetailModal } from './components/modals/DestinationDetailModal';
import { HotelDetailModal, RestaurantDetailModal } from './components/modals/HotelDetailModal';
import { AuthModal } from './components/modals/AuthModal';

const AppContent: React.FC = () => {
  const { activeTab } = useTravel();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'explore':
        return <Explore />;
      case 'hidden-gems':
        return <HiddenGems />;
      case 'plan-trip':
        return <TripPlanner />;
      case 'hotels':
        return <HotelsStays />;
      case 'food':
        return <FoodCulture />;
      case 'attractions':
        return <AttractionsPage />;
      case 'offers':
        return <OffersPage />;
      case 'events':
        return <EventsPage />;
      case 'community':
        return <CommunityFeed />;
      case 'safety':
        return <SafetyCivicPortal />;
      case 'business':
        return <BusinessPortal />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'profile':
      case 'dashboard':
        return <DashboardProfile />;
      case 'bucket-list':
        return <BucketListPage />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 w-full max-w-full overflow-x-hidden">
      {/* Top Main Navigation Bar */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1">
        {renderActiveTabContent()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Action & Bottom Bar */}
      <MobileBottomNav />

      {/* Real-Time Toast Notifications */}
      <Toast />

      {/* Global Interactive Modals */}
      <SOSModal />
      <ReportIssueModal />
      <GlobalSearchModal />
      <TranslatorModal />
      <EnquiryReservationModal />
      <DestinationDetailModal />
      <HotelDetailModal />
      <RestaurantDetailModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <AppContent />
    </TravelProvider>
  );
}

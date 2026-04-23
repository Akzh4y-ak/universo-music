import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomPlayer from '../player/BottomPlayer';
import QueuePanel from '../player/QueuePanel';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import { filterExplicitTracks } from '../utils/catalog';
import ScrollToTop from '../shared/ScrollToTop';
import NavigationProgressBar from '../shared/NavigationProgressBar';
import OnboardingOverlay from '../shared/OnboardingOverlay';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

const Layout = () => {
  const location = useLocation();
  useKeyboardShortcuts();

  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-base selection:bg-brand/30">
      {/* Global SPA Progress Indicator */}
      <NavigationProgressBar />
      
      {/* Scroll restoration logic */}
      <ScrollToTop />
      
      <div className="flex min-h-screen flex-1 overflow-hidden pb-44 md:pb-28">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex" />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile Headers and Side-scrolling Nav */}
          <MobileHeader />

          <main 
            id="main-content"
            className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-[linear-gradient(180deg,rgba(36,36,36,0.92)_0%,rgba(0,0,0,1)_24%)] px-4 pb-12 pt-6 md:px-8 scrollbar-thin scrollbar-thumb-white/10"
          >
            {/* 
                The key={location.pathname} is CRITICAL.
                It forces React to fully remount the page component on every navigation.
                This clears old search results, resets scroll, and ensures useEffects 
                re-run every time, fixing 'stuck' navigation bugs.
            */}
            <div 
              key={location.pathname} 
              className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Persistent Global Player */}
      <div className="fixed bottom-20 md:bottom-0 inset-x-0 z-[49] md:z-50">
        <BottomPlayer />
      </div>


      {/* Slide-out Queue Panel */}
      <QueuePanel />

      {/* Global Onboarding Selection */}
      <OnboardingOverlay />
    </div>
  );
};

export default Layout;

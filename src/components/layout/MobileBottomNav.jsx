import { Compass, Home, LibraryBig, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const mobileLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/library', label: 'Library', icon: LibraryBig },
];

const MobileBottomNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 border-t border-white/10 bg-bg-base/95 backdrop-blur-xl">
      <nav className="flex h-full items-center justify-around px-2">
        {mobileLinks.map(({ to, label, icon }) => {
          const ItemIcon = icon;

          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors ${
                  isActive
                    ? 'text-brand'
                    : 'text-text-muted hover:text-white'
                }`
              }
            >
              <ItemIcon className="h-6 w-6" />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;

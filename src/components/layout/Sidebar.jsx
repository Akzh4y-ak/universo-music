import { NavLink, Link } from 'react-router-dom';
import { Home, Compass, Heart, Clock, Search, Library, Music2, Disc3, SlidersHorizontal } from 'lucide-react';
import { featuredGenreIds, genres } from '../../data/genres';
import { getCatalogStatus } from '../../services/api';

const navSections = [
  {
    title: 'Discover',
    items: [
      { to: '/', icon: Home, label: 'Home' },
      { to: '/search', icon: Search, label: 'Search' },
      { to: '/trending', icon: Compass, label: 'Trending' },
    ],
  },
  {
    title: 'Your Library',
    items: [
      { to: '/liked', icon: Heart, label: 'Liked Songs' },
      { to: '/recent', icon: Clock, label: 'Recently Played' },
      { to: '/playlists', icon: Library, label: 'Playlists' },
      { to: '/now-playing', icon: Disc3, label: 'Now Playing' },
      { to: '/settings', icon: SlidersHorizontal, label: 'Settings' },
    ],
  },
];

const SidebarNavItem = ({ icon, label, to }) => {
  const ItemIcon = icon;

  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => 
        `flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-300 ${
          isActive
            ? 'bg-white/10 font-medium text-brand shadow-[inset_0_0_12px_rgba(30,215,96,0.1)]'
            : 'text-text-muted hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <ItemIcon className={`h-6 w-6 transition-colors ${isActive ? 'text-brand' : ''}`} />
          <span className="text-sm tracking-wide">{label}</span>
        </>
      )}
    </NavLink>
  );
};

const Sidebar = ({ className = '' }) => {
  const catalogStatus = getCatalogStatus();
  const featuredGenres = featuredGenreIds
    .map((genreId) => genres.find((genre) => genre.id === genreId))
    .filter(Boolean);

  return (
    <aside className={`w-64 h-full bg-bg-base flex flex-col border-r border-white/5 ${className}`}>
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 decoration-transparent">
          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center shadow-[0_0_15px_rgba(30,215,96,0.4)] transition-transform hover:scale-110">
            <Music2 className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Univerzo<span className="text-brand">Music</span></span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 px-3 pb-8 space-y-6">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-widest text-text-subdued opacity-60">
              {section.title}
            </p>
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.to}
                {...item}
              />
            ))}
          </div>
        ))}

        <div className="space-y-1">
          <div className="mb-3 flex items-center justify-between px-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-subdued opacity-60">Genres</p>
            <Link
              to="/search"
              className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-subdued transition-colors hover:text-white"
            >
              Search all
            </Link>
          </div>
          {featuredGenres.map((genre) => (
            <NavLink 
              key={genre.id}
              to={`/genre/${genre.id}`}
              className={({ isActive }) => 
                `flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'text-white bg-white/5' 
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className={`w-2 h-2 rounded-full ${genre.color} ${genre.color.replace('bg-', 'shadow-[0_0_8px_] shadow-')}`} />
              <span className="text-sm">{genre.title}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="m-3 rounded-2xl border border-white/8 bg-bg-highlight/40 p-4 backdrop-blur-md">
        <div className="space-y-2 text-xs text-text-subdued">
          <p className="font-semibold uppercase tracking-[0.24em] text-brand">Playback Layer</p>
          <p className="text-sm font-semibold text-white">{catalogStatus.label}</p>
          <p className="text-[11px] leading-5 opacity-80">{catalogStatus.summary}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

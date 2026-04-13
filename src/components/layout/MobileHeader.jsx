import { Music2 } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { featuredGenreIds, genres } from '../../data/genres';

const MobileHeader = () => {
  const featuredGenres = featuredGenreIds
    .slice(0, 6)
    .map((genreId) => genres.find((genre) => genre.id === genreId))
    .filter(Boolean);

  return (
    <div className="md:hidden sticky top-0 z-40 border-b border-white/8 bg-bg-base/90 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link to="/" className="flex items-center gap-3 decoration-transparent">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand shadow-[0_0_18px_rgba(30,215,96,0.35)]">
            <Music2 className="h-5 w-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">
              Univerzo<span className="text-brand">Music</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-text-subdued opacity-70">
              Premium Streamer
            </span>
          </div>
        </Link>
      </div>

      <div className="border-t border-white/8 px-4 pb-3 pt-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {featuredGenres.map((genre) => (
            <NavLink
              key={genre.id}
              to={`/genre/${genre.id}`}
              className={({ isActive }) =>
                `flex min-w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
                  isActive
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/8 bg-white/4 text-text-muted hover:border-white/15 hover:text-white'
                }`
              }
            >
              <span className={`h-2 w-2 rounded-full ${genre.color}`} />
              <span>{genre.title}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;

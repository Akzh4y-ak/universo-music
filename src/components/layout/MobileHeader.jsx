import { Music2 } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { featuredGenreIds, genres } from '../../data/genres';

const MobileHeader = () => {
  const featuredGenres = featuredGenreIds
    .slice(0, 6)
    .map((genreId) => genres.find((genre) => genre.id === genreId))
    .filter(Boolean);

  return (
    <div className="md:hidden sticky top-0 z-40 bg-bg-base/80 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 decoration-transparent">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand">
            <Music2 className="h-4 w-4 text-black" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Univerzo
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MobileHeader;

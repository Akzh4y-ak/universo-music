import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { usePlayer } from '../../context/player';

const HomeRecentsGrid = ({ items = [] }) => {
  const { playTrack } = usePlayer();

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {items.slice(0, 6).map((item, index) => (
        <div
          key={item.id || index}
          className="group relative flex items-center overflow-hidden rounded-md bg-white/5 transition-colors hover:bg-white/10 active:bg-white/15 shadow-sm"
        >
          <div className="h-12 w-12 flex-shrink-0 sm:h-14 sm:w-14">
            <img
              src={item.cover || item.image}
              alt={item.title}
              className="h-full w-full object-cover shadow-lg"
            />
          </div>
          
          <div className="flex flex-1 items-center justify-between gap-2 px-3">
            <p className="line-clamp-2 text-[11px] font-bold leading-tight text-white sm:text-xs">
              {item.title}
            </p>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (item.tracks) {
                    // It's a playlist/collection
                    playTrack(item.tracks[0], item.tracks, 0);
                } else {
                    // It's a single track
                    playTrack(item, [item], 0);
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand opacity-0 shadow-lg transition-all hover:scale-105 group-hover:opacity-100 active:scale-95 md:h-10 md:w-10"
            >
              <Play className="ml-0.5 h-4 w-4 fill-black text-black md:h-5 md:w-5" />
            </button>
          </div>
          
          <Link to={item.tracks ? `/playlist/${item.id}` : `/now-playing`} className="absolute inset-0" />
        </div>
      ))}
    </div>
  );
};

export default HomeRecentsGrid;

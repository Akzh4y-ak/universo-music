import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { usePlayer } from '../../context/player';
import { motion } from 'framer-motion';

const MotionCard = motion.div;

const PlaylistCard = memo(({ playlist }) => {
  const { playTrack } = usePlayer();

  const handlePlay = (e) => {
    e.preventDefault();
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks, 0);
    }
  };

  return (
    <Link to={`/playlist/${playlist.id}`}>
      <MotionCard
        whileHover={{ y: -4 }}
        className="group relative cursor-pointer rounded-2xl bg-bg-elevated/45 p-4 transition-colors hover:bg-bg-elevated"
      >
        <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-bg-highlight shadow-lg">
          <img 
            src={playlist.cover} 
            alt={playlist.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          <div className="absolute bottom-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button 
              onClick={handlePlay}
              className="w-12 h-12 bg-brand rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform hover:bg-brand-hover"
            >
              <Play className="w-5 h-5 fill-black text-black ml-1" />
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="mb-1 text-base font-semibold text-white text-truncate-1">
            {playlist.title}
          </h3>
          <p className="text-sm text-text-subdued text-truncate-2">
            {playlist.description}
          </p>
        </div>
      </MotionCard>
    </Link>
  );
});

export default PlaylistCard;

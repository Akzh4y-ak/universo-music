import { Heart, Play } from 'lucide-react';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import TrackCard from '../components/shared/TrackCard';
import TrackGrid from '../components/shared/TrackGrid';
import { useMusic } from '../context/music';
import { usePlayer } from '../context/player';
import { filterExplicitTracks } from '../utils/catalog';

const LikedSongs = () => {
  const { likedSongs, preferences } = useMusic();
  const { playTrack } = usePlayer();

  const visibleLikedSongs = useMemo(() => {
    return filterExplicitTracks(likedSongs, preferences.allowExplicit);
  }, [likedSongs, preferences.allowExplicit]);

  const handlePlayAll = () => {
    if (visibleLikedSongs.length > 0) {
      playTrack(visibleLikedSongs[0], visibleLikedSongs, 0);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Helmet>
        <title>Liked Songs - Univerzo Music</title>
      </Helmet>

      <div className="flex flex-col md:flex-row items-end gap-6 pt-10 pb-6 border-b border-white/10">
        <div className="w-52 h-52 bg-gradient-to-br from-indigo-500 to-purple-800 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-center rounded-md">
           <Heart className="w-20 h-20 text-white fill-white" />
        </div>
        <div className="flex flex-col gap-3">
          <span className="uppercase text-xs font-bold tracking-widest text-text-subdued">Playlist</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">Liked Songs</h1>
          <div className="flex items-center gap-2 text-sm text-text-subdued font-medium mt-1">
            <Link to="/" className="text-white transition-colors hover:text-brand">
              Univerzo
            </Link>
            <span>|</span>
            <span>{visibleLikedSongs.length} songs</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <button 
          onClick={handlePlayAll}
          disabled={visibleLikedSongs.length === 0}
          className="w-14 h-14 bg-brand rounded-full flex items-center justify-center hover:scale-105 transition-transform hover:bg-brand-hover shadow-lg disabled:opacity-50 disabled:hover:scale-100"
        >
          <Play className="w-6 h-6 fill-black text-black ml-1" />
        </button>
      </div>

      <section>
        {visibleLikedSongs.length > 0 ? (
          <TrackGrid>
            {visibleLikedSongs.map((track, i) => (
              <TrackCard key={`liked-${track.id}-${i}`} track={track} queueContext={visibleLikedSongs} queueIndex={i} />
            ))}
          </TrackGrid>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {likedSongs.length > 0 && !preferences.allowExplicit
                ? 'Your liked songs are filtered right now'
                : 'Songs you like will appear here'}
            </h2>
            <p className="text-text-subdued">
              {likedSongs.length > 0 && !preferences.allowExplicit
                ? 'Turn explicit content back on in Settings to see the hidden tracks.'
                : 'Save songs by tapping the heart icon.'}
            </p>
            <Link
              to={likedSongs.length > 0 && !preferences.allowExplicit ? '/settings' : '/search'}
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              {likedSongs.length > 0 && !preferences.allowExplicit ? 'Open settings' : 'Find tracks'}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default LikedSongs;

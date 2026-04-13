import { Clock } from 'lucide-react';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import TrackCard from '../components/shared/TrackCard';
import TrackGrid from '../components/shared/TrackGrid';
import { useMusic } from '../context/music';
import { filterExplicitTracks } from '../utils/catalog';

const RecentPlays = () => {
  const { recentPlays, preferences } = useMusic();

  const visibleRecentPlays = useMemo(() => {
    return filterExplicitTracks(recentPlays, preferences.allowExplicit);
  }, [preferences.allowExplicit, recentPlays]);

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Helmet>
        <title>Recently Played - Univerzo Music</title>
      </Helmet>

      <div className="flex flex-col md:flex-row items-end gap-6 pt-10 pb-6 border-b border-white/10">
        <div className="w-52 h-52 bg-bg-elevated shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-center rounded-md border border-white/5">
           <Clock className="w-20 h-20 text-white" />
        </div>
        <div className="flex flex-col gap-3">
          <span className="uppercase text-xs font-bold tracking-widest text-text-subdued">History</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">Recently Played</h1>
          <div className="flex items-center gap-2 text-sm text-text-subdued font-medium mt-1">
            <Link to="/" className="text-white transition-colors hover:text-brand">
              Univerzo
            </Link>
            <span>|</span>
            <span>{visibleRecentPlays.length} songs</span>
          </div>
        </div>
      </div>

      <section className="pt-4">
        {visibleRecentPlays.length > 0 ? (
          <TrackGrid>
            {visibleRecentPlays.map((track, i) => (
              <TrackCard key={`recent-${track.id}-${i}`} track={track} queueContext={visibleRecentPlays} queueIndex={i} />
            ))}
          </TrackGrid>
        ) : (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {recentPlays.length > 0 && !preferences.allowExplicit
                ? 'Your recent plays are filtered right now'
                : 'No listening history yet'}
            </h2>
            <p className="text-text-subdued">
              {recentPlays.length > 0 && !preferences.allowExplicit
                ? 'Turn explicit content back on in Settings to reveal the hidden tracks.'
                : 'Play some music to see it here.'}
            </p>
            <Link
              to={recentPlays.length > 0 && !preferences.allowExplicit ? '/settings' : '/trending'}
              className="mt-6 inline-flex rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {recentPlays.length > 0 && !preferences.allowExplicit ? 'Open settings' : 'Explore trending tracks'}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default RecentPlays;

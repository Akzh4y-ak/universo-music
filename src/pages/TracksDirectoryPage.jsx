import { useEffect, useState } from 'react';
import { Music4 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import { getInitialSeoSnapshot, loadSeoSnapshot } from '../services/seoSnapshot';

const TracksDirectoryPage = () => {
  const initialTracks = getInitialSeoSnapshot().tracks;
  const [tracks, setTracks] = useState(initialTracks);
  const [loading, setLoading] = useState(initialTracks.length === 0);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    loadSeoSnapshot()
      .then((snapshot) => {
        if (!cancelled) {
          setTracks(snapshot.tracks || []);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError.message || 'Unable to load the track directory right now.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Seo
        title="Top Tracks | Univerzo Music"
        description="Browse featured public track pages discovered from the Univerzo Music catalog."
        path="/tracks"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Tracks', path: '/tracks' },
        ]}
      />

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(30,215,96,0.2),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.02))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            <Music4 className="h-4 w-4" />
            <span>Track Directory</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Songs that deserve their own landing pages.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-text-muted md:text-lg">
            Explore public song pages with direct links into artist and album routes so search engines can
            crawl more than a single homepage.
          </p>
        </div>
      </section>

      {error ? (
        <CatalogFeedback
          tone="error"
          title="Track directory unavailable"
          message={error}
          actionLabel="Open home"
          actionTo="/"
        />
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="h-36 rounded-3xl border border-white/8 bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <CatalogFeedback
          title="No tracks available"
          message="The public track directory is still being prepared."
          actionLabel="Open trending"
          actionTo="/trending"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <Link
              key={track.id}
              to={`/track/${track.id}`}
              className="group flex gap-4 rounded-[28px] border border-white/8 bg-white/4 p-4 transition-colors hover:bg-white/7"
            >
              <img src={track.cover} alt={track.title} className="h-24 w-24 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-lg font-bold text-white group-hover:text-brand text-truncate-2">
                  {track.title}
                </h2>
                <p className="text-sm font-semibold text-text-subdued">{track.artist}</p>
                <p className="text-sm leading-6 text-text-muted text-truncate-2">{track.summary}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-subdued">
                  {track.durationLabel || 'Track'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TracksDirectoryPage;

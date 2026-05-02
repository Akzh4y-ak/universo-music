import { useEffect, useState } from 'react';
import { Mic2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import { getInitialSeoSnapshot, loadSeoSnapshot } from '../services/seoSnapshot';

const ArtistsDirectoryPage = () => {
  const initialArtists = getInitialSeoSnapshot().artists;
  const [artists, setArtists] = useState(initialArtists);
  const [loading, setLoading] = useState(initialArtists.length === 0);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    loadSeoSnapshot()
      .then((snapshot) => {
        if (!cancelled) {
          setArtists(snapshot.artists || []);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError.message || 'Unable to load the artist directory right now.');
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
        title="Top Artists | Univerzo Music"
        description="Browse featured artists discovered from the Univerzo Music catalog."
        path="/artists"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Artists', path: '/artists' },
        ]}
      />

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(30,215,96,0.2),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.02))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            <Mic2 className="h-4 w-4" />
            <span>Artist Directory</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Artists people can discover and replay.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-text-muted md:text-lg">
            Public artist pages built from high-signal catalog entries so visitors can move deeper into
            songs, albums, and related music paths.
          </p>
        </div>
      </section>

      {error ? (
        <CatalogFeedback
          tone="error"
          title="Artist directory unavailable"
          message={error}
          actionLabel="Open home"
          actionTo="/"
        />
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="h-40 rounded-3xl border border-white/8 bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : artists.length === 0 ? (
        <CatalogFeedback
          title="No artists available"
          message="The public artist directory is still being prepared."
          actionLabel="Open trending"
          actionTo="/trending"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              to={`/artist/${artist.slug}`}
              className="group overflow-hidden rounded-[28px] border border-white/8 bg-white/4 transition-colors hover:bg-white/7"
            >
              <img src={artist.image} alt={artist.name} className="aspect-[4/3] w-full object-cover" />
              <div className="space-y-3 p-5">
                <h2 className="text-xl font-bold text-white group-hover:text-brand">{artist.name}</h2>
                <p className="text-sm leading-6 text-text-muted">{artist.summary}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-subdued">
                  {artist.trackCount} highlighted tracks
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistsDirectoryPage;

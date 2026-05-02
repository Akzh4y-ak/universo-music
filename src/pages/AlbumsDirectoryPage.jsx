import { useEffect, useState } from 'react';
import { Disc3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import { getInitialSeoSnapshot, loadSeoSnapshot } from '../services/seoSnapshot';

const AlbumsDirectoryPage = () => {
  const initialAlbums = getInitialSeoSnapshot().albums;
  const [albums, setAlbums] = useState(initialAlbums);
  const [loading, setLoading] = useState(initialAlbums.length === 0);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    loadSeoSnapshot()
      .then((snapshot) => {
        if (!cancelled) {
          setAlbums(snapshot.albums || []);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError.message || 'Unable to load the album directory right now.');
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
        title="Top Albums | Univerzo Music"
        description="Browse featured albums and collections discovered from the Univerzo Music catalog."
        path="/albums"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Albums', path: '/albums' },
        ]}
      />

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(30,215,96,0.2),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.02))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            <Disc3 className="h-4 w-4" />
            <span>Album Directory</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Albums and collections worth opening.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-text-muted md:text-lg">
            Public album pages let search engines and listeners reach collections directly instead of only
            landing on single tracks.
          </p>
        </div>
      </section>

      {error ? (
        <CatalogFeedback
          tone="error"
          title="Album directory unavailable"
          message={error}
          actionLabel="Open home"
          actionTo="/"
        />
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="h-64 rounded-3xl border border-white/8 bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <CatalogFeedback
          title="No albums available"
          message="The public album directory is still being prepared."
          actionLabel="Open trending"
          actionTo="/trending"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {albums.map((album) => (
            <Link
              key={album.slug}
              to={`/album/${album.slug}`}
              className="group overflow-hidden rounded-[28px] border border-white/8 bg-white/4 transition-colors hover:bg-white/7"
            >
              <img src={album.cover} alt={album.title} className="aspect-square w-full object-cover" />
              <div className="space-y-3 p-5">
                <h2 className="text-lg font-bold text-white group-hover:text-brand">{album.title}</h2>
                <p className="text-sm font-semibold text-text-subdued">{album.artist}</p>
                <p className="text-sm leading-6 text-text-muted">{album.summary}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-subdued">
                  {album.trackCount} sample tracks
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumsDirectoryPage;

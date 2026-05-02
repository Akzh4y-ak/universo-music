import { useEffect, useMemo, useState } from 'react';
import { Disc3, Play } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import Seo from '../components/seo/Seo';
import SkeletonCard from '../components/shared/SkeletonCard';
import TrackCard from '../components/shared/TrackCard';
import TrackGrid from '../components/shared/TrackGrid';
import { useMusic } from '../context/music';
import { usePlayer } from '../context/player';
import { searchTracks } from '../services/api';
import { getInitialArtist, getInitialRouteTracks } from '../services/seoSnapshot';
import { filterExplicitTracks } from '../utils/catalog';
import { getTrackArtistImage, getTrackArtistSlug, unslugifyValue } from '../utils/musicMeta';
import { buildCanonicalUrl, buildBreadcrumbStructuredData } from '../utils/seo';
import { buildArtistSchema } from '../utils/musicSchema';

const ArtistPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { preferences } = useMusic();
  const { playTrack } = usePlayer();
  const initialArtist = useMemo(() => getInitialArtist(slug), [slug]);
  const initialTracks = useMemo(() => {
    return getInitialRouteTracks().filter((track) => getTrackArtistSlug(track) === slug);
  }, [slug]);
  const [tracks, setTracks] = useState(initialTracks);
  const [loading, setLoading] = useState(initialTracks.length === 0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialTracks.length >= 20);
  const [error, setError] = useState('');

  const seedTrack = location.state?.seedTrack || null;
  const hasBootstrapTracks = initialTracks.length > 0;
  const artistName = initialArtist?.name || location.state?.artistName || seedTrack?.artist || unslugifyValue(slug || '');
  const artistSummary = initialArtist?.summary || `Listen to songs, explore releases, and start playback from the ${artistName} catalog on Univerzo Music.`;

  useEffect(() => {
    setTracks(initialTracks);
    setLoading(initialTracks.length === 0);
    setLoadingMore(false);
    setPage(0);
    setHasMore(initialTracks.length >= 20);
    setError('');
  }, [initialTracks]);

  useEffect(() => {
    let cancelled = false;

    const fetchArtist = async () => {
      setLoading(!hasBootstrapTracks);
      setError('');
      setPage(0);
      setHasMore(hasBootstrapTracks ? initialTracks.length >= 20 : true);

      try {
        const results = await searchTracks(artistName, 50, 0);
        const directMatches = results.filter((track) => getTrackArtistSlug(track) === slug);

        if (cancelled) {
          return;
        }

        const finalResults = directMatches.length > 0 ? directMatches : results;
        if (finalResults.length > 0 || !hasBootstrapTracks) {
          setTracks(finalResults);
        }
        setHasMore(finalResults.length >= 20);
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        if (!hasBootstrapTracks) {
          setTracks([]);
          setError(nextError.message || 'Unable to load this artist right now.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchArtist();

    return () => {
      cancelled = true;
    };
  }, [artistName, hasBootstrapTracks, initialTracks.length, slug]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || !artistName) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const results = await searchTracks(artistName, 50, nextPage);
      const directMatches = results.filter((track) => getTrackArtistSlug(track) === slug);
      const finalResults = directMatches.length > 0 ? directMatches : results;
      
      if (finalResults.length === 0) {
        setHasMore(false);
      } else {
        setTracks((previous) => {
          const seenTrackIds = new Set(previous.map((track) => track.id));
          return [...previous, ...finalResults.filter((track) => !seenTrackIds.has(track.id))];
        });
        setPage(nextPage);
        setHasMore(finalResults.length >= 20);
      }
    } catch (err) {
      console.error('Artist load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const heroImage = useMemo(() => {
    return initialArtist?.image || getTrackArtistImage(seedTrack) || getTrackArtistImage(tracks[0]) || seedTrack?.cover || tracks[0]?.cover || '';
  }, [initialArtist?.image, seedTrack, tracks]);

  const visibleTracks = useMemo(() => {
    return filterExplicitTracks(tracks, preferences.allowExplicit);
  }, [preferences.allowExplicit, tracks]);

  const handlePlay = () => {
    if (visibleTracks.length > 0) {
      playTrack(visibleTracks[0], visibleTracks, 0);
    }
  };

  const renderSkeletons = () => (
    <TrackGrid>
      {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
    </TrackGrid>
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Seo
        title={`${artistName} | Artist Page on Univerzo Music`}
        description={artistSummary}
        path={`/artist/${slug}`}
        image={heroImage}
        type="profile"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: artistName, path: `/artist/${slug}` },
        ]}
        structuredData={buildArtistSchema({
          artistName: artistName,
          url: buildCanonicalUrl(`/artist/${slug}`),
          image: heroImage,
          description: artistSummary,
        })}
      />


      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(30,215,96,0.2),transparent_38%)]" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end">
          <div className="h-52 w-52 overflow-hidden rounded-[28px] border border-white/10 bg-white/6 shadow-2xl">
            {heroImage ? (
              <img src={heroImage} alt={artistName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-brand">
                <Disc3 className="h-14 w-14" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand">Artist</p>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">{artistName}</h1>
            <p className="max-w-2xl text-sm text-text-subdued sm:text-base">
              {artistSummary}
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePlay}
                disabled={tracks.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] hover:bg-brand-hover disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-black" />
                Play artist
              </button>
              <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-text-subdued">
                {visibleTracks.length} tracks loaded
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Popular</h2>
          <p className="text-sm text-text-subdued">The strongest matches we found for this artist.</p>
        </div>

        {loading ? renderSkeletons() : error ? (
          <CatalogFeedback
            tone="error"
            title="Artist page unavailable"
            message={error}
            actionLabel="Open search"
            actionTo="/search"
          />
        ) : visibleTracks.length === 0 ? (
          <CatalogFeedback
            title="No artist tracks found"
            message={tracks.length > 0 && !preferences.allowExplicit
              ? 'Artist matches were found, but they are hidden by your explicit-content setting.'
              : 'We could not find a usable result set for this artist in the live catalog.'}
            actionLabel={tracks.length > 0 && !preferences.allowExplicit ? 'Open settings' : 'Search tracks'}
            actionTo={tracks.length > 0 && !preferences.allowExplicit ? '/settings' : '/search'}
          />
        ) : (
          <>
            <TrackGrid>
              {visibleTracks.map((track, index) => (
                <TrackCard key={`${track.id}-${index}`} track={track} queueContext={visibleTracks} queueIndex={index} />
              ))}
            </TrackGrid>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-white/5 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
                >
                  <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  {loadingMore ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  ) : null}
                  <span>{loadingMore ? 'Fetching more...' : 'More from artist'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ArtistPage;

import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import TrackGrid from '../components/shared/TrackGrid';
import { getGenreById, genres } from '../data/genres';
import { useMusic } from '../context/music';
import { getDiscoveryTracks } from '../services/api';
import TrackCard from '../components/shared/TrackCard';
import SkeletonCard from '../components/shared/SkeletonCard';
import { filterExplicitTracks } from '../utils/catalog';

const GenrePage = () => {
  const { id } = useParams();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const { preferences } = useMusic();
  
  const genre = getGenreById(id) || genres[0];
  const genreDiscoveryKey = genre.id || genre.query || genre.title;
  
  useEffect(() => {
    let cancelled = false;

    const fetchGenre = async () => {
      setLoading(true);
      setError('');
      setPage(0);
      setHasMore(true);

      try {
        const results = await getDiscoveryTracks(genreDiscoveryKey, 50, 0);

        if (cancelled) {
          return;
        }

        setTracks(results);
        if (results.length < 20) {
          setHasMore(false);
        }
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setTracks([]);
        setError(nextError.message || 'Unable to load this genre right now.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchGenre();

    return () => {
      cancelled = true;
    };
  }, [genre.id, genre.title, genreDiscoveryKey]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const results = await getDiscoveryTracks(genreDiscoveryKey, 50, nextPage);
      
      if (results.length === 0) {
        setHasMore(false);
      } else {
        setTracks(prev => [...prev, ...results]);
        setPage(nextPage);
        // If we got fewer than expected, there might not be more pages
        if (results.length < 20) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const visibleTracks = useMemo(() => {
    return filterExplicitTracks(tracks, preferences.allowExplicit);
  }, [preferences.allowExplicit, tracks]);

  const renderSkeletons = () => (
     <TrackGrid>
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
     </TrackGrid>
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Helmet>
        <title>{genre.title} Music - Univerzo</title>
        <meta name="description" content={`Explore top tracks and hits in the ${genre.title} genre. Free streaming on Univerzo.`} />
      </Helmet>


      <div className={`relative flex h-72 items-end overflow-hidden rounded-[28px] bg-gradient-to-br ${genre.gradient} p-8 shadow-lg`}>
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
         <img src={genre.image} alt={genre.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" />
         <div className="relative z-20 space-y-4 pb-4">
           <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Genre Lane</p>
           <h1 className="text-5xl font-black tracking-tight text-white">{genre.title}</h1>
           <p className="max-w-2xl text-sm leading-6 text-white/80">{genre.description}</p>
           <div className="flex flex-wrap gap-2">
             {genre.tags?.map((tag) => (
               <span key={tag} className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/80">
                 {tag}
               </span>
             ))}
           </div>
         </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-2">Top Tracks in {genre.title}</h2>
        <p className="mb-6 text-sm text-text-subdued">{genre.subtitle}</p>
        {loading ? renderSkeletons() : error ? (
          <CatalogFeedback
            tone="error"
            title={`${genre.title} is unavailable`}
            message={error}
            actionLabel="Search tracks"
            actionTo="/search"
          />
        ) : visibleTracks.length === 0 ? (
          <CatalogFeedback
            title={`No ${genre.title} tracks found`}
            message={tracks.length > 0 && !preferences.allowExplicit
              ? 'Genre results were found, but they are hidden by your explicit-content setting.'
              : 'Try another genre or run a broader search against the live catalog.'}
            actionLabel={tracks.length > 0 && !preferences.allowExplicit ? 'Open settings' : 'Browse search'}
            actionTo={tracks.length > 0 && !preferences.allowExplicit ? '/settings' : '/search'}
          />
        ) : (
          <>
            <TrackGrid>
              {visibleTracks.map((track, i) => (
                <TrackCard key={`${track.id}-${i}`} track={track} queueContext={visibleTracks} queueIndex={i} />
              ))}
            </TrackGrid>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  {loadingMore ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                      <span>Fetching more...</span>
                    </>
                  ) : (
                    <span>Load more tracks</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default GenrePage;

import { useEffect, useMemo, useState } from 'react';
import { Flame, Globe2, Radar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import SkeletonCard from '../components/shared/SkeletonCard';
import TrackCard from '../components/shared/TrackCard';
import TrackGrid from '../components/shared/TrackGrid';
import { useMusic } from '../context/music';
import { getTrendingTracks } from '../services/api';
import { filterExplicitTracks } from '../utils/catalog';

const TrendingPage = () => {
  const [charts, setCharts] = useState([]);
  const [viral, setViral] = useState([]);
  const [world, setWorld] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMoreCharts, setLoadingMoreCharts] = useState(false);
  const [chartPage, setChartPage] = useState(0);
  const [hasMoreCharts, setHasMoreCharts] = useState(true);
  const [error, setError] = useState('');
  const { preferences } = useMusic();

  useEffect(() => {
    let cancelled = false;

    const fetchTrending = async () => {
      setLoading(true);
      setError('');
      setChartPage(0);
      setHasMoreCharts(true);

      try {
        const [chartResults, viralResults, worldResults] = await Promise.all([
          getTrendingTracks('featured pop', 30, 0),
          getTrendingTracks('latest hindi punjabi hits', 12, 0),
          getTrendingTracks('global dance pop hits', 12, 0),
        ]);

        if (cancelled) {
          return;
        }

        setCharts(chartResults);
        setViral(viralResults);
        setWorld(worldResults);
        
        if (chartResults.length < 20) {
          setHasMoreCharts(false);
        }
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setCharts([]);
        setViral([]);
        setWorld([]);
        setError(nextError.message || 'Unable to load trending tracks right now.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTrending();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoadMoreCharts = async () => {
    if (loadingMoreCharts || !hasMoreCharts) return;
    
    setLoadingMoreCharts(true);
    const nextPage = chartPage + 1;

    try {
      const results = await getTrendingTracks('featured pop', 30, nextPage);
      
      if (results.length === 0) {
        setHasMoreCharts(false);
      } else {
        setCharts(prev => [...prev, ...results]);
        setChartPage(nextPage);
        if (results.length < 20) {
          setHasMoreCharts(false);
        }
      }
    } catch (err) {
      console.error('Trending load more error:', err);
    } finally {
      setLoadingMoreCharts(false);
    }
  };

  const visibleCharts = useMemo(() => {
    return filterExplicitTracks(charts, preferences.allowExplicit);
  }, [charts, preferences.allowExplicit]);

  const visibleViral = useMemo(() => {
    return filterExplicitTracks(viral, preferences.allowExplicit);
  }, [preferences.allowExplicit, viral]);

  const visibleWorld = useMemo(() => {
    return filterExplicitTracks(world, preferences.allowExplicit);
  }, [preferences.allowExplicit, world]);

  const renderSkeletons = (count = 6) => (
    <TrackGrid>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </TrackGrid>
  );

  const renderTrackGrid = (tracks) => (
    <TrackGrid>
      {tracks.map((track, index) => (
        <TrackCard key={`${track.id}-${index}`} track={track} queueContext={tracks} queueIndex={index} />
      ))}
    </TrackGrid>
  );

  const renderHalfSkeletons = (count = 6) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );

  const renderHalfGrid = (tracks) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">
      {tracks.map((track, index) => (
        <TrackCard key={`${track.id}-${index}`} track={track} queueContext={tracks} queueIndex={index} />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Helmet>
        <title>Trending - Univerzo Music</title>
        <meta
          name="description"
          content="Browse chart movers, viral records, and globally trending songs on Univerzo Music."
        />
      </Helmet>

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(30,215,96,0.22),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.02))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle,_rgba(255,255,255,0.12),_transparent_62%)] md:block" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            <Flame className="h-4 w-4" />
            <span>Live Pulse</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            The songs shaping the room right now.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-text-muted md:text-lg">
            This page is now tuned for fast discovery from a no-login catalog: featured chart cuts,
            indie momentum, and a wider world lane users can jump into immediately.
          </p>
        </div>
      </section>


      {error ? (
        <CatalogFeedback
          tone="error"
          title="Trending lanes are offline"
          message={error}
          actionLabel="Open search"
          actionTo="/search"
        />
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/12 text-brand">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <Link to="/trending" className="text-2xl font-bold text-white transition-colors hover:text-brand">
              Chart Movers
            </Link>
            <p className="text-sm text-text-subdued">The strongest front-door discovery row in the app.</p>
          </div>
        </div>
        {loading ? renderSkeletons(12) : visibleCharts.length === 0 ? (
          <CatalogFeedback
            title="No chart movers yet"
            message={charts.length > 0 && !preferences.allowExplicit
              ? 'Chart results were found, but they are hidden by your explicit-content setting.'
              : 'The live feed did not return chart tracks for this lane right now.'}
            actionLabel={charts.length > 0 && !preferences.allowExplicit ? 'Open settings' : 'Search tracks'}
            actionTo={charts.length > 0 && !preferences.allowExplicit ? '/settings' : '/search'}
          />
        ) : (
          <>
            {renderTrackGrid(visibleCharts)}
            {hasMoreCharts && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMoreCharts}
                  disabled={loadingMoreCharts}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-white/5 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
                >
                  <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  {loadingMoreCharts ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  ) : null}
                  <span>{loadingMoreCharts ? 'Fetching more...' : 'Load more charts'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <Link to="/genre/hindi" className="text-2xl font-bold text-white transition-colors hover:text-brand">
                Desi Momentum
              </Link>
              <p className="text-sm text-text-subdued">Hindi and Punjabi momentum so trending feels broader and more local.</p>
            </div>
          </div>
          {loading ? renderHalfSkeletons(6) : visibleViral.length === 0 ? (
            <CatalogFeedback
              title="No desi momentum yet"
              message={viral.length > 0 && !preferences.allowExplicit
                ? 'Desi matches were found, but they are hidden by your explicit-content setting.'
                : 'This lane is empty right now, but the live catalog is still searchable.'}
              actionLabel={viral.length > 0 && !preferences.allowExplicit ? 'Open settings' : 'Browse Hindi'}
              actionTo={viral.length > 0 && !preferences.allowExplicit ? '/settings' : '/genre/hindi'}
            />
          ) : renderHalfGrid(visibleViral)}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <Link to="/genre/english" className="text-2xl font-bold text-white transition-colors hover:text-brand">
                Worldwide Energy
              </Link>
              <p className="text-sm text-text-subdued">Global pop and dance tracks to keep discovery from feeling too narrow.</p>
            </div>
          </div>
          {loading ? renderHalfSkeletons(6) : visibleWorld.length === 0 ? (
            <CatalogFeedback
              title="No worldwide picks yet"
              message={world.length > 0 && !preferences.allowExplicit
                ? 'Worldwide picks were found, but they are hidden by your explicit-content setting.'
                : 'The broader discovery lane came back empty this time.'}
              actionLabel={world.length > 0 && !preferences.allowExplicit ? 'Open settings' : 'Open search'}
              actionTo={world.length > 0 && !preferences.allowExplicit ? '/settings' : '/search'}
            />
          ) : renderHalfGrid(visibleWorld)}
        </div>
      </section>
    </div>
  );
};

export default TrendingPage;

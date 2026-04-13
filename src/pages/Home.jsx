import { useState, useEffect, useMemo } from 'react';
import { Compass, Headphones, Sparkles, TrendingUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import { getTrendingTracks, searchTracks } from '../services/api';
import PlaylistCard from '../components/shared/PlaylistCard';
import TrackCard from '../components/shared/TrackCard';
import TrackGrid from '../components/shared/TrackGrid';
import SkeletonCard from '../components/shared/SkeletonCard';
import HomeRecentsGrid from '../components/shared/HomeRecentsGrid';
import HorizontalSection from '../components/shared/HorizontalSection';
import { useMusic } from '../context/music';
import { featuredPlaylists } from '../data/featuredPlaylists';
import { filterExplicitTracks } from '../utils/catalog';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [electronic, setElectronic] = useState([]);
  const [indiePulse, setIndiePulse] = useState([]);
  const [hiphop, setHiphop] = useState([]);
  const [lofi, setLofi] = useState([]);
  const [rockHits, setRockHits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { likedSongs, playlists, recentPlays, setActivePlaylistId, preferences } = useMusic();
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    let cancelled = false;

    const fetchHome = async () => {
      setLoading(true);
      setError('');

      try {
        const [trendingResults, electronicResults, indieResults, hiphopResults, lofiResults, rockResults] = await Promise.all([
          getTrendingTracks('featured pop', 30),
          searchTracks('latest hindi songs bollywood hits', 18),
          searchTracks('punjabi pop bhangra hits', 12),
          searchTracks('tamil hits kollywood songs', 18),
          searchTracks('telugu hits tollywood songs', 12),
          searchTracks('international pop hits', 12),
        ]);

        if (cancelled) {
          return;
        }

        setTrending(trendingResults);
        setElectronic(electronicResults);
        setIndiePulse(indieResults);
        setHiphop(hiphopResults);
        setLofi(lofiResults);
        setRockHits(rockResults);
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setTrending([]);
        setElectronic([]);
        setIndiePulse([]);
        setHiphop([]);
        setLofi([]);
        setRockHits([]);
        setError(nextError.message || 'Unable to load music right now.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchHome();

    return () => {
      cancelled = true;
    };
  }, []);

  const personalizedRecent = useMemo(() => {
    return filterExplicitTracks(recentPlays, preferences.allowExplicit).slice(0, 6);
  }, [preferences.allowExplicit, recentPlays]);

  const personalizedLikes = useMemo(() => {
    return filterExplicitTracks(likedSongs, preferences.allowExplicit).slice(0, 6);
  }, [likedSongs, preferences.allowExplicit]);

  const activePlaylists = useMemo(() => {
    return playlists
      .filter((playlist) => playlist.tracks.length > 0)
      .slice(0, 3);
  }, [playlists]);

  const visibleTrending = useMemo(() => {
    return filterExplicitTracks(trending, preferences.allowExplicit);
  }, [preferences.allowExplicit, trending]);

  const visibleElectronic = useMemo(() => {
    return filterExplicitTracks(electronic, preferences.allowExplicit);
  }, [electronic, preferences.allowExplicit]);

  const visibleIndiePulse = useMemo(() => {
    return filterExplicitTracks(indiePulse, preferences.allowExplicit);
  }, [indiePulse, preferences.allowExplicit]);

  const visibleHiphop = useMemo(() => {
    return filterExplicitTracks(hiphop, preferences.allowExplicit);
  }, [hiphop, preferences.allowExplicit]);

  const visibleLofi = useMemo(() => {
    return filterExplicitTracks(lofi, preferences.allowExplicit);
  }, [lofi, preferences.allowExplicit]);

  const visibleRock = useMemo(() => {
    return filterExplicitTracks(rockHits, preferences.allowExplicit);
  }, [rockHits, preferences.allowExplicit]);

  const renderSkeletons = () => (
    <TrackGrid>
      {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
    </TrackGrid>
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Helmet>
        <title>Home - Univerzo Music</title>
        <meta name="description" content="Discover trending hits, electronic dance, and personalized music recommendations on Univerzo Music." />
      </Helmet>

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(30,215,96,0.22),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.02))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle,_rgba(255,255,255,0.1),_transparent_62%)] md:block" />
        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                <Sparkles className="h-4 w-4" />
                <span>{greeting()}</span>
              </div>
            </div>
            <h1 className="hidden text-4xl font-black tracking-tight text-white md:block md:text-5xl lg:text-6xl">
              Real music, instant play, no sign-in wall.
            </h1>
            <h1 className="text-3xl font-black tracking-tight text-white md:hidden">
              {greeting()}
            </h1>
            <p className="hidden max-w-xl text-base leading-7 text-text-muted md:block md:text-lg">
              This home experience now blends your recent listening, saved tracks, playlists,
              and a live open catalog so the app feels closer to a real everyday streaming home.
            </p>
          </div>

          <div className="md:hidden">
             <HomeRecentsGrid items={[...personalizedRecent, ...activePlaylists].slice(0,6)} />
          </div>

          <div className="hidden flex-col gap-3 sm:flex-row xl:flex-col xl:w-[340px] shrink-0 md:flex">
            <div className="flex flex-1 items-start gap-4 rounded-xl border border-white/8 bg-white/5 p-4">
              <TrendingUp className="h-6 w-6 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-bold text-white">Trending</p>
                <p className="mt-1 text-xs leading-5 text-text-subdued">Fast top-of-funnel discovery with queue-ready cards.</p>
              </div>
            </div>
            <div className="flex flex-1 items-start gap-4 rounded-xl border border-white/8 bg-white/5 p-4">
              <Headphones className="h-6 w-6 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-bold text-white">No Login</p>
                <p className="mt-1 text-xs leading-5 text-text-subdued">Direct browser playback from a real catalog path.</p>
              </div>
            </div>
            <div className="flex flex-1 items-start gap-4 rounded-xl border border-white/8 bg-white/5 p-4">
              <Compass className="h-6 w-6 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-bold text-white">Library</p>
                <p className="mt-1 text-xs leading-5 text-text-subdued">Jump back into playlists, likes, and your history.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {error ? (
        <CatalogFeedback
          tone="error"
          title="Music catalog is unavailable"
          message={error}
          actionLabel="Search manually"
          actionTo="/search"
        />
      ) : null}

      {personalizedRecent.length > 0 ? (
        <div className="md:hidden">
          <HorizontalSection 
            title="Jump Back In" 
            subtitle="Recent plays ready to restart instantly"
            to="/recent"
          >
            {personalizedRecent.map((track, index) => (
              <div key={`mob-recent-${track.id}`} className="w-36 flex-shrink-0">
                <TrackCard 
                  track={track} 
                  queueContext={personalizedRecent} 
                  queueIndex={index} 
                />
              </div>
            ))}
          </HorizontalSection>
        </div>
      ) : null}

      {personalizedRecent.length > 0 ? (
        <section className="hidden md:block">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Jump Back In</h2>
              <p className="text-sm text-text-subdued">Recent plays ready to restart instantly.</p>
            </div>
            <Link
              to="/recent"
              className="text-sm font-semibold uppercase tracking-[0.24em] text-text-subdued transition-colors hover:text-white"
            >
              Full history
            </Link>
          </div>
          <TrackGrid>
            {personalizedRecent.map((track, index) => (
              <TrackCard
                key={`home-recent-${track.id}-${index}`}
                track={track}
                queueContext={personalizedRecent}
                queueIndex={index}
              />
            ))}
          </TrackGrid>
        </section>
      ) : null}

      {personalizedLikes.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">From Your Likes</h2>
              <p className="text-sm text-text-subdued">Tracks you already care about, one tap away.</p>
            </div>
            <Link
              to="/liked"
              className="text-sm font-semibold uppercase tracking-[0.24em] text-text-subdued transition-colors hover:text-white"
            >
              Open likes
            </Link>
          </div>
          <TrackGrid>
            {personalizedLikes.map((track, index) => (
              <TrackCard
                key={`home-liked-${track.id}-${index}`}
                track={track}
                queueContext={personalizedLikes}
                queueIndex={index}
              />
            ))}
          </TrackGrid>
        </section>
      ) : null}

      {activePlaylists.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
              <p className="text-sm text-text-subdued">Collections you can reopen and keep building.</p>
            </div>
            <Link
              to="/playlists"
              className="text-sm font-semibold uppercase tracking-[0.24em] text-text-subdued transition-colors hover:text-white"
            >
              Manage playlists
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activePlaylists.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                onClick={() => setActivePlaylistId(playlist.id)}
                className="group rounded-2xl border border-white/8 bg-white/4 p-5 transition-colors hover:bg-white/7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand">
                      {playlist.title}
                    </h3>
                    <p className="text-sm leading-6 text-text-muted text-truncate-2">
                      {playlist.description}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-text-subdued">
                    {playlist.tracks.length} tracks
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="flex items-center justify-between mb-4">
          <Link to="/trending" className="text-2xl font-bold transition-colors hover:text-brand">
            Live Trending Hits
          </Link>
        </div>
        {loading ? renderSkeletons() : visibleTrending.length === 0 ? (
          <CatalogFeedback
            title="No trending tracks yet"
            message={trending.length > 0 && !preferences.allowExplicit
              ? 'This row has results, but they are hidden by your explicit-content setting.'
              : 'We reached the live catalog, but nothing came back for this row. Try a fresh search instead.'}
            actionLabel="Open search"
            actionTo={trending.length > 0 && !preferences.allowExplicit ? '/settings' : '/search'}
          />
        ) : (
          <TrackGrid>
            {visibleTrending.map((track, i) => (
              <TrackCard key={track.id} track={track} queueContext={visibleTrending} queueIndex={i} />
            ))}
          </TrackGrid>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <Link to="/playlists" className="text-2xl font-bold transition-colors hover:text-brand">
            Featured Mixes
          </Link>
          <span className="text-sm font-bold text-text-subdued uppercase tracking-wider">Live + local</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      <HorizontalSection 
        title="Hindi Hits" 
        subtitle="Bollywood leaders and chart staples"
        to="/genre/hindi"
      >
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-36 flex-shrink-0"><SkeletonCard /></div>
        )) : visibleElectronic.map((track, i) => (
          <div key={track.id} className="w-36 flex-shrink-0">
            <TrackCard track={track} queueContext={visibleElectronic} queueIndex={i} />
          </div>
        ))}
      </HorizontalSection>

      <HorizontalSection 
        title="Punjabi Energy" 
        subtitle="Bhangra drive and crossover anthems"
        to="/genre/punjabi"
      >
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-36 flex-shrink-0"><SkeletonCard /></div>
        )) : visibleIndiePulse.map((track, i) => (
          <div key={track.id} className="w-36 flex-shrink-0">
            <TrackCard track={track} queueContext={visibleIndiePulse} queueIndex={i} />
          </div>
        ))}
      </HorizontalSection>

      <HorizontalSection 
        title="Tamil Essentials" 
        subtitle="Kollywood favorites"
        to="/genre/tamil"
      >
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-36 flex-shrink-0"><SkeletonCard /></div>
        )) : visibleHiphop.map((track, i) => (
          <div key={track.id} className="w-36 flex-shrink-0">
            <TrackCard track={track} queueContext={visibleHiphop} queueIndex={i} />
          </div>
        ))}
      </HorizontalSection>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <Link to="/genre/telugu" className="text-2xl font-bold transition-colors hover:text-brand">
            Telugu Trending
          </Link>
          <Link to="/genre/telugu" className="text-sm font-bold text-text-subdued uppercase tracking-wider transition-colors hover:text-white">
            Open genre
          </Link>
        </div>
        {loading ? renderSkeletons() : visibleLofi.length === 0 ? (
          <CatalogFeedback
            title="No Telugu picks yet"
            message="This Telugu lane came back empty. Try the dedicated genre page instead."
            actionLabel="Browse Telugu"
            actionTo="/genre/telugu"
          />
        ) : (
          <TrackGrid>
            {visibleLofi.map((track, index) => (
              <TrackCard key={track.id} track={track} queueContext={visibleLofi} queueIndex={index} />
            ))}
          </TrackGrid>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <Link to="/genre/english" className="text-2xl font-bold transition-colors hover:text-brand">
            English Pop
          </Link>
          <Link to="/genre/english" className="text-sm font-bold text-text-subdued uppercase tracking-wider transition-colors hover:text-white">
            Open genre
          </Link>
        </div>
        {loading ? renderSkeletons() : visibleRock.length === 0 ? (
          <CatalogFeedback
            title="No English pop picks yet"
            message="This English pop lane came back empty. Try the genre page or live search."
            actionLabel="Browse Pop"
            actionTo="/genre/english"
          />
        ) : (
          <TrackGrid>
            {visibleRock.map((track, index) => (
              <TrackCard key={track.id} track={track} queueContext={visibleRock} queueIndex={index} />
            ))}
          </TrackGrid>
        )}
      </section>

      <section className="w-full mt-4 mb-4">
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(78,70,229,0.55),rgba(15,23,42,0.92))] p-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/0" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="mb-1 text-xs font-bold tracking-widest uppercase text-indigo-200">Power Listener Controls</p>
              <h3 className="text-3xl font-bold mb-2">Tune playback and filtering your way</h3>
              <p className="text-sm text-indigo-100/90 leading-6">Sleep timer, auto-advance, explicit-content filtering, and queue controls are now part of the product direction, so listeners can shape the experience instead of only consuming rows.</p>
            </div>
            <Link
              to="/settings"
              className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-white/15"
            >
              Open settings
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

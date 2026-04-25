import { useState, useEffect, useMemo } from 'react';
import { Compass, Headphones, Sparkles, TrendingUp, Maximize2, Minimize2, Settings2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import { getDiscoveryTracks, getTrendingTracks, searchTracks } from '../services/api';
import PlaylistCard from '../components/shared/PlaylistCard';
import TrackCard from '../components/shared/TrackCard';
import TrackGrid from '../components/shared/TrackGrid';
import SkeletonCard from '../components/shared/SkeletonCard';
import HomeRecentsGrid from '../components/shared/HomeRecentsGrid';
import HorizontalSection from '../components/shared/HorizontalSection';
import QuickCustomizer from '../components/shared/QuickCustomizer';
import { useMusic } from '../context/music';
import { featuredPlaylists } from '../data/featuredPlaylists';
import { filterExplicitTracks } from '../utils/catalog';

const Home = () => {
  const [dynamicSections, setDynamicSections] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { likedSongs, playlists, recentPlays, setActivePlaylistId, preferences } = useMusic();
  const [discoveryMix, setDiscoveryMix] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      document.exitFullscreen();
    }
  };
  
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
        const hasSet = preferences.hasSetPreferences;
        
        // Strictly use preferred or default
        const preferredLangs = hasSet && preferences.preferredLanguages.length > 0 
          ? preferences.preferredLanguages 
          : preferences.preferredLanguages.length > 0 ? preferences.preferredLanguages : ['hindi', 'english', 'punjabi'];
        
        const preferredGenres = hasSet && preferences.preferredGenres.length > 0
          ? preferences.preferredGenres
          : preferences.preferredGenres.length > 0 ? preferences.preferredGenres : ['pop', 'lo-fi'];

        // Trending should respect languages
        const trendingPromise = getTrendingTracks('featured pop', 30, 0, preferredLangs);
        
        // Favorite artists from likes
        const favoriteArtists = Array.from(new Set(likedSongs.map(s => s.artist))).slice(0, 3);
        const artistSeeds = favoriteArtists.length > 0 ? favoriteArtists : ['Arijit Singh', 'Taylor Swift'];

        const langPromises = preferredLangs.map(lang => getDiscoveryTracks(lang, 12, 0, [lang]));
        const genrePromises = preferredGenres.map(genre => getDiscoveryTracks(genre, 12, 0, preferredLangs));
        
        // Smart discovery based on broader selection of preferences (up to 6 seeds)
        const mixSeeds = [...preferredLangs, ...preferredGenres, ...artistSeeds]
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);
        const discoveryPromises = mixSeeds.map(seed => searchTracks(seed, 8));
        
        const results = await Promise.all([
          trendingPromise, 
          ...langPromises, 
          ...genrePromises,
          ...discoveryPromises
        ]);

        if (cancelled) return;

        setTrending(results[0]);
        
        // Combine mixed results
        const startIndexMix = 1 + preferredLangs.length + preferredGenres.length;
        const rawMix = results.slice(startIndexMix).flat().sort(() => 0.5 - Math.random());
        setDiscoveryMix(rawMix);

        const langSections = preferredLangs.map((lang, index) => ({
          id: lang,
          title: `${lang.charAt(0).toUpperCase() + lang.slice(1)} Hits`,
          tracks: results[index + 1] || []
        }));

        const startIndexGenres = 1 + preferredLangs.length;
        const genreSections = preferredGenres.map((genre, index) => ({
          id: genre,
          title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Vibes`,
          tracks: results[startIndexGenres + index] || []
        }));
        
        setDynamicSections([...langSections, ...genreSections]);
      } catch (nextError) {
        if (cancelled) return;
        setError(nextError.message || 'Unable to load music right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHome();

    return () => {
      cancelled = true;
    };
  }, [preferences.preferredLanguages, preferences.preferredGenres, preferences.hasSetPreferences, likedSongs]);


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

  const visibleDynamicSections = useMemo(() => {
    return dynamicSections.map(section => ({
      ...section,
      visibleTracks: filterExplicitTracks(section.tracks, preferences.allowExplicit)
    }));
  }, [dynamicSections, preferences.allowExplicit]);

  const visibleDiscoveryMix = useMemo(() => {
    return filterExplicitTracks(discoveryMix, preferences.allowExplicit);
  }, [discoveryMix, preferences.allowExplicit]);

  const renderSkeletons = () => (
    <TrackGrid>
      {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
    </TrackGrid>
  );

  const renderHorizontalLane = (tracks, sourceTracks, title, emptyMessage, actionTo) => {
    if (loading) {
      return Array.from({ length: 6 }).map((_, index) => (
        <div key={`${title}-skeleton-${index}`} className="w-36 flex-shrink-0">
          <SkeletonCard />
        </div>
      ));
    }

    if (tracks.length === 0) {
      const hiddenByExplicitFilter = sourceTracks.length > 0 && !preferences.allowExplicit;

      return (
        <div className="min-w-full">
          <CatalogFeedback
            title={`No ${title} yet`}
            message={hiddenByExplicitFilter
              ? 'This lane has results, but they are hidden by your explicit-content setting.'
              : emptyMessage}
            actionLabel={hiddenByExplicitFilter ? 'Open settings' : `Open ${title}`}
            actionTo={hiddenByExplicitFilter ? '/settings' : actionTo}
          />
        </div>
      );
    }

    return tracks.map((track, index) => (
      <div key={track.id} className="w-36 flex-shrink-0">
        <TrackCard track={track} queueContext={tracks} queueIndex={index} />
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Helmet>
        <title>Univerzo Music - Free Online Songs & Ad-Free Discovery</title>
        <meta name="description" content="Stream millions of songs for free on Univerzo Music. Listen to latest Bollywood hits, Punjabi pop, and global trending tracks with no ads and no sign-in. Your best free Spotify alternative for high-quality Indian and international music." />
        <meta name="keywords" content="free music streaming, listen to songs online, no ads music player, bollywood hits 2026, latest punjabi songs, tamil hits, telugu trending, free spotify alternative, high quality audio streaming, regional indian music" />
        <link rel="canonical" href="https://universo-music.vercel.app/" />
        
        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://universo-music.vercel.app/" />
        <meta property="og:title" content="Univerzo Music - Unlimited Free Streaming & Ad-Free Music" />
        <meta property="og:description" content="Listen to millions of songs, including latest Bollywood and regional hits. No ads, no sign-in, just pure music discovery." />
        <meta property="og:image" content="https://universo-music.vercel.app/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://universo-music.vercel.app/" />
        <meta name="twitter:title" content="Univerzo Music - Best Free Music Player" />
        <meta name="twitter:description" content="Stream your favorite songs for free with no ads. The ultimate music discovery platform." />
        <meta name="twitter:image" content="https://universo-music.vercel.app/og-image.png" />
      </Helmet>

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(30,215,96,0.22),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.07),_rgba(255,255,255,0.02))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle,_rgba(255,255,255,0.1),_transparent_62%)] md:block" />
        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                <Sparkles className="h-4 w-4" />
                <span>{greeting()}</span>
              </div>
              <button 
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition-all ${isCustomizing ? 'bg-brand text-black border-brand' : 'border-white/10 bg-white/5 text-text-subdued hover:bg-white/10 hover:text-white'}`}
              >
                <Settings2 className="h-4 w-4" />
                <span>Tune Feed</span>
              </button>
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
            <div className="m-3 flex flex-col gap-3 rounded-2xl border border-white/8 bg-bg-highlight/40 p-4 backdrop-blur-md">
              <div className="space-y-2 text-xs text-text-subdued">
                <p className="font-semibold uppercase tracking-[0.24em] text-brand">Playback Layer</p>
                <p className="text-sm font-semibold text-white">Native Browser</p>
                <p className="text-[11px] leading-5 opacity-80">Direct browser playback from a real catalog path.</p>
              </div>
              
              <button 
                onClick={toggleFullscreen}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 active:scale-95"
              >
                {isFullscreen ? (
                  <><Minimize2 className="h-4 w-4" /> Exit Fullscreen</>
                ) : (
                  <><Maximize2 className="h-4 w-4" /> Native View</>
                )}
              </button>
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

      <QuickCustomizer 
        isOpen={isCustomizing} 
        onClose={() => setIsCustomizing(false)} 
      />

      {visibleDiscoveryMix.length > 0 ? (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/20 to-purple-500/10 p-1">
          <div className="rounded-[22px] bg-bg-base/60 p-6 backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-black text-white">
                  Made For You <Sparkles className="h-5 w-5 text-brand" />
                </h2>
                <p className="text-sm text-text-subdued">Your personal discovery mix, refreshed based on your taste.</p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs font-bold uppercase tracking-widest text-brand hover:opacity-80"
              >
                Refresh Mix
              </button>
            </div>
            <TrackGrid>
              {visibleDiscoveryMix.map((track, index) => (
                <TrackCard 
                  key={`discovery-${track.id}-${index}`} 
                  track={track} 
                  queueContext={visibleDiscoveryMix} 
                  queueIndex={index} 
                />
              ))}
            </TrackGrid>
          </div>
        </section>
      ) : null}

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

      {visibleDynamicSections.map((section) => (
         <HorizontalSection
           key={section.id}
           title={section.title}
           subtitle={`Top tracks in ${section.id}`}
           to={`/genre/${section.id}`}
         >
           {renderHorizontalLane(
             section.visibleTracks,
             section.tracks,
             section.title,
             `This ${section.id} lane came back empty. Try the dedicated genre page instead.`,
             `/genre/${section.id}`,
           )}
         </HorizontalSection>
       ))}

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

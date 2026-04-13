import { useEffect, useMemo, useState } from 'react';
import { Disc3, ListMusic, Mic2, Play, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import TrackCard from '../components/shared/TrackCard';
import TrackGrid from '../components/shared/TrackGrid';
import SkeletonCard from '../components/shared/SkeletonCard';
import { useMusic } from '../context/music';
import { usePlayer } from '../context/player';
import { featuredGenreIds, genres } from '../data/genres';
import { searchTracks } from '../services/api';
import {
  buildAlbumResults,
  buildArtistResults,
  filterExplicitTracks,
  findMatchingPlaylists,
} from '../utils/catalog';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const { playlists, preferences, setActivePlaylistId } = useMusic();
  const { playTrack } = usePlayer();
  const featuredGenres = featuredGenreIds
    .map((genreId) => genres.find((genre) => genre.id === genreId))
    .filter(Boolean);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 600);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      setPage(0);
      setHasMore(true);

      if (debouncedQuery.length === 0) {
        setTracks([]);
        setLoading(false);
        return;
      }

      try {
        const results = await searchTracks(debouncedQuery, 50, 0);

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
        setError(nextError.message || 'Unable to load search results right now.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || !debouncedQuery) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const results = await searchTracks(debouncedQuery, 50, nextPage);
      
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
      console.error('Search load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredTracks = useMemo(() => {
    return filterExplicitTracks(tracks, preferences.allowExplicit);
  }, [preferences.allowExplicit, tracks]);

  const topResult = filteredTracks[0] || null;
  const artistResults = useMemo(() => buildArtistResults(filteredTracks), [filteredTracks]);
  const albumResults = useMemo(() => buildAlbumResults(filteredTracks), [filteredTracks]);
  const playlistMatches = useMemo(() => {
    return findMatchingPlaylists(playlists, debouncedQuery);
  }, [debouncedQuery, playlists]);
  
  // Previously sliced to 12, now showing all fetched tracks to support "Load More"
  const songResults = filteredTracks;

  const renderSkeletons = () => (
    <TrackGrid>
      {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
    </TrackGrid>
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Helmet>
        <title>{query ? `Search: ${query}` : 'Search'} - Univerzo Music</title>
        <meta name="description" content="Search for your favorite tracks, artists, and playlists globally on Univerzo." />
      </Helmet>


      <div className="sticky top-0 z-30 pt-4 pb-4 bg-bg-base/90 backdrop-blur-md">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-black" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border-none rounded-full leading-5 bg-white text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand sm:text-sm font-medium shadow-md transition-shadow"
            placeholder="Search any song or artist..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {!query ? (
        <section className="space-y-6">
          <h1 className="text-3xl font-black tracking-tight text-white md:hidden mt-2">Search</h1>
          
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold md:text-2xl">Browse all</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {featuredGenres.map((genre) => (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}`}
                className={`group relative aspect-[16/10] overflow-hidden rounded-lg bg-gradient-to-br ${genre.gradient} shadow-lg transition-transform active:scale-95`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <h3 className="relative z-10 p-3 text-lg font-black tracking-tight text-white drop-shadow-md md:text-xl">
                  {genre.title}
                </h3>
                <img
                  src={genre.image}
                  alt={genre.title}
                  className="absolute -bottom-2 -right-6 h-28 w-28 rotate-[25deg] object-cover opacity-50 transition-transform group-hover:scale-110 md:h-32 md:w-32"
                />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {query && (
        <section className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Search Results for "{query}"</h2>
              <p className="text-sm text-text-subdued">
                Browse songs, artists, albums, and playlist matches from the live catalog.
              </p>
            </div>
            <div className="rounded-full border border-white/8 bg-white/4 px-4 py-2 text-xs uppercase tracking-[0.24em] text-text-subdued">
              {filteredTracks.length} track matches
            </div>
          </div>

          {loading ? renderSkeletons() : error ? (
            <CatalogFeedback
              tone="error"
              title="Search is unavailable"
              message={error}
            />
          ) : filteredTracks.length > 0 ? (
            <div className="space-y-8">
              {topResult ? (
                <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
                  <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-brand">Top Result</p>
                    <div className="space-y-4">
                      <img
                        src={topResult.cover}
                        alt={topResult.title}
                        className="h-56 w-full rounded-[24px] object-cover shadow-xl"
                      />
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black tracking-tight text-white">
                          {topResult.title}
                        </h3>
                        <p className="text-sm text-text-muted">
                          {topResult.artist}
                          {topResult.album ? ` • ${topResult.album}` : ''}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-text-subdued">
                          <span>{topResult.durationLabel}</span>
                          {topResult.isExplicit ? <span>Explicit</span> : null}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => playTrack(topResult, filteredTracks, 0)}
                        className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] hover:bg-brand-hover"
                      >
                        <Play className="h-4 w-4 fill-black" />
                        Play top result
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
                        <Search className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Songs</h3>
                        <p className="text-sm text-text-subdued">The strongest direct track matches.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4">
                      {songResults.map((track, index) => (
                        <TrackCard
                          key={`${track.id}-${index}`}
                          track={track}
                          queueContext={filteredTracks}
                          queueIndex={index}
                        />
                      ))}
                    </div>
                    
                    {hasMore && (
                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-white/5 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          {loadingMore ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                          ) : null}
                          <span>{loadingMore ? 'Loading more...' : 'Show more songs'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {artistResults.length > 0 ? (
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
                      <Mic2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Artists</h3>
                      <p className="text-sm text-text-subdued">Jump into artist-level discovery from this search.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {artistResults.map((artist) => (
                      <Link
                        key={artist.slug}
                        to={`/artist/${artist.slug}`}
                        state={{ artistName: artist.name, seedTrack: artist.seedTrack }}
                        className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/4 p-4 transition-colors hover:bg-white/7"
                      >
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-lg font-semibold text-white group-hover:text-brand text-truncate-1">
                            {artist.name}
                          </p>
                          <p className="text-xs uppercase tracking-[0.24em] text-text-subdued">
                            {artist.trackCount} tracks
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              {albumResults.length > 0 ? (
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
                      <Disc3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Albums & Collections</h3>
                      <p className="text-sm text-text-subdued">Browse grouped results instead of only single tracks.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {albumResults.map((album) => (
                      <Link
                        key={album.slug}
                        to={`/album/${album.slug}`}
                        state={{
                          artistName: album.artist,
                          albumName: album.title,
                          seedTrack: album.seedTrack,
                        }}
                        className="group rounded-2xl border border-white/8 bg-white/4 p-4 transition-colors hover:bg-white/7"
                      >
                        <img
                          src={album.cover}
                          alt={album.title}
                          className="mb-4 aspect-square w-full rounded-2xl object-cover"
                        />
                        <p className="text-lg font-semibold text-white group-hover:text-brand text-truncate-1">
                          {album.title}
                        </p>
                        <p className="mt-1 text-sm text-text-muted text-truncate-1">
                          {album.artist}
                        </p>
                        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-text-subdued">
                          {album.trackCount} matching tracks
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              {playlistMatches.length > 0 ? (
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
                      <ListMusic className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Your Playlist Matches</h3>
                      <p className="text-sm text-text-subdued">Local library playlists related to this search.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {playlistMatches.map((playlist) => (
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
            </div>
          ) : tracks.length > 0 && !preferences.allowExplicit ? (
            <CatalogFeedback
              title="Matches were filtered"
              message="This search returned tracks, but your explicit-content filter is hiding them. You can change that in Settings."
              actionLabel="Open settings"
              actionTo="/settings"
            />
          ) : (
            <CatalogFeedback
              title="No songs found"
              message="Try a broader artist, song, or genre search to pull more results from the live catalog."
            />
          )}
        </section>
      )}
    </div>
  );
};

export default SearchPage;

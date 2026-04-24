import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { searchTracks } from '../services/api';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import { usePlayer } from '../context/player';
import { useMusic } from '../context/music';
import { Play, Trash2 } from 'lucide-react';
import TrackCard from '../components/shared/TrackCard';
import TrackGrid from '../components/shared/TrackGrid';
import SkeletonCard from '../components/shared/SkeletonCard';
import { filterExplicitTracks } from '../utils/catalog';
import { featuredPlaylists } from '../data/featuredPlaylists';
import { unslugifyValue } from '../utils/musicMeta';
import ShareButton from '../components/shared/ShareButton';

const PlaylistPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const {
    playlists,
    removeTrackFromPlaylist,
    setActivePlaylistId,
    updatePlaylistDetails,
    deletePlaylist,
    preferences,
  } = useMusic();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const savedPlaylist = playlists.find((playlist) => playlist.id === slug) || null;
  const featuredPlaylist = featuredPlaylists.find((playlist) => playlist.id === slug) || null;
  
  const title = savedPlaylist
    ? savedPlaylist.title
    : featuredPlaylist?.title || (slug ? unslugifyValue(slug) : 'Playlist');
  const description = savedPlaylist?.description
    || featuredPlaylist?.description
    || `A curated dynamic playlist for ${title.toLowerCase()}.`;
  const heroCover = featuredPlaylist?.cover || '';

  useEffect(() => {
    setDraftTitle(savedPlaylist?.title || '');
    setDraftDescription(savedPlaylist?.description || '');
  }, [savedPlaylist]);

  const visibleTracks = useMemo(() => {
    return filterExplicitTracks(tracks, preferences.allowExplicit);
  }, [preferences.allowExplicit, tracks]);

  useEffect(() => {
    let cancelled = false;

    const fetchPlaylist = async () => {
      if (savedPlaylist) {
        setActivePlaylistId(savedPlaylist.id);
        setTracks(savedPlaylist.tracks || []);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const results = await searchTracks(featuredPlaylist?.query || unslugifyValue(slug || 'top hits'), 24);

        if (cancelled) {
          return;
        }

        setTracks(results);
      } catch (nextError) {
        if (cancelled) {
          return;
        }

        setTracks([]);
        setError(nextError.message || 'Unable to load this playlist right now.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPlaylist();

    return () => {
      cancelled = true;
    };
  }, [featuredPlaylist?.query, savedPlaylist, setActivePlaylistId, slug]);

  const handlePlayAll = () => {
    if (visibleTracks.length > 0) {
      playTrack(visibleTracks[0], visibleTracks, 0);
    }
  };

  const renderSkeletons = () => (
    <TrackGrid>
      {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
    </TrackGrid>
  );

  const handleSaveDetails = (event) => {
    event.preventDefault();

    if (!savedPlaylist) {
      return;
    }

    updatePlaylistDetails(savedPlaylist.id, draftTitle, draftDescription);
  };

  const handleDeletePlaylist = () => {
    if (!savedPlaylist) {
      return;
    }

    deletePlaylist(savedPlaylist.id);
    navigate('/playlists');
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Helmet>
        <title>{title} - Univerzo Playlists</title>
        <meta name="description" content={`Listen to the ${title} playlist on Univerzo. Discover and stream top songs right now.`} />
      </Helmet>


      <div className="flex flex-col items-end gap-6 border-b border-white/10 pt-10 pb-6 md:flex-row">
        <div className="flex h-52 w-52 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-indigo-500 to-purple-800 text-6xl font-black shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {heroCover ? (
            <img src={heroCover} alt={title} className="h-full w-full object-cover" />
          ) : (
            title.charAt(0)
          )}
        </div>
        <div className="flex flex-col gap-3">
          <span className="uppercase text-xs font-bold tracking-widest text-text-subdued">Playlist</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">{title}</h1>
          <p className="text-text-muted text-sm mt-2">
            {description}
          </p>
          <div className="flex items-center gap-2 text-sm text-text-subdued font-medium mt-1">
            <Link to="/" className="text-white transition-colors hover:text-brand">
              Univerzo
            </Link>
            <span>|</span>
            <span>{visibleTracks.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-6 py-2">
        <button 
          onClick={handlePlayAll}
          disabled={loading || visibleTracks.length === 0}
          className="w-14 h-14 bg-brand rounded-full flex items-center justify-center hover:scale-105 transition-transform hover:bg-brand-hover shadow-lg disabled:opacity-50"
        >
          <Play className="w-6 h-6 fill-black text-black ml-1" />
        </button>

        <ShareButton 
          title={`${title} - Univerzo Music`}
          text={`Check out the ${title} playlist on Univerzo Music!`}
          url={window.location.href}
          className="h-12 w-12 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
        />

        <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-text-subdued">
          {savedPlaylist ? 'Saved in your library' : 'Dynamic search results'}
        </div>
      </div>

      {savedPlaylist ? (
        <form
          onSubmit={handleSaveDetails}
          className="grid gap-4 rounded-2xl border border-white/8 bg-white/4 p-5 xl:grid-cols-[minmax(0,1fr)_auto]"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="playlist-title">
                Playlist name
              </label>
              <input
                id="playlist-title"
                type="text"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-text-subdued focus:border-brand/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="playlist-description">
                Description
              </label>
              <input
                id="playlist-description"
                type="text"
                value={draftDescription}
                onChange={(event) => setDraftDescription(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-text-subdued focus:border-brand/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <button
              type="submit"
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] hover:bg-brand-hover"
            >
              Save details
            </button>
            <button
              type="button"
              onClick={handleDeletePlaylist}
              className="rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/8"
            >
              Delete playlist
            </button>
          </div>
        </form>
      ) : null}

      {/* Tracks List */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Tracks</h2>
          <p className="text-sm text-text-subdued">
            {savedPlaylist
              ? 'Saved tracks from your library playlist.'
              : 'Live catalog matches for this featured mix.'}
          </p>
        </div>

        {loading ? renderSkeletons() : error ? (
          <CatalogFeedback
            tone="error"
            title="Playlist unavailable"
            message={error}
            actionLabel="Go to search"
            actionTo="/search"
          />
        ) : visibleTracks.length === 0 ? (
          <CatalogFeedback
            title="No tracks matched this playlist"
            message={tracks.length > 0 && !preferences.allowExplicit
              ? 'This playlist has tracks, but they are hidden by your explicit-content setting.'
              : 'Try another playlist route or use search to build a stronger queue.'}
            actionLabel={tracks.length > 0 && !preferences.allowExplicit ? 'Open settings' : 'Search tracks'}
            actionTo={tracks.length > 0 && !preferences.allowExplicit ? '/settings' : '/search'}
          />
        ) : (
          <TrackGrid>
            {visibleTracks.map((track, i) => (
              <div key={track.id} className="space-y-3">
                <TrackCard track={track} queueContext={visibleTracks} queueIndex={i} />
                {savedPlaylist ? (
                  <button
                    type="button"
                    onClick={() => removeTrackFromPlaylist(savedPlaylist.id, track.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-text-subdued transition-colors hover:bg-white/8 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                ) : null}
              </div>
            ))}
          </TrackGrid>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;

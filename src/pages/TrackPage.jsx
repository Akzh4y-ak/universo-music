import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Play, Disc3, Calendar, Clock, Share2, Heart, LibraryBig } from 'lucide-react';
import { getTrackById, searchTracks } from '../services/api';
import { usePlayer } from '../context/player';
import { useMusic } from '../context/music';
import TrackCard from '../components/shared/TrackCard';
import TrackGrid from '../components/shared/TrackGrid';
import SkeletonCard from '../components/shared/SkeletonCard';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import { filterExplicitTracks } from '../utils/catalog';

const TrackPage = () => {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [similarTracks, setSimilarTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const { isLiked, toggleLike, isTrackInAnyPlaylist, saveTrackToPlaylist, preferences } = useMusic();

  const isCurrentTrack = currentTrack?.id === track?.id;
  const liked = track ? isLiked(track.id) : false;
  const savedToPlaylist = track ? isTrackInAnyPlaylist(track.id) : false;

  useEffect(() => {
    let cancelled = false;

    const fetchTrackData = async () => {
      setLoading(true);
      setError('');
      
      try {
        const trackData = await getTrackById(id);
        
        if (cancelled) return;

        if (!trackData) {
          setError('We could not find this track in the catalog.');
          setLoading(false);
          return;
        }

        setTrack(trackData);

        // Fetch similar tracks (same artist or genre)
        const moreResults = await searchTracks(trackData.artist, 12);
        if (!cancelled) {
          setSimilarTracks(moreResults.filter(t => t.id !== trackData.id));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'An error occurred while loading the track.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTrackData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else if (track) {
      playTrack(track, [track, ...similarTracks], 0);
    }
  };

  const handleShare = async () => {
    if (!track) return;
    
    const shareData = {
      title: `${track.title} - Univerzo Music`,
      text: `Listen to ${track.title} by ${track.artist} on Univerzo Music. No sign-in required!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // We could add a toast here later
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const visibleSimilar = useMemo(() => {
    return filterExplicitTracks(similarTracks, preferences.allowExplicit);
  }, [preferences.allowExplicit, similarTracks]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 pb-8 animate-pulse">
        <div className="h-64 rounded-3xl bg-white/5" />
        <div className="space-y-4">
          <div className="h-8 w-48 rounded bg-white/5" />
          <TrackGrid>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </TrackGrid>
        </div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <CatalogFeedback
        tone="error"
        title="Track unavailable"
        message={error || 'Track not found'}
        actionLabel="Go home"
        actionTo="/"
      />
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-8">
      <Helmet>
        <title>{track.title} by {track.artist} - Univerzo Music</title>
        <meta name="description" content={`Listen to ${track.title} by ${track.artist} on Univerzo Music. High-quality streaming, no sign-in wall.`} />
        <meta property="og:title" content={`${track.title} - ${track.artist}`} />
        <meta property="og:description" content={`Play ${track.title} instantly on Univerzo Music.`} />
        <meta property="og:image" content={track.cover} />
        <meta property="og:type" content="music.song" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* JSON-LD Structured Data for MusicRecording */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicRecording",
            "name": track.title,
            "url": window.location.href,
            "image": track.cover,
            "datePublished": track.releaseDate,
            "duration": `PT${Math.floor(track.durationSeconds / 60)}M${track.durationSeconds % 60}S`,
            "byArtist": {
              "@type": "MusicGroup",
              "name": track.artist,
              "url": `${window.location.origin}/artist/${track.artistSlug}`
            },
            "inAlbum": {
              "@type": "MusicAlbum",
              "name": track.album
            },
            "potentialAction": {
              "@type": "ListenAction",
              "target": [
                {
                  "@type": "EntryPoint",
                  "urlTemplate": window.location.href,
                  "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform",
                    "http://schema.org/IOSPlatform",
                    "http://schema.org/AndroidPlatform"
                  ]
                }
              ],
              "expectsAcceptanceOf": {
                "@type": "Offer",
                "category": "free",
                "availability": "https://schema.org/InStock"
              }
            }
          })}
        </script>
      </Helmet>

      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div 
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle at top left, ${track.color || '#1ed760'}, transparent 50%)` }}
        />
        
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end">
          <div className="group relative h-64 w-64 shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/6 shadow-2xl">
            <img src={track.cover} alt={track.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
               <button 
                onClick={handlePlay}
                className="h-16 w-16 flex items-center justify-center rounded-full bg-brand text-black scale-90 transition-transform group-hover:scale-100"
               >
                 {isCurrentTrack && isPlaying ? <div className="h-6 w-6 bg-black rounded-sm" /> : <Play className="h-8 w-8 fill-black ml-1" />}
               </button>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Single</span>
                {track.isExplicit && <span className="rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-text-subdued">E</span>}
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">{track.title}</h1>
              <Link 
                to={`/artist/${track.artistSlug}`}
                className="inline-block text-lg font-bold text-text-subdued transition-colors hover:text-white hover:underline"
              >
                {track.artist}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-text-subdued">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{track.durationLabel}</span>
              </div>
              {track.releaseDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{track.releaseDate}</span>
                </div>
              )}
              {track.album && (
                <div className="flex items-center gap-2">
                  <Disc3 className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{track.album}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handlePlay}
                className="inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 text-sm font-bold text-black transition-transform hover:scale-[1.02] hover:bg-brand-hover active:scale-95"
              >
                {isCurrentTrack && isPlaying ? (
                  <>Pause Playback</>
                ) : (
                  <><Play className="h-5 w-5 fill-black" /> Play Now</>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLike(track)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10 ${liked ? 'text-brand border-brand/30' : 'text-white'}`}
                  aria-label="Like song"
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-brand' : ''}`} />
                </button>
                <button
                  onClick={() => saveTrackToPlaylist(track)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10 ${savedToPlaylist ? 'text-brand border-brand/30' : 'text-white'}`}
                  aria-label="Add to playlist"
                >
                  <LibraryBig className="h-5 w-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10"
                  aria-label="Share song"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {visibleSimilar.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">More like this</h2>
            <p className="text-sm text-text-subdued">Similar tracks you might enjoy.</p>
          </div>
          <TrackGrid>
            {visibleSimilar.map((t, i) => (
              <TrackCard key={t.id} track={t} queueContext={[track, ...visibleSimilar]} queueIndex={i + 1} />
            ))}
          </TrackGrid>
        </section>
      )}
    </div>
  );
};

export default TrackPage;

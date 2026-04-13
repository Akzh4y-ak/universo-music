import { useMemo } from 'react';
import {
  Clock3,
  Heart,
  ListMusic,
  Pause,
  Play,
  Radio,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import TrackCard from '../components/shared/TrackCard';
import { useMusic } from '../context/music';
import { usePlayer, usePlayerProgress } from '../context/player';
import { getTrackAlbumSlug, getTrackArtistSlug } from '../utils/musicMeta';

function formatTime(time) {
  if (!time || Number.isNaN(time)) {
    return '0:00';
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function formatTimerRemaining(remainingMs) {
  if (!remainingMs || remainingMs <= 0) {
    return 'Off';
  }

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const quickTimerOptions = [15, 30, 45];

const NowPlayingPage = () => {
  const {
    autoAdvance,
    autoRadioEnabled,
    currentTrack,
    cycleRepeatMode,
    isPlaying,
    isRadioLoading,
    playNext,
    playPrev,
    playQueueIndex,
    providerStatus,
    queue,
    queueIndex,
    radioError,
    radioSourceTrack,
    radioTracks,
    repeatMode,
    setAutoAdvance,
    setAutoRadioEnabled,
    shuffleEnabled,
    startRadio,
    togglePlay,
    toggleQueue,
    toggleShuffle,
  } = usePlayer();
  const {
    clearSleepTimer,
    duration,
    progress,
    seekTo,
    setSleepTimer,
    sleepTimerRemainingMs,
  } = usePlayerProgress();
  const { isLiked, toggleLike } = useMusic();

  const progressWidth = `${(progress / (duration || 30)) * 100}%`;
  const upcomingTracks = useMemo(() => {
    return queue.filter((_, index) => index !== queueIndex).slice(0, 6);
  }, [queue, queueIndex]);

  if (!currentTrack) {
    return (
      <div className="flex flex-col gap-8 pb-8">
        <Helmet>
          <title>Now Playing - Univerzo Music</title>
        </Helmet>

        <CatalogFeedback
          title="Nothing is playing right now"
          message="Start a track from home, search, or your library to open the full now-playing experience."
          actionLabel="Browse music"
          actionTo="/"
        />
      </div>
    );
  }

  const liked = isLiked(currentTrack.id);
  const artistSlug = getTrackArtistSlug(currentTrack);
  const albumSlug = getTrackAlbumSlug(currentTrack);
  const showArtistLink = Boolean(currentTrack.artist && artistSlug);
  const showAlbumLink = Boolean(currentTrack.album && albumSlug);

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Helmet>
        <title>Now Playing - {currentTrack.title}</title>
      </Helmet>

      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(30,215,96,0.2),_transparent_32%),linear-gradient(135deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.03))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle,_rgba(255,255,255,0.12),_transparent_60%)] xl:block" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(300px,420px)_minmax(0,1fr)]">
          <div className="space-y-5">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="aspect-square w-full rounded-[28px] object-cover shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => toggleLike(currentTrack)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  liked
                    ? 'border-brand/40 bg-brand/15 text-brand'
                    : 'border-white/10 bg-white/6 text-white hover:bg-white/10'
                }`}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-brand' : ''}`} />
                {liked ? 'Liked' : 'Like track'}
              </button>
              <button
                type="button"
                onClick={() => startRadio(currentTrack)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Radio className="h-4 w-4 text-brand" />
                Start radio
              </button>
              <button
                type="button"
                onClick={toggleQueue}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <ListMusic className="h-4 w-4" />
                Open queue
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Now Playing</p>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                {currentTrack.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                {showArtistLink ? (
                  <Link
                    to={`/artist/${artistSlug}`}
                    state={{ artistName: currentTrack.artist, seedTrack: currentTrack }}
                    className="hover:text-white"
                  >
                    {currentTrack.artist}
                  </Link>
                ) : (
                  <span>{currentTrack.artist || 'Unknown Artist'}</span>
                )}
                {showAlbumLink ? (
                  <Link
                    to={`/album/${albumSlug}`}
                    state={{
                      artistName: currentTrack.artist,
                      albumName: currentTrack.album,
                      seedTrack: currentTrack,
                    }}
                    className="hover:text-white"
                  >
                    {currentTrack.album}
                  </Link>
                ) : null}
                <span className="rounded-full border border-white/8 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-text-subdued">
                  {currentTrack.providerLabel}
                </span>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-text-muted">
                {providerStatus.message}
              </p>
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/8 bg-black/20 p-6">
              <div className="flex items-center gap-5 md:gap-6">
                <button
                  type="button"
                  onClick={toggleShuffle}
                  className={`transition-colors ${shuffleEnabled ? 'text-brand' : 'text-text-subdued hover:text-white'}`}
                >
                  <Shuffle className="h-4 w-4" />
                </button>

                <button onClick={playPrev} className="text-text-muted transition-colors hover:text-white">
                  <SkipBack className="h-6 w-6 fill-current" />
                </button>

                <button
                  onClick={togglePlay}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 fill-current" />
                  ) : (
                    <Play className="ml-1 h-6 w-6 fill-current" />
                  )}
                </button>

                <button onClick={playNext} className="text-text-muted transition-colors hover:text-white">
                  <SkipForward className="h-6 w-6 fill-current" />
                </button>

                <button
                  type="button"
                  onClick={cycleRepeatMode}
                  className={`transition-colors ${repeatMode !== 'off' ? 'text-brand' : 'text-text-subdued hover:text-white'}`}
                >
                  <Repeat className="h-4 w-4" />
                </button>
              </div>

              <div className="group flex w-full items-center gap-3">
                <span className="w-10 text-right text-xs text-text-subdued">{formatTime(progress)}</span>
                <div className="relative flex h-1.5 flex-1 items-center overflow-visible rounded-full bg-white/10">
                  <input
                    type="range"
                    min="0"
                    max={duration || 30}
                    step="0.1"
                    value={progress}
                    onChange={(event) => seekTo(parseFloat(event.target.value))}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div
                    className="absolute left-0 h-full rounded-full bg-white transition-colors ease-linear group-hover:bg-brand"
                    style={{ width: progressWidth }}
                  />
                  <div
                    className="pointer-events-none absolute h-4 w-4 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                    style={{ left: `calc(${progressWidth} - 8px)` }}
                  />
                </div>
                <span className="w-10 text-xs text-text-subdued">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text-subdued">Queue</p>
                <p className="mt-2 text-3xl font-black text-white">{queue.length}</p>
                <p className="mt-1 text-sm text-text-muted">tracks in the active session</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text-subdued">Sleep Timer</p>
                <p className="mt-2 text-3xl font-black text-white">{formatTimerRemaining(sleepTimerRemainingMs)}</p>
                <p className="mt-1 text-sm text-text-muted">remaining before playback pauses</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text-subdued">Radio Mode</p>
                <p className="mt-2 text-3xl font-black text-white">{autoRadioEnabled ? 'On' : 'Off'}</p>
                <p className="mt-1 text-sm text-text-muted">autoplay similar tracks when the queue ends</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Session Controls</h2>
                <p className="text-sm text-text-subdued">Tune the current listening session without leaving the player.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Auto-advance queue</p>
                  <p className="text-xs leading-5 text-text-subdued">Move to the next track automatically when a song ends.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoAdvance(!autoAdvance)}
                  className={`inline-flex h-8 w-14 items-center rounded-full p-1 transition-colors ${
                    autoAdvance ? 'bg-brand' : 'bg-white/10'
                  }`}
                  aria-pressed={autoAdvance}
                >
                  <span
                    className={`h-6 w-6 rounded-full bg-white transition-transform ${
                      autoAdvance ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Autoplay radio</p>
                  <p className="text-xs leading-5 text-text-subdued">When the queue ends, pull in more tracks based on the current song.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRadioEnabled(!autoRadioEnabled)}
                  className={`inline-flex h-8 w-14 items-center rounded-full p-1 transition-colors ${
                    autoRadioEnabled ? 'bg-brand' : 'bg-white/10'
                  }`}
                  aria-pressed={autoRadioEnabled}
                >
                  <span
                    className={`h-6 w-6 rounded-full bg-white transition-transform ${
                      autoRadioEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Sleep timer</p>
                    <p className="text-xs leading-5 text-text-subdued">Pause this session after a set amount of time.</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.24em] text-text-subdued">
                    {formatTimerRemaining(sleepTimerRemainingMs)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {quickTimerOptions.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => setSleepTimer(minutes)}
                      className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-white/12"
                    >
                      {minutes} min
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearSleepTimer}
                    className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-text-subdued transition-colors hover:text-white"
                  >
                    Turn off
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Related Radio</h2>
                <p className="text-sm text-text-subdued">
                  {radioSourceTrack
                    ? `Built from ${radioSourceTrack.title} by ${radioSourceTrack.artist}.`
                    : 'Generate a related queue based on the current track.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => startRadio(currentTrack)}
                className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] hover:bg-brand-hover"
              >
                Refresh radio
              </button>
            </div>

            {isRadioLoading ? (
              <div className="rounded-2xl border border-white/8 bg-black/20 p-5 text-sm leading-6 text-text-muted">
                Loading related tracks from the live catalog...
              </div>
            ) : radioError ? (
              <CatalogFeedback
                tone="error"
                title="Radio is unavailable"
                message={radioError}
              />
            ) : radioTracks.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {radioTracks.slice(0, 6).map((track, index) => (
                  <TrackCard
                    key={`radio-${track.id}-${index}`}
                    track={track}
                    queueContext={radioTracks}
                    queueIndex={index}
                  />
                ))}
              </div>
            ) : (
              <CatalogFeedback
                title="No radio session yet"
                message="Start radio to generate a related listening lane from the song that is playing."
              />
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
                <ListMusic className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Up Next</h2>
                <p className="text-sm text-text-subdued">The current queue, ready to jump around.</p>
              </div>
            </div>

            {upcomingTracks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTracks.map((track) => {
                  const actualIndex = queue.findIndex((queuedTrack) => queuedTrack.id === track.id);

                  return (
                    <button
                      key={`${track.id}-${actualIndex}`}
                      type="button"
                      onClick={() => playQueueIndex(actualIndex)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-3 py-3 text-left transition-colors hover:bg-white/8"
                    >
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white text-truncate-1">{track.title}</p>
                        <p className="text-xs text-text-muted text-truncate-1">{track.artist}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.24em] text-text-subdued">
                        {track.durationLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <CatalogFeedback
                title="Nothing queued after this track"
                message="Use radio or play a playlist to build a longer session."
              />
            )}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default NowPlayingPage;

import { useEffect } from 'react';
import {
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMusic } from '../../context/music';
import { usePlayer, usePlayerProgress } from '../../context/player';
import { getTrackAlbumSlug, getTrackArtistSlug } from '../../utils/musicMeta';

const BottomPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    volume,
    setVolume,
    shuffleEnabled,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
    toggleQueue,
  } = usePlayer();
  const { progress, duration, seekTo } = usePlayerProgress();
  const { isLiked, toggleLike, addRecent } = useMusic();

  useEffect(() => {
    if (currentTrack) {
      addRecent(currentTrack);
    }
  }, [currentTrack, addRecent]);

  if (!currentTrack) {
    return null;
  }

  const liked = isLiked(currentTrack.id);

  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) {
      return '0:00';
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressWidth = `${(progress / (duration || 30)) * 100}%`;
  const volumeWidth = `${volume * 100}%`;
  const artistSlug = getTrackArtistSlug(currentTrack);
  const albumSlug = getTrackAlbumSlug(currentTrack);
  const showArtistLink = Boolean(currentTrack.artist && artistSlug);
  const showAlbumLink = Boolean(currentTrack.album && albumSlug);

  return (
  return (
    <div 
      className="glass-panel relative mx-2 h-16 w-[calc(100%-16px)] rounded-2xl border border-white/10 px-3 py-2 md:static md:mx-0 md:h-auto md:w-full md:rounded-none md:border-x-0 md:border-t md:px-6 md:py-3 transition-all duration-1000"
      style={{
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 -4px 20px var(--player-theme-alpha)`
      }}
    >
      {/* Mobile-only Progress Bar at the Top */}
      <div className="absolute -top-[1px] left-4 right-4 h-[2px] overflow-hidden rounded-full bg-white/5 md:hidden">
        <div 
            className="h-full transition-all duration-500" 
            style={{ width: progressWidth, backgroundColor: 'var(--player-theme-color)' }} 
        />
      </div>


      <div className="flex items-center justify-between md:grid md:gap-3 md:grid-cols-[minmax(220px,1fr)_minmax(320px,1.2fr)_minmax(180px,0.8fr)] md:items-center">
        <div className="flex min-w-0 flex-1 md:flex-none items-center gap-3 pr-2 md:pr-0">
          <Link to="/now-playing" className="shrink-0 flex items-center">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="h-10 w-10 rounded-lg object-cover shadow-lg md:h-14 md:w-14 md:rounded-xl"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link to="/now-playing" className="block text-sm font-semibold text-text-base text-truncate-1">
              {currentTrack.title}
            </Link>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
              {showArtistLink ? (
                <Link
                  to={`/artist/${artistSlug}`}
                  state={{ artistName: currentTrack.artist, seedTrack: currentTrack }}
                  className="text-truncate-1 hover:text-white"
                >
                  {currentTrack.artist}
                </Link>
              ) : (
                <span className="text-truncate-1">{currentTrack.artist || 'Unknown Artist'}</span>
              )}
              {showAlbumLink ? (
                <span className="hidden text-text-subdued sm:inline">|</span>
              ) : null}
              {showAlbumLink ? (
                <Link
                  to={`/album/${albumSlug}`}
                  state={{
                    artistName: currentTrack.artist,
                    albumName: currentTrack.album,
                    seedTrack: currentTrack,
                  }}
                  className="hidden text-truncate-1 hover:text-white sm:inline"
                >
                  {currentTrack.album}
                </Link>
              ) : null}
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:hidden ml-auto shrink-0">
            <button
              onClick={() => toggleLike(currentTrack)}
              className="p-2 transition-transform hover:scale-110"
              aria-label={liked ? 'Remove from liked songs' : 'Add to liked songs'}
            >
              <Heart
                className={`h-5 w-5 ${
                  liked ? 'fill-brand text-brand' : 'text-text-muted'
                }`}
              />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center text-white"
            >
              {isPlaying ? (
                <Pause className="h-7 w-7 fill-current" />
              ) : (
                <Play className="h-7 w-7 fill-current ml-0.5" />
              )}
            </button>
          </div>

          <button
            onClick={() => toggleLike(currentTrack)}
            className="hidden md:block transition-transform hover:scale-110 ml-2"
            aria-label={liked ? 'Remove from liked songs' : 'Add to liked songs'}
          >
            <Heart
              className={`h-5 w-5 ${
                liked ? 'fill-brand text-brand' : 'text-text-muted hover:text-white'
              }`}
            />
          </button>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-5 md:gap-6">
            <button
              type="button"
              onClick={toggleShuffle}
              className={`hidden transition-colors md:block ${
                shuffleEnabled ? 'text-brand' : 'text-text-subdued hover:text-white'
              }`}
            >
              <Shuffle className="h-4 w-4" />
            </button>

            <button onClick={playPrev} className="text-text-muted transition-colors hover:text-white">
              <SkipBack className="h-5 w-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all hover:scale-105"
              style={{ boxShadow: `0 0 15px var(--player-theme-alpha)` }}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="ml-1 h-5 w-5 fill-current" />
              )}
            </button>

            <button onClick={playNext} className="text-text-muted transition-colors hover:text-white">
              <SkipForward className="h-5 w-5 fill-current" />
            </button>

            <button
              type="button"
              onClick={cycleRepeatMode}
              className={`hidden transition-colors md:block ${
                repeatMode !== 'off' ? 'text-brand' : 'text-text-subdued hover:text-white'
              }`}
            >
              <Repeat className="h-4 w-4" />
              {repeatMode === 'one' ? (
                <span className="sr-only">Repeat one</span>
              ) : null}
            </button>
          </div>

          <div className="group flex w-full items-center gap-2">
            <span className="w-8 text-right text-[10px] text-text-subdued">{formatTime(progress)}</span>
            <div className="relative flex h-1 flex-1 items-center overflow-visible rounded-full bg-white/10">
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
                className="absolute left-0 h-full rounded-full transition-all ease-linear"
                style={{ width: progressWidth, backgroundColor: 'var(--player-theme-color)' }}
              />
              <div
                className="pointer-events-none absolute h-3 w-3 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                style={{ left: `calc(${progressWidth} - 6px)` }}
              />
            </div>
            <span className="w-8 text-[10px] text-text-subdued">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden items-center justify-end gap-3 md:flex">
          <button
            type="button"
            onClick={toggleQueue}
            className="text-text-muted hover:text-white"
            aria-label="Open queue"
          >
            <ListMusic className="h-5 w-5" />
          </button>
          <button
            onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
            className="text-text-muted hover:text-white"
          >
            {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <div className="group relative flex h-1 w-24 cursor-pointer items-center overflow-visible rounded-full bg-white/10">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(parseFloat(event.target.value))}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />
            <div
              className="pointer-events-none absolute left-0 h-full rounded-full bg-white transition-colors group-hover:bg-brand"
              style={{ width: volumeWidth }}
            />
            <div
              className="pointer-events-none absolute h-3 w-3 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
              style={{ left: `calc(${volumeWidth} - 6px)` }}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default BottomPlayer;

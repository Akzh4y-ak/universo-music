
import {
  ChevronDown,
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import AudioVisualizer from '../components/player/AudioVisualizer';
import Seo from '../components/seo/Seo';
import { useMusic } from '../context/music';
import { usePlayer, usePlayerProgress } from '../context/player';
import { getTrackArtistSlug } from '../utils/musicMeta';

function formatTime(time) {
  if (!time || Number.isNaN(time)) {
    return '0:00';
  }
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const NowPlayingPage = () => {
  const navigate = useNavigate();
  const {
    currentTrack,
    cycleRepeatMode,
    isPlaying,
    playNext,
    playPrev,
    repeatMode,
    shuffleEnabled,
    togglePlay,
    toggleShuffle,
    toggleQueue,
  } = usePlayer();
  
  const { duration, progress, seekTo } = usePlayerProgress();
  const { isLiked, toggleLike } = useMusic();

  const progressPct = (progress / (duration || 30)) * 100;
  
  if (!currentTrack) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-8 text-center">
        <Seo
          title="Now Playing | Univerzo Music"
          description="Expanded now playing experience inside Univerzo Music."
          path="/now-playing"
          noindex
        />
        <CatalogFeedback
          title="Nothing is playing"
          message="Pick a song to start the immersive experience."
          actionLabel="Go Home"
          actionTo="/"
        />
      </div>
    );
  }

  const liked = isLiked(currentTrack.id);
  const artistSlug = getTrackArtistSlug(currentTrack);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col overflow-hidden text-white sm:static sm:h-full sm:rounded-[32px] sm:border sm:border-white/10 sm:shadow-2xl transition-colors duration-1000"
      style={{
        background: `radial-gradient(circle at 50% 30%, var(--player-theme-alpha) 0%, rgba(0,0,0,1) 85%)`
      }}
    >
      <Seo
        title={`Now Playing: ${currentTrack.title} | Univerzo Music`}
        description={`Current playback view for ${currentTrack.title} on Univerzo Music.`}
        path="/now-playing"
        noindex
      />
      {/* Dynamic Background Accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div 
          className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full opacity-30 blur-[120px] transition-colors duration-1000"
          style={{ backgroundColor: 'var(--player-theme-color)' }}
        />
        <div 
          className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full opacity-20 blur-[120px] transition-colors duration-1000"
          style={{ backgroundColor: 'var(--player-theme-color)' }}
        />
      </div>
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subdued">Now Playing</p>
          <p className="text-xs font-semibold text-white/90">{currentTrack.album || 'Unknown Album'}</p>
        </div>
        <button 
          onClick={toggleQueue}
          className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
        >
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </header>

      {/* Main Content Area: Centered Artwork with Visualizer */}
      <main className="flex flex-1 flex-col items-center justify-center px-8 relative">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
           <AudioVisualizer className="max-w-2xl h-64" />
        </div>

        <div className="relative z-10 group w-full max-w-[280px] sm:max-w-[400px]">
          <div 
            className="absolute -inset-10 rounded-full blur-[80px] opacity-40 transition-all duration-1000 group-hover:opacity-60" 
            style={{ backgroundColor: 'var(--player-theme-color)' }}
          />
          <div className={`relative aspect-square w-full rounded-full border-[10px] border-white/5 bg-black/60 p-1 shadow-[0_30px_90px_rgba(0,0,0,0.8)] transition-transform duration-500 scale-95 group-hover:scale-100 ${isPlaying ? 'animate-rotate' : 'animate-rotate animate-rotate-paused'}`}>
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="h-full w-full rounded-full object-cover"
            />
            {/* Inner "Vinyl" hole effect */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
               <div className="h-4 w-4 rounded-full border-2 border-white/20 bg-black/60 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>
      </main>

      {/* Player Controls & Info Area */}
      <footer className="relative z-10 space-y-6 px-8 pb-12 pt-6 sm:pb-8">
        {/* Track Title & Artist */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl line-clamp-1">{currentTrack.title}</h1>
            <Link
              to={`/artist/${artistSlug}`}
              className="mt-1 block text-lg font-medium text-text-muted transition-colors hover:text-brand"
            >
              {currentTrack.artist}
            </Link>
          </div>
          <button
            onClick={() => toggleLike(currentTrack)}
            className="p-2 transition-transform active:scale-90"
          >
            <Heart className={`h-8 w-8 ${liked ? 'fill-brand text-brand' : 'text-white/60'}`} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="group relative h-1.5 w-full rounded-full bg-white/10">
            <input
              type="range"
              min="0"
              max={duration || 30}
              step="0.1"
              value={progress}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />
            <div
              className="absolute left-0 h-full rounded-full bg-white group-hover:opacity-80"
              style={{ width: `${progressPct}%`, backgroundColor: 'var(--player-theme-color)' }}
            />
            <div
              className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-100"
              style={{ left: `calc(${progressPct}% - 6px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold tracking-widest text-text-subdued uppercase">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleShuffle}
            className={`p-2 transition-colors ${shuffleEnabled ? 'text-brand' : 'text-white/40'}`}
          >
            <Shuffle className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-8">
            <button
              onClick={playPrev}
              className="text-white transition-transform active:scale-90"
            >
              <SkipBack className="h-8 w-8 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black shadow-[0_15px_45px_rgba(0,0,0,0.5)] transition-all hover:scale-110 active:scale-95"
              style={{ boxShadow: `0 15px 45px var(--player-theme-alpha)` }}
            >
              {isPlaying ? (
                <Pause className="h-10 w-10 fill-current" />
              ) : (
                <Play className="ml-1 h-10 w-10 fill-current" />
              )}
            </button>

            <button
              onClick={playNext}
              className="text-white transition-transform active:scale-90"
            >
              <SkipForward className="h-8 w-8 fill-current" />
            </button>
          </div>

          <button
            onClick={cycleRepeatMode}
            className={`p-2 transition-colors ${repeatMode !== 'off' ? 'text-brand' : 'text-white/40'}`}
          >
            <Repeat className="h-6 w-6" />
          </button>
        </div>

        {/* Lyrics/Up Next Pull-up Indicator */}
        <div className="flex flex-col items-center pt-2">
          <div className="h-1 w-12 rounded-full bg-white/20" />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Lyrics</p>
        </div>
      </footer>
    </div>
  );
};

export default NowPlayingPage;

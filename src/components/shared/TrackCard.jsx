import { memo } from 'react';
import { Play, Heart, LibraryBig } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/player';
import { useMusic } from '../../context/music';
import { motion } from 'framer-motion';
import { getTrackAlbumSlug, getTrackArtistSlug } from '../../utils/musicMeta';

const MotionCard = motion.div;

const TrackCard = memo(({ track, queueContext = [], queueIndex = 0 }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const { isLiked, toggleLike, isTrackInAnyPlaylist, saveTrackToPlaylist } = useMusic();

  const isCurrentTrack = currentTrack?.id === track.id;
  const liked = isLiked(track.id);
  const savedToPlaylist = isTrackInAnyPlaylist(track.id);
  const artistSlug = getTrackArtistSlug(track);
  const albumSlug = getTrackAlbumSlug(track);
  const showArtistLink = Boolean(track.artist && artistSlug);
  const showAlbumLink = Boolean(track.album && albumSlug);
  const metaPills = [track.providerLabel, track.durationLabel].filter(Boolean);

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track, queueContext, queueIndex);
    }
  };

  const handleCoverKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    handlePlay();
  };

  return (
    <MotionCard
      whileHover={{ y: 0 }}
      className="group relative flex h-full flex-col rounded-md bg-[#181818] p-4 transition-all hover:bg-[#282828]"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handlePlay}
        onKeyDown={handleCoverKeyDown}
        className="relative mb-4 block aspect-square w-full overflow-hidden rounded-md bg-[#232323] text-left shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
        aria-label={isCurrentTrack && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
      >
        <img
          src={track.cover}
          alt={track.title}
          className="h-full w-full object-cover transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {track.isExplicit ? (
          <span className="absolute right-2 top-2 rounded-sm bg-[#b3b3b3]/80 px-[5px] py-[2px] text-[10px] font-bold leading-none text-black">
            E
          </span>
        ) : null}

        <div className={`absolute bottom-2 right-2 transition-all duration-300 ${
          isCurrentTrack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
        }`}>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handlePlay();
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand shadow-xl transition-transform hover:scale-105 hover:bg-brand-hover"
            aria-label={isCurrentTrack && isPlaying ? 'Pause current track' : 'Play track'}
          >
            <div className={isCurrentTrack && isPlaying ? 'h-4 w-4 bg-black rounded-[2px]' : 'h-5 w-5'}>
              {isCurrentTrack && isPlaying ? null : <Play className="ml-0.5 h-5 w-5 fill-black text-black" />}
            </div>
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col justify-between">
        <div className="mb-2">
          <h3 className={`text-truncate-1 text-base font-bold ${isCurrentTrack ? 'text-brand' : 'text-white'}`}>
            {track.title}
          </h3>
          <div className="mt-1 text-truncate-2 text-sm text-[#a7a7a7]">
            {showArtistLink ? (
              <Link
                to={`/artist/${artistSlug}`}
                state={{ artistName: track.artist, seedTrack: track }}
                className="transition-colors hover:text-white hover:underline"
              >
                {track.artist}
              </Link>
            ) : (
              <span>{track.artist || 'Unknown Artist'}</span>
            )}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pb-1">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#a7a7a7] opacity-0 transition-opacity group-hover:opacity-100">
            {track.durationLabel}
          </div>

          <div className="flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => saveTrackToPlaylist(track)}
              className="rounded-full p-1.5 text-[#a7a7a7] transition-colors hover:text-white"
              aria-label={savedToPlaylist ? 'Track saved to playlist' : 'Save track to playlist'}
            >
              <LibraryBig className={`h-[18px] w-[18px] ${savedToPlaylist ? 'text-brand' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => toggleLike(track)}
              className="rounded-full p-1.5 text-[#a7a7a7] transition-colors hover:text-white"
              aria-label={liked ? 'Remove from liked songs' : 'Add to liked songs'}
            >
              <Heart className={`h-[18px] w-[18px] ${liked ? 'fill-brand text-brand' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </MotionCard>
  );
});

export default TrackCard;

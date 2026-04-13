import { useEffect } from 'react';
import { usePlayer } from '../context/player';

export const useKeyboardShortcuts = () => {
  const { togglePlay, playNext, playPrev, toggleQueue } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault(); // Prevent scrolling down
          togglePlay();
          break;
        case 'ArrowRight':
          // Optionally this could be seek forward, but we'll map to next for simplicity unless seeking is implemented in player
          playNext();
          break;
        case 'ArrowLeft':
          playPrev();
          break;
        case 'KeyQ':
          toggleQueue();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, playNext, playPrev, toggleQueue]);
};

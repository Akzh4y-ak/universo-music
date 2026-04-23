import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { getMusicProviderInfo } from '../config/music';
import { searchTracks } from '../services/api';
import { PlayerContext, PlayerProgressContext } from './player';
import { readStoredJson, readStoredNumber, readStoredString } from '../utils/storage';
import { getDominantColor } from '../utils/colors';

function clearAudioSource(audio) {
  audio.pause();
  audio.removeAttribute('src');
  audio.load();
}

export const PlayerProvider = ({ children }) => {
  const providerInfo = getMusicProviderInfo();
  const [currentTrack, setCurrentTrack] = useState(() => {
    const storedTrack = readStoredJson('univerzo_current_track', null);
    return storedTrack && typeof storedTrack === 'object' ? storedTrack : null;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState(() => {
    const storedQueue = readStoredJson('univerzo_queue', []);
    return Array.isArray(storedQueue) ? storedQueue.filter(Boolean) : [];
  });
  const [queueIndex, setQueueIndex] = useState(() => {
    return readStoredNumber('univerzo_queue_index', -1);
  });
  const [playbackEngine, setPlaybackEngine] = useState('html-audio');
  const [volume, setVolume] = useState(() => {
    const storedVolume = readStoredNumber('univerzo_volume', 0.5);
    return storedVolume >= 0 && storedVolume <= 1 ? storedVolume : 0.5;
  });
  const [shuffleEnabled, setShuffleEnabled] = useState(() => {
    return localStorage.getItem('univerzo_shuffle') === 'true';
  });
  const [repeatMode, setRepeatMode] = useState(() => {
    return readStoredString('univerzo_repeat_mode', 'off');
  });
  const [autoAdvance, setAutoAdvance] = useState(() => {
    return localStorage.getItem('univerzo_auto_advance') !== 'false';
  });
  const [autoRadioEnabled, setAutoRadioEnabled] = useState(() => {
    return localStorage.getItem('univerzo_auto_radio') !== 'false';
  });
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(() => currentTrack?.durationSeconds || 30);
  const [sleepTimerEndsAt, setSleepTimerEndsAt] = useState(() => {
    const storedTime = readStoredNumber('univerzo_sleep_timer_ends_at', null);
    return typeof storedTime === 'number' ? storedTime : null;
  });
  const [sleepTimerTick, setSleepTimerTick] = useState(() => Date.now());
  const [radioSourceTrack, setRadioSourceTrack] = useState(null);
  const [radioTracks, setRadioTracks] = useState([]);
  const [isRadioLoading, setIsRadioLoading] = useState(false);
  const [radioError, setRadioError] = useState('');
  const [providerStatus, setProviderStatus] = useState({
    ...providerInfo,
    isAuthorizing: false,
    isAuthorized: false,
    message: providerInfo.summary,
  });
  const [themeColor, setThemeColor] = useState('rgb(18, 18, 18)');

  const audioRef = useRef(new Audio());
  const loadedTrackUrlRef = useRef('');

  useEffect(() => {
    localStorage.setItem('univerzo_volume', volume.toString());
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('univerzo_queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('univerzo_queue_index', queueIndex.toString());
  }, [queueIndex]);

  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('univerzo_current_track', JSON.stringify(currentTrack));
    } else {
      localStorage.removeItem('univerzo_current_track');
    }
  }, [currentTrack]);

  useEffect(() => {
    localStorage.setItem('univerzo_shuffle', String(shuffleEnabled));
  }, [shuffleEnabled]);

  useEffect(() => {
    localStorage.setItem('univerzo_repeat_mode', repeatMode);
  }, [repeatMode]);

  useEffect(() => {
    localStorage.setItem('univerzo_auto_advance', String(autoAdvance));
  }, [autoAdvance]);

  useEffect(() => {
    localStorage.setItem('univerzo_auto_radio', String(autoRadioEnabled));
  }, [autoRadioEnabled]);

  useEffect(() => {
    if (sleepTimerEndsAt) {
      localStorage.setItem('univerzo_sleep_timer_ends_at', sleepTimerEndsAt.toString());
      return;
    }

    localStorage.removeItem('univerzo_sleep_timer_ends_at');
  }, [sleepTimerEndsAt]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.preload = 'auto';
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const nextTrackUrl = currentTrack?.url;

    if (!nextTrackUrl) {
      if (loadedTrackUrlRef.current) {
        loadedTrackUrlRef.current = '';
        clearAudioSource(audio);
      }
      return;
    }

    if (loadedTrackUrlRef.current === nextTrackUrl) {
      return;
    }

    loadedTrackUrlRef.current = nextTrackUrl;
    audio.src = nextTrackUrl;
    audio.load();

    // Extract dominant color from artwork
    if (currentTrack?.cover || currentTrack?.image) {
      getDominantColor(currentTrack.cover || currentTrack.image).then(color => {
        setThemeColor(color);
        document.documentElement.style.setProperty('--player-theme-color', color);
        document.documentElement.style.setProperty('--player-theme-alpha', color.replace('rgb', 'rgba').replace(')', ', 0.4)'));
      });
    } else {
      setThemeColor('rgb(30, 215, 96)');
      document.documentElement.style.setProperty('--player-theme-color', 'rgb(30, 215, 96)');
      document.documentElement.style.setProperty('--player-theme-alpha', 'rgba(30, 215, 96, 0.4)');
    }
  }, [currentTrack]);

  useEffect(() => {
    if (!sleepTimerEndsAt) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      const now = Date.now();

      if (sleepTimerEndsAt <= now) {
        audioRef.current.pause();
        setIsPlaying(false);
        setSleepTimerEndsAt(null);
        setSleepTimerTick(now);
        setProviderStatus((previous) => ({
          ...previous,
          message: 'Sleep timer ended and playback was paused.',
        }));
        window.clearInterval(interval);
        return;
      }

      setSleepTimerTick(now);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [sleepTimerEndsAt]);

  const loadTrackUrl = useCallback(async (url) => {
    const audio = audioRef.current;

    if (!url) {
      loadedTrackUrlRef.current = '';
      clearAudioSource(audio);
      setIsPlaying(false);
      return;
    }

    if (loadedTrackUrlRef.current !== url) {
      loadedTrackUrlRef.current = url;
      audio.src = url;
      audio.load();
    }

    audio.volume = volume;
    try {
      await audio.play();
      setIsPlaying(true);
      setPlaybackEngine('html-audio');
    } catch (err) {
      console.error('Audio playback failed', err);
      setIsPlaying(false);
    }
  }, [volume]);

  const fetchRadioCandidates = useCallback(async (seedTrack, excludeTrackIds = [], limit = 12) => {
    if (!seedTrack) {
      return [];
    }

    const queries = Array.from(
      new Set(
        [
          `${seedTrack.artist || ''} ${seedTrack.album || ''}`.trim(),
          `${seedTrack.artist || ''} ${seedTrack.title || ''}`.trim(),
          seedTrack.artist || '',
          seedTrack.title || '',
        ].filter(Boolean),
      ),
    );

    const excludedIds = new Set(excludeTrackIds.filter(Boolean));
    excludedIds.add(seedTrack.id);

    for (const query of queries) {
      const results = await searchTracks(query, limit + 8);
      const filteredResults = results.filter((track) => {
        return track?.url && !excludedIds.has(track.id);
      });

      const sameArtistResults = filteredResults.filter((track) => track.artist === seedTrack.artist);
      const preferredResults = sameArtistResults.length > 0 ? sameArtistResults : filteredResults;

      if (preferredResults.length > 0) {
        return preferredResults.slice(0, limit);
      }
    }

    return [];
  }, []);

  const getNextShuffleIndex = useCallback(() => {
    if (queue.length <= 1) {
      return queueIndex;
    }

    let nextIndex = queueIndex;

    while (nextIndex === queueIndex) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    return nextIndex;
  }, [queue.length, queueIndex]);

  const playTrack = useCallback(async (track, newQueue = [], index = 0) => {
    if (!track) {
      return;
    }

    setCurrentTrack(track);
    setProgress(0);
    setDuration(track.durationSeconds || 30);

    if (newQueue.length > 0) {
      setQueue(newQueue);
      setQueueIndex(index);
    } else {
      setQueue([track]);
      setQueueIndex(0);
    }

    if (track.url) {
      await loadTrackUrl(track.url);
      setProviderStatus((previous) => ({
        ...previous,
        message: 'Streaming track audio.',
      }));
      return;
    }

    setIsPlaying(false);
    loadTrackUrl(null);
    setProviderStatus((previous) => ({
      ...previous,
      message: 'This track is missing a playable source.',
    }));
  }, [loadTrackUrl]);

  const extendQueueWithRadio = useCallback(async (seedTrack, existingQueue = []) => {
    if (!seedTrack) {
      setIsPlaying(false);
      return;
    }

    setIsRadioLoading(true);
    setRadioError('');
    setRadioSourceTrack(seedTrack);

    try {
      const results = await fetchRadioCandidates(
        seedTrack,
        existingQueue.map((track) => track.id),
      );

      setRadioTracks(results);

      if (results.length === 0) {
        setRadioError('No related tracks were available to continue radio.');
        setProviderStatus((previous) => ({
          ...previous,
          message: 'Playback stopped because no related tracks were available for radio continuation.',
        }));
        setIsPlaying(false);
        return;
      }

      const nextQueue = [...existingQueue, ...results];
      const nextIndex = existingQueue.length;

      setProviderStatus((previous) => ({
        ...previous,
        message: `Autoplay radio found ${results.length} related tracks.`,
      }));

      await playTrack(results[0], nextQueue, nextIndex);
    } catch (error) {
      setRadioTracks([]);
      setRadioError(error.message || 'Radio could not load related tracks right now.');
      setProviderStatus((previous) => ({
        ...previous,
        message: error.message || 'Radio could not load related tracks right now.',
      }));
      setIsPlaying(false);
    } finally {
      setIsRadioLoading(false);
    }
  }, [fetchRadioCandidates, playTrack]);

  const startRadio = useCallback(async (seedTrack = currentTrack) => {
    if (!seedTrack) {
      return;
    }

    setIsRadioLoading(true);
    setRadioError('');
    setRadioSourceTrack(seedTrack);

    try {
      const results = await fetchRadioCandidates(seedTrack, [seedTrack.id]);
      setRadioTracks(results);

      if (results.length === 0) {
        setRadioError('No related tracks were available for this radio.');
        setProviderStatus((previous) => ({
          ...previous,
          message: 'No related tracks were available to start a radio session for this song.',
        }));
        return;
      }

      const nextQueue = [seedTrack, ...results];

      if (currentTrack?.id === seedTrack.id) {
        setQueue(nextQueue);
        setQueueIndex(0);
        setProviderStatus((previous) => ({
          ...previous,
          message: `Radio is ready with ${results.length} related tracks after the current song.`,
        }));
        return;
      }

      setProviderStatus((previous) => ({
        ...previous,
        message: `Starting radio from ${seedTrack.artist}.`,
      }));

      await playTrack(seedTrack, nextQueue, 0);
    } catch (error) {
      setRadioTracks([]);
      setRadioError(error.message || 'Radio could not load right now.');
      setProviderStatus((previous) => ({
        ...previous,
        message: error.message || 'Radio could not load right now.',
      }));
    } finally {
      setIsRadioLoading(false);
    }
  }, [currentTrack, fetchRadioCandidates, playTrack]);

  const playNext = useCallback(() => {
    if (!queue.length) {
      setIsPlaying(false);
      return;
    }

    if (repeatMode === 'one' && currentTrack) {
      playTrack(currentTrack, queue, Math.max(queueIndex, 0));
      return;
    }

    if (shuffleEnabled && queue.length > 1) {
      const nextIndex = getNextShuffleIndex();
      playTrack(queue[nextIndex], queue, nextIndex);
      return;
    }

    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      playTrack(queue[nextIndex], queue, nextIndex);
      return;
    }

    if (repeatMode === 'all') {
      playTrack(queue[0], queue, 0);
      return;
    }

    if (autoRadioEnabled && currentTrack) {
      void extendQueueWithRadio(currentTrack, queue);
      return;
    }

    setIsPlaying(false);
  }, [
    autoRadioEnabled,
    currentTrack,
    extendQueueWithRadio,
    getNextShuffleIndex,
    playTrack,
    queue,
    queueIndex,
    repeatMode,
    shuffleEnabled,
  ]);

  const playPrev = useCallback(() => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      playTrack(queue[prevIndex], queue, prevIndex);
      return;
    }

    if (repeatMode === 'all' && queue.length > 1) {
      const prevIndex = queue.length - 1;
      playTrack(queue[prevIndex], queue, prevIndex);
      return;
    }

    audioRef.current.currentTime = 0;
  }, [playTrack, queue, queueIndex, repeatMode]);

  const playQueueIndex = useCallback((index) => {
    if (index < 0 || index >= queue.length) {
      return;
    }

    playTrack(queue[index], queue, index);
  }, [playTrack, queue]);

  const moveQueueItem = useCallback((fromIndex, toIndex) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= queue.length ||
      toIndex >= queue.length
    ) {
      return;
    }

    setQueue((previous) => {
      const nextQueue = [...previous];
      const [movedTrack] = nextQueue.splice(fromIndex, 1);
      nextQueue.splice(toIndex, 0, movedTrack);
      return nextQueue;
    });

    setQueueIndex((previousIndex) => {
      if (previousIndex === fromIndex) {
        return toIndex;
      }

      if (fromIndex < previousIndex && toIndex >= previousIndex) {
        return previousIndex - 1;
      }

      if (fromIndex > previousIndex && toIndex <= previousIndex) {
        return previousIndex + 1;
      }

      return previousIndex;
    });
  }, [queue.length]);

  const removeQueueItem = useCallback((index) => {
    if (index < 0 || index >= queue.length) {
      return;
    }

    const nextQueue = queue.filter((_, queueTrackIndex) => queueTrackIndex !== index);

    if (nextQueue.length === 0) {
      audioRef.current.pause();
      setQueue([]);
      setQueueIndex(-1);
      setCurrentTrack(null);
      setProgress(0);
      setDuration(0);
      setIsPlaying(false);
      return;
    }

    if (index === queueIndex) {
      const nextIndex = index >= nextQueue.length ? nextQueue.length - 1 : index;
      playTrack(nextQueue[nextIndex], nextQueue, nextIndex);
      return;
    }

    setQueue(nextQueue);
    setQueueIndex((previousIndex) => {
      return previousIndex > index ? previousIndex - 1 : previousIndex;
    });
  }, [playTrack, queue, queueIndex]);

  const clearQueue = useCallback(() => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
      return;
    }

    setQueue([]);
    setQueueIndex(-1);
  }, [currentTrack]);

  const setSleepTimer = useCallback((minutes) => {
    if (!minutes || minutes <= 0) {
      setSleepTimerTick(Date.now());
      setSleepTimerEndsAt(null);
      return;
    }

    const now = Date.now();
    setSleepTimerTick(now);
    setSleepTimerEndsAt(now + minutes * 60 * 1000);
  }, []);

  const clearSleepTimer = useCallback(() => {
    setSleepTimerTick(Date.now());
    setSleepTimerEndsAt(null);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleDurationChange = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
    };
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handleEnded = () => {
      if (!autoAdvance) {
        audio.currentTime = 0;
        setProgress(0);
        setIsPlaying(false);
        return;
      }

      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, [autoAdvance, playNext]);

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;

    const audio = audioRef.current;
    if (!audio.src && currentTrack.url) {
      loadTrackUrl(currentTrack.url);
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => console.error('Play error:', error));
    }
  }, [currentTrack, isPlaying, loadTrackUrl]);

  const seekTo = useCallback((time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffleEnabled((previous) => !previous);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((previous) => {
      if (previous === 'off') return 'all';
      if (previous === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleQueue = useCallback(() => {
    setIsQueueOpen((previous) => !previous);
  }, []);

  const closeQueue = useCallback(() => {
    setIsQueueOpen(false);
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    queue,
    queueIndex,
    playbackEngine,
    playTrack,
    togglePlay,
    playNext,
    playPrev,
    playQueueIndex,
    volume,
    setVolume,
    shuffleEnabled,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
    autoAdvance,
    setAutoAdvance,
    autoRadioEnabled,
    setAutoRadioEnabled,
    isQueueOpen,
    toggleQueue,
    closeQueue,
    moveQueueItem,
    removeQueueItem,
    clearQueue,
    startRadio,
    radioSourceTrack,
    radioTracks,
    isRadioLoading,
    radioError,
    providerStatus,
    themeColor,
  };

  const progressValue = useMemo(() => ({
    progress,
    duration,
    seekTo,
    sleepTimerEndsAt,
    sleepTimerRemainingMs: sleepTimerEndsAt
      ? Math.max(sleepTimerEndsAt - sleepTimerTick, 0)
      : 0,
    setSleepTimer,
    clearSleepTimer,
  }), [progress, duration, seekTo, sleepTimerEndsAt, sleepTimerTick, setSleepTimer, clearSleepTimer]);

  return (
    <PlayerContext.Provider value={value}>
      <PlayerProgressContext.Provider value={progressValue}>
        {children}
      </PlayerProgressContext.Provider>
    </PlayerContext.Provider>
  );
};

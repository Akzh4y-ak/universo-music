import { useCallback, useEffect, useState } from 'react';
import { MusicContext } from './music';
import { slugifyValue } from '../utils/musicMeta';
import { readStoredJson, readStoredString } from '../utils/storage';

const defaultPreferences = {
  allowExplicit: true,
  preferredLanguages: [],
  preferredGenres: [],
  preferredArtists: [],
  hasSetPreferences: false,
};

function ensureTrackList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function ensurePlaylistList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((playlist) => playlist && typeof playlist.id === 'string' && typeof playlist.title === 'string')
    .map((playlist) => ({
      id: playlist.id,
      title: playlist.title,
      description: typeof playlist.description === 'string'
        ? playlist.description
        : 'A custom playlist from your library.',
      tracks: ensureTrackList(playlist.tracks),
      createdAt: playlist.createdAt || new Date().toISOString(),
    }));
}

export const MusicProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState(() => {
    return ensureTrackList(readStoredJson('univerzo_liked', []));
  });

  const [recentPlays, setRecentPlays] = useState(() => {
    return ensureTrackList(readStoredJson('univerzo_recent', []));
  });

  const [playlists, setPlaylists] = useState(() => {
    return ensurePlaylistList(readStoredJson('univerzo_playlists', []));
  });

  const [activePlaylistId, setActivePlaylistId] = useState(() => {
    return readStoredString('univerzo_active_playlist', '');
  });

  const [preferences, setPreferences] = useState(() => {
    const storedPreferences = readStoredJson('univerzo_preferences', {});

    return {
      ...defaultPreferences,
      ...(storedPreferences && typeof storedPreferences === 'object' ? storedPreferences : {}),
    };
  });

  useEffect(() => {
    localStorage.setItem('univerzo_liked', JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem('univerzo_recent', JSON.stringify(recentPlays));
  }, [recentPlays]);

  useEffect(() => {
    localStorage.setItem('univerzo_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    if (activePlaylistId) {
      localStorage.setItem('univerzo_active_playlist', activePlaylistId);
    } else {
      localStorage.removeItem('univerzo_active_playlist');
    }
  }, [activePlaylistId]);

  useEffect(() => {
    localStorage.setItem('univerzo_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const toggleLike = (track) => {
    setLikedSongs((prev) => {
      if (prev.find((t) => t.id === track.id)) {
        return prev.filter((t) => t.id !== track.id);
      }
      return [...prev, track];
    });
  };

  const isLiked = (trackId) => {
    return likedSongs.some((t) => t.id === trackId);
  };

  const addRecent = useCallback((track) => {
    setRecentPlays((prev) => {
      const filtered = prev.filter((t) => t.id !== track.id);
      return [track, ...filtered].slice(0, 20); // Keep max 20 recent
    });
  }, []);

  const clearRecentPlays = () => {
    setRecentPlays([]);
  };

  const createPlaylist = (name, description = '') => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return null;
    }

    const baseSlug = slugifyValue(trimmedName) || 'playlist';
    let candidateId = baseSlug;
    let suffix = 2;

    while (playlists.some((playlist) => playlist.id === candidateId)) {
      candidateId = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const playlist = {
      id: candidateId,
      title: trimmedName,
      description: description.trim() || 'A custom playlist from your library.',
      tracks: [],
      createdAt: new Date().toISOString(),
    };

    setPlaylists((prev) => [playlist, ...prev]);
    setActivePlaylistId(playlist.id);
    return playlist;
  };

  const addTrackToPlaylist = (playlistId, track) => {
    setPlaylists((prev) => prev.map((playlist) => {
      if (playlist.id !== playlistId) {
        return playlist;
      }

      if (playlist.tracks.some((playlistTrack) => playlistTrack.id === track.id)) {
        return playlist;
      }

      return {
        ...playlist,
        tracks: [track, ...playlist.tracks],
      };
    }));

    setActivePlaylistId(playlistId);
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) => prev.map((playlist) => {
      if (playlist.id !== playlistId) {
        return playlist;
      }

      return {
        ...playlist,
        tracks: playlist.tracks.filter((track) => track.id !== trackId),
      };
    }));
  };

  const updatePlaylistDetails = (playlistId, title, description) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return false;
    }

    setPlaylists((prev) => prev.map((playlist) => {
      if (playlist.id !== playlistId) {
        return playlist;
      }

      return {
        ...playlist,
        title: trimmedTitle,
        description: description.trim() || 'A custom playlist from your library.',
      };
    }));

    return true;
  };

  const deletePlaylist = (playlistId) => {
    const remainingPlaylists = playlists.filter((playlist) => playlist.id !== playlistId);

    setPlaylists(remainingPlaylists);

    if (activePlaylistId === playlistId) {
      setActivePlaylistId(remainingPlaylists[0]?.id || '');
    }
  };

  const isTrackInAnyPlaylist = (trackId) => {
    return playlists.some((playlist) => playlist.tracks.some((track) => track.id === trackId));
  };

  const saveTrackToPlaylist = (track) => {
    const targetId = activePlaylistId || playlists[0]?.id;

    if (targetId) {
      addTrackToPlaylist(targetId, track);
      return targetId;
    }

    const playlist = createPlaylist('My Playlist');

    if (playlist) {
      addTrackToPlaylist(playlist.id, track);
      return playlist.id;
    }

    return null;
  };

  const setAllowExplicit = (nextValue) => {
    setPreferences((previous) => ({
      ...previous,
      allowExplicit: nextValue,
    }));
  };

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const updatePreferences = (updates) => {
    setPreferences((previous) => ({
      ...previous,
      ...updates,
      hasSetPreferences: true,
    }));
  };

  const getLibrarySnapshot = () => {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      likedSongs,
      recentPlays,
      playlists,
      activePlaylistId,
      preferences,
    };
  };

  const importLibrarySnapshot = (snapshot, mode = 'replace') => {
    if (!snapshot || typeof snapshot !== 'object') {
      throw new Error('Invalid library backup file.');
    }

    const nextLikedSongs = ensureTrackList(snapshot.likedSongs);
    const nextRecentPlays = ensureTrackList(snapshot.recentPlays);
    const nextPlaylists = ensurePlaylistList(snapshot.playlists);
    const nextPreferences = {
      ...defaultPreferences,
      ...(snapshot.preferences && typeof snapshot.preferences === 'object'
        ? snapshot.preferences
        : {}),
    };
    const nextActivePlaylistId = typeof snapshot.activePlaylistId === 'string'
      ? snapshot.activePlaylistId
      : '';

    if (mode === 'merge') {
      setLikedSongs((previous) => {
        const nextMap = new Map(previous.map((track) => [track.id, track]));
        nextLikedSongs.forEach((track) => nextMap.set(track.id, track));
        return Array.from(nextMap.values());
      });

      setRecentPlays((previous) => {
        const nextMap = new Map(previous.map((track) => [track.id, track]));
        nextRecentPlays.forEach((track) => nextMap.set(track.id, track));
        return Array.from(nextMap.values()).slice(0, 20);
      });

      setPlaylists((previous) => {
        const nextMap = new Map(previous.map((playlist) => [playlist.id, playlist]));
        nextPlaylists.forEach((playlist) => nextMap.set(playlist.id, playlist));
        return Array.from(nextMap.values());
      });

      setPreferences((previous) => ({
        ...previous,
        ...nextPreferences,
      }));

      if (nextActivePlaylistId) {
        setActivePlaylistId(nextActivePlaylistId);
      }

      return;
    }

    setLikedSongs(nextLikedSongs);
    setRecentPlays(nextRecentPlays);
    setPlaylists(nextPlaylists);
    setPreferences(nextPreferences);
    setActivePlaylistId(
      nextPlaylists.some((playlist) => playlist.id === nextActivePlaylistId)
        ? nextActivePlaylistId
        : nextPlaylists[0]?.id || '',
    );
  };

  const value = {
    likedSongs,
    toggleLike,
    isLiked,
    recentPlays,
    addRecent,
    clearRecentPlays,
    playlists,
    activePlaylistId,
    setActivePlaylistId,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    updatePlaylistDetails,
    deletePlaylist,
    isTrackInAnyPlaylist,
    saveTrackToPlaylist,
    preferences,
    setAllowExplicit,
    updatePreferences,
    isFeedbackOpen,
    setIsFeedbackOpen,
    getLibrarySnapshot,
    importLibrarySnapshot,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

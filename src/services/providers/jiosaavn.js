import axios from 'axios';
import { slugifyValue } from '../../utils/musicMeta';

// Public JioSaavn API wrapper instance
const JIOSAAVN_API_ROOT = 'https://jiosaavn-api-privatecvc2.vercel.app';
const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600';
const playlistSearchCache = new Map();
const playlistDetailsCache = new Map();
const EDITORIAL_TRENDING_SOURCES = {
  'featured pop': [
    { query: 'trending', preferredName: 'Trending Songs', preferredLanguages: ['hindi', 'punjabi'] },
    { query: 'trending', preferredName: 'Now Trending', preferredLanguages: ['hindi', 'punjabi'] },
    { query: 'trending', preferredName: 'Trending Today', preferredLanguages: ['english'] },
  ],
  'latest hindi punjabi hits': [
    { query: 'trending', preferredName: 'Trending Songs', preferredLanguages: ['hindi', 'punjabi'] },
    { query: 'trending', preferredName: 'Now Trending', preferredLanguages: ['hindi', 'punjabi'] },
  ],
  'global dance pop hits': [
    { query: 'trending', preferredName: 'English Viral Hits', preferredLanguages: ['english'] },
    { query: 'top charts', preferredName: 'International Charts', preferredLanguages: ['english'] },
  ],
};

function formatDuration(seconds) {
  if (!seconds || Number.isNaN(Number(seconds))) {
    return '0:00';
  }

  const totalSeconds = Number(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);

  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function getBestImage(imageArray) {
  if (!imageArray || !Array.isArray(imageArray) || imageArray.length === 0) {
    return FALLBACK_COVER;
  }

  // Pick highest quality (last item is usually 500x500)
  const best = imageArray[imageArray.length - 1];
  return best?.link || FALLBACK_COVER;
}

function getBestStreamUrl(downloadUrlArray) {
  if (!downloadUrlArray || !Array.isArray(downloadUrlArray) || downloadUrlArray.length === 0) {
    return '';
  }

  // Prefer 320kbps > 160kbps > 96kbps > whatever is available
  const preferred = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
  for (const quality of preferred) {
    const match = downloadUrlArray.find((item) => item.quality === quality);
    if (match?.link) {
      return match.link;
    }
  }

  // Fallback to last available
  return downloadUrlArray[downloadUrlArray.length - 1]?.link || '';
}

function normalizeText(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildFallbackTrackId(track) {
  const fallbackKey = slugifyValue([
    track.name || 'track',
    track.primaryArtists || 'artist',
    track.album?.name || '',
  ].join('-'));

  return `saavn-${fallbackKey || 'track'}`;
}

function normalizeJioSaavnTrack(track) {
  const artistName = track.primaryArtists || 'Unknown Artist';
  const albumName = track.album?.name || '';
  const cover = getBestImage(track.image);
  const streamUrl = getBestStreamUrl(track.downloadUrl);

  return {
    id: track.id ? `saavn-${track.id}` : buildFallbackTrackId(track),
    catalogId: track.id || '',
    title: track.name || 'Unknown Title',
    artist: artistName,
    artistSlug: slugifyValue(artistName),
    artistImage: cover,
    artistExternalUrl: '',
    album: albumName,
    albumSlug: albumName ? slugifyValue(`${artistName} ${albumName}`) : '',
    cover,
    url: streamUrl,
    previewUrl: streamUrl,
    externalUrl: '',
    durationSeconds: Number(track.duration) || 0,
    durationLabel: formatDuration(track.duration),
    provider: 'univerzo',
    providerLabel: 'Univerzo',
    isRealStream: true,
    isExplicit: track.explicitContent === 1 || track.explicitContent === true,
    language: track.language || '',
    playCount: Number(track.playCount) || 0,
    releaseDate: track.releaseDate || '',
  };
}

export async function searchJioSaavnTracks(query, page = 0, limit = 24) {
  if (!query) {
    return [];
  }

  try {
    const response = await axios.get(`${JIOSAAVN_API_ROOT}/search/songs`, {
      params: { query, page, limit },
    });

    const results = response.data?.data?.results || [];
    return results
      .map(normalizeJioSaavnTrack)
      .filter((track) => track.url); // Only include tracks with playable URLs
  } catch (error) {
    console.error('JioSaavn search error:', error.message);
    return [];
  }
}

async function searchJioSaavnPlaylists(query, page = 0, limit = 12) {
  if (!query) {
    return [];
  }

  const cacheKey = `${query}::${page}::${limit}`;

  if (playlistSearchCache.has(cacheKey)) {
    return playlistSearchCache.get(cacheKey);
  }

  try {
    const response = await axios.get(`${JIOSAAVN_API_ROOT}/search/playlists`, {
      params: { query, page, limit },
    });

    const results = response.data?.data?.results || [];
    playlistSearchCache.set(cacheKey, results);
    return results;
  } catch (error) {
    console.error('JioSaavn playlist search error:', error.message);
    return [];
  }
}

async function getJioSaavnPlaylist(playlistId) {
  if (!playlistId) {
    return null;
  }

  if (playlistDetailsCache.has(playlistId)) {
    return playlistDetailsCache.get(playlistId);
  }

  try {
    const response = await axios.get(`${JIOSAAVN_API_ROOT}/playlists`, {
      params: { id: playlistId },
    });

    const playlist = response.data?.data || null;

    if (playlist) {
      playlistDetailsCache.set(playlistId, playlist);
    }

    return playlist;
  } catch (error) {
    console.error('JioSaavn playlist fetch error:', error.message);
    return null;
  }
}

function getPlaylistMatchScore(playlist, preferredName = '', preferredLanguages = []) {
  const normalizedName = normalizeText(playlist?.name || '');
  const normalizedPreferredName = normalizeText(preferredName);
  const normalizedLanguage = (playlist?.language || '').toLowerCase();
  const editorialOwner = normalizeText(`${playlist?.firstname || ''} ${playlist?.lastname || ''}`);
  let score = 0;

  if (normalizedPreferredName && normalizedName === normalizedPreferredName) {
    score += 120;
  } else if (normalizedPreferredName && normalizedName.includes(normalizedPreferredName)) {
    score += 60;
  }

  if (preferredLanguages.includes(normalizedLanguage)) {
    score += 20;
  }

  if (editorialOwner.includes('jiosaavn')) {
    score += 10;
  }

  return score;
}

function selectEditorialPlaylist(playlists = [], preferredName = '', preferredLanguages = []) {
  return playlists
    .slice()
    .sort((left, right) => (
      getPlaylistMatchScore(right, preferredName, preferredLanguages)
      - getPlaylistMatchScore(left, preferredName, preferredLanguages)
    ))[0] || null;
}

async function getEditorialPlaylistTracks(sources = [], page = 0, limit = 12) {
  if (!Array.isArray(sources) || sources.length === 0) {
    return [];
  }

  const trackGroups = await Promise.all(sources.map(async (source) => {
    const playlists = await searchJioSaavnPlaylists(source.query, 0, 10);
    const match = selectEditorialPlaylist(
      playlists,
      source.preferredName,
      source.preferredLanguages || [],
    );

    if (!match?.id) {
      return [];
    }

    const playlist = await getJioSaavnPlaylist(match.id);
    const tracks = playlist?.songs || [];

    return tracks
      .map(normalizeJioSaavnTrack)
      .filter((track) => track.url);
  }));

  const mergedTracks = [];
  const seenTrackIds = new Set();

  trackGroups.flat().forEach((track) => {
    if (!track?.id || seenTrackIds.has(track.id)) {
      return;
    }

    seenTrackIds.add(track.id);
    mergedTracks.push(track);
  });

  const startIndex = Math.max(0, page) * Math.max(1, limit);
  return mergedTracks.slice(startIndex, startIndex + Math.max(1, limit));
}

export async function getJioSaavnTrendingTracks(seed = 'trending hits', page = 0, limit = 12) {
  const sources = EDITORIAL_TRENDING_SOURCES[seed] || EDITORIAL_TRENDING_SOURCES['featured pop'];
  const editorialTracks = await getEditorialPlaylistTracks(sources, page, limit);

  if (editorialTracks.length > 0) {
    return editorialTracks;
  }

  return searchJioSaavnTracks(seed, page, limit);
}

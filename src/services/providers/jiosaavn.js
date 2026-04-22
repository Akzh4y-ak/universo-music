import axios from 'axios';
import { slugifyValue } from '../../utils/musicMeta';

// Public JioSaavn API wrapper instance
const JIOSAAVN_API_ROOT = 'https://jiosaavn-api-privatecvc2.vercel.app';
const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600';
const playlistSearchCache = new Map();
const playlistDetailsCache = new Map();
const featuredPopSources = [
  { query: 'trending', preferredName: 'Trending Songs', preferredLanguages: ['hindi', 'punjabi'] },
  { query: 'trending', preferredName: 'Now Trending', preferredLanguages: ['hindi', 'punjabi'] },
  { query: 'trending', preferredName: 'Trending Today', preferredLanguages: ['english'] },
];
const desiMomentumSources = [
  { query: 'trending', preferredName: 'Trending Songs', preferredLanguages: ['hindi', 'punjabi'] },
  { query: 'trending', preferredName: 'Now Trending', preferredLanguages: ['hindi', 'punjabi'] },
];
const worldwideEnergySources = [
  { query: 'trending', preferredName: 'English Viral Hits', preferredLanguages: ['english'] },
  { query: 'top charts', preferredName: 'International Charts', preferredLanguages: ['english'] },
];
const hindiSources = [
  { query: 'hindi hits', preferredName: 'Hindi: India Superhits Top 50', preferredLanguages: ['hindi'] },
  { query: 'hindi hits', preferredName: 'Hindi Hit Songs', preferredLanguages: ['hindi'] },
];
const punjabiSources = [
  { query: 'punjabi hits', preferredName: 'Punjabi: India Superhits Top 50', preferredLanguages: ['punjabi'] },
  { query: 'punjabi hits', preferredName: 'Punjabi Hit Songs', preferredLanguages: ['punjabi'] },
];
const tamilSources = [
  { query: 'tamil hits', preferredName: 'Tamil: India Superhits Top 50', preferredLanguages: ['tamil'] },
  { query: 'tamil hits', preferredName: 'Tamil Hit Songs', preferredLanguages: ['tamil'] },
];
const teluguSources = [
  { query: 'telugu hits', preferredName: 'Telugu: India Superhits Top 50', preferredLanguages: ['telugu'] },
  { query: 'telugu hits', preferredName: 'Telugu Viral Hits', preferredLanguages: ['telugu'] },
];
const englishSources = [
  { query: 'top charts', preferredName: 'International Charts', preferredLanguages: ['english'] },
  { query: 'english pop', preferredName: 'Best Of Pop - English', preferredLanguages: ['english'] },
  { query: 'english pop', preferredName: 'Global Pop', preferredLanguages: ['english'] },
  { query: 'trending', preferredName: 'English Viral Hits', preferredLanguages: ['english'] },
];
const hiphopSources = [
  { query: 'hip hop', preferredName: 'Best Of Hip Hop - English', preferredLanguages: ['english'] },
  { query: 'hip hop', preferredName: 'Rap Cypher', preferredLanguages: ['english'] },
];
const lofiSources = [
  { query: 'lofi', preferredName: 'Lofi India Hits', preferredLanguages: ['hindi'] },
  { query: 'lofi', preferredName: 'Monsoon Lofi Beats', preferredLanguages: ['hindi'] },
];
const edmSources = [
  { query: 'edm', preferredName: 'Best Of EDM - English', preferredLanguages: ['english'] },
  { query: 'edm', preferredName: 'Fresh Dance Hits', preferredLanguages: ['english'] },
  { query: 'edm', preferredName: 'EDM Uplift', preferredLanguages: ['english'] },
];
const rnbSources = [
  { query: 'rnb', preferredName: 'Best Of RnB - English', preferredLanguages: ['english'] },
  { query: 'rnb', preferredName: 'Fresh RnB Hits', preferredLanguages: ['english'] },
];
const jazzSources = [
  { query: 'jazz', preferredName: 'Best Of Jazz - English', preferredLanguages: ['english'] },
  { query: 'jazz', preferredName: 'Fresh Jazz Hits', preferredLanguages: ['english'] },
];
const workoutSources = [
  { query: 'workout', preferredName: 'Ultimate Workout Mix', preferredLanguages: ['english'] },
  { query: 'workout', preferredName: 'Workout From Home - English', preferredLanguages: ['english'] },
];
const acousticSources = [
  { query: 'acoustic', preferredName: 'Best Of Acoustic Pop - English', preferredLanguages: ['english'] },
  { query: 'acoustic', preferredName: 'Acoustic Sessions', preferredLanguages: ['english'] },
  { query: 'acoustic', preferredName: 'Acoustic Nights', preferredLanguages: ['english'] },
];
const EDITORIAL_DISCOVERY_SOURCES = {
  'featured pop': [
    ...featuredPopSources,
  ],
  'desi-momentum': [...desiMomentumSources],
  'latest hindi punjabi hits': [
    ...desiMomentumSources,
  ],
  'worldwide-energy': [...worldwideEnergySources],
  'global dance pop hits': [
    ...worldwideEnergySources,
  ],
  hindi: [...hindiSources],
  'latest hindi songs bollywood hits': [...hindiSources],
  punjabi: [...punjabiSources],
  'punjabi pop bhangra hits': [...punjabiSources],
  tamil: [...tamilSources],
  'tamil hits kollywood songs': [...tamilSources],
  telugu: [...teluguSources],
  'telugu hits tollywood songs': [...teluguSources],
  english: [...englishSources],
  'international pop hits': [...englishSources],
  hiphop: [...hiphopSources],
  'hip hop rap anthems': [...hiphopSources],
  lofi: [...lofiSources],
  'lofi chill beats': [...lofiSources],
  edm: [...edmSources],
  'edm dance festival hits': [...edmSources],
  rnb: [...rnbSources],
  'rnb soul grooves': [...rnbSources],
  jazz: [...jazzSources],
  'jazz soul lounge': [...jazzSources],
  workout: [...workoutSources],
  'workout motivation hits': [...workoutSources],
  acoustic: [...acousticSources],
  'acoustic chill singer songwriter': [...acousticSources],
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
  return getJioSaavnDiscoveryTracks(seed, page, limit);
}

export async function getJioSaavnDiscoveryTracks(key = 'featured pop', page = 0, limit = 12) {
  const sources = EDITORIAL_DISCOVERY_SOURCES[key];
  const editorialTracks = await getEditorialPlaylistTracks(sources, page, limit);

  if (editorialTracks.length > 0) {
    return editorialTracks;
  }

  return searchJioSaavnTracks(key, page, limit);
}

import axios from 'axios';
import { slugifyValue } from '../../utils/musicMeta';

// Public JioSaavn API wrapper instance
const JIOSAAVN_API_ROOT = 'https://jiosaavn-api-privatecvc2.vercel.app';
const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600';

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

function normalizeJioSaavnTrack(track) {
  const artistName = track.primaryArtists || 'Unknown Artist';
  const albumName = track.album?.name || '';
  const cover = getBestImage(track.image);
  const streamUrl = getBestStreamUrl(track.downloadUrl);

  return {
    id: `saavn-${track.id || Math.random().toString(36).slice(2)}`,
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

export async function getJioSaavnTrendingTracks(seed = 'trending hits', page = 0, limit = 12) {
  // JioSaavn API doesn't have a dedicated trending endpoint,
  // so we search for trending-style queries
  return searchJioSaavnTracks(seed, page, limit);
}

import { getMusicProviderInfo } from '../config/music';
import {
  searchJioSaavnTracks,
  getJioSaavnDiscoveryTracks,
  getJioSaavnTrendingTracks,
  getJioSaavnTrackDetails,
} from './providers/jiosaavn';

export function getCatalogStatus() {
  return getMusicProviderInfo();
}

/**
 * Fetch a single track by its unique ID.
 */
export async function getTrackById(trackId) {
  if (!trackId) return null;

  // Currently we only have JioSaavn as a provider for individual track fetches
  if (trackId.startsWith('saavn-')) {
    return getJioSaavnTrackDetails(trackId);
  }

  // Fallback for generic IDs if we add more providers
  return getJioSaavnTrackDetails(trackId);
}

/**
 * Deduplicate tracks by a rough title+artist match.
 */
function deduplicateTracks(tracks) {
  const seen = new Set();
  return tracks.filter((track) => {
    const key = `${(track.title || '').toLowerCase().trim()}::${(track.artist || '').toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * SEARCH ENGINE
 * 
 * Priority order:
 * 1. JioSaavn → Full-length streams
 */
export async function searchTracks(query, limit = 24, page = 0) {
  if (!query) {
    return [];
  }

  const saavnResults = await searchJioSaavnTracks(query, page, Math.min(limit, 50)).catch(() => []);

  const merged = deduplicateTracks(saavnResults);
  return merged.slice(0, limit);
}

export async function getDiscoveryTracks(key = 'featured pop', limit = 24, page = 0, preferredLanguages = []) {
  if (!key) {
    return [];
  }

  const saavnResults = await getJioSaavnDiscoveryTracks(key, page, Math.min(limit, 50), preferredLanguages).catch(() => []);

  const merged = deduplicateTracks(saavnResults);
  return merged.slice(0, limit);
}

export async function getTrendingTracks(seed = 'pop hits', limit = 12, page = 0, preferredLanguages = []) {
  return getDiscoveryTracks(seed, limit, page, preferredLanguages).catch(async () => {
    const saavnResults = await getJioSaavnTrendingTracks(seed, page, Math.min(limit, 50), preferredLanguages).catch(() => []);
    const merged = deduplicateTracks(saavnResults);
    return merged.slice(0, limit);
  });
}

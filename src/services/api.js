import { getMusicProviderInfo } from '../config/music';
import { searchJioSaavnTracks, getJioSaavnTrendingTracks } from './providers/jiosaavn';

export function getCatalogStatus() {
  return getMusicProviderInfo();
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

export async function getTrendingTracks(seed = 'pop hits', limit = 12, page = 0) {
  const saavnResults = await getJioSaavnTrendingTracks(seed, page, Math.min(limit, 50)).catch(() => []);

  const merged = deduplicateTracks(saavnResults);
  return merged.slice(0, limit);
}

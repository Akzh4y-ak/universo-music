import {
  getTrackAlbumSlug,
  getTrackArtistImage,
  getTrackArtistSlug,
} from './musicMeta';

function includesQuery(value = '', query = '') {
  return value.toLowerCase().includes(query.trim().toLowerCase());
}

export function filterExplicitTracks(tracks = [], allowExplicit = true) {
  if (allowExplicit) {
    return tracks;
  }

  return tracks.filter((track) => !track.isExplicit);
}

export function buildArtistResults(tracks = [], limit = 6) {
  const grouped = new Map();

  tracks.forEach((track) => {
    const slug = getTrackArtistSlug(track);

    if (!slug) {
      return;
    }

    if (!grouped.has(slug)) {
      grouped.set(slug, {
        slug,
        name: track.artist,
        image: getTrackArtistImage(track),
        seedTrack: track,
        trackCount: 0,
      });
    }

    grouped.get(slug).trackCount += 1;
  });

  return Array.from(grouped.values())
    .sort((left, right) => right.trackCount - left.trackCount)
    .slice(0, limit);
}

export function buildAlbumResults(tracks = [], limit = 6) {
  const grouped = new Map();

  tracks.forEach((track) => {
    if (!track.album) {
      return;
    }

    const slug = getTrackAlbumSlug(track);

    if (!slug) {
      return;
    }

    if (!grouped.has(slug)) {
      grouped.set(slug, {
        slug,
        title: track.album,
        artist: track.artist,
        cover: track.cover,
        seedTrack: track,
        trackCount: 0,
      });
    }

    grouped.get(slug).trackCount += 1;
  });

  return Array.from(grouped.values())
    .sort((left, right) => right.trackCount - left.trackCount)
    .slice(0, limit);
}

export function findMatchingPlaylists(playlists = [], query = '', limit = 6) {
  if (!query.trim()) {
    return [];
  }

  return playlists
    .filter((playlist) => {
      if (includesQuery(playlist.title, query) || includesQuery(playlist.description, query)) {
        return true;
      }

      return playlist.tracks.some((track) => {
        return (
          includesQuery(track.title, query) ||
          includesQuery(track.artist, query) ||
          includesQuery(track.album || '', query)
        );
      });
    })
    .sort((left, right) => right.tracks.length - left.tracks.length)
    .slice(0, limit);
}

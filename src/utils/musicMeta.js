export function slugifyValue(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

export function unslugifyValue(value = '') {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getTrackArtistSlug(track) {
  return track?.artistSlug || slugifyValue(track?.artist || '');
}

export function getTrackAlbumSlug(track) {
  if (track?.albumSlug) {
    return track.albumSlug;
  }

  if (!track?.album) {
    return '';
  }

  return slugifyValue(`${track.artist || ''} ${track.album}`);
}

export function getTrackArtistImage(track) {
  return track?.artistImage || track?.cover || '';
}

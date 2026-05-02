const EMPTY_SNAPSHOT = {
  artists: [],
  albums: [],
  tracks: [],
};

let snapshotPromise = null;
let snapshotCache = null;

function normalizePathname(pathname = '/') {
  const trimmedPathname = pathname.replace(/\/+$/, '');
  return trimmedPathname || '/';
}

function getBootstrap() {
  if (typeof window === 'undefined') {
    return null;
  }

  const bootstrap = window.__UNIVERZO_SEO_BOOTSTRAP__ || null;

  if (!bootstrap) {
    return null;
  }

  if (bootstrap.path && normalizePathname(bootstrap.path) !== normalizePathname(window.location.pathname)) {
    return null;
  }

  return bootstrap;
}

export function getInitialSeoSnapshot() {
  const bootstrap = getBootstrap();

  if (!bootstrap) {
    return EMPTY_SNAPSHOT;
  }

  return {
    artists: bootstrap.artists || [],
    albums: bootstrap.albums || [],
    tracks: bootstrap.tracks || [],
  };
}

export function getInitialArtist(slug) {
  const bootstrap = getBootstrap();

  if (bootstrap?.artist?.slug === slug) {
    return bootstrap.artist;
  }

  return null;
}

export function getInitialAlbum(slug) {
  const bootstrap = getBootstrap();

  if (bootstrap?.album?.slug === slug) {
    return bootstrap.album;
  }

  return null;
}

export function getInitialTrack(id) {
  const bootstrap = getBootstrap();

  if (bootstrap?.track?.id === id) {
    return bootstrap.track;
  }

  return null;
}

export function getInitialRouteTracks() {
  const bootstrap = getBootstrap();

  if (Array.isArray(bootstrap?.tracks)) {
    return bootstrap.tracks;
  }

  if (Array.isArray(bootstrap?.similarTracks)) {
    return bootstrap.similarTracks;
  }

  return [];
}

export async function loadSeoSnapshot() {
  if (snapshotCache) {
    return snapshotCache;
  }

  if (!snapshotPromise) {
    snapshotPromise = fetch('/seo-snapshot.json', { cache: 'force-cache' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load SEO snapshot.');
        }

        const data = await response.json();
        snapshotCache = data;
        return data;
      })
      .catch((error) => {
        snapshotPromise = null;
        throw error;
      });
  }

  return snapshotPromise;
}

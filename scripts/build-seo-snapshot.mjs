import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { featuredPlaylists } from '../src/data/featuredPlaylists.js';
import { genres } from '../src/data/genres.js';
import { getDiscoveryTracks, getTrendingTracks, searchTracks } from '../src/services/api.js';
import { getTrackAlbumSlug, getTrackArtistSlug } from '../src/utils/musicMeta.js';

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function summarizeArtist(artistName, tracks = []) {
  const uniqueAlbums = uniqueBy(
    tracks.filter((track) => track.album),
    (track) => `${track.artist}::${track.album}`,
  ).slice(0, 3);

  if (uniqueAlbums.length === 0) {
    return `Listen to ${artistName} on Univerzo Music.`;
  }

  const albumNames = uniqueAlbums.map((track) => track.album).join(', ');
  return `Explore songs and releases from ${artistName}, including highlights from ${albumNames}.`;
}

function summarizeAlbum(albumTitle, artistName, tracks = []) {
  const sampleTitles = tracks
    .slice(0, 3)
    .map((track) => track.title)
    .join(', ');

  if (!sampleTitles) {
    return `Listen to ${albumTitle}${artistName ? ` by ${artistName}` : ''} on Univerzo Music.`;
  }

  return `Listen to ${albumTitle}${artistName ? ` by ${artistName}` : ''} and discover tracks like ${sampleTitles}.`;
}

function summarizeTrack(track) {
  const albumText = track.album ? ` from ${track.album}` : '';
  return `Stream ${track.title} by ${track.artist}${albumText} on Univerzo Music.`;
}

const discoverySeeds = [
  ...genres.map((genre) => ({
    kind: 'genre',
    key: genre.id,
    query: genre.query,
    load: () => getDiscoveryTracks(genre.query, 24, 0, []),
  })),
  ...featuredPlaylists.map((playlist) => ({
    kind: 'playlist',
    key: playlist.id,
    query: playlist.query,
    load: () => searchTracks(playlist.query, 24, 0),
  })),
  {
    kind: 'trending',
    key: 'trending',
    query: 'featured pop',
    load: () => getTrendingTracks('featured pop', 24, 0, []),
  },
];

const seedResults = await Promise.all(
  discoverySeeds.map(async (seed) => {
    const tracks = await seed.load().catch(() => []);
    return { seed, tracks };
  }),
);

const trackStats = new Map();

seedResults.forEach(({ seed, tracks }) => {
  tracks.forEach((track, index) => {
    if (!track?.id || !track.url) {
      return;
    }

    const existing = trackStats.get(track.id) || {
      ...track,
      sourceKinds: new Set(),
      sourceKeys: new Set(),
      score: 0,
      appearances: 0,
    };

    existing.sourceKinds.add(seed.kind);
    existing.sourceKeys.add(seed.key);
    existing.appearances += 1;
    existing.score += Math.max(1, 30 - index) + Math.min(50, Math.floor((track.playCount || 0) / 10000));
    trackStats.set(track.id, existing);
  });
});

const allTracks = Array.from(trackStats.values())
  .map((track) => ({
    ...track,
    sourceKinds: Array.from(track.sourceKinds),
    sourceKeys: Array.from(track.sourceKeys),
  }))
  .sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    if ((right.playCount || 0) !== (left.playCount || 0)) {
      return (right.playCount || 0) - (left.playCount || 0);
    }

    return left.title.localeCompare(right.title);
  });

const topTracks = allTracks.slice(0, 120).map((track) => ({
  id: track.id,
  catalogId: track.catalogId,
  title: track.title,
  artist: track.artist,
  artistSlug: getTrackArtistSlug(track),
  artistImage: track.artistImage,
  artistExternalUrl: track.artistExternalUrl,
  album: track.album,
  albumSlug: getTrackAlbumSlug(track),
  cover: track.cover,
  url: track.url,
  previewUrl: track.previewUrl,
  externalUrl: track.externalUrl,
  durationLabel: track.durationLabel,
  durationSeconds: track.durationSeconds,
  provider: track.provider,
  providerLabel: track.providerLabel,
  isRealStream: track.isRealStream,
  releaseDate: track.releaseDate,
  isExplicit: track.isExplicit,
  playCount: track.playCount,
  language: track.language,
  color: track.color,
  summary: summarizeTrack(track),
  sourceKinds: track.sourceKinds,
  sourceKeys: track.sourceKeys,
}));

const artistMap = new Map();
topTracks.forEach((track) => {
  if (!track.artistSlug) {
    return;
  }

  const existing = artistMap.get(track.artistSlug) || {
    slug: track.artistSlug,
    name: track.artist,
    image: track.cover,
    trackCount: 0,
    totalPlayCount: 0,
    trackIds: [],
    albumSlugs: new Set(),
  };

  existing.trackCount += 1;
  existing.totalPlayCount += track.playCount || 0;
  existing.trackIds.push(track.id);
  if (track.albumSlug) {
    existing.albumSlugs.add(track.albumSlug);
  }
  artistMap.set(track.artistSlug, existing);
});

const topArtists = Array.from(artistMap.values())
  .sort((left, right) => {
    if (right.trackCount !== left.trackCount) {
      return right.trackCount - left.trackCount;
    }

    return right.totalPlayCount - left.totalPlayCount;
  })
  .slice(0, 80)
  .map((artist) => {
    const artistTracks = topTracks.filter((track) => artist.trackIds.includes(track.id)).slice(0, 6);
    return {
      slug: artist.slug,
      name: artist.name,
      image: artist.image,
      trackCount: artist.trackCount,
      totalPlayCount: artist.totalPlayCount,
      sampleTrackIds: artistTracks.map((track) => track.id),
      sampleAlbumSlugs: Array.from(artist.albumSlugs).slice(0, 4),
      summary: summarizeArtist(artist.name, artistTracks),
    };
  });

const albumMap = new Map();
topTracks.forEach((track) => {
  if (!track.album || !track.albumSlug) {
    return;
  }

  const existing = albumMap.get(track.albumSlug) || {
    slug: track.albumSlug,
    title: track.album,
    artist: track.artist,
    artistSlug: track.artistSlug,
    cover: track.cover,
    trackCount: 0,
    totalPlayCount: 0,
    trackIds: [],
  };

  existing.trackCount += 1;
  existing.totalPlayCount += track.playCount || 0;
  existing.trackIds.push(track.id);
  albumMap.set(track.albumSlug, existing);
});

const topAlbums = Array.from(albumMap.values())
  .sort((left, right) => {
    if (right.trackCount !== left.trackCount) {
      return right.trackCount - left.trackCount;
    }

    return right.totalPlayCount - left.totalPlayCount;
  })
  .slice(0, 100)
  .map((album) => {
    const albumTracks = topTracks.filter((track) => album.trackIds.includes(track.id)).slice(0, 6);
    return {
      slug: album.slug,
      title: album.title,
      artist: album.artist,
      artistSlug: album.artistSlug,
      cover: album.cover,
      trackCount: album.trackCount,
      totalPlayCount: album.totalPlayCount,
      sampleTrackIds: albumTracks.map((track) => track.id),
      summary: summarizeAlbum(album.title, album.artist, albumTracks),
    };
  });

const snapshot = {
  generatedAt: new Date().toISOString(),
  tracks: topTracks,
  artists: topArtists,
  albums: topAlbums,
};

await mkdir(resolve('scripts', 'generated'), { recursive: true });
await writeFile(resolve('scripts', 'generated', 'seo-snapshot.json'), JSON.stringify(snapshot, null, 2), 'utf8');
await writeFile(resolve('public', 'seo-snapshot.json'), JSON.stringify(snapshot, null, 2), 'utf8');

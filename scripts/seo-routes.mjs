import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { featuredPlaylists } from '../src/data/featuredPlaylists.js';
import { genres } from '../src/data/genres.js';

export const SITE_NAME = 'Univerzo Music';
export const SITE_URL = 'https://universo-music.vercel.app';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

function readSnapshot() {
  try {
    const raw = readFileSync(resolve('scripts', 'generated', 'seo-snapshot.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return {
      generatedAt: null,
      tracks: [],
      artists: [],
      albums: [],
    };
  }
}

const snapshot = readSnapshot();
const snapshotTrackMap = new Map(snapshot.tracks.map((track) => [track.id, track]));
const snapshotArtistMap = new Map(snapshot.artists.map((artist) => [artist.slug, artist]));
const snapshotAlbumMap = new Map(snapshot.albums.map((album) => [album.slug, album]));

function collectionStructuredData({ path, name, description, image, about }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${SITE_URL}${path}`,
    image: image || DEFAULT_IMAGE,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    about,
  };
}

function artistStructuredData(artist) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: artist.name,
    url: `${SITE_URL}/artist/${artist.slug}`,
    image: artist.image || DEFAULT_IMAGE,
    description: artist.summary,
  };
}

function albumStructuredData(album) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: album.title,
    url: `${SITE_URL}/album/${album.slug}`,
    image: album.cover || DEFAULT_IMAGE,
    byArtist: album.artist
      ? {
          '@type': 'MusicGroup',
          name: album.artist,
          url: `${SITE_URL}/artist/${album.artistSlug}`,
        }
      : undefined,
    description: album.summary,
  };
}

function trackStructuredData(track) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: track.title,
    url: `${SITE_URL}/track/${track.id}`,
    image: track.cover || DEFAULT_IMAGE,
    duration: track.durationSeconds ? `PT${Math.floor(track.durationSeconds / 60)}M${track.durationSeconds % 60}S` : undefined,
    datePublished: track.releaseDate || undefined,
    byArtist: {
      '@type': 'MusicGroup',
      name: track.artist,
      url: `${SITE_URL}/artist/${track.artistSlug}`,
    },
    inAlbum: track.album
      ? {
          '@type': 'MusicAlbum',
          name: track.album,
          url: track.albumSlug ? `${SITE_URL}/album/${track.albumSlug}` : undefined,
        }
      : undefined,
    description: track.summary,
  };
}

function renderShell({ eyebrow, title, description, primaryLinks = [], secondaryLinks = [], tertiaryLinks = [] }) {
  const primaryHtml = primaryLinks
    .map(
      (link) =>
        `<a href="${link.href}" style="display:inline-flex;margin:0 12px 12px 0;padding:12px 18px;border-radius:999px;background:#1ed760;color:#04110a;font-weight:700;text-decoration:none;">${link.label}</a>`,
    )
    .join('');

  const renderList = (links) =>
    links
      .map(
        (link) =>
          `<li style="margin:0 0 10px;"><a href="${link.href}" style="color:#d7ffe7;text-decoration:none;">${link.label}</a></li>`,
      )
      .join('');

  return `
    <main style="min-height:100vh;background:#050505;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:48px 20px;">
      <div style="max-width:1080px;margin:0 auto;">
        <p style="margin:0 0 16px;color:#7be6a7;font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;">${eyebrow}</p>
        <h1 style="margin:0 0 18px;font-size:clamp(2.2rem,5vw,4.5rem);line-height:1.05;">${title}</h1>
        <p style="max-width:780px;margin:0 0 28px;color:#c7c7c7;font-size:1.05rem;line-height:1.7;">${description}</p>
        <div style="margin:0 0 32px;">${primaryHtml}</div>
        ${
          secondaryLinks.length > 0
            ? `<section style="max-width:980px;padding:24px;border:1px solid rgba(255,255,255,.08);border-radius:24px;background:rgba(255,255,255,.04);margin-bottom:20px;">
                <h2 style="margin:0 0 16px;font-size:1.2rem;">Explore more</h2>
                <ul style="margin:0;padding-left:18px;color:#c7c7c7;">${renderList(secondaryLinks)}</ul>
              </section>`
            : ''
        }
        ${
          tertiaryLinks.length > 0
            ? `<section style="max-width:980px;padding:24px;border:1px solid rgba(255,255,255,.08);border-radius:24px;background:rgba(255,255,255,.02);">
                <h2 style="margin:0 0 16px;font-size:1.2rem;">Related paths</h2>
                <ul style="margin:0;padding-left:18px;color:#c7c7c7;">${renderList(tertiaryLinks)}</ul>
              </section>`
            : ''
        }
      </div>
    </main>
  `;
}

const genreLinks = genres.slice(0, 10).map((genre) => ({
  href: `/genre/${genre.id}`,
  label: `${genre.title} - ${genre.subtitle}`,
}));

const playlistLinks = featuredPlaylists.map((playlist) => ({
  href: `/playlist/${playlist.id}`,
  label: playlist.title,
}));

const artistHubLinks = snapshot.artists.slice(0, 18).map((artist) => ({
  href: `/artist/${artist.slug}`,
  label: `${artist.name} - ${artist.trackCount} highlighted tracks`,
}));

const albumHubLinks = snapshot.albums.slice(0, 18).map((album) => ({
  href: `/album/${album.slug}`,
  label: `${album.title} by ${album.artist}`,
}));

const trackHubLinks = snapshot.tracks.slice(0, 24).map((track) => ({
  href: `/track/${track.id}`,
  label: `${track.title} by ${track.artist}`,
}));

const baseRoutes = [
  {
    path: '/',
    title: 'Univerzo Music | Free Music Streaming Without Sign-in',
    description:
      'Stream trending songs, genre mixes, artist discoveries, and featured playlists on Univerzo Music. Listen instantly in your browser without a sign-in wall.',
    image: DEFAULT_IMAGE,
    type: 'website',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: 'MusicApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
    bodyHtml: renderShell({
      eyebrow: 'Music Discovery',
      title: 'Free music streaming without a sign-in wall.',
      description:
        'Explore trending songs, browse popular genres, open featured playlists, and jump into public artist, album, and track pages before the interactive player finishes loading.',
      primaryLinks: [
        { href: '/trending', label: 'Open trending' },
        { href: '/artists', label: 'Browse artists' },
        { href: '/tracks', label: 'Discover tracks' },
      ],
      secondaryLinks: [...genreLinks.slice(0, 6), ...playlistLinks.slice(0, 4)],
      tertiaryLinks: [...artistHubLinks.slice(0, 6), ...albumHubLinks.slice(0, 6)],
    }),
  },
  {
    path: '/trending',
    title: 'Trending Songs | Univerzo Music',
    description:
      'Browse chart movers, regional momentum, and globally trending songs on Univerzo Music.',
    image: DEFAULT_IMAGE,
    type: 'website',
    structuredData: [
      collectionStructuredData({
        path: '/trending',
        name: 'Trending songs',
        description:
          'Chart movers, regional momentum, and globally trending songs on Univerzo Music.',
        about: {
          '@type': 'Thing',
          name: 'Trending music',
        },
      }),
    ],
    bodyHtml: renderShell({
      eyebrow: 'Live Pulse',
      title: 'Trending songs shaping the room right now.',
      description:
        'Use this page to discover chart movement, Hindi and Punjabi momentum, and broader worldwide energy inside the music catalog.',
      primaryLinks: [
        { href: '/', label: 'Back home' },
        { href: '/genre/hindi', label: 'Browse Hindi hits' },
        { href: '/tracks', label: 'Open top tracks' },
      ],
      secondaryLinks: genreLinks.slice(0, 8),
      tertiaryLinks: trackHubLinks.slice(0, 10),
    }),
  },
  {
    path: '/artists',
    title: `Top Artists | ${SITE_NAME}`,
    description: 'Browse featured artists discovered from the Univerzo Music catalog.',
    image: DEFAULT_IMAGE,
    type: 'website',
    structuredData: [
      collectionStructuredData({
        path: '/artists',
        name: 'Top artists',
        description: 'Featured public artist pages on Univerzo Music.',
        about: {
          '@type': 'Thing',
          name: 'Music artists',
        },
      }),
    ],
    bootstrapData: {
      artists: snapshot.artists,
    },
    bodyHtml: renderShell({
      eyebrow: 'Artist Directory',
      title: 'Artists people can discover and replay.',
      description:
        'Explore public artist pages built from high-signal catalog entries, then move deeper into tracks, albums, and related genres.',
      primaryLinks: [
        { href: '/albums', label: 'Browse albums' },
        { href: '/tracks', label: 'Browse tracks' },
      ],
      secondaryLinks: artistHubLinks,
      tertiaryLinks: genreLinks.slice(0, 8),
    }),
  },
  {
    path: '/albums',
    title: `Top Albums | ${SITE_NAME}`,
    description: 'Browse featured albums and collections discovered from the Univerzo Music catalog.',
    image: DEFAULT_IMAGE,
    type: 'website',
    structuredData: [
      collectionStructuredData({
        path: '/albums',
        name: 'Top albums',
        description: 'Featured public album pages on Univerzo Music.',
        about: {
          '@type': 'Thing',
          name: 'Music albums',
        },
      }),
    ],
    bootstrapData: {
      albums: snapshot.albums,
    },
    bodyHtml: renderShell({
      eyebrow: 'Album Directory',
      title: 'Albums and collections worth opening.',
      description:
        'Browse album-level landing pages so visitors and search engines can reach collections directly instead of only through single tracks.',
      primaryLinks: [
        { href: '/artists', label: 'Browse artists' },
        { href: '/tracks', label: 'Browse tracks' },
      ],
      secondaryLinks: albumHubLinks,
      tertiaryLinks: artistHubLinks.slice(0, 10),
    }),
  },
  {
    path: '/tracks',
    title: `Top Tracks | ${SITE_NAME}`,
    description: 'Browse featured public track pages discovered from the Univerzo Music catalog.',
    image: DEFAULT_IMAGE,
    type: 'website',
    structuredData: [
      collectionStructuredData({
        path: '/tracks',
        name: 'Top tracks',
        description: 'Featured public track pages on Univerzo Music.',
        about: {
          '@type': 'Thing',
          name: 'Songs and tracks',
        },
      }),
    ],
    bootstrapData: {
      tracks: snapshot.tracks,
    },
    bodyHtml: renderShell({
      eyebrow: 'Track Directory',
      title: 'Songs that deserve their own landing pages.',
      description:
        'Explore track pages with direct links into artist and album routes, which gives search engines more crawlable music paths.',
      primaryLinks: [
        { href: '/trending', label: 'Open trending' },
        { href: '/artists', label: 'Browse artists' },
      ],
      secondaryLinks: trackHubLinks,
      tertiaryLinks: albumHubLinks.slice(0, 10),
    }),
  },
];

const genreRoutes = genres.map((genre) => ({
  path: `/genre/${genre.id}`,
  title: `${genre.title} Songs | ${SITE_NAME}`,
  description: `Discover ${genre.title} tracks, fresh catalog picks, and replay-ready listening on Univerzo Music. ${genre.description}`,
  image: genre.image,
  type: 'music.playlist',
  structuredData: [
    collectionStructuredData({
      path: `/genre/${genre.id}`,
      name: `${genre.title} songs`,
      description: genre.description,
      image: genre.image,
      about: {
        '@type': 'Thing',
        name: genre.title,
      },
    }),
  ],
  bodyHtml: renderShell({
    eyebrow: 'Genre Lane',
    title: genre.title,
    description: `${genre.description} ${genre.subtitle}`,
    primaryLinks: [
      { href: '/trending', label: 'Open trending' },
      { href: '/search?q=' + encodeURIComponent(genre.query), label: 'Search this genre' },
    ],
    secondaryLinks: genre.tags.map((tag) => ({
      href: '/search?q=' + encodeURIComponent(`${genre.title} ${tag}`),
      label: tag,
    })),
    tertiaryLinks: trackHubLinks.slice(0, 8),
  }),
}));

const playlistRoutes = featuredPlaylists.map((playlist) => ({
  path: `/playlist/${playlist.id}`,
  title: `${playlist.title} Playlist | ${SITE_NAME}`,
  description: playlist.description,
  image: playlist.cover,
  type: 'music.playlist',
  structuredData: [
    collectionStructuredData({
      path: `/playlist/${playlist.id}`,
      name: playlist.title,
      description: playlist.description,
      image: playlist.cover,
      about: {
        '@type': 'Thing',
        name: playlist.title,
      },
    }),
  ],
  bodyHtml: renderShell({
    eyebrow: 'Featured Playlist',
    title: playlist.title,
    description: `${playlist.description} Open the playlist route to load the interactive queue and live catalog results.`,
    primaryLinks: [
      { href: '/playlists', label: 'Your playlists' },
      { href: '/search?q=' + encodeURIComponent(playlist.query), label: 'Search similar songs' },
      { href: '/tracks', label: 'Browse public track pages' },
    ],
    secondaryLinks: playlistLinks
      .filter((item) => item.href !== `/playlist/${playlist.id}`)
      .slice(0, 5),
    tertiaryLinks: trackHubLinks.slice(0, 8),
  }),
}));

const artistRoutes = snapshot.artists.map((artist) => {
  const artistTracks = artist.sampleTrackIds
    .map((trackId) => snapshotTrackMap.get(trackId))
    .filter(Boolean);

  const sampleTrackLinks = artistTracks
    .map((track) => ({
      href: `/track/${track.id}`,
      label: `${track.title}${track.album ? ` from ${track.album}` : ''}`,
    }));

  const albumLinks = artist.sampleAlbumSlugs
    .map((albumSlug) => snapshotAlbumMap.get(albumSlug))
    .filter(Boolean)
    .map((album) => ({
      href: `/album/${album.slug}`,
      label: `${album.title} by ${album.artist}`,
    }));

  return {
    path: `/artist/${artist.slug}`,
    title: `${artist.name} | Artist Page on ${SITE_NAME}`,
    description: artist.summary,
    image: artist.image,
    type: 'profile',
    structuredData: [artistStructuredData(artist)],
    bootstrapData: {
      artist,
      tracks: artistTracks,
    },
    bodyHtml: renderShell({
      eyebrow: 'Artist',
      title: artist.name,
      description: artist.summary,
      primaryLinks: [
        { href: '/artists', label: 'Back to artists' },
        { href: '/tracks', label: 'Browse tracks' },
      ],
      secondaryLinks: sampleTrackLinks,
      tertiaryLinks: albumLinks,
    }),
  };
});

const albumRoutes = snapshot.albums.map((album) => {
  const albumTracks = album.sampleTrackIds
    .map((trackId) => snapshotTrackMap.get(trackId))
    .filter(Boolean);

  const sampleTrackLinks = albumTracks
    .map((track) => ({
      href: `/track/${track.id}`,
      label: `${track.title} by ${track.artist}`,
    }));

  const artist = snapshotArtistMap.get(album.artistSlug);

  return {
    path: `/album/${album.slug}`,
    title: `${album.title} | ${album.artist ? `${album.artist} on ` : ''}${SITE_NAME}`,
    description: album.summary,
    image: album.cover,
    type: 'music.album',
    structuredData: [albumStructuredData(album)],
    bootstrapData: {
      album,
      tracks: albumTracks,
    },
    bodyHtml: renderShell({
      eyebrow: 'Album',
      title: album.title,
      description: album.summary,
      primaryLinks: [
        { href: '/albums', label: 'Back to albums' },
        artist ? { href: `/artist/${artist.slug}`, label: `Open ${artist.name}` } : { href: '/artists', label: 'Browse artists' },
      ],
      secondaryLinks: sampleTrackLinks,
      tertiaryLinks: artist ? [{ href: `/artist/${artist.slug}`, label: `${artist.name} - artist page` }] : [],
    }),
  };
});

const trackRoutes = snapshot.tracks.map((track) => {
  const artist = snapshotArtistMap.get(track.artistSlug);
  const album = snapshotAlbumMap.get(track.albumSlug);
  const relatedTracks = (artist?.sampleTrackIds || [])
    .map((trackId) => snapshotTrackMap.get(trackId))
    .filter((candidate) => candidate && candidate.id !== track.id)
    .slice(0, 6);

  return {
    path: `/track/${track.id}`,
    title: `${track.title} by ${track.artist} | ${SITE_NAME}`,
    description: track.summary,
    image: track.cover,
    type: 'music.song',
    structuredData: [trackStructuredData(track)],
    bootstrapData: {
      track,
      similarTracks: relatedTracks,
    },
    bodyHtml: renderShell({
      eyebrow: 'Track',
      title: track.title,
      description: track.summary,
      primaryLinks: [
        artist ? { href: `/artist/${artist.slug}`, label: `Open ${artist.name}` } : { href: '/artists', label: 'Browse artists' },
        album ? { href: `/album/${album.slug}`, label: `Open ${album.title}` } : { href: '/albums', label: 'Browse albums' },
      ],
      secondaryLinks: [
        artist ? { href: `/artist/${artist.slug}`, label: `${artist.name} - artist page` } : null,
        album ? { href: `/album/${album.slug}`, label: `${album.title} - album page` } : null,
      ].filter(Boolean),
      tertiaryLinks: track.sourceKeys
        .slice(0, 5)
        .map((sourceKey) => genres.find((genre) => genre.id === sourceKey))
        .filter(Boolean)
        .map((genre) => ({
          href: `/genre/${genre.id}`,
          label: `${genre.title} genre page`,
        })),
    }),
  };
});

export const seoRoutes = [
  ...baseRoutes,
  ...genreRoutes,
  ...playlistRoutes,
  ...artistRoutes,
  ...albumRoutes,
  ...trackRoutes,
];

export const sitemapRoutes = seoRoutes.map((route) => ({
  path: route.path,
  changefreq:
    route.path === '/' || route.path === '/trending'
      ? 'daily'
      : route.path.startsWith('/track/')
        ? 'weekly'
        : 'weekly',
  priority:
    route.path === '/'
      ? '1.0'
      : route.path === '/trending'
        ? '0.9'
        : route.path.startsWith('/genre/')
          ? '0.8'
          : route.path.startsWith('/artist/') || route.path.startsWith('/album/') || route.path.startsWith('/tracks') || route.path.startsWith('/artists') || route.path.startsWith('/albums')
            ? '0.75'
            : route.path.startsWith('/track/')
              ? '0.7'
              : '0.7',
}));

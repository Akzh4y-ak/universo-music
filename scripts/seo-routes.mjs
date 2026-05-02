import { featuredPlaylists } from '../src/data/featuredPlaylists.js';
import { genres } from '../src/data/genres.js';

export const SITE_NAME = 'Univerzo Music';
export const SITE_URL = 'https://universo-music.vercel.app';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

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

function renderShell({ eyebrow, title, description, primaryLinks = [], secondaryLinks = [] }) {
  const primaryHtml = primaryLinks
    .map(
      (link) =>
        `<a href="${link.href}" style="display:inline-flex;margin:0 12px 12px 0;padding:12px 18px;border-radius:999px;background:#1ed760;color:#04110a;font-weight:700;text-decoration:none;">${link.label}</a>`,
    )
    .join('');

  const secondaryHtml = secondaryLinks
    .map(
      (link) =>
        `<li style="margin:0 0 10px;"><a href="${link.href}" style="color:#d7ffe7;text-decoration:none;">${link.label}</a></li>`,
    )
    .join('');

  return `
    <main style="min-height:100vh;background:#050505;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:48px 20px;">
      <div style="max-width:960px;margin:0 auto;">
        <p style="margin:0 0 16px;color:#7be6a7;font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;">${eyebrow}</p>
        <h1 style="margin:0 0 18px;font-size:clamp(2.2rem,5vw,4.5rem);line-height:1.05;">${title}</h1>
        <p style="max-width:760px;margin:0 0 28px;color:#c7c7c7;font-size:1.05rem;line-height:1.7;">${description}</p>
        <div style="margin:0 0 32px;">${primaryHtml}</div>
        ${
          secondaryHtml
            ? `<section style="max-width:760px;padding:24px;border:1px solid rgba(255,255,255,.08);border-radius:24px;background:rgba(255,255,255,.04);">
                <h2 style="margin:0 0 16px;font-size:1.2rem;">Explore more</h2>
                <ul style="margin:0;padding-left:18px;color:#c7c7c7;">${secondaryHtml}</ul>
              </section>`
            : ''
        }
      </div>
    </main>
  `;
}

const homepageLinks = genres.slice(0, 6).map((genre) => ({
  href: `/genre/${genre.id}`,
  label: genre.title,
}));

const playlistLinks = featuredPlaylists.map((playlist) => ({
  href: `/playlist/${playlist.id}`,
  label: playlist.title,
}));

export const seoRoutes = [
  {
    path: '/',
    title: 'Univerzo Music | Free Music Streaming Without Sign-in',
    description:
      'Stream trending songs, genre mixes, and artist discoveries on Univerzo Music. Listen instantly in your browser without a sign-in wall.',
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
        'Explore trending songs, browse popular genres, and jump into featured playlist routes before the interactive player finishes loading.',
      primaryLinks: [
        { href: '/trending', label: 'Open trending' },
        { href: '/playlist/desi-hits', label: 'Play desi hits' },
      ],
      secondaryLinks: [...homepageLinks, ...playlistLinks.slice(0, 3)],
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
      ],
      secondaryLinks: genres.slice(0, 8).map((genre) => ({
        href: `/genre/${genre.id}`,
        label: `${genre.title} - ${genre.subtitle}`,
      })),
    }),
  },
  ...genres.map((genre) => ({
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
    }),
  })),
  ...featuredPlaylists.map((playlist) => ({
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
      ],
      secondaryLinks: playlistLinks
        .filter((item) => item.href !== `/playlist/${playlist.id}`)
        .slice(0, 5),
    }),
  })),
];

export const sitemapRoutes = seoRoutes
  .filter((route) => route.path === '/' || route.path === '/trending' || route.path.startsWith('/genre/') || route.path.startsWith('/playlist/'))
  .map((route) => ({
    path: route.path,
    changefreq: route.path === '/' || route.path === '/trending' ? 'daily' : 'weekly',
    priority: route.path === '/' ? '1.0' : route.path === '/trending' ? '0.9' : route.path.startsWith('/genre/') ? '0.8' : '0.7',
  }));

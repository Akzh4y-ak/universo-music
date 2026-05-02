import { SITE_NAME, SITE_URL, buildCanonicalUrl, formatIsoDuration } from './seo';

/**
 * Build Music Recording Schema.org structure
 * Use for individual tracks/songs
 */
export function buildMusicRecordingSchema({
  trackName,
  artist,
  albumName,
  duration,
  datePublished,
  url,
  image,
  description,
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: trackName,
    url: url || buildCanonicalUrl(`/track/${trackName}`),
    description: description || `Listen to ${trackName} by ${artist} on ${SITE_NAME}`,
    byArtist: {
      '@type': 'Person',
      name: artist,
    },
  };

  if (albumName) {
    schema.inAlbum = {
      '@type': 'MusicAlbum',
      name: albumName,
    };
  }

  if (image) {
    schema.image = image;
  }

  if (duration) {
    schema.duration = formatIsoDuration(duration);
  }

  if (datePublished) {
    schema.datePublished = datePublished;
  }

  return schema;
}

/**
 * Build Music Album Schema.org structure
 */
export function buildMusicAlbumSchema({
  albumName,
  artist,
  datePublished,
  url,
  image,
  tracks = [],
  description,
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: albumName,
    url: url || buildCanonicalUrl(`/album/${albumName}`),
    description: description || `Discover ${albumName} album by ${artist} on ${SITE_NAME}`,
    byArtist: {
      '@type': 'Person',
      name: artist,
    },
  };

  if (image) {
    schema.image = image;
  }

  if (datePublished) {
    schema.datePublished = datePublished;
  }

  if (tracks.length > 0) {
    schema.tracks = {
      '@type': 'ItemList',
      itemListElement: tracks.map((track, index) => ({
        '@type': 'MusicRecording',
        position: index + 1,
        name: track.name,
        byArtist: {
          '@type': 'Person',
          name: track.artist || artist,
        },
      })),
    };
  }

  return schema;
}

/**
 * Build Person (Artist) Schema.org structure
 */
export function buildArtistSchema({
  artistName,
  url,
  image,
  description,
  genre = [],
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artistName,
    url: url || buildCanonicalUrl(`/artist/${artistName}`),
    description: description || `Explore ${artistName}'s music on ${SITE_NAME}`,
  };

  if (image) {
    schema.image = image;
  }

  if (genre && genre.length > 0) {
    schema.genre = genre;
  }

  return schema;
}

/**
 * Build Music Playlist Schema.org structure
 */
export function buildPlaylistSchema({
  playlistName,
  url,
  image,
  description,
  creator,
  tracks = [],
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: playlistName,
    url: url || buildCanonicalUrl(`/playlist/${playlistName}`),
    description: description || `Listen to ${playlistName} playlist on ${SITE_NAME}`,
  };

  if (creator) {
    schema.creator = {
      '@type': 'Person',
      name: creator,
    };
  }

  if (image) {
    schema.image = image;
  }

  if (tracks.length > 0) {
    schema.track = {
      '@type': 'ItemList',
      itemListElement: tracks.map((track, index) => ({
        '@type': 'MusicRecording',
        position: index + 1,
        name: track.name,
        byArtist: {
          '@type': 'Person',
          name: track.artist,
        },
      })),
    };
  }

  return schema;
}

/**
 * Build Audio Object Schema.org structure
 */
export function buildAudioSchema({
  trackName,
  artist,
  url,
  contentUrl,
  duration,
  uploadDate,
  description,
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AudioObject',
    name: trackName,
    description: description || `${trackName} by ${artist}`,
    url: url || buildCanonicalUrl(`/track/${trackName}`),
    creator: {
      '@type': 'Person',
      name: artist,
    },
  };

  if (contentUrl) {
    schema.contentUrl = contentUrl;
  }

  if (duration) {
    schema.duration = formatIsoDuration(duration);
  }

  if (uploadDate) {
    schema.uploadDate = uploadDate;
  }

  return schema;
}

/**
 * Build Organization Schema.org structure for the app
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    description: 'Discover, stream, and explore music from artists around the world',
    sameAs: [
      'https://twitter.com/univerzomusic',
      'https://instagram.com/univerzomusic',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      url: SITE_URL,
    },
  };
}

/**
 * Build Website Search Action Schema (for Google Search Box)
 */
export function buildSearchActionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Build FAQPage Schema for music-related FAQs
 */
export function buildFAQSchema(faqs = []) {
  if (!Array.isArray(faqs) || faqs.length === 0) {
    faqs = getDefaultMusicFAQs();
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Default music-related FAQs for schema
 */
export function getDefaultMusicFAQs() {
  return [
    {
      question: 'What is Univerzo Music?',
      answer:
        'Univerzo Music is a free music discovery and streaming platform that lets you explore songs, albums, and artists from multiple music catalogs including JioSaavn.',
    },
    {
      question: 'How do I search for music on Univerzo?',
      answer:
        'Use the search feature on the home page to find artists, songs, albums, or playlists. Results are fetched from multiple music providers in real-time.',
    },
    {
      question: 'Can I create and save playlists?',
      answer:
        'Yes! You can create custom playlists, add your favorite songs, and save them locally in your library. Your playlists are stored on your device.',
    },
    {
      question: 'Is Univerzo Music free?',
      answer:
        'Yes, Univerzo Music is completely free to use. You can search, discover, and explore unlimited music without any subscription.',
    },
    {
      question: 'What music providers do you use?',
      answer:
        'We aggregate music data from multiple providers including JioSaavn, which gives you access to millions of songs across different genres and languages.',
    },
    {
      question: 'Can I listen to complete songs on Univerzo?',
      answer:
        'Univerzo Music primarily focuses on music discovery and metadata. For full playback, you can be redirected to supported music platforms based on availability.',
    },
  ];
}

/**
 * Build multiple structured data items as an array
 * Useful for combining multiple schema types on one page
 */
export function combineSchemas(...schemas) {
  return schemas.filter(Boolean);
}

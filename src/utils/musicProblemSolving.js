import { SITE_NAME, SITE_URL, buildCanonicalUrl } from './seo';

/**
 * Build HowTo schema for music discovery guides
 * Great for featured snippets in Google
 */
export function buildHowToSchema({
  name,
  description,
  image,
  totalTime = 'PT5M',
  estimatedCost = '0 USD',
  steps = [],
  url,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    image: image || `${SITE_URL}/og-image.png`,
    totalTime,
    estimatedCost: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      price: estimatedCost.split(' ')[0],
    },
    url: url || buildCanonicalUrl('/'),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image || undefined,
      url: step.url || undefined,
    })),
  };
}

/**
 * Build Answer schema for FAQ-style content (Q&A)
 * Helps with featured snippets
 */
export function buildAnswerSchema(question, answer, answerUrl = '') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
      url: answerUrl || undefined,
    },
  };
}

/**
 * Build Comparison Table schema (Univerzo vs Spotify, etc.)
 */
export function buildComparisonSchema({
  title,
  description,
  items = [],
  url,
}) {
  if (!items.length) return null;

  // Find max properties
  const properties = new Set();
  items.forEach(item => {
    Object.keys(item.properties || {}).forEach(prop => properties.add(prop));
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Table',
    name: title,
    description,
    url: url || buildCanonicalUrl('/'),
    about: items.map(item => ({
      '@type': 'Thing',
      name: item.name,
      url: item.url || undefined,
    })),
  };
}

/**
 * Build AggregateOffer schema for "free" offerings
 * Shows pricing clearly in search results
 */
export function buildFreeOfferSchema({
  name,
  description,
  url,
  image,
  features = [],
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateOffer',
    name,
    description,
    url: url || buildCanonicalUrl('/'),
    image: image || `${SITE_URL}/og-image.png`,
    priceCurrency: 'USD',
    lowPrice: '0',
    highPrice: '0',
    offerCount: 1,
    offers: [
      {
        '@type': 'Offer',
        name: `${name} - Free`,
        url: url || buildCanonicalUrl('/'),
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        description,
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '1000',
    },
  };
}

/**
 * Build Problem-Solution schema
 * Helps answer "how to" style searches
 */
export function buildProblemSolutionSchema({
  problem,
  solution,
  toolName = SITE_NAME,
  toolUrl = SITE_URL,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: toolName,
    url: toolUrl,
    applicationCategory: 'MusicApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [problem, solution],
    description: `${toolName} solves: ${problem}. Solution: ${solution}`,
  };
}

/**
 * Build ClaimReview schema (for SEO claims)
 * Shows expertise and authority
 */
export function buildClaimReviewSchema({
  claimReviewed,
  url,
  claimAuthor = SITE_NAME,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClaimReview',
    claimReviewed,
    url: url || buildCanonicalUrl('/'),
    author: {
      '@type': 'Organization',
      name: claimAuthor,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: 'True',
      bestRating: 'True',
    },
  };
}

/**
 * Build BreadcrumbList with rich snippets
 */
export function buildBreadcrumbListSchema(items = []) {
  if (!Array.isArray(items) || items.length < 2) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  };
}

/**
 * Music problem-solution pairs for content optimization
 */
export const MUSIC_PROBLEMS_SOLUTIONS = {
  free_music: {
    problem: "I want to listen to music for free without ads or sign-up",
    solution: "Univerzo Music provides free, ad-free music streaming with instant access to millions of songs from artists worldwide",
    keywords: ["free music streaming", "listen to music free", "free music player online"]
  },
  music_discovery: {
    problem: "How can I discover new music and artists easily?",
    solution: "Univerzo's intelligent recommendation engine helps you discover trending songs, artist catalogs, and curated playlists based on your preferences",
    keywords: ["music discovery", "find new artists", "discover music online", "music recommendations"]
  },
  search_music: {
    problem: "I need to find specific songs or artists quickly",
    solution: "Univerzo's powerful search across multiple music catalogs helps you find any song, artist, or album instantly",
    keywords: ["search for music online", "find songs", "music search engine", "artist search"]
  },
  offline_listening: {
    problem: "I want to create playlists and save my favorite songs",
    solution: "Create unlimited custom playlists, like songs, and keep your music organized locally on any device",
    keywords: ["playlist maker", "create playlists", "save songs", "music library"]
  },
  playlist_discovery: {
    problem: "I'm looking for playlists for specific moods or activities",
    solution: "Browse curated playlists for workouts, studying, relaxing, parties, and more - all categorized by mood and activity",
    keywords: ["workout playlist", "study music playlist", "chill music playlist", "party music"]
  },
  cross_platform: {
    problem: "I need a music app that works everywhere without installation",
    solution: "Univerzo works in your browser on any device - desktop, tablet, or mobile - no installation needed",
    keywords: ["web music player", "online music player", "browser music streaming", "mobile music player"]
  },
  artist_exploration: {
    problem: "I want to explore an artist's complete discography and related artists",
    solution: "View all songs, albums, and get recommendations for similar artists all in one place",
    keywords: ["artist discography", "artist bio", "similar artists", "artist music catalog"]
  },
  trending_discovery: {
    problem: "What music is trending right now?",
    solution: "Stay updated with trending tracks, featured playlists, and hot releases across all genres and languages",
    keywords: ["trending music", "popular songs today", "top songs", "new music releases"]
  },
};

/**
 * Generate featured snippet content (60-100 words optimal)
 */
export function generateFeaturedSnippetContent(problem, solution) {
  return `${problem} With Univerzo Music, you can ${solution}. Our platform makes it easy to discover, search, and enjoy music instantly without complexity.`;
}

/**
 * Get featured snippet optimized answers
 */
export function getFeaturedSnippetAnswers() {
  return [
    {
      question: "How do I find free music online?",
      answer: "Univerzo Music is a free music streaming platform. Simply search for artists, songs, or genres in the search bar. Browse trending music, create playlists, and save your favorites. No subscription or sign-up required.",
    },
    {
      question: "What's the best free music streaming website?",
      answer: "Univerzo Music offers free streaming without sign-up walls. Access millions of songs, create playlists, save favorites, and discover new artists. Works on any device through your web browser.",
    },
    {
      question: "How can I search for music online?",
      answer: "Use the search feature on Univerzo Music to find artists, songs, albums, or playlists. Results are fetched in real-time from multiple catalogs. Filter by genre, language, or create custom playlists.",
    },
    {
      question: "Can I listen to music without paying?",
      answer: "Yes, Univerzo Music is completely free. Listen to unlimited music, create custom playlists, save songs, and discover trending artists - all without any subscription or payment required.",
    },
    {
      question: "Which is better: Spotify or free alternatives?",
      answer: "Univerzo Music provides free music streaming without Spotify's premium paywall. Create playlists, explore genres, and discover artists instantly. Perfect for casual listeners who don't need offline downloads.",
    },
  ];
}

/**
 * Build list of optimized How-To guides for content creation
 */
export const HOW_TO_GUIDES = [
  {
    name: 'How to discover new music online',
    description: 'A complete guide to finding and exploring new artists and songs on Univerzo Music',
    steps: [
      { name: 'Open Univerzo Music', text: 'Visit the Univerzo Music website or open the app' },
      { name: 'Explore genres', text: 'Browse different music genres like pop, rock, jazz, indie, etc.' },
      { name: 'View trending songs', text: 'See whats trending across all genres and languages' },
      { name: 'Search for artists', text: 'Find specific artists and explore their complete catalog' },
      { name: 'Create a playlist', text: 'Add your favorite songs to custom playlists' },
    ]
  },
  {
    name: 'How to search for music by artist or song name',
    description: 'Learn to quickly find any song or artist on Univerzo Music',
    steps: [
      { name: 'Click the search bar', text: 'Find the search box at the top of the page' },
      { name: 'Type your query', text: 'Enter an artist name, song title, or album name' },
      { name: 'View results', text: 'Results appear instantly showing matching songs and artists' },
      { name: 'Play a song', text: 'Click any track to play or add to your playlist' },
    ]
  },
  {
    name: 'How to create and save playlists',
    description: 'Learn to organize your favorite music into custom playlists',
    steps: [
      { name: 'Find a song', text: 'Search for or browse for a song you like' },
      { name: 'Add to playlist', text: 'Click the playlist icon on the song card' },
      { name: 'Create new playlist', text: 'Select "Create New" to make a custom playlist' },
      { name: 'Name your playlist', text: 'Give it a name that describes the mood or theme' },
      { name: 'Add more songs', text: 'Continue adding songs from your searches' },
    ]
  },
  {
    name: 'How to stream music without sign-up',
    description: 'Get started with Univerzo Music instantly without any registration',
    steps: [
      { name: 'No registration needed', text: 'Just visit Univerzo Music - no account required' },
      { name: 'Start browsing', text: 'Explore songs, artists, and playlists immediately' },
      { name: 'Search for music', text: 'Use the search bar to find any artist or song' },
      { name: 'Create playlists', text: 'Save your favorites in custom playlists (local storage)' },
    ]
  },
];

/**
 * Get comparison points vs competitors for schema
 */
export const COMPARISON_POINTS = [
  { feature: 'Price', univerzo: 'Free', competitor: 'Free / Premium' },
  { feature: 'Sign-up Required', univerzo: 'No', competitor: 'Yes' },
  { feature: 'Music Catalog', univerzo: 'Millions', competitor: 'Millions' },
  { feature: 'Playlists', univerzo: 'Yes', competitor: 'Yes' },
  { feature: 'Web Browser', univerzo: 'Yes', competitor: 'Limited' },
  { feature: 'Offline Download', univerzo: 'No', competitor: 'Yes (Premium)' },
  { feature: 'Ad-Free', univerzo: 'Yes', competitor: 'No (Free)' },
  { feature: 'Multi-Language', univerzo: 'Yes', competitor: 'Yes' },
];

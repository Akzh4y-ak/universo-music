/**
 * Music-specific keywords and metadata helpers for SEO
 * Helps optimize content for music discovery searches
 */

export const MUSIC_KEYWORDS = {
  general: [
    'free music streaming',
    'online music player',
    'music discovery',
    'play music online',
    'listen to songs',
    'music catalog',
    'digital music',
  ],
  genres: {
    pop: 'pop music, pop songs, top pop hits, modern pop',
    rock: 'rock music, rock songs, classic rock, rock bands',
    hiphop: 'hip-hop, rap music, hip hop songs, rap artists',
    jazz: 'jazz music, jazz standards, jazz artists, jazz songs',
    classical: 'classical music, symphony, orchestral music, composers',
    electronic: 'electronic music, EDM, dance music, electronic artists',
    indie: 'indie music, indie artists, independent music, indie pop',
    country: 'country music, country songs, country artists',
    rnb: 'R&B music, soul music, R&B songs, R&B artists',
    lofi: 'lo-fi music, lofi beats, chill music, study music',
    bollywood: 'Bollywood songs, Hindi music, Indian songs, Bollywood music',
    punjabi: 'Punjabi music, Punjabi songs, Punjabi artists, Punjabi bhangra',
  },
  languages: {
    english: 'English songs, English music, English artists',
    hindi: 'Hindi songs, Hindi music, Hindi movies',
    spanish: 'Spanish songs, Spanish music, Latin music',
    french: 'French songs, French music, French artists',
    german: 'German songs, German music, German artists',
  },
  activities: [
    'workout music',
    'party music',
    'chill music',
    'study music',
    'sleep music',
    'concentration music',
    'background music',
    'road trip music',
    'dance music',
    'romantic music',
  ],
  moods: [
    'sad songs',
    'happy music',
    'motivational songs',
    'energetic music',
    'relaxing music',
    'focus music',
    'upbeat songs',
  ],
};

/**
 * Get keywords for a specific genre
 */
export function getGenreKeywords(genre) {
  return MUSIC_KEYWORDS.genres[genre.toLowerCase()] || `${genre} music, ${genre} songs, ${genre} artists`;
}

/**
 * Get keywords for a specific language
 */
export function getLanguageKeywords(language) {
  return (
    MUSIC_KEYWORDS.languages[language.toLowerCase()] ||
    `${language} songs, ${language} music, ${language} artists`
  );
}

/**
 * Generate comprehensive meta keywords for a music page
 */
export function generateMusicKeywords(
  primaryKeyword,
  genre = '',
  artist = '',
  language = '',
  type = 'track'
) {
  const keywords = [primaryKeyword];

  // Add genre keywords
  if (genre) {
    keywords.push(getGenreKeywords(genre));
  }

  // Add language keywords
  if (language) {
    keywords.push(getLanguageKeywords(language));
  }

  // Add artist name variations
  if (artist) {
    keywords.push(
      artist,
      `${artist} songs`,
      `listen to ${artist}`,
      `${artist} music`
    );
  }

  // Add type-specific keywords
  switch (type) {
    case 'track':
      keywords.push('song', 'audio track', 'listen online');
      break;
    case 'album':
      keywords.push('album', 'full album', 'album release');
      break;
    case 'artist':
      keywords.push('artist profile', 'discography', 'artist songs');
      break;
    case 'playlist':
      keywords.push('playlist', 'collection', 'curated playlist');
      break;
    default:
      break;
  }

  // Add general music keywords
  keywords.push(...MUSIC_KEYWORDS.general);

  // Remove duplicates and join
  const uniqueKeywords = [...new Set(keywords)].filter(Boolean);
  return uniqueKeywords.slice(0, 15).join(', ');
}

/**
 * Generate rich metadata description for music content
 */
export function generateMusicDescription(
  contentName,
  artist = '',
  genre = '',
  type = 'track',
  customDescription = ''
) {
  if (customDescription) {
    return customDescription;
  }

  const descriptions = {
    track: `Listen to ${contentName}${artist ? ` by ${artist}` : ''} on Univerzo Music. ${
      genre ? `A ${genre} track` : 'Stream online for free'
    }.`,
    album: `Explore ${contentName}${artist ? ` by ${artist}` : ''} album on Univerzo Music. ${
      genre ? `${genre} album` : 'Complete album'
    } - stream all tracks.`,
    artist: `Discover ${contentName}'s music on Univerzo Music. Listen to songs, albums, and discography from ${contentName}${
      genre ? ` - ${genre} artist` : ''
    }.`,
    playlist: `Enjoy ${contentName} playlist on Univerzo Music. Curated collection of songs${
      genre ? ` in ${genre}` : ''
    } - stream online.`,
  };

  return descriptions[type] || descriptions.track;
}

/**
 * Get social media sharing title for music content
 */
export function getMusicShareTitle(contentName, artist, type = 'track') {
  const titles = {
    track: `Now listening to "${contentName}" by ${artist}`,
    album: `Exploring ${contentName} album by ${artist}`,
    artist: `Checking out ${contentName}'s music`,
    playlist: `Added to my playlist: ${contentName}`,
  };

  return titles[type] || titles.track;
}

/**
 * Generate hashtags for social sharing
 */
export function generateMusicHashtags(genre = '', artist = '', includeMain = true) {
  const hashtags = [];

  if (includeMain) {
    hashtags.push('#UniversoMusic', '#MusicDiscovery');
  }

  if (genre) {
    hashtags.push(`#${genre}Music`, `#${genre}`);
  }

  if (artist) {
    hashtags.push(`#${artist.replace(/\s+/g, '')}`);
  }

  hashtags.push('#StreamingMusic', '#FreeMusic', '#OnlineMusic');

  return hashtags.join(' ');
}

/**
 * Get emoji for a music genre (useful for visual SEO)
 */
export function getGenreEmoji(genre) {
  const emojis = {
    rock: '🎸',
    pop: '🎤',
    hiphop: '🎙️',
    jazz: '🎷',
    classical: '🎻',
    electronic: '🎹',
    indie: '🎵',
    country: '🤠',
    rnb: '🎶',
    lofi: '💽',
    bollywood: '🎬',
    punjabi: '🥁',
  };

  return emojis[genre.toLowerCase()] || '🎵';
}

/**
 * Create meta keywords string from components
 */
export function buildMetaKeywords(...keywords) {
  return keywords
    .filter(Boolean)
    .flat()
    .join(', ')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 10)
    .join(', ');
}

/**
 * Common music discovery phrases for organic search
 */
export const DISCOVERY_PHRASES = {
  search_intent: [
    'play music online',
    'free music streaming',
    'listen to songs',
    'music search engine',
  ],
  discovery: [
    'discover new artists',
    'music discovery platform',
    'find new songs',
    'explore music',
  ],
  specific_search: [
    'find songs by',
    'listen to artist',
    'search music',
    'music by artist',
  ],
  content_search: [
    'songs for workout',
    'best pop songs',
    'top songs today',
    'trending music',
  ],
};

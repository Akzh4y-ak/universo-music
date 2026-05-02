/**
 * Voice Search & Natural Language Optimization Utilities
 * Helps optimize for Google Assistant, Alexa, Siri voice queries
 */

export const VOICE_SEARCH_QUERIES = {
  discovery: [
    "Hey Google, where can I listen to music for free?",
    "Alexa, find me new music",
    "Siri, search for music online",
    "Show me trending music",
    "What's popular right now?",
  ],
  action: [
    "Play music for me",
    "Let me listen to songs",
    "Stream free music",
    "Find music for workout",
    "Play study music",
  ],
  search: [
    "Find music by artist",
    "Search for songs",
    "Show me songs by Taylor Swift",
    "Find jazz music",
    "Play lo-fi music",
  ],
  information: [
    "What's the best free music app?",
    "How do I listen to music online?",
    "Do I need to sign up for music?",
    "Is there free music streaming?",
    "Which is better Spotify or free music?",
  ],
};

/**
 * Conversational keywords optimized for voice queries
 */
export const CONVERSATIONAL_KEYWORDS = {
  questions: [
    "What is free music streaming?",
    "How do I search for music?",
    "Where can I find free music?",
    "Can I create playlists?",
    "Do I need an account?",
    "Is it really free?",
    "What songs can I find?",
    "How is the music quality?",
    "Can I share playlists?",
    "Works on what devices?",
  ],
  natural_language: [
    "I want to listen to music for free",
    "Show me new artists",
    "Play something relaxing",
    "I need workout music",
    "Find me indie pop songs",
    "Let me discover jazz",
    "Play Bollywood hits",
    "Give me trending tracks",
    "Search for this artist",
    "Create a study playlist",
  ],
  question_words: [
    "where to listen music free",
    "how to search music online",
    "what is best free music app",
    "can i stream without signup",
    "why choose free music platform",
    "who uses this service",
  ],
};

/**
 * Build conversational FAQ for voice search optimization
 */
export function buildVoiceSearchFAQ() {
  return [
    {
      question: "Where can I listen to music for free?",
      answer: "You can listen to music for free on Univerzo Music. Just visit the website in your browser, search for any artist or song, and start listening instantly without signing up.",
      topics: ["free music", "streaming"],
    },
    {
      question: "How do I find music online?",
      answer: "Use Univerzo's search bar to find artists, songs, albums, or playlists. Type what you're looking for and browse results instantly from millions of tracks.",
      topics: ["search", "discovery"],
    },
    {
      question: "Do I need to sign up?",
      answer: "No, you don't need to sign up. Univerzo Music works instantly in your browser. Just visit and start listening to music right away.",
      topics: ["sign-up", "instant access"],
    },
    {
      question: "What music can I find?",
      answer: "Univerzo has millions of songs across all genres - pop, rock, hip-hop, jazz, indie, Bollywood, Punjabi, and more. Multiple languages supported.",
      topics: ["music catalog", "genres"],
    },
    {
      question: "Can I create playlists?",
      answer: "Yes, you can create custom playlists, add your favorite songs, and organize them however you like. Your playlists are saved locally.",
      topics: ["playlists", "personalization"],
    },
    {
      question: "Is Univerzo Music really free?",
      answer: "Yes, Univerzo Music is completely free and will always be free. No hidden fees, no premium upgrade, no ads - just free music.",
      topics: ["pricing", "free"],
    },
    {
      question: "What devices work with Univerzo?",
      answer: "Univerzo works on any device with a web browser - desktop, laptop, tablet, or smartphone. No installation needed.",
      topics: ["devices", "compatibility"],
    },
    {
      question: "How is the audio quality?",
      answer: "Univerzo streams high-quality audio from its music catalog. Quality depends on your internet connection.",
      topics: ["quality", "audio"],
    },
  ];
}

/**
 * Natural language answer patterns (under 30 seconds read time)
 */
export function generateVoiceAnswer(question, compact = true) {
  const faqMap = {
    "free music": "Univerzo Music is completely free. No sign-up, no ads, just millions of songs to listen instantly.",
    "how search": "Use the search bar to find artists or songs. Results appear instantly. You can play any track.",
    "sign-up": "No sign-up needed. Just visit Univerzo Music and start listening right away.",
    "devices": "Works on desktop, tablet, and mobile through your web browser.",
    "playlists": "Create unlimited custom playlists. Save your favorite songs and organize them.",
  };

  for (const [key, answer] of Object.entries(faqMap)) {
    if (question.toLowerCase().includes(key)) {
      return answer;
    }
  }

  return "Visit Univerzo Music to stream free music from millions of songs across all genres.";
}

/**
 * Schema for voice-optimized content
 */
export function buildVoiceSearchSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: buildVoiceSearchFAQ().map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Natural language keywords for content optimization
 */
export const NL_KEYWORDS_BY_INTENT = {
  navigation: [
    "go to music app",
    "open music website",
    "take me to free music",
  ],
  informational: [
    "what is free music streaming",
    "how does music search work",
    "benefits of free music",
    "why no sign-up needed",
  ],
  transactional: [
    "play music for me",
    "create a workout playlist",
    "find lo-fi music",
    "search artist songs",
  ],
  local: [
    "music in my area",
    "artists from my city",
    "Bollywood music free",
    "Punjabi songs online",
  ],
};

/**
 * Voice search optimization tips
 */
export const VOICE_OPTIMIZATION_TIPS = {
  content: [
    "Use natural, conversational language",
    "Include question-answer format",
    "Keep sentences short (8-10 words max)",
    "Use common speaking patterns",
    "Include location-based keywords",
    "Answer 'how', 'what', 'where', 'why' questions",
  ],
  technical: [
    "Ensure fast page load (<3 seconds)",
    "Optimize for mobile devices",
    "Use schema.org markup",
    "Implement FAQ schema",
    "Clear heading structure (H1, H2)",
    "Concise meta descriptions",
  ],
  keywords: [
    "Focus on long-tail keywords",
    "Use question format",
    "Include conversational phrases",
    "Think about how people speak",
    "Target featured snippets",
    "Optimize for local terms",
  ],
};

/**
 * Generate voice-optimized page description
 */
export function generateVoiceOptimizedDescription(
  query,
  answer,
  keywordContext = ""
) {
  return `${answer}. Univerzo Music offers free music streaming with ${keywordContext || "millions of songs"}.`;
}

/**
 * Structured data for Answer boxes (common in voice results)
 */
export function buildAnswerBoxSchema(question, answer, answerUrl = "") {
  return {
    '@context': 'https://schema.org',
    '@type': 'Answer',
    text: answer,
    url: answerUrl || undefined,
    author: {
      '@type': 'Organization',
      name: 'Univerzo Music',
    },
  };
}

/**
 * Get featured snippet content for voice optimization
 * Typically 40-60 words, one clear sentence leading
 */
export function generateFeaturedSnippetForVoice(mainPoint, details) {
  return `${mainPoint}. ${details.join(". ")}. Try it on Univerzo Music.`;
}

/**
 * Music-specific voice queries
 */
export const MUSIC_VOICE_QUERIES = {
  artist_search: [
    "play songs by Taylor Swift",
    "find music from Arijit Singh",
    "show me tracks by The Weeknd",
    "play artist discography",
  ],
  mood_based: [
    "play relaxing music",
    "give me workout songs",
    "show me sad music",
    "find happy songs",
    "play romantic music",
  ],
  genre_based: [
    "play rock music",
    "show me jazz",
    "find indie pop",
    "play lo-fi beats",
    "show Bollywood songs",
  ],
  activity_based: [
    "music for studying",
    "party songs",
    "sleep music",
    "focus music",
    "meditation sounds",
  ],
  discovery: [
    "what's trending now",
    "show me popular songs",
    "find new artists",
    "recommend similar songs",
    "what should I listen to",
  ],
};

/**
 * Voice search performance metrics
 */
export function trackVoiceSearchMetrics() {
  return {
    "answered_queries": "Questions answered by voice assistant",
    "featured_snippets": "Times appeared in position zero",
    "voice_clicks": "Clicks from voice search results",
    "avg_position": "Average ranking position for voice queries",
    "impression_share": "Percentage of possible impressions received",
  };
}

import { useEffect, useState, useMemo } from 'react';
import { Search, Music, Play, Heart, Share2, Zap } from 'lucide-react';
import Seo from '../components/seo/Seo';
import { getTrendingTracks, searchTracks } from '../services/api';
import TrackCard from '../components/shared/TrackCard';
import TrackGrid from '../components/shared/TrackGrid';
import SkeletonCard from '../components/shared/SkeletonCard';
import { useMusic } from '../context/music';
import { usePlayer } from '../context/player';
import { filterExplicitTracks } from '../utils/catalog';
import { buildCanonicalUrl } from '../utils/seo';
import {
  buildFreeOfferSchema,
  buildHowToSchema,
  HOW_TO_GUIDES,
  buildComparisonSchema,
  COMPARISON_POINTS,
  getFeaturedSnippetAnswers,
} from '../utils/musicProblemSolving';

const FreeStreamingPage = () => {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { preferences, allTracks } = useMusic();
  const { playTrack } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await getTrendingTracks('featured mix', 12, 0);
        const popular = await searchTracks('free music', 12);
        setTrendingTracks(trending);
        setPopularTracks(popular);
      } catch (error) {
        console.error('Failed to load music:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const visibleTrending = useMemo(() => {
    return filterExplicitTracks(trendingTracks, preferences.allowExplicit);
  }, [trendingTracks, preferences.allowExplicit]);

  const visiblePopular = useMemo(() => {
    return filterExplicitTracks(popularTracks, preferences.allowExplicit);
  }, [popularTracks, preferences.allowExplicit]);

  // Schema data
  const freeOfferSchema = buildFreeOfferSchema({
    name: 'Univerzo Music - Free Music Streaming',
    description:
      'Listen to millions of songs for free. No sign-up, no ads, no premium required. Stream music online from any device.',
    url: buildCanonicalUrl('/free-streaming'),
    image: 'https://universo-music.vercel.app/og-image.png',
    features: [
      'Free forever',
      'No sign-up required',
      'Ad-free listening',
      'Millions of songs',
      'Create playlists',
      'Works on any device',
    ],
  });

  const howToSchema = buildHowToSchema({
    name: 'How to Listen to Music for Free Online',
    description: 'A complete guide to streaming music without sign-up or payment on Univerzo Music',
    totalTime: 'PT2M',
    steps: HOW_TO_GUIDES[3].steps,
    url: buildCanonicalUrl('/free-streaming'),
  });

  const snippetAnswers = getFeaturedSnippetAnswers();

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Seo
        title="Free Music Streaming Online - No Sign-up | Univerzo Music"
        description="Listen to millions of songs for free on Univerzo Music. No sign-up, no ads, no subscriptions. Stream trending music and discover new artists instantly."
        path="/free-streaming"
        image="https://universo-music.vercel.app/og-image.png"
        type="website"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Free Streaming', path: '/free-streaming' },
        ]}
        structuredData={[freeOfferSchema, howToSchema]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,_rgba(30,215,96,0.25),_rgba(30,215,96,0.08),_rgba(139,92,246,0.15))] p-12 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">
            Free Music Streaming <span className="text-brand">Forever</span>
          </h1>
          <p className="text-xl text-text-subdued mb-6">
            No sign-up. No ads. No subscriptions. Just millions of songs at your fingertips. Listen instantly on any device.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand/20 text-brand">
              <Music className="w-5 h-5" />
              <span className="font-semibold">Millions of Songs</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Instant Play</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Save Favorites</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Featured Snippets Optimized */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Free Music Streaming Questions Answered</h2>
        <div className="grid gap-4">
          {snippetAnswers.map((item, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-6 hover:bg-white/8 transition-all">
              <h3 className="text-lg font-semibold mb-3 text-brand">{item.question}</h3>
              <p className="text-text-subdued leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Univerzo - Problem Solving */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Why Choose Free Music Streaming?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: '🎵',
              title: 'Millions of Songs',
              desc: 'Access trending tracks, classic hits, and hidden gems across all genres and languages',
            },
            {
              icon: '⚡',
              title: 'Instant Access',
              desc: 'No waiting, no installation. Open your browser and start listening immediately',
            },
            {
              icon: '✨',
              title: 'Ad-Free Experience',
              desc: 'Enjoy uninterrupted music without ads breaking your flow',
            },
            {
              icon: '🔐',
              title: 'No Sign-Up Required',
              desc: 'Start listening instantly without creating an account or sharing personal info',
            },
            {
              icon: '🎧',
              title: 'Works Everywhere',
              desc: 'Stream on desktop, tablet, or mobile - any device with a browser',
            },
            {
              icon: '❤️',
              title: 'Create Playlists',
              desc: 'Save your favorite songs and organize them into custom playlists',
            },
          ].map((item, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-text-subdued text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">How to Stream Music for Free</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Open Univerzo', desc: 'Visit Univerzo Music in your browser' },
            { step: '2', title: 'Search or Browse', desc: 'Find artists, songs, or explore genres' },
            { step: '3', title: 'Click Play', desc: 'Stream any track instantly for free' },
            { step: '4', title: 'Save & Share', desc: 'Create playlists and share with friends' },
          ].map((item, index) => (
            <div key={index} className="rounded-lg border border-brand/30 bg-brand/10 p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand text-black font-bold text-lg mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-text-subdued">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison vs Paid Services */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Free vs Premium Music Apps</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-lg border border-white/10 overflow-hidden">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Feature</th>
                <th className="px-6 py-4 text-left font-semibold text-brand">Univerzo Music</th>
                <th className="px-6 py-4 text-left font-semibold text-text-subdued">Spotify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {COMPARISON_POINTS.map((point, index) => (
                <tr key={index} className="hover:bg-white/5">
                  <td className="px-6 py-3">{point.feature}</td>
                  <td className="px-6 py-3 text-brand font-semibold">{point.univerzo}</td>
                  <td className="px-6 py-3">{point.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trending Now */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Trending Free Music Now</h2>
        {loading ? (
          <TrackGrid>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </TrackGrid>
        ) : (
          <TrackGrid>
            {visibleTrending.map((track, index) => (
              <TrackCard key={track.id} track={track} queueContext={visibleTrending} queueIndex={index} />
            ))}
          </TrackGrid>
        )}
      </section>

      {/* CTA Section */}
      <section className="rounded-[28px] border border-brand/50 bg-[linear-gradient(135deg,_rgba(30,215,96,0.15),_rgba(30,215,96,0.05))] p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Listen for Free?</h2>
        <p className="text-text-subdued mb-6 max-w-2xl mx-auto">
          Start streaming millions of songs instantly. No credit card, no sign-up, no strings attached.
        </p>
        <a
          href="/search"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-brand text-black font-semibold hover:bg-green-400 transition-all"
        >
          <Search className="w-5 h-5" />
          Explore Music Now
        </a>
      </section>

      {/* Featured Snippet Schema Hidden */}
      {snippetAnswers.map((answer, index) => (
        <script key={`snippet-${index}`} type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Question',
            name: answer.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: answer.answer,
            },
          })}
        </script>
      ))}
    </div>
  );
};

export default FreeStreamingPage;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { MusicProvider } from './context/MusicContext';
import { PlayerProvider } from './context/PlayerContext';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Layout from './components/layout/Layout';

function lazyRoute(routeKey, importer) {
  return lazy(async () => {
    const reloadKey = `univerzo-route-retry:${routeKey}`;

    try {
      const module = await importer();
      sessionStorage.removeItem(reloadKey);
      return module;
    } catch (error) {
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, '1');
        window.location.reload();
      }

      throw error;
    }
  });
}

const Home = lazyRoute('home', () => import('./pages/Home'));
const ArtistsDirectoryPage = lazyRoute('artists-directory', () => import('./pages/ArtistsDirectoryPage'));
const AlbumsDirectoryPage = lazyRoute('albums-directory', () => import('./pages/AlbumsDirectoryPage'));
const TracksDirectoryPage = lazyRoute('tracks-directory', () => import('./pages/TracksDirectoryPage'));
const SearchPage = lazyRoute('search', () => import('./pages/SearchPage'));
const TrendingPage = lazyRoute('trending', () => import('./pages/TrendingPage'));
const LikedSongs = lazyRoute('liked', () => import('./pages/LikedSongs'));
const RecentPlays = lazyRoute('recent', () => import('./pages/RecentPlays'));
const PlaylistsPage = lazyRoute('playlists', () => import('./pages/PlaylistsPage'));
const LibraryPage = lazyRoute('library', () => import('./pages/LibraryPage'));
const PlaylistPage = lazyRoute('playlist', () => import('./pages/PlaylistPage'));
const ArtistPage = lazyRoute('artist', () => import('./pages/ArtistPage'));
const AlbumPage = lazyRoute('album', () => import('./pages/AlbumPage'));
const GenrePage = lazyRoute('genre', () => import('./pages/GenrePage'));
const TrackPage = lazyRoute('track', () => import('./pages/TrackPage'));
const NowPlayingPage = lazyRoute('now-playing', () => import('./pages/NowPlayingPage'));
const SettingsPage = lazyRoute('settings', () => import('./pages/SettingsPage'));
const AdminPortal = lazyRoute('admin', () => import('./pages/AdminPortal'));
const NotFoundPage = lazyRoute('not-found', () => import('./pages/NotFoundPage'));

function App() {
  // Silent "New User" Email Notification
  useEffect(() => {
    const hasReported = localStorage.getItem('univerzo_new_user_reported');
    if (!hasReported) {
      // It's a new unique visitor!
      fetch('https://formspree.io/f/xjkobyjv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: '🎉 NEW_UNIQUE_VISITOR',
          message: 'Someone just visited Univerzo Music for the very first time on this device!',
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          language: navigator.language
        })
      }).then((response) => {
        if (response.ok) {
          // Only mark as reported if the email was successfully sent
          localStorage.setItem('univerzo_new_user_reported', 'true');
        }
      }).catch(() => {
        // Silently ignore errors to not disrupt the user experience
      });
    }
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <MusicProvider>
          <PlayerProvider>
            <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-black text-brand text-2xl animate-pulse">Loading Univerzo...</div>}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="artists" element={<ArtistsDirectoryPage />} />
                  <Route path="albums" element={<AlbumsDirectoryPage />} />
                  <Route path="tracks" element={<TracksDirectoryPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="trending" element={<TrendingPage />} />
                  <Route path="liked" element={<LikedSongs />} />
                  <Route path="recent" element={<RecentPlays />} />
                  <Route path="playlists" element={<PlaylistsPage />} />
                  <Route path="library" element={<LibraryPage />} />
                  <Route path="playlist/:slug" element={<PlaylistPage />} />
                  <Route path="artist/:slug" element={<ArtistPage />} />
                  <Route path="album/:slug" element={<AlbumPage />} />
                  <Route path="genre/:id" element={<GenrePage />} />
                  <Route path="track/:id" element={<TrackPage />} />
                  <Route path="now-playing" element={<NowPlayingPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
                <Route path="/admin" element={<AdminPortal />} />
              </Routes>
              <Analytics />
              <SpeedInsights />
            </Suspense>
          </PlayerProvider>
        </MusicProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;

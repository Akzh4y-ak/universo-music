import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { MusicProvider } from './context/MusicContext';
import { PlayerProvider } from './context/PlayerContext';
import Layout from './components/layout/Layout';
import { HelmetProvider } from 'react-helmet-async';

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
const SearchPage = lazyRoute('search', () => import('./pages/SearchPage'));
const TrendingPage = lazyRoute('trending', () => import('./pages/TrendingPage'));
const LikedSongs = lazyRoute('liked', () => import('./pages/LikedSongs'));
const RecentPlays = lazyRoute('recent', () => import('./pages/RecentPlays'));
const PlaylistsPage = lazyRoute('playlists', () => import('./pages/PlaylistsPage'));
const PlaylistPage = lazyRoute('playlist', () => import('./pages/PlaylistPage'));
const ArtistPage = lazyRoute('artist', () => import('./pages/ArtistPage'));
const AlbumPage = lazyRoute('album', () => import('./pages/AlbumPage'));
const GenrePage = lazyRoute('genre', () => import('./pages/GenrePage'));
const NowPlayingPage = lazyRoute('now-playing', () => import('./pages/NowPlayingPage'));
const SettingsPage = lazyRoute('settings', () => import('./pages/SettingsPage'));
const NotFoundPage = lazyRoute('not-found', () => import('./pages/NotFoundPage'));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <MusicProvider>
          <PlayerProvider>
            <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-black text-brand text-2xl animate-pulse">Loading Univerzo...</div>}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="trending" element={<TrendingPage />} />
                  <Route path="liked" element={<LikedSongs />} />
                  <Route path="recent" element={<RecentPlays />} />
                  <Route path="playlists" element={<PlaylistsPage />} />
                  <Route path="playlist/:slug" element={<PlaylistPage />} />
                  <Route path="artist/:slug" element={<ArtistPage />} />
                  <Route path="album/:slug" element={<AlbumPage />} />
                  <Route path="genre/:id" element={<GenrePage />} />
                  <Route path="now-playing" element={<NowPlayingPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </PlayerProvider>
        </MusicProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;

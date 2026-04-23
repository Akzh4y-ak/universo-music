import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Heart, Clock, Library, SlidersHorizontal, Settings, MessageSquare } from 'lucide-react';
import { useMusic } from '../context/music';

const LibraryPage = () => {
  const { likedSongs, playlists, recentPlays, setIsFeedbackOpen } = useMusic();

  return (
    <div className="flex flex-col gap-8 pb-32 md:pb-8">
      <Helmet>
        <title>Your Library - Univerzo Music</title>
      </Helmet>

      <header className="flex items-center justify-between pt-4">
        <h1 className="text-3xl font-black tracking-tight text-white">Your Library</h1>
        <div className="flex items-center gap-4">
          <Link to="/settings" className="text-text-muted hover:text-white transition-colors">
            <Settings className="h-6 w-6" />
          </Link>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button className="whitespace-nowrap rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
          Playlists
        </button>
        <button className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-text-muted hover:text-white transition-colors">
          Artists
        </button>
        <button className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-text-muted hover:text-white transition-colors">
          Albums
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <Link 
          to="/liked" 
          className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5 active:bg-white/10"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-purple-800 shadow-lg">
            <Heart className="h-8 w-8 fill-white text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white">Liked Songs</p>
            <p className="text-sm text-text-muted flex items-center gap-1">
              <span className="text-brand">★</span> Playlist • {likedSongs.length} songs
            </p>
          </div>
        </Link>

        {playlists.map((playlist) => (
          <Link 
            key={playlist.id}
            to={`/playlist/${playlist.id}`}
            className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5 active:bg-white/10"
          >
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-white/5 shadow-lg">
               <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-2xl font-bold text-white/20">
                 {playlist.title.charAt(0)}
               </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white">{playlist.title}</p>
              <p className="text-sm text-text-muted">
                Playlist • {playlist.tracks.length} songs
              </p>
            </div>
          </Link>
        ))}

        <Link 
          to="/recent" 
          className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5 active:bg-white/10"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-white/5 shadow-lg">
            <Clock className="h-8 w-8 text-text-muted" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white">Recently Played</p>
            <p className="text-sm text-text-muted">
              History • {recentPlays.length} tracks
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-4 px-1">
         <button className="flex items-center gap-4 text-text-muted hover:text-white transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <Library className="h-5 w-5" />
            </div>
            <span className="font-semibold">Add artists</span>
         </button>
         
         <button 
           onClick={() => setIsFeedbackOpen(true)}
           className="flex items-center gap-4 text-text-muted hover:text-white transition-colors"
         >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <MessageSquare className="h-5 w-5" />
            </div>
            <span className="font-semibold">Send Feedback</span>
         </button>
      </div>
    </div>
  );
};

export default LibraryPage;

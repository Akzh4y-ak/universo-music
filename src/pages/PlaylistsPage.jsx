import { useMemo, useState } from 'react';
import { LibraryBig, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CatalogFeedback from '../components/shared/CatalogFeedback';
import Seo from '../components/seo/Seo';
import { useMusic } from '../context/music';

const PlaylistsPage = () => {
  const navigate = useNavigate();
  const { playlists, createPlaylist, setActivePlaylistId } = useMusic();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const sortedPlaylists = useMemo(() => {
    return [...playlists].sort((left, right) => {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
  }, [playlists]);

  const handleCreatePlaylist = (event) => {
    event.preventDefault();

    const playlist = createPlaylist(name, description);

    if (!playlist) {
      return;
    }

    setName('');
    setDescription('');
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Seo
        title="Your Playlists | Univerzo Music"
        description="Create and manage local playlists inside Univerzo Music."
        path="/playlists"
        noindex
      />

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(30,215,96,0.18),_transparent_36%),linear-gradient(135deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.03))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand">Your Library</p>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">Build playlists that survive the session.</h1>
            <p className="text-sm leading-7 text-text-muted md:text-base">
              Create local playlists, save live tracks into them, and jump back into your own queue whenever you want.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/6 px-5 py-4 text-sm text-text-muted">
            <span className="block text-2xl font-black text-white">{playlists.length}</span>
            saved playlists
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <form onSubmit={handleCreatePlaylist} className="space-y-4 rounded-2xl border border-white/8 bg-white/4 p-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Create Playlist</p>
            <h2 className="text-2xl font-bold text-white">Start a new collection</h2>
            <p className="text-sm leading-6 text-text-muted">
              Saved tracks from cards will land in your latest active playlist.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white" htmlFor="playlist-name">Name</label>
            <input
              id="playlist-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Late Night Drive"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-text-subdued focus:border-brand/40 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white" htmlFor="playlist-description">Description</label>
            <textarea
              id="playlist-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Melodic tracks for night edits and long drives."
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-text-subdued focus:border-brand/40 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] hover:bg-brand-hover"
          >
            <Plus className="h-4 w-4" />
            Create playlist
          </button>
        </form>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
              <LibraryBig className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Saved Playlists</h2>
              <p className="text-sm text-text-subdued">Your personal library lives here.</p>
            </div>
          </div>

          {sortedPlaylists.length === 0 ? (
            <CatalogFeedback
              title="No playlists yet"
              message="Create your first playlist above, then save tracks from cards using the playlist action."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sortedPlaylists.map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  onClick={() => setActivePlaylistId(playlist.id)}
                  className="group rounded-2xl border border-white/8 bg-white/4 p-5 transition-colors hover:bg-white/7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-brand">
                        {playlist.title}
                      </h3>
                      <p className="text-sm leading-6 text-text-muted">
                        {playlist.description}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-text-subdued">
                      {playlist.tracks.length} tracks
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default PlaylistsPage;

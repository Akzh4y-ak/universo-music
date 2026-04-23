import { Clock3, ShieldCheck, SlidersHorizontal, Volume2, Check } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useMusic } from '../context/music';
import { usePlayer, usePlayerProgress } from '../context/player';
import { LANGUAGES, GENRES } from '../data/preferences';

const timerOptions = [15, 30, 45, 60];

function formatTimerRemaining(remainingMs) {
  if (!remainingMs || remainingMs <= 0) {
    return 'Off';
  }

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const SettingsPage = () => {
  const {
    likedSongs,
    playlists,
    preferences,
    recentPlays,
    clearRecentPlays,
    setAllowExplicit,
    updatePreferences,
  } = useMusic();
  const {
    autoAdvance,
    currentTrack,
    providerStatus,
    setAutoAdvance,
    volume,
    setVolume,
  } = usePlayer();
  const { clearSleepTimer, setSleepTimer, sleepTimerRemainingMs } = usePlayerProgress();

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Helmet>
        <title>Settings - Univerzo Music</title>
      </Helmet>

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(30,215,96,0.18),_transparent_36%),linear-gradient(135deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.03))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand">Settings</p>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">Control how the app plays, filters, and remembers.</h1>
            <p className="text-sm leading-7 text-text-muted md:text-base">
              These controls make the app feel more like a real listening product: queue behavior,
              explicit-content filtering, volume memory, and a sleep timer for longer sessions.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/6 px-5 py-4 text-sm text-text-muted">
            <span className="block text-2xl font-black text-white">{providerStatus.label}</span>
            active playback provider
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Playback</h2>
                <p className="text-sm text-text-subdued">Shape what happens after each track and during long sessions.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-3 rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Remember volume</p>
                    <p className="text-xs leading-5 text-text-subdued">Your player volume is already saved locally between sessions.</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Volume2 className="h-4 w-4 text-text-muted" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(event) => setVolume(parseFloat(event.target.value))}
                    className="w-full accent-brand"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Auto-advance queue</p>
                  <p className="text-xs leading-5 text-text-subdued">When enabled, the next queued track starts automatically after the current song ends.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoAdvance(!autoAdvance)}
                  className={`inline-flex h-8 w-14 items-center rounded-full p-1 transition-colors ${
                    autoAdvance ? 'bg-brand' : 'bg-white/10'
                  }`}
                  aria-pressed={autoAdvance}
                >
                  <span
                    className={`h-6 w-6 rounded-full bg-white transition-transform ${
                      autoAdvance ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Sleep timer</p>
                    <p className="text-xs leading-5 text-text-subdued">Pause playback automatically after a set time.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.24em] text-text-subdued">Remaining</p>
                    <p className="text-lg font-semibold text-white">{formatTimerRemaining(sleepTimerRemainingMs)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {timerOptions.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => setSleepTimer(minutes)}
                      className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-white/12"
                    >
                      {minutes} min
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearSleepTimer}
                    className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-text-subdued transition-colors hover:text-white"
                  >
                    Turn off
                  </button>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-text-muted">
                  {currentTrack
                    ? `Timer will pause playback while listening to ${currentTrack.title}.`
                    : 'Start any track and the timer will pause the active playback session.'}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Discovery & Library</h2>
                <p className="text-sm text-text-subdued">Tune what content the app shows across search, home, and library pages.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Allow explicit content</p>
                  <p className="text-xs leading-5 text-text-subdued">When off, explicit tracks are filtered out across discovery and saved library views.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowExplicit(!preferences.allowExplicit)}
                  className={`inline-flex h-8 w-14 items-center rounded-full p-1 transition-colors ${
                    preferences.allowExplicit ? 'bg-brand' : 'bg-white/10'
                  }`}
                  aria-pressed={preferences.allowExplicit}
                >
                  <span
                    className={`h-6 w-6 rounded-full bg-white transition-transform ${
                      preferences.allowExplicit ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-white">Preferred Languages</p>
                  <p className="text-xs leading-5 text-text-subdued">Choose which languages you'd like to see on your home feed.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => {
                    const isSelected = preferences.preferredLanguages.includes(lang.id);
                    return (
                      <button
                        key={lang.id}
                        onClick={() => {
                          const next = isSelected 
                            ? preferences.preferredLanguages.filter(id => id !== lang.id)
                            : [...preferences.preferredLanguages, lang.id];
                          updatePreferences({ preferredLanguages: next });
                        }}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                          isSelected 
                            ? 'bg-brand/20 border-brand text-white' 
                            : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {isSelected && <Check className="h-3 w-3 text-brand" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-white">Preferred Genres</p>
                  <p className="text-xs leading-5 text-text-subdued">Influence your recommendations by selecting vibes you enjoy.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(genre => {
                    const isSelected = preferences.preferredGenres.includes(genre.id);
                    return (
                      <button
                        key={genre.id}
                        onClick={() => {
                          const next = isSelected 
                            ? preferences.preferredGenres.filter(id => id !== genre.id)
                            : [...preferences.preferredGenres, genre.id];
                          updatePreferences({ preferredGenres: next });
                        }}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                          isSelected 
                            ? 'bg-white text-black' 
                            : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
                        }`}
                      >
                        <span>{genre.label}</span>
                        {isSelected && <Check className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">History tools</p>
                    <p className="text-xs leading-5 text-text-subdued">Clean up local listening history when you want a fresh start.</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearRecentPlays}
                    disabled={recentPlays.length === 0}
                    className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Clear recent
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-text-subdued">Liked Songs</p>
                    <p className="mt-2 text-3xl font-black text-white">{likedSongs.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-text-subdued">Recent Plays</p>
                    <p className="mt-2 text-3xl font-black text-white">{recentPlays.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-text-subdued">Playlists</p>
                    <p className="mt-2 text-3xl font-black text-white">{playlists.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-white">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Session Snapshot</h2>
                <p className="text-sm text-text-subdued">A quick read on what the current listening session is using.</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-text-muted">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text-subdued">Provider Summary</p>
                <p className="mt-2 font-semibold text-white">{providerStatus.label}</p>
                <p className="mt-2 leading-6">{providerStatus.message}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text-subdued">Keyboard Shortcuts</p>
                <p className="mt-2 leading-6">Space toggles play/pause, left and right arrows skip tracks, and <span className="font-semibold text-white">Q</span> opens the queue.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default SettingsPage;

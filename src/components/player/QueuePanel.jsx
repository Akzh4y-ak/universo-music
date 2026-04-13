import { ArrowDown, ArrowUp, ListMusic, Play, Trash2, X } from 'lucide-react';
import { usePlayer } from '../../context/player';

const QueuePanel = () => {
  const {
    currentTrack,
    isQueueOpen,
    closeQueue,
    queue,
    queueIndex,
    playQueueIndex,
    moveQueueItem,
    removeQueueItem,
    clearQueue,
  } = usePlayer();

  if (!isQueueOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
      onClick={closeQueue}
    >
      <aside
        className="absolute bottom-24 right-4 top-20 flex w-[calc(100%-2rem)] max-w-md flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,24,24,0.98),rgba(10,10,10,0.98))] shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/6 text-brand">
              <ListMusic className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-subdued">Queue</p>
              <h2 className="text-lg font-semibold text-white">Up Next</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {queue.length > 1 ? (
              <button
                type="button"
                onClick={clearQueue}
                className="rounded-full border border-white/10 bg-white/4 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-text-subdued transition-colors hover:text-white"
              >
                Clear queue
              </button>
            ) : null}
            <button
              type="button"
              onClick={closeQueue}
              className="rounded-full border border-white/10 bg-white/4 p-2 text-text-muted transition-colors hover:text-white"
              aria-label="Close queue"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {queue.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-white/4 p-5 text-sm leading-6 text-text-muted">
              Start a song and the queue will show up here.
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((track, index) => {
                const isActive = currentTrack?.id === track.id && queueIndex === index;

                return (
                  <div
                    key={`${track.id}-${index}`}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                      isActive
                        ? 'border-brand/30 bg-brand/10'
                        : 'border-white/8 bg-white/4 hover:bg-white/7'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => playQueueIndex(index)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${isActive ? 'text-brand' : 'text-white'} text-truncate-1`}>
                          {track.title}
                        </p>
                        <p className="text-xs text-text-muted text-truncate-1">
                          {track.artist}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-1">
                      <div className="hidden flex-col gap-1 sm:flex">
                        <button
                          type="button"
                          onClick={() => moveQueueItem(index, index - 1)}
                          disabled={index === 0}
                          className="rounded-full border border-white/10 bg-white/4 p-1.5 text-text-muted transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Move track up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQueueItem(index, index + 1)}
                          disabled={index === queue.length - 1}
                          className="rounded-full border border-white/10 bg-white/4 p-1.5 text-text-muted transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Move track down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] uppercase tracking-[0.24em] text-text-subdued">
                          {track.providerLabel}
                        </span>
                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <span className="rounded-full bg-brand px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-black">
                              Now
                            </span>
                          ) : (
                            <Play className="h-4 w-4 text-text-muted" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeQueueItem(index)}
                            className="rounded-full border border-white/10 bg-white/4 p-1.5 text-text-muted transition-colors hover:text-white"
                            aria-label="Remove track from queue"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default QueuePanel;

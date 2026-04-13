import { Radio, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/player';

const ProviderNotice = ({ className = '' }) => {
  const { providerStatus } = usePlayer();

  return (
    <section
      className={`rounded-2xl border border-white/8 bg-white/4 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl ${className}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            <Radio className="h-4 w-4" />
            <span>{providerStatus.label}</span>
          </div>
          <h3 className="text-xl font-bold text-white md:text-2xl">
            {providerStatus.supportsFullPlayback
              ? 'Real music is active with direct playback'
              : 'Connect a live music provider to unlock streaming'}
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-text-muted">{providerStatus.message}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/6 px-4 py-2 text-sm text-white">
            <Sparkles className="h-4 w-4 text-brand" />
            <span>
              {providerStatus.isUsingPublicCatalog
                ? 'Open catalog live'
                : providerStatus.supportsFullPlayback
                  ? 'Live catalog ready'
                  : 'Provider needed'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderNotice;

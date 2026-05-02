import { Music } from 'lucide-react';

/**
 * Minimalist, clean loading screen
 * Great for a modern, simple aesthetic
 */
const MinimalistLoader = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black">
      {/* Animated waveform */}
      <div className="flex items-center justify-center gap-1 mb-6">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 bg-brand rounded-full"
            style={{
              animation: `waveform 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.05}s`,
              height: '24px',
            }}
          />
        ))}
      </div>

      {/* Text with dot animation */}
      <div className="text-center">
        <p className="text-brand text-lg font-semibold tracking-wide">
          Loading Univerzo
          <span className="inline-block ml-1">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>
              .
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>
              .
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
              .
            </span>
          </span>
        </p>
        <p className="text-slate-500 text-sm mt-3">Getting your music ready</p>
      </div>

      <style>{`
        @keyframes waveform {
          0%, 100% {
            height: 8px;
            opacity: 0.3;
          }
          50% {
            height: 32px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default MinimalistLoader;

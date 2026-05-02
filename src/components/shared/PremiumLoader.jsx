import { Music } from 'lucide-react';

/**
 * Premium animated loader with particle effects
 * Most visually impressive option
 */
const PremiumLoader = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-slate-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle 3s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-purple-500/5 animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated musical notes in circle */}
        <div className="relative w-32 h-32">
          {/* Rotating circle of notes */}
          {[...Array(6)].map((_, i) => (
            <Music
              key={i}
              className="absolute w-6 h-6 text-brand"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${(i * 60)}deg) translateY(-50px)`,
                animation: `orbit 4s linear infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}

          {/* Center circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center shadow-lg shadow-brand/50">
              <Music className="w-6 h-6 text-black animate-pulse" />
            </div>
          </div>

          {/* Pulsing rings */}
          <div
            className="absolute inset-0 rounded-full border border-brand/30"
            style={{ animation: 'pulse 2s ease-in-out infinite' }}
          />
          <div
            className="absolute inset-4 rounded-full border border-purple-500/20"
            style={{ animation: 'pulse 2s ease-in-out infinite 0.3s' }}
          />
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-brand via-purple-500 to-brand bg-clip-text text-transparent">
              Univerzo
            </span>
          </h2>
          <p className="text-slate-400 text-sm">Preparing your music experience</p>
        </div>

        {/* Animated progress indicators */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-brand"
              style={{
                animation: `bounce 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateY(-50px);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateY(-50px);
          }
        }

        @keyframes particle {
          0% {
            opacity: 0;
            transform: translate(0, 20px);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(0, -20px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumLoader;

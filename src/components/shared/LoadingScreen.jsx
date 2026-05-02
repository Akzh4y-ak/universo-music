import { Music, Disc3 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/10 via-purple-500/10 to-brand/10 animate-pulse" />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-brand/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Main animated disc */}
        <div className="relative w-24 h-24">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand border-r-brand animate-spin" />
          
          {/* Middle rotating ring (opposite direction) */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-500 border-l-purple-500" style={{ animation: 'spin 3s linear reverse infinite' }} />

          {/* Center disc */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center shadow-2xl shadow-brand/50">
            <Disc3 className="w-8 h-8 text-black animate-pulse" />
          </div>

          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border border-brand/50 animate-pulse" />
        </div>

        {/* Animated equalizer bars */}
        <div className="flex items-center gap-1 h-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-brand to-purple-500 rounded-full"
              style={{
                height: '30px',
                animation: `equalizer 0.6s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <h2 className="text-2xl font-bold text-white text-center">
            Loading <span className="text-brand">Univerzo</span>
          </h2>
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <Music className="w-4 h-4 text-brand" />
            <span>Tuning the music...</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-slate-700 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-brand via-purple-500 to-brand rounded-full"
            style={{
              animation: 'progressBar 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Animated music notes */}
        <div className="flex gap-4 mt-6">
          {[0, 1, 2].map((i) => (
            <Music
              key={i}
              className="w-5 h-5 text-brand/60"
              style={{
                animation: `float 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes equalizer {
          0%, 100% {
            height: 8px;
            opacity: 0.4;
          }
          50% {
            height: 32px;
            opacity: 1;
          }
        }

        @keyframes progressBar {
          0% {
            width: 0%;
            opacity: 0.5;
          }
          50% {
            width: 100%;
            opacity: 1;
          }
          100% {
            width: 0%;
            opacity: 0.5;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-12px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;

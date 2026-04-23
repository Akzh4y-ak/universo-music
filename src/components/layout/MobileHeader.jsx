import { Maximize2, Minimize2, Music2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MobileHeader = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="md:hidden sticky top-0 z-40 bg-bg-base/80 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 decoration-transparent">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand">
            <Music2 className="h-4 w-4 text-black" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Univerzo
          </span>
        </Link>

        <button 
          onClick={toggleFullscreen}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-text-muted transition-colors hover:bg-white/10"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;

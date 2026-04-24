import { useEffect, useRef } from 'react';
import { usePlayer } from '../../context/player';

const AudioVisualizer = ({ className = '' }) => {
  const { audioRef, isPlaying } = usePlayer();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const contextRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    // Initialize Web Audio API
    if (!contextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      contextRef.current = new AudioContext();
      analyserRef.current = contextRef.current.createAnalyser();
      
      // Essential: crossOrigin must be set for the audio element if it's from a different domain
      // Most music URLs will need this
      audioRef.current.crossOrigin = "anonymous";
      
      sourceRef.current = contextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(contextRef.current.destination);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height;

        // Use the theme color from CSS variable
        const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--player-theme-color') || '#1ed760';
        
        ctx.fillStyle = themeColor;
        // Add some transparency based on height
        ctx.globalAlpha = 0.4 + (barHeight / height) * 0.6;
        
        // Draw rounded bars
        const radius = 4;
        const y = height - barHeight;
        
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth - 2, barHeight, radius);
        } else {
          ctx.rect(x, y, barWidth - 2, barHeight);
        }
        ctx.fill();

        x += barWidth;
      }
    };

    if (isPlaying) {
      if (contextRef.current.state === 'suspended') {
        contextRef.current.resume();
      }
      draw();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clear canvas when not playing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioRef, isPlaying]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        canvasRef.current.width = parent.clientWidth;
        canvasRef.current.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default AudioVisualizer;

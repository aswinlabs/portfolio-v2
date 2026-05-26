'use client';

import { MusicPlayerProps } from '@/types';
import { useEffect, useRef, useState } from 'react';


const MusicPlayer = ({ stopPlaying = false, command = null }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const visualizerRef = useRef<HTMLDivElement | null>(null);

  const track = {
    title: "What a Wonderful World",
    artist: "Louis Armstrong",
    duration: "2:21",
    src: "/music/What A Wonderful World.m4a", 
  };

  // Add this useEffect to handle the stopPlaying prop
  useEffect(() => {
    if (stopPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [stopPlaying]);

  useEffect(() => {
    if (!command) return;

    if (command.action === "play") {
      setIsPlaying(true);
      return;
    }

    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [command]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  
    const handleEnded = () => {
      setIsPlaying(false);
    };
  
    audio.addEventListener('ended', handleEnded);
  
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying]);
  
  
  useEffect(() => {
    let animationFrame: number;

    const updateVisualizer = () => {
      if (visualizerRef.current) {
        const bars = visualizerRef.current.children;
        const now = Date.now();

        Array.from(bars).forEach((bar, i) => {
          const rawHeight = isPlaying
            ? 10 + Math.abs(
                Math.sin((i * 3 + now / 150) * 1.5) * 40 +
                Math.sin((i * 0.5 + now / 300) * 2) * 30 +
                Math.random() * 10
              )
            : 10;

          const stepHeight = Math.round(rawHeight / 10) * 10;
          (bar as HTMLDivElement).style.height = `${stepHeight}%`;
          (bar as HTMLDivElement).style.opacity = isPlaying ? `${0.5 + stepHeight / 100}` : '0.5';
        });
      }
      animationFrame = requestAnimationFrame(updateVisualizer);
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(updateVisualizer);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  return (
    <div className="text-[var(--foreground)] border border-[var(--foreground)] p-3 rounded-sm shadow-lg mt-4 hidden md:block">
      <div className="mb-1 flex justify-between items-center">
        <div className="truncate max-w-[180px]">
          <div className="text-md font-bold uppercase">{track.title}</div>
          <div className="text-xs opacity-70">{track.artist}</div>
        </div>
        <div className="flex items-center">
          <span
            className={`inline-block w-2 h-2 rounded-sm mr-2 ${
              isPlaying ? 'bg-[var(--foreground)] animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span className="text-xs">{track.duration}</span>
        </div>
      </div>

      <div
  ref={visualizerRef}
  className="flex items-end justify-center gap-[2px] h-18 mb-2 px-1" 
>
  {[...Array(32)].map((_, i) => (
    <div
      key={i}
      className="w-[3px] bg-[var(--foreground)]"
      style={{ height: '10%', opacity: 0.5 }}
    />
  ))}
</div>

      <div className="flex justify-center gap-2">
        {[
          {
            icon: '◄◄',
            action: () => {
              audioRef.current!.currentTime = 0;
              setIsPlaying(true);
            },
          },
          {
            icon: isPlaying ? '❚❚' : '►',
            action: () => setIsPlaying(!isPlaying),
          },
          {
            icon: '■',
            action: () => {
              setIsPlaying(false);
              audioRef.current!.currentTime = 0;
            },
          },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className={`retro-button text-sm font-bold w-10 h-10 border border-[var(--foreground)] ${
              i === 1 && isPlaying
                ? 'bg-[var(--foreground)] text-[var(--background)] border-black'
                : 'text-[var(--foreground)]'
            } hover:bg-[var(--foreground)] hover:text-[var(--background)] active:translate-y-[1px]`}
          >
            {btn.icon}
          </button>
        ))}
      </div>
      <audio ref={audioRef} src={track.src} preload="auto" />
    </div>
  );
};

export default MusicPlayer;

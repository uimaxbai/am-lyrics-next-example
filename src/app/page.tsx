'use client';

import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';

const AmLyrics = dynamic(
  () => {
    // Dynamically import the custom element
    import('@uimaxbai/am-lyrics/am-lyrics.js');
    // Then import the React component
    return import('@uimaxbai/am-lyrics/react').then((mod) => mod.AmLyrics);
  },
  { ssr: false }
);

const MemoizedAmLyrics = memo(AmLyrics);

export default function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync audio player time with the component
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let animationFrameId: number;

    const updateCurrentTime = () => {
      console.log("update")
      setCurrentTime(audio.currentTime * 1000);
      animationFrameId = requestAnimationFrame(updateCurrentTime);
    };

    const handlePlay = () => {
      animationFrameId = requestAnimationFrame(updateCurrentTime);
    };

    const handlePause = () => {
      cancelAnimationFrame(animationFrameId);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('seeking', () => {
      setCurrentTime(audio.currentTime * 1000);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('seeking', () => {
        setCurrentTime(audio.currentTime * 1000);
      });
    };
  }, []);

  // Handle line clicks to seek the audio
  const handleLineClick = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<{ timestamp: number }>;
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = customEvent.detail.timestamp / 1000; // Convert to seconds
      audio.play();
    }
  }, []);

  return (
    <div>
      <audio ref={audioRef} src="/uptown_funk.flac" controls />
        <MemoizedAmLyrics
          query="Uptown Funk"
          currentTime={currentTime}
          onLineClick={handleLineClick}
          autoScroll
          highlightColor='#fff'
        />
    </div>
  );
}
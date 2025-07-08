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

    let intervalId: any = null;

    const updateCurrentTime = () => {
      setCurrentTime(audio.currentTime * 1000);
    };

    const handlePlay = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(updateCurrentTime, 10);
    };

    const handlePauseOrEnd = () => {
      clearInterval(intervalId);
      intervalId = null;
    };

    const handleSeeking = () => {
      setCurrentTime(audio.currentTime * 1000);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePauseOrEnd);
    audio.addEventListener('ended', handlePauseOrEnd);
    audio.addEventListener('seeking', handleSeeking);

    return () => {
      clearInterval(intervalId);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePauseOrEnd);
      audio.removeEventListener('ended', handlePauseOrEnd);
      audio.removeEventListener('seeking', handleSeeking);
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
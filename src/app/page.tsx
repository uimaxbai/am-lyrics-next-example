import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AmLyrics } from 'am-lyrics/react';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // Sync audio player time with the component
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime * 1000); // Convert to milliseconds
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // Handle line clicks to seek the audio
  const handleLineClick = useCallback(event => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = event.detail.timestamp / 1000; // Convert to seconds
      audio.play();
    }
  }, []);

  return (
    <div>
      <audio ref={audioRef} src="path/to/your/song.mp3" controls />
      <AmLyrics
        query="Uptown Funk"
        currentTime={currentTime}
        onLineClick={handleLineClick}
        autoscroll
      />
    </div>
  );
}
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";

interface AudioWaveformProps {
  audioUrl: string;
  onPlayPause?: (isPlaying: boolean) => void;
}

const AudioWaveform = ({ audioUrl, onPlayPause }: AudioWaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    let isMounted = true;

    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#555555",
      progressColor: "#000000",
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      height: 32,
      normalize: true,
      url: audioUrl,
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on("ready", () => {
      if (isMounted) {
        setDuration(wavesurfer.getDuration());
        setIsReady(true);
      }
    });

    wavesurfer.on("audioprocess", () => {
      if (isMounted) {
        setCurrentTime(wavesurfer.getCurrentTime());
      }
    });

    wavesurfer.on("play", () => {
      if (isMounted) {
        setIsPlaying(true);
        onPlayPause?.(true);
      }
    });

    wavesurfer.on("pause", () => {
      if (isMounted) {
        setIsPlaying(false);
        onPlayPause?.(false);
      }
    });

    wavesurfer.on("finish", () => {
      if (isMounted) {
        setIsPlaying(false);
        onPlayPause?.(false);
      }
    });

    wavesurfer.on("error", () => {
      // Ignore errors (including abort errors)
    });

    return () => {
      isMounted = false;
      wavesurferRef.current = null;
      setIsReady(false);
      // Use setTimeout to defer destroy to avoid sync abort errors
      setTimeout(() => {
        try {
          wavesurfer.destroy();
        } catch {
          // Ignore errors during cleanup
        }
      }, 0);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 flex-1">
      <div ref={containerRef} className="flex-1 min-w-[120px]" />
      <span className="text-sm text-gray-600 min-w-[40px]">
        {formatTime(isPlaying ? currentTime : duration)}
      </span>
      <button
        onClick={togglePlayPause}
        className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        {isPlaying ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default AudioWaveform;

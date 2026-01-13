"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPause, FaPlay } from "react-icons/fa";

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer = ({ audioUrl }: AudioPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    let isMounted = true;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#888888",
      progressColor: "#333333",
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      height: 28,
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
      }
    });

    wavesurfer.on("pause", () => {
      if (isMounted) {
        setIsPlaying(false);
      }
    });

    wavesurfer.on("finish", () => {
      if (isMounted) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    });

    wavesurfer.on("error", () => {
      // Ignore errors
    });

    return () => {
      isMounted = false;
      wavesurferRef.current = null;
      setIsReady(false);
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
    <div className="flex items-center gap-3 p-2 rounded-lg bg-[#f5f5f5] min-w-[200px]">
      <button
        onClick={togglePlayPause}
        className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer bg-white hover:bg-gray-100 transition-colors shrink-0"
        style={{
          boxShadow: "0px 0px 4px 0px #00000020",
        }}
      >
        {isPlaying ? (
          <FaPause className="text-xs text-gray-700" />
        ) : (
          <FaPlay className="text-xs text-gray-700 ml-0.5" />
        )}
      </button>
      <div ref={containerRef} className="flex-1 min-w-[100px]" />
      <span className="text-xs text-gray-600 min-w-[35px] shrink-0">
        {isPlaying ? formatTime(currentTime) : formatTime(duration)}
      </span>
    </div>
  );
};

export default AudioPlayer;

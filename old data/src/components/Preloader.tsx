"use client";

import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
  brandName?: string;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  brandName = "ACHYUTAM BUILDER",
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Progress interval as fallback and smooth UX loading bar
    const startTime = Date.now();
    const duration = 4000; // 4 seconds ideal display

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleFinish();
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07070a] text-white transition-opacity duration-700 select-none ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Video Container (Cinematic Desktop Display) */}
      <div className="relative w-full h-full max-w-7xl max-h-[85vh] mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Video Wrapper with refined golden border */}
        <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black/90 border border-primary/30 shadow-[0_0_80px_rgba(255,119,34,0.25)] flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            onLoadedData={() => {
              setVideoLoaded(true);
              if (videoRef.current) {
                videoRef.current.playbackRate = 1.3;
              }
            }}
            onPlay={() => {
              if (videoRef.current) {
                videoRef.current.playbackRate = 1.3;
              }
            }}
            onEnded={handleFinish}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              videoLoaded ? "opacity-100" : "opacity-30"
            }`}
          >
            <source src="/preloader-video.webm" type="video/webm" />
            <source src="/preloader-video.mp4" type="video/mp4" />
            <source
              src="photos and videos/upscaled-video preloader.webm"
              type="video/webm"
            />
            <source
              src="photos and videos/upscaled-video preloader.mp4"
              type="video/mp4"
            />
            <track kind="captions" src="" label="English" />
          </video>

          {/* Fallback & Watermark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

          {/* Top Brand Tag inside player */}
          <div className="absolute top-4 left-5 flex items-center gap-2.5 pointer-events-none">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-serif font-bold text-base backdrop-blur-md">
              अ
            </div>
            <div>
              <span className="font-serif tracking-widest text-sm font-bold text-white uppercase block">
                {brandName}
              </span>
              <span className="font-mono text-[9px] tracking-widest text-primary uppercase block">
                Architectural Masterworks
              </span>
            </div>
          </div>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleMute}
            className="absolute top-4 right-5 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white hover:text-primary transition-all backdrop-blur-md cursor-pointer z-10"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-primary" />
            )}
          </button>

          {/* Bottom Progress Bar inside Video */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-primary via-amber-400 to-amber-200 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Controls & Skip Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl px-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <p className="font-mono text-xs text-on-surface-variant tracking-wider uppercase">
              Loading Architectural Portfolio ({progress}%)
            </p>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary text-background font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(255,119,34,0.35)] cursor-pointer hover:scale-105"
          >
            <span>Enter Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

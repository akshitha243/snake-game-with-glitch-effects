import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  { 
    id: 1, 
    title: "Neon Pulse", 
    artist: "SynthAI", 
    // Using reliable public domain / freeware tracks for demo
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    color: "cyan"
  },
  { 
    id: 2, 
    title: "Cyber City Grid", 
    artist: "RetroCompute", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    color: "purple"
  },
  { 
    id: 3, 
    title: "Digital Horizon", 
    artist: "NeonByte", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3",
    color: "fuchsia"
  },
];

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      // Need a small timeout to play after src change in some browsers
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const currentProgressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-black border-4 border-fuchsia-500 p-6 flex flex-col md:flex-row shadow-[8px_8px_0px_theme(colors.cyan.500)] relative">
      <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500 grid place-items-center"><Cpu size={16} className="text-black" /></div>
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
        preload="metadata"
      />

      {/* Album Art / Disk Placeholder */}
      <div className="flex-shrink-0 flex justify-center items-center mb-6 md:mb-0 md:mr-8 relative">
        <motion.div 
          className={`w-28 h-28 border-4 border-${currentTrack.color}-500 bg-black flex items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-50" />
          <motion.div 
             animate={{ x: isPlaying ? [0, -5, 5, -5, 0] : 0, y: isPlaying ? [0, 5, -5, 5, 0] : 0 }}
             transition={{ duration: 0.2, repeat: Infinity, repeatType: 'mirror' }}
             className={`w-12 h-12 bg-${currentTrack.color}-500 mix-blend-screen flex items-center justify-center`}
          >
            <Terminal size={24} className="text-black" />
          </motion.div>
        </motion.div>
        
        {/* Equalizer Bars when playing */}
        <div className="absolute -bottom-4 flex gap-[4px] h-6 bg-black px-2 py-1 border-t-2 border-cyan-500">
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i}
              className={`w-2 bg-${currentTrack.color}-500`}
              animate={{ 
                height: isPlaying ? [4, Math.random() * 20 + 4, 4] : 4
              }}
              transition={{
                repeat: Infinity,
                duration: 0.2,
                delay: i * 0.05,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="flex-grow flex flex-col justify-center">
        
        {/* Title & Artist */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h3 className="font-sans text-white text-xl uppercase tracking-widest flex items-center gap-2">
              <span className={`text-${currentTrack.color}-500`}>&gt;_</span>
              {currentTrack.title}
            </h3>
            <p className="font-sans text-gray-500 text-xs uppercase tracking-[0.3em]">SRC: // {currentTrack.artist}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div 
            ref={progressBarRef}
            className="h-3 w-full bg-black border-2 border-gray-800 cursor-pointer relative group overflow-hidden"
            onClick={handleProgressClick}
          >
            <div 
              className={`absolute top-0 left-0 h-full bg-${currentTrack.color}-500 transition-none`}
              style={{ width: `${currentProgressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 font-sans text-xs text-fuchsia-500 uppercase">
            <span>T-{formatTime(progress)}</span>
            <span>END-{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons & Volume */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={handlePrev} className="text-cyan-500 hover:text-white transition-colors hover:scale-110">
               <SkipBack className="w-6 h-6 object-square" />
            </button>
            <button 
              onClick={togglePlay} 
              className={`w-12 h-12 flex items-center justify-center bg-black border-2 border-${currentTrack.color}-500 text-${currentTrack.color}-500 hover:bg-${currentTrack.color}-500 hover:text-black transition-none`}
            >
               {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button onClick={handleNext} className="text-cyan-500 hover:text-white transition-colors hover:scale-110">
               <SkipForward className="w-6 h-6 object-square" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 bg-black border border-gray-800 p-2">
             <button onClick={toggleMute} className="text-gray-500 hover:text-cyan-400 transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 object-square" /> : <Volume2 className="w-4 h-4 object-square" />}
             </button>
             <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className={`w-24 h-2 bg-gray-900 border border-gray-800 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-${currentTrack.color}-500`}
             />
          </div>
        </div>

      </div>
    </div>
  );
}

'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImageUrl: string;
  duration_ms: number;
  progress_ms: number;
  songUrl: string;
}

const POLLING_INTERVAL = 1000;

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const containerVariants = {
  exit: {
    width: "192px",
    opacity: 0,
    transition: { 
      width: { duration: 0.3, delay: 0.3 },
      opacity: { duration: 0.2, delay: 0.5 }
    }
  },
  enter: {
    width: "100%",
    opacity: 1,
    transition: { 
      width: { duration: 0.3 },
      opacity: { duration: 0.3 }
    }
  }
};

const textContainerVariants = {
  exit: {
    x: -20,
    opacity: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "beforeChildren"
    }
  },
  enter: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
      delayChildren: 0.3,
      when: "beforeChildren"
    }
  }
};

const fadeVariants = {
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
  enter: { 
    opacity: 1,
    transition: { duration: 0.3, delay: 0.6 }
  }
};

const slideVariants = {
  exit: { 
    x: -20,
    opacity: 0,
    transition: { duration: 0.2 }
  },
  enter: { 
    x: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export default function NowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing');
        const newData = await response.json();
        
        setData(newData?.isPlaying ? newData : null);
        setError(null);
      } catch (error) {
        console.error('Error fetching Spotify data:', error);
        setError('Failed to fetch Spotify data');
      } finally {
        setIsLoading(false);
      }
    };

    getNowPlaying();
    const interval = setInterval(getNowPlaying, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="text-red-500/80 text-sm font-sans" role="alert">
        {error}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="cyber-container w-full h-40"
          role="status"
          aria-label="Loading Spotify data"
        >
          <div className="flex items-center gap-4 p-4">
            <div className="h-32 w-32 bg-white/10 rounded-lg" />
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-white/10 rounded w-24" />
              <div className="h-6 bg-white/10 rounded w-3/4" />
              <div className="h-5 bg-white/10 rounded w-1/2" />
              <div className="h-2 bg-white/10 rounded w-full mt-4" />
            </div>
          </div>
        </motion.div>
      ) : data?.isPlaying ? (
        <motion.div
          key={data.title + data.artist}
          variants={containerVariants}
          initial="exit"
          animate="enter"
          exit="exit"
          className="cyber-container w-full h-40"
          role="region"
          aria-label="Currently playing on Spotify"
        >
          <div className="flex items-center gap-4 p-4">
            <motion.a
              href={data.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 relative h-32 w-32 group cursor-pointer focus:outline-none"
              tabIndex={0}
            >
              <motion.div
                key={data.albumImageUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={data.albumImageUrl}
                  alt={`${data.title} album art`}
                  fill
                  className="object-cover rounded-lg transition-transform group-hover:scale-105"
                  priority
                />
              </motion.div>
            </motion.a>

            <motion.div 
              variants={textContainerVariants}
              className="flex flex-col gap-1 min-w-0 flex-1"
            >
              <motion.span 
                variants={fadeVariants}
                className="text-white/60 text-sm font-sans uppercase tracking-wider font-light"
                aria-label="Status"
              >
                Now Playing
              </motion.span>
              
              <motion.a 
                variants={slideVariants}
                href={data.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-xl font-sans truncate font-medium hover:underline focus:underline focus:outline-none"
                tabIndex={0}
              >
                {data.title}
              </motion.a>
              
              <motion.div 
                variants={slideVariants}
                className="text-white/80 text-lg font-sans truncate font-light"
              >
                {data.artist}
              </motion.div>
              
              <motion.div 
                variants={fadeVariants}
                className="mt-2 space-y-1"
                role="timer"
                aria-label={`Time elapsed: ${formatTime(data.progress_ms)} of ${formatTime(data.duration_ms)}`}
              >
                <div className="flex justify-between text-white/60 text-xs font-sans font-light">
                  <span>{formatTime(data.progress_ms)}</span>
                  <span>{formatTime(data.duration_ms)}</span>
                </div>
                <div className="progress-bar h-1.5 bg-[#44cfff]/10 rounded-full">
                  <motion.div
                    className="progress-fill h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(data.progress_ms / data.duration_ms) * 100}%`,
                      transition: { duration: 0.1, ease: "linear" }
                    }}
                  >
                    <div className="progress-pulse" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
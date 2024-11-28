import { motion } from 'framer-motion';
import Image from 'next/image';

interface QueueTrack {
  title: string;
  artist: string;
  albumImageUrl: string;
  duration_ms: number;
  songUrl: string;
}

const containerVariants = {
  hidden: {
    height: 0,
    marginTop: "-12px",
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.15,
      opacity: { duration: 0.3, ease: "easeInOut" },
      height: { duration: 0.3, ease: "easeOut" },
      scale: { duration: 0.3, ease: "easeIn" },
      y: { duration: 0.3, ease: "easeIn" }
    }
  },
  visible: {
    height: "auto",
    marginTop: "-12px",
    opacity: 1,
    y: 0,
    transition: {
      height: { duration: 0.3, ease: "easeInOut", delay: 0.5 },
      opacity: { duration: 0.3, ease: "easeIn", delay: 0.5 },
      scale: { duration: 0.3, ease: "easeOut", delay: 0.5 },
      y: { duration: 0.3, ease: "easeOut", delay: 0.5 }
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.1 }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, delay: 0.6 }
  }
};

export default function QueueList({ tracks }: { tracks: QueueTrack[] }) {
  if (!tracks.length) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="py-2 bg-black/20 rounded-b-lg border-x border-b border-[#44cfff]/20 cyber-container relative z-0 overflow-hidden mx-8"
    >
      <motion.div 
        variants={itemVariants}
        className="text-white/60 text-xs font-sans uppercase tracking-wider font-light px-3 pt-3"
      >
        Up Next
      </motion.div>
      {tracks.map((track) => (
        <motion.a
          key={track.title + track.artist}
          href={track.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          variants={itemVariants}
          className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors group"
        >
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src={track.albumImageUrl}
              alt={`${track.title} album art`}
              fill
              className="object-cover rounded transition-transform group-hover:scale-105"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white text-sm font-sans truncate mb-1 mr-2">{track.title}</div>
            <div className="text-white/60 text-xs font-sans truncate mt-1">{track.artist}</div>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}

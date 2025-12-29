
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundManagerProps {
  playMusic: boolean;
}

const SoundManager: React.FC<SoundManagerProps> = ({ playMusic }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (playMusic && !isMuted) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [playMusic, isMuted]);

  return (
    <div className="fixed top-6 right-6 z-50">
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
      <audio 
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" 
      />
    </div>
  );
};

export default SoundManager;

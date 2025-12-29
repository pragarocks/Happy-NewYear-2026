
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, ArrowRight, PartyPopper, Rocket, Stars, Share2, Copy, Check, Lightbulb, Music, ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import FireworkDisplay from './components/FireworkDisplay';
import SoundManager from './components/SoundManager';
import { FloatingBalloons, PartyBulbs } from './components/Decorations';
import { AppStep } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.CREATE);
  const [name, setName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [activeFortune, setActiveFortune] = useState<string | null>(null);

  const fortunes = [
    "In 2026, you will finally find that one sock you lost in 2023.",
    "Prediction: You'll start 3 new hobbies and finish... exactly zero of them. Standard.",
    "Good news! Scientists in 2026 confirm that pizza counts as a salad if it has oregano.",
    "Your 2026 will be so bright, you'll need two pairs of sunglasses.",
    "Expect a very important text from a cat. Or someone who acts like one.",
    "You will travel somewhere new. Like the kitchen, but for a fancy snack."
  ];

  // Split message into readable chunks (group 2-3 lines together)
  const messageChunks = useMemo(() => {
    if (!personalMessage) return [];
    const lines = personalMessage.split('\n').filter(l => l.trim() !== '');
    const result = [];
    for (let i = 0; i < lines.length; i += 2) {
      result.push(lines.slice(i, i + 2).join('\n'));
    }
    return result.length > 0 ? result : [personalMessage];
  }, [personalMessage]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get('n');
    const m = params.get('m');

    if (n && m) {
      setName(decodeURIComponent(n));
      setPersonalMessage(decodeURIComponent(m));
      setStep(AppStep.LIGHTS_OFF);
    }
  }, []);

  const handleGenerateLink = () => {
    if (!name.trim() || !personalMessage.trim()) return;
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('n', encodeURIComponent(name));
    url.searchParams.set('m', encodeURIComponent(personalMessage));
    setShareUrl(url.toString());
    setStep(AppStep.SHARE_LINK);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Define nextChunk and prevChunk to fix missing reference errors
  const nextChunk = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (chunkIndex < messageChunks.length - 1) {
      setChunkIndex(prev => prev + 1);
    }
  }, [chunkIndex, messageChunks.length]);

  const prevChunk = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (chunkIndex > 0) {
      setChunkIndex(prev => prev - 1);
    }
  }, [chunkIndex]);

  const resetApp = useCallback(() => {
    window.history.pushState({}, '', window.location.pathname);
    setName('');
    setPersonalMessage('');
    setChunkIndex(0);
    setActiveFortune(null);
    setStep(AppStep.CREATE);
  }, []);

  const handleManualFirework = (e: React.MouseEvent) => {
    if (step !== AppStep.CELEBRATION) return;
    const event = new CustomEvent('manual-firework', { 
      detail: { x: e.clientX, y: e.clientY } 
    });
    window.dispatchEvent(event);
  };

  const showRandomFortune = () => {
    const random = fortunes[Math.floor(Math.random() * fortunes.length)];
    setActiveFortune(random);
    setTimeout(() => setActiveFortune(null), 4000);
  };

  return (
    <div 
      onClick={handleManualFirework}
      className={`min-h-screen w-full relative overflow-y-auto flex flex-col items-center justify-start p-4 transition-colors duration-1000 ${step === AppStep.LIGHTS_OFF ? 'bg-black' : 'bg-slate-950'}`}
    >
      
      <PartyBulbs active={step !== AppStep.LIGHTS_OFF && step !== AppStep.CREATE && step !== AppStep.SHARE_LINK} />
      {step === AppStep.CELEBRATION && <FloatingBalloons />}
      {step === AppStep.CELEBRATION && <FireworkDisplay />}

      <SoundManager playMusic={step === AppStep.CELEBRATION || step === AppStep.COUNTDOWN} />

      {/* 1. CREATOR VIEW */}
      {step === AppStep.CREATE && (
        <div className="z-10 w-full max-w-xl text-center space-y-8 animate-in fade-in zoom-in duration-700 py-20">
          <div className="relative inline-block mb-4">
            <Sparkles className="absolute -top-10 -right-10 text-yellow-400 w-12 h-12 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bungee tracking-tighter text-white">
              WISH <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">2026</span>
            </h1>
            <p className="text-gray-400 font-medium mt-2">Personalize a magical experience to share</p>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Recipient's Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Long Secret Message</label>
              <textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Write your heart out! We'll show it in beautiful chunks..."
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateLink}
            disabled={!name.trim() || !personalMessage.trim()}
            className="w-full group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl disabled:opacity-30 shadow-xl shadow-purple-500/20"
          >
            Generate Link <Share2 className="ml-2 w-5 h-5" />
          </button>
        </div>
      )}

      {/* 2. SHARE LINK VIEW */}
      {step === AppStep.SHARE_LINK && (
        <div className="z-10 w-full max-w-lg text-center space-y-8 animate-in slide-in-from-bottom-8 py-20">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">Ready to Go! 🎁</h2>
            <p className="text-gray-400 mb-8">Copy this link and send it. They'll experience a sequence of surprises before your reveal!</p>
            
            <div className="flex items-center gap-2 bg-black/40 p-2 pl-4 rounded-xl border border-white/5 mb-6">
              <span className="text-xs text-gray-500 truncate flex-1">{shareUrl}</span>
              <button onClick={copyToClipboard} className="bg-white text-black p-3 rounded-lg hover:bg-yellow-400 transition-all shrink-0">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => setStep(AppStep.LIGHTS_OFF)} className="w-full py-4 bg-purple-600 rounded-xl font-bold hover:scale-[1.02] transition-transform">
                Preview Magic
              </button>
              <button onClick={() => setStep(AppStep.CREATE)} className="text-gray-500 text-sm hover:text-white">Back to Editor</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. RECIPIENT SEQUENCE */}
      <div className="z-10 flex flex-col items-center gap-12 text-center max-w-2xl px-6 py-20">
        {step === AppStep.LIGHTS_OFF && (
          <div className="space-y-8 animate-in fade-in duration-1000">
            <p className="text-gray-400 text-xl font-medium italic">Wait... why is it so dark?</p>
            <button 
              onClick={(e) => { e.stopPropagation(); setStep(AppStep.DECORATE); }}
              className="group flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all"
            >
              <Lightbulb className="group-hover:fill-yellow-400" /> Turn on Lights
            </button>
          </div>
        )}

        {step === AppStep.DECORATE && (
          <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Much Better! ✨</h2>
            <p className="text-gray-400 text-lg">But we need more 2026 spirit...</p>
            <button 
              onClick={(e) => { e.stopPropagation(); setStep(AppStep.COUNTDOWN); }}
              className="flex items-center gap-3 px-10 py-5 bg-purple-600 text-white rounded-full font-bold text-xl shadow-2xl hover:bg-purple-500 hover:scale-110 transition-all mx-auto"
            >
              <Stars /> Let's Decorate!
            </button>
          </div>
        )}

        {step === AppStep.COUNTDOWN && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="relative">
              <h2 className="text-5xl md:text-8xl font-bungee text-glow animate-pulse">2026</h2>
              <PartyPopper className="absolute -top-10 -right-10 w-16 h-16 text-yellow-400" />
            </div>
            <p className="text-gray-300 text-xl italic">Prepare for the celebration of a lifetime.</p>
            <button 
              onClick={(e) => { e.stopPropagation(); setStep(AppStep.CELEBRATION); }}
              className="flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full font-black text-2xl shadow-[0_0_60px_rgba(251,191,36,0.5)] hover:scale-125 transition-all mx-auto"
            >
              BLAST OFF! <Rocket />
            </button>
          </div>
        )}
      </div>

      {/* 4. FINAL CELEBRATION */}
      {step === AppStep.CELEBRATION && (
        <div className="z-30 w-full max-w-4xl flex flex-col items-center text-center space-y-8 py-12 px-4 animate-in fade-in duration-1000">
          <div className="space-y-4">
            <p className="text-2xl font-cursive text-yellow-400">Happy New Year, dearest...</p>
            <h1 className="text-6xl md:text-9xl font-bungee text-white text-glow leading-none select-none">
              {name}
            </h1>
          </div>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative p-1 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 rounded-[3.5rem] shadow-[0_0_80px_rgba(139,92,246,0.3)] w-full max-w-2xl transform transition-transform duration-500"
          >
            <div className="p-8 md:p-12 bg-slate-900/90 backdrop-blur-md rounded-[3rem] space-y-6 flex flex-col items-center">
              
              <div className="w-full overflow-y-auto max-h-[300px] custom-scrollbar px-4 text-left">
                <p 
                  key={chunkIndex}
                  className="text-2xl md:text-3xl leading-relaxed text-gray-100 font-medium whitespace-pre-wrap reveal-text"
                >
                  {messageChunks[chunkIndex]}
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <div className="flex items-center justify-between w-full">
                <button 
                  onClick={prevChunk}
                  disabled={chunkIndex === 0}
                  className={`p-4 rounded-full transition-all ${chunkIndex === 0 ? 'text-white/5' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                >
                  <ChevronLeft size={32} />
                </button>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-4 text-yellow-400">
                    <Stars size={24} className="animate-pulse" />
                    <Rocket size={24} className="animate-bounce" />
                  </div>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                    Part {chunkIndex + 1} of {messageChunks.length}
                  </span>
                </div>

                <button 
                  onClick={nextChunk}
                  disabled={chunkIndex === messageChunks.length - 1}
                  className={`p-4 rounded-full transition-all ${chunkIndex === messageChunks.length - 1 ? 'text-white/5' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Fortune Cookie */}
          <div className="relative group">
            <button 
              onClick={(e) => { e.stopPropagation(); showRandomFortune(); }}
              className="flex items-center gap-2 px-6 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-xs font-bold hover:bg-yellow-400/20 transition-all"
            >
              <Zap size={14} /> Tap for a 2026 Prediction
            </button>
            {activeFortune && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 p-4 bg-white text-black rounded-2xl shadow-2xl animate-in zoom-in slide-in-from-top-4 italic font-medium text-sm z-50">
                {activeFortune}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-6 pt-10 pb-20">
            <button
              onClick={(e) => { e.stopPropagation(); resetApp(); }}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all text-sm font-bold flex items-center gap-2"
            >
              Create Your Own <ArrowRight size={16} />
            </button>
            <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase">Click the sky to launch fireworks!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

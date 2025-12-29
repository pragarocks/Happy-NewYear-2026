
import React from 'react';

export const FloatingBalloons: React.FC = () => {
  const colors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#eab308', '#ec4899'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute bottom-[-100px] animate-float transition-all"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
        >
          <div 
            className="w-12 h-16 rounded-full relative shadow-lg opacity-70"
            style={{ backgroundColor: colors[i % colors.length] }}
          >
            <div className="absolute bottom-[-20px] left-1/2 w-0.5 h-12 bg-white/20 -translate-x-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const PartyBulbs: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className={`fixed top-0 left-0 w-full flex justify-around p-2 transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}>
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className={`w-4 h-4 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse`}
          style={{ 
            backgroundColor: i % 2 === 0 ? '#fbbf24' : '#f87171',
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};

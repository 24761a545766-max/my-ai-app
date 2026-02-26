e"use client"; // Required for the animation interval
import { useEffect, useState } from 'react';

export default function Home() {
  // Logic to handle the swimming fish/creatures
  useEffect(() => {
    const creatures = ["🐟", "🐠", "🐡", "🐙", "🦀"];
    
    const interval = setInterval(() => {
      const div = document.createElement("div");
      div.className = "absolute text-3xl pointer-events-none transition-opacity duration-1000 fish-animation";
      div.innerHTML = creatures[Math.floor(Math.random() * creatures.length)];
      
      const top = Math.random() * 90;
      const startLeft = Math.random() < 0.5 ? -50 : window.innerWidth + 50;
      const endLeft = startLeft < 0 ? window.innerWidth + 50 : -50;
      
      div.style.top = `${top}%`;
      div.style.left = `${startLeft}px`;
      
      // We use the Web Animations API for smooth swimming
      div.animate([
        { left: `${startLeft}px` },
        { left: `${endLeft}px` }
      ], {
        duration: Math.random() * 15000 + 10000,
        easing: 'linear'
      });

      document.body.appendChild(div);
      setTimeout(() => div.remove(), 25000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#a6e3ff] via-[#6ec6ff] to-[#2196f3]">
      {/* 🌊 Flowing Water Texture */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4)_2%,transparent_3%)] bg-[length:150px_150px] animate-pulse" />
      </div>

      {/* 🐚 Shell AI Content */}
      <div className="relative z-10 flex flex-col items-center pt-20">
        <h1 className="text-5xl font-black text-[#00334d] tracking-widest animate-bounce">
          SHELL AI
        </h1>
        
        <div className="mt-12 group cursor-pointer">
           <img 
            src="/shell.png" 
            alt="AI Shell" 
            className="w-80 md:w-[420px] transition-transform duration-700 hover:scale-110 active:scale-95 drop-shadow-2xl"
          />
        </div>

        <p className="mt-10 text-[#00334d] font-bold text-xl bg-white/30 px-6 py-2 rounded-full backdrop-blur-md">
          Listening to the ocean...
        </p>
      </div>
    </main>
  );
}
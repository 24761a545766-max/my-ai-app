"use client";
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const creatures = ["🐟", "🐠", "🐡", "🐙", "🦀", "🦐", "🦑"];
    
    const createCreature = () => {
      const creature = document.createElement("div");
      const isGoingRight = Math.random() < 0.5;
      
      creature.className = "fixed pointer-events-none z-0 select-none transition-opacity duration-1000";
      creature.style.fontSize = `${Math.floor(Math.random() * 20) + 20}px`;
      creature.innerHTML = creatures[Math.floor(Math.random() * creatures.length)];
      
      const top = Math.random() * 90;
      const startLeft = isGoingRight ? +50 : window.innerWidth - 50;
      const endLeft = isGoingRight ? window.innerWidth + 50 : -50;
      
      creature.style.top = `${top}%`;
      creature.style.left = `${startLeft}px`;
      
      // Flip the emoji based on direction
      if (!isGoingRight) {
        creature.style.transform = "scaleX(1)";
      }

      document.body.appendChild(creature);

      const animation = creature.animate([
        { left: `${startLeft}px` },
        { left: `${endLeft}px` }
      ], {
        duration: Math.random() * 10000 + 15000,
        easing: 'linear'
      });

      animation.onfinish = () => creature.remove();
    };

    const interval = setInterval(createCreature, 3000);
    return () => {
      clearInterval(interval);
      // Clean up any remaining fish when leaving the page
      document.querySelectorAll('.fixed').forEach(el => {
        if (creatures.includes(el.innerHTML)) el.remove();
      });
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#a6e3ff] via-[#6ec6ff] to-[#2196f3]">
      
      {/* 🌊 Animated Water Bubbles Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white_1%,transparent_2%)] bg-[length:100px_100px] animate-[pulse_4s_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white_1%,transparent_2%)] bg-[length:150px_150px] animate-[pulse_6s_infinite]" />
      </div>

      {/* 🐚 Main UI Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        
        {/* Floating Title */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-6xl md:text-8xl font-black text-[#00334d] tracking-tighter drop-shadow-sm animate-pulse">
            SHELL AI
          </h1>
          <div className="h-1 w-32 bg-[#00334d] mx-auto rounded-full opacity-20" />
        </div>

        {/* The Shell Image */}
        <div className="relative group cursor-pointer">
          {/* Subtle Glow behind the shell */}
          <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-75 group-hover:bg-blue-200/50 transition-colors duration-1000" />
          
          <img 
            src="/shell.png" 
            alt="AI Shell" 
            className="relative w-72 md:w-[450px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-1000 group-hover:scale-105 group-hover:-translate-y-4 animate-[bounce_10s_infinite_ease-in-out]"
          />
        </div>

        {/* Status Badge */}
        <div className="mt-12 flex flex-col items-center">
          <p className="text-[#00334d] font-bold text-lg bg-white/40 backdrop-blur-md px-8 py-3 rounded-2xl border border-white/20 shadow-xl transition-all hover:bg-white/60">
            Go with Flow...
          </p>
          <div className="mt-4 flex space-x-2">
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      </div>

      {/* Custom Styles for animations not in standard Tailwind */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </main>
  );
}
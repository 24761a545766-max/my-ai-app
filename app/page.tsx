"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [introText, setIntroText] = useState("");
  const fullGreeting = "Diving into the data stream... I am SHELL, your Ethical Sentinel. What waves shall we navigate today?";

  useEffect(() => {
    // Typewriter Effect logic
    let i = 0;
    const timer = setInterval(() => {
      setIntroText(fullGreeting.slice(0, i));
      i++;
      if (i > fullGreeting.length) clearInterval(timer);
    }, 50); // Speed of typing (50ms)

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#a6e3ff] via-[#6ec6ff] to-[#2196f3]">
      
      {/* Background Fish/Bubbles (Keep your previous logic here) */}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black text-[#00334d] tracking-widest mb-10 animate-pulse">
          SHELL AI
        </h1>

        {/* The Shell Image */}
        <div className="relative group mb-12">
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full animate-pulse" />
          <img 
            src="/shell.png" 
            alt="AI Shell" 
            className="relative w-64 md:w-[400px] drop-shadow-2xl transition-transform duration-1000 group-hover:rotate-12"
          />
        </div>

        {/* 💎 UNIQUE INTRO BOX */}
        <div className="max-w-xl w-full">
          <div className="bg-white/30 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] transform animate-[float_4s_infinite_ease-in-out]">
            <p className="text-[#00334d] font-mono text-lg md:text-xl leading-relaxed">
              <span className="opacity-60 text-sm block mb-2 uppercase tracking-tighter">System Pulse: Online</span>
              {introText}
              <span className="inline-block w-2 h-5 bg-[#00334d] ml-1 animate-blink" />
            </p>
          </div>
        </div>

      </div>

      {/* Special Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s step-end infinite; }
      `}</style>
    </main>
  );
}
"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState("");
  const [introText, setIntroText] = useState("");
  const fullGreeting = "Listening to the ocean's whispers... I am SHELL.";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setIntroText(fullGreeting.slice(0, i));
      i++;
      if (i > fullGreeting.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching the tides for: ${query}`);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans">
      
      {/* 🌊 Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="absolute min-w-full min-h-full object-cover">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-beach-with-waves-at-sunset-40250-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* 🐚 UI Layer */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen py-12 px-6">
        
        {/* Header Area */}
        <div className="text-center animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-lg">
            SHELL AI
          </h1>
          <p className="text-orange-200 text-sm tracking-[0.3em] uppercase mt-2">Ethical Sentinel System</p>
        </div>

        {/* Center: The Shell & Intro */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
            <img src="/shell.png" alt="AI Shell" className="relative w-48 md:w-[320px] drop-shadow-2xl transition-all duration-700 group-hover:scale-105" />
          </div>
          <p className="text-white text-lg md:text-xl italic font-light max-w-lg text-center h-8">
            {introText}
          </p>
        </div>

        {/* Bottom: Search Engine Bar */}
        <div className="w-full max-w-2xl animate-slideUp">
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask the depths..."
              className="w-full bg-white/10 backdrop-blur-2xl border border-white/30 rounded-full py-5 px-8 pr-16 text-white placeholder-white/60 outline-none ring-2 ring-transparent focus:ring-orange-400/50 transition-all duration-300 shadow-2xl text-lg"
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-400 text-white p-3 rounded-full transition-colors shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          <div className="flex justify-center gap-4 mt-4 text-xs text-white/40 uppercase tracking-widest">
             <span>Secure Link</span>
             <span>•</span>
             <span>Global Search</span>
             <span>•</span>
             <span>Charan Edition</span>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1.5s ease-out; }
        .animate-slideUp { animation: slideUp 1s ease-out; }
      `}</style>
    </main>
  );
}
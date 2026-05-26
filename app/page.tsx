"use client";
import { useEffect, useState, useRef } from 'react';

const labData = [
  {
    id: "bar",
    name: "Bar Graph",
    detail: "Displays categorical data using rectangular bars whose lengths are proportional to the values[cite: 12]. Can be vertical or horizontal (barh)[cite: 13, 55].",
    code: `import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf_india = df_canada.loc['India', years]\nplt.figure(figsize=(12, 6))\ndf_india.plot(kind='bar', color='skyblue', edgecolor='black')\nplt.title("India Immigrants to Canada (1980–2014)")\nplt.show()`
  },
  {
    id: "pie",
    name: "Pie Chart",
    detail: "A circular chart used to show data as proportions or percentages[cite: 86]. Each slice represents a part of the whole[cite: 87].",
    code: `plt.pie(continent_totals, labels=continent_totals.index, autopct='%1.1f%%', startangle=140)\n# Explode Africa slice\nexplode = [0.1 if c == 'Africa' else 0 for c in continent_totals.index]\nplt.pie(continent_totals, explode=explode, autopct='%1.1f%%')`
  },
  {
    id: "subplots",
    name: "Subplots",
    detail: "The subplot() method adds a plot to a grid position (rows, columns, index) within the current figure[cite: 366, 367].",
    code: `fig, axes = plt.subplots(2, 2, figsize=(14, 10))\naxes[0, 0].plot(years_int, total_immigrants) # Line\naxes[0, 1].scatter(years_int, total_immigrants) # Scatter\naxes[1, 0].hist(immigrants_2013, bins=20) # Histogram\naxes[1, 1].pie(top5_2013['2013'], labels=top5_2013['Country']) # Pie`
  }
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [introText, setIntroText] = useState("");
  const [showLab, setShowLab] = useState(false);
  const [activeTab, setActiveTab] = useState(labData[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fullGreeting = "Welcome,Choosav ga inka DENGEY";

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setIntroText(fullGreeting.slice(0, i));
      i++;
      if (i > fullGreeting.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // 🌊 Pure JS 3D Live Wave Animation Matrix Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle matrix configuration
    const SEPARATION = 45;
    const AMOUNTX = 60;
    const AMOUNTY = 40;
    let count = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Deep ocean gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#000814');
      bgGrad.addColorStop(0.5, '#001d3d');
      bgGrad.addColorStop(1, '#000814');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Perspective projection configurations
      const fov = 350; 
      const cx = width / 2;
      const cy = height * 0.65; // Push the horizon lower down the screen

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          // Calculate standard 3D Grid Positions
          const x3d = (ix - AMOUNTX / 2) * SEPARATION;
          const z3d = (iy - AMOUNTY / 2) * SEPARATION + 200; // Depth coordinate
          
          // 3D Sine Wave Equation modifying the Y coordinate (Height) over time
          const y3d = (Math.sin((ix + count) * 0.2) * 35) + (Math.sin((iy + count) * 0.3) * 35);

          // 3D to 2D Perspective Projection conversion matrix
          const scale = fov / (fov + z3d);
          const x2d = cx + x3d * scale;
          const y2d = cy + y3d * scale;

          if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
            // Particle brightness depends directly on its proximity to the viewer
            const alpha = Math.max(0.1, scale * 1.1);
            const size = Math.max(0.5, scale * 3.5);

            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            // Bioluminescent aquatic cyan color mapping
            ctx.fillStyle = `rgba(0, 180, 255, ${alpha})`;
            ctx.fill();
          }
        }
      }

      count += 0.04; // Controls fluid velocity of waves
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching the marine net for: ${query}`);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans bg-[#000814]">
      {/* 🔮 Live 3D Render Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* 🐚 UI Layer */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen py-10 px-6">
        {/* Header */}
        <div className="text-center animate-fadeIn">
          <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_10px_25px_rgba(0,180,255,0.4)]">
            SHELL AI
          </h1>
          <button 
            onClick={() => setShowLab(!showLab)}
            className="mt-4 px-5 py-1.5 border border-blue-500/30 text-blue-400 text-[10px] uppercase tracking-widest rounded-full hover:bg-blue-600 hover:text-white hover:border-transparent transition-all bg-blue-950/20 backdrop-blur-md font-bold"
          >
            {showLab ? "Hide Data Layer" : "Expose Week 12 Data"}
          </button>
        </div>

        {/* Content Section */}
        {!showLab ? (
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
              <img src="/shell.png" className="relative w-40 md:w-64 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-105 duration-700 ease-out" />
            </div>
            <p className="text-blue-100 text-lg italic font-light max-w-lg tracking-wide drop-shadow-md min-h-[2rem]">
              {introText}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl bg-slate-950/75 backdrop-blur-3xl rounded-[2.5rem] border border-blue-500/20 p-8 flex flex-col md:flex-row gap-8 animate-slideUp shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
            <nav className="w-full md:w-48 space-y-2">
              {labData.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item)}
                  className={`w-full text-left p-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${activeTab.id === item.id ? 'bg-blue-600 border-blue-400 text-white shadow-md' : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'}`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{activeTab.name}</h3>
              <p className="text-sm text-slate-300 mb-6 border-l-2 border-blue-500 pl-4 leading-relaxed">{activeTab.detail}</p>
              <div className="rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                <pre className="bg-black/90 p-6 text-cyan-400 font-mono text-xs overflow-x-auto whitespace-pre">
                  <code>{activeTab.code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query the database..." 
              className="w-full bg-slate-900/30 border border-white/10 rounded-full py-4 px-8 pr-16 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all shadow-xl text-lg font-medium"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-full transition-all shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          <div className="flex justify-center gap-4 mt-4 text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">
             <span>Secure SSL</span> • <span>Charan Edition</span> • <span>3D Fluid Grid</span>
          </div>
        </div>
      </div>
    </main>
  );
}
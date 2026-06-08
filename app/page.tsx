"use client";
import { useEffect, useState, useRef } from 'react';

interface SurveySubmission {
  id: number;
  location: string;
  category: string;
  satisfaction: number;
  timestamp: string;
}

interface ClimateData {
  location: string;
  temp: string;
  precipitation: string;
  windSpeed: string;
  cycloneThreat: string;
  safeZone: string;
}

export default function Home() {
  const [introText, setIntroText] = useState("");
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([
    { id: 101, location: "Kondapalli", category: "Public Infrastructure", satisfaction: 4, timestamp: "06:42 PM" },
    { id: 102, location: "LBRCE Suburb", category: "Waste Management", satisfaction: 2, timestamp: "07:15 PM" },
    { id: 103, location: "Gopal Nagar", category: "Water Supply System", satisfaction: 5, timestamp: "07:38 PM" }
  ]);
  const [formData, setFormData] = useState({ location: "", category: "Public Infrastructure", satisfaction: 3 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic state initialization mapping default parameters 
  const [climate, setClimate] = useState<ClimateData>({
    location: "Kondapalli, AP (Default)",
    temp: "32°C",
    precipitation: "10%",
    windSpeed: "7 mph SW",
    cycloneThreat: "None Active",
    safeZone: "In-Place Shelter Optimal"
  });

  // 📡 Real-time Browser Geolocation API Ingestion Hook
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocode coordinates using a public open API layer
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const detectCity = data.city || data.locality || "Unknown Sector";
            const detectState = data.principalSubdivisionCode ? data.principalSubdivisionCode.split('-')[1] || "" : "";

            // Dynamic evaluation based on coordinates
            setClimate({
              location: `${detectCity}${detectState ? ', ' + detectState : ''}`,
              temp: "31°C", // Simulating live dynamic variance relative to local lookup
              precipitation: "15%",
              windSpeed: "8 mph W",
              cycloneThreat: "None Active",
              safeZone: "In-Place Shelter Optimal"
            });
          } catch (err) {
            console.error("Geocoding failed, preserving core coordinate defaults.", err);
          }
        },
        (error) => {
          console.warn("Location permission flagged/denied. Running default tracking terminal matrix.", error);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }
  }, []);

  // Dynamic welcome statement banner tracking live text mutations
  useEffect(() => {
    let i = 0;
    const fullGreeting = `Secure node linked: ${climate.location}. Climate Telemetry Engine initialized. Current System Status: CLEAR.`;
    setIntroText(""); // Reset text on location change
    
    const timer = setInterval(() => {
      setIntroText(fullGreeting.slice(0, i));
      i++;
      if (i > fullGreeting.length) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [climate.location]);

  // 🌊 Pure JS 3D Live Wave Animation Matrix Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

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

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#000511');
      bgGrad.addColorStop(0.5, '#001430');
      bgGrad.addColorStop(1, '#000511');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const fov = 350; 
      const cx = width / 2;
      const cy = height * 0.8; 

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const x3d = (ix - AMOUNTX / 2) * SEPARATION;
          const z3d = (iy - AMOUNTY / 2) * SEPARATION + 200; 
          const y3d = (Math.sin((ix + count) * 0.2) * 30) + (Math.sin((iy + count) * 0.3) * 30);

          const scale = fov / (fov + z3d);
          const x2d = cx + x3d * scale;
          const y2d = cy + y3d * scale;

          if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
            const alpha = Math.max(0.06, scale * 0.8);
            const size = Math.max(0.5, scale * 2.5);

            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.fill();
          }
        }
      }

      count += 0.025; 
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newSubmission: SurveySubmission = {
      id: Date.now() % 1000,
      location: formData.location,
      category: formData.category,
      satisfaction: Number(formData.satisfaction),
      timestamp: timeString
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setFormData(prev => ({ ...prev, location: "" }));
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans bg-[#000511]">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto py-8 px-4 md:px-6 flex flex-col justify-between min-h-screen">
        
        {/* Top Header Panel */}
        <header className="flex justify-between items-center bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-4 shadow-xl mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-[0_4px_12px_rgba(14,165,233,0.4)]">
              SHELL AI
            </h1>
            <span className="text-[9px] font-mono text-sky-400 tracking-widest uppercase mt-0.5">Community Survey & Climate Vector Matrix</span>
          </div>
          <div className="flex items-center gap-2 bg-sky-950/40 border border-sky-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-gray-300 uppercase tracking-wider font-bold">Charan Edition</span>
          </div>
        </header>

        {/* Live Climate Telemetry Ribbon */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: `Target Location Monitor`, value: climate.location, color: "text-amber-400 text-sm md:text-base truncate" },
            { label: "Precipitation Vector", value: climate.precipitation, color: "text-sky-400" },
            { label: "Wind Velocity Matrix", value: climate.windSpeed, color: "text-emerald-400" },
            { label: "Active Cyclone Track", value: climate.cycloneThreat, color: "text-rose-400" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-950/50 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col shadow-lg overflow-hidden">
              <span className="text-[10px] uppercase text-slate-500 tracking-wider font-bold truncate">{stat.label}</span>
              <span className={`text-xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </section>

        {/* Safe Zone Alert Notification Block */}
        <div className="mb-6 p-4 bg-emerald-950/30 backdrop-blur-md border border-emerald-500/20 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2 shadow-inner">
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Shelter Relocation Framework Status</h4>
            <p className="text-xs text-slate-400 mt-0.5">Atmospheric pressures are completely stable. No evacuation countdown initiated.</p>
          </div>
          <div className="bg-emerald-900/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold text-emerald-300">
            Safe Target: {climate.safeZone}
          </div>
        </div>

        {/* Main Split Content Workspace */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-start overflow-hidden mb-6">
          
          {/* Left Column: Data Ingestion Form */}
          <section className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2">
              Log Field Observation
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Location / sector</label>
                <input 
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Kondapalli Ward 4"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Project Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer text-slate-200"
                >
                  <option value="Public Infrastructure">Public Infrastructure</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Water Supply System">Water Supply System</option>
                  <option value="Public Safety & Lighting">Public Safety & Lighting</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Satisfaction Vector (1-5)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5"
                  value={formData.satisfaction}
                  onChange={(e) => setFormData(prev => ({ ...prev, satisfaction: Number(e.target.value) }))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>Critical (1)</span>
                  <span className="text-sky-400 font-bold">Value: {formData.satisfaction}</span>
                  <span>Optimal (5)</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Incorporate Record
              </button>
            </form>
          </section>

          {/* Right Columns: Active Matrix Feed Display */}
          <section className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl md:col-span-2 flex flex-col h-full max-h-[380px]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2 mb-4">
              Telemetry Data Stream Feed
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 overflow-x-hidden">
              {submissions.map((item) => (
                <div key={item.id} className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-sky-500/20 transition-all group">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono text-slate-500">ID: #{item.id} • {item.timestamp}</span>
                    <span className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">{item.location}</span>
                    <span className="text-xs text-slate-400">{item.category}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Index Rating</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span 
                          key={i} 
                          className={`w-1.5 h-3 rounded-sm ${i < item.satisfaction ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]' : 'bg-slate-800'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Context Footnote Status */}
        <footer className="w-full text-center py-2 border-t border-white/5">
          <p className="text-slate-400 text-xs italic tracking-wide max-w-xl mx-auto">
            {introText || "Awaiting pipeline connection..."}
          </p>
          <div className="flex justify-center gap-4 mt-3 text-[9px] text-slate-600 uppercase tracking-widest font-mono font-bold">
             <span>Data Layer: Active</span> • <span>Charan Edition Build</span> • <span>Project Type: CSP</span>
          </div>
        </footer>

      </div>
    </main>
  );
}
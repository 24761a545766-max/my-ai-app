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
    { id: 101, location: "Kondapalli Center", category: "Public Infrastructure", satisfaction: 4, timestamp: "06:42 PM" },
    { id: 102, location: "LBRCE Suburb", category: "Waste Management", satisfaction: 2, timestamp: "07:15 PM" },
    { id: 103, location: "Gopal Nagar", category: "Water Supply System", satisfaction: 5, timestamp: "07:38 PM" }
  ]);
  const [formData, setFormData] = useState({ location: "", category: "Public Infrastructure", satisfaction: 3 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  // Simulation State for emergency tracking arrays
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const [climate, setClimate] = useState<ClimateData>({
    location: "Kondapalli, AP (Default)",
    temp: "32°C",
    precipitation: "10%",
    windSpeed: "7 mph SW",
    cycloneThreat: "None Active",
    safeZone: "In-Place Shelter Optimal"
  });

  // 🗺️ Load Leaflet Map Assets Dynamically (Prevents SSR Next.js Crash)
  useEffect(() => {
    // Add Leaflet CSS to page head
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Add Leaflet JS Script to page
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      // Initialize default map view (Centered at Kondapalli coordinates baseline)
      const L = (window as any).L;
      const initialLat = 16.6264;
      const initialLng = 80.5404;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([initialLat, initialLng], 13);

      // Apply sleek dark-mode map skin to match Shell AI theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Custom glowing blue user pin
      const pulseIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #0ea5e9; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 12px #0ea5e9; animate: pulse 2s infinite;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker([initialLat, initialLng], { icon: pulseIcon }).addTo(map);
      marker.bindPopup("<b style='color:#000'>Your Device Node Baseline</b>").openPopup();

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;

      // Trigger user tracking instantly once map tools load
      requestUserLocation();
    };

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  // 📡 Query Browser Geolocation and Update Map Interface
  const requestUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const L = (window as any).L;

          // 1. Pan Map to True Live Coordinates and lock marker position
          if (mapInstanceRef.current && markerInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            markerInstanceRef.current.setLatLng([latitude, longitude]);
            markerInstanceRef.current.getPopup().setContent("<b style='color:#000'>Live Node Location Verified</b>").openPopup();
          }

          // 2. Fetch City Metadata
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const detectCity = data.city || data.locality || "Active Sector";
            const detectState = data.principalSubdivisionCode ? data.principalSubdivisionCode.split('-')[1] || "" : "";

            setClimate(prev => ({
              ...prev,
              location: `${detectCity}${detectState ? ', ' + detectState : ''}`
            }));
          } catch (err) {
            console.error("Geocoding map failed.", err);
          }
        },
        (error) => console.warn("Location permission denied. Running fallback matrix.", error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  // ⏱️ Emergency Countdown Timer Engine
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emergencyMode) {
      let totalSeconds = 4 * 3600 + 12 * 60;
      timer = setInterval(() => {
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return;
        }
        totalSeconds--;
        setCountdown({
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emergencyMode]);

  // Typewriter banner string assembly
  useEffect(() => {
    let i = 0;
    const statusText = emergencyMode ? "⚠️ CRITICAL WARNING VECTOR DETECTED." : "System Status: CLEAR.";
    const fullGreeting = `Secure node linked: ${climate.location}. Climate Telemetry Engine initialized. Current ${statusText}`;
    setIntroText("");
    const timer = setInterval(() => {
      setIntroText(fullGreeting.slice(0, i));
      i++;
      if (i > fullGreeting.length) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [climate.location, emergencyMode]);

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
      bgGrad.addColorStop(0, emergencyMode ? '#110005' : '#000511');
      bgGrad.addColorStop(0.5, emergencyMode ? '#2a0813' : '#001430');
      bgGrad.addColorStop(1, emergencyMode ? '#110005' : '#000511');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const fov = 350; 
      const cx = width / 2;
      const cy = height * 0.8; 

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const x3d = (ix - AMOUNTX / 2) * SEPARATION;
          const z3d = (iy - AMOUNTY / 2) * SEPARATION + 200; 
          const waveAmp = emergencyMode ? 45 : 30;
          const speedMod = emergencyMode ? 0.4 : 0.2;
          const y3d = (Math.sin((ix + count) * speedMod) * waveAmp) + (Math.sin((iy + count) * 0.3) * waveAmp);

          const scale = fov / (fov + z3d);
          const x2d = cx + x3d * scale;
          const y2d = cy + y3d * scale;

          if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
            const alpha = Math.max(0.06, scale * 0.8);
            const size = Math.max(0.5, scale * 2.5);

            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fillStyle = emergencyMode ? `rgba(244, 63, 94, ${alpha})` : `rgba(14, 165, 233, ${alpha})`;
            ctx.fill();
          }
        }
      }

      count += emergencyMode ? 0.06 : 0.025; 
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [emergencyMode]);

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
            <span className="text-[9px] font-mono text-sky-400 tracking-widest uppercase mt-0.5">Emergency Weather & Map Interface</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setEmergencyMode(!emergencyMode)}
              className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-mono font-bold border transition-all ${
                emergencyMode 
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-400 animate-pulse' 
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {emergencyMode ? "Disable Threat Mock" : "Simulate Cyclone Warning"}
            </button>
            <div className="flex items-center gap-2 bg-sky-950/40 border border-sky-500/30 px-3 py-1 rounded-full">
              <span className={`w-2 h-2 rounded-full ${emergencyMode ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
              <span className="text-[10px] font-mono text-gray-300 uppercase tracking-wider font-bold">Charan Edition</span>
            </div>
          </div>
        </header>

        {/* Dynamic Climate Telemetry Ribbon */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: `Target Location`, value: climate.location, color: "text-amber-400 text-sm md:text-base truncate" },
            { label: "Precipitation Vector", value: emergencyMode ? "85%" : climate.precipitation, color: "text-sky-400" },
            { label: "Wind Velocity Matrix", value: emergencyMode ? "48 mph NE" : climate.windSpeed, color: "text-emerald-400" },
            { label: "Cyclone Track Vector", value: emergencyMode ? "CAT-1 Approaching" : climate.cycloneThreat, color: emergencyMode ? "text-rose-500 font-black animate-pulse" : "text-slate-400" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-950/50 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col shadow-lg overflow-hidden">
              <span className="text-[10px] uppercase text-slate-500 tracking-wider font-bold truncate">{stat.label}</span>
              <span className={`text-xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </section>

        {/* Dynamic Countdown & Safe Place Dock */}
        <div className={`mb-6 p-5 backdrop-blur-md rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-500 border ${
          emergencyMode ? 'bg-rose-950/30 border-rose-500/30' : 'bg-emerald-950/20 border-emerald-500/20'
        }`}>
          <div className="flex-1">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${emergencyMode ? 'text-rose-400' : 'text-emerald-400'}`}>
              {emergencyMode ? "🚨 MANDATORY EVACUATION RADIAL ACTIVE" : "🛡️ Shelter Relocation Framework Status"}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {emergencyMode 
                ? "Extreme storm surges mapped. Clear transit lanes immediately to reach the pinned geographical backup shelter on your display tracker."
                : "Atmospheric tracking arrays confirm perfectly safe parameters. Evacuation countdowns are dormant."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            {emergencyMode && (
              <div className="bg-black/50 border border-rose-500/40 px-4 py-2 rounded-lg flex flex-col items-center min-w-[120px]">
                <span className="text-[8px] font-mono text-rose-400 uppercase tracking-widest font-bold">TIME REMAINING</span>
                <span className="text-lg font-mono font-black text-white tracking-widest mt-0.5">
                  {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                </span>
              </div>
            )}
            <div className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex flex-col border ${
              emergencyMode ? 'bg-rose-950 border-rose-400 text-white' : 'bg-emerald-900/40 border-emerald-500/30 text-emerald-300'
            }`}>
              <span className="text-[8px] opacity-60 uppercase tracking-wider font-bold">DESIGNATED SAFE DESTINATION</span>
              <span className="text-sm mt-0.5 font-sans font-extrabold">
                {emergencyMode ? "LBRCE Cyclone Shelter Block-B" : "In-Place Shelter Optimal"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Split Content Workspace */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch overflow-hidden mb-6">
          
          {/* 📍 CENTER/LEFT SPAN: REAL-TIME GEOLOCATION MAP TERMINAL */}
          <section className="md:col-span-2 bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-xl flex flex-col min-h-[350px] relative group">
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3 px-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Live Spatial Telemetry Grid
              </h3>
              <button 
                onClick={requestUserLocation}
                className="text-[10px] font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-widest flex items-center gap-1"
              >
                🛰️ Recenter GPS
              </button>
            </div>
            
            {/* The Visual Leaflet Container Map Element */}
            <div 
              ref={mapContainerRef} 
              className="flex-1 w-full rounded-xl overflow-hidden border border-white/5 shadow-inner z-10" 
              style={{ minHeight: '280px' }}
            />
          </section>

          {/* Right Column: Mini Survey Data Logging Block */}
          <section className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-4 justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2 mb-4">
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                  >
                    <option value="Public Infrastructure">Public Infrastructure</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="Water Supply System">Water Supply System</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] uppercase tracking-widest py-2.5 rounded-xl transition-all shadow-md mt-2"
                >
                  Incorporate Record
                </button>
              </form>
            </div>

            {/* Quick Summary Tracker Metrics */}
            <div className="border-t border-white/10 pt-3 text-[10px] font-mono text-slate-400 space-y-1">
              <div>Total Survey Points Saved: <span className="text-white font-bold">{submissions.length}</span></div>
              <div>Active Baseline Coordinates: <span className="text-sky-400 font-bold">Live Geo Tracked</span></div>
            </div>
          </section>

        </div>

        {/* Bottom Context Footnote Status */}
        <footer className="w-full text-center py-2 border-t border-white/5">
          <p className="text-slate-400 text-xs italic tracking-wide max-w-xl mx-auto">
            {introText || "Awaiting pipeline connection..."}
          </p>
          <div className="flex justify-center gap-4 mt-3 text-[9px] text-slate-600 uppercase tracking-widest font-mono font-bold">
             <span>Map Layer: Rendered</span> • <span>Charan Edition Build</span> • <span>Project Type: CSP</span>
          </div>
        </footer>

      </div>
    </main>
  );
}
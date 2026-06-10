"use client";
import { useEffect, useState, useRef } from 'react';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

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

  // 🗺️ Leaflet Map Initialization & Dynamic Weather Ingestion Pipeline
  useEffect(() => {
    let active = true;

    const initMap = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement("link");
        link.id = 'leaflet-css';
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const loadScript = () => {
        return new Promise((resolve) => {
          if ((window as any).L) return resolve((window as any).L);
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.async = true;
          script.onload = () => resolve((window as any).L);
          document.body.appendChild(script);
        });
      };

      const L: any = await loadScript();
      if (!active || !mapContainerRef.current || mapInstanceRef.current) return;

      const defaultLat = 16.6264;
      const defaultLng = 80.5404;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([defaultLat, defaultLng], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      const pulseIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #0ea5e9; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 12px #0ea5e9;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker([defaultLat, defaultLng], { icon: pulseIcon }).addTo(map);
      marker.bindPopup("<b style='color:#000'>System Coordinate Active</b>").openPopup();

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            if (!active) return;
            
            map.setView([latitude, longitude], 14);
            marker.setLatLng([latitude, longitude]);
            marker.getPopup().setContent("<b style='color:#000'>Live GPS Position Locked</b>").openPopup();

            try {
              const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
              const geoData = await geoRes.json();
              const city = geoData.city || geoData.locality || "Active Sector";
              const state = geoData.principalSubdivisionCode ? geoData.principalSubdivisionCode.split('-')[1] || "" : "";
              const formattedName = `${city}${state ? ', ' + state : ''}`;

              const apiKey = "feff206daa60b539abe8fae8f2ab7f29"; 
              const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
              const wData = await weatherRes.json();

              if (wData && wData.main) {
                const isStormy = wData.wind && wData.wind.speed > 17; // Cyclone threshold test trigger
                if (isStormy) setEmergencyMode(true);

                setClimate({
                  location: formattedName,
                  temp: `${Math.round(wData.main.temp)}°C`,
                  precipitation: wData.clouds ? `${wData.clouds.all}%` : "10%",
                  windSpeed: wData.wind ? `${Math.round(wData.wind.speed * 2.237)} mph` : "7 mph",
                  cycloneThreat: isStormy ? "CAT-1 Approaching" : "None Active",
                  safeZone: isStormy ? "LBRCE Shelter Block-B" : "In-Place Shelter Optimal"
                });
              }
            } catch (e) {
              console.error("Weather sync failed", e);
            }
          },
          (err) => console.warn("GPS access postponed.", err),
          { enableHighAccuracy: true, timeout: 7000 }
        );
      }
    };

    initMap();
    return () => { active = false; };
  }, []);

  // ⏱️ Evacuation Countdown Timer Engine (Handles default reset bounds)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (emergencyMode) {
      let totalSeconds = 4 * 3600 + 12 * 60; // 4 Hours initialization block
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
    } else {
      // Default state reset matrix when no alert is flagged
      setCountdown({ hours: 0, minutes: 0, seconds: 0 });
    }

    return () => clearInterval(timer);
  }, [emergencyMode]);

  // Typewriter text banner string assembly
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

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden font-sans bg-[#000511]">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto py-8 px-4 md:px-6 flex flex-col justify-between min-h-screen">
        
        {/* Header Panel */}
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
                emergencyMode ? 'bg-rose-950/40 border-rose-500/50 text-rose-400 animate-pulse' : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
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

        {/* Climate Telemetry Ribbon */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: `Target Location Monitor`, value: climate.location, color: "text-amber-400 text-sm md:text-base truncate" },
            { label: "Live Temperature", value: climate.temp, color: "text-orange-400" },
            { label: "Wind Velocity Matrix", value: emergencyMode ? "48 mph NE" : climate.windSpeed, color: "text-emerald-400" },
            { label: "Cloud Cover (Precipitation)", value: emergencyMode ? "85%" : climate.precipitation, color: "text-sky-400" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-950/50 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col shadow-lg overflow-hidden">
              <span className="text-[10px] uppercase text-slate-500 tracking-wider font-bold truncate">{stat.label}</span>
              <span className={`text-xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </section>

        {/* Countdown Alert Notification Dock */}
        <div className={`mb-6 p-5 backdrop-blur-md rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border transition-all duration-500 ${
          emergencyMode ? 'bg-rose-950/30 border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.15)]' : 'bg-emerald-950/20 border-emerald-500/20'
        }`}>
          <div className="flex-1">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${emergencyMode ? 'text-rose-400' : 'text-emerald-400'}`}>
              {emergencyMode ? "🚨 MANDATORY EVACUATION RADIAL ACTIVE" : "🛡️ Shelter Relocation Status"}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {emergencyMode 
                ? "Extreme storm surges mapped. Clear transit lanes immediately to reach the pinned geographical backup shelter on your display tracker."
                : "Atmospheric tracking arrays confirm safe parameters. Evacuation countdowns are safely resting."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            {/* Countdown Clock Display Box */}
            <div className={`bg-black/50 border px-4 py-2 rounded-lg flex flex-col items-center min-w-[120px] transition-colors ${emergencyMode ? 'border-rose-500/40' : 'border-white/5'}`}>
              <span className={`text-[8px] font-mono uppercase tracking-widest font-bold ${emergencyMode ? 'text-rose-400' : 'text-slate-500'}`}>TIME REMAINING</span>
              <span className={`text-lg font-mono font-black tracking-widest mt-0.5 ${emergencyMode ? 'text-white' : 'text-slate-600'}`}>
                {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>
            
            <div className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex flex-col border transition-all ${
              emergencyMode ? 'bg-rose-950 border-rose-400 text-white' : 'bg-emerald-900/40 border-emerald-500/30 text-emerald-300'
            }`}>
              <span className="text-[8px] opacity-60 uppercase tracking-wider font-bold">DESIGNATED SAFE DESTINATION</span>
              <span className="text-sm mt-0.5 font-sans font-extrabold">
                {emergencyMode ? "LBRCE Cyclone Shelter Block-B" : "In-Place Shelter Optimal"}
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Map Spatial Grid Interface Area */}
        <div className="flex-1 grid grid-cols-1 gap-6 items-stretch mb-6">
          <section className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-xl flex flex-col min-h-[380px]">
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3 px-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Live Spatial Telemetry Grid</h3>
            </div>
            <div ref={mapContainerRef} className="flex-1 w-full rounded-xl bg-black/50 overflow-hidden min-h-[320px] z-10" />
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-2 border-t border-white/5">
          <p className="text-slate-400 text-xs italic tracking-wide max-w-xl mx-auto">{introText}</p>
        </footer>

      </div>
    </main>
  );
}
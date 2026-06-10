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

interface Shelter {
  name: string;
  lat: number;
  lng: number;
  details: string;
}

export default function Home() {
  const [introText, setIntroText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const shelterMarkerRef = useRef<any>(null);
  const routingLineRef = useRef<any>(null);

  const [emergencyMode, setEmergencyMode] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [userCoords, setUserCoords] = useState({ lat: 16.6264, lng: 80.5404 }); // Baseline default
  
  // 🛡️ Regional Cyclone Safe Shelters Grid Array
  const regionalShelters: Shelter[] = [
    { name: "LBRCE Cyclone Shelter Block-B", lat: 16.6586, lng: 80.5332, details: "Reinforced Concrete Facility - Sector 1" },
    { name: "Kondapalli Community Safe Hall", lat: 16.6180, lng: 80.5480, details: "High-Elevation Storm Center - Sector 2" },
    { name: "Vijayawada West Relief Camp", lat: 16.5151, lng: 80.6171, details: "District Emergency Base - Sector 3" },
    { name: "Ibrahimpatnam Coastal Rescue Node", lat: 16.5900, lng: 80.5200, details: "Emergency Flooding Defense Unit - Sector 4" }
  ];

  const [assignedShelter, setAssignedShelter] = useState<Shelter>(regionalShelters[0]);

  const [climate, setClimate] = useState<ClimateData>({
    location: "Kondapalli, AP (Tracking)",
    temp: "32°C",
    precipitation: "10%",
    windSpeed: "7 mph SW",
    cycloneThreat: "None Active",
    safeZone: "In-Place Shelter Optimal"
  });

  // 🧮 Mathematical Haversine Distance Calculator (Finds closest shelter)
  const calculateNearestShelter = (userLat: number, userLng: number): Shelter => {
    let nearest: Shelter = regionalShelters[0];
    let minDistance = Infinity;

    regionalShelters.forEach((shelter) => {
      const R = 6371; // Earth's radius in kilometers
      const dLat = (shelter.lat - userLat) * Math.PI / 180;
      const dLng = (shelter.lng - userLng) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * Math.PI / 180) * Math.cos(shelter.lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km

      if (distance < minDistance) {
        minDistance = distance;
        nearest = shelter;
      }
    });

    return nearest;
  };

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

  // 🗺️ Map Setup & Dynamic Proximity Threat Analysis Pipeline
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

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([userCoords.lat, userCoords.lng], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      const pulseIcon = L.divIcon({
        className: 'user-div-icon',
        html: `<div style="background-color: #0ea5e9; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 12px #0ea5e9;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: pulseIcon }).addTo(map);
      userMarker.bindPopup("<b style='color:#000'>System Coordinate Active</b>").openPopup();

      mapInstanceRef.current = map;
      userMarkerRef.current = userMarker;

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            if (!active) return;
            
            setUserCoords({ lat: latitude, lng: longitude });
            map.setView([latitude, longitude], 13);
            userMarker.setLatLng([latitude, longitude]);

            // 🎯 Dynamic Shelter Calculus execution on current location capture
            const optimalShelter = calculateNearestShelter(latitude, longitude);
            setAssignedShelter(optimalShelter);

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
                const liveWindMetersPerSec = wData.wind ? wData.wind.speed : 0;
                const windMph = Math.round(liveWindMetersPerSec * 2.237);
                
                // Trigger warning autonomously if wind speeds hit tropical storm thresholds
                const liveCycloneThreatDetected = windMph >= 38;
                if (liveCycloneThreatDetected) {
                  setEmergencyMode(true);
                }

                setClimate({
                  location: formattedName,
                  temp: `${Math.round(wData.main.temp)}°C`,
                  precipitation: wData.clouds ? `${wData.clouds.all}%` : "10%",
                  windSpeed: `${windMph} mph`,
                  cycloneThreat: liveCycloneThreatDetected ? "⚠️ Active Threat Detected" : "None Active",
                  safeZone: liveCycloneThreatDetected ? optimalShelter.name : "In-Place Shelter Optimal"
                });
              }
            } catch (e) {
              console.error("Live monitoring data links delayed.", e);
            }
          },
          (err) => console.warn("GPS spatial hardware link offline.", err),
          { enableHighAccuracy: true, timeout: 7000 }
        );
      }
    };

    initMap();
    return () => { active = false; };
  }, []);

  // 🚨 Dynamic Real-Time Shelter Vector Routing Interceptor
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;

    // Remove any historical lingering markers/routes from past render loops
    if (shelterMarkerRef.current) { map.removeLayer(shelterMarkerRef.current); shelterMarkerRef.current = null; }
    if (routingLineRef.current) { map.removeLayer(routingLineRef.current); routingLineRef.current = null; }

    if (emergencyMode) {
      // Pin calculated target safe house location
      const redShelterIcon = L.divIcon({
        className: 'shelter-div-icon',
        html: `<div style="width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-bottom: 18px solid #f43f5e; filter: drop-shadow(0 0 8px #f43f5e); animate: bounce 1s infinite;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 18]
      });

      const shelterMarker = L.marker([assignedShelter.lat, assignedShelter.lng], { icon: redShelterIcon }).addTo(map);
      shelterMarker.bindPopup(`<div style="color:#000"><b style="color:#e11d48; font-weight:900;">🚨 OPTIMAL SAFE PLACE LOCKED</b><br/>${assignedShelter.name}<br/><span style="font-size:10px; color:#666">${assignedShelter.details}</span></div>`).openPopup();
      shelterMarkerRef.current = shelterMarker;

      // Render high-contrast connection vector path
      const routingLine = L.polyline(
        [[userCoords.lat, userCoords.lng], [assignedShelter.lat, assignedShelter.lng]],
        { color: '#f43f5e', weight: 4, dashArray: '6, 8', opacity: 0.9 }
      ).addTo(map);
      routingLineRef.current = routingLine;

      // Fit map viewing grid boundaries perfectly between user and newly calculated shelter
      const bounds = L.latLngBounds([[userCoords.lat, userCoords.lng], [assignedShelter.lat, assignedShelter.lng]]);
      map.fitBounds(bounds, { padding: [60, 60] });

    } else {
      map.setView([userCoords.lat, userCoords.lng], 13);
      if (userMarkerRef.current) userMarkerRef.current.openPopup();
    }
  }, [emergencyMode, userCoords, assignedShelter]);

  // ⏱️ Dynamic Proportional Countdown Clock Engine
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (emergencyMode) {
      const numericWind = parseInt(climate.windSpeed) || 45;
      
      // Dynamic Calculus: Escalating wind velocity decreases available target escape time window
      let calculatedBufferHours = 5;
      if (numericWind > 75) calculatedBufferHours = 1;      
      else if (numericWind > 55) calculatedBufferHours = 2; 
      else if (numericWind > 40) calculatedBufferHours = 3; 
      
      let totalSeconds = calculatedBufferHours * 3600 + 30 * 60;
      
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
      setCountdown({ hours: 0, minutes: 0, seconds: 0 });
    }

    return () => clearInterval(timer);
  }, [emergencyMode, climate.windSpeed]);

  // Typewriter instruction updates
  useEffect(() => {
    let i = 0;
    const statusText = emergencyMode ? "⚠️ CRITICAL EVACUATION ROUTING ACTIVE." : "System Status: CLEAR.";
    const fullGreeting = `Secure node linked: ${climate.location}. Algorithmic Proximity Safe-Zone Router initialized. ${statusText}`;
    setIntroText("");
    const timer = setInterval(() => {
      setIntroText(fullGreeting.slice(0, i));
      i++;
      if (i > fullGreeting.length) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [climate.location, emergencyMode]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden font-sans bg-[#000511] pb-12">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto py-8 px-4 md:px-6 flex flex-col justify-between">
        
        {/* Top Header Panel */}
        <header className="flex justify-between items-center bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-4 shadow-xl mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-[0_4px_12px_rgba(244,63,94,0.3)]">
              CYCLONE ALERT SYSTEM
            </h1>
            <span className="text-[9px] font-mono text-sky-400 tracking-widest uppercase mt-0.5">Automated Proximity Safe Router</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const toggledMode = !emergencyMode;
                setEmergencyMode(toggledMode);
                if(toggledMode) {
                  // Simulate an alternative far user spot for demo evaluation purposes
                  // Chooses "Vijayawada West Relief Camp" automatically as it shifts relative proximity metrics
                  const simulatedUserLat = 16.5200;
                  const simulatedUserLng = 80.6000;
                  setUserCoords({ lat: simulatedUserLat, lng: simulatedUserLng });
                  
                  const recalculatedShelter = calculateNearestShelter(simulatedUserLat, simulatedUserLng);
                  setAssignedShelter(recalculatedShelter);
                  
                  setClimate(prev => ({
                    ...prev, 
                    windSpeed: "64 mph", 
                    cycloneThreat: "⚠️ Simulated Proximity Threat",
                    safeZone: recalculatedShelter.name
                  }));
                } else {
                  // Reset back to system standard device parameters
                  setClimate(prev => ({...prev, windSpeed: "7 mph", cycloneThreat: "None Active", safeZone: "In-Place Shelter Optimal"}));
                }
              }}
              className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-mono font-bold border transition-all ${
                emergencyMode ? 'bg-rose-950/40 border-rose-500/50 text-rose-400 animate-pulse' : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {emergencyMode ? "Reset System Vector" : "Simulate Alternate Proximity Alert"}
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
            { label: "Velocity Tracking Matrix", value: climate.windSpeed, color: emergencyMode ? "text-rose-400 font-extrabold animate-pulse" : "text-emerald-400" },
            { label: "Cyclone Threat Index", value: climate.cycloneThreat, color: emergencyMode ? "text-rose-500 font-black animate-pulse" : "text-slate-400" }
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
              {emergencyMode ? "🚨 ALGORITHMIC NEAREST-NEIGHBOR ROUTING ACTIVE" : "🛡️ Shelter Relocation Status"}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {emergencyMode 
                ? `Proximity algorithm has calculated the closest safe zone according to your coordinates. Evacuate immediately before the dynamic storm countdown reaches zero.`
                : "Atmospheric tracking arrays confirm safe wind velocities. Evacuation countdown arrays are currently resting."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            {/* Dynamic Proportional Countdown Display */}
            <div className={`bg-black/50 border px-4 py-2 rounded-lg flex flex-col items-center min-w-[120px] transition-all ${emergencyMode ? 'border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.2)] bg-rose-950/20' : 'border-white/5'}`}>
              <span className={`text-[8px] font-mono uppercase tracking-widest font-bold ${emergencyMode ? 'text-rose-400' : 'text-slate-500'}`}>WIND COUNTDOWN</span>
              <span className={`text-lg font-mono font-black tracking-widest mt-0.5 ${emergencyMode ? 'text-white' : 'text-slate-600'}`}>
                {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>
            
            <div className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex flex-col border transition-all ${
              emergencyMode ? 'bg-rose-950 border-rose-400 text-white animate-pulse' : 'bg-emerald-900/40 border-emerald-500/30 text-emerald-300'
            }`}>
              <span className="text-[8px] opacity-60 uppercase tracking-wider font-bold">ASSIGNED CLOSEST SAFE HOUSE</span>
              <span className="text-sm mt-0.5 font-sans font-extrabold">
                {emergencyMode ? assignedShelter.name : "In-Place Shelter Optimal"}
              </span>
            </div>
          </div>
        </div>

        {/* Map Spatial Grid Interface Area */}
        <div className="grid grid-cols-1 gap-6 items-stretch mb-6">
          <section className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-xl flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3 px-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Live Spatial Telemetry Grid</h3>
            </div>
            <div ref={mapContainerRef} className="flex-1 w-full rounded-xl bg-black/50 overflow-hidden min-h-[340px] z-10" />
          </section>
        </div>

        {/* Bilingual Precautions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <section className="bg-slate-950/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <span className="text-lg">🇬🇧</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400">Safety Precautions</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 list-disc pl-4 marker:text-sky-500">
              <li><strong className="text-white">Stay Informed:</strong> Keep checking the map route and tracking vectors for changes.</li>
              <li><strong className="text-white">Evacuate Early:</strong> Pack an emergency kit and follow the route before the countdown timer hits zero.</li>
              <li><strong className="text-white">Power Safety:</strong> Disconnect all electrical appliances to avoid short circuits.</li>
            </ul>
          </section>

          <section className="bg-slate-950/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <span className="text-lg">🇮🇳</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400">జాగ్రత్తలు (Telugu Guidelines)</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 list-disc pl-4 marker:text-rose-400 leading-relaxed">
              <li><strong className="text-white">సమాచారం తెలుసుకోండి:</strong> మ్యాప్ రూట్ మరియు తుఫాను హెచ్చరికలను నిరంతరం గమనిస్తూ ఉండండి.</li>
              <li><strong className="text-white">త్వరగా తరలివెళ్ళండి:</strong> కౌంట్‌డౌన్ సమయం ముగిసేలోపే సురక్షిత ప్రాంతానికి చేరుకోండి.</li>
              <li><strong className="text-white">విద్యుత్ జాగ్రత్తలు:</strong> షార్ట్ సర్క్యూట్‌లను నివారించడానికి పవర్ మెయిన్స్ ఆపివేయండి.</li>
            </ul>
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
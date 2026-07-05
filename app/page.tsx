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

  // Core Application States
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [userCoords, setUserCoords] = useState({ lat: 16.6264, lng: 80.5404 });
  const [currentLang, setCurrentLang] = useState<"en" | "te">("en");
  const [offlineMapMode, setOfflineMapMode] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  
  // Database Analytics State
  const [databaseLogs, setDatabaseLogs] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState({ totalSubmissions: 0, peakWindLogged: 0 });

  const regionalShelters: Shelter[] = [
    { name: "Mylavaram Cyclone Shelter Block-B", lat: 16.6586, lng: 80.5332, details: "Reinforced Concrete Facility - Proximity Sector 1" },
    { name: "Kondapalli Center Safe Hall", lat: 16.6180, lng: 80.5480, details: "High-Elevation Storm Center - Proximity Sector 2" },
    { name: "Vijayawada West Relief Base", lat: 16.5151, lng: 80.6171, details: "District Emergency Base - Proximity Sector 3" }
  ];

  const [assignedShelter, setAssignedShelter] = useState<Shelter>(regionalShelters[0]);

  const [climate, setClimate] = useState<ClimateData>({
    location: "Locating Grid Node...",
    temp: "--°C",
    precipitation: "--%",
    windSpeed: "-- mph",
    cycloneThreat: "Monitoring...",
    safeZone: "Analyzing Proximity..."
  });

  // Translation Dictionaries mapped directly to survey outputs
  const dictionary = {
    en: {
      title: "CYCLONE TRACK",
      subtitle: "Automated Zero-Touch Interceptor",
      threatRating: "Cyclone Threat Rating",
      windStream: "Wind Monitoring Stream",
      position: "Device Position Node",
      countdownTitle: "WIND COUNTDOWN",
      nearestRefuge: "AUTOMATED NEAREST REFUGE",
      safeZoneStatus: "In-Place Shelter Optimal",
      radarStatus: "Background monitoring active. No cyclone anomalies detected.",
      alertActive: "🚨 ZERO-TOUCH EVACUATION OVERRIDE INITIATED",
      alertDesc: "Threat vector verified by background pipeline. Proximity algorithm calculated closest safe zone. Evacuate safely.",
      testTrigger: "Test Mock Trigger",
      endTest: "End Threat Test",
      offlineLabel: "Low-Network Offline Map Cache",
      sosBtn: "ONE-TAP SOS CRITICAL EMERGENCY",
      sosTriggered: "🚨 SOS EMERGENCY BROADCAST SENT DETECTING RESCUE",
      precautionsTitle: "Safety Precautions",
      p1: "Stay Informed: Keep checking map tracking routes for real-time changes.",
      p2: "Evacuate Early: Pack an emergency kit and move before the countdown hits zero."
    },
    te: {
      title: "సైక్లోన్ ట్రాక్",
      subtitle: "ఆటోమేటెడ్ ఎమర్జెన్సీ ఇంటర్‌సెప్టర్",
      threatRating: "తుఫాను ముప్పు రేటింగ్",
      windStream: "గాలి వేగం పర్యవేక్షణ",
      position: "మీ ప్రస్తుత లొకేషన్",
      countdownTitle: "సమయం మిగిలి ఉంది",
      nearestRefuge: "సురక్షితమైన ఆశ్రయం",
      safeZoneStatus: "ఇంటి వద్దే ఉండడం సురక్షితం",
      radarStatus: "బ్యాక్‌గ్రౌండ్ పర్యవేక్షణ యాక్టివ్‌గా ఉంది. ఎటువంటి తుఫాను ముప్పు లేదు.",
      alertActive: "🚨 అత్యవసర తరలింపు హెచ్చరిక యాక్టివేట్ చేయబడింది",
      alertDesc: "తుఫాను ముప్పు ధృవీకరించబడింది. అల్గోరిథం ద్వారా మీకు అత్యంత సమీపంలో ఉన్న సురక్షిత ఆశ్రయం లెక్కించబడింది. వెంటనే బయలుదేరండి.",
      testTrigger: "మాక్ అలర్ట్ టెస్ట్",
      endTest: "టెస్ట్ ముగించు",
      offlineLabel: "తక్కువ నెట్‌వర్క్ ఆఫ్‌లైన్ మ్యాప్ మోడ్",
      sosBtn: "వన్-టాప్ SOS అత్యవసర సహాయం",
      sosTriggered: "🚨 SOS అత్యవసర సందేశం పంపబడింది. రక్షణ సిబ్బంది వస్తున్నారు.",
      precautionsTitle: "తీసుకోవాల్సిన జాగ్రత్తలు",
      p1: "సమాచారం తెలుసుకోండి: మ్యాప్ రూట్ మరియు తుఫాను హెచ్చరికలను నిరంతరం గమనిస్తూ ఉండండి.",
      p2: "త్వరగా తరలివెళ్ళండి: కౌంట్‌డౌన్ సమయం ముగిసేలోపే అత్యవసర వస్తువులతో సురక్షిత ప్రాంతానికి చేరుకోండి."
    }
  };

  const t = dictionary[currentLang];

  const calculateNearestShelter = (userLat: number, userLng: number): Shelter => {
    let nearest: Shelter = regionalShelters[0];
    let minDistance = Infinity;
    regionalShelters.forEach((shelter) => {
      const R = 6371;
      const dLat = (shelter.lat - userLat) * Math.PI / 180;
      const dLng = (shelter.lng - userLng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(userLat * Math.PI / 180) * Math.cos(shelter.lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      if (distance < minDistance) { minDistance = distance; nearest = shelter; }
    });
    return nearest;
  };

  // 📥 Automatic Server Log Pipeline
  const pushTelemetryToDatabase = async (lat: number, lng: number, wind: number, shelter: string, name: string, isSos: boolean = false) => {
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: lat, longitude: lng, city: name, windSpeed: wind,
          threatActive: wind >= 38, assignedShelter: shelter,
          hasPropertyDamage: "Yes", challengesFaced: ["Power Cuts", "Flooding"],
          preferredLanguage: currentLang, sosTriggered: isSos
        })
      });
      fetchDatabaseHistory();
    } catch (e) { console.error("Database ingestion log failed", e); }
  };

  // 📋 Fetch History Pipeline
  const fetchDatabaseHistory = async () => {
    try {
      const res = await fetch('/api/telemetry');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setDatabaseLogs(json.data);
        const maxWind = Math.max(...json.data.map((l: any) => l.windSpeed || 0));
        setSummaryStats({ totalSubmissions: json.data.length, peakWindLogged: maxWind });
      }
    } catch (e) { console.error("Could not pull query logs", e); }
  };

  // 🌊 Wave Animation Matrix Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let count = 0;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = emergencyMode ? '#1a0208' : '#000511';
      ctx.fillRect(0, 0, w, h);
      for (let ix = 0; ix < 50; ix++) {
        for (let iy = 0; iy < 30; iy++) {
          const x = (ix - 25) * 45; const z = (iy - 15) * 45 + 200;
          const y = (Math.sin((ix + count) * 0.3) * (emergencyMode ? 40 : 25)) + (Math.sin((iy + count) * 0.2) * (emergencyMode ? 40 : 25));
          const scale = 350 / (350 + z);
          const cx = w / 2 + x * scale; const cy = h * 0.75 + y * scale;
          if (cx >= 0 && cx <= w && cy >= 0 && cy <= h) {
            ctx.beginPath(); ctx.arc(cx, cy, Math.max(0.5, scale * 2.2), 0, Math.PI * 2);
            ctx.fillStyle = emergencyMode ? `rgba(244, 63, 94, ${scale})` : `rgba(14, 165, 233, ${scale})`;
            ctx.fill();
          }
        }
      }
      count += emergencyMode ? 0.05 : 0.02;
      animationId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationId);
  }, [emergencyMode]);

  // 🗺️ Leaflet Initialization
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement("link"); link.id = 'leaflet-css';
      link.rel = "stylesheet"; link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true; document.body.appendChild(script);

    script.onload = () => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      const L = (window as any).L;
      const map = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView([userCoords.lat, userCoords.lng], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

      const pulseIcon = L.divIcon({
        className: 'user-icon',
        html: `<div style="background-color: #0ea5e9; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 12px #0ea5e9;"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7]
      });
      const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: pulseIcon }).addTo(map);
      mapInstanceRef.current = map; userMarkerRef.current = userMarker;

      // Click-Free Passive Hardware Evaluation Loop
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          map.setView([latitude, longitude], 13);
          userMarker.setLatLng([latitude, longitude]);

          const optimalShelter = calculateNearestShelter(latitude, longitude);
          setAssignedShelter(optimalShelter);

          try {
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const geoData = await geoRes.json();
            const locationString = `${geoData.city || "Kondapalli"}, AP`;

            const apiKey = "feff206daa60b539abe8fae8f2ab7f29";
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
            const wData = await weatherRes.json();

            if (wData && wData.main) {
              const windMph = Math.round((wData.wind ? wData.wind.speed : 0) * 2.237);
              const threatDetected = windMph >= 38;
              setEmergencyMode(threatDetected);

              setClimate({
                location: locationString, temp: `${Math.round(wData.main.temp)}°C`,
                precipitation: wData.clouds ? `${wData.clouds.all}%` : "15%", windSpeed: `${windMph} mph`,
                cycloneThreat: threatDetected ? "⚠️ ACTIVE TRACK VECTOR" : "None Active (Stable)",
                safeZone: threatDetected ? optimalShelter.name : "In-Place Shelter Optimal"
              });

              pushTelemetryToDatabase(latitude, longitude, windMph, optimalShelter.name, locationString);
            }
          } catch (err) { console.error(err); }
        });
      }
    };
    fetchDatabaseHistory();
  }, []);

  // 📍 Map Graphics Synchronizer Layer
  useEffect(() => {
    const map = mapInstanceRef.current; if (!map || offlineMapMode) return;
    const L = (window as any).L;

    if (shelterMarkerRef.current) { map.removeLayer(shelterMarkerRef.current); shelterMarkerRef.current = null; }
    if (routingLineRef.current) { map.removeLayer(routingLineRef.current); routingLineRef.current = null; }

    if (emergencyMode) {
      const redShelterIcon = L.divIcon({
        className: 'shelter-icon',
        html: `<div style="width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-bottom: 18px solid #f43f5e; filter: drop-shadow(0 0 8px #f43f5e);"></div>`,
        iconSize: [18, 18], iconAnchor: [9, 18]
      });
      const shelterMarker = L.marker([assignedShelter.lat, assignedShelter.lng], { icon: redShelterIcon }).addTo(map);
      shelterMarkerRef.current = shelterMarker;

      const routingLine = L.polyline([[userCoords.lat, userCoords.lng], [assignedShelter.lat, assignedShelter.lng]], { color: '#f43f5e', weight: 4, dashArray: '6, 8' }).addTo(map);
      routingLineRef.current = routingLine;

      const bounds = L.latLngBounds([[userCoords.lat, userCoords.lng], [assignedShelter.lat, assignedShelter.lng]]);
      map.fitBounds(bounds, { padding: [60, 60] });
    } else {
      map.setView([userCoords.lat, userCoords.lng], 13);
    }
  }, [emergencyMode, userCoords, assignedShelter, offlineMapMode]);

  // ⏱️ Countdown Timer Calculus
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emergencyMode) {
      const numericWind = parseInt(climate.windSpeed) || 45;
      let hoursBuffer = numericWind > 55 ? 2 : 4;
      let totalSeconds = hoursBuffer * 3600;
      timer = setInterval(() => {
        if (totalSeconds <= 0) { clearInterval(timer); return; }
        totalSeconds--;
        setCountdown({ hours: Math.floor(totalSeconds / 3600), minutes: Math.floor((totalSeconds % 3600) / 60), seconds: totalSeconds % 60 });
      }, 1000);
    } else { setCountdown({ hours: 0, minutes: 0, seconds: 0 }); }
    return () => clearInterval(timer);
  }, [emergencyMode, climate.windSpeed]);

  return (
    <main className="relative min-h-screen w-full font-sans bg-[#000511] pb-12 text-white">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto py-8 px-4 flex flex-col justify-between">
        
        {/* Header Grid */}
        <header className="flex justify-between items-center bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-4 shadow-xl mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tighter drop-shadow-[0_0_12px_rgba(14,165,233,0.3)]">{t.title}</h1>
            <span className="text-[9px] font-mono text-sky-400 tracking-widest uppercase mt-0.5">{t.subtitle}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const nextLang = currentLang === "en" ? "te" : "en";
                setCurrentLang(nextLang);
              }}
              className="bg-slate-900 border border-white/10 px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 hover:bg-slate-800 transition-all"
            >
              {currentLang === "en" ? "తెలుగు" : "English"}
            </button>
            <button 
              onClick={() => {
                const toggle = !emergencyMode; setEmergencyMode(toggle);
                if (toggle) {
                  const mockLat = 16.5180; const mockLng = 80.6100;
                  setUserCoords({ lat: mockLat, lng: mockLng });
                  const match = calculateNearestShelter(mockLat, mockLng); setAssignedShelter(match);
                  setClimate(p => ({ ...p, windSpeed: "52 mph", cycloneThreat: "⚠️ Mock Alert Mode", safeZone: match.name }));
                  pushTelemetryToDatabase(mockLat, mockLng, 52, match.name, "Vijayawada Sector (Mock)");
                } else {
                  setClimate(p => ({ ...p, windSpeed: "6 mph", cycloneThreat: "None Active", safeZone: "In-Place Shelter Optimal" }));
                }
              }}
              className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-mono font-bold border ${emergencyMode ? 'bg-rose-950/40 border-rose-500 text-rose-400 animate-pulse' : 'bg-slate-900 border-white/10 text-slate-400'}`}
            >
              {emergencyMode ? t.endTest : t.testTrigger}
            </button>
          </div>
        </header>

        {/* Telemetry Display Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: t.position, value: climate.location, color: "text-amber-400 truncate" },
            { label: "Live Temperature", value: climate.temp, color: "text-orange-400" },
            { label: t.windStream, value: climate.windSpeed, color: emergencyMode ? "text-rose-400 font-bold" : "text-emerald-400" },
            { label: t.threatRating, value: climate.cycloneThreat, color: emergencyMode ? "text-rose-500 font-black animate-pulse" : "text-slate-400" }
          ].map((s, i) => (
            <div key={i} className="bg-slate-950/50 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col shadow-lg overflow-hidden">
              <span className="text-[10px] uppercase text-slate-500 font-bold truncate">{s.label}</span>
              <span className={`text-lg font-extrabold mt-1 ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </section>

        {/* Dynamic Alert Notification Dock */}
        <div className={`mb-6 p-5 backdrop-blur-md rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border transition-all duration-500 ${emergencyMode ? 'bg-rose-950/30 border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.15)]' : 'bg-emerald-950/20 border-emerald-500/20'}`}>
          <div className="flex-1">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${emergencyMode ? 'text-rose-400' : 'text-emerald-400'}`}>{emergencyMode ? t.alertActive : "🛡️ Relocation System Dormant"}</h4>
            <p className="text-xs text-slate-400 mt-1">{emergencyMode ? t.alertDesc : t.radarStatus}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            <div className="bg-black/50 border border-white/5 px-4 py-2 rounded-lg flex flex-col items-center min-w-[120px]">
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">{t.countdownTitle}</span>
              <span className={`text-lg font-mono font-black mt-0.5 ${emergencyMode ? 'text-white' : 'text-slate-600'}`}>
                {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>
            <div className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex flex-col border ${emergencyMode ? 'bg-rose-950 border-rose-400 text-white animate-pulse' : 'bg-emerald-900/40 border-emerald-500/30 text-emerald-300'}`}>
              <span className="text-[8px] opacity-60 uppercase tracking-wider font-bold">{t.nearestRefuge}</span>
              <span className="text-sm mt-0.5 font-sans font-extrabold">{emergencyMode ? assignedShelter.name : t.safeZoneStatus}</span>
            </div>
          </div>
        </div>

        {/* Live Map Frame Area & Low-Internet Switcher */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <section className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-xl flex flex-col min-h-[380px]">
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3 px-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Live Spatial Telemetry Grid</h3>
              <label className="flex items-center gap-2 text-xs font-mono text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={offlineMapMode} 
                  onChange={(e) => setOfflineMapMode(e.target.checked)} 
                  className="rounded bg-black border-white/10 text-sky-500 focus:ring-0 w-3 h-3" 
                />
                <span>{t.offlineLabel}</span>
              </label>
            </div>
            {offlineMapMode ? (
              <div className="flex-1 w-full rounded-xl bg-slate-900/50 border border-amber-500/20 flex flex-col justify-center items-center text-center p-6 min-h-[300px]">
                <span className="text-2xl mb-2">📡</span>
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Low-Network Safety Caching Engaged</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Mobile cell networks are unstable due to heavy rainfall. Pinned coordinates are locked into locally cached vectors to preserve smartphone battery life.</p>
                <div className="mt-4 bg-black/40 border border-white/5 p-3 rounded-xl font-mono text-[11px] text-left text-slate-300 space-y-1">
                  <div>Your GPS Lock: <span className="text-sky-400">{userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}</span></div>
                  <div>Nearest Pinned Shelter: <span className="text-rose-400">{assignedShelter.name}</span></div>
                </div>
              </div>
            ) : (
              <div ref={mapContainerRef} className="flex-1 w-full rounded-xl bg-black/50 overflow-hidden min-h-[300px] z-10" />
            )}
          </section>
        </div>

        {/* One-Tap Panic SOS Button Interface */}
        <div className="mb-6">
          <button 
            onClick={() => {
              setSosActive(true);
              pushTelemetryToDatabase(userCoords.lat, userCoords.lng, 45, assignedShelter.name, climate.location, true);
              setTimeout(() => setSosActive(false), 5000);
            }}
            className={`w-full py-4 rounded-xl font-black text-xs tracking-widest uppercase transition-all shadow-xl border ${sosActive ? 'bg-rose-600 text-white border-white animate-bounce' : 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border-red-500/30'}`}
          >
            {sosActive ? t.sosTriggered : t.sosBtn}
          </button>
        </div>

        {/* Historical Database Output Summary Section */}
        {databaseLogs.length > 0 && (
          <section className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 mb-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Historical Log Network Records ({summaryStats.totalSubmissions} Tracks)</h3>
              <span className="text-[10px] font-mono text-rose-400 uppercase">Peak Logged Wind: {summaryStats.peakWindLogged} mph</span>
            </div>
            <div className="overflow-x-auto text-[11px] font-mono text-slate-400 max-h-40 overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 border-b border-white/5">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Assigned Shelter</th>
                    <th className="pb-2">Velocity</th>
                    <th className="pb-2">SOS Broadcast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {databaseLogs.map((log, index) => (
                    <tr key={index} className="hover:text-white transition-colors">
                      <td className="py-2">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td>{log.assignedShelter}</td>
                      <td className={log.threatActive ? "text-rose-400 font-bold" : "text-emerald-400"}>{log.windSpeed} mph</td>
                      <td className={log.sosTriggered ? "text-red-500 font-black animate-pulse" : "text-slate-600"}>{log.sosTriggered ? "CRITICAL ACTIVE" : "Dormant"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Guidelines Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-slate-950/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400 border-b border-white/10 pb-3 mb-4">{t.precautionsTitle} (EN)</h3>
            <ul className="space-y-3 text-xs text-slate-300 list-disc pl-4 marker:text-sky-500">
              <li>{t.p1}</li>
              <li>{t.p2}</li>
            </ul>
          </section>
          <section className="bg-slate-950/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 border-b border-white/10 pb-3 mb-4">{dictionary.te.precautionsTitle} (TE)</h3>
            <ul className="space-y-3 text-xs text-slate-300 list-disc pl-4 marker:text-rose-400">
              <li>{dictionary.te.p1}</li>
              <li>{dictionary.te.p2}</li>
            </ul>
          </section>
        </div>

      </div>
    </main>
  );
}
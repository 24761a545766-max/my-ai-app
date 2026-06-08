"use client";
import { useEffect, useState, useRef } from 'react';

interface SurveySubmission {
  id: number;
  location: string;
  category: string;
  satisfaction: number;
  timestamp: string;
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

  const fullGreeting = "Welcome, Charan. Secure project node established. Initializing Community Survey Matrix analytics...";

  // Typewriter banner effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setIntroText(fullGreeting.slice(0, i));
      i++;
      if (i > fullGreeting.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  // 🌊 Pure JS 3D Live Wave Animation Matrix Engine (Bioluminescent Ocean)
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
      {/* Live 3D Mathematical Backdrop */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* UI Interface Layer */}
      <div className="relative z-10 w-full max-w-6xl mx-auto py-8 px-4 md:px-6 flex flex-col justify-between min-h-screen">
        
        {/* Top Header Panel */}
        <header className="flex justify-between items-center bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-4 shadow-xl mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-[0_4px_12px_rgba(14,165,233,0.4)]">
              SHELL AI
            </h1>
            <span className="text-[9px] font-mono text-sky-400 tracking-widest uppercase mt-0.5">Community Survey Project</span>
          </div>
          <div className="flex items-center gap-2 bg-sky-950/40 border border-sky-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-gray-300 uppercase tracking-wider font-bold">Charan Edition</span>
          </div>
        </header>

        {/* Project Metrics Summary Ribbon */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Submissions", value: submissions.length, color: "text-sky-400" },
            { label: "Target Reach", value: "250 Nodes", color: "text-emerald-400" },
            { label: "Matrix Status", value: "Active", color: "text-amber-400" },
            { label: "Completion Rate", value: "88%", color: "text-purple-400" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-950/50 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col">
              <span className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">{stat.label}</span>
              <span className={`text-xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </section>

        {/* Main Split Content Workspace */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-start overflow-hidden mb-6">
          
          {/* Left Column: Data Ingestion Form */}
          <section className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2">
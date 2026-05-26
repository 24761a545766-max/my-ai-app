"use client";
import { useEffect, useState, useRef } from 'react';

interface Message {
  sender: 'user' | 'shell';
  text: string;
  timestamp: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [introText, setIntroText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fullGreeting = "Welcome, Charan. Secure terminal established. The deep marine network is online. How shall we query the tides today?";

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

  // Auto-scroll chat window to the absolute newest message payload
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const cy = height * 0.75; // Push matrix horizon lower for clean text space

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const x3d = (ix - AMOUNTX / 2) * SEPARATION;
          const z3d = (iy - AMOUNTY / 2) * SEPARATION + 200; 
          const y3d = (Math.sin((ix + count) * 0.2) * 30) + (Math.sin((iy + count) * 0.3) * 30);

          const scale = fov / (fov + z3d);
          const x2d = cx + x3d * scale;
          const y2d = cy + y3d * scale;

          if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
            const alpha = Math.max(0.08, scale * 0.9);
            const size = Math.max(0.5, scale * 3.0);

            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 150, 255, ${alpha})`;
            ctx.fill();
          }
        }
      }

      count += 0.03; 
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Chat Processing Logic
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 1. Capture User Input Payload
    const userMessage: Message = {
      sender: 'user',
      text: query,
      timestamp: timeString
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = query.toLowerCase();
    setQuery("");

    // 2. Generate Automated Core AI Responses (Simulated Shell Brain)
    setTimeout(() => {
      let replyText = "Query registered in depths. Matrix data processing ongoing.";
      
      if (userQuery.includes("hello") || userQuery.includes("hi")) {
        replyText = "Greetings, Charan. System status optimal. Standing by for specific core directives.";
      } else if (userQuery.includes("status") || userQuery.includes("system")) {
        replyText = "All sentinel node links are stable. Encryption: SSL Layer Active. Core: 3D Mathematical Wave Mesh operational.";
      } else if (userQuery.includes("clear")) {
        setMessages([]);
        return;
      } else if (userQuery.includes("help")) {
        replyText = "Available commands: 'status' (check node health), 'clear' (purge current chat array logs).";
      }

      const shellResponse: Message = {
        sender: 'shell',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, shellResponse]);
    }, 750);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans bg-[#000511]">
      {/* 🔮 Live 3D Particle Render Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* 🐚 Chat UI Interface Layer */}
      <div className="relative z-10 flex flex-col justify-between h-screen w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
        
        {/* Top Header Interface */}
        <header className="flex justify-between items-center bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-4 shadow-xl">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-[0_4px_12px_rgba(0,150,255,0.3)]">
              SHELL AI
            </h1>
            <span className="text-[9px] font-mono text-blue-400 tracking-widest uppercase mt-0.5">Ethical Sentinel System</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-950/40 border border-blue-500/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-gray-300 uppercase tracking-wider font-bold">Charan Edition</span>
          </div>
        </header>

        {/* Center Chat Log Stream Frame */}
        <section className="flex-1 my-6 overflow-y-auto pr-2 space-y-4 rounded-2xl bg-black/10 backdrop-blur-sm p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-80 transition-all duration-500 mt-20">
              <img src="/shell.png" alt="AI Shell" className="w-32 md:w-44 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] mb-6 animate-pulse" />
              <p className="text-blue-200 text-sm italic font-light max-w-md px-6 leading-relaxed">
                {introText}
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                } animate-slideUp`}
              >
                <div
                  className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg font-medium border ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 border-blue-400 text-white rounded-br-none shadow-blue-900/10'
                      : 'bg-slate-900/80 border-white/10 text-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </section>

        {/* Input Interactive Command Dock */}
        <footer className="w-full">
          <form onSubmit={handleSendMessage} className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Inject statement into matrix stream..." 
              className="w-full bg-slate-950/60 backdrop-blur-2xl border border-white/10 rounded-full py-4 px-6 pr-16 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all shadow-2xl text-base font-medium"
            />
            <button 
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-full transition-all shadow-md active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
          <div className="flex justify-center gap-4 mt-3 text-[9px] text-slate-600 uppercase tracking-widest font-mono font-bold">
             <span>Secure Shell Core</span> • <span>State: Listening</span> • <span>No Dependency Build</span>
          </div>
        </footer>

      </div>
    </main>
  );
}
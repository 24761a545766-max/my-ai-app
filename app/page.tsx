"use client";
import { useEffect, useState } from 'react';

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
    code: `plt.pie(continent_totals, labels=continent_totals.index, autopct='%1.1f%%', startangle=140)\n# Explode Africa slice\nexplode = [0.1 if c == 'Africa' else 0 for c in continent_totals.index]\nplt.pie(continent_totals, explode=explode, autopct='%1.1f%%') [cite: 133, 139]`
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

  const fullGreeting = "Welcome, Charan. I am SHELL AI. Accessing IDS Lab Records...";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setIntroText(fullGreeting.slice(0, i));
      i++;
      if (i > fullGreeting.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans bg-black">
      {/* 🌊 Animated Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="absolute min-w-full min-h-full object-cover opacity-60">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-beach-with-waves-at-sunset-40250-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen py-10 px-6">
        {/* Header */}
        <div className="text-center animate-fadeIn">
          <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">SHELL AI</h1>
          <button 
            onClick={() => setShowLab(!showLab)}
            className="mt-4 px-4 py-1 border border-orange-500/50 text-orange-400 text-[10px] uppercase tracking-widest rounded-full hover:bg-orange-500 hover:text-white transition-all"
          >
            {showLab ? "Close Records" : "Open Lab Records"}
          </button>
        </div>

        {/* Content Section */}
        {!showLab ? (
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
              <img src="/shell.png" className="relative w-40 md:w-64 drop-shadow-2xl transition-transform group-hover:scale-110" />
            </div>
            <p className="text-white text-lg italic font-light max-w-lg">{introText}</p>
          </div>
        ) : (
          <div className="w-full max-w-5xl bg-black/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 flex flex-col md:flex-row gap-8 animate-slideUp">
            <nav className="w-full md:w-48 space-y-2">
              {labData.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold uppercase tracking-tighter transition-all ${activeTab.id === item.id ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{activeTab.name}</h3>
              <p className="text-sm text-gray-400 mb-6 border-l-2 border-orange-600 pl-4">{activeTab.detail}</p>
              <pre className="bg-black/80 p-6 rounded-2xl text-blue-300 font-mono text-xs overflow-x-auto border border-white/5 whitespace-pre">
                <code>{activeTab.code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="w-full max-w-2xl">
          <form className="relative group">
            <input 
              type="text" 
              placeholder="Ask the depths..." 
              className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full py-4 px-8 text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
            />
          </form>
          <div className="flex justify-center gap-4 mt-4 text-[10px] text-white/40 uppercase tracking-widest">
             <span>Secure</span> • <span>Charan Edition</span> • <span>Week 12 Ready</span>
          </div>
        </div>
      </div>
    </main>
  );
}
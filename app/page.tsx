"use client";
import { useState, useEffect } from 'react';

const labData = [
  // ... Week 10 & 11 remain same
  {
    week: "Week 12",
    title: "Matplotlib Visualizations",
    description: "Creating static, animated, and interactive visualizations built on NumPy[cite: 9, 10]. Includes bar charts, pie charts, scatter plots, and more.",
    methods: [
      { name: "a. Bar Graph", detail: "Displays categorical data using rectangular bars proportional to values. Can be vertical or horizontal (barh)[cite: 13, 55]." },
      { name: "b. Pie Chart", detail: "Circular chart showing proportions or percentages[cite: 86]. Uses pie() where slices represent parts of a whole[cite: 87]." },
      { name: "c. Box Plot", detail: "Displays minimum, maximum, median, and quartiles. Essential for spotting outliers and variability[cite: 158, 187]." },
      { name: "d. Histogram", detail: "Shows data distribution by grouping values into bins[cite: 214]. X-axis shows bins, Y-axis shows frequency[cite: 215]." },
      { name: "e. Line Chart", detail: "Basic plot representing relationships between X and Y variables[cite: 260, 261]." },
      { name: "f. Scatter Plot", detail: "Used to observe correlation between two specific variables[cite: 292]." },
      { name: "Heat Map", detail: "Graphical representation where values are shown as colors to visualize intensity[cite: 332, 333]." },
      { name: "Subplots", detail: "Adds multiple plots to a grid position (Rows, Cols, Index) within one figure[cite: 366, 367]." }
    ],
    code: `# Create 2x2 grid of subplots for multi-perspective visualization [cite: 368]
import pandas as pd
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Line Chart: Total Immigration [cite: 385]
axes[0, 0].plot(years_int, total_immigrants, marker='o', color='blue')
axes[0, 0].set_title("Line Chart: Total Immigration (1980–2014)")

# 2. Scatter Plot: Total Immigration [cite: 391]
axes[0, 1].scatter(years_int, total_immigrants, color='green', s=80)
axes[0, 1].set_title("Scatter Plot: Total Immigration (1980–2014)")

# 3. Histogram: 2013 Distribution [cite: 397]
axes[1, 0].hist(immigrants_2013, bins=20, color='orange')
axes[1, 0].set_title("Histogram: Immigration Distribution (2013)")

# 4. Pie Chart: Top 5 Countries [cite: 403]
axes[1, 1].pie(top5_2013['2013'], labels=top5_2013['Country'], autopct='%1.1f%%')
axes[1, 1].set_title("Pie Chart: Top 5 Countries (2013)")

plt.tight_layout()
plt.show()`
  },
  {
    week: "Week 13",
    title: "NLTK: Text Processing",
    description: "Natural Language Toolkit for processing human language data[cite: 472].",
    methods: [
      { name: "Tokenization", detail: "Dividing continuous text into individual sentences or words[cite: 492, 501]." },
      { name: "Stopword Removal", detail: "Filtering out common words (the, is, a) that carry minimal semantic info[cite: 509]." },
      { name: "Stemming", detail: "Reducing inflected words to their root form (e.g., 'playing' to 'play')[cite: 518]." }
    ],
    code: `from nltk.tokenize import word_tokenize\nfrom nltk.stem import PorterStemmer\n\nps = PorterStemmer()\nwords = ["playing", "played", "plays"]\nstemmed = [ps.stem(w) for w in words]\nprint(stemmed) # ['play', 'play', 'play']`
  }
];

export default function IDSLabExplorer() {
  const [activeTab, setActiveTab] = useState(labData[2]); // Default to Week 12
  const [introText, setIntroText] = useState("");

  useEffect(() => {
    let i = 0;
    const fullIntro = "Nandhu's IDS Lab Portfolio Loading...";
    const timer = setInterval(() => {
      setIntroText(fullIntro.slice(0, i));
      i++;
      if (i > fullIntro.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex min-h-screen bg-[#050505] text-gray-200 font-sans">
      {/* Sidebar */}
      <nav className="w-80 bg-[#0f0f0f] border-r border-gray-800 p-8 flex flex-col">
        <div className="mb-12">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">IDS Lab</h1>
          <p className="text-blue-500 text-[10px] font-mono mt-1 tracking-widest">{introText}</p>
        </div>
        
        <div className="space-y-3 flex-1">
          {labData.map((lab) => (
            <button
              key={lab.week}
              onClick={() => setActiveTab(lab)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border ${
                activeTab.week === lab.week 
                ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-900/20' 
                : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600'
              }`}
            >
              <span className="text-[10px] uppercase tracking-widest block opacity-70 mb-1">{lab.week}</span>
              <span className="font-bold">{lab.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <section className="flex-1 p-16 overflow-y-auto bg-[radial-gradient(circle_at_top_right,#111,transparent)]">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">{activeTab.title}</h2>
            <p className="text-lg text-gray-400 leading-relaxed italic border-l-4 border-blue-600 pl-6">
              {activeTab.description}
            </p>
          </header>

          {/* Visualization Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {activeTab.methods.map((m, i) => (
              <div key={i} className="p-5 bg-[#111] rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all group">
                <h4 className="text-blue-400 font-bold text-sm mb-2 group-hover:text-blue-300">{m.name}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>

          {/* Subplot Code Comparison */}
          <div className="rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
            <div className="bg-[#1a1a1a] px-6 py-3 flex justify-between items-center border-b border-gray-800">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Matplotlib_Subplots.py</span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>
            <pre className="bg-[#000] p-8 font-mono text-xs leading-relaxed text-blue-300 overflow-x-auto">
              <code>{activeTab.code}</code>
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
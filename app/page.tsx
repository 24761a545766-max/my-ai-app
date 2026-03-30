"use client";
import { useState, useEffect } from 'react';

const labData = [
  {
    week: "Week 12",
    title: "Matplotlib Visualizations",
    description: "Perform various visualizations using matplotlib to analyze Canadian immigration data[cite: 2].",
    charts: [
      {
        id: "bar",
        name: "a. Bar Graph",
        detail: "Bar chart displays categorical data using rectangular bars whose lengths are proportional to the values they represent[cite: 12]. It can be plotted vertically or horizontally to compare categories[cite: 13].",
        code: `import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Select India's data from dataset\ndf_india = df_canada.loc['India', years]\n\nplt.figure(figsize=(12, 6))\ndf_india.plot(kind='bar', color='skyblue', edgecolor='black')\nplt.title("India Immigrants to Canada (1980–2014)")\nplt.show()\n\n# Note: kind='barh' represents bars horizontally[cite: 55].`
      },
      {
        id: "pie",
        name: "b. Pie Chart",
        detail: "A circular chart used to show data as proportions or percentages[cite: 86]. Each slice (wedge) represents a part of the whole[cite: 87].",
        code: `continent_totals = df_continent.sum(axis=1)\n\nplt.figure(figsize=(10, 6))\nplt.pie(continent_totals, labels=continent_totals.index, autopct='%1.1f%%', startangle=140)\n\n# Explode a slice (e.g., Africa)\nexplode = [0.1 if c == 'Africa' else 0 for c in continent_totals.index]\nplt.pie(continent_totals, explode=explode, autopct='%1.1f%%') [cite: 133, 139]`
      },
      {
        id: "box",
        name: "c. Box Plot",
        detail: "Shows how data is spread out, displaying the minimum, maximum, median, and quartiles[cite: 157, 158]. It also helps spot outliers easily[cite: 158].",
        code: `df_japan = df_canada.loc[df_canada['Country'] == 'Japan', years].squeeze()\n\nplt.boxplot(df_japan.values, vert=True, patch_artist=True, \n            boxprops=dict(facecolor='lightblue', color='blue'),\n            medianprops=dict(color='red', linewidth=2)) [cite: 167, 171]`
      },
      {
        id: "hist",
        name: "d. Histogram",
        detail: "Shows the distribution of data by grouping values into bins[cite: 214]. The X-axis shows bins and Y-axis shows frequencies[cite: 215].",
        code: `import numpy as np\ncount, bin_edges = np.histogram(df_canada['2013'])\n\ndf_canada['2013'].plot(kind='hist', bins=bin_edges, rwidth=0.8, color='skyblue') [cite: 223, 225]`
      },
      {
        id: "line",
        name: "e. Line Chart",
        detail: "Used to represent a relationship between two data points X and Y on different axes[cite: 260, 261].",
        code: `haiti_data = df_canada.loc[df_canada['Country'] == 'Haiti', years].squeeze()\nhaiti_data.plot(kind='line', marker='o', color='blue') [cite: 266, 274]`
      },
      {
        id: "scatter",
        name: "f. Scatter Plot",
        detail: "Used to observe the correlation between two variables[cite: 292].",
        code: `total_immigrants = df_canada[years].sum(axis=0)\nyears_int = list(map(int, years))\n\nplt.scatter(years_int, total_immigrants, color='blue', s=80) [cite: 297, 301]`
      },
      {
        id: "heatmap",
        name: "Heat Map",
        detail: "A graphical representation where values are shown as colors to visualize patterns or intensity[cite: 332, 333].",
        code: `import seaborn as sns\ndf_first10 = df_canada.head(10).set_index('Country')[years]\n\nsns.heatmap(df_first10, cmap="YlGnBu", annot=True, fmt=".0f") [cite: 339, 342]`
      },
      {
        id: "subplots",
        name: "Subplots",
        detail: "The subplot() method adds a plot to a grid position (rows, columns, index) within the current figure[cite: 366, 367].",
        code: `fig, axes = plt.subplots(2, 2, figsize=(14, 10))\n\naxes[0, 0].plot(years_int, total_immigrants) # Line\naxes[0, 1].scatter(years_int, total_immigrants) # Scatter\naxes[1, 0].hist(immigrants_2013, bins=20) # Histogram\naxes[1, 1].pie(top5_2013['2013'], labels=top5_2013['Country']) # Pie [cite: 384, 403]`
      }
    ]
  }
];

export default function IDSLabExplorer() {
  const [activeChart, setActiveChart] = useState(labData[0].charts[0]);
  const [introText, setIntroText] = useState("");

  useEffect(() => {
    let i = 0;
    const fullIntro = "Nandhu's Visualization Lab Loading...";
    const timer = setInterval(() => {
      setIntroText(fullIntro.slice(0, i));
      i++;
      if (i > fullIntro.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      {/* Sidebar Navigation */}
      <nav className="w-80 bg-[#111] border-r border-gray-800 p-8 flex flex-col sticky top-0 h-screen">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Week 12</h1>
          <p className="text-blue-500 text-[10px] font-mono mt-1 tracking-widest">{introText}</p>
        </div>
        
        <div className="space-y-2 flex-1 overflow-y-auto">
          {labData[0].charts.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-300 border ${
                activeChart.id === chart.id 
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600'
              }`}
            >
              <span className="font-bold text-sm">{chart.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <section className="flex-1 p-16 bg-[radial-gradient(circle_at_top_right,#111,transparent)]">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h2 className="text-5xl font-extrabold text-white mb-4 tracking-tight">{activeChart.name}</h2>
            <p className="text-lg text-gray-400 leading-relaxed pl-4 border-l-4 border-blue-600">
              {activeChart.detail}
            </p>
          </header>

          {/* Visual Diagram Placeholder */}
          <div className="mb-10 rounded-3xl overflow-hidden border border-gray-800 bg-[#161616] p-4">
             <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-800 rounded-2xl text-gray-600 text-sm italic">
                 || activeChart.name}]
             </div>
          </div>

          {/* Code Playground */}
          <div className="rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
            <div className="bg-[#1a1a1a] px-6 py-3 flex justify-between items-center border-b border-gray-800">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Matplotlib_Lab.py</span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>
            <pre className="bg-[#000] p-8 font-mono text-xs leading-relaxed text-blue-300 overflow-x-auto whitespace-pre-wrap">
              <code>{activeChart.code}</code>
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
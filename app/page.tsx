"use client";
import { useState, useEffect } from 'react';

const labData = [
  {
    week: "Week 12",
    title: "Matplotlib Visualizations",
    description: "Matplotlib is a Python library used for creating static, animated, and interactive data visualizations. It is built on top of NumPy and handles large datasets to produce publication-quality figures.",
    charts: [
      {
        id: "bar",
        name: "a. Bar Graph",
        detail: "Displays categorical data using rectangular bars whose lengths are proportional to the values they represent. It can be plotted vertically or horizontally ('barh').",
        code: `import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Load dataset and set index\ndf_canada = pd.read_csv("canadian_immigration_data1980-2024.csv")\ndf_canada.set_index('Country', inplace=True)\nyears = list(map(str, range(1980, 2015)))\n\n# Plot India's data\ndf_india = df_canada.loc['India', years]\nplt.figure(figsize=(12, 6))\ndf_india.plot(kind='bar', color='skyblue', edgecolor='black')\nplt.xlabel("Year")\nplt.ylabel("Number of Immigrants")\nplt.title("India Immigrants to Canada (1980–2014)")\nplt.xticks(rotation=45)\nplt.tight_layout()\nplt.show()`
      },
      {
        id: "pie",
        name: "b. Pie Chart",
        detail: "A circular chart used to show data as proportions or percentages. Each slice (wedge) represents a part of the whole.",
        code: `import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Group by Continent and sum totals\nyears = list(map(str, range(1980, 2015)))\ncontinent_totals = df_canada.groupby("Continent")[years].sum().sum(axis=1)\n\n# Plot pie chart with 'Explode' for Africa\nexplode = [0.1 if c == 'Africa' else 0 for c in continent_totals.index]\nplt.figure(figsize=(10, 6))\nplt.pie(continent_totals, labels=continent_totals.index, autopct='%1.1f%%', \n        startangle=140, colors=plt.cm.Paired.colors, explode=explode)\nplt.title("Immigrants to Canada by Continent (1980–2014)", fontweight='bold')\nplt.show()`
      },
      {
        id: "box",
        name: "c. Box Plot",
        detail: "A simple graph showing how data is spread out, displaying the minimum, maximum, median, and quartiles. Helps spot outliers easily.",
        code: `# Compare Japan vs. India vs. China\ndf_subset = df_canada.loc[df_canada['Country'].isin(['Japan', 'India', 'China']), years].T\ndf_subset.columns = ['Japan', 'India', 'China']\n\nplt.figure(figsize=(10, 6))\nplt.boxplot([df_subset['Japan'], df_subset['India'], df_subset['China']], \n            tick_labels=['Japan', 'India', 'China'], patch_artist=True,\n            boxprops=dict(facecolor='lightblue', color='blue'),\n            medianprops=dict(color='red', linewidth=2))\nplt.ylabel("Number of Immigrants")\nplt.show()`
      },
      {
        id: "hist",
        name: "d. Histogram",
        detail: "Shows data distribution by grouping values into bins. X-axis shows bins and Y-axis shows frequencies.",
        code: `import numpy as np\ncount, bin_edges = np.histogram(df_canada['2013'])\n\ndf_canada['2013'].plot(kind='hist', bins=bin_edges, rwidth=0.8, \n                   color='skyblue', edgecolor='black')\nplt.xticks(bin_edges, rotation=45)\nplt.title('Histogram of Immigration from Countries in 2013')\nplt.show()`
      },
      {
        id: "line",
        name: "e. Line Chart",
        detail: "One of the basic plots representing a relationship between two data variables X and Y on different axes.",
        code: `haiti_data = df_canada.loc[df_canada['Country'] == 'Haiti', years].squeeze()\nhaiti_data.plot(kind='line', marker='o', color='blue')\nplt.title("Immigration from Haiti to Canada (1980–2014)")\nplt.grid(True)\nplt.show()`
      },
      {
        id: "heatmap",
        name: "Heat Map",
        detail: "Graphical representation where values are shown as colors to visualize patterns, correlations, or intensity in a matrix format.",
        code: `import seaborn as sns\nyears = list(map(str, range(2000, 2015)))\ndf_first10 = df_canada.head(10).set_index('Country')[years]\n\nplt.figure(figsize=(12, 8))\nsns.heatmap(df_first10, cmap="YlGnBu", linewidths=0.3, annot=True, fmt=".0f")\nplt.title("Heatmap of Immigration to Canada (2000-2014)")\nplt.show()`
      },
      {
        id: "subplots",
        name: "Subplots (2x2 Grid)",
        detail: "The subplot() method adds a plot to a grid position. Arguments: rows, columns, and plot index.",
        code: `# 2x2 grid combining different chart types\nfig, axes = plt.subplots(2, 2, figsize=(14, 10))\n\n# 1. Line (Top-Left) | 2. Scatter (Top-Right)\naxes[0, 0].plot(years_int, total_immigrants, marker='o', color='blue')\naxes[0, 1].scatter(years_int, total_immigrants, color='green', s=80)\n\n# 3. Histogram (Bottom-Left) | 4. Pie (Bottom-Right)\naxes[1, 0].hist(immigrants_2013, bins=20, color='orange')\naxes[1, 1].pie(top5_2013['2013'], labels=top5_2013['Country'], autopct='%1.1f%%')\n\nplt.tight_layout()\nplt.show()`
      }
    ]
  }
];

export default function Week12Lab() {
  const [activeChart, setActiveChart] = useState(labData[0].charts[0]);
  const [introText, setIntroText] = useState("");

  useEffect(() => {
    let i = 0;
    const fullIntro = "Nandhu's Matplotlib Lab Explorer...";
    const timer = setInterval(() => {
      setIntroText(fullIntro.slice(0, i));
      i++;
      if (i > fullIntro.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex min-h-screen bg-[#0a0a0a] text-gray-200">
      {/* Sidebar Navigation */}
      <nav className="w-80 bg-[#111] border-r border-gray-800 p-8 flex flex-col sticky top-0 h-screen">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white uppercase italic">Week 12</h1>
          <p className="text-blue-500 text-[10px] font-mono mt-1 tracking-widest">{introText}</p>
        </div>
        
        <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {labData[0].charts.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border ${
                activeChart.id === chart.id 
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600'
              }`}
            >
              <span className="font-bold text-sm tracking-tight">{chart.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <section className="flex-1 p-16 bg-[radial-gradient(circle_at_top_right,#111,transparent)] overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">{activeChart.name}</h2>
            <p className="text-xl text-gray-400 leading-relaxed pl-6 border-l-4 border-blue-600 italic">
              {activeChart.detail}
            </p>
          </header>

          {/* Educational Concept Tag */}
          <div className="mb-8">
             <span className="bg-blue-900/30 text-blue-400 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-widest border border-blue-500/30">
               Data Visualization Logic
             </span>
          </div>

          {/* Code Playground */}
          <div className="rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
            <div className="bg-[#1a1a1a] px-8 py-4 flex justify-between items-center border-b border-gray-800">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Matplotlib_Lab_Week12.py</span>
              <button 
                onClick={() => navigator.clipboard.writeText(activeChart.code)}
                className="text-[10px] text-gray-500 hover:text-white transition-colors font-bold uppercase"
              >
                Copy Code
              </button>
            </div>
            <pre className="bg-[#000] p-10 font-mono text-[13px] leading-relaxed text-blue-300 overflow-x-auto whitespace-pre">
              <code>{activeChart.code}</code>
            </pre>
          </div>

          <footer className="mt-12 text-gray-600 text-xs text-center border-t border-gray-900 pt-8">
            Source: Week 12 Lab Records - Lakireddy Bali Reddy College of Engineering.
          </footer>
        </div>
      </section>
    </main>
  );
}
"use client";
import { useState, useEffect } from 'react';

const labModules = [
  {
    id: "visualization",
    title: "Week 12: Matplotlib Visualizations",
    description: "Matplotlib is a 2D plotting library for creating static, animated, and interactive visualizations built on top of NumPy[cite: 9, 10].",
    topics: [
      { name: "Bar Graph", detail: "Displays categorical data using rectangular bars proportional to values[cite: 12]." },
      { name: "Pie Chart", detail: "A circular chart showing data as proportions or percentages using slices[cite: 86]." },
      { name: "Box Plot", detail: "Shows data spread (median, quartiles) and identifies outliers easily[cite: 157, 158]." },
      { name: "Histogram", detail: "Shows data distribution by grouping values into frequency bins[cite: 214]." }
    ],
    code: `import matplotlib.pyplot as plt\n# Select India's immigration data [cite: 25]\ndf_india = df_canada.loc['India', years]\n# Plotting \ndf_india.plot(kind='bar', color='skyblue', edgecolor='black')\nplt.show() [cite: 37]`
  },
  {
    id: "nltk",
    title: "Week 13: Natural Language Toolkit",
    description: "NLTK is a powerful library for Natural Language Processing (NLP) tasks[cite: 496].",
    topics: [
      { name: "Tokenization", detail: "Dividing continuous text into individual sentences or words[cite: 492, 501]." },
      { name: "Stopword Removal", detail: "Filtering out frequent words like 'the' or 'is' that carry minimal semantic info[cite: 509]." },
      { name: "Stemming", detail: "Reducing words to their root form (e.g., 'playing' becomes 'play')[cite: 518]." }
    ],
    code: `from nltk.tokenize import word_tokenize\nfrom nltk.corpus import stopwords\n# Remove stopwords [cite: 538]\nstop_words = set(stopwords.words('english'))\nfiltered = [w for w in words if w.lower() not in stop_words]`
  },
  {
    id: "scraping",
    title: "Week 10: Web Scraping",
    description: "Web scraping is the automated extraction of data from websites.",
    topics: [
      { name: "Requests", detail: "Sends HTTP requests to download webpage content[cite: 551]." },
      { name: "Beautiful Soup", detail: "Parses HTML or XML to extract specific information[cite: 552, 561]." },
      { name: "Pandas", detail: "Organizes scraped data into structured tables or CSVs[cite: 553, 619]." }
    ],
    code: `import requests\nfrom bs4 import BeautifulSoup\nurl = "https://lbrce.ac.in/ai/index.php" [cite: 562]\nresponse = requests.get(url) \nsoup = BeautifulSoup(response.text, "html.parser") [cite: 565]\nprint(soup.title.text) [cite: 566]`
  }
];

export default function IDSLab() {
  const [activeModule, setActiveModule] = useState(labModules[0]);
  const [introText, setIntroText] = useState("");

  useEffect(() => {
    let i = 0;
    const fullText = "Initializing Lab Records... Explore IDS Modules.";
    const timer = setInterval(() => {
      setIntroText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex bg-[#0d1117] text-white font-sans overflow-hidden">
      {/* 🌊 Oceanic Background Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_1%,transparent_2%)] bg-[length:50px_50px] animate-pulse" />
      </div>

      {/* 📁 Sidebar */}
      <aside className="relative z-10 w-72 border-r border-gray-800 bg-[#161b22] p-6 flex flex-col">
        <h1 className="text-2xl font-black text-blue-400 tracking-tighter mb-10">IDS LABS</h1>
        <nav className="space-y-4">
          {labModules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                activeModule.id === mod.id ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              <p className="text-xs uppercase font-bold opacity-50 mb-1">{mod.id}</p>
              <p className="font-semibold text-sm">{mod.title.split(':')[0]}</p>
            </button>
          ))}
        </nav>
      </aside>

      {/* 📑 Content Area */}
      <section className="relative z-10 flex-1 p-12 overflow-y-auto">
        <header className="mb-12">
          <p className="text-blue-400 font-mono mb-2">{introText}_</p>
          <h2 className="text-4xl font-bold tracking-tight">{activeModule.title}</h2>
          <p className="mt-4 text-gray-400 max-w-2xl leading-relaxed">{activeModule.description}</p>
        </header>

        {/* 📊 Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {activeModule.topics.map((topic, idx) => (
            <div key={idx} className="p-6 bg-[#161b22] border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-colors">
              <h4 className="text-blue-400 font-bold mb-2">{topic.name}</h4>
              <p className="text-sm text-gray-300 leading-snug">{topic.detail}</p>
            </div>
          ))}
        </div>

        {/* 💻 Code Block */}
        <div className="bg-black rounded-3xl border border-gray-800 p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-gray-500 font-mono">IDS_Lab_Code.py</span>
          </div>
          <pre className="font-mono text-green-400 text-sm leading-loose overflow-x-auto">
            <code>{activeModule.code}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}
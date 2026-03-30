"use client";
import { useState, useEffect } from 'react';

const labData = [
  // Week 10: Web Scraping Logic [cite: 547-618]
  {
    week: "Week 10",
    title: "Web Scraping with Python",
    description: "Automatically extracting data from websites using Requests and Beautiful Soup[cite: 549, 552].",
    methods: [
      { name: "Title Extraction", detail: "Using soup.title.text to get the webpage name[cite: 566]." },
      { name: "Subheadings", detail: "Finding all <h3> tags to identify page sections[cite: 583]." },
      { name: "Table Scraping", detail: "Parsing <tr> and <td> tags to create a Pandas DataFrame[cite: 628, 634]." },
      { name: "Multi-page", detail: "Using loops to scrape quotes across multiple URLs[cite: 667]." }
    ],
    code: `import requests\nfrom bs4 import BeautifulSoup\n\nurl = "https://lbrce.ac.in/ai/index.php"\nresponse = requests.get(url)\nif response.status_code == 200:\n    soup = BeautifulSoup(response.text, "lxml")\n    # Extracting subheadings\n    headlines = soup.find_all("h3")\n    for idx, h in enumerate(headlines[:3], 1):\n        print(f"{idx}. {h.text.strip()}")`
  },
  // Week 11: Data Preprocessing [cite: 726-843]
  {
    week: "Week 11",
    title: "Data Preprocessing",
    description: "Transforming raw data into a clean format for machine learning using Scikit-Learn[cite: 732, 733].",
    methods: [
      { name: "Handling Nulls", detail: "Filling missing numerical values with Mean and categorical with Mode[cite: 757, 761]." },
      { name: "Feature Scaling", detail: "MinMaxScaler scales features between 0 and 1[cite: 795, 796]." },
      { name: "Standardization", detail: "Z-score normalization rescales features to have mean 0 and std dev 1[cite: 808, 810]." },
      { name: "Encoding", detail: "Label Encoding for binary and One-Hot for multi-category features[cite: 817, 828]." }
    ],
    code: `from sklearn.preprocessing import MinMaxScaler, StandardScaler\n# Min-Max Scaling\nscaler = MinMaxScaler()\ndf[numerical_cols] = scaler.fit_transform(df[numerical_cols])\n\n# Standardization\nstandardizer = StandardScaler()\ndf[numerical_cols] = standardizer.fit_transform(df[numerical_cols])`
  },
  // Week 12: Matplotlib Visualizations [cite: 1-469]
  {
    week: "Week 12",
    title: "Matplotlib Visualizations",
    description: "Creating static, animated, and interactive 2D visualizations on top of NumPy[cite: 9, 10].",
    methods: [
      { name: "Bar & Pie Charts", detail: "Bar charts compare categories; Pie charts show whole proportions[cite: 12, 86]." },
      { name: "Box Plots", detail: "Simple graph displaying min, max, median, and quartiles to spot outliers[cite: 157, 158]." },
      { name: "Histogram", detail: "Shows data distribution by grouping values into frequency bins[cite: 214, 215]." },
      { name: "Line & Scatter", detail: "Line charts show X-Y relationships; Scatter plots observe correlation[cite: 260, 292]." },
      { name: "Heat Maps", detail: "Graphical data representation where values are shown as colors." },
      { name: "Subplots", detail: "Method to add multiple plots to a grid position in one figure." }
    ],
    code: `# Create 2x2 grid of subplots combining four chart types [cite: 368]
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Line Chart (top-left) [cite: 385]
axes[0, 0].plot(years_int, total_immigrants, marker='o', color='blue')

# 2. Scatter Plot (top-right) [cite: 391]
axes[0, 1].scatter(years_int, total_immigrants, color='green')

# 3. Histogram (bottom-left) [cite: 397]
axes[1, 0].hist(immigrants_2013, bins=20, color='orange')

# 4. Pie Chart (bottom-right) [cite: 403]
axes[1, 1].pie(top5_2013['2013'], labels=top5_2013['Country'], autopct='%1.1f%%')

plt.tight_layout()\nplt.show()`
  },
  // Week 13: NLTK Processing [cite: 470-546]
  {
    week: "Week 13",
    title: "NLTK: Text Processing",
    description: "Natural Language Toolkit for processing human language data[cite: 472].",
    methods: [
      { name: "Tokenization", detail: "Dividing continuous text into individual sentences or tokens[cite: 492, 501]." },
      { name: "Stopword Removal", detail: "Technique filtering out semantically minimal words like 'the' or 'is'[cite: 509]." },
      { name: "Stemming", detail: "Reducing derived words to their base root form (e.g., 'playing' to 'play')[cite: 518]." }
    ],
    code: `from nltk.tokenize import word_tokenize\nfrom nltk.stem import PorterStemmer\n\nps = PorterStemmer()\nwords = ["playing", "played", "plays"]\nstemmed = [ps.stem(w) for w in words]\nprint(stemmed) # Output: ['play', 'play', 'play']`
  }
];

export default function IDSLabExplorer() {
  const [activeTab, setActiveTab] = useState(labData[2]); 
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
      {/* Navigation */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {activeTab.methods.map((m, i) => (
              <div key={i} className="p-5 bg-[#111] rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all group">
                <h4 className="text-blue-400 font-bold text-sm mb-2 group-hover:text-blue-300">{m.name}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
            <div className="bg-[#1a1a1a] px-6 py-3 flex justify-between items-center border-b border-gray-800">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Lab_Source_Code.py</span>
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
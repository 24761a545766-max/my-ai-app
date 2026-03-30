"use client";
import { useState, useEffect } from 'react';

const labData = [
  {
    week: "Week 10",
    title: "Web Scraping with Python",
    description: "Automatically extracting data from websites using Requests and Beautiful Soup[cite: 549, 552].",
    methods: [
      { name: "Title Extraction", detail: "Using soup.title.text to get the webpage name[cite: 566]." },
      { name: "Subheadings", detail: "Finding all <h3> tags to identify page sections[cite: 583]." },
      { name: "Table Scraping", detail: "Parsing <tr> and <td> tags to create a Pandas DataFrame[cite: 628, 634]." },
      { name: "Multi-page", detail: "Using loops to scrape quotes and authors across multiple URLs[cite: 667]." }
    ],
    code: `import requests\nfrom bs4 import BeautifulSoup\nimport pandas as pd\n\nurl = "https://lbrce.ac.in/ai/index.php"\nresponse = requests.get(url)\nif response.status_code == 200:\n    soup = BeautifulSoup(response.text, "lxml")\n    # Extract Subheadings\n    headlines = soup.find_all("h3")\n    for idx, h in enumerate(headlines[:3], 1):\n        print(f"{idx}. {h.text.strip()}")`
  },
  {
    week: "Week 11",
    title: "Data Preprocessing",
    description: "Transforming raw data into a clean format for machine learning using Scikit-Learn[cite: 732, 733].",
    methods: [
      { name: "Handling Nulls", detail: "Filling missing numerical values with Mean and categorical with Mode[cite: 757, 761]." },
      { name: "Feature Scaling", detail: "MinMaxScaler scales features between 0 and 1[cite: 795, 796]." },
      { name: "Standardization", detail: "Z-score normalization sets mean to 0 and std dev to 1[cite: 808, 810]." },
      { name: "Encoding", detail: "Label Encoding for binary and One-Hot for multi-category features[cite: 817, 828]." }
    ],
    code: `from sklearn.preprocessing import MinMaxScaler, StandardScaler\n# Min-Max Scaling\nscaler = MinMaxScaler()\ndf[numerical_cols] = scaler.fit_transform(df[numerical_cols])\n\n# Standardization\nstd_scaler = StandardScaler()\ndf[numerical_cols] = std_scaler.fit_transform(df[numerical_cols])`
  },
  {
    week: "Week 12",
    title: "Matplotlib Visualizations",
    description: "Creating static and interactive 2D plots on top of NumPy[cite: 9, 10].",
    methods: [
      { name: "Bar Graph", detail: "Categorical data comparison using rectangular bars[cite: 12]." },
      { name: "Pie Chart", detail: "Proportional representation of a whole using wedges[cite: 86]." },
      { name: "Box Plot", detail: "Visualizing median, quartiles, and spotting outliers[cite: 158]." },
      { name: "Histogram", detail: "Showing data distribution by grouping values into bins[cite: 214]." }
    ],
    code: `# India Immigration Bar Chart\ndf_india = df_canada.loc['India', years]\ndf_india.plot(kind='bar', color='skyblue', edgecolor='black')\nplt.title("India Immigrants to Canada (1980-2014)")\nplt.show()`
  },
  {
    week: "Week 13",
    title: "NLTK: Text Processing",
    description: "Natural Language Toolkit for processing human language data[cite: 472].",
    methods: [
      { name: "Tokenization", detail: "Splitting text into sentences or individual words (tokens)[cite: 492, 501]." },
      { name: "Stopwords", detail: "Removing common words (the, is, a) that carry minimal info[cite: 509]." },
      { name: "Stemming", detail: "Reducing derived words to their base root form (e.g., 'playing' to 'play')." }
    ],
    code: `from nltk.tokenize import word_tokenize\nfrom nltk.stem import PorterStemmer\n\nps = PorterStemmer()\nwords = ["playing", "played", "plays"]\nstemmed = [ps.stem(w) for w in words]\nprint(stemmed) # ['play', 'play', 'play']`
  }
];

export default function IDSLabExplorer() {
  const [activeTab, setActiveTab] = useState(labData[0]);
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
      {/* Sidebar Navigation */}
      <nav className="w-80 bg-[#0f0f0f] border-r border-gray-800 p-8 flex flex-col">
        <div className="mb-12">
          <h1 className="text-3xl font-black text-white tracking-tighter">IDS LAB</h1>
          <p className="text-blue-500 text-xs font-mono mt-1">{introText}</p>
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

      {/* Main Content Area */}
      <section className="flex-1 p-16 overflow-y-auto bg-[radial-gradient(circle_at_top_right,#111,transparent)]">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h2 className="text-5xl font-extrabold text-white mb-6">{activeTab.title}</h2>
            <p className="text-xl text-gray-400 leading-relaxed italic border-l-4 border-blue-600 pl-6">
              "{activeTab.description}"
            </p>
          </header>

          {/* Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {activeTab.methods.map((m, i) => (
              <div key={i} className="p-6 bg-[#121212] rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all">
                <h4 className="text-blue-400 font-bold text-lg mb-2">{m.name}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>

          {/* Code Playground */}
          <div className="rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
            <div className="bg-[#1a1a1a] px-6 py-3 flex justify-between items-center border-b border-gray-800">
              <span className="text-xs font-mono text-gray-400">IDS_Documentation.py</span>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
            </div>
            <pre className="bg-black p-8 font-mono text-sm leading-relaxed text-blue-300 overflow-x-auto">
              <code>{activeTab.code}</code>
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
"use client";
import { useState } from 'react';

const numpyData = [
  {
    id: "dimensions",
    title: "a. Dimensions of NumPy array",
    content: (
      <>
        <p className="mb-4"><strong>ndim</strong> is an attribute that determines the number of dimensions (axes).</p>
        <div className="relative group">
          <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto shadow-inner">
{`import numpy as np
a = np.array([[5, 10, 15], [20, 25, 21]])
print('Dimensions:', a.ndim)
# Output: 2`}
          </pre>
        </div>
      </>
    )
  },
  {
    id: "shape",
    title: "b. Shape of NumPy array",
    content: (
      <>
        <p className="mb-4">Shows the number of elements along each axis: <strong>(Rows, Columns)</strong>.</p>
        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg shadow-inner">
{`a = np.array([[1, 2, 3], [4, 5, 6]])
print(a.shape) # Output: (2, 3)
print('Rows =', a.shape[0]) # Output: 2
print('Cols =', a.shape[1]) # Output: 3`}
        </pre>
      </>
    )
  },
  {
    id: "reshaping",
    title: "d. Reshaping & -1 Logic",
    content: (
      <>
        <p className="mb-4">Use <code>-1</code> to let NumPy automatically calculate the required size for that dimension.</p>
        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg shadow-inner">
{`a = np.array([3, 6, 9, 12, 18, 24])
# Reshape to 3 rows; -1 tells NumPy to calculate columns (will be 2)
new_a = a.reshape(3, -1) 
print(new_a)
# [[ 3,  6], [ 9, 12], [18, 24]]`}
        </pre>
      </>
    )
  },
  {
    id: "flatten",
    title: "e. Flatten vs Ravel",
    content: (
      <div className="space-y-6">
        <p className="text-slate-600">Both collapse an N-dimensional array into a 1D array, but memory handling differs:</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg shadow-sm">
            <h4 className="font-bold text-blue-700 text-lg mb-2">flatten()</h4>
            <p className="text-sm leading-relaxed"><strong>Deep Copy:</strong> Returns a new copy. Changing the result does <u>not</u> affect the original array.</p>
          </div>
          <div className="p-5 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg shadow-sm">
            <h4 className="font-bold text-orange-700 text-lg mb-2">ravel()</h4>
            <p className="text-sm leading-relaxed"><strong>Shallow Copy (View):</strong> Shares memory. Changing the raveled array <u>will</u> change the original data.</p>
          </div>
        </div>
      </div>
    )
  }
];

export default function NumPyDocs() {
  const [activeTab, setActiveTab] = useState(numpyData[0].id);

  // Find the currently selected object
  const activeContent = numpyData.find(item => item.id === activeTab);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col sticky top-0 h-screen">
        <div className="mb-10">
          <h1 className="text-2xl font-black text-blue-600 tracking-tight">NumPy Guide</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Data Science Fundamentals</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          {numpyData.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-900 p-4 rounded-2xl text-white text-xs">
            <p className="opacity-60 mb-1">Current Version</p>
            <p className="font-mono text-blue-400">numpy==1.26.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto">
        {activeContent && (
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10">
              <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Documentation</span>
              <h2 className="text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
                {activeContent.title}
              </h2>
            </header>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm leading-relaxed text-lg">
              {activeContent.content}
            </div>
            
            <footer className="mt-12 text-slate-400 text-sm">
              <p>© 2026 Nandhu AI Labs • Build #0324</p>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
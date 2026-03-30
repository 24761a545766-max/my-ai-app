"use client";
import { useState } from 'react';

const numpyData = [
  {
    id: "dimensions",
    title: "a. Dimensions of NumPy array",
    content: (
      <>
        <p className="mb-4"><strong>ndim</strong> is an attribute that determines the number of dimensions or axes.</p>
        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg">
{`a = np.array([[5,10,15],[20,25,21]])
print('Dimensions:', a.ndim)
# Output: 2`}
        </pre>
      </>
    )
  },
  {
    id: "shape",
    title: "b. Shape of NumPy array",
    content: (
      <>
        <p className="mb-4">Shows how many elements are there along each dimension (Rows, Columns).</p>
        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg">
{`a = np.array([[1,2,3],[4,5,6]])
print(a.shape) # (2, 4)
print('Rows =', a.shape[0])`}
        </pre>
      </>
    )
  },
  {
    id: "reshaping",
    title: "d. Reshaping & -1 Logic",
    content: (
      <>
        <p className="mb-4">Use <code>-1</code> to let NumPy automatically calculate the shape of an axis.</p>
        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg">
{`a = np.array([3,6,9,12,18,24])
print(np.reshape(a, (3, -1))) # 3 rows, Auto-cols`}
        </pre>
      </>
    )
  },
  {
    id: "flatten",
    title: "e. Flatten vs Ravel",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-blue-200 rounded">
            <h4 className="font-bold text-blue-600">flatten()</h4>
            <p className="text-sm">Deep Copy: Changes do NOT affect the original array.</p>
          </div>
          <div className="p-4 border border-orange-200 rounded">
            <h4 className="font-bold text-orange-600">ravel()</h4>
            <p className="text-sm">Shallow Copy: Changes ARE reflected in the original.</p>
          </div>
        </div>
      </div>
    )
  }
];

export default function NumPyDocs() {
  const [activeTab, setActiveTab] = useState(numpyData[0].id);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">NumPy Guide</h1>
        <nav className="space-y-2">
          {numpyData.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeTab === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-100'
              }`}
            >
              {item.title.split('.')[0]}. {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 max-w-4xl">
        {numpyData.map((item) => (
          <section key={item.id} className={activeTab === item.id ? 'block' : 'hidden'}>
            <h2 className="text-3xl font-extrabold mb-6 border-b pb-2">{item.title}</h2>
            <div className="prose prose-slate lg:prose-xl">
              {item.content}
            </div>
          </main>
        ))}
      </main>
    </div>
  );
}
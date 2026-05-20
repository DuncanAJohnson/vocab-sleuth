import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
      <h1 className="text-4xl font-bold mb-4">Vocab Sleuth</h1>
      <p className="text-slate-600 mb-6">
        Vite + React + Tailwind is wired up.
      </p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
      >
        Count is {count}
      </button>
    </div>
  )
}

export default App

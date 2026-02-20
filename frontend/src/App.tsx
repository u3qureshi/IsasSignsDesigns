import './App.css'

import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Demo content so you can scroll and see the transform */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold">Homepage</h1>
        <p className="mt-4 text-neutral-600">
          Scroll down to see the brand collapse into the sticky header.
        </p>

        <div className="mt-10 space-y-6">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl border border-neutral-200 bg-neutral-50" />
          ))}
        </div>
      </main>
    </div>
  );
}

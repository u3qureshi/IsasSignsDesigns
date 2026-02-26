import './App.css'
import { Route, Routes } from 'react-router-dom'

import Header from "./components/Header";
import Footer from "./components/Footer";
import KidsPage from "./components/pages/KidsPage";
import FaqPage from "./components/pages/FaqPage";

function PageSkeleton({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold text-brown-700">{title}</h1>
      <p className="mt-4 text-neutral-600">Page content coming soon.</p>
    </main>
  );
}

function HomePage() {
  return (
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
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/best-sellers" element={<PageSkeleton title="Best Sellers" />} />
          <Route path="/ramadan-decor" element={<PageSkeleton title="Ramadan Decor" />} />
          <Route path="/wall-art" element={<PageSkeleton title="Wall Art" />} />
          <Route path="/home-decor" element={<PageSkeleton title="Home Decor" />} />
          <Route path="/kids" element={<KidsPage />} />
          <Route path="/business-events" element={<PageSkeleton title="Business & Events" />} />
          <Route path="/faq" element={<FaqPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

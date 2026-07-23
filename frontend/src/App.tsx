import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'

import Header from "./components/Header";
import Footer from "./components/Footer";
import KidsPage from "./components/pages/KidsPage";
import FaqPage from "./components/pages/FaqPage";
import ProductDetailPage from "./components/pages/ProductDetailPage";
import CategoryPage from "./components/pages/CategoryPage";
import CustomEmbroideryPage from "./components/pages/CustomEmbroideryPage";
import { EMBROIDERY_COLLECTIONS } from "./config/embroideryCollections";
import { PRINTING_COLLECTIONS } from "./config/printingCollections";

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
          <Route path="/best-sellers" element={<CategoryPage title="Best Sellers" featured />} />
          <Route path="/embroidery" element={<Navigate to={EMBROIDERY_COLLECTIONS[0].path} replace />} />
          <Route path="/ramadan-decor" element={<Navigate to="/embroidery/seasonal-holidays" replace />} />
          {EMBROIDERY_COLLECTIONS.filter(
            (collection) => collection.path !== "/embroidery/custom-designs",
          ).map((collection) => (
            <Route
              key={collection.path}
              path={collection.path}
              element={<CategoryPage title={collection.label} category={collection.category} />}
            />
          ))}
          <Route path="/embroidery/custom-designs" element={<CustomEmbroideryPage />} />
          <Route path="/printing" element={<Navigate to={PRINTING_COLLECTIONS[0].path} replace />} />
          {PRINTING_COLLECTIONS.map((collection) => (
            <Route
              key={collection.path}
              path={collection.path}
              element={<CategoryPage title={collection.label} category={collection.category} />}
            />
          ))}
          <Route path="/wall-art" element={<CategoryPage title="Wall Art" category="wall-art" />} />
          <Route path="/home-decor" element={<CategoryPage title="Home Decor" category="home-decor" />} />
          <Route path="/kids" element={<KidsPage />} />
          <Route path="/business-events" element={<CategoryPage title="Business & Events" category="business-events" />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

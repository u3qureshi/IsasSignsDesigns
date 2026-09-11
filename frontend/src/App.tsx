import './App.css'
import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Header from "./components/Header";
import Footer from "./components/Footer";
import QuickRequestLauncher from "./components/quick-request/QuickRequestLauncher";
import CartDrawer from "./components/cart/CartDrawer";
import { EMBROIDERY_COLLECTIONS } from "./config/embroideryCollections";
import { PRINTING_COLLECTIONS } from "./config/printingCollections";
import { BUSINESS_POLICIES } from "./data/businessPolicies";

const KidsPage = lazy(() => import("./components/pages/KidsPage"));
const FaqPage = lazy(() => import("./components/pages/FaqPage"));
const ProductDetailPage = lazy(() => import("./components/pages/ProductDetailPage"));
const CategoryPage = lazy(() => import("./components/pages/CategoryPage"));
const CustomEmbroideryPage = lazy(() => import("./components/pages/CustomEmbroideryPage"));
const HomePage = lazy(() => import("./components/pages/HomePage"));
const TShirtsPage = lazy(() => import("./components/pages/TShirtsPage"));
const PoloShirtsPage = lazy(() => import("./components/pages/PoloShirtsPage"));
const SweatshirtsFleecePage = lazy(() => import("./components/pages/SweatshirtsFleecePage"));
const HatsPage = lazy(() => import("./components/pages/HatsPage"));
const GalleryPage = lazy(() => import("./components/pages/GalleryPage"));
const ClothingPage = lazy(() => import("./components/pages/ClothingPage"));
const ReviewsPage = lazy(() => import("./components/pages/ReviewsPage"));
const CheckoutSuccessPage = lazy(() => import("./components/pages/CheckoutSuccessPage"));
const CheckoutCancelPage = lazy(() => import("./components/pages/CheckoutCancelPage"));
const SearchResultsPage = lazy(() => import("./components/pages/SearchResultsPage"));
const BusinessPolicyPage = lazy(() => import("./components/pages/BusinessPolicyPage"));
const NotFoundPage = lazy(() => import("./components/pages/NotFoundPage"));
const LoginPage = lazy(() => import("./components/pages/LoginPage"));
const AccountOrdersPage = lazy(() => import("./components/pages/AccountOrdersPage"));
const AccountRequestsPage = lazy(() => import("./components/pages/AccountRequestsPage"));

function RouteScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [hash, pathname]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <RouteScrollManager />
      <CartDrawer />
      <QuickRequestLauncher />

      <div className="flex-1">
        <Suspense fallback={<div className="flex min-h-[55vh] items-center justify-center bg-[hsl(var(--theme-kids-bg))] text-sm font-semibold text-stone-500">Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/best-sellers"
            element={(
              <GalleryPage
                eyebrow="Our most-loved picks"
                title="Best Sellers"
                description="Discover standout embroidered apparel, printed favourites, personalized gifts, and statement hats chosen to make every order feel special."
              />
            )}
          />
          <Route path="/embroidery" element={<Navigate to={EMBROIDERY_COLLECTIONS[0].path} replace />} />
          <Route path="/ramadan-decor" element={<Navigate to="/embroidery/seasonal-holidays" replace />} />
          {EMBROIDERY_COLLECTIONS.filter(
            (collection) => collection.path !== "/embroidery/custom-designs",
          ).map((collection) => (
            <Route
              key={collection.path}
              path={collection.path}
              element={<CategoryPage title={collection.label} tag={collection.tag} />}
            />
          ))}
          <Route
            path="/embroidery/custom-designs"
            element={<CustomEmbroideryPage key="embroidery-studio" studioType="embroidery" />}
          />
          <Route path="/printing" element={<Navigate to={PRINTING_COLLECTIONS[0].path} replace />} />
          <Route path="/services/t-shirts" element={<TShirtsPage />} />
          <Route path="/services/polo-shirts" element={<PoloShirtsPage />} />
          <Route path="/services/sweatshirts-fleece" element={<SweatshirtsFleecePage />} />
          <Route path="/services/hats" element={<HatsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/clothing" element={<ClothingPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<Navigate to="/account/orders" replace />} />
          <Route path="/account/orders" element={<AccountOrdersPage />} />
          <Route path="/account/custom-requests" element={<AccountRequestsPage />} />
          <Route path="/policies/shipping-pickup" element={<BusinessPolicyPage policy={BUSINESS_POLICIES.shipping} />} />
          <Route path="/policies/returns-refunds" element={<BusinessPolicyPage policy={BUSINESS_POLICIES.returns} />} />
          <Route path="/policies/custom-order-policy" element={<BusinessPolicyPage policy={BUSINESS_POLICIES.custom} />} />
          <Route path="/policies/privacy" element={<BusinessPolicyPage policy={BUSINESS_POLICIES.privacy} />} />
          <Route path="/policies/terms" element={<BusinessPolicyPage policy={BUSINESS_POLICIES.terms} />} />
          <Route path="/contact" element={<BusinessPolicyPage policy={BUSINESS_POLICIES.contact} />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          {PRINTING_COLLECTIONS.filter(
            (collection) => collection.path !== "/printing/custom",
          ).map((collection) => (
            <Route
              key={collection.path}
              path={collection.path}
              element={<CategoryPage title={collection.label} tag={collection.tag} />}
            />
          ))}
          <Route
            path="/printing/custom"
            element={<CustomEmbroideryPage key="printing-studio" studioType="printing" />}
          />
          <Route path="/wall-art" element={<CategoryPage title="Wall Art" category="wall-art" />} />
          <Route path="/home-decor" element={<CategoryPage title="Home Decor" category="home-decor" />} />
          <Route path="/kids" element={<KidsPage />} />
          <Route path="/business-events" element={<CategoryPage title="Business & Events" category="business-events" />} />
          <Route path="/about" element={<FaqPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

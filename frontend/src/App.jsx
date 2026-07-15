import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

/* ── Layouts ─────────────────────────────────────────────────── */
import CustomerLayout from './layouts/CustomerLayout';
import VendorLayout   from './layouts/VendorLayout';

/* ── Customer pages ──────────────────────────────────────────── */
import HeroSection from './components/HeroSection';
import ShopPage    from './pages/ShopPage/ShopPage';
import ProductDetailsPage from './pages/ProductDetails/ProductDetailsPage';
import CartPage from './pages/CartPage/CartPage';
import WishlistPage from './pages/WishlistPage/WishlistPage';
import LoginPage from './pages/AuthPages/LoginPage';
import RegisterPage from './pages/AuthPages/RegisterPage';

import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage/OrderHistoryPage';

function HomePage()        { return <HeroSection />; }
function PlaceholderPage({ title }) {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-heading)' }}>
        {title}
      </h2>
      <p style={{ color: 'var(--color-text-secondary)' }}>Page coming soon.</p>
    </div>
  );
}

/* ── Vendor pages (placeholder) ─────────────────────────────── */
function VendorDashboard() {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--color-text-primary)', marginBottom: 8 }}>
        Welcome back 👋
      </h2>
      <p style={{ color: 'var(--color-text-secondary)' }}>Your vendor dashboard is ready.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Routes>

                {/* ── Customer routes ─────────────────────────────────── */}
                <Route element={<CustomerLayout />}>
                  <Route path="/"               element={<HomePage />} />
                  <Route path="/shop"           element={<ShopPage />} />
                  <Route path="/products"       element={<ShopPage />} />
                  <Route path="/product/:slug"  element={<ProductDetailsPage />} />
                  <Route path="/vendors"        element={<PlaceholderPage title="Vendors" />} />
                  <Route path="/deals"          element={<PlaceholderPage title="Deals" />} />
                  <Route path="/new-arrivals"   element={<PlaceholderPage title="New Arrivals" />} />
                  <Route path="/best-sellers"   element={<PlaceholderPage title="Best Sellers" />} />
                  <Route path="/track-order"    element={<PlaceholderPage title="Track Order" />} />
                  <Route path="/support"        element={<PlaceholderPage title="Help Center" />} />
                  <Route path="/seller-register" element={<PlaceholderPage title="Become a Seller" />} />
                  <Route path="/cart"           element={<CartPage />} />
                  <Route path="/login"          element={<LoginPage />} />
                  <Route path="/register"       element={<RegisterPage />} />

                  {/* Protected Customer Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/wishlist"       element={<WishlistPage />} />
                    <Route path="/account"        element={<PlaceholderPage title="My Account" />} />
                    <Route path="/orders"         element={<OrderHistoryPage />} />
                    <Route path="/checkout"       element={<CheckoutPage />} />
                    <Route path="/orders/:orderNumber" element={<OrderSuccessPage />} />
                  </Route>
                </Route>

                {/* ── Vendor / Seller routes (Protected in real app) ───────────────────────────── */}
                <Route path="/vendor" element={<VendorLayout vendorName="Esaki's Store" />}>
                  <Route path="dashboard" element={<VendorDashboard />} />
                  <Route path="products"  element={<PlaceholderPage title="My Products" />} />
                  <Route path="orders"    element={<PlaceholderPage title="Orders" />} />
                  <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
                  <Route path="reviews"   element={<PlaceholderPage title="Reviews" />} />
                  <Route path="payments"  element={<PlaceholderPage title="Payments" />} />
                  <Route path="store"     element={<PlaceholderPage title="My Store" />} />
                  <Route path="support"   element={<PlaceholderPage title="Seller Support" />} />
                  <Route path="settings"  element={<PlaceholderPage title="Settings" />} />
                </Route>

              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </ShopProvider>
    </AuthProvider>
  );
}

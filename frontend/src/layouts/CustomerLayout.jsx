import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CustomerLayout.css';

/**
 * CustomerLayout
 * Wraps all customer-facing pages:
 *   Navbar (sticky top) → <main> → Footer
 */
export default function CustomerLayout({
  cartCount    = 0,
  wishlistCount= 0,
  userName     = 'Guest',
  isLoggedIn   = false,
}) {
  return (
    <div className="sv-customer-layout">
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        userName={userName}
        isLoggedIn={isLoggedIn}
      />

      <main className="sv-customer-layout__main" id="main-content" tabIndex="-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

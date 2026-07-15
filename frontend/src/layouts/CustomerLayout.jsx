import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './CustomerLayout.css';

/**
 * CustomerLayout
 * Wraps all customer-facing pages:
 *   Navbar (sticky top) → <main> → Footer
 */
export default function CustomerLayout() {
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();

  return (
    <div className="sv-customer-layout">
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistItems.length}
        userName={user ? user.name : 'Guest'}
        isLoggedIn={!!user}
        onLogout={logout}
      />

      <main className="sv-customer-layout__main" id="main-content" tabIndex="-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

import './Topbar.css';

/**
 * Topbar — thin utility bar above the main Navbar.
 * Shows promo message on left, utility links on right.
 */
export default function Topbar({
  promoText = '🎉 Welcome to ShopVerse — Free shipping on orders above ₹499',
}) {
  return (
    <div className="sv-topbar" role="banner" aria-label="Promotional bar">
      <div className="container-xxl sv-topbar__inner">
        <span className="sv-topbar__promo">{promoText}</span>
        <nav className="sv-topbar__links" aria-label="Utility links">
          <a href="/seller-register" className="sv-topbar__link">Become a Seller</a>
          <span className="sv-topbar__sep" aria-hidden="true">|</span>
          <a href="/support"         className="sv-topbar__link">Help &amp; Support</a>
          <span className="sv-topbar__sep" aria-hidden="true">|</span>
          <a href="/track-order"     className="sv-topbar__link">Track Order</a>
        </nav>
      </div>
    </div>
  );
}

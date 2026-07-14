import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

/* ── Static data ─────────────────────────────────────────────────────────── */
const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Books & Stationery',
  'Toys & Games',
  'Automotive',
  'Jewelry',
];

const NAV_LINKS = [
  { label: 'Home',         to: '/'               },
  { label: 'Products',     to: '/shop'            },
  { label: 'Vendors',      to: '/vendors'         },
  { label: 'Deals',        to: '/deals'           },
  { label: 'New Arrivals', to: '/new-arrivals'    },
  { label: 'Best Sellers', to: '/best-sellers'    },
  { label: 'Track Order',  to: '/track-order'     },
  { label: 'Help Center',  to: '/support'         },
];

/* ── ShopVerse SVG logo icon ─────────────────────────────────────────────── */
function BrandIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#2563EB"/>
      <path d="M8 22L12 10l4 8 4-8 4 12" stroke="#fff" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Category dropdown ───────────────────────────────────────────────────── */
function CategoryDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="sv-cat-dropdown" ref={ref}>
      <button
        className="sv-cat-btn"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        id="sv-category-btn"
      >
        <span className="sv-cat-label">{selected}</span>
        <span className="material-symbols-outlined sv-cat-chevron" aria-hidden="true">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <ul className="sv-cat-menu" role="listbox" aria-labelledby="sv-category-btn">
          {CATEGORIES.map((cat) => (
            <li
              key={cat}
              role="option"
              aria-selected={cat === selected}
              className={`sv-cat-item${cat === selected ? ' sv-cat-item--active' : ''}`}
              onClick={() => { onSelect(cat); setOpen(false); }}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Main Navbar component ───────────────────────────────────────────────── */
export default function Navbar({
  cartCount    = 3,
  wishlistCount= 0,
  userName     = 'Esaki',
  userAvatar   = null,
  isLoggedIn   = true,
  deliveryCity = 'Chennai',
  deliveryPin  = '600001',
  onSearch,
}) {
  const [searchValue,   setSearchValue]   = useState('');
  const [category,      setCategory]      = useState('All Categories');
  const [wishFilled,    setWishFilled]    = useState(false);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);
  const userMenuRef = useRef(null);

  /* close user-menu on outside click */
  useEffect(() => {
    const h = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSearch = () => { if (onSearch) onSearch(searchValue.trim(), category); };
  const handleKey    = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <>
      {/* ════════════════════════════════════════════════════
          TOP UTILITY BAR
      ════════════════════════════════════════════════════ */}
      <div className="sv-topbar d-none d-lg-block">
        <div className="container-xxl d-flex align-items-center justify-content-between">
          <span className="sv-topbar__text">
            🎉 Welcome to ShopVerse — Multi-Vendor Marketplace &nbsp;|&nbsp; Free shipping on orders above ₹499
          </span>
          <div className="d-flex align-items-center gap-3">
            <Link to="/seller-register" className="sv-topbar__link">Become a Seller</Link>
            <span className="sv-topbar__sep">|</span>
            <Link to="/support"         className="sv-topbar__link">Help &amp; Support</Link>
            <span className="sv-topbar__sep">|</span>
            <Link to="/track-order"     className="sv-topbar__link">Track Order</Link>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          MAIN NAVBAR
      ════════════════════════════════════════════════════ */}
      <nav className="sv-navbar sticky-top" aria-label="Main navigation">
        <div className="container-xxl sv-navbar__inner">

          {/* ── Hamburger (mobile) ── */}
          <button
            className="sv-hamburger d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#svMobileDrawer"
            aria-controls="svMobileDrawer"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* ── Brand ── */}
          <Link to="/" className="sv-brand" aria-label="ShopVerse home">
            <BrandIcon />
            <span className="sv-brand__wrap">
              <span className="sv-brand__name">ShopVerse</span>
              <span className="sv-brand__sub">Multi-Vendor Marketplace</span>
            </span>
          </Link>

          {/* ── Search bar ── */}
          <div className="sv-search d-none d-lg-flex" role="search">
            <CategoryDropdown selected={category} onSelect={setCategory} />
            <div className="sv-search__divider" aria-hidden="true" />
            <input
              id="sv-search-input"
              type="search"
              className="sv-search__input"
              placeholder="Search for products, brands and more..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKey}
              aria-label="Search products"
              autoComplete="off"
            />
            <button
              className="sv-search__btn"
              type="button"
              onClick={handleSearch}
              aria-label="Submit search"
            >
              <span className="material-symbols-outlined" aria-hidden="true">search</span>
            </button>
          </div>

          {/* ── Right actions ── */}
          <div className="sv-actions">

            {/* Delivery location */}
            <button className="sv-delivery d-none d-xl-flex" type="button" aria-label="Change delivery location">
              <span className="material-symbols-outlined sv-delivery__icon" aria-hidden="true">location_on</span>
              <span className="sv-delivery__text">
                <span className="sv-delivery__label">Deliver to</span>
                <span className="sv-delivery__loc">
                  {deliveryCity}, {deliveryPin}
                  <span className="material-symbols-outlined sv-delivery__chevron" aria-hidden="true">expand_more</span>
                </span>
              </span>
            </button>

            {/* Wishlist */}
            <button
              className={`sv-icon-btn${wishFilled ? ' sv-icon-btn--wished' : ''}`}
              type="button"
              aria-label={wishFilled ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={() => setWishFilled((v) => !v)}
            >
              <span className={`material-symbols-outlined${wishFilled ? ' sv-icon--filled' : ''}`} aria-hidden="true">
                favorite
              </span>
              <span className="sv-icon-btn__label">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="sv-count-badge" aria-label={`${wishlistCount} items`}>
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button className="sv-icon-btn sv-icon-btn--notif d-none d-lg-flex" type="button" aria-label="Notifications">
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
              <span className="sv-notif-dot" aria-hidden="true" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="sv-cart-btn"
              aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            >
              <span className="material-symbols-outlined sv-cart__icon" aria-hidden="true">shopping_cart</span>
              <span className="sv-cart__label d-none d-sm-inline">Cart</span>
              {cartCount > 0 && (
                <span className="sv-count-badge sv-count-badge--cart" aria-hidden="true">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User account */}
            <div className="sv-user" ref={userMenuRef}>
              <button
                className="sv-user__btn d-none d-lg-flex"
                type="button"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label="Account menu"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="sv-user__avatar" width={32} height={32} />
                ) : (
                  <span className="material-symbols-outlined sv-user__icon" aria-hidden="true">account_circle</span>
                )}
                <span className="sv-user__text">
                  <span className="sv-user__greeting">Hi, {isLoggedIn ? userName : 'Guest'}</span>
                  <span className="sv-user__sub">
                    My Account
                    <span className="material-symbols-outlined sv-user__chevron" aria-hidden="true">expand_more</span>
                  </span>
                </span>
              </button>

              {userMenuOpen && (
                <div className="sv-user__menu" role="menu" aria-label="Account menu">
                  {isLoggedIn ? (
                    <>
                      <Link to="/account"   className="sv-user__item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        <span className="material-symbols-outlined">person</span> My Profile
                      </Link>
                      <Link to="/orders"    className="sv-user__item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        <span className="material-symbols-outlined">inventory_2</span> My Orders
                      </Link>
                      <Link to="/wishlist"  className="sv-user__item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        <span className="material-symbols-outlined">favorite</span> Wishlist
                      </Link>
                      <Link to="/wallet"    className="sv-user__item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        <span className="material-symbols-outlined">account_balance_wallet</span> Wallet
                      </Link>
                      <div className="sv-user__divider" aria-hidden="true" />
                      <button className="sv-user__item sv-user__item--danger" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        <span className="material-symbols-outlined">logout</span> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login"    className="sv-user__item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        <span className="material-symbols-outlined">login</span> Login
                      </Link>
                      <Link to="/register" className="sv-user__item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        <span className="material-symbols-outlined">person_add</span> Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>{/* /sv-actions */}
        </div>{/* /container */}
      </nav>

      {/* ════════════════════════════════════════════════════
          SECONDARY NAV BAR (page links)
      ════════════════════════════════════════════════════ */}
      <div className="sv-subnav d-none d-lg-block" aria-label="Page navigation">
        <div className="container-xxl">
          <div className="sv-subnav__inner">

            {/* All Categories mega-button */}
            <button className="sv-subnav__all-cat" type="button" aria-label="Browse all categories">
              <span className="material-symbols-outlined" aria-hidden="true">dashboard</span>
              All Categories
              <span className="material-symbols-outlined sv-subnav__arrow" aria-hidden="true">expand_more</span>
            </button>

            {/* Nav links */}
            <ul className="sv-subnav__links list-unstyled mb-0 d-flex align-items-center gap-1">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `sv-subnav__link${isActive ? ' sv-subnav__link--active' : ''}`
                    }
                    end={to === '/'}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          MOBILE OFFCANVAS DRAWER
      ════════════════════════════════════════════════════ */}
      <div
        className="offcanvas offcanvas-start sv-drawer"
        id="svMobileDrawer"
        tabIndex="-1"
        aria-labelledby="svDrawerLabel"
      >
        <div className="offcanvas-header sv-drawer__header">
          <Link to="/" className="sv-brand text-decoration-none" data-bs-dismiss="offcanvas">
            <BrandIcon />
            <span className="sv-brand__wrap">
              <span className="sv-brand__name" id="svDrawerLabel">ShopVerse</span>
              <span className="sv-brand__sub">Multi-Vendor Marketplace</span>
            </span>
          </Link>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close menu" />
        </div>

        <div className="offcanvas-body sv-drawer__body d-flex flex-column gap-3">
          {/* Mobile search */}
          <div className="sv-search sv-search--mobile" role="search">
            <input
              type="search"
              className="sv-search__input sv-search__input--mobile"
              placeholder="Search products..."
              aria-label="Search products"
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="sv-search__btn" type="button" onClick={handleSearch} aria-label="Search">
              <span className="material-symbols-outlined" aria-hidden="true">search</span>
            </button>
          </div>

          {/* Mobile nav links */}
          <ul className="list-unstyled mb-0">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to} className="sv-drawer__item">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `sv-drawer__link${isActive ? ' sv-drawer__link--active' : ''}`
                  }
                  data-bs-dismiss="offcanvas"
                  end={to === '/'}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile bottom */}
          <div className="sv-drawer__footer mt-auto">
            {isLoggedIn ? (
              <div className="d-flex align-items-center gap-3">
                <span className="material-symbols-outlined" style={{ color: 'var(--color-brand-primary)', fontSize: 32 }}>account_circle</span>
                <div>
                  <div className="fw-semibold" style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>Hi, {userName}</div>
                  <Link to="/account" className="sv-topbar__link" style={{ fontSize: 12 }} data-bs-dismiss="offcanvas">View Account</Link>
                </div>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login"    className="btn sv-drawer__auth-btn sv-drawer__auth-btn--primary" data-bs-dismiss="offcanvas">Login</Link>
                <Link to="/register" className="btn sv-drawer__auth-btn sv-drawer__auth-btn--outline" data-bs-dismiss="offcanvas">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

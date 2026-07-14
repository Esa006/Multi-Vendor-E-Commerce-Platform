import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import './VendorLayout.css';

const VENDOR_NAV = [
  { icon: 'dashboard',        label: 'Dashboard',    to: '/vendor/dashboard' },
  { icon: 'inventory_2',      label: 'Products',     to: '/vendor/products' },
  { icon: 'shopping_bag',     label: 'Orders',       to: '/vendor/orders' },
  { icon: 'bar_chart',        label: 'Analytics',    to: '/vendor/analytics' },
  { icon: 'reviews',          label: 'Reviews',      to: '/vendor/reviews' },
  { icon: 'payments',         label: 'Payments',     to: '/vendor/payments' },
  { icon: 'store',            label: 'My Store',     to: '/vendor/store' },
  { icon: 'support_agent',    label: 'Support',      to: '/vendor/support' },
  { icon: 'settings',         label: 'Settings',     to: '/vendor/settings' },
];

function BrandIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#2563EB"/>
      <path d="M8 22L12 10l4 8 4-8 4 12" stroke="#fff" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/**
 * VendorLayout
 * Dark sidebar + top header + content area.
 * All /vendor/* routes render inside the <Outlet />.
 */
export default function VendorLayout({ vendorName = 'My Store', vendorAvatar = null }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sv-vendor-layout${collapsed ? ' sv-vendor-layout--collapsed' : ''}`}>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="sv-vsidebar" aria-label="Vendor navigation">
        <div className="sv-vsidebar__header">
          <Link to="/vendor/dashboard" className="sv-vsidebar__brand" aria-label="Dashboard">
            <BrandIcon />
            {!collapsed && (
              <div className="sv-vsidebar__brand-text">
                <span className="sv-vsidebar__brand-name">ShopVerse</span>
                <span className="sv-vsidebar__brand-sub">Seller Hub</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="sv-vsidebar__nav">
          <ul className="list-unstyled mb-0">
            {VENDOR_NAV.map(({ icon, label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `sv-vsidebar__link${isActive ? ' sv-vsidebar__link--active' : ''}`
                  }
                  title={collapsed ? label : undefined}
                >
                  <span className="material-symbols-outlined sv-vsidebar__link-icon" aria-hidden="true">
                    {icon}
                  </span>
                  {!collapsed && <span className="sv-vsidebar__link-label">{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sv-vsidebar__footer">
          <Link to="/" className="sv-vsidebar__link sv-vsidebar__link--exit" title="Back to store">
            <span className="material-symbols-outlined sv-vsidebar__link-icon" aria-hidden="true">storefront</span>
            {!collapsed && <span className="sv-vsidebar__link-label">Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────────── */}
      <div className="sv-vendor-main">

        {/* Top header */}
        <header className="sv-vheader" aria-label="Vendor dashboard header">
          <button
            className="sv-vheader__collapse"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            type="button"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {collapsed ? 'menu_open' : 'menu'}
            </span>
          </button>

          <div className="sv-vheader__title" aria-live="polite">Vendor Dashboard</div>

          <div className="sv-vheader__actions">
            <button className="sv-vheader__icon-btn" type="button" aria-label="Notifications">
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
              <span className="sv-vheader__notif-dot" aria-hidden="true" />
            </button>
            <div className="sv-vheader__vendor">
              {vendorAvatar ? (
                <img src={vendorAvatar} alt={vendorName} className="sv-vheader__avatar" />
              ) : (
                <span className="sv-vheader__avatar-icon material-symbols-outlined" aria-hidden="true">account_circle</span>
              )}
              <span className="sv-vheader__vendor-name d-none d-md-block">{vendorName}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="sv-vendor-content" id="vendor-main" tabIndex="-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import './Footer.css';

const FOOTER_LINKS = {
  'Shop': [
    { label: 'Electronics',    href: '/shop?cat=electronics' },
    { label: 'Fashion',        href: '/shop?cat=fashion' },
    { label: 'Home & Kitchen', href: '/shop?cat=home' },
    { label: 'Beauty',         href: '/shop?cat=beauty' },
    { label: 'Sports',         href: '/shop?cat=sports' },
    { label: 'View All',       href: '/shop' },
  ],
  'Sellers': [
    { label: 'Become a Seller',   href: '/seller-register' },
    { label: 'Seller Dashboard',  href: '/vendor/dashboard' },
    { label: 'Seller Guidelines', href: '/seller-guidelines' },
    { label: 'Seller Support',    href: '/seller-support' },
  ],
  'Help': [
    { label: 'Help Center',    href: '/support' },
    { label: 'Track Order',    href: '/track-order' },
    { label: 'Returns Policy', href: '/returns' },
    { label: 'FAQ',            href: '/faq' },
    { label: 'Contact Us',     href: '/contact' },
  ],
  'Company': [
    { label: 'About Us',       href: '/about' },
    { label: 'Careers',        href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use',   href: '/terms' },
  ],
};

const SOCIAL_LINKS = [
  { icon: 'language',  href: 'https://shopverse.in', label: 'Website' },
  { icon: 'send',      href: 'https://t.me/shopverse', label: 'Telegram' },
];

function BrandIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#2563EB"/>
      <path d="M8 22L12 10l4 8 4-8 4 12" stroke="#fff" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="sv-footer" aria-label="Site footer">
      <div className="container-xxl sv-footer__inner">

        {/* Brand + tagline */}
        <div className="sv-footer__brand">
          <Link to="/" className="sv-footer__logo" aria-label="ShopVerse home">
            <BrandIcon />
            <span className="sv-footer__logo-name">ShopVerse</span>
          </Link>
          <p className="sv-footer__tagline">
            India's trusted multi-vendor marketplace. Shop from 100+ verified sellers
            across every category with secure payments and easy returns.
          </p>
          <div className="sv-footer__social" aria-label="Social links">
            {SOCIAL_LINKS.map(({ icon, href, label }) => (
              <a key={label} href={href} className="sv-footer__social-btn"
                 target="_blank" rel="noopener noreferrer" aria-label={label}>
                <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading} className="sv-footer__col">
            <h3 className="sv-footer__heading">{heading}</h3>
            <ul className="sv-footer__list list-unstyled mb-0">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="sv-footer__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="sv-footer__bottom">
        <div className="container-xxl sv-footer__bottom-inner">
          <span>© {year} ShopVerse Technologies Pvt. Ltd. All rights reserved.</span>
          <div className="sv-footer__pay-icons" aria-label="Accepted payment methods">
            {['Visa', 'Mastercard', 'UPI', 'Net Banking', 'COD'].map((p) => (
              <span key={p} className="sv-footer__pay-badge">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

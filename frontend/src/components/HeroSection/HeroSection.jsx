import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import './HeroSection.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const SIDEBAR_CATEGORIES = [
  { icon: 'devices', label: 'Electronics' },
  { icon: 'checkroom', label: 'Fashion' },
  { icon: 'kitchen', label: 'Home & Kitchen' },
  { icon: 'face_retouching_natural', label: 'Beauty & Personal Care' },
  { icon: 'sports_basketball', label: 'Sports & Outdoors' },
  { icon: 'menu_book', label: 'Books & Stationery' },
  { icon: 'toys', label: 'Toys & Games' },
  { icon: 'directions_car', label: 'Automotive' },
];

const HERO_SLIDES = [
  {
    id: 1,
    badge: 'Big Savings on Top Brands',
    title: 'Shop from Multiple Vendors\nOne Marketplace,',
    accent: 'Unlimited Choices',
    sub: 'Electronics, Fashion, Home & more — all in one place',
    cta: 'Shop Now',
    href: '/shop',
    bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%)',
  },
  {
    id: 2,
    badge: 'Flash Deals Live',
    title: 'Top Brands, Best Prices\nEvery Day,',
    accent: 'Guaranteed Savings',
    sub: 'Up to 70% off on electronics, fashion & more',
    cta: 'View Deals',
    href: '/deals',
    bg: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #F0FDF4 100%)',
  },
  {
    id: 3,
    badge: 'New Arrivals',
    title: 'Fresh Styles Every Week\nDiscover,',
    accent: 'Trending Now',
    sub: 'Curated collections from verified vendors across India',
    cta: 'Explore Now',
    href: '/new-arrivals',
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FFFBEB 100%)',
  },
];

const HERO_STATS = [
  { icon: 'group', value: '100+', label: 'Top Vendors' },
  { icon: 'inventory_2', value: '10,000+', label: 'Products' },
  { icon: 'verified_user', value: 'Trusted', label: 'Secure Shopping' },
];

const CATEGORY_ICONS = [
  { icon: 'headphones', label: 'Electronics', href: '/shop?cat=electronics', color: '#EFF6FF' },
  { icon: 'checkroom', label: 'Fashion', href: '/shop?cat=fashion', color: '#FDF2F8' },
  { icon: 'kitchen', label: 'Home & Kitchen', href: '/shop?cat=home', color: '#FFF7ED' },
  { icon: 'face_retouching_natural', label: 'Beauty', href: '/shop?cat=beauty', color: '#FDF4FF' },
  { icon: 'sports_basketball', label: 'Sports', href: '/shop?cat=sports', color: '#F0FDF4' },
  { icon: 'menu_book', label: 'Books', href: '/shop?cat=books', color: '#FFFBEB' },
  { icon: 'toys', label: 'Toys', href: '/shop?cat=toys', color: '#FFF1F2' },
  { icon: 'directions_car', label: 'Automotive', href: '/shop?cat=auto', color: '#F8FAFC' },
  { icon: 'diamond', label: 'Jewelry', href: '/shop?cat=jewelry', color: '#FDF4FF' },
  { icon: 'grid_view', label: 'View All', href: '/shop', color: '#EFF6FF' },
];

const TRUST_BADGES = [
  { icon: 'local_shipping', title: 'Free Shipping', sub: 'On orders above ₹499' },
  { icon: 'lock', title: 'Secure Payment', sub: '100% secure payments' },
  { icon: 'replay', title: 'Easy Returns', sub: '30-day return policy' },
  { icon: 'support_agent', title: '24/7 Support', sub: 'Dedicated support' },
  { icon: 'storefront', title: 'Vendor Protection', sub: 'Safe & trusted platform' },
];

const DEAL_PRODUCTS = [
  {
    id: 1, discount: 25, name: 'OnePlus Nord CE 4 Lite 5G', desc: '8GB RAM, 128GB Storage',
    price: '₹18,999', mrp: '₹24,999', vendor: 'TechWorld Store', rating: 4.5,
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2, discount: 30, name: "Men's Running Shoes", desc: 'Comfort & Lightweight',
    price: '₹1,399', mrp: '₹1,999', vendor: 'FootStyle Store', rating: 4.3,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3, discount: 20, name: 'boAt Wave Call Plus', desc: 'Bluetooth Calling Smartwatch',
    price: '₹1,599', mrp: '₹1,999', vendor: 'GadgetHub', rating: 4.6,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 4, discount: 15, name: 'Philips Air Fryer HD9252', desc: '4.1L, Rapid Air Technology',
    price: '₹6,799', mrp: '₹7,999', vendor: 'HomeNeeds', rating: 4.4,
    img: 'https://images.unsplash.com/photo-1585669183285-c5f0e4b8b4d2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 5, discount: 25, name: 'Beardo Whisky Smoke', desc: 'Premium Perfume 100ml',
    price: '₹899', mrp: '₹1,199', vendor: 'BeautyCare', rating: 4.2,
    img: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=200&q=80',
  },
];

const TOP_CATEGORIES = [
  { label: 'Electronics', img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=300&q=80', count: '2,450+ products' },
  { label: 'Fashion', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80', count: '5,120+ products' },
  { label: 'Home & Kitchen', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=300&q=80', count: '3,890+ products' },
  { label: 'Beauty', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80', count: '1,760+ products' },
  { label: 'Sports', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=300&q=80', count: '2,200+ products' },
  { label: 'Books', img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=300&q=80', count: '8,500+ products' },
];

const FEATURED_PRODUCTS = [
  {
    id: 101, tag: 'Best Seller', name: 'Apple iPhone 15 Pro', desc: '128GB, Natural Titanium',
    price: '₹1,24,900', mrp: '₹1,34,900', vendor: 'Apple Flagship Store', rating: 4.9,
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 102, tag: 'Hot Brand', name: 'Sony WH-1000XM5 ANC', desc: 'Industry Leading Noise Cancellation',
    price: '₹29,999', mrp: '₹34,999', vendor: 'Sony India', rating: 4.8,
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 103, tag: 'Premium', name: 'Dell XPS 13 Core Ultra', desc: '16GB RAM, 512GB Intel Evo SSD',
    price: '₹98,999', mrp: '₹1,14,999', vendor: 'Dell Authorized Store', rating: 4.7,
    img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 104, tag: 'Popular', name: 'Nike Zoom Fly 5', desc: 'Road Running Shoes for Men',
    price: '₹11,995', mrp: '₹14,995', vendor: 'Nike Official Store', rating: 4.6,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
  },
];

const TRENDING_PRODUCTS = [
  {
    id: 201, tag: 'AI Enabled', name: 'Samsung Galaxy S24 Ultra', desc: '12GB RAM, 256GB Storage, S-Pen',
    price: '₹1,29,999', mrp: '₹1,39,999', vendor: 'Samsung Plaza', rating: 4.9,
    img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 202, tag: 'New iPad', name: 'iPad Air M2 Display', desc: '11-inch Liquid Retina Display',
    price: '₹59,900', mrp: '₹64,900', vendor: 'Apple Flagship Store', rating: 4.8,
    img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 203, tag: 'Instax', name: 'Fujifilm Instax Mini 12', desc: 'Instant Film Camera, White',
    price: '₹5,999', mrp: '₹6,999', vendor: 'PhotoWorld Store', rating: 4.5,
    img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 204, tag: 'Nespresso', name: 'Nespresso Vertuo Next', desc: 'Premium Coffee Espresso Maker',
    price: '₹15,999', mrp: '₹18,999', vendor: 'Nestle Home', rating: 4.6,
    img: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=300&q=80',
  },
];

const FEATURED_VENDORS = [
  {
    id: 1, name: 'TechWorld Store', rating: 4.8, count: '1.2k products', verified: true, logo: 'devices',
    banner: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 2, name: 'FootStyle Store', rating: 4.6, count: '850 products', verified: true, logo: 'checkroom',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 3, name: 'Apple Authorized', rating: 4.9, count: '320 products', verified: true, logo: 'phone_iphone',
    banner: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 4, name: 'HomeNeeds Direct', rating: 4.5, count: '2.1k products', verified: false, logo: 'kitchen',
    banner: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=300&q=80'
  }
];

const PROMO_BANNERS = [
  {
    id: 1, tag: 'Limited Offer', title: 'Premium Audio Gear', desc: 'Get up to 50% Off on Sony, Bose, and boAt products.',
    cta: 'Grab Offer', bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 2, tag: 'Work From Home', title: 'Ergonomic Desk setups', desc: 'Level up your productivity with modern utility tables.',
    cta: 'Explore Setup', bg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=200&q=80'
  }
];

const TOP_BRANDS = [
  { name: 'Apple', desc: 'Original Authorized', icon: 'star' },
  { name: 'Sony', desc: 'Premium Electronics', icon: 'headphones' },
  { name: 'Samsung', desc: 'Innovative Tech', icon: 'devices' },
  { name: 'Nike', desc: 'Athletic Footwear', icon: 'sports_basketball' },
  { name: 'boAt', desc: 'Wireless Audio', icon: 'speaker' },
  { name: 'Philips', desc: 'Smart Home Living', icon: 'lightbulb' }
];

/* ══════════════════════════════════════════════════════
   COUNTDOWN HOOK
══════════════════════════════════════════════════════ */
function useCountdown(total) {
  const [secs, setSecs] = useState(total);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  return {
    h: String(Math.floor(secs / 3600)).padStart(2, '0'),
    m: String(Math.floor((secs % 3600) / 60)).padStart(2, '0'),
    s: String(secs % 60).padStart(2, '0'),
  };
}

/* ══════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════ */

/* Star rating */
function Stars({ rating }) {
  return (
    <span className="sv-stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`material-symbols-outlined sv-star${i <= Math.round(rating) ? ' sv-star--filled' : ''}`} aria-hidden="true">
          star
        </span>
      ))}
      <span className="sv-rating-val">{rating}</span>
    </span>
  );
}

/* Generic Product Card */
function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const navigator = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="sv-deal-card" role="article" aria-label={product.name}>
      {product.discount && <span className="sv-deal-badge">-{product.discount}%</span>}
      {product.tag && <span className="sv-deal-badge sv-deal-badge--tag">{product.tag}</span>}
      <button
        className={`sv-deal-wish${wished ? ' sv-deal-wish--active' : ''}`}
        onClick={() => setWished((v) => !v)}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <span className={`material-symbols-outlined${wished ? ' sv-icon--filled' : ''}`} aria-hidden="true">favorite</span>
      </button>
      <div className="sv-deal-img-wrap">
        <img src={product.img} alt={product.name} className="sv-deal-img" loading="lazy" />
      </div>
      <div className="sv-deal-body">
        <p className="sv-deal-name">{product.name}</p>
        <p className="sv-deal-desc">{product.desc}</p>
        <div className="sv-deal-price-row">
          <span className="sv-deal-price">{product.price}</span>
          {product.mrp && <span className="sv-deal-mrp">{product.mrp}</span>}
        </div>
        <div className="sv-deal-meta">
          <span className="sv-deal-vendor">{product.vendor}</span>
          <Stars rating={product.rating} />
        </div>
        <button
          className="sv-deal-add-btn"
          type="button"
          aria-label={`Add ${product.name} to cart`}
          onClick={async () => {
            const res = await addToCart(product.id, null, 1);
            if (res.success) {
              navigator('/cart');
            }
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════ */
export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const countdown = useCountdown(8 * 3600 + 45 * 60 + 32);
  const autoRef = useRef(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const goTo = (i) => { setSlide(i); setAnimKey((k) => k + 1); };
  const prev = () => goTo((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => goTo((slide + 1) % HERO_SLIDES.length);

  useEffect(() => {
    autoRef.current = setInterval(next, 5000);
    return () => clearInterval(autoRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const current = HERO_SLIDES[slide];

  return (
    <div className="sv-home">

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO (sidebar + banner + stats)
      ══════════════════════════════════════════ */}
      <section className="sv-hero-section" aria-label="Hero banner">
        <div className="container-xxl sv-hero-section__inner">

          {/* Left: Category Sidebar */}
          <aside className="sv-sidebar d-none d-lg-flex flex-column" aria-label="Browse categories">
            <div className="sv-sidebar__header">
              <span className="material-symbols-outlined" aria-hidden="true">dashboard</span>
              All Categories
            </div>
            <ul className="sv-sidebar__list list-unstyled mb-0">
              {SIDEBAR_CATEGORIES.map(({ icon, label }) => (
                <li key={label}>
                  <a href={`/shop?cat=${label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                    className="sv-sidebar__item">
                    <span className="material-symbols-outlined sv-sidebar__icon" aria-hidden="true">{icon}</span>
                    <span className="sv-sidebar__label">{label}</span>
                    <span className="material-symbols-outlined sv-sidebar__arrow" aria-hidden="true">chevron_right</span>
                  </a>
                </li>
              ))}
            </ul>
            <a href="/shop" className="sv-sidebar__viewall">
              <span className="material-symbols-outlined" aria-hidden="true">apps</span>
              View All Categories
              <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
            </a>
          </aside>

          {/* Center: Hero Banner */}
          <div
            className="sv-banner"
            style={{ background: current.bg }}
            aria-live="polite"
            aria-label="Promotional banner"
          >
            {/* Content */}
            <div className="sv-banner__content" key={animKey}>
              <span className="sv-banner__badge">
                <span className="material-symbols-outlined sv-banner__badge-icon" aria-hidden="true">bolt</span>
                {current.badge}
              </span>
              <h1 className="sv-banner__title">
                {current.title.split('\n').map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
                {' '}
                <span className="sv-banner__accent">{current.accent}</span>
              </h1>
              <p className="sv-banner__sub">{current.sub}</p>
              <a href={current.href} className="sv-banner__cta">
                {current.cta}
                <svg viewBox="0 0 20 20" fill="currentColor" className="sv-banner__cta-arrow" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h9.586L10.293 5.707a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

            {/* Prev/next arrows */}
            <button className="sv-banner__arrow sv-banner__arrow--prev" onClick={prev} aria-label="Previous slide" type="button">
              <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
            </button>
            <button className="sv-banner__arrow sv-banner__arrow--next" onClick={next} aria-label="Next slide" type="button">
              <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
            </button>

            {/* Dot indicators */}
            <div className="sv-banner__dots" role="tablist" aria-label="Slide indicators">
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  className={`sv-banner__dot${i === slide ? ' sv-banner__dot--active' : ''}`}
                  role="tab"
                  aria-selected={i === slide}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  type="button"
                />
              ))}
            </div>
          </div>

          {/* Right: Stats Panel */}
          <div className="sv-stats d-none d-xl-flex flex-column gap-3" aria-label="Platform highlights">
            {HERO_STATS.map(({ icon, value, label }) => (
              <div key={label} className="sv-stat-card">
                <div className="sv-stat-icon-wrap">
                  <span className="material-symbols-outlined sv-stat-icon" aria-hidden="true">{icon}</span>
                </div>
                <div>
                  <div className="sv-stat-value">{value}</div>
                  <div className="sv-stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — CATEGORY ICON ROW
      ══════════════════════════════════════════ */}
      <section className="sv-cat-row" aria-label="Browse by category">
        <div className="container-xxl">
          <div className="sv-cat-row__grid">
            {CATEGORY_ICONS.map(({ icon, label, href, color }) => (
              <a key={label} href={href} className="sv-cat-pill" aria-label={`Browse ${label}`}>
                <div className="sv-cat-pill__icon" style={{ background: color }}>
                  <span className="material-symbols-outlined sv-cat-pill__sym" aria-hidden="true">{icon}</span>
                </div>
                <span className="sv-cat-pill__label">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — TRUST BADGES
      ══════════════════════════════════════════ */}
      <section className="sv-trust" aria-label="Why shop with us">
        <div className="container-xxl">
          <div className="sv-trust__grid">
            {TRUST_BADGES.map(({ icon, title, sub }) => (
              <div key={title} className="sv-trust__item">
                <div className="sv-trust__icon-wrap" aria-hidden="true">
                  <span className="material-symbols-outlined sv-trust__icon">{icon}</span>
                </div>
                <div>
                  <div className="sv-trust__title">{title}</div>
                  <div className="sv-trust__sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — DEALS OF THE DAY (FLASH SALE)
      ══════════════════════════════════════════ */}
      <section className="sv-deals" aria-label="Deals of the Day">
        <div className="container-xxl">
          <div className="sv-section-header">
            <div className="sv-section-header__left">
              <h2 className="sv-section-title">Deals of the Day</h2>
              <div className="sv-timer" aria-label="Time remaining">
                <div className="sv-timer__unit">
                  <span className="sv-timer__val">{countdown.h}</span>
                  <span className="sv-timer__label">Hrs</span>
                </div>
                <span className="sv-timer__sep" aria-hidden="true">:</span>
                <div className="sv-timer__unit">
                  <span className="sv-timer__val">{countdown.m}</span>
                  <span className="sv-timer__label">Mins</span>
                </div>
                <span className="sv-timer__sep" aria-hidden="true">:</span>
                <div className="sv-timer__unit">
                  <span className="sv-timer__val">{countdown.s}</span>
                  <span className="sv-timer__label">Secs</span>
                </div>
              </div>
            </div>
            <a href="/deals" className="sv-view-all-btn">View All Deals</a>
          </div>

          <div className="sv-deals__grid">
            {DEAL_PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — TOP CATEGORIES
      ══════════════════════════════════════════ */}
      <section className="sv-top-cats" aria-label="Top Categories">
        <div className="container-xxl">
          <div className="sv-section-header">
            <h2 className="sv-section-title">Top Categories</h2>
            <a href="/shop" className="sv-view-all-btn">View All</a>
          </div>

          <div className="sv-top-cats__grid">
            {TOP_CATEGORIES.map(({ label, img, count }) => (
              <a
                key={label}
                href={`/shop?cat=${label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="sv-top-cat-card"
                aria-label={`Browse ${label}`}
              >
                <div className="sv-top-cat-card__img-wrap">
                  <img src={img} alt={label} className="sv-top-cat-card__img" loading="lazy" />
                  <div className="sv-top-cat-card__overlay" aria-hidden="true" />
                </div>
                <div className="sv-top-cat-card__body">
                  <span className="sv-top-cat-card__label">{label}</span>
                  <span className="sv-top-cat-card__count">{count}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — FEATURED PRODUCTS
      ══════════════════════════════════════════ */}
      <section className="sv-featured-products" aria-label="Featured Products">
        <div className="container-xxl">
          <div className="sv-section-header">
            <h2 className="sv-section-title">Featured Products</h2>
            <a href="/shop" className="sv-view-all-btn">View Featured</a>
          </div>
          <div className="sv-deals__grid">
            {FEATURED_PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7 — PROMOTIONAL BANNERS
      ══════════════════════════════════════════ */}
      <section className="sv-promo-banners" aria-label="Promotional Offers">
        <div className="container-xxl">
          <div className="sv-promo-grid">
            {PROMO_BANNERS.map((banner) => (
              <div key={banner.id} className="sv-promo-card" style={{ background: banner.bg }}>
                <div className="sv-promo-card__body">
                  <span className="sv-promo-card__tag">{banner.tag}</span>
                  <h3 className="sv-promo-card__title">{banner.title}</h3>
                  <p className="sv-promo-card__desc">{banner.desc}</p>
                  <a href="/shop" className="sv-promo-card__btn">{banner.cta}</a>
                </div>
                <div className="sv-promo-card__img-wrap">
                  <img src={banner.img} alt={banner.title} className="sv-promo-card__img" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 8 — TRENDING PRODUCTS
      ══════════════════════════════════════════ */}
      <section className="sv-trending-products" aria-label="Trending Products">
        <div className="container-xxl">
          <div className="sv-section-header">
            <h2 className="sv-section-title">Trending Products</h2>
            <a href="/shop" className="sv-view-all-btn">View Trending</a>
          </div>
          <div className="sv-deals__grid">
            {TRENDING_PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 9 — FEATURED VENDORS
      ══════════════════════════════════════════ */}
      <section className="sv-featured-vendors" aria-label="Featured Vendors">
        <div className="container-xxl">
          <div className="sv-section-header">
            <h2 className="sv-section-title">Featured Vendors</h2>
            <a href="/vendors" className="sv-view-all-btn">View All Vendors</a>
          </div>

          <div className="sv-vendors-grid">
            {FEATURED_VENDORS.map((v) => (
              <div key={v.id} className="sv-vendor-shop-card">
                <div className="sv-vendor-shop-card__banner">
                  <img src={v.banner} alt="" className="sv-vendor-shop-card__banner-img" loading="lazy" />
                  <div className="sv-vendor-shop-card__overlay" />
                </div>
                <div className="sv-vendor-shop-card__body">
                  <div className="sv-vendor-shop-card__badge-wrap">
                    <div className="sv-vendor-shop-card__logo">
                      <span className="material-symbols-outlined">{v.logo}</span>
                    </div>
                    {v.verified && (
                      <span className="sv-vendor-shop-card__verified" title="Verified Vendor">
                        <span className="material-symbols-outlined">verified</span>
                      </span>
                    )}
                  </div>
                  <h3 className="sv-vendor-shop-card__name">{v.name}</h3>
                  <div className="sv-vendor-shop-card__meta">
                    <Stars rating={v.rating} />
                    <span className="sv-vendor-shop-card__count">{v.count}</span>
                  </div>
                  <a href={`/shop?vendor=${v.id}`} className="sv-vendor-shop-card__visit">Visit Store</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 10 — TOP BRANDS
      ══════════════════════════════════════════ */}
      <section className="sv-top-brands" aria-label="Top Brands">
        <div className="container-xxl">
          <div className="sv-section-header">
            <h2 className="sv-section-title">Top Brands</h2>
          </div>
          <div className="sv-brands-grid">
            {TOP_BRANDS.map((b) => (
              <div key={b.name} className="sv-brand-card">
                <span className="material-symbols-outlined sv-brand-card__icon">{b.icon}</span>
                <span className="sv-brand-card__name">{b.name}</span>
                <span className="sv-brand-card__desc">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 11 — NEWSLETTER
      ══════════════════════════════════════════ */}
      <section className="sv-newsletter" aria-label="Newsletter subscription">
        <div className="container-xxl">
          <div className="sv-newsletter__content">
            <div className="sv-newsletter__text">
              <span className="sv-newsletter__badge">Stay Updated</span>
              <h2 className="sv-newsletter__title">Subscribe to our Newsletter</h2>
              <p className="sv-newsletter__desc">Get updates on new store arrivals, special vendor deals, and limited-time coupons.</p>
            </div>
            <form onSubmit={handleSubscribe} className="sv-newsletter__form">
              {subscribed ? (
                <div className="sv-newsletter__success">
                  <span className="material-symbols-outlined">check_circle</span>
                  Thank you! You have successfully subscribed to ShopVerse.
                </div>
              ) : (
                <div className="sv-newsletter__group">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="sv-newsletter__input"
                  />
                  <button type="submit" className="sv-newsletter__btn">Subscribe</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}

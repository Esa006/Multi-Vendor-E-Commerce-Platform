import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import './ShopPage.css';

/* ══════════════════════════════════════════════════════
   MOCK PRODUCT DATA (24 Items for Pagination & Filters)
══════════════════════════════════════════════════════ */
const PRODUCTS_DATA = [
  {
    id: 1, name: 'Apple iPhone 15 Pro', sku: 'SKU-APL-15P', category: 'electronics', subcategory: 'mobiles',
    brand: 'Apple', vendor: 'Apple Flagship Store', price: 124900, mrp: 134900, rating: 4.9, reviews: 245,
    inStock: true, stockCount: 14, discount: 7, featured: true,
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2, name: 'Sony WH-1000XM5 ANC Headphones', sku: 'SKU-SNY-XM5', category: 'electronics', subcategory: 'audio',
    brand: 'Sony', vendor: 'Sony India', price: 29999, mrp: 34999, rating: 4.8, reviews: 182,
    inStock: true, stockCount: 8, discount: 14, featured: true,
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3, name: 'Dell XPS 13 Core Ultra Laptop', sku: 'SKU-DEL-X13', category: 'electronics', subcategory: 'laptops',
    brand: 'Dell', vendor: 'Dell Authorized Store', price: 98999, mrp: 114999, rating: 4.7, reviews: 94,
    inStock: true, stockCount: 5, discount: 13, featured: false,
    img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4, name: 'Nike Zoom Fly 5 Running Shoes', sku: 'SKU-NKE-ZF5', category: 'fashion', subcategory: 'shoes',
    brand: 'Nike', vendor: 'Nike Official Store', price: 11995, mrp: 14995, rating: 4.6, reviews: 112,
    inStock: true, stockCount: 22, discount: 20, featured: true,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 5, name: 'Samsung Galaxy S24 Ultra', sku: 'SKU-SAM-S24U', category: 'electronics', subcategory: 'mobiles',
    brand: 'Samsung', vendor: 'Samsung Plaza', price: 129999, mrp: 139999, rating: 4.9, reviews: 310,
    inStock: true, stockCount: 11, discount: 7, featured: true,
    img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 6, name: 'boAt Wave Call Plus Smartwatch', sku: 'SKU-BOT-WCP', category: 'electronics', subcategory: 'wearables',
    brand: 'boAt', vendor: 'GadgetHub Store', price: 1599, mrp: 1999, rating: 4.4, reviews: 1205,
    inStock: true, stockCount: 45, discount: 20, featured: false,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 7, name: 'Philips Air Fryer HD9252', sku: 'SKU-PHL-AF9', category: 'home', subcategory: 'kitchen',
    brand: 'Philips', vendor: 'HomeNeeds Direct', price: 6799, mrp: 7999, rating: 4.5, reviews: 88,
    inStock: true, stockCount: 3, discount: 15, featured: false,
    img: 'https://images.unsplash.com/photo-1585669183285-c5f0e4b8b4d2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 8, name: 'Beardo Whisky Smoke Perfume', sku: 'SKU-BRD-WSP', category: 'beauty', subcategory: 'fragrance',
    brand: 'Beardo', vendor: 'BeautyCare Shop', price: 899, mrp: 1199, rating: 4.2, reviews: 76,
    inStock: true, stockCount: 19, discount: 25, featured: false,
    img: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 9, name: 'Fujifilm Instax Mini 12', sku: 'SKU-FJF-M12', category: 'electronics', subcategory: 'cameras',
    brand: 'Fujifilm', vendor: 'PhotoWorld Store', price: 5999, mrp: 6999, rating: 4.5, reviews: 143,
    inStock: true, stockCount: 7, discount: 14, featured: true,
    img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 10, name: "Levi's Men's 511 Slim Fit Jeans", sku: 'SKU-LEV-511', category: 'fashion', subcategory: 'clothing',
    brand: 'Levis', vendor: 'Denim Depot', price: 2199, mrp: 3299, rating: 4.3, reviews: 92,
    inStock: true, stockCount: 15, discount: 33, featured: false,
    img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 11, name: 'Nespresso Vertuo Next Coffee Maker', sku: 'SKU-NES-VNC', category: 'home', subcategory: 'kitchen',
    brand: 'Nespresso', vendor: 'Nestle Home', price: 15999, mrp: 18999, rating: 4.6, reviews: 52,
    inStock: false, stockCount: 0, discount: 15, featured: true,
    img: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 12, name: 'OnePlus Nord CE 4 Lite 5G', sku: 'SKU-ONP-NCE4', category: 'electronics', subcategory: 'mobiles',
    brand: 'OnePlus', vendor: 'TechWorld Store', price: 18999, mrp: 24999, rating: 4.5, reviews: 820,
    inStock: true, stockCount: 2, discount: 24, featured: false,
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 13, name: 'Samsung 55" QLED 4K Smart TV', sku: 'SKU-SAM-Q55', category: 'electronics', subcategory: 'tv',
    brand: 'Samsung', vendor: 'Samsung Plaza', price: 64999, mrp: 79999, rating: 4.8, reviews: 118,
    inStock: true, stockCount: 4, discount: 18, featured: true,
    img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 14, name: 'Casio G-Shock Sport Analog-Digital', sku: 'SKU-CAS-GSK', category: 'fashion', subcategory: 'watches',
    brand: 'Casio', vendor: 'WatchStudio', price: 8495, mrp: 9995, rating: 4.7, reviews: 204,
    inStock: true, stockCount: 16, discount: 15, featured: false,
    img: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 15, name: 'Aeropress Original Coffee Maker', sku: 'SKU-AER-ORG', category: 'home', subcategory: 'kitchen',
    brand: 'Aeropress', vendor: 'Nestle Home', price: 3499, mrp: 3999, rating: 4.8, reviews: 312,
    inStock: true, stockCount: 25, discount: 12, featured: false,
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 16, name: 'MacBook Air M3 13-inch', sku: 'SKU-APL-MBA3', category: 'electronics', subcategory: 'laptops',
    brand: 'Apple', vendor: 'Apple Flagship Store', price: 104900, mrp: 114900, rating: 4.9, reviews: 98,
    inStock: true, stockCount: 6, discount: 8, featured: true,
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 17, name: 'Logitech MX Master 3S Mouse', sku: 'SKU-LOG-MX3S', category: 'electronics', subcategory: 'accessories',
    brand: 'Logitech', vendor: 'TechWorld Store', price: 9499, mrp: 10995, rating: 4.8, reviews: 412,
    inStock: true, stockCount: 18, discount: 13, featured: false,
    img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 18, name: 'Ray-Ban Classic Wayfarer Sunglasses', sku: 'SKU-RYB-WFR', category: 'fashion', subcategory: 'accessories',
    brand: 'Ray-Ban', vendor: 'Denim Depot', price: 8290, mrp: 9990, rating: 4.6, reviews: 154,
    inStock: true, stockCount: 9, discount: 17, featured: false,
    img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 19, name: 'Cosrx Advanced Snail 96 Mucin', sku: 'SKU-CSX-SN96', category: 'beauty', subcategory: 'skincare',
    brand: 'Cosrx', vendor: 'BeautyCare Shop', price: 1250, mrp: 1450, rating: 4.7, reviews: 890,
    inStock: true, stockCount: 30, discount: 13, featured: true,
    img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 20, name: 'CeraVe Hydrating Facial Cleanser', sku: 'SKU-CRV-HFC', category: 'beauty', subcategory: 'skincare',
    brand: 'CeraVe', vendor: 'BeautyCare Shop', price: 1150, mrp: 1250, rating: 4.6, reviews: 1054,
    inStock: true, stockCount: 14, discount: 8, featured: false,
    img: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 21, name: 'Adidas Ultraboost Light', sku: 'SKU-ADI-UBL', category: 'fashion', subcategory: 'shoes',
    brand: 'Adidas', vendor: 'FootStyle Store', price: 16999, mrp: 19999, rating: 4.7, reviews: 202,
    inStock: true, stockCount: 4, discount: 15, featured: true,
    img: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 22, name: 'Puma Evercat Contender Backpack', sku: 'SKU-PUM-ECB', category: 'sports', subcategory: 'bags',
    brand: 'Puma', vendor: 'FootStyle Store', price: 1899, mrp: 2999, rating: 4.4, reviews: 85,
    inStock: true, stockCount: 12, discount: 36, featured: false,
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 23, name: 'Decathlon Yoga Mat 8mm', sku: 'SKU-DEC-YM8', category: 'sports', subcategory: 'yoga',
    brand: 'Decathlon', vendor: 'SportsCentral', price: 999, mrp: 1499, rating: 4.5, reviews: 230,
    inStock: true, stockCount: 40, discount: 33, featured: false,
    img: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 24, name: 'Lamy Safari Fountain Pen', sku: 'SKU-LMY-SFP', category: 'books', subcategory: 'stationery',
    brand: 'Lamy', vendor: 'StationeryHub', price: 2350, mrp: 2800, rating: 4.6, reviews: 78,
    inStock: true, stockCount: 22, discount: 16, featured: true,
    img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=300&q=80',
  }
];

const AVAILABLE_BRANDS = ['Apple', 'Sony', 'Dell', 'Nike', 'Samsung', 'boAt', 'Philips', 'Beardo', 'Fujifilm', 'Levis', 'Nespresso', 'OnePlus', 'Casio', 'Aeropress', 'Logitech', 'Ray-Ban', 'Cosrx', 'CeraVe', 'Adidas', 'Puma', 'Decathlon', 'Lamy'];
const AVAILABLE_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home', label: 'Home & Kitchen' },
  { value: 'beauty', label: 'Beauty & Skincare' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'books', label: 'Books & Stationery' },
];

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════
   SHOP PAGE COMPONENT
══════════════════════════════════════════════════════ */
export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search/Filter States initialized from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'all');
  const [selectedBrands, setSelectedBrands] = useState(searchParams.getAll('brand') || []);
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice')) || 0,
    parseInt(searchParams.get('maxPrice')) || 150000
  ]);
  const [selectedRating, setSelectedRating] = useState(parseFloat(searchParams.get('rating')) || 0);
  const [availability, setAvailability] = useState(searchParams.get('avail') || 'all'); // 'all', 'instock', 'outofstock'
  const [minDiscount, setMinDiscount] = useState(parseInt(searchParams.get('discount')) || 0);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // States for UX actions
  const [isSearching, setIsSearching] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  // Debounced search trigger (300-500ms)
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Synchronize search params with URL
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (selectedCategory !== 'all') params.cat = selectedCategory;
    if (selectedBrands.length > 0) params.brand = selectedBrands;
    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 150000) params.maxPrice = priceRange[1];
    if (selectedRating > 0) params.rating = selectedRating;
    if (availability !== 'all') params.avail = availability;
    if (minDiscount > 0) params.discount = minDiscount;
    if (sortBy !== 'newest') params.sort = sortBy;
    if (currentPage > 1) params.page = currentPage;

    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, selectedBrands, priceRange, selectedRating, availability, minDiscount, sortBy, currentPage, setSearchParams]);

  // Handle Category click from hero section/url changes
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setSelectedCategory(cat);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Handle Quick Wishlist
  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // ── FILTER & SORT LOGIC ────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      // 1. Search Query (matches name, SKU, or brand)
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesBrand) return false;
      }

      // 2. Category
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // 4. Price range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // 5. Rating
      if (product.rating < selectedRating) {
        return false;
      }

      // 6. Availability
      if (availability === 'instock' && !product.inStock) return false;
      if (availability === 'outofstock' && product.inStock) return false;

      // 7. Discount
      if (product.discount < minDiscount) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating-desc': return b.rating - a.rating;
        case 'discount-desc': return b.discount - a.discount;
        case 'a-z': return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return b.id - a.id; // simulation: higher id = newer
      }
    });
  }, [debouncedSearch, selectedCategory, selectedBrands, priceRange, selectedRating, availability, minDiscount, sortBy]);

  // Reset page when filters modify result count
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedBrands, priceRange, selectedRating, availability, minDiscount, sortBy]);

  // ── PAGINATION LOGIC ───────────────────────────────────────────────────
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceRange([0, 150000]);
    setSelectedRating(0);
    setAvailability('all');
    setMinDiscount(0);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="sv-shop">
      {/* ── BREADCRUMB ── */}
      <div className="sv-breadcrumb-bar">
        <div className="container-xxl">
          <nav className="sv-breadcrumb" aria-label="Breadcrumb">
            <a href="/" className="sv-breadcrumb__link">Home</a>
            <span className="sv-breadcrumb__sep">/</span>
            <span className="sv-breadcrumb__active">Shop</span>
            {selectedCategory !== 'all' && (
              <>
                <span className="sv-breadcrumb__sep">/</span>
                <span className="sv-breadcrumb__active capitalize">{selectedCategory}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container-xxl sv-shop-layout">
        
        {/* ── FILTER SIDEBAR (Desktop sidebar & Mobile Drawer) ── */}
        <aside className={`sv-shop-sidebar${isSidebarOpen ? ' sv-shop-sidebar--open' : ''}`} aria-label="Product filters">
          <div className="sv-sidebar-header">
            <h3 className="sv-sidebar-title">Filters</h3>
            <button className="sv-sidebar-clear-btn" onClick={clearAllFilters}>Clear All</button>
            <button className="sv-sidebar-close d-lg-none" onClick={() => setIsSidebarOpen(false)} aria-label="Close filters">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="sv-sidebar-content">
            
            {/* Category Filter */}
            <div className="sv-filter-group">
              <h4 className="sv-filter-title">Categories</h4>
              <ul className="sv-filter-list list-unstyled">
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <button
                      className={`sv-filter-cat-btn${selectedCategory === cat.value ? ' active' : ''}`}
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand Filter */}
            <div className="sv-filter-group">
              <h4 className="sv-filter-title">Brands</h4>
              <div className="sv-filter-brand-scroll">
                {AVAILABLE_BRANDS.map((brand) => (
                  <label key={brand} className="sv-filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="sv-filter-group">
              <h4 className="sv-filter-title">Price Range</h4>
              <div className="sv-price-slider-info">
                <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="150000"
                step="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="sv-price-range"
              />
              <span className="sv-slider-help">Max Price: ₹{priceRange[1].toLocaleString('en-IN')}</span>
            </div>

            {/* Rating Filter */}
            <div className="sv-filter-group">
              <h4 className="sv-filter-title">Minimum Rating</h4>
              <ul className="sv-filter-rating-list list-unstyled">
                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                  <li key={rating}>
                    <button
                      className={`sv-filter-rating-btn${selectedRating === rating ? ' active' : ''}`}
                      onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                    >
                      <Stars rating={rating} />
                      <span className="sv-rating-label">&amp; Up</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability Filter */}
            <div className="sv-filter-group">
              <h4 className="sv-filter-title">Availability</h4>
              <label className="sv-filter-radio">
                <input
                  type="radio"
                  name="avail"
                  checked={availability === 'all'}
                  onChange={() => setAvailability('all')}
                />
                <span>All Products</span>
              </label>
              <label className="sv-filter-radio">
                <input
                  type="radio"
                  name="avail"
                  checked={availability === 'instock'}
                  onChange={() => setAvailability('instock')}
                />
                <span>In Stock Only</span>
              </label>
              <label className="sv-filter-radio">
                <input
                  type="radio"
                  name="avail"
                  checked={availability === 'outofstock'}
                  onChange={() => setAvailability('outofstock')}
                />
                <span>Out of Stock Only</span>
              </label>
            </div>

            {/* Discount Filter */}
            <div className="sv-filter-group">
              <h4 className="sv-filter-title">Minimum Discount</h4>
              <ul className="sv-filter-list list-unstyled">
                {[10, 20, 30].map((disc) => (
                  <li key={disc}>
                    <button
                      className={`sv-filter-cat-btn${minDiscount === disc ? ' active' : ''}`}
                      onClick={() => setMinDiscount(minDiscount === disc ? 0 : disc)}
                    >
                      {disc}% Off &amp; More
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </aside>

        {/* ── PRODUCT AREA ── */}
        <main className="sv-shop-content">
          
          {/* Shop Toolbar */}
          <div className="sv-shop-toolbar">
            <div className="sv-toolbar-left">
              <button className="sv-mobile-filter-trigger d-lg-none" onClick={() => setIsSidebarOpen(true)}>
                <span className="material-symbols-outlined">filter_list</span>
                Filters
              </button>
              <span className="sv-results-count">
                Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
              </span>
            </div>

            <div className="sv-toolbar-right">
              {/* Search input in toolbar */}
              <div className="sv-toolbar-search">
                <input
                  type="text"
                  placeholder="Search products, brands, SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sv-toolbar-search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="sv-toolbar-search-clear">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
                {isSearching && <span className="sv-search-loading-spinner" />}
              </div>

              {/* SortDropdown */}
              <div className="sv-toolbar-sort">
                <label htmlFor="sort-select">Sort By:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sv-sort-dropdown"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="discount-desc">Max Discount</option>
                  <option value="a-z">Name: A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          <div className="sv-active-filters">
            {selectedCategory !== 'all' && (
              <span className="sv-active-filter-badge">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>×</button>
              </span>
            )}
            {selectedBrands.map(b => (
              <span key={b} className="sv-active-filter-badge">
                {b}
                <button onClick={() => handleBrandChange(b)}>×</button>
              </span>
            ))}
            {selectedRating > 0 && (
              <span className="sv-active-filter-badge">
                {selectedRating}★ &amp; Up
                <button onClick={() => setSelectedRating(0)}>×</button>
              </span>
            )}
            {availability !== 'all' && (
              <span className="sv-active-filter-badge">
                {availability === 'instock' ? 'In Stock' : 'Out of Stock'}
                <button onClick={() => setAvailability('all')}>×</button>
              </span>
            )}
            {minDiscount > 0 && (
              <span className="sv-active-filter-badge">
                {minDiscount}%+ Off
                <button onClick={() => setMinDiscount(0)}>×</button>
              </span>
            )}
          </div>

          {/* Product Grid / Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="sv-empty-state" role="alert">
              <span className="material-symbols-outlined sv-empty-icon">search_off</span>
              <h3 className="sv-empty-title">No Products Found</h3>
              <p className="sv-empty-desc">Your filters didn't return any matches. Try clearing some options or searching for something else.</p>
              <button className="sv-view-all-btn" onClick={clearAllFilters}>Reset All Filters</button>
            </div>
          ) : (
            <div className="sv-shop-grid">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="sv-deal-card sv-shop-product-card" role="article" aria-label={product.name}>
                  {product.discount > 0 && <span className="sv-deal-badge">-{product.discount}%</span>}
                  {product.featured && <span className="sv-deal-badge sv-deal-badge--tag">Featured</span>}
                  
                  {/* Actions overlay buttons */}
                  <div className="sv-product-card__actions-overlay">
                    <button
                      className="sv-card-action-btn"
                      onClick={() => setQuickViewProduct(product)}
                      aria-label="Quick view product details"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                    <button
                      className={`sv-card-action-btn${wishlist.includes(product.id) ? ' active' : ''}`}
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>

                  <div className="sv-deal-img-wrap">
                    <img src={product.img} alt={product.name} className="sv-deal-img" loading="lazy" />
                  </div>

                  <div className="sv-deal-body">
                    <span className="sv-product-card__brand-label">{product.brand}</span>
                    <p className="sv-deal-name">{product.name}</p>
                    
                    <div className="sv-deal-price-row">
                      <span className="sv-deal-price">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.mrp && <span className="sv-deal-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>}
                    </div>

                    <div className="sv-deal-meta">
                      <span className="sv-deal-vendor">{product.vendor}</span>
                      <div className="sv-product-card__rating-row">
                        <Stars rating={product.rating} />
                        <span className="sv-product-card__review-count">({product.reviews})</span>
                      </div>
                    </div>

                    <div className="sv-product-card__footer-row">
                      <span className={`sv-stock-status${product.inStock ? ' in-stock' : ' out-of-stock'}`}>
                        {product.inStock ? (product.stockCount <= 5 ? `Only ${product.stockCount} Left` : 'In Stock') : 'Out of Stock'}
                      </span>
                    </div>

                    <button
                      className="sv-deal-add-btn"
                      disabled={!product.inStock}
                      type="button"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="sv-pagination-nav" aria-label="Shop products pagination">
              <ul className="sv-pagination list-unstyled">
                <li>
                  <button
                    className="sv-pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    aria-label="Go to previous page"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                    Prev
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <button
                      className={`sv-pagination-btn${currentPage === page ? ' active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Go to page ${page}`}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="sv-pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    aria-label="Go to next page"
                  >
                    Next
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </li>
              </ul>
            </nav>
          )}

        </main>

      </div>

      {/* ── QUICK VIEW MODAL ── */}
      {quickViewProduct && (
        <div className="sv-quickview-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="sv-quickview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sv-quickview-close" onClick={() => setQuickViewProduct(null)} aria-label="Close modal">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="sv-quickview-body">
              <div className="sv-quickview-img-wrap">
                <img src={quickViewProduct.img} alt={quickViewProduct.name} className="sv-quickview-img" />
              </div>
              <div className="sv-quickview-info">
                <span className="sv-quickview-brand">{quickViewProduct.brand}</span>
                <h3 className="sv-quickview-title">{quickViewProduct.name}</h3>
                <div className="sv-quickview-meta">
                  <Stars rating={quickViewProduct.rating} />
                  <span className="sv-quickview-reviews">({quickViewProduct.reviews} verified reviews)</span>
                </div>
                <div className="sv-quickview-vendor">Vendor: <strong>{quickViewProduct.vendor}</strong></div>
                <div className="sv-quickview-sku">SKU: <code>{quickViewProduct.sku}</code></div>
                
                <div className="sv-quickview-price-row">
                  <span className="sv-quickview-price">₹{quickViewProduct.price.toLocaleString('en-IN')}</span>
                  {quickViewProduct.mrp && <span className="sv-quickview-mrp">₹{quickViewProduct.mrp.toLocaleString('en-IN')}</span>}
                  {quickViewProduct.discount > 0 && <span className="sv-quickview-discount">({quickViewProduct.discount}% OFF)</span>}
                </div>

                <p className="sv-quickview-desc">Discover the premium quality and outstanding design from {quickViewProduct.brand}. Built with materials selected for durability and comfort.</p>

                <div className="sv-quickview-actions">
                  <button className="sv-deal-add-btn" disabled={!quickViewProduct.inStock}>
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {quickViewProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button
                    className={`sv-card-action-btn${wishlist.includes(quickViewProduct.id) ? ' active' : ''}`}
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                  >
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                </div>
                
                <div className="sv-quickview-status-row">
                  <span className={`sv-stock-status${quickViewProduct.inStock ? ' in-stock' : ' out-of-stock'}`}>
                    {quickViewProduct.inStock ? `In Stock (${quickViewProduct.stockCount} units remaining)` : 'Temporarily Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

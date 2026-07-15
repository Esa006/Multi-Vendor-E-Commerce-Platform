import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useCart } from '../../context/CartContext';
import './ShopPage.css';

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function Stars({ rating }) {
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  const roundedRating = Math.round(numericRating || 0);

  return (
    <span className="sv-stars" aria-label={`${numericRating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`material-symbols-outlined sv-star${i <= roundedRating ? ' sv-star--filled' : ''}`} aria-hidden="true">
          star
        </span>
      ))}
      <span className="sv-rating-val">{numericRating ? numericRating.toFixed(1) : '0.0'}</span>
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="sv-shop-grid">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="sv-deal-card" style={{ border: 'var(--border-default)' }}>
          <div className="sv-deal-img-wrap skeleton" style={{ height: '220px', background: 'var(--color-bg-muted)' }} />
          <div className="sv-deal-body" style={{ gap: '12px', padding: '16px' }}>
            <div className="skeleton" style={{ height: '12px', width: '30%', borderRadius: '4px', background: 'var(--color-slate-200)' }} />
            <div className="skeleton" style={{ height: '18px', width: '85%', borderRadius: '4px', background: 'var(--color-slate-200)' }} />
            <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '4px', background: 'var(--color-slate-200)' }} />
            <div className="skeleton" style={{ height: '36px', width: '100%', borderRadius: '8px', background: 'var(--color-slate-200)', marginTop: '12px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SHOP PAGE COMPONENT
══════════════════════════════════════════════════════ */
export default function ShopPage() {
  const {
    products,
    paginationData,
    loading,
    error,
    categories,
    brands,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    priceRange,
    setPriceRange,
    selectedRating,
    setSelectedRating,
    availability,
    setAvailability,
    minDiscount,
    setMinDiscount,
    sortBy,
    setSortBy,
    setCurrentPage,
    fetchShopProducts,
    resetFilters,
    handleBrandToggle
  } = useShop();

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <button className="sv-sidebar-clear-btn" onClick={resetFilters}>Clear All</button>
            <button className="sv-sidebar-close d-lg-none" onClick={() => setIsSidebarOpen(false)} aria-label="Close filters">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="sv-sidebar-content">
            
            {/* Category Filter */}
            <div className="sv-filter-group">
              <h4 className="sv-filter-title">Categories</h4>
              <ul className="sv-filter-list list-unstyled">
                <li>
                  <button
                    className={`sv-filter-cat-btn${selectedCategory === 'all' ? ' active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className={`sv-filter-cat-btn${selectedCategory === cat.slug ? ' active' : ''}`}
                      onClick={() => setSelectedCategory(cat.slug)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand Filter */}
            <div className="sv-filter-group">
              <h4 className="sv-filter-title">Brands</h4>
              <div className="sv-filter-brand-scroll">
                {brands.map((brand) => (
                  <label key={brand.id} className="sv-filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandToggle(brand.name)}
                    />
                    <span>{brand.name}</span>
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
                Showing {products.length > 0 ? (paginationData.current_page - 1) * paginationData.per_page + 1 : 0}–
                {Math.min(paginationData.current_page * paginationData.per_page, paginationData.total)} of {paginationData.total} results
              </span>
            </div>

            <div className="sv-toolbar-right">
              {/* Search input in toolbar */}
              <div className="sv-toolbar-search">
                <input
                  type="text"
                  placeholder="Search products, SKU, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sv-toolbar-search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="sv-toolbar-search-clear">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
                {loading && <span className="sv-search-loading-spinner" />}
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
                  <option value="best-selling">Best Selling</option>
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
                <button onClick={() => handleBrandToggle(b)}>×</button>
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

          {/* Product Grid / Error State / Loading State */}
          {error ? (
            <div className="sv-empty-state" role="alert" style={{ borderColor: 'var(--color-danger)' }}>
              <span className="material-symbols-outlined sv-empty-icon" style={{ color: 'var(--color-danger)' }}>error</span>
              <h3 className="sv-empty-title">Service Error</h3>
              <p className="sv-empty-desc">{error}</p>
              <button className="sv-view-all-btn" onClick={fetchShopProducts}>Retry Request</button>
            </div>
          ) : loading ? (
            <LoadingSkeleton />
          ) : products.length === 0 ? (
            <div className="sv-empty-state" role="alert">
              <span className="material-symbols-outlined sv-empty-icon">search_off</span>
              <h3 className="sv-empty-title">No Products Found</h3>
              <p className="sv-empty-desc">Your filters didn't return any matches. Try clearing some options or searching for something else.</p>
              <button className="sv-view-all-btn" onClick={resetFilters}>Reset All Filters</button>
            </div>
          ) : (
            <div className="sv-shop-grid">
              {products.map((product) => {
                const currentPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                const mrpValue = typeof product.mrp === 'string' ? parseFloat(product.mrp) : product.mrp;
                const isOutOfStock = product.stock <= 0;

                return (
                  <div key={product.id} className="sv-deal-card sv-shop-product-card" role="article" aria-label={product.name}>
                    {product.discount > 0 && <span className="sv-deal-badge">-{product.discount}%</span>}
                    {product.featured && <span className="sv-deal-badge sv-deal-badge--tag">Featured</span>}
                    
                    {/* Actions overlay buttons */}
                    <div className="sv-product-card__actions-overlay">
                      <button
                        className="sv-card-action-btn"
                        onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                        aria-label="Quick view product details"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      <button
                        className={`sv-card-action-btn${wishlist.includes(product.id) ? ' active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <span className="material-symbols-outlined">favorite</span>
                      </button>
                    </div>

                    <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="sv-deal-img-wrap">
                        <img src={product.thumbnail} alt={product.name} className="sv-deal-img" loading="lazy" />
                      </div>

                      <div className="sv-deal-body">
                        <span className="sv-product-card__brand-label">{product.brand?.name || 'Generic'}</span>
                        <p className="sv-deal-name">{product.name}</p>
                        
                        <div className="sv-deal-price-row">
                          <span className="sv-deal-price">₹{currentPrice.toLocaleString('en-IN')}</span>
                          {mrpValue && <span className="sv-deal-mrp">₹{mrpValue.toLocaleString('en-IN')}</span>}
                        </div>

                        <div className="sv-deal-meta">
                          <span className="sv-deal-vendor">{product.vendor?.store_name || 'Generic Store'}</span>
                          <div className="sv-product-card__rating-row">
                            <Stars rating={product.rating} />
                            <span className="sv-product-card__review-count">({product.reviews || 0})</span>
                          </div>
                        </div>

                        <div className="sv-product-card__footer-row">
                          <span className={`sv-stock-status${!isOutOfStock ? ' in-stock' : ' out-of-stock'}`}>
                            {isOutOfStock ? 'Out of Stock' : (product.stock <= 5 ? `Only ${product.stock} Left` : 'In Stock')}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="sv-deal-body" style={{ paddingTop: 0, paddingBottom: 16 }}>
                      <button
                        className="sv-deal-add-btn"
                        disabled={isOutOfStock}
                        type="button"
                        aria-label={`Add ${product.name} to cart`}
                        onClick={(e) => { e.stopPropagation(); addToCart(product.id, null, 1); }}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
                        {!isOutOfStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {paginationData.last_page > 1 && (
            <nav className="sv-pagination-nav" aria-label="Shop products pagination">
              <ul className="sv-pagination list-unstyled">
                <li>
                  <button
                    className="sv-pagination-btn"
                    disabled={paginationData.current_page === 1}
                    onClick={() => handlePageChange(paginationData.current_page - 1)}
                    aria-label="Go to previous page"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                    Prev
                  </button>
                </li>
                {Array.from({ length: paginationData.last_page }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <button
                      className={`sv-pagination-btn${paginationData.current_page === page ? ' active' : ''}`}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Go to page ${page}`}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="sv-pagination-btn"
                    disabled={paginationData.current_page === paginationData.last_page}
                    onClick={() => handlePageChange(paginationData.current_page + 1)}
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
                <img src={quickViewProduct.thumbnail} alt={quickViewProduct.name} className="sv-quickview-img" />
              </div>
              <div className="sv-quickview-info">
                <span className="sv-quickview-brand">{quickViewProduct.brand?.name || 'Generic'}</span>
                <h3 className="sv-quickview-title">{quickViewProduct.name}</h3>
                <div className="sv-quickview-meta">
                  <Stars rating={quickViewProduct.rating} />
                  <span className="sv-quickview-reviews">({quickViewProduct.reviews || 0} verified reviews)</span>
                </div>
                <div className="sv-quickview-vendor">Vendor: <strong>{quickViewProduct.vendor?.store_name || 'Generic Store'}</strong></div>
                <div className="sv-quickview-sku">SKU: <code>{quickViewProduct.sku}</code></div>
                
                <div className="sv-quickview-price-row">
                  <span className="sv-quickview-price">₹{(typeof quickViewProduct.price === 'string' ? parseFloat(quickViewProduct.price) : quickViewProduct.price).toLocaleString('en-IN')}</span>
                  {quickViewProduct.mrp && <span className="sv-quickview-mrp">₹{(typeof quickViewProduct.mrp === 'string' ? parseFloat(quickViewProduct.mrp) : quickViewProduct.mrp).toLocaleString('en-IN')}</span>}
                  {quickViewProduct.discount > 0 && <span className="sv-quickview-discount">({quickViewProduct.discount}% OFF)</span>}
                </div>

                <p className="sv-quickview-desc">Discover the premium quality and outstanding design from {quickViewProduct.brand?.name || 'Generic'}. Built with materials selected for durability and comfort.</p>

                <div className="sv-quickview-actions">
                  <button
                    className="sv-deal-add-btn"
                    disabled={quickViewProduct.stock <= 0}
                    onClick={() => {
                      addToCart(quickViewProduct.id, null, 1);
                      setQuickViewProduct(null); // Optional: close modal on add
                    }}
                  >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {quickViewProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button
                    className={`sv-card-action-btn${wishlist.includes(quickViewProduct.id) ? ' active' : ''}`}
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                  >
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                </div>
                
                <div className="sv-quickview-status-row">
                  <span className={`sv-stock-status${quickViewProduct.stock > 0 ? ' in-stock' : ' out-of-stock'}`}>
                    {quickViewProduct.stock > 0 ? `In Stock (${quickViewProduct.stock} units remaining)` : 'Temporarily Out of Stock'}
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

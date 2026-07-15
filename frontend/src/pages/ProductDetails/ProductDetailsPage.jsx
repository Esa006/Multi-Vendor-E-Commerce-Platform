import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getRelatedProducts, getProductReviews } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import './ProductDetailsPage.css';

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

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery
  const [selectedImage, setSelectedImage] = useState('');
  const [zoomStyle, setZoomStyle] = useState({});

  // Variants selection state
  const [selectedOptions, setSelectedOptions] = useState({});

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Tabs
  const [activeTab, setActiveTab] = useState('description');

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const prodData = await getProduct(slug);
        const productObj = prodData.data;

        if (productObj) {
          setProduct(productObj);
          setSelectedImage(productObj.thumbnail || '');
          
          // Pre-select first options for variants
          const initialOpts = {};
          productObj.variants?.forEach(v => {
            if (!initialOpts[v.name]) {
              initialOpts[v.name] = v.value;
            }
          });
          setSelectedOptions(initialOpts);

          // Save to Recently Viewed in localStorage
          const recentList = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
          const filtered = recentList.filter(item => item.id !== productObj.id);
          filtered.unshift({
            id: productObj.id,
            name: productObj.name,
            slug: productObj.slug,
            thumbnail: productObj.thumbnail,
            price: productObj.price
          });
          localStorage.setItem('recently_viewed', JSON.stringify(filtered.slice(0, 4)));

          // Fetch related & reviews
          const [relatedData, reviewsData] = await Promise.all([
            getRelatedProducts(slug).catch(() => ({ data: [] })),
            getProductReviews(slug).catch(() => ({ data: [] }))
          ]);
          setRelatedProducts(relatedData.data || []);
          setReviews(reviewsData.data || []);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product details. Make sure backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Load Recently Viewed list from storage on mount
  useEffect(() => {
    const recentList = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    setRecentlyViewed(recentList);
  }, [slug]);

  if (loading) {
    return (
      <div className="container-xxl" style={{ padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="skeleton" style={{ height: '480px', borderRadius: '12px', background: 'var(--color-bg-muted)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton" style={{ height: '32px', width: '80%', borderRadius: '6px', background: 'var(--color-bg-muted)' }} />
            <div className="skeleton" style={{ height: '20px', width: '40%', borderRadius: '4px', background: 'var(--color-bg-muted)' }} />
            <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: '8px', background: 'var(--color-bg-muted)' }} />
            <div className="skeleton" style={{ height: '40px', width: '50%', borderRadius: '6px', background: 'var(--color-bg-muted)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-xxl text-center" style={{ padding: '120px 24px' }}>
        <div className="sv-empty-state" role="alert" style={{ borderColor: 'var(--color-danger)' }}>
          <span className="material-symbols-outlined sv-empty-icon" style={{ color: 'var(--color-danger)' }}>error</span>
          <h3 className="sv-empty-title">Error</h3>
          <p className="sv-empty-desc">{error || 'Something went wrong.'}</p>
          <Link to="/shop" className="sv-view-all-btn">Back to Shop</Link>
        </div>
      </div>
    );
  }

  // Group variants by name (Color, Size, etc.)
  const groupedVariants = {};
  product.variants?.forEach(v => {
    if (!groupedVariants[v.name]) {
      groupedVariants[v.name] = [];
    }
    if (!groupedVariants[v.name].includes(v.value)) {
      groupedVariants[v.name].push(v.value);
    }
  });

  // Calculate pricing adjustments
  let currentPrice = parseFloat(product.price);
  let extraCost = 0;
  Object.keys(selectedOptions).forEach(name => {
    const val = selectedOptions[name];
    const matched = product.variants.find(v => v.name === name && v.value === val);
    if (matched && matched.price_override) {
      const overrideVal = parseFloat(matched.price_override);
      if (overrideVal < currentPrice * 0.5) {
        extraCost += overrideVal;
      } else {
        currentPrice = overrideVal;
      }
    }
  });
  const finalPrice = currentPrice + extraCost;
  const isOutOfStock = product.stock <= 0;

  // Find a specific variant ID matching the current size/storage choice to save in database
  const getChosenVariant = () => {
    const keys = Object.keys(selectedOptions);
    if (keys.length === 0) return null;
    // Prioritize Storage or Size for variant_id association
    const keyToFind = keys.find(k => k.toLowerCase() === 'storage' || k.toLowerCase() === 'size') || keys[0];
    const val = selectedOptions[keyToFind];
    return product.variants.find(v => v.name === keyToFind && v.value === val);
  };

  // Actions
  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    const chosenVariant = getChosenVariant();
    await addToCart(product.id, chosenVariant ? chosenVariant.id : null, quantity);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    const chosenVariant = getChosenVariant();
    const res = await addToCart(product.id, chosenVariant ? chosenVariant.id : null, quantity);
    if (res.success) {
      window.location.href = '/cart';
    }
  };

  // Magnifier Zoom Lens
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  const inWishlist = wishlistItems.some(item => item.product_id === product.id);

  // Set of images for the gallery (mock fallback if product.images is empty)
  const galleryImages = product.images && product.images.length > 0
    ? product.images.map(img => img.image_url)
    : [product.thumbnail];

  return (
    <motion.div
      className="sv-pdp"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── BREADCRUMB ── */}
      <div className="sv-breadcrumb-bar">
        <div className="container-xxl">
          <nav className="sv-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="sv-breadcrumb__link">Home</Link>
            <span className="sv-breadcrumb__sep">/</span>
            <Link to="/shop" className="sv-breadcrumb__link">Shop</Link>
            <span className="sv-breadcrumb__sep">/</span>
            <span className="sv-breadcrumb__active capitalize">{product.category?.name || 'Category'}</span>
            <span className="sv-breadcrumb__sep">/</span>
            <span className="sv-breadcrumb__active">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-xxl">
        <div className="sv-pdp-layout">
          
          {/* ── IMAGE GALLERY ── */}
          <div className="sv-pdp-gallery">
            <div
              className="sv-gallery-main"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={selectedImage}
                alt={product.name}
                className="sv-gallery-main-img"
                style={zoomStyle}
              />
            </div>
            
            {galleryImages.length > 1 && (
              <div className="sv-gallery-thumbs">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`sv-gallery-thumb-btn${selectedImage === img ? ' active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="sv-gallery-thumb-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT DETAILS INFO ── */}
          <div className="sv-pdp-info">
            <div className="sv-pdp-brand-vendor">
              <span className="sv-pdp-brand">{product.brand?.name || 'Generic'}</span>
              <span className="sv-pdp-vendor">Sold by: <strong>{product.vendor?.store_name || 'Generic Vendor'}</strong></span>
            </div>

            <h1 className="sv-pdp-title">{product.name}</h1>

            <div className="sv-pdp-rating-row">
              <Stars rating={product.rating} />
              <span className="sv-quickview-reviews">({product.reviews || 0} customer reviews)</span>
              <span className="sv-pdp-sku">SKU: <code>{product.sku}</code></span>
            </div>

            <div className="sv-pdp-price-row">
              <span className="sv-pdp-price">₹{finalPrice.toLocaleString('en-IN')}</span>
              {product.mrp && <span className="sv-pdp-mrp">₹{parseFloat(product.mrp).toLocaleString('en-IN')}</span>}
              {product.discount > 0 && <span className="sv-pdp-discount">{product.discount}% OFF</span>}
            </div>

            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>
              {product.description || 'Enjoy the premium performance and build quality designed to meet your expectations.'}
            </p>

            {/* ── VARIANTS SELECTOR ── */}
            {Object.keys(groupedVariants).length > 0 && (
              <div className="sv-pdp-variants-wrap">
                {Object.keys(groupedVariants).map((name) => (
                  <div key={name} className="sv-variant-group">
                    <span className="sv-variant-label">{name}: <span style={{ color: 'var(--color-brand-primary)' }}>{selectedOptions[name]}</span></span>
                    <div className="sv-variant-options">
                      {groupedVariants[name].map((value) => (
                        <button
                          key={value}
                          className={`sv-variant-option-btn${selectedOptions[name] === value ? ' active' : ''}`}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [name]: value }))}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── PURCHASE ACTION SECTION ── */}
            <div className="sv-pdp-purchase">
              <div className="sv-quantity-row">
                <span className="sv-variant-label">Quantity:</span>
                <div className="sv-quantity-selector">
                  <button
                    className="sv-qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="sv-qty-val">{quantity}</span>
                  <button
                    className="sv-qty-btn"
                    onClick={() => setQuantity(q => q + 1)}
                    disabled={quantity >= product.stock || isOutOfStock}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                
                <span className={`sv-stock-status${!isOutOfStock ? ' in-stock' : ' out-of-stock'}`} style={{ marginLeft: 'auto' }}>
                  {isOutOfStock ? 'Out of Stock' : (product.stock <= 5 ? `Only ${product.stock} Left` : 'In Stock')}
                </span>
              </div>

              <div className="sv-pdp-actions-row">
                <button
                  className="sv-pdp-btn sv-pdp-btn--cart"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Add to Cart
                </button>
                <button
                  className="sv-pdp-btn sv-pdp-btn--buy"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  Buy Now
                </button>
                <button
                  className={`sv-pdp-btn sv-pdp-btn--wishlist${inWishlist ? ' active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  aria-label="Toggle Wishlist"
                >
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── TABS SECTION ── */}
        <div className="sv-pdp-tabs-container">
          <div className="sv-tabs-header">
            <button
              className={`sv-tab-btn${activeTab === 'description' ? ' active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`sv-tab-btn${activeTab === 'specifications' ? ' active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button
              className={`sv-tab-btn${activeTab === 'reviews' ? ' active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="sv-tab-content">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '12px' }}>Product Overview</h4>
                  <p>{product.description || 'This item is crafted using high-grade materials to deliver exceptional efficiency, styling, and endurance. Fits perfectly in your day-to-day life and workflow.'}</p>
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <table className="table table-striped" style={{ margin: 0 }}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 'bold', width: '30%' }}>Model SKU</td>
                        <td>{product.sku}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold' }}>Brand Manufacturer</td>
                        <td>{product.brand?.name || 'Generic'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold' }}>Vendor Source</td>
                        <td>{product.vendor?.store_name || 'Generic Store'}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 'bold' }}>Dimensions</td>
                        <td>Standard Package</td>
                      </tr>
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="revs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="sv-reviews-tab"
                >
                  {reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <p>No verified customer reviews yet. Be the first to review this product!</p>
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="sv-review-card">
                        <div className="sv-review-header">
                          <span className="sv-review-author">{rev.user?.name || 'Verified Purchase'}</span>
                          <span className="sv-review-date">{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <Stars rating={rev.rating} />
                        </div>
                        <p className="sv-review-comment">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <div className="sv-pdp-related">
            <h2 className="sv-section-title">Related Products</h2>
            <div className="row g-4">
              {relatedProducts.map((prod) => (
                <div key={prod.id} className="col-lg-3 col-md-6">
                  <div className="sv-deal-card" style={{ border: 'var(--border-default)' }}>
                    <div className="sv-deal-img-wrap">
                      <img src={prod.thumbnail} alt={prod.name} className="sv-deal-img" />
                    </div>
                    <div className="sv-deal-body">
                      <span className="sv-product-card__brand-label">{prod.brand?.name || 'Generic'}</span>
                      <Link to={`/product/${prod.slug}`} className="sv-deal-name" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {prod.name}
                      </Link>
                      <div className="sv-deal-price-row">
                        <span className="sv-deal-price">₹{parseFloat(prod.price).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RECENTLY VIEWED ── */}
        {recentlyViewed.length > 1 && (
          <div className="sv-pdp-related">
            <h2 className="sv-section-title">Recently Viewed</h2>
            <div className="row g-4">
              {recentlyViewed.filter(item => item.id !== product.id).map((prod) => (
                <div key={prod.id} className="col-lg-3 col-md-6">
                  <div className="sv-deal-card" style={{ border: 'var(--border-default)' }}>
                    <div className="sv-deal-img-wrap">
                      <img src={prod.thumbnail} alt={prod.name} className="sv-deal-img" />
                    </div>
                    <div className="sv-deal-body">
                      <Link to={`/product/${prod.slug}`} className="sv-deal-name" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {prod.name}
                      </Link>
                      <div className="sv-deal-price-row">
                        <span className="sv-deal-price">₹{parseFloat(prod.price).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}

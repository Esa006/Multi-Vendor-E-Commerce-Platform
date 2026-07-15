import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import './WishlistPage.css';

export default function WishlistPage() {
  const { wishlistItems, loading, removeFromWishlist, moveToCart } = useWishlist();

  if (loading && wishlistItems.length === 0) {
    return (
      <div className="container-xxl" style={{ padding: '80px 24px' }}>
        <h2 className="sv-section-title">My Wishlist</h2>
        <div className="sv-wishlist-grid">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="skeleton" style={{ height: '340px', borderRadius: '12px', background: 'var(--color-bg-muted)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container-xxl" style={{ padding: '80px 24px' }}>
        <div className="sv-empty-state" role="alert">
          <span className="material-symbols-outlined sv-empty-icon">favorite_border</span>
          <h3 className="sv-empty-title">Your Wishlist is Empty</h3>
          <p className="sv-empty-desc">You haven't saved any items to your wishlist yet. Browse the store to find things you love!</p>
          <Link to="/shop" className="sv-view-all-btn">Discover Products</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="sv-wishlist"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container-xxl">
        <h2 className="sv-section-title" style={{ marginTop: '24px' }}>My Wishlist ({wishlistItems.length} items)</h2>

        <div className="sv-wishlist-grid">
          <AnimatePresence>
            {wishlistItems.map((item) => {
              const product = item.product;
              if (!product) return null;

              const isOutOfStock = product.stock <= 0;
              const unitPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

              // Find a fallback variant if any exists
              const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;

              return (
                <motion.div
                  key={item.id}
                  className="sv-deal-card sv-wishlist-item-card"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Remove Wishlist Button */}
                  <div className="sv-wishlist-remove-overlay">
                    <button
                      className="sv-wishlist-remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                      aria-label="Remove from wishlist"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                    </button>
                  </div>

                  {product.discount > 0 && <span className="sv-deal-badge">-{product.discount}%</span>}

                  <div className="sv-deal-img-wrap">
                    <img src={product.thumbnail} alt={product.name} className="sv-deal-img" />
                  </div>

                  <div className="sv-deal-body">
                    <span className="sv-product-card__brand-label">{product.brand?.name || 'Generic'}</span>
                    <Link to={`/product/${product.slug}`} className="sv-deal-name" style={{ textDecoration: 'none', color: 'inherit' }}>
                      {product.name}
                    </Link>

                    <div className="sv-deal-price-row">
                      <span className="sv-deal-price">₹{unitPrice.toLocaleString('en-IN')}</span>
                      {product.mrp && <span className="sv-deal-mrp">₹{parseFloat(product.mrp).toLocaleString('en-IN')}</span>}
                    </div>

                    <div className="sv-deal-meta">
                      <span className="sv-deal-vendor">{product.vendor?.store_name || 'Generic Store'}</span>
                    </div>

                    <div className="sv-product-card__footer-row" style={{ marginTop: '8px', marginBottom: '12px' }}>
                      <span className={`sv-stock-status${!isOutOfStock ? ' in-stock' : ' out-of-stock'}`}>
                        {isOutOfStock ? 'Out of Stock' : (product.stock <= 5 ? `Only ${product.stock} Left` : 'In Stock')}
                      </span>
                    </div>

                    <button
                      className="sv-deal-add-btn"
                      onClick={() => moveToCart(item.id, product.id, firstVariant ? firstVariant.id : null)}
                      disabled={isOutOfStock}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_cart</span>
                      Move to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

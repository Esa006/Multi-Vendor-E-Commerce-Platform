import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import './CartPage.css';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    loading,
    updateQuantity,
    removeFromCart,
    moveToWishlist
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SHOP10') {
      setDiscountPercent(10);
      toast.success('Coupon SHOP10 applied! 10% discount added.');
    } else if (couponCode.trim().toUpperCase() === 'SAVE500') {
      setDiscountPercent(0);
      toast.success('Coupon SAVE500 applied!');
    } else {
      toast.error('Invalid coupon code. Try "SHOP10"');
    }
  };

  // Shipping logic: Free shipping above ₹5,000, otherwise flat ₹150
  const shippingThreshold = 5000;
  const isFreeShipping = cartTotal >= shippingThreshold;
  const shippingCost = cartTotal > 0 ? (isFreeShipping ? 0 : 150) : 0;

  // Coupon calculations
  const discountAmount = (cartTotal * discountPercent) / 100;
  const grandTotal = cartTotal + shippingCost - discountAmount;

  if (loading && cartItems.length === 0) {
    return (
      <div className="container-xxl" style={{ padding: '80px 24px' }}>
        <h2 className="sv-section-title">Shopping Cart</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="skeleton" style={{ height: '120px', borderRadius: '12px', background: 'var(--color-bg-muted)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-xxl" style={{ padding: '80px 24px' }}>
        <div className="sv-empty-state" role="alert">
          <span className="material-symbols-outlined sv-empty-icon">shopping_cart_off</span>
          <h3 className="sv-empty-title">Your Cart is Empty</h3>
          <p className="sv-empty-desc">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/shop" className="sv-view-all-btn">Go Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="sv-cart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container-xxl">
        <h2 className="sv-section-title" style={{ marginTop: '24px' }}>Shopping Cart ({cartItems.length} items)</h2>

        <div className="sv-cart-layout">

          {/* ── LEFT: CART ITEMS LIST ── */}
          <div className="sv-cart-list-wrap">
            <AnimatePresence>
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;

                const isOutOfStock = product.stock <= 0;

                return (
                  <motion.div
                    key={item.id}
                    className="sv-cart-item-card"
                    layout
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="sv-cart-item-img-wrap">
                      <img src={product.thumbnail} alt={product.name} className="sv-cart-item-img" />
                    </div>

                    <div className="sv-cart-item-info">
                      <span className="sv-cart-item-brand">{product.brand?.name || 'Generic'}</span>
                      <Link to={`/product/${product.slug}`} className="sv-cart-item-title">
                        {product.name}
                      </Link>
                      <span className="sv-cart-item-vendor">Vendor: {product.vendor?.store_name || 'Generic Store'}</span>

                      {item.variant && (
                        <span className="sv-cart-item-variant">
                          {item.variant.name}: {item.variant.value}
                        </span>
                      )}

                      <div style={{ marginTop: '8px' }}>
                        <button
                          className="sv-cart-moveto-btn"
                          onClick={() => moveToWishlist(item.id, product.id)}
                        >
                          Move to Wishlist
                        </button>
                      </div>
                    </div>

                    <div className="sv-cart-item-actions-col">
                      <div className="sv-quantity-selector">
                        <button
                          className="sv-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isOutOfStock}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
                        </button>
                        <span className="sv-qty-val">{item.quantity}</span>
                        <button
                          className="sv-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= product.stock || isOutOfStock}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        </button>
                      </div>

                      <div className="sv-cart-item-price-wrap">
                        <span className="sv-cart-item-subtotal">₹{parseFloat(item.subtotal).toLocaleString('en-IN')}</span>
                        <span className="sv-cart-item-price">₹{parseFloat(item.price).toLocaleString('en-IN')} each</span>
                      </div>

                      <button
                        className="sv-cart-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* ── RIGHT: SUMMARY PANEL ── */}
          <div className="sv-cart-summary">
            <h3 className="sv-summary-title">Order Summary</h3>

            <div className="sv-summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="sv-summary-row">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
            </div>

            {!isFreeShipping && cartTotal > 0 && (
              <span className="sv-slider-help" style={{ marginTop: '-8px', color: 'var(--color-brand-primary)' }}>
                Add ₹{(shippingThreshold - cartTotal).toLocaleString('en-IN')} more for FREE shipping!
              </span>
            )}

            {discountPercent > 0 && (
              <div className="sv-summary-row" style={{ color: 'var(--color-success)' }}>
                <span>Discount ({discountPercent}%)</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {/* Coupon Application Box */}
            <form className="sv-coupon-box" onSubmit={handleApplyCoupon}>
              <input
                type="text"
                placeholder="Promo Code (e.g. SHOP10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="sv-coupon-input"
              />
              <button type="submit" className="sv-coupon-btn">Apply</button>
            </form>

            <div className="sv-summary-row sv-summary-row--total">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            <button className="sv-checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

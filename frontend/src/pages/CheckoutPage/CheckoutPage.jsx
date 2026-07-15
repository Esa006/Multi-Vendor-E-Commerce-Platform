import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, cartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    } else {
      fetchAddresses();
    }
  }, [cartItems]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/addresses');
      if (response.data.success) {
        setAddresses(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedAddressId(response.data.data[0].id);
        } else {
          setShowNewAddressForm(true);
        }
      }
    } catch (error) {
      toast.error('Failed to load addresses.');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/addresses', newAddress);
      if (response.data.success) {
        setAddresses([response.data.data, ...addresses]);
        setSelectedAddressId(response.data.data.id);
        setShowNewAddressForm(false);
        toast.success('Address added successfully');
      }
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const response = await axios.post('http://localhost:8000/api/checkout', {
        address_id: selectedAddressId,
        payment_method: paymentMethod
      });

      if (response.data.success) {
        toast.success('Order placed successfully!');
        await fetchCart(); // Clear local cart state
        navigate(`/orders/${response.data.data.order_number}`, { state: { success: true } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const shipping = cartTotal >= 5000 ? 0 : 150;
  const grandTotal = cartTotal + shipping;

  return (
    <div className="sv-checkout">
      <div className="sv-checkout-grid">
        
        <div className="sv-checkout-main">
          {/* Step 1: Delivery Address */}
          <motion.div className="sv-checkout-step" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="sv-checkout-step__header">
              <div className="sv-step-number">1</div>
              <h3>Delivery Address</h3>
            </div>
            
            <div className="sv-address-list">
              {addresses.map(addr => (
                <div 
                  key={addr.id} 
                  className={`sv-address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddressId(addr.id)}
                >
                  {selectedAddressId === addr.id && (
                    <span className="material-symbols-outlined sv-address-card__check">check_circle</span>
                  )}
                  <strong>{addr.full_name}</strong>
                  <p className="mb-1 text-muted">{addr.phone}</p>
                  <p className="mb-0 text-muted">
                    {addr.address_line_1}, {addr.address_line_2 ? addr.address_line_2 + ', ' : ''}
                    {addr.city}, {addr.state} - {addr.postal_code}
                  </p>
                </div>
              ))}
            </div>

            {!showNewAddressForm && (
              <button 
                className="btn btn-outline-primary mt-3" 
                onClick={() => setShowNewAddressForm(true)}
              >
                + Add New Address
              </button>
            )}

            {showNewAddressForm && (
              <form className="sv-address-form" onSubmit={handleAddressSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input required className="form-control" value={newAddress.full_name} onChange={e => setNewAddress({...newAddress, full_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input required className="form-control" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Address Line 1</label>
                  <input required className="form-control" value={newAddress.address_line_1} onChange={e => setNewAddress({...newAddress, address_line_1: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label>Address Line 2 (Optional)</label>
                  <input className="form-control" value={newAddress.address_line_2} onChange={e => setNewAddress({...newAddress, address_line_2: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input required className="form-control" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input required className="form-control" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input required className="form-control" value={newAddress.postal_code} onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})} />
                </div>
                <div className="full-width d-flex gap-2">
                  <button type="submit" className="btn btn-primary">Save Address</button>
                  {addresses.length > 0 && (
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowNewAddressForm(false)}>Cancel</button>
                  )}
                </div>
              </form>
            )}
          </motion.div>

          {/* Step 2: Payment Method */}
          <motion.div className="sv-checkout-step" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="sv-checkout-step__header">
              <div className="sv-step-number">2</div>
              <h3>Payment Method</h3>
            </div>

            <div className="sv-payment-options">
              <label className={`sv-payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')}
                />
                <div>
                  <strong>Cash on Delivery (COD)</strong>
                  <p className="mb-0 text-muted" style={{ fontSize: 13 }}>Pay when you receive the order</p>
                </div>
              </label>
              
              <label className={`sv-payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')}
                />
                <div>
                  <strong>Credit / Debit Card</strong>
                  <p className="mb-0 text-muted" style={{ fontSize: 13 }}>Pay securely using your card</p>
                </div>
              </label>

              <label className={`sv-payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="upi" 
                  checked={paymentMethod === 'upi'} 
                  onChange={() => setPaymentMethod('upi')}
                />
                <div>
                  <strong>UPI</strong>
                  <p className="mb-0 text-muted" style={{ fontSize: 13 }}>Google Pay, PhonePe, Paytm</p>
                </div>
              </label>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="sv-checkout-sidebar">
          <div className="sv-order-summary">
            <h4 className="mb-4">Order Summary</h4>
            <div className="sv-summary-items mb-3">
              {cartItems.map(item => (
                <div key={item.id} className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                  <span className="text-truncate" style={{ maxWidth: '200px' }}>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span>₹{item.subtotal}</span>
                </div>
              ))}
            </div>
            
            <hr />
            
            <div className="sv-summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="sv-summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-success">Free</span> : `₹${shipping}`}</span>
            </div>
            
            <div className="sv-summary-row total">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <button 
              className="sv-place-order-btn" 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !selectedAddressId}
            >
              {isPlacingOrder ? 'Processing...' : 'Place Order'}
            </button>
            <p className="text-center text-muted mt-3" style={{ fontSize: 12 }}>
              By placing your order, you agree to ShopVerse's Terms of Use and Privacy Policy.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

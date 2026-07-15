import { useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './OrderSuccessPage.css';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Basic check to prevent users from just navigating to this page via URL
    if (!location.state?.success) {
      navigate('/orders');
      return;
    }
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [location, navigate]);

  return (
    <div className="sv-order-success">
      <motion.div 
        className="sv-success-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="material-symbols-outlined sv-success-icon">check_circle</span>
        <h2>Order Confirmed!</h2>
        <p>Thank you for shopping with ShopVerse. We have received your order and will start processing it right away.</p>

        <div className="sv-order-details-box">
          <h4>Order Number</h4>
          <div className="order-id">{orderNumber}</div>
        </div>

        <div className="sv-success-actions">
          <Link to="/orders" className="btn btn-outline-primary">View Orders</Link>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </motion.div>
    </div>
  );
}

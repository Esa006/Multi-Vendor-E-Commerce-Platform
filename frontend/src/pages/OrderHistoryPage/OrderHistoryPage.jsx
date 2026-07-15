import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import './OrderHistoryPage.css';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="sv-order-history text-center pt-5">Loading orders...</div>;
  }

  return (
    <div className="sv-order-history">
      <div className="sv-order-history-container">
        <div className="sv-order-history-header">
          <h2>My Orders</h2>
          <p className="text-muted">View and track your recent orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--color-border)' }}>inventory_2</span>
            <h4 className="mt-3">No orders yet</h4>
            <p className="text-muted mb-4">Looks like you haven't made your first purchase.</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="sv-orders-list">
            {orders.map((order, index) => (
              <motion.div 
                key={order.id} 
                className="sv-order-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="sv-order-card__header">
                  <div className="sv-order-info">
                    <div className="sv-order-info-item">
                      <span className="sv-order-info-label">Order Placed</span>
                      <span className="sv-order-info-value">{new Date(order.placed_at).toLocaleDateString()}</span>
                    </div>
                    <div className="sv-order-info-item">
                      <span className="sv-order-info-label">Total Amount</span>
                      <span className="sv-order-info-value">₹{order.grand_total}</span>
                    </div>
                    <div className="sv-order-info-item">
                      <span className="sv-order-info-label">Order #</span>
                      <span className="sv-order-info-value">{order.order_number}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`sv-order-status-badge ${order.order_status}`}>
                      {order.order_status}
                    </span>
                  </div>
                </div>

                <div className="sv-order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="sv-order-item-row">
                      <img 
                        src={item.product.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}&background=f3f4f6&color=6b7280`} 
                        alt={item.product.name} 
                        className="sv-order-item-img"
                      />
                      <div className="sv-order-item-details">
                        <Link to={`/product/${item.product.slug}`} className="sv-order-item-name text-decoration-none d-block">
                          {item.product.name}
                        </Link>
                        <div className="sv-order-item-vendor">Qty: {item.quantity}</div>
                      </div>
                      <div className="sv-order-item-price">
                        ₹{item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

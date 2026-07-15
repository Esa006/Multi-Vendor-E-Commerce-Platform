import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import './AuthPages.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    terms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!formData.terms) {
      toast.error('You must accept the Terms and Conditions.');
      return;
    }

    setIsSubmitting(true);
    const success = await register(formData);
    setIsSubmitting(false);

    if (success) {
      toast.success('Registration successful! Welcome to ShopVerse.');
      navigate('/');
    } else {
      toast.error('Registration failed. Please check your details.');
    }
  };

  return (
    <div className="sv-auth-page">
      <motion.div 
        className="sv-auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="sv-auth-header">
          <h2>Create an Account</h2>
          <p>Join ShopVerse to start shopping</p>
        </div>

        <form className="sv-auth-form register" onSubmit={handleSubmit}>
          <div className="name-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input 
                type="text" 
                id="first_name" 
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input 
                type="text" 
                id="last_name" 
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input 
              type="tel" 
              id="phone" 
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input 
              type="password" 
              id="password_confirmation" 
              placeholder="Confirm your password"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="sv-auth-options" style={{ marginBottom: '16px' }}>
            <label className="remember-me">
              <input type="checkbox" id="terms" checked={formData.terms} onChange={handleChange} /> I agree to the <Link to="/terms">Terms and Conditions</Link>
            </label>
          </div>

          <button type="submit" className="sv-auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="sv-auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}

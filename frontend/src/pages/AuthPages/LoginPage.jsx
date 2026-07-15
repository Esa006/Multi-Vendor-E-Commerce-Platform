import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import heroImage from '../../assets/hero.png';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error('Invalid email or password.');
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login feature coming soon!`);
  };

  return (
    <div className="sv-split-auth-page px-3 py-4 d-flex align-items-center justify-content-center">
      <motion.div 
        className="sv-split-container row g-0 mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* LEFT PANEL */}
        <div className="col-lg-5 col-xl-6 d-none d-lg-flex sv-split-left">
          <div className="sv-split-left-header">
            <h2>Welcome Back!</h2>
            <p>Login to continue shopping from your favorite stores</p>
          </div>

          <div className="sv-split-features">
            <div className="sv-split-feature">
              <div className="sv-split-feature-icon">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div className="sv-split-feature-text">
                <h4>Secure & Safe</h4>
                <p>Your data is protected with enterprise-grade security</p>
              </div>
            </div>
            <div className="sv-split-feature">
              <div className="sv-split-feature-icon">
                <span className="material-symbols-outlined">shopping_bag</span>
              </div>
              <div className="sv-split-feature-text">
                <h4>Multiple Stores</h4>
                <p>Explore products from multiple trusted vendors</p>
              </div>
            </div>
            <div className="sv-split-feature">
              <div className="sv-split-feature-icon">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div className="sv-split-feature-text">
                <h4>24/7 Support</h4>
                <p>We're here to help you anytime, anywhere</p>
              </div>
            </div>
          </div>

          <div className="sv-split-illustration">
            <img src={heroImage} alt="Shopping Illustration" style={{ maxHeight: '200px', objectFit: 'contain' }} />
          </div>

          <div className="sv-split-left-footer">
            New to ShopNexus? <Link to="/register">Create an account</Link>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-12 col-lg-7 col-xl-6 sv-split-right">
          <div className="sv-split-right-inner">
            <h2>Login to Your Account</h2>
            <p>Enter your credentials to access your account</p>

            <form onSubmit={handleSubmit}>
              <div className="sv-form-group-icon">
                <label htmlFor="email">Email Address</label>
                <div className="sv-input-wrapper">
                  <span className="material-symbols-outlined">mail</span>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sv-form-group-icon">
                <label htmlFor="password">Password</label>
                <div className="sv-input-wrapper">
                  <span className="material-symbols-outlined">lock</span>
                  <input 
                    type="password" 
                    id="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    className="sv-password-toggle"
                    onClick={() => {
                      const input = document.getElementById('password');
                      if (input) {
                        input.type = input.type === 'password' ? 'text' : 'password';
                        setShowPassword(!showPassword);
                      }
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="sv-auth-options-split">
                <label className="remember-me">
                  <input type="checkbox" style={{ accentColor: 'var(--color-primary)' }} /> Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit" className="sv-split-submit" disabled={isSubmitting}>
                <span className="material-symbols-outlined">login</span>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="sv-divider">or continue with</div>

            <button type="button" className="sv-social-btn" onClick={() => handleSocialLogin('Google')}>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
            
            <button type="button" className="sv-social-btn" onClick={() => handleSocialLogin('Facebook')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12a12 12 0 1 0-13.87 11.85v-8.38H7.08V12h3.05V9.36c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          <div className="sv-trust-badges-bottom d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 text-center text-sm-start mt-4 pt-3 border-top">
            <div className="sv-trust-badge">
              <span className="material-symbols-outlined">assignment_return</span>
              <div className="sv-trust-badge-text">
                <span>Easy Returns</span>
                <span>7-day return policy</span>
              </div>
            </div>
            <div className="sv-trust-badge">
              <span className="material-symbols-outlined">verified_user</span>
              <div className="sv-trust-badge-text">
                <span>Secure Payment</span>
                <span>100% secure payment</span>
              </div>
            </div>
            <div className="sv-trust-badge">
              <span className="material-symbols-outlined">local_shipping</span>
              <div className="sv-trust-badge-text">
                <span>Fast Delivery</span>
                <span>Quick & reliable</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

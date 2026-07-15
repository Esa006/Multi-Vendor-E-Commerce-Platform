import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem } from '../services/cartService';
import { addToWishlist } from '../services/wishlistService';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCart();
      setCartItems(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Could not load shopping cart.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, variantId = null, quantity = 1) => {
    setLoading(true);
    try {
      const response = await apiAddToCart(productId, variantId, quantity);
      toast.success(response.message || 'Item added to cart!');
      await fetchCart();
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add item to cart.';
      toast.error(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await updateCartItem(itemId, quantity);
      toast.success(response.message || 'Cart updated.');
      await fetchCart();
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update quantity.';
      toast.error(errMsg);
      await fetchCart(); // Reset quantity in client UI to match database
      return { success: false, message: errMsg };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await removeCartItem(itemId);
      toast.success(response.message || 'Item removed from cart.');
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      return { success: true };
    } catch (err) {
      toast.error('Failed to remove item from cart.');
      return { success: false };
    }
  };

  const moveToWishlist = async (itemId, productId) => {
    try {
      // Add to wishlist
      await addToWishlist(productId);
      // Remove from cart
      await removeCartItem(itemId);
      toast.success('Moved item to wishlist.');
      await fetchCart();
      // Dispatch event to sync wishlist context
      window.dispatchEvent(new Event('wishlist-updated'));
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Could not move item to wishlist.';
      toast.error(errMsg);
      return { success: false };
    }
  };

  const clearCart = () => {
    // Front-end cleanup
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + parseInt(item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      loading,
      error,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      moveToWishlist,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

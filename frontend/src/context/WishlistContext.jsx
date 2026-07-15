import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getWishlist, addToWishlist as apiAddToWishlist, removeWishlistItem } from '../services/wishlistService';
import { addToCart } from '../services/cartService';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getWishlist();
      setWishlistItems(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      setError('Could not load wishlist.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();

    // Setup listener to synchronize with cart updates
    const syncWishlist = () => {
      fetchWishlist();
    };
    window.addEventListener('wishlist-updated', syncWishlist);
    return () => window.removeEventListener('wishlist-updated', syncWishlist);
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    const existingItem = wishlistItems.find(item => item.product_id === product.id);
    if (existingItem) {
      return removeFromWishlist(existingItem.id);
    } else {
      return addWishlist(product.id);
    }
  };

  const addWishlist = async (productId) => {
    setLoading(true);
    try {
      const response = await apiAddToWishlist(productId);
      toast.success(response.message || 'Added to wishlist!');
      await fetchWishlist();
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add item to wishlist.';
      toast.error(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      const response = await removeWishlistItem(itemId);
      toast.success(response.message || 'Removed from wishlist.');
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      return { success: true };
    } catch (err) {
      toast.error('Failed to remove item from wishlist.');
      return { success: false };
    }
  };

  const moveToCart = async (itemId, productId, variantId = null) => {
    try {
      // 1. Add to cart
      await addToCart(productId, variantId, 1);
      // 2. Remove from wishlist
      await removeWishlistItem(itemId);
      toast.success('Moved item to shopping cart.');
      await fetchWishlist();
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Could not move item to cart.';
      toast.error(errMsg);
      return { success: false };
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      loading,
      error,
      fetchWishlist,
      toggleWishlist,
      addWishlist,
      removeFromWishlist,
      moveToCart
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

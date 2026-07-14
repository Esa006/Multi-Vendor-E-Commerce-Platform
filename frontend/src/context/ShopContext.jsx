import { createContext, useState, useEffect, useContext, useCallback, useTransition } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { getBrands } from '../services/brandService';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Products, Loading & Error States
  const [products, setProducts] = useState([]);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: 12
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Categories & Brands list
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState('all'); // 'all', 'instock', 'outofstock'
  const [minDiscount, setMinDiscount] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Transition state for UI responsiveness
  const [, startTransition] = useTransition();

  // Debounced search trigger (300-500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load categories and brands once on startup
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catData, brandData] = await Promise.all([
          getCategories().catch(() => ({ data: [] })),
          getBrands().catch(() => ({ data: [] }))
        ]);
        setCategories(catData.data || []);
        setBrands(brandData.data || []);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch products from api service based on active query states
  const fetchShopProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts({
        search: debouncedSearch,
        category: selectedCategory,
        brand: selectedBrands,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        rating: selectedRating,
        avail: availability,
        discount: minDiscount,
        sort: sortBy,
        page: currentPage
      });
      
      // Handle Laravel Paginated Response format
      startTransition(() => {
        setProducts(response.data || []);
        setPaginationData({
          total: response.meta?.total || response.total || 0,
          current_page: response.meta?.current_page || response.current_page || 1,
          last_page: response.meta?.last_page || response.last_page || 1,
          per_page: response.meta?.per_page || response.per_page || 12
        });
      });
    } catch (err) {
      console.error('API Error fetching products:', err);
      setError('Failed to load products. Please check if backend server is running and try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, selectedBrands, priceRange, selectedRating, availability, minDiscount, sortBy, currentPage]);

  // Fetch whenever filters change
  useEffect(() => {
    fetchShopProducts();
  }, [fetchShopProducts]);

  // Reset pagination when filter targets change
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceRange([0, 150000]);
    setSelectedRating(0);
    setAvailability('all');
    setMinDiscount(0);
    setSortBy('newest');
    setCurrentPage(1);
  }, []);

  const handleBrandToggle = useCallback((brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  }, []);

  const value = {
    products,
    paginationData,
    loading,
    error,
    categories,
    brands,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    selectedRating,
    setSelectedRating,
    availability,
    setAvailability,
    minDiscount,
    setMinDiscount,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    fetchShopProducts,
    resetFilters,
    handleBrandToggle
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}

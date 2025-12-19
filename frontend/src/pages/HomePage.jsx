import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';
import { productAPI } from '../utils/api';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Food'];
const ITEMS_PER_PAGE = 12;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('search') || '').trim().toLowerCase();
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productAPI.getAll();
      if (response.data?.success) {
        setProducts(response.data.data);
      } else if (response.data?.data) {
        setProducts(response.data.data);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search and category
  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || '';
        return name.includes(searchQuery) || description.includes(searchQuery);
      });
    }

    if (selectedCategory !== 'All') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    return result;
  }, [products, searchQuery, selectedCategory]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      case 'price-high':
        return sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Featured and New Arrivals
  const featuredProducts = useMemo(() => {
    return products
      .filter((p) => p.rating && p.rating >= 4)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
  }, [products]);

  const newArrivals = useMemo(() => {
    return products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [products]);

  const bannerSlides = [
    {
      title: 'Summer Collection',
      subtitle: 'Up to 50% off on latest fashion',
      color: 'from-blue-600 to-blue-400',
    },
    {
      title: 'Electronics Sale',
      subtitle: 'Best deals on gadgets & accessories',
      color: 'from-purple-600 to-purple-400',
    },
    {
      title: 'Home Decor',
      subtitle: 'Transform your living space',
      color: 'from-green-600 to-green-400',
    },
    {
      title: 'Sports Gear',
      subtitle: 'Gear up for your next adventure',
      color: 'from-orange-600 to-orange-400',
    },
    {
      title: 'Books & Media',
      subtitle: 'Dive into your next great read',
      color: 'from-pink-600 to-pink-400',
    },
  ];

  const currentSlide = bannerSlides[carouselIndex];

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Hero Carousel */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg mx-4 mt-4 mb-10 shadow-lg animate-slideInUp">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentSlide.color} transition-all duration-1000 flex items-center justify-center text-center`}
        >
          <div className="z-10 px-6 py-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              {currentSlide.title}
            </h2>
            <p className="text-lg sm:text-xl text-white/90">{currentSlide.subtitle}</p>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCarouselIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === carouselIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <div className="animate-slideInUp">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">⭐ Featured Products</h2>
            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={{ ...product, id: product._id }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* New Arrivals Section */}
        {newArrivals.length > 0 && (
          <div className="animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">🆕 New Arrivals</h2>
            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivals.map((product) => (
                  <ProductCard key={product._id} product={{ ...product, id: product._id }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Main Shop Section */}
        <div className="animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">All Products</h2>

          {/* Category Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sorting Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <p className="text-gray-600 text-sm">
              Showing {paginatedProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} -{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)} of {sortedProducts.length} products
            </p>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-semibold text-gray-700 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-center animate-slideInUp">
              {error}
              <button
                onClick={fetchProducts}
                className="ml-3 font-semibold underline hover:text-red-800 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-xl text-gray-800 font-semibold">No products found.</p>
              <p className="text-gray-500 mt-2">
                {searchQuery || selectedCategory !== 'All'
                  ? 'Try adjusting your filters or search.'
                  : 'Check back soon for new arrivals!'}
              </p>
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    navigate('/');
                  }}
                  className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all hover:shadow-md"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={{ ...product, id: product._id }} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

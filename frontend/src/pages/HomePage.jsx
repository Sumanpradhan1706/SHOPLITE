import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';
import { productAPI } from '../utils/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('search') || '').trim().toLowerCase();
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
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

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((product) => {
      const name = product.name?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      return name.includes(searchQuery) || description.includes(searchQuery);
    });
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Welcome to ShopLite
          </h1>
          <p className="text-gray-600 text-lg">Discover amazing products at unbeatable prices</p>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-500">
              Showing results for <span className="font-semibold text-gray-700">“{searchQuery}”</span> ({filteredProducts.length})
            </p>
          )}
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
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-800 font-semibold">
              {searchQuery ? 'No products match your search.' : 'No products available.'}
            </p>
            <p className="text-gray-500 mt-2">
              {searchQuery ? 'Try a different keyword or clear your search.' : 'Check back soon for new arrivals!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all hover:shadow-md"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

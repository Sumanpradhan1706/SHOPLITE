import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { cartAPI } from '../utils/api';
import { showToast, getErrorMessage } from '../utils/toast';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isQuickViewOpen, setQuickViewOpen] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const [adding, setAdding] = useState(false);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const stock = product.stock ?? 0;
  const inStock = stock > 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await cartAPI.addItem(product._id || product.id, 1);
      showToast.success('Added to cart');
    } catch (err) {
      showToast.error(getErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  const toggleFavorite = () => {
    setFavorite((prev) => !prev);
    showToast.info(!isFavorite ? 'Added to wishlist (local)' : 'Removed from wishlist');
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fadeIn group">
      <div className="absolute top-3 left-3 flex gap-2 z-10">
        {hasDiscount && (
          <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full shadow-sm">
            -{discountPercent}%
          </span>
        )}
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
            inStock ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {inStock ? `${stock} in stock` : 'Out of stock'}
        </span>
      </div>

      <button
        type="button"
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow hover:scale-110 active:scale-95 transition-all"
        aria-label="Toggle wishlist"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isFavorite ? '#ef4444' : 'none'}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#ef4444"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s-6.75-4.35-9-9a5.25 5.25 0 1 1 9-4.5 5.25 5.25 0 1 1 9 4.5c-2.25 4.65-9 9-9 9z"
          />
        </svg>
      </button>

      <div className="overflow-hidden">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-600 line-clamp-2">
            {product.name}
          </h3>
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Quick View
          </button>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-600 transition-all group-hover:scale-110">
              ₹{hasDiscount ? product.discountPrice : product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {adding ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <Link
              to={`/product/${product.id || product._id}`}
              className="px-3 py-2 border border-gray-200 text-sm font-semibold text-gray-700 rounded-md hover:bg-gray-50 transition-all"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      {isQuickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden animate-scaleIn">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-4 md:p-6 bg-gray-50">
                <img
                  src={product.image || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="p-5 md:p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                  <button
                    type="button"
                    onClick={() => setQuickViewOpen(false)}
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                    aria-label="Close quick view"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-600">{product.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{hasDiscount ? product.discountPrice : product.price}
                  </span>
                  {hasDiscount && (
                    <span className="text-gray-500 line-through">₹{product.price}</span>
                  )}
                  {hasDiscount && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Category: {product.category || 'General'}</p>
                <p className="text-sm font-semibold {inStock ? 'text-green-600' : 'text-red-600'}">
                  {inStock ? `${stock} in stock` : 'Currently unavailable'}
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!inStock || adding}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md font-semibold transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {adding ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <Link
                    to={`/product/${product.id || product._id}`}
                    onClick={() => setQuickViewOpen(false)}
                    className="px-4 py-3 border border-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-50 transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

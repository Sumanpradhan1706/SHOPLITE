import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { ProductDetailsSkeleton } from '../components/SkeletonLoader';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (err) {
      setError('Failed to load product details.');
      console.error('Fetch product error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await cartAPI.addItem(product._id, quantity);
      alert('Product added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={product.image || 'https://via.placeholder.com/400'}
                alt={product.name}
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="ml-2 text-gray-700">{product.rating || 0} / 5</span>
                <span className="ml-4 text-gray-500">({product.numReviews || 0} reviews)</span>
              </div>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="mb-6">
                <p className="text-4xl font-bold text-blue-600">
                  ${product.discountPrice || product.price}
                </p>
                {product.discountPrice && (
                  <p className="text-gray-500 line-through text-xl">${product.price}</p>
                )}
              </div>
              <div className="mb-6">
                <p className="text-gray-700">
                  Stock: <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-700">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={product.stock === 0}
                />
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="w-full bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

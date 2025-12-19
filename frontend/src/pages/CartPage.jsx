import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { showToast, getErrorMessage } from '../utils/toast';
import { CartSkeleton } from '../components/SkeletonLoader';
import ProductCard from '../components/ProductCard';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
    loadWishlistAndRecommendations();
  }, [isAuthenticated]);

  const loadWishlistAndRecommendations = () => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(savedWishlist);
    
    // Mock recommended products (in real app, fetch from API)
    setRecommendedProducts([
      { _id: 'rec1', name: 'Premium Wireless Headphones', price: 4999, image: 'https://via.placeholder.com/200', rating: 4.5 },
      { _id: 'rec2', name: 'Phone Stand', price: 599, image: 'https://via.placeholder.com/200', rating: 4.2 },
      { _id: 'rec3', name: 'USB-C Cable', price: 299, image: 'https://via.placeholder.com/200', rating: 4.8 },
      { _id: 'rec4', name: 'Wireless Charger', price: 1999, image: 'https://via.placeholder.com/200', rating: 4.6 },
    ]);
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (err) {
      const message = 'Failed to load cart';
      setError(message);
      showToast.error(message);
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      showToast.warning('Please enter a coupon code');
      return;
    }

    // Mock coupon validation
    const validCoupons = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME': 15,
      'HOLIDAY50': 50,
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setDiscountPercent(validCoupons[couponCode.toUpperCase()]);
      setCouponApplied(true);
      showToast.success(`Coupon applied! ${validCoupons[couponCode.toUpperCase()]}% discount`);
    } else {
      showToast.error('Invalid coupon code');
      setCouponApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setDiscountPercent(0);
    showToast.info('Coupon removed');
  };

  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
    return deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await cartAPI.updateItem(productId, newQuantity);
      await fetchCart();
      showToast.success('Cart updated');
    } catch (err) {
      const message = getErrorMessage(err);
      showToast.error(message);
    }
  };

  const removeItem = async (productId) => {
    if (!confirm('Remove this item from cart?')) return;
    
    try {
      await cartAPI.removeItem(productId);
      await fetchCart();
      showToast.success('Item removed from cart');
    } catch (err) {
      const message = getErrorMessage(err);
      showToast.error(message);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const calculateDiscountedTotal = () => {
    if (!cart) return 0;
    const subtotal = cart.subtotal;
    const discount = (subtotal * discountPercent) / 100;
    return subtotal - discount;
  };

  if (loading) {
    return <CartSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-100 animate-fadeIn">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-slideInUp">
            {error}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <div className="text-center text-gray-600 py-12 bg-white rounded-lg">
            <p className="text-xl mb-2">Your cart is empty</p>
            <p className="mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              {/* Cart Items */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8 animate-scaleIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Items in Cart ({cart.items.length})</h2>
                
                <div className="space-y-4 mb-8">
                  {cart.items.map((item, index) => (
                    <div key={item.productId._id || item.productId} className="flex items-center gap-4 border-b pb-4 animate-slideInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                      <img
                        src={item.image || 'https://via.placeholder.com/100'}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded transition-transform hover:scale-110"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{item.productName}</h3>
                        <p className="text-gray-600">Price: ${item.discountPrice || item.price}</p>
                        <p className="text-sm text-gray-500">Stock: {item.stock} available</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId._id || item.productId, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 bg-gray-200 rounded transition-all hover:bg-gray-300 hover:scale-110 active:scale-95"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-4 font-semibold w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId._id || item.productId, item.quantity + 1)}
                          className="px-3 py-1 bg-gray-200 rounded transition-all hover:bg-gray-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right w-24">
                        <p className="text-lg font-bold text-gray-800">${item.subtotal.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId._id || item.productId)}
                        className="text-red-600 hover:text-red-800 transition-all hover:scale-125 active:scale-95 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Estimated Delivery Date */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">Estimated Delivery:</p>
                  <p className="text-lg font-semibold text-blue-600">{getEstimatedDeliveryDate()}</p>
                  <p className="text-xs text-gray-600 mt-1">Standard shipping within India</p>
                </div>

                {/* Coupon Code Section */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4">Apply Coupon Code</h3>
                  {!couponApplied ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code (e.g., SAVE10, SAVE20)"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded">
                      <div>
                        <p className="font-semibold text-green-700">✓ {couponCode} Applied</p>
                        <p className="text-sm text-green-600">{discountPercent}% discount</p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-800 font-bold text-xl"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 mt-2">Try codes: SAVE10, SAVE20, WELCOME, HOLIDAY50</p>
                </div>

                {/* Continue Shopping Button */}
                <button
                  onClick={() => navigate('/')}
                  className="w-full border-2 border-gray-300 text-gray-800 py-2 rounded font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  ← Continue Shopping
                </button>
              </div>

              {/* Saved Items / Wishlist Section */}
              {wishlistItems.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 animate-slideInUp">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved for Later ({wishlistItems.length})</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {wishlistItems.slice(0, 4).map((item) => (
                      <div key={item} className="bg-gray-50 p-4 rounded border hover:border-blue-400 transition-all">
                        <div className="aspect-square bg-gray-200 rounded mb-2" />
                        <p className="text-sm font-semibold text-gray-700 truncate">Saved Item</p>
                        <button
                          onClick={() => navigate('/')}
                          className="text-blue-600 text-xs hover:underline mt-2"
                        >
                          View in Store
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-8 sticky top-4 animate-slideInRight">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold">${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tax (18%):</span>
                    <span className="font-semibold">${cart.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Shipping:</span>
                    <span className="font-semibold">${cart.shippingCost.toFixed(2)}</span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discountPercent}%):</span>
                      <span>-${(cart.subtotal * discountPercent / 100).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {cart.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Discount:</span>
                      <span>-${cart.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xl font-bold mb-6">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    ${couponApplied 
                      ? ((cart.subtotal - (cart.subtotal * discountPercent / 100)) + cart.taxAmount + cart.shippingCost).toFixed(2)
                      : cart.totalPrice.toFixed(2)
                    }
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:scale-105 active:scale-95 mb-3"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* You May Also Like Section */}
        {cart && cart.items.length > 0 && recommendedProducts.length > 0 && (
          <div className="mt-12 animate-slideInUp">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product, idx) => (
                <div 
                  key={product._id} 
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all animate-slideInUp"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-blue-600">${product.price}</span>
                    <div className="text-yellow-400">★ {product.rating}</div>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all text-sm"
                  >
                    View Product
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

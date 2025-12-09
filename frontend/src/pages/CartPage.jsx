import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (err) {
      setError('Failed to load cart');
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await cartAPI.updateItem(productId, newQuantity);
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    if (!confirm('Remove this item from cart?')) return;
    
    try {
      await cartAPI.removeItem(productId);
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!cart || cart.items.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              <p className="text-xl">Your cart is empty</p>
              <p className="mt-2">Add some products to get started!</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cart.items.map((item) => (
                  <div key={item.productId._id || item.productId} className="flex items-center gap-4 border-b pb-4">
                    <img
                      src={item.image || 'https://via.placeholder.com/100'}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.productName}</h3>
                      <p className="text-gray-600">${item.discountPrice || item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId._id || item.productId, item.quantity - 1)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId._id || item.productId, item.quantity + 1)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">${item.subtotal.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId._id || item.productId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span>${cart.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span>${cart.shippingCost.toFixed(2)}</span>
                  </div>
                  {cart.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${cart.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
                  <span>Total:</span>
                  <span className="text-blue-600">${cart.totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

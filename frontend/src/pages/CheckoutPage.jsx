import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCartContext } from '../context/CartContext';
import { orderAPI, cartAPI } from '../utils/api';
import { showToast, getErrorMessage } from '../utils/toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, getCartTotal } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotals = () => {
    const subtotal = getCartTotal();
    const tax = subtotal * 0.18;
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});

    if (cartItems.length === 0) {
      const message = 'Your cart is empty';
      setError(message);
      showToast.warning(message);
      return;
    }

    // Field-level client validation
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    const zipRegex = /^\d{4,6}$/;
    if (!formData.zipCode || !zipRegex.test(formData.zipCode)) newErrors.zipCode = 'Enter a valid postal code';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      showToast.warning('Please fix the highlighted fields');
      return;
    }

    try {
      setLoading(true);
      const { subtotal, tax, shipping, total } = calculateTotals();

      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'pending',
      };

      const response = await orderAPI.createOrder(orderData);
      setOrderId(response._id);
      setOrderPlaced(true);
      showToast.success('Order placed successfully!');

      // Clear cart after successful order
      clearCart();

      // Also clear server-side cart
      try {
        await cartAPI.clearCart();
      } catch (err) {
        console.log('Cart clear notice:', err.message);
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax, shipping, total } = calculateTotals();

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <div className="text-6xl text-green-600 mb-4">✓</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">Thank you for your purchase</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <div className="mb-4">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-2xl font-bold text-gray-800">{orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Total</p>
              <p className="text-2xl font-bold text-blue-600">₹{total.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">Order Status</h3>
            <p className="text-blue-800 text-sm mb-2">Your order has been confirmed and is being processed.</p>
            <p className="text-blue-800 text-sm">
              Payment Method: <span className="font-semibold">{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod}</span>
            </p>
            {formData.paymentMethod === 'cod' && (
              <p className="text-blue-800 text-sm mt-2">
                Please prepare the exact amount (₹{total.toFixed(2)}) for delivery.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition"
            >
              View Order History
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded font-semibold transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add items to your cart to proceed with checkout.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <LoadingSpinner size="large" message="Processing your order..." />
          </div>
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-lg shadow p-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Shipping Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={loading}
                  />
                  {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={loading}
                  />
                  {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={loading}
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-semibold mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={loading}
                />
                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={loading}
                  />
                  {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-semibold mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={loading}
                  />
                  {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-semibold mb-2">
                  Zip Code *
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={loading}
                />
                  {errors.zipCode && <p className="text-sm text-red-600 mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8 border-t pt-8">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="w-4 h-4"
                    disabled={loading}
                  />
                  <label htmlFor="cod" className="ml-3 cursor-pointer">
                    <span className="font-semibold">Cash on Delivery</span>
                    <p className="text-sm text-gray-600">Pay when your order arrives</p>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="w-4 h-4"
                    disabled={loading}
                  />
                  <label htmlFor="card" className="ml-3 cursor-pointer">
                    <span className="font-semibold">Debit/Credit Card</span>
                    <p className="text-sm text-gray-600">Pay now with your card (Future integration)</p>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleChange}
                    className="w-4 h-4"
                    disabled={loading}
                  />
                  <label htmlFor="upi" className="ml-3 cursor-pointer">
                    <span className="font-semibold">UPI</span>
                    <p className="text-sm text-gray-600">Pay using UPI (Future integration)</p>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow p-8 sticky top-4">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-start pb-4 border-b">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%)</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-blue-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/cart')}
              className="w-full mt-6 border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 rounded transition"
            >
              Edit Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

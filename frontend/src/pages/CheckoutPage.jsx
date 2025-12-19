import { useState, useMemo } from 'react';
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
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

    // Address autocomplete
    if (name === 'address' && value.length > 2) {
      const suggestions = [
        `${value}, Apartment 101`,
        `${value}, Floor 5`,
        `${value}, Building A`,
        `${value}, Near Park`,
      ];
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      address: suggestion,
    }));
    setShowSuggestions(false);
  };

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      // Validate shipping info
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      const phoneRegex = /^\d{10}$/;
      if (!formData.phone || !phoneRegex.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      const zipRegex = /^\d{4,6}$/;
      if (!formData.zipCode || !zipRegex.test(formData.zipCode)) newErrors.zipCode = 'Enter a valid postal code';
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      showToast.warning('Please fix the highlighted fields');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
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
    
    if (!validateStep(2)) {
      showToast.warning('Please complete all required fields');
      return;
    }

    setError('');
    setErrors({});

    if (cartItems.length === 0) {
      const message = 'Your cart is empty';
      setError(message);
      showToast.warning(message);
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 animate-fadeIn flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 animate-scaleIn">
            {/* Checkmark Animation */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
                <svg className="w-12 h-12 text-green-600 animate-slideInUp" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-slideInDown">Order Confirmed!</h1>
              <p className="text-gray-600 mb-2 animate-slideInUp">Thank you for your purchase</p>
              <p className="text-sm text-gray-500">A confirmation email has been sent to {user?.email}</p>
            </div>

            {/* Order Details Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-200 animate-slideInUp">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Order Number</p>
                  <p className="text-2xl font-bold text-blue-600">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Order Date</p>
                  <p className="text-lg font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="border-t pt-6">
                <p className="text-sm text-gray-600 font-medium mb-2">Order Total</p>
                <p className="text-3xl font-bold text-green-600">${getCartTotal().toFixed(2)}</p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 animate-slideInUp">
              <h3 className="font-semibold text-blue-900 mb-4">Order Status</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
                  <div className="ml-4">
                    <p className="font-semibold text-blue-900">Order Confirmed</p>
                    <p className="text-sm text-blue-700">Your order has been received and confirmed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold">→</div>
                  <div className="ml-4">
                    <p className="font-semibold text-blue-900">Processing</p>
                    <p className="text-sm text-blue-700">Your order will be processed within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold">→</div>
                  <div className="ml-4">
                    <p className="font-semibold text-blue-900">Shipped</p>
                    <p className="text-sm text-blue-700">Tracking info will be sent to your email</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold">→</div>
                  <div className="ml-4">
                    <p className="font-semibold text-blue-900">Delivered</p>
                    <p className="text-sm text-blue-700">Estimated delivery: 3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-medium mb-2">Payment Method</p>
                <p className="font-semibold text-gray-800">
                  {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod.toUpperCase()}
                </p>
                {formData.paymentMethod === 'cod' && (
                  <p className="text-xs text-gray-600 mt-2">Please have ₹{getCartTotal().toFixed(2)} ready</p>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-medium mb-2">Shipping Address</p>
                <p className="text-sm font-semibold text-gray-800">{formData.address}, {formData.city}</p>
                <p className="text-xs text-gray-600">{formData.state} {formData.zipCode}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 animate-slideInUp">
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              >
                View Order History
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition-all hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
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
    <div className="container mx-auto px-4 py-8 relative animate-fadeIn">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <LoadingSpinner size="large" message="Processing your order..." />
          </div>
        </div>
      )}
      
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Review' },
          ].map((step, idx) => (
            <div key={step.num} className="flex-1 flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step.num < currentStep
                    ? 'bg-green-600 text-white'
                    : step.num === currentStep
                    ? 'bg-blue-600 text-white scale-110'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {step.num < currentStep ? '✓' : step.num}
              </div>
              <p className={`ml-2 font-medium ${step.num <= currentStep ? 'text-gray-800' : 'text-gray-500'}`}>
                {step.label}
              </p>
              {idx < 2 && (
                <div className={`flex-1 h-1 mx-4 transition-all ${step.num < currentStep ? 'bg-green-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-lg shadow p-8 animate-scaleIn">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 animate-slideInUp">
                {error}
              </div>
            )}

            {/* STEP 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Information</h2>

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
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
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
                    placeholder="10-digit phone number"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Address with Autocomplete */}
                <div className="mb-4 relative">
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
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                  
                  {/* Address Suggestions */}
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-blue-300 rounded mt-1 shadow-lg z-10">
                      {addressSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-200 last:border-0 transition-colors"
                        >
                          📍 {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
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
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.zipCode && <p className="text-sm text-red-600 mt-1">{errors.zipCode}</p>}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition-all hover:shadow-lg active:scale-95"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Payment Method */}
            {currentStep === 2 && (
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Payment Method</h2>

                <div className="space-y-4">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '🚚' },
                    { id: 'card', label: 'Debit/Credit Card', desc: 'Secure payment (Future integration)', icon: '💳' },
                    { id: 'upi', label: 'UPI', desc: 'Instant payment (Future integration)', icon: '📱' },
                  ].map((method) => (
                    <label key={method.id} className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-400" style={{borderColor: formData.paymentMethod === method.id ? '#2563eb' : '#e5e7eb', backgroundColor: formData.paymentMethod === method.id ? '#eff6ff' : '#ffffff'}}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                        className="w-4 h-4"
                        disabled={loading}
                      />
                      <div className="ml-4">
                        <p className="text-2xl mr-4 inline">{method.icon}</p>
                        <span className="font-semibold text-gray-800">{method.label}</span>
                        <p className="text-sm text-gray-600">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 border-2 border-gray-300 text-gray-800 py-3 rounded font-semibold hover:bg-gray-50 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition-all hover:shadow-lg active:scale-95"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Confirm */}
            {currentStep === 3 && (
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Review Your Order</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
                    <p className="text-sm text-gray-700">{formData.firstName} {formData.lastName}</p>
                    <p className="text-sm text-gray-700">{formData.address}</p>
                    <p className="text-sm text-gray-700">{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p className="text-sm text-gray-700 mt-2">📞 {formData.phone}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
                    <p className="text-sm text-gray-700 font-semibold">
                      {formData.paymentMethod === 'cod' ? '🚚 Cash on Delivery' : formData.paymentMethod === 'card' ? '💳 Debit/Credit Card' : '📱 UPI'}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      {formData.paymentMethod === 'cod' && 'Pay when your order arrives'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 border-2 border-gray-300 text-gray-800 py-3 rounded font-semibold hover:bg-gray-50 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition-all hover:shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-8 sticky top-4 animate-slideInRight">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pb-4 border-b">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pb-6 border-b mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${calculateTotals().subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%)</span>
                <span className="font-semibold">${calculateTotals().tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">{calculateTotals().shipping === 0 ? 'FREE' : `$${calculateTotals().shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Total</span>
                <span>${calculateTotals().total.toFixed(2)}</span>
              </div>
            </div>

            {currentStep > 1 && (
              <button
                onClick={() => navigate('/cart')}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 rounded transition-all text-sm"
              >
                Edit Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

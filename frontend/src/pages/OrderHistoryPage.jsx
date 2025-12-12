import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { OrderHistorySkeleton } from '../components/SkeletonLoader';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      
      if (response.data.success) {
        setOrders(response.data.data);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderAPI.cancelOrder(orderId);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Order History</h1>
            <OrderHistorySkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              My Profile
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-bold text-gray-800">{order.orderNumber || order._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-800">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Items ({order.items?.length || 0})</h3>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {item.product?.name || 'Product'}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-800">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">₹{order.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-semibold">₹{order.tax?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-semibold">
                          {order.shipping === 0 ? 'FREE' : `₹${order.shipping?.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span className="text-blue-600">₹{order.total?.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.shippingAddress && (
                      <div className="bg-gray-50 rounded p-4 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-700">
                          {order.shippingAddress.street}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                          Phone: {order.shippingAddress.phone}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                      >
                        {selectedOrder?._id === order._id ? 'Hide Details' : 'View Details'}
                      </button>
                      
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedOrder?._id === order._id && (
                    <div className="bg-gray-50 px-6 py-4 border-t">
                      <h4 className="font-semibold text-gray-800 mb-2">Order Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Payment Method:</p>
                          <p className="font-semibold text-gray-800 capitalize">{order.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Status:</p>
                          <p className="font-semibold text-gray-800 capitalize">{order.paymentStatus}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Order Status:</p>
                          <p className="font-semibold text-gray-800 capitalize">{order.status}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Last Updated:</p>
                          <p className="font-semibold text-gray-800">{formatDate(order.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

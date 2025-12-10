import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../utils/api';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.updateProfile(formData);
      
      if (response.data.success) {
        const updatedUser = response.data.data;
        login(updatedUser, localStorage.getItem('token'));
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold mb-2">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        address: user?.address || '',
                      });
                    }}
                    disabled={loading}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded font-semibold transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.address || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">{user?.role || 'user'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>

            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-semibold mb-2">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/orders')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition"
              >
                View Order History
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

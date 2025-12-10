import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productAPI.delete(productId);
      setProducts(products.filter(p => p._id !== productId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          to="/admin/add-product"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
        >
          + Add Product
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Product Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">₹{product.price}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-yellow-500">★</span> {product.rating?.toFixed(1) || 'N/A'}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found. <Link to="/admin/add-product" className="text-blue-600 hover:underline">Create one</Link>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

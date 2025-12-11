import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { showToast, getErrorMessage } from '../utils/toast';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Books', 'Sports', 'Toys'];

export default function AddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    image: '',
  });

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await productAPI.getById(id);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        discountPrice: product.discountPrice || '',
        stock: product.stock,
        image: product.image,
      });
      showToast.success('Product loaded successfully');
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.description || !formData.category || !formData.price || !formData.stock || !formData.image) {
      const message = 'All fields are required';
      setError(message);
      showToast.warning(message);
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      const message = 'Price must be a positive number';
      setError(message);
      showToast.warning(message);
      return;
    }

    if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      const message = 'Stock must be a non-negative number';
      setError(message);
      showToast.warning(message);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock),
        image: formData.image,
      };

      if (id) {
        await productAPI.update(id, payload);
        showToast.success('Product updated successfully');
      } else {
        await productAPI.create(payload);
        showToast.success('Product created successfully');
      }

      navigate('/admin');
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{id ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-semibold mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-semibold mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="discountPrice" className="block text-sm font-semibold mb-2">
              Discount Price (₹) (Optional)
            </label>
            <input
              type="number"
              id="discountPrice"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-semibold mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-sm font-semibold mb-2">
            Image URL *
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          />
          {formData.image && (
            <div className="mt-4">
              <img
                src={formData.image}
                alt="Product preview"
                className="h-32 object-cover rounded"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200?text=Invalid+Image';
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : id ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            disabled={loading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded font-semibold transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

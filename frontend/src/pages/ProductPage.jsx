import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { showToast, getErrorMessage } from '../utils/toast';
import { ProductDetailsSkeleton, ProductGridSkeleton } from '../components/SkeletonLoader';
import ProductCard from '../components/ProductCard';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      
      if (response.data.success) {
        setProduct(response.data.data);
        fetchRelatedProducts(response.data.data.category);
        setSelectedImage(0);
      }
    } catch (err) {
      setError('Failed to load product details.');
      console.error('Fetch product error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await productAPI.getAll();
      const filtered = (Array.isArray(response.data) ? response.data : response.data?.data || [])
        .filter((p) => p.category === category && p._id !== id)
        .slice(0, 4);
      setRelatedProducts(filtered);
    } catch (err) {
      console.error('Fetch related products error:', err);
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
      showToast.success('Added to cart!');
    } catch (err) {
      showToast.error(getErrorMessage(err));
    } finally {
      setAddingToCart(false);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = product.name;
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const productImages = product?.images && product.images.length > 0 
    ? [product.image, ...product.images].filter(Boolean)
    : [product?.image || 'https://via.placeholder.com/400'];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = ['Black', 'White', 'Blue', 'Red', 'Gray', 'Navy'];

  const mockReviews = [
    { author: 'John Doe', rating: 5, text: 'Excellent product! Highly recommended.', date: '2 days ago' },
    { author: 'Jane Smith', rating: 4, text: 'Good quality but shipping took longer than expected.', date: '1 week ago' },
    { author: 'Mike Johnson', rating: 5, text: 'Perfect! Exactly as described.', date: '2 weeks ago' },
  ];

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
    <div className="min-h-screen bg-gray-100 animate-fadeIn">
      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 animate-scaleIn">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image Gallery with Zoom */}
            <div className="animate-slideInLeft">
              <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                {/* Main Image with Zoom */}
                <div
                  className="relative w-full aspect-square overflow-hidden cursor-zoom-in"
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseLeave={() => setShowZoom(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300"
                    style={
                      showZoom
                        ? {
                            transform: `scale(2) translate(${50 - zoomPosition.x}%, ${50 - zoomPosition.y}%)`,
                          }
                        : {}
                    }
                  />
                  {showZoom && (
                    <div className="absolute inset-0 border-2 border-blue-400 pointer-events-none rounded"
                      style={{
                        left: `${zoomPosition.x}%`,
                        top: `${zoomPosition.y}%`,
                        width: '50%',
                        height: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  )}
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-2 overflow-x-auto">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-blue-600 shadow-md'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover rounded" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info & Purchase */}
            <div className="animate-slideInRight">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              {/* Category & Rating */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                  {product.category}
                </span>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.numReviews || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-blue-600">
                    ${product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">${product.price}</span>
                      <span className="text-lg font-bold text-green-600">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              {/* Stock Status */}
              <div className="mb-6">
                <p className="text-sm text-gray-700 font-medium">
                  Availability:{' '}
                  <span className={product.stock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
                  </span>
                </p>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Size:</label>
                <div className="flex gap-2 flex-wrap">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border-2 transition-all font-medium ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-100 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-blue-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color:</label>
                <div className="flex gap-3 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded border-2 transition-all font-medium ${
                        selectedColor === color
                          ? 'border-blue-600 ring-2 ring-blue-400'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                      style={{
                        backgroundColor: color === 'Black' ? '#000' : color === 'White' ? '#fff' : color === 'Blue' ? '#3b82f6' : color === 'Red' ? '#ef4444' : color === 'Gray' ? '#9ca3af' : '#001f3f',
                        color: ['White', 'Gray'].includes(color) ? '#000' : '#fff',
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                  className="w-16 px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  disabled={product.stock === 0}
                />
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="w-full bg-blue-600 text-white px-8 py-3 rounded font-bold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg mb-4"
              >
                {addingToCart ? 'Adding to Cart...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Share Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t-2 border-gray-200">
                <span className="text-sm font-medium text-gray-700">Share:</span>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                  title="Share on Facebook"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                  title="Share on Twitter"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7-2.25 1-5.4 2.08-7 2a5 5 0 004-2c0-1 .5-4.3-2.5-7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-2 rounded-full hover:bg-green-100 transition-colors"
                  title="Share on WhatsApp"
                >
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.75 5.41 2.174 7.723L2.513 22l2.307-.742a9.876 9.876 0 004.686 1.192h.005c5.487 0 9.854-4.467 9.854-9.854 0-2.632-.996-5.108-2.804-6.970-1.809-1.861-4.211-2.885-6.751-2.885Z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                  title="Share on LinkedIn"
                >
                  <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 animate-slideInUp">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
          
          {/* Reviews List */}
          <div className="space-y-6 mb-8">
            {mockReviews.map((review, idx) => (
              <div key={idx} className="pb-6 border-b border-gray-200 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{review.author}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.text}</p>
              </div>
            ))}
          </div>

          {/* Write Review Form */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`text-3xl transition-colors ${
                        star <= userRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review:</label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows="4"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium">
                Submit Review
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-8 animate-slideInUp">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

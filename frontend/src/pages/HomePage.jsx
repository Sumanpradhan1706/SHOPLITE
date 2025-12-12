import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';
import { productAPI } from '../utils/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productAPI.getAll();
      
      console.log('API Response:', response);
      
      if (response.data?.success) {
        setProducts(response.data.data);
      } else if (response.data?.data) {
        setProducts(response.data.data);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setError('Unable to connect to the server. Please ensure the backend is running on port 5000.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center', color: '#1f2937', marginBottom: '2rem' }}>
          Welcome to ShopLite
        </h1>
        <p style={{ textAlign: 'center', color: '#4b5563', marginBottom: '3rem' }}>
          Discover amazing products at unbeatable prices
        </p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
            <button 
              onClick={fetchProducts}
              style={{ marginLeft: '1rem', textDecoration: 'underline', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ color: '#4b5563', fontSize: '1.25rem' }}>No products available.</p>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

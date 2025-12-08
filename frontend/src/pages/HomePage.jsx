import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const sampleProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 99.99,
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 2,
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking',
      price: 199.99,
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 3,
      name: 'Laptop Stand',
      description: 'Ergonomic laptop stand for better posture',
      price: 49.99,
      image: 'https://via.placeholder.com/300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Welcome to ShopLite
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Discover amazing products at unbeatable prices
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

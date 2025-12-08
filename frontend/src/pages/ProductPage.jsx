import { useParams } from 'react-router-dom';

export default function ProductPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Details</h1>
          <p className="text-gray-600">Viewing product with ID: {id}</p>
          <div className="mt-8">
            <img
              src="https://via.placeholder.com/400"
              alt="Product"
              className="w-full max-w-md mx-auto rounded-lg"
            />
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800">Sample Product</h2>
              <p className="text-gray-600 mt-2">
                This is a placeholder for product details. Connect to backend to fetch real data.
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-4">$99.99</p>
              <button className="mt-6 bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

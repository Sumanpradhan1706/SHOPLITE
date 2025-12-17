import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fadeIn group">
      <div className="overflow-hidden">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-600">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-blue-600 transition-all group-hover:scale-110">₹{product.price}</span>
          <Link
            to={`/product/${product.id || product._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

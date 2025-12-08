import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          ShopLite
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-200 transition">
            Home
          </Link>
          <Link to="/login" className="hover:text-blue-200 transition">
            Login
          </Link>
          <Link to="/cart" className="hover:text-blue-200 transition">
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}

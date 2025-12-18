import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCartContext } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCartContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
  }, [location.search]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    setMenuOpen(false);
    if (!term) {
      navigate('/');
      return;
    }
    navigate(`/?search=${encodeURIComponent(term)}`);
  };

  const handleNavClick = (path) => {
    setMenuOpen(false);
    setProfileOpen(false);
    navigate(path);
  };

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-700 tracking-tight hover:text-blue-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              ShopLite
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-1 ml-6">
            <form
              onSubmit={handleSearch}
              className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 transition-all"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Search
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
              onClick={() => setProfileOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <span>Cart</span>
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">
                    {cartCount || 0}
                  </span>
                </Link>

                <Link
                  to="/orders"
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Orders
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
                    onClick={() => setProfileOpen((prev) => !prev)}
                  >
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                      {userInitial}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{user?.name || 'Account'}</span>
                    <span className="text-gray-500">▾</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 animate-slideInUp">
                      <button
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => handleNavClick('/profile')}
                      >
                        Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => handleNavClick('/orders')}
                      >
                        Orders
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
              onClick={() => setMenuOpen(false)}
            >
              <span>Cart</span>
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">
                {cartCount || 0}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all"
              aria-label="Toggle navigation menu"
            >
              <span className="block w-5 border-b border-gray-700 mb-1"></span>
              <span className="block w-5 border-b border-gray-700 mb-1"></span>
              <span className="block w-5 border-b border-gray-700"></span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-3 bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-3 animate-slideInUp">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 transition-all"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white rounded-md font-semibold transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Search
              </button>
            </form>

            <div className="flex flex-col gap-2">
              <button
                className="text-left px-2 py-2 rounded-md hover:bg-gray-100 text-gray-800 font-medium"
                onClick={() => handleNavClick('/')}
              >
                Home
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    className="text-left px-2 py-2 rounded-md hover:bg-gray-100 text-gray-800 font-medium"
                    onClick={() => handleNavClick('/orders')}
                  >
                    Orders
                  </button>
                  <button
                    className="text-left px-2 py-2 rounded-md hover:bg-gray-100 text-gray-800 font-medium"
                    onClick={() => handleNavClick('/profile')}
                  >
                    Profile
                  </button>
                  <button
                    className="text-left px-2 py-2 rounded-md hover:bg-red-50 text-red-600 font-medium"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-left px-2 py-2 rounded-md hover:bg-gray-100 text-gray-800 font-medium"
                    onClick={() => handleNavClick('/login')}
                  >
                    Login
                  </button>
                  <button
                    className="text-left px-2 py-2 rounded-md hover:bg-gray-100 text-gray-800 font-medium"
                    onClick={() => handleNavClick('/register')}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

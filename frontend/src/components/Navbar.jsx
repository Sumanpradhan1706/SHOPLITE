import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ backgroundColor: '#2563eb', color: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
          ShopLite
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#dbeafe'} onMouseLeave={(e) => e.target.style.color = 'white'}>
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/cart" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#dbeafe'} onMouseLeave={(e) => e.target.style.color = 'white'}>
                Cart
              </Link>
              <Link to="/orders" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#dbeafe'} onMouseLeave={(e) => e.target.style.color = 'white'}>
                Orders
              </Link>
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#dbeafe'} onMouseLeave={(e) => e.target.style.color = 'white'}>
                Profile
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem' }}>Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', border: 'none', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#991b1b'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = '#dbeafe'} onMouseLeave={(e) => e.target.style.color = 'white'}>
                Login
              </Link>
              <Link
                to="/register"
                style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', textDecoration: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

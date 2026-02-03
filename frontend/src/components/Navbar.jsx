import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Calendar, LogOut, User as UserIcon, Shield, Layout, Globe, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <div className="container nav-content">
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Globe size={32} color="var(--primary)" />
          <span>PILOTT ZADIIQ</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button 
            onClick={toggleTheme} 
            className="btn btn-outline" 
            style={{ padding: '0.5rem', borderRadius: '0.75rem', border: 'none', background: 'var(--glass)' }}
          >
            {isDarkMode ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#6366f1" />}
          </button>
          <div className="nav-links">
          {user ? (
            <>
              {user.role !== 'cashier' && (
                <>
                  <Link to="/rooms" className={`nav-link ${location.pathname === '/rooms' ? 'active' : ''}`}>Qolalka</Link>
                  <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Maqaayadda</Link>
                </>
              )}
              <Link to="/requests" className={`nav-link ${location.pathname === '/requests' ? 'active' : ''}`}>Codsiyada</Link>
              {user.role === 'staff' && (
                <Link to="/staff" className={`nav-link ${location.pathname === '/staff' ? 'active' : ''}`}>Shaqaalaha</Link>
              )}
              {user.role === 'cashier' && (
                <Link to="/cashier" className={`nav-link ${location.pathname === '/cashier' ? 'active' : ''}`}>Khasnajiga</Link>
              )}
              {user.role === 'accountant' && (
                <Link to="/accountant" className={`nav-link ${location.pathname === '/accountant' ? 'active' : ''}`}>Xisaabiyaha</Link>
              )}
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <>
                  <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Maamulka</Link>
                  <Link to="/admin/requests" className={`nav-link ${location.pathname === '/admin/requests' ? 'active' : ''}`}>Codsiyada</Link>
                </>
              )}
              {user.role === 'superadmin' && (
                <Link to="/superadmin" className={`nav-link ${location.pathname === '/superadmin' ? 'active' : ''}`}>Super Admin</Link>
              )}
              <div style={{ width: '1px', height: '1.5rem', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{user.role}</div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '0.75rem' }}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Soo Gal</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Is-diiwaangeli</Link>
            </>
          )}
        </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

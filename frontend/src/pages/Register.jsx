import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ShieldCheck, Phone } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.phone, formData.role);
      navigate('/rooms');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-up">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Abuur Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <User size={18} />
            <input
              type="text"
              placeholder="Magacaaga oo Dhamaystiran"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email-kaaga"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <Phone size={18} />
            <input
              type="tel"
              placeholder="Telefoonkaaga"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password-ka"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          
          {/* Role Selection */}
          <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#666' }}>Dooro Nuuca Account-ka:</label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ddd' }}
            >
              <option value="user">Macmiil (User)</option>
              <option value="staff">Shaqaale (Staff)</option>
              <option value="cashier">Khasnaji (Cashier)</option>
              <option value="accountant">Xisaabiye (Accountant)</option>
              <option value="admin">Maamule (Admin)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Diiwaangeli
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
          Akoon horey ma u lahayd? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Soo gal</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

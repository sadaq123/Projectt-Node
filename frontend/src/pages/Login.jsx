import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(identifier, password);
      const role = data.user.role;
      
      if (role === 'superadmin') {
        navigate('/superadmin');
      } else if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'cashier') {
        navigate('/cashier');
      } else if (role === 'accountant') {
        navigate('/accountant');
      } else if (role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/rooms');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to authenticate');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass animate-fade-up" style={{ maxWidth: '440px', width: '100%', padding: '3.5rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '1.5rem', marginBottom: '1.5rem' }}>
            <Sparkles size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Portalka Pilott Zadiiq</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Fadlan gali xogtaada si aad u gasho.</p>
        </header>

        {error && <div style={{ color: 'var(--error)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', padding: '0.75rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '0.75rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email ama Taleefan</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                required 
                style={{ paddingLeft: '3rem' }}
                value={identifier} 
                onChange={e => setIdentifier(e.target.value)} 
                placeholder="Email ama 061..." 
              />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Password-ka</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="password" 
                required 
                style={{ paddingLeft: '3rem' }}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1.1rem' }}>
            Soo Gal (Login)
          </button>
        </form>
        
        <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-dim)', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
          Ma ku cusub tahay? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Is-diiwaangeli Hadda</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

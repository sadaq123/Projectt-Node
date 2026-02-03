import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Trash2, UserCog, UserPlus, X, Check, User, Phone, Lock, Save } from 'lucide-react';

const API_URL = 'http://localhost:5000';

// Super Admin Dashboard: Qaybtan waa meesha ugu sarreysa ee laga maamulo dhamaan dadka nidaamka isticmaala
const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null); // Kaydinta ID-ga isticmaalaha la bedelayo
  const [userData, setUserData] = useState({ name: '', phone: '', password: '', role: 'user' });
  const [showForm, setShowForm] = useState(false); // Xakameynta soo bandhigista form-ka

  // Soo qaadashada dhamaan isticmaalayaasha marka bogga la furo
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  // Function lagu daro ama lagu bedelo isticmaale (Submit Form)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (editingUser) {
        // Hadii uu jiro editingUser, markaas waa Update (Bedelid)
        await axios.put(`${API_URL}/users/${editingUser}`, userData, { headers });
      } else {
        // Hadii kale, waa Register (Darid cusub)
        await axios.post(`${API_URL}/users`, userData, { headers });
      }
      
      // Nadiifinta form-ka ka dib markii lagu guuleysto
      setUserData({ name: '', phone: '', password: '', role: 'user' });
      setEditingUser(null);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  // Function u diyaariya form-ka in wax laga bedelo isticmaale gaar ah
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setUserData({ name: user.name, phone: user.phone || '', password: '', role: user.role });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // In kor loo soo baxo si form-ka loo arko
  };

  // Function lagu tirtiro isticmaale (Delete User)
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Ma hubtaa inaad tirtirto isticmaalahan?')) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="container animate-fade-up">
      {/* Cinwaanka sare ee Dashboard-ka */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Super Admin</h1>
          <p style={{ color: 'var(--text-dim)' }}>Maamul isticmaalayaasha nidaamka iyo darajooyinkooda.</p>
        </div>
        <button 
          className={`btn ${showForm ? 'btn-outline' : 'btn-primary'}`} 
          onClick={() => { 
            setShowForm(!showForm); 
            setEditingUser(null); 
            setUserData({ name: '', phone: '', password: '', role: 'user' }); 
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {showForm ? <X size={18} /> : <UserPlus size={18} />}
          {showForm ? 'Xir Formka' : 'Dar Isticmaale'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showForm ? '400px 1fr' : '1fr', gap: '2rem', transition: 'all 0.3s ease' }}>
        {/* Form-ka lagu daro ama lagu bedelo isticmaalaha */}
        {showForm && (
          <div className="glass animate-fade-up">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {editingUser ? <UserCog size={20} color="var(--primary)" /> : <UserPlus size={20} color="var(--primary)" />}
              {editingUser ? 'Cusboonaysii' : 'Diiwaangeli'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={14} /> Magaca Buuxa</label>
                <input required value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} placeholder="Axmed Cali" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> Telefoonka</label>
                <input required value={userData.phone} onChange={e => setUserData({...userData, phone: e.target.value})} placeholder="061XXXXXXX" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={14} /> Role-ka (Darajada)</label>
                <select value={userData.role} onChange={e => setUserData({...userData, role: e.target.value})}>
                  <option value="user">User (Macmiil)</option>
                  <option value="staff">Staff (Shaqaale)</option>
                  <option value="cashier">Cashier (Khasnaji)</option>
                  <option value="accountant">Accountant (Xisaabiye)</option>
                  <option value="admin">Admin (Maamule)</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={14} /> Password</label>
                <input type="password" required={!editingUser} value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} placeholder="******" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Save size={18} /> {editingUser ? 'Cusboonaysii' : 'Diiwaangeli'}
              </button>
            </form>
          </div>
        )}

        {/* Shaxda (Table) lagu soo bandhigayo dhamaan isticmaalayaasha */}
        <div className="glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Shield size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Isticmaalayaasha Nidaamka</h2>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Magaca</th>
                  <th>Telefoonka</th>
                  <th>Role-ka</th>
                  <th>Falalka</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.phone}</td>
                    <td><span className="badge" style={{ background: u.role === 'superadmin' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: u.role === 'superadmin' ? 'white' : 'var(--text-main)' }}>{u.role}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => handleEdit(u)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}><UserCog size={18} /></button>
                        <button onClick={() => handleDeleteUser(u._id)} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

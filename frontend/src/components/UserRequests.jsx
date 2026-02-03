import { useState, useEffect } from 'react';
import axios from 'axios';

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    requestType: 'Room Service',
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const requestTypes = ['Room Service', 'Maintenance', 'Special Request', 'Complaint', 'Other'];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/requests`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Codsigu waa la diray! (Request submitted successfully!)');
      setFormData({ requestType: 'Room Service', title: '', description: '' });
      fetchRequests();
    } catch (error) {
      setMessage('❌ Khalad ayaa dhacay! (Error occurred!)');
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ma hubtaa inaad tirtirto codsigan? (Are you sure you want to delete this request?)')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Codsiga waa la tiray! (Request deleted!)');
      fetchRequests();
    } catch (error) {
      setMessage('❌ Khalad ayaa dhacay! (Error occurred!)');
      console.error('Error deleting request:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Sugitaan', color: 'badge-pending' },
      approved: { text: 'La Ansixiyay', color: 'badge-confirmed' },
      rejected: { text: 'La Diiday', color: 'badge-cancelled' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`badge ${badge.color}`}>{badge.text}</span>;
  };

  return (
    <div className="container animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Adeegyada (Service Requests)</h1>
          <p style={{ color: 'var(--text-dim)' }}>Codso adeeg kasta oo aad ugu baahan tahay qolkaaga.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Submit Request Form */}
        <div className="glass shadow-lg">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageSquare size={24} color="var(--primary)" /> Codsi Cusub
          </h2>
          
          {message && (
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              borderRadius: '1rem', 
              background: message.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              color: message.includes('✅') ? 'var(--success)' : 'var(--error)',
              fontSize: '0.9rem',
              border: `1px solid ${message.includes('✅') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Nooca Codsiga</label>
              <select
                value={formData.requestType}
                onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                required
              >
                {requestTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Cinwaanka</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Tusaale: Wi-fi ma shaqaynayo"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Faahfaahin</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Sharax codsigaaga si faahfaahsan..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem' }}
            >
              {loading ? 'Soo diraya...' : <><Send size={18} /> Soo Dir</>}
            </button>
          </form>
        </div>

        {/* My Requests List */}
        <div className="glass">
          <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ClipboardList size={24} color="var(--accent)" /> Codsiyadii Hore
          </h2>
          
          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed var(--glass-border)', borderRadius: '1.5rem' }}>
              <Info size={40} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-dim)' }}>Wali qol maadan qabsan. Ka xulo qolalka sare.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {requests.map(request => (
                <div key={request._id} className="glass" style={{ background: 'var(--glass)', padding: '1.5rem', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{request.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{request.requestType}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {new Date(request.createdAt).toLocaleDateString('so-SO')}</span>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>{request.description}</p>

                  {request.adminNote && (
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', borderLeft: '4px solid var(--primary)', marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Jawaabta Maamulaha:</p>
                      <p style={{ fontSize: '0.9rem' }}>{request.adminNote}</p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleDelete(request._id)}
                      className="btn"
                      style={{ padding: '0.5rem 1rem', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--error)', border: '1px solid rgba(244, 63, 94, 0.2)', fontSize: '0.8rem' }}
                    >
                      <Trash2 size={14} /> Tirtir
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRequests;

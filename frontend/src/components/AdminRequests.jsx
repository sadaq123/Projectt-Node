import { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, CheckCircle, XCircle, Clock, Filter, List, MessageSquare, Info } from 'lucide-react';

const API_URL = 'http://localhost:5000';

// Admin Requests: Qaybtan waxay maamushaa dhamaan codsiyada macaamiisha (Customer Support/Requests)
const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all'); // Miiraha (All, Pending, Approved, Rejected)
  const [adminNote, setAdminNote] = useState({}); // Meesha lagu kaydiyo jawaabaha admin-ka ee codsi walba
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Soo qaadashada codsiyada marka la furo bogga
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

  // Function lagu ansixiyo codsi (Approve)
  const handleApprove = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/requests/${id}/approve`, 
        { adminNote: adminNote[id] || '' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setMessage('✅ Codsiga waa la ansixiyay!');
      setAdminNote({ ...adminNote, [id]: '' });
      fetchRequests();
    } catch (error) {
      setMessage('❌ Khalad ayaa dhacay!');
      console.error('Error approving request:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function lagu diido codsi (Reject)
  const handleReject = async (id) => {
    if (!adminNote[id]) {
      setMessage('⚠️ Fadlan geli sababta diidmada!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/requests/${id}/reject`,
        { adminNote: adminNote[id] },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setMessage('✅ Codsiga waa la diiday!');
      setAdminNote({ ...adminNote, [id]: '' });
      fetchRequests();
    } catch (error) {
      setMessage('❌ Khalad ayaa dhacay!');
      console.error('Error rejecting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  // Tirakoobka codsiyada (Stats)
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="container animate-fade-up">
      {/* Cinwaanka bogga */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Maamulka Codsiyada</h1>
          <p style={{ color: 'var(--text-dim)' }}>Hubi oo ka jawaab codsiyada macaamiisha.</p>
        </div>
      </div>

      {message && (
        <div style={{ 
          marginBottom: '2rem', padding: '1.25rem', borderRadius: '1.25rem', 
          background: message.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
          color: message.includes('✅') ? 'var(--success)' : 'var(--error)',
          border: `1px solid ${message.includes('✅') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
          display: 'flex', alignItems: 'center', gap: '0.75rem'
        }}>
          {message.includes('✅') ? <CheckCircle size={20} /> : <Info size={20} />}
          {message}
        </div>
      )}

      {/* Statistics Cards - Kaararka tirakoobka */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.total}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Wadarta</div>
        </div>
        <div className="glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#eab308' }}>{stats.pending}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Sugitaan</div>
        </div>
        <div className="glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{stats.approved}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>La Ansixiyay</div>
        </div>
        <div className="glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--error)' }}>{stats.rejected}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>La Diiday</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Navigation Sidebar */}
        <div className="glass" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <Filter size={18} color="var(--primary)" /> Miirayaasha
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['all', 'pending', 'approved', 'rejected'].map(t => (
              <button key={t} onClick={() => setFilter(t)} className={`btn ${filter === t ? 'btn-primary' : 'btn-outline'}`} style={{ textTransform: 'capitalize', width: '100%' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List - Bandhigga codsiyada mid mid */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredRequests.map(request => (
            <div key={request._id} className="glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{request.title}</h3>
                  <p style={{ color: 'var(--text-dim)' }}>By: {request.user?.name} | {request.requestType}</p>
                </div>
                <span className={`badge ${request.status === 'approved' ? 'badge-confirmed' : request.status === 'rejected' ? 'badge-cancelled' : 'badge-pending'}`}>
                  {request.status}
                </span>
              </div>
              <p style={{ marginBottom: '1.5rem' }}>{request.description}</p>

              {/* Action Area - Qaybta laga jawaabayo codsiga */}
              {request.status === 'pending' && (
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                  <textarea
                    className="input-group"
                    placeholder="Qor jawaabta (Note)..."
                    value={adminNote[request._id] || ''}
                    onChange={(e) => setAdminNote({ ...adminNote, [request._id]: e.target.value })}
                    style={{ width: '100%', marginBottom: '1rem' }}
                  />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleApprove(request._id)} className="btn btn-primary" style={{ flex: 1 }}>Ansixi (Approve)</button>
                    <button onClick={() => handleReject(request._id)} className="btn" style={{ flex: 1, background: 'rgba(244, 63, 94, 0.1)', color: 'var(--error)' }}>Diid (Reject)</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRequests;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, ShoppingBag, MessageSquare, List, Filter, CheckCircle, Clock } from 'lucide-react';

const API_URL = 'http://localhost:5000';

// Dashboard-ka Shaqaalaha: Qaybtan waxay maamushaa boos qabsashada iyo dalabaadka cuntada
const StaffDashboard = () => {
  // State-yada lagu kaydiyo xogta laga soo keenay API-ga
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); // Tab-ka hadda furan
  const [filter, setFilter] = useState('all'); // Miiraha lagu kala saaro xogta
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Markii bogga la furo, soo qaado dhamaan xogta
  useEffect(() => {
    fetchData();
  }, []);

  // Function lagu soo qaado xogta Bookings, Orders, iyo Requests hal mar
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [bookingsRes, ordersRes, requestsRes] = await Promise.all([
        axios.get(`${API_URL}/bookings`, { headers }),
        axios.get(`${API_URL}/orders`, { headers }),
        axios.get(`${API_URL}/requests`, { headers })
      ]);

      setBookings(bookingsRes.data);
      setOrders(ordersRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function lagu cusboonaysiiyo xaaladda Booking (Confirm/Cancel)
  const updateBookingStatus = async (id, status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Xaaladda booking-ka waa la cusbooneysiyay!');
      fetchData(); // Dib u soo qaad xogta si isbedelka loo arko
    } catch (error) {
      setMessage('❌ Khalad ayaa dhacay!');
      console.error('Error updating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function lagu cusboonaysiiyo xaaladda Dalabka Cuntada
  const updateOrderStatus = async (id, status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Xaaladda order-ka waa la cusbooneysiyay!');
      fetchData();
    } catch (error) {
      setMessage('❌ Khalad ayaa dhacay!');
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  // Kala saarista xogta iyadoo la raacayo miiraha (Filter)
  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  // Statistics-ka maanta
  const stats = {
    todayBookings: bookings.filter(b => 
      new Date(b.checkIn).toDateString() === new Date().toDateString()
    ).length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    activeRequests: requests.filter(r => r.status === 'pending').length
  };

  return (
    <div className="container animate-fade-up">
      {/* Cinwaanka Dashboard-ka */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Dashboard Shaqaalaha</h1>
          <p style={{ color: 'var(--text-dim)' }}>Maamul boosaska, dalabaadka, iyo codsiyada macaamiisha.</p>
        </div>
      </div>

      {/* Farriimaha guusha ama guul-darrada */}
      {message && (
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1.25rem', 
          borderRadius: '1.25rem', 
          background: message.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
          color: message.includes('✅') ? 'var(--success)' : 'var(--error)',
          border: `1px solid ${message.includes('✅') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
          display: 'flex',
          alignItems: 'center', gap: '0.75rem'
        }}>
          {message.includes('✅') ? <CheckCircle size={20} /> : <Clock size={20} />}
          {message}
        </div>
      )}

      {/* Statistics Cards - Muuqaalka kore ee tirakoobka */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.todayBookings}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Bookings Maanta</div>
        </div>
        <div className="glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#eab308' }}>{stats.pendingOrders}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Orders Sugaya</div>
        </div>
        <div className="glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>{stats.activeRequests}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Codsiyada</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Navigation Sidebar - Dhinaca laga maamulo tab-yada */}
        <div className="glass" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => { setActiveTab('bookings'); setFilter('all'); }}
              className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}
              style={{ justifyContent: 'flex-start', padding: '1rem', width: '100%' }}
            >
              <Calendar size={18} /> Bookings
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setFilter('all'); }}
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
              style={{ justifyContent: 'flex-start', padding: '1rem', width: '100%' }}
            >
              <ShoppingBag size={18} /> Dalabaadka (Orders)
            </button>
            <button
              onClick={() => { setActiveTab('requests'); setFilter('all'); }}
              className={`btn ${activeTab === 'requests' ? 'btn-primary' : 'btn-outline'}`}
              style={{ justifyContent: 'flex-start', padding: '1rem', width: '100%' }}
            >
              <MessageSquare size={18} /> Codsiyada
            </button>
          </div>

          {/* Filter Component - Lagu sifeeyo xaalada (Pending/Confirmed) */}
          {activeTab !== 'requests' && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={14} /> Miiraha
              </h3>
              <select
                className="input-group"
                style={{ width: '100%', padding: '0.5rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '0.5rem' }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Dhammaan</option>
                <option value="pending">Sugitaan</option>
                <option value="confirmed">La Xaqiijiyay</option>
                <option value="cancelled">La Joojiyay</option>
              </select>
            </div>
          )}
        </div>

        {/* Content Area - Meesha xogta lagu soo bandhigo */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {activeTab === 'bookings' && (
            <>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar color="var(--primary)" /> Bookings ({filteredBookings.length})
              </h2>
              {filteredBookings.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '5rem' }}>
                  <List size={48} color="var(--text-dim)" style={{ marginBottom: '1.5rem' }} />
                  <p style={{ color: 'var(--text-dim)' }}>Ma jiraan boosas la helay.</p>
                </div>
              ) : (
                filteredBookings.map(booking => (
                  <div key={booking._id} className="glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{booking.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>{booking.phone} | {booking.email}</p>
                        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Qolka</span>
                            <strong>{booking.room?.name || 'N/A'}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Check-In</span>
                            <strong>{new Date(booking.checkIn).toLocaleDateString()}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Wadarta</span>
                            <strong style={{ color: 'var(--success)' }}>${booking.totalPrice}</strong>
                          </div>
                        </div>
                      </div>
                      {/* Qaybta lagu bedelo xaaladda Booking-ka */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                        <select
                          className="badge"
                          style={{ 
                            background: booking.status === 'confirmed' ? 'var(--success)' : booking.status === 'cancelled' ? 'var(--error)' : 'var(--accent)',
                            color: 'white', border: 'none', cursor: 'pointer'
                          }}
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                          disabled={loading}
                        >
                          <option value="pending">Sugitaan</option>
                          <option value="confirmed">La Xaqiijiyay</option>
                          <option value="cancelled">La Joojiyay</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShoppingBag color="#eab308" /> Dalabaadka ({filteredOrders.length})
              </h2>
              {filteredOrders.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '5rem' }}>
                  <List size={48} color="var(--text-dim)" style={{ marginBottom: '1.5rem' }} />
                  <p style={{ color: 'var(--text-dim)' }}>Ma jiraan dalabaad la helay.</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order._id} className="glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Qolka: {order.roomNumber}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>{new Date(order.createdAt).toLocaleString()}</p>
                        <p style={{ color: 'var(--text-main)' }}>Dalabka: {order.items?.map(i => `${i.name} (${i.quantity})`).join(', ')}</p>
                        {order.note && <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginTop: '0.5rem', color: 'var(--accent)' }}>Note: {order.note}</p>}
                        <div style={{ marginTop: '1rem' }}>
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Wadarta Lacagta:</span>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)', marginLeft: '0.5rem' }}>${order.totalAmount}</span>
                        </div>
                      </div>
                      {/* Qaybta lagu bedelo xaaladda Order-ka */}
                      <select
                        className="badge"
                        style={{ 
                          background: order.status === 'delivered' ? 'var(--success)' : 'var(--primary)',
                          color: 'white', border: 'none'
                        }}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        disabled={loading}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'requests' && (
            <>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare color="var(--secondary)" /> Codsiyada ({requests.length})
              </h2>
              <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '0.75rem', border: '1px solid rgba(56, 189, 248, 0.2)', color: 'var(--secondary)', fontSize: '0.85rem' }}>
                Fiiro gaar ah: Shaqaaluhu kaliya waxay arki karaan codsiyada. Admin-ka ayaa ansixiya.
              </div>
              {requests.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '5rem' }}>
                  <List size={48} color="var(--text-dim)" style={{ marginBottom: '1.5rem' }} />
                  <p style={{ color: 'var(--text-dim)' }}>Ma jiraan codsiyo la helay.</p>
                </div>
              ) : (
                requests.map(request => (
                  <div key={request._id} className="glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{request.title}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>By: {request.user?.name} | {request.requestType}</p>
                      </div>
                      <span className={`badge ${request.status === 'approved' ? 'badge-confirmed' : request.status === 'rejected' ? 'badge-cancelled' : 'badge-pending'}`}>
                        {request.status}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{request.description}</p>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

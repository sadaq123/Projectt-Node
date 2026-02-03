import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Wallet, CheckCircle, Printer, XCircle, List, Filter, ShoppingBag, Calendar, MessageSquare, Info } from 'lucide-react';

const API_URL = 'http://localhost:5000';

// Dashboard-ka Khasnajiga: Qaybtan waxay maamushaa lacag bixinta iyo dakhliga huteelka
const CashierDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [message, setMessage] = useState('');

  // Soo qaadashada xogta marka bogga la furo
  useEffect(() => {
    fetchData();
  }, []);

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

  // Function lagu xisaabinayo wadarta dakhliga (Bookings + Orders)
  const calculateRevenue = () => {
    const bookingRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const orderRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return { bookingRevenue, orderRevenue, total: bookingRevenue + orderRevenue };
  };

  const revenue = calculateRevenue();

  // Stats-ka lagu soo bandhigayo kaararka sare
  const stats = {
    totalRevenue: revenue.total,
    pendingPayments: bookings.filter(b => b.status === 'pending').length + 
                     orders.filter(o => o.status === 'pending').length,
    completedTransactions: bookings.filter(b => b.status === 'confirmed').length +
                           orders.filter(o => o.status === 'delivered').length
  };

  // Function lagu soo saarayo rasiidh (Receipt) oo daabacan
  const generateReceipt = (item, type) => {
    const receiptWindow = window.open('', '_blank');
    const date = new Date().toLocaleDateString('so-SO');
    
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${type}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
            h1 { text-align: center; color: #333; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .details { margin: 20px 0; }
            .row { display: flex; justify-between; margin: 10px 0; }
            .total { font-size: 1.2em; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 20px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🧾 RECEIPT / RASIIDH</h1>
            <p style="text-align: center;">Hotel Booking System</p>
            <p style="text-align: center;">Taariikhda: ${date}</p>
          </div>
          <div class="details">
            ${type === 'booking' ? `
              <div class="row"><span>Magaca:</span><span>${item.name}</span></div>
              <div class="row"><span>Telefoonka:</span><span>${item.phone}</span></div>
              <div class="row"><span>Qolka:</span><span>${item.room?.name || 'N/A'}</span></div>
            ` : `
              <div class="row"><span>Qolka:</span><span>${item.roomNumber}</span></div>
              <div class="row"><span>Waqtiga:</span><span>${new Date(item.createdAt).toLocaleString()}</span></div>
            `}
            <div class="row total">
              <span>Wadarta (Total):</span>
              <span>$${type === 'booking' ? item.totalPrice : item.totalAmount}</span>
            </div>
          </div>
          <div style="text-align: center; margin-top: 40px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Daabac</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Xir</button>
          </div>
        </body>
      </html>
    `);
  };

  return (
    <div className="container animate-fade-up">
      {/* Cinwaanka */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Dashboard Khasnajiga</h1>
          <p style={{ color: 'var(--text-dim)' }}>Maamul lacagaha, qabo lacag bixinta, soona saar rasiidhada.</p>
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

      {/* Tirakoobka Lacagta (Stats Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>${stats.totalRevenue.toFixed(2)}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Wadarta Lacagta</div>
        </div>
        <div className="glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#eab308' }}>{stats.pendingPayments}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Lacag Sugaya</div>
        </div>
        <div className="glass" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.completedTransactions}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Dhammaaday</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Revenue Breakdown - Kala qaybinta dakhliga */}
          <div className="glass">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <DollarSign size={18} color="var(--primary)" /> Kala Qaybinta Lacagta
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Bookings:</span>
                <span style={{ fontWeight: 700 }}>${revenue.bookingRevenue.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Orders:</span>
                <span style={{ fontWeight: 700 }}>${revenue.orderRevenue.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>Wadarta:</span>
                <span style={{ fontWeight: 800, color: 'var(--success)' }}>${revenue.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Navigation Sidebar */}
          <div className="glass">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={() => setActiveTab('bookings')} className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', padding: '1rem', width: '100%' }}>
                <Calendar size={18} /> Bookings
              </button>
              <button onClick={() => setActiveTab('orders')} className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', padding: '1rem', width: '100%' }}>
                <ShoppingBag size={18} /> Dalabaadka
              </button>
              <button onClick={() => setActiveTab('requests')} className={`btn ${activeTab === 'requests' ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', padding: '1rem', width: '100%' }}>
                <MessageSquare size={18} /> Codsiyada
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {activeTab === 'bookings' && (
            <>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar color="var(--primary)" /> Bookings ({bookings.length})
              </h2>
              {bookings.length === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '5rem' }}>
                  <List size={48} color="var(--text-dim)" style={{ marginBottom: '1.5rem' }} />
                  <p style={{ color: 'var(--text-dim)' }}>Ma jiraan boosas la helay.</p>
                </div>
              ) : (
                bookings.map(booking => (
                  <div key={booking._id} className="glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Macmiilka</h4>
                          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{booking.name}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>📞 {booking.phone} | 📧 {booking.email}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Qolka</span>
                            <strong>{booking.room?.name || 'N/A'}</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Wadarta</span>
                            <strong style={{ color: 'var(--success)', fontSize: '1.25rem' }}>${booking.totalPrice}</strong>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end', minWidth: '180px' }}>
                        <span className={`badge ${booking.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending'}`}>{booking.status}</span>
                        {/* Mark Paid Button - Markista lacag bixinta */}
                        {booking.paymentStatus !== 'paid' && (
                          <button onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              await axios.put(`${API_URL}/bookings/${booking._id}/payment`, { paymentStatus: 'paid', paymentMethod: 'cash' }, { headers: { Authorization: `Bearer ${token}` }});
                              setMessage('✅ Lacagta waa la bixiyay!');
                              fetchData();
                            } catch (error) { setMessage('❌ Khalad ayaa dhacay!'); }
                          }} className="btn btn-primary" style={{ width: '100%' }}>Mark Paid</button>
                        )}
                        <button onClick={() => generateReceipt(booking, 'booking')} className="btn btn-outline" style={{ width: '100%' }}><Printer size={16} /> Rasiidh</button>
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
                <ShoppingBag color="#eab308" /> Dalabaadka ({orders.length})
              </h2>
              {orders.map(order => (
                <div key={order._id} className="glass">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Qolka: {order.roomNumber}</h3>
                      <p style={{ color: 'var(--success)', fontSize: '1.5rem', fontWeight: 800 }}>${order.totalAmount}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {order.paymentStatus !== 'paid' && (
                        <button onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            await axios.put(`${API_URL}/orders/${order._id}/payment`, { paymentStatus: 'paid', paymentMethod: 'cash' }, { headers: { Authorization: `Bearer ${token}` }});
                            setMessage('✅ Lacagta waa la bixiyay!');
                            fetchData();
                          } catch (error) { setMessage('❌ Khalad ayaa dhacay!'); }
                        }} className="btn btn-primary">Mark Paid</button>
                      )}
                      <button onClick={() => generateReceipt(order, 'order')} className="btn btn-outline"><Printer size={16} /> Rasiidh</button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'requests' && (
            <>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare color="var(--primary)" /> Codsiyada Macaamiisha ({requests.length})
              </h2>
              {requests.map(request => (
                <div key={request._id} className="glass">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`badge ${request.status === 'approved' ? 'badge-confirmed' : 'badge-pending'}`}>{request.status}</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{request.title}</h3>
                  </div>
                  <p>{request.description}</p>
                  {request.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                      <button onClick={async () => {
                        const note = prompt('Jawaabta:');
                        try {
                          const token = localStorage.getItem('token');
                          await axios.put(`${API_URL}/requests/${request._id}/approve`, { adminNote: note || 'Approved' }, { headers: { Authorization: `Bearer ${token}` }});
                          setMessage('✅ La xaqiijiyay!');
                          fetchData();
                        } catch (error) { setMessage('❌ Khalad!'); }
                      }} className="btn btn-primary">Approve</button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;

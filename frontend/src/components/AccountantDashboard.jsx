import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, TrendingUp, DollarSign, Calendar, FileText, Filter, CheckCircle, Info, BarChart3, List } from 'lucide-react';

const API_URL = 'http://localhost:5000';

// Dashboard-ka Xisaabiyaha: Qaybtan waxay maamushaa warbixinada maaliyadeed iyo dakhliga huteelka
const AccountantDashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' }); // Xilliga warbixinta lagu sifeeyo
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Soo qaadashada tirakoobka guud marka bogga la furo
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Function lagu soo qaado dakhliga maanta, bishaan, iyo lacagaha sugaya
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/reports/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Function lagu soo saaro warbixinta iibka iyadoo la isticmaalayo xilliga la doortay (Date Range)
  const fetchSalesReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await axios.get(`${API_URL}/reports/sales`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setSalesData(response.data);
    } catch (error) {
      setMessage('❌ Khalad ayaa dhacay!');
      console.error('Error fetching sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function lagu soo dejiyo xogta iibka (Export to CSV)
  const exportData = async (type = 'all') => {
    try {
      const token = localStorage.getItem('token');
      const params = { type };
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await axios.get(`${API_URL}/reports/export`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: 'blob' // Xogta waxaa loo soo qaadayaa sidii galka (File)
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click(); // Bilaabista soo dejinta gal-ka
      link.remove();

      setMessage('✅ Warbixinta waa la soo dejiyay!');
    } catch (error) {
      setMessage('❌ Khalad ayaa dhacay!');
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="container animate-fade-up">
      {/* Cinwaanka */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Dashboard Xisaabiyaha</h1>
          <p style={{ color: 'var(--text-dim)' }}>Kormeer xaaladda dhaqaalaha, soo saar warbixinnada iibka.</p>
        </div>
      </div>

      {/* Farriimaha guusha */}
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

      {/* Quick Stats - Muuqaalka kore ee dhaqaalaha */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Dakhliga Maanta</span>
              <Calendar size={18} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>${stats.today.revenue.toFixed(2)}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              {stats.today.bookings} Bookings | {stats.today.orders} Orders
            </div>
          </div>

          <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Dakhliga Bisha</span>
              <TrendingUp size={18} color="var(--success)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>${stats.thisMonth.revenue.toFixed(2)}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              {stats.thisMonth.bookings} Bookings | {stats.thisMonth.orders} Orders
            </div>
          </div>

          <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Lacag Sugaya</span>
              <DollarSign size={18} color="#eab308" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#eab308' }}>${stats.pending.amount.toFixed(2)}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              {stats.pending.bookings} Bookings | {stats.pending.orders} Orders
            </div>
          </div>
        </div>
      )}

      {/* Date Range Filter - Qaybta lagu sifeeyo warbixinta */}
      <div className="glass" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <FileText color="var(--primary)" /> Warbixin Iibka
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Bilowga (Start Date)</label>
            <input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Dhamaadka (End Date)</label>
            <input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })} />
          </div>
          <button onClick={fetchSalesReport} disabled={loading} className="btn btn-primary" style={{ height: '44px' }}>
            {loading ? 'Soo saaraya...' : 'Soo Bandhig'}
          </button>
        </div>

        {/* Export Buttons - Soo dejinta xogta sidii Excel/CSV */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <button onClick={() => exportData('all')} className="btn btn-outline" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
            <Download size={18} /> Export Dhammaan
          </button>
          <button onClick={() => exportData('bookings')} className="btn btn-outline" style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>
            <Download size={18} /> Export Bookings
          </button>
          <button onClick={() => exportData('orders')} className="btn btn-outline" style={{ borderColor: '#eab308', color: '#eab308' }}>
            <Download size={18} /> Export Orders
          </button>
        </div>
      </div>

      {/* Sales Data Display - Bandhigga natiijada baaritaanka */}
      {salesData && (
        <div className="animate-fade-up">
          {/* Summary Cards of filtered results */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Wadarta Lacagta</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>${salesData.summary.totalRevenue.toFixed(2)}</div>
            </div>
            <div className="glass" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>La Bixiyay</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>${salesData.summary.paidRevenue.toFixed(2)}</div>
            </div>
          </div>

          {/* Transactions Table - Faahfaahinta iibka */}
          <div className="glass">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <List size={18} color="var(--primary)" /> Faahfaahinta
            </h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nooca</th>
                    <th>Customer/Room</th>
                    <th>Taariikhda</th>
                    <th>Lacagta</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.bookings.map(b => (
                    <tr key={b._id}>
                      <td style={{ color: 'var(--secondary)' }}>Booking</td>
                      <td><strong>{b.customerName}</strong></td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td><strong style={{ color: 'var(--success)' }}>${b.amount}</strong></td>
                      <td><span className={`badge ${b.paymentStatus === 'paid' ? 'badge-confirmed' : 'badge-pending'}`}>{b.paymentStatus}</span></td>
                    </tr>
                  ))}
                  {salesData.orders.map(o => (
                    <tr key={o._id}>
                      <td style={{ color: '#eab308' }}>Order</td>
                      <td><strong>Qolka {o.roomNumber}</strong></td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td><strong style={{ color: 'var(--success)' }}>${o.amount}</strong></td>
                      <td><span className={`badge ${o.paymentStatus === 'paid' ? 'badge-confirmed' : 'badge-pending'}`}>{o.paymentStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountantDashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Check, X, Plus, Home, Tag, Image as ImageIcon, Briefcase, Users, Layout, Utensils, ShoppingCart, DollarSign, BarChart2, PieChart } from 'lucide-react';
import { format } from 'date-fns';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_URL = 'http://localhost:5000';

const HotelDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'rooms', 'bookings', 'menu', 'orders', 'payments'
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [paymentStats, setPaymentStats] = useState(null);
  const [selectedRoomCategory, setSelectedRoomCategory] = useState('Dhammaan');

  const [newRoom, setNewRoom] = useState({ 
    roomNumber: '', type: 'Single', price: '', description: '', imageUrl: '',
    bedrooms: 1, bathrooms: 1, sittingRooms: 0 
  });
  
  const [newFood, setNewFood] = useState({ name: '', price: '', category: 'Qado', description: '', imageUrl: '' });
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingFood, setEditingFood] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [bookRes, roomRes, orderRes, menuRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/bookings`, { headers }),
        axios.get(`${API_URL}/rooms`, { headers }),
        axios.get(`${API_URL}/orders`, { headers }),
        axios.get(`${API_URL}/food`, { headers }),
        axios.get(`${API_URL}/reports/dashboard`, { headers })
      ]);
      setBookings(bookRes.data);
      setRooms(roomRes.data);
      setFoodOrders(orderRes.data);
      setMenu(menuRes.data);
      setPaymentStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/bookings/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/orders/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error('Error updating order', err);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await axios.put(`${API_URL}/rooms/${editingRoom}`, newRoom);
        setEditingRoom(null);
      } else {
        await axios.post(`${API_URL}/rooms`, newRoom);
      }
      setNewRoom({ 
        roomNumber: '', type: 'Single', price: '', description: '', imageUrl: '',
        bedrooms: 1, bathrooms: 1, sittingRooms: 0 
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Khalad ayaa dhacay');
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await axios.put(`${API_URL}/food/${editingFood}`, newFood);
        setEditingFood(null);
      } else {
        await axios.post(`${API_URL}/food`, newFood);
      }
      setNewFood({ name: '', price: '', category: 'Qado', description: '', imageUrl: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Khalad ayaa dhacay');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Ma hubtaa inaad tirtirto qolkan?')) return;
    try {
      await axios.delete(`${API_URL}/rooms/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting room', err);
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Ma hubtaa inaad tirtirto cuntadan?')) return;
    try {
      await axios.delete(`${API_URL}/food/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting food', err);
    }
  };

  return (
    <div className="container animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Xarunta Maamulka (Admin)</h1>
          <p style={{ color: 'var(--text-dim)' }}>Maamulka Huteelka iyo Maqaayadda.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('overview')}><Layout size={18} /> Warbixin</button>
          <button className={`btn ${activeTab === 'rooms' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('rooms')}><Home size={18} /> Qolalka</button>
          <button className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('bookings')}><Tag size={18} /> Boosaska</button>
          <button className={`btn ${activeTab === 'menu' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('menu')}><Utensils size={18} /> Liiska Cuntada</button>
          <button className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('orders')}><ShoppingCart size={18} /> Dalabaadka</button>
          <button className={`btn ${activeTab === 'payments' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('payments')}><DollarSign size={18} /> Lacagaha</button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <Home size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{rooms.length}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Wadarta Qolalka</div>
        </div>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <Tag size={32} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{bookings.length}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Dalabyada Qolalka</div>
        </div>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <Utensils size={32} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{menu.length}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Noocyada Cuntada</div>
        </div>
        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
          <ShoppingCart size={32} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{foodOrders.length}</div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Dalabyada Cuntada</div>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <div className="animate-fade-up">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div className="glass">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BarChart2 size={24} color="var(--primary)" /> Dakhliga 7-dii Maalin ee u dambaysay
              </h3>
              <div style={{ height: '300px' }}>
                <Bar 
                  data={{
                    labels: ['Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimce', 'Sabti', 'Axad'],
                    datasets: [{
                      label: 'Dakhliga ($)',
                      data: [450, 600, 380, 820, 950, 1100, 750],
                      backgroundColor: 'rgba(139, 92, 246, 0.6)',
                      borderColor: 'var(--primary)',
                      borderWidth: 1,
                      borderRadius: 8
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, grid: { color: 'var(--glass-border)' }, ticks: { color: 'var(--text-dim)' } },
                      x: { grid: { display: false }, ticks: { color: 'var(--text-dim)' } }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="glass">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <PieChart size={24} color="var(--secondary)" /> Qaybaha Dakhliga
              </h3>
              <div style={{ height: '300px' }}>
                <Pie 
                  data={{
                    labels: ['Qolalka', 'Cuntada', 'Adeegyada Kale'],
                    datasets: [{
                      data: [70, 25, 5],
                      backgroundColor: [
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(6, 182, 212, 0.8)'
                      ],
                      borderWidth: 0
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { 
                        position: 'bottom',
                        labels: { color: 'var(--text-dim)', font: { size: 12 } }
                      } 
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="glass">
          <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Plus size={24} color="var(--primary)" /> Diiwaangelinta Qolalka
          </h2>
          <form onSubmit={handleAddRoom} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Lambarka Qolka</label>
              <input required value={newRoom.roomNumber} onChange={e => setNewRoom({ ...newRoom, roomNumber: e.target.value })} placeholder="Tusaale: 501" />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Nooca Qolka</label>
              <select value={newRoom.type} onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}>
                <option value="Single">Single (Hal Qof)</option>
                <option value="Double">Double (Laba Qof)</option>
                <option value="Deluxe">Deluxe (Raaxo)</option>
                <option value="Suite">Suite (Qolal Badan)</option>
                <option value="Family">Family (Qoys)</option>
                <option value="Apartment">Apartment (Guri)</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Qiimaha (Habeenkii $)</label>
              <input type="number" required value={newRoom.price} onChange={e => setNewRoom({ ...newRoom, price: e.target.value })} placeholder="250" />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Qolalka Jiifka</label>
              <input type="number" value={newRoom.bedrooms} onChange={e => setNewRoom({ ...newRoom, bedrooms: e.target.value })} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Musqulaha</label>
              <input type="number" value={newRoom.bathrooms} onChange={e => setNewRoom({ ...newRoom, bathrooms: e.target.value })} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Qolalka Fadhiga</label>
              <input type="number" value={newRoom.sittingRooms} onChange={e => setNewRoom({ ...newRoom, sittingRooms: e.target.value })} />
            </div>
            <div className="input-group" style={{ marginBottom: 0, gridColumn: 'span 3' }}>
              <label className="input-label">Faahfaahin</label>
              <input value={newRoom.description} onChange={e => setNewRoom({ ...newRoom, description: e.target.value })} placeholder="Faahfaahin kooban oo ku saabsan qolka..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3', padding: '1.2rem' }}>
              {editingRoom ? 'Cusboonaysii Qolka' : 'Diiwaangeli Qolka'}
            </button>
            {editingRoom && (
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ gridColumn: 'span 3', marginTop: '-1rem' }} 
                onClick={() => {
                  setEditingRoom(null);
                  setNewRoom({ roomNumber: '', type: 'Single', price: '', description: '', imageUrl: '', bedrooms: 1, bathrooms: 1, sittingRooms: 0 });
                }}
              >
                Iska Daay (Cancel Edit)
              </button>
            )}
          </form>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['Dhammaan', 'Single', 'Double', 'Deluxe', 'Suite', 'Family', 'Apartment'].map(cat => (
              <button 
                key={cat}
                className={`btn ${selectedRoomCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedRoomCategory(cat)}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {rooms.filter(room => selectedRoomCategory === 'Dhammaan' || room.type === selectedRoomCategory).map(room => (
              <div key={room._id} className="glass" style={{ padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center', position: 'relative' }}>
                <img 
                  src={room.imageUrl} 
                  alt="" 
                  onError={(e) => { e.target.onError = null; e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'; }}
                  style={{ width: '80px', height: '80px', borderRadius: '1rem', objectFit: 'cover' }} 
                />
                <div>
                  <div style={{ fontWeight: 800 }}>Qolka {room.roomNumber}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{room.type}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>${room.price}/habeen</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                  <button 
                    onClick={() => {
                      setEditingRoom(room._id);
                      setNewRoom({ ...room });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="btn" 
                    style={{ color: 'var(--primary)', background: 'transparent', padding: '0.25rem' }}
                  >
                    <Plus size={18} style={{ transform: 'rotate(45deg)' }} />
                  </button>
                  <button onClick={() => handleDeleteRoom(room._id)} className="btn" style={{ color: 'var(--error)', background: 'transparent', padding: '0.25rem' }}><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="glass">
          <h2 style={{ marginBottom: '2rem' }}>Maamulka Boosaska</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Macmiilka</th>
                  <th>Qolka</th>
                  <th>Taariikhda</th>
                  <th>Wadarta</th>
                  <th>Xaaladda</th>
                  <th>Falalka</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{b.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{b.email}</div>
                    </td>
                    <td>{b.room?.type} ({b.room?.roomNumber})</td>
                    <td>{format(new Date(b.checkIn), 'MMM dd')} - {format(new Date(b.checkOut), 'MMM dd, yyyy')}</td>
                    <td style={{ fontWeight: 800 }}>${b.totalPrice}</td>
                    <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                    <td>
                      {b.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleUpdateBookingStatus(b._id, 'confirmed')} className="btn btn-primary" style={{ padding: '0.4rem' }} title="Ogolow"><Check size={16} /></button>
                          <button onClick={() => handleUpdateBookingStatus(b._id, 'cancelled')} className="btn" style={{ padding: '0.4rem', background: 'var(--error)' }} title="Diid"><X size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="glass">
          <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {editingFood ? <Check size={24} color="var(--success)" /> : <Plus size={24} color="var(--primary)" />}
            {editingFood ? 'Cusboonaysii Cuntada' : 'Maamulka Liiska Cuntada'}
          </h2>
          <form onSubmit={handleAddFood} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="input-group">
              <label className="input-label">Magaca Cuntada</label>
              <input required value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} placeholder="Tusaale: Baasto iyo Hilib" />
            </div>
            <div className="input-group">
              <label className="input-label">Nooca</label>
              <select value={newFood.category} onChange={e => setNewFood({...newFood, category: e.target.value})}>
                <option value="Quraac">Quraac</option>
                <option value="Qado">Qado</option>
                <option value="Casho">Casho</option>
                <option value="Cabitaan">Cabitaan</option>
                <option value="Macmacaan">Macmacaan</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Qiimaha ($)</label>
              <input type="number" required value={newFood.price} onChange={e => setNewFood({...newFood, price: e.target.value})} placeholder="10" />
            </div>
            <div className="input-group" style={{ gridColumn: 'span 3' }}>
              <label className="input-label">Faahfaahin</label>
              <input value={newFood.description} onChange={e => setNewFood({...newFood, description: e.target.value})} placeholder="Faahfaahin kooban..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3', padding: '1rem' }}>
              {editingFood ? 'Cusboonaysii Cuntada' : 'Ku dar Liiska'}
            </button>
            {editingFood && (
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ gridColumn: 'span 3', marginTop: '-1rem' }} 
                onClick={() => {
                  setEditingFood(null);
                  setNewFood({ name: '', price: '', category: 'Qado', description: '', imageUrl: '' });
                }}
              >
                Iska Daay (Cancel Edit)
              </button>
            )}
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {menu.map(item => (
              <div key={item._id} className="glass" style={{ padding: '1rem', position: 'relative' }}>
                <img 
                  src={item.imageUrl} 
                  alt="" 
                  onError={(e) => { e.target.onError = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'; }}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.75rem', marginBottom: '1rem' }} 
                />
                <div style={{ fontWeight: 800 }}>{item.name}</div>
                <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{item.category} - ${item.price}</div>
                <div style={{ display: 'flex', gap: '0.4rem', position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                  <button 
                    onClick={() => {
                      setEditingFood(item._id);
                      setNewFood({ ...item });
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }} 
                    style={{ background: 'rgba(59, 130, 246, 0.8)', border: 'none', borderRadius: '50%', padding: '0.4rem', cursor: 'pointer', color: 'white' }}
                  >
                    <Plus size={16} style={{ transform: 'rotate(45deg)' }} />
                  </button>
                  <button onClick={() => handleDeleteFood(item._id)} style={{ color: 'white', background: 'rgba(244, 63, 94, 0.8)', border: 'none', borderRadius: '50%', padding: '0.4rem', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (activeTab === 'orders' && (
        <div className="glass">
          <h2 style={{ marginBottom: '2rem' }}>Dalabaadka Cuntada</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Xogta Dalabka</th>
                  <th>Alaabta</th>
                  <th>Wadarta</th>
                  <th>Xaaladda</th>
                  <th>Falalka</th>
                </tr>
              </thead>
              <tbody>
                {foodOrders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>Qolka {order.roomNumber}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{format(new Date(order.createdAt), 'PPp')}</div>
                    </td>
                    <td>
                      {order.items.map((it, i) => (
                        <div key={i} style={{ fontSize: '0.85rem' }}>{it.food?.name} x {it.quantity}</div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 800 }}>${order.totalAmount}</td>
                    <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {order.status === 'pending' && (
                          <button className="btn btn-primary" style={{ padding: '0.4rem' }} onClick={() => handleUpdateOrderStatus(order._id, 'preparing')}>Diyaari</button>
                        )}
                        {order.status === 'preparing' && (
                          <button className="btn" style={{ padding: '0.4rem', background: 'var(--success)' }} onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}>Gaarsii</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {activeTab === 'payments' && (
        <div className="glass">
          <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <DollarSign size={28} color="var(--primary)" /> Warbixinta Lacagaha
          </h2>

          {/* Payment Statistics */}
          {paymentStats && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Maanta (Today)</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>${paymentStats.today.revenue.toFixed(2)}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                    {paymentStats.today.bookings} Boos, {paymentStats.today.orders} Dalab
                  </div>
                </div>

                <div className="glass" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Bisha (This Month)</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>${paymentStats.thisMonth.revenue.toFixed(2)}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                    {paymentStats.thisMonth.bookings} Boos, {paymentStats.thisMonth.orders} Dalab
                  </div>
                </div>

                <div className="glass" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05))' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Lacag Sugaya (Pending)</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>${paymentStats.pending.amount.toFixed(2)}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                    {paymentStats.pending.bookings} Boos, {paymentStats.pending.orders} Dalab
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Payment Management Tables */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Lacagaha Boosaska</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Macmiilka</th>
                    <th>Qolka</th>
                    <th>Wadarta</th>
                    <th>Xaaladda</th>
                    <th>Qaabka</th>
                    <th>Xilliga</th>
                    <th>Falalka</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{b.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{b.email}</div>
                      </td>
                      <td>{b.room?.roomNumber}</td>
                      <td style={{ fontWeight: 800 }}>${b.totalPrice}</td>
                      <td>
                        <span className={`badge ${b.paymentStatus === 'paid' ? 'badge-confirmed' : 'badge-pending'}`}>
                          {b.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{b.paymentMethod || 'N/A'}</td>
                      <td>{b.paidAt ? format(new Date(b.paidAt), 'PPp') : 'N/A'}</td>
                      <td>
                        {(!b.paymentStatus || b.paymentStatus === 'pending') && (
                          <button 
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('token');
                                await axios.put(`${API_URL}/bookings/${b._id}/payment`, 
                                  { paymentStatus: 'paid', paymentMethod: 'cash' },
                                  { headers: { Authorization: `Bearer ${token}` }}
                                );
                                fetchData();
                              } catch (err) {
                                console.error('Error updating payment', err);
                              }
                            }}
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          >
                            Bixi (Mark Paid)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Lacagaha Cuntada</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Qolka</th>
                    <th>Alaabta</th>
                    <th>Wadarta</th>
                    <th>Xaaladda</th>
                    <th>Qaabka</th>
                    <th>Xilliga</th>
                    <th>Falalka</th>
                  </tr>
                </thead>
                <tbody>
                  {foodOrders.map(order => (
                    <tr key={order._id}>
                      <td style={{ fontWeight: 700 }}>Qolka {order.roomNumber}</td>
                      <td>{order.items.length} alaab</td>
                      <td style={{ fontWeight: 800 }}>${order.totalAmount}</td>
                      <td>
                        <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-confirmed' : 'badge-pending'}`}>
                          {order.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{order.paymentMethod || 'N/A'}</td>
                      <td>{order.paidAt ? format(new Date(order.paidAt), 'PPp') : 'N/A'}</td>
                      <td>
                        {(!order.paymentStatus || order.paymentStatus === 'pending') && (
                          <button 
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('token');
                                await axios.put(`${API_URL}/orders/${order._id}/payment`, 
                                  { paymentStatus: 'paid', paymentMethod: 'cash' },
                                  { headers: { Authorization: `Bearer ${token}` }}
                                );
                                fetchData();
                              } catch (err) {
                                console.error('Error updating payment', err);
                              }
                            }}
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          >
                            Bixi (Mark Paid)
                          </button>
                        )}
                      </td>
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

export default HotelDashboard;

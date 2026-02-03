import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Plus, Minus, UtensilsCrossed, CheckCircle, Clock, Trash2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const API_URL = 'http://localhost:5000';

const FoodMenu = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [roomNumber, setRoomNumber] = useState('');
  const [note, setNote] = useState('');
  const [ordered, setOrdered] = useState(false);
  const [error, setError] = useState('');
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenu();
    fetchMyOrders();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_URL}/food`);
      setMenu(res.data);
    } catch (err) {
      console.error('Error fetching menu', err);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      setMyOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  };

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item._id]: {
        ...item,
        quantity: (prev[item._id]?.quantity || 0) + 1
      }
    }));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId].quantity > 1) {
        newCart[itemId].quantity -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (Object.keys(cart).length === 0) return setError('Fadlan cunto dooro horta.');
    if (!roomNumber) return setError('Fadlan geli lambarka qolkaaga.');

    setLoading(true);
    try {
      const items = Object.values(cart).map(item => ({
        food: item._id,
        quantity: item.quantity,
        priceAtOrder: item.price
      }));

      await axios.post(`${API_URL}/orders`, {
        items,
        totalAmount: calculateTotal(),
        roomNumber,
        note
      });
      setOrdered(true);
      setCart({});
      fetchMyOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Dalabka ma hirgelin, fadlan isku day markale.');
    } finally {
      setLoading(false);
    }
  };

  if (ordered) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div className="glass animate-fade-up" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
          <h2>Dalabkaaga waa la helay!</h2>
          <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
            Cuntadaada hadda ayaa la diyaarinayaa, waxaana laguugu keenayaa qolkaaga {roomNumber} dhowaan.
          </p>
          <button className="btn btn-primary" onClick={() => setOrdered(false)}>Dalbo mid kale</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-up" style={{ paddingTop: '3rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <UtensilsCrossed size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '3rem' }}>Maqaayadda Pilott Zadiiq</h1>
        <p style={{ color: 'var(--text-dim)' }}>Dhadhan iyo Tayo isku dhafan. Dalbo cuntadaada ugu macaan.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', marginBottom: '5rem' }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {menu.map(item => (
              <div key={item._id} className="glass room-card" style={{ padding: 0 }}>
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  onError={(e) => { e.target.onError = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'; }}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-pending">{item.category}</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>${item.price}</span>
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem', minHeight: '2.5rem' }}>{item.description}</p>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => addToCart(item)}>
                    <Plus size={16} /> Ku dar Dalabka
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ height: 'fit-content', position: 'sticky', top: '7rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag color="var(--primary)" /> Dalabkaaga
          </h2>
          
          {Object.keys(cart).length === 0 ? (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem 0' }}>Wali waxba ma aadan dalban.</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {Object.values(cart).map(item => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>${item.price} x {item.quantity}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button className="btn" style={{ padding: '0.25rem', borderRadius: '0.5rem' }} onClick={() => removeFromCart(item._id)}><Minus size={14} /></button>
                      <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                      <button className="btn" style={{ padding: '0.25rem', borderRadius: '0.5rem' }} onClick={() => addToCart(item)}><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
                  <span>Warta Guud:</span>
                  <span style={{ color: 'var(--primary)' }}>${calculateTotal()}</span>
                </div>
              </div>

              <form onSubmit={handleOrder}>
                <div className="input-group">
                  <label className="input-label">Lambarka Qolka</label>
                  <input type="text" required value={roomNumber} onChange={e => setRoomNumber(e.target.value)} placeholder="Tusaale: 304" />
                </div>
                <div className="input-group">
                  <label className="input-label">Farriin (Note)</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Sidee kuu diyaarinaa?" rows="2" style={{ resize: 'none' }}></textarea>
                </div>
                {error && <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem' }} disabled={loading}>
                  {loading ? 'Diyaarinaya...' : 'Hadda Dalbo'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* User Order History Section */}
      <div className="glass">
        <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock size={24} color="var(--primary)" /> Taariikhda Cuntada
        </h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Dalabka</th>
                <th>Xilliga</th>
                <th>Qolka</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map(order => (
                <tr key={order._id}>
                  <td>
                    {order.items.map((it, i) => (
                      <div key={i} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                        {it.food?.name} <span style={{ color: 'var(--text-dim)' }}>x{it.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{format(new Date(order.createdAt), 'MMM dd, p')}</td>
                  <td style={{ fontWeight: 700 }}>#{order.roomNumber}</td>
                  <td style={{ fontWeight: 800 }}>${order.totalAmount}</td>
                  <td>
                    <span className={`badge badge-${order.status}`}>
                      {order.status === 'pending' ? 'Wuu Socdaa' : 
                       order.status === 'preparing' ? 'La Diyaarinayaa' : 
                       order.status === 'delivered' ? 'La Gaarsiiyay' : 'La Joojiyay'}
                    </span>
                  </td>
                </tr>
              ))}
              {myOrders.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>Ma jiro wax dalab cunto ah oo aad horay u samaysay.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FoodMenu;

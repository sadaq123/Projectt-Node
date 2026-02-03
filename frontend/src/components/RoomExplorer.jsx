import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, User, Mail, Phone, Calendar as CalendarIcon, Info, CreditCard, Search, DoorOpen, DoorClosed, Layout, Star, ArrowRight, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { differenceInDays, format } from 'date-fns';

const API_URL = 'http://localhost:5000';

const RoomExplorer = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    paymentMethod: 'cash'
  });
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchMyBookings();
  }, []);

  useEffect(() => {
    if (dates.checkIn && dates.checkOut) {
      if (differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn)) > 0) {
        fetchRooms();
      }
    }
  }, [dates.checkIn, dates.checkOut]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dates.checkIn && dates.checkOut) {
        params.checkIn = dates.checkIn;
        params.checkOut = dates.checkOut;
      }
      const res = await axios.get(`${API_URL}/rooms`, { params });
      setRooms(res.data);
      if (selectedRoom && res.data.find(r => r._id === selectedRoom._id && !r.isAvailable)) {
        setSelectedRoom(null);
      }
    } catch (err) {
      console.error('Error fetching rooms', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings`);
      setMyBookings(res.data);
    } catch (err) {
      console.error('Error fetching my bookings', err);
    }
  };

  const calculateTotal = () => {
    if (!dates.checkIn || !dates.checkOut || !selectedRoom) return 0;
    const nights = differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn));
    return nights > 0 ? nights * selectedRoom.price : 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Check if dates are selected
    if (!dates.checkIn || !dates.checkOut) {
      return setError('Fadlan dooro taariikhda Check-in iyo Check-out.');
    }
    
    if (!selectedRoom) return setError('Fadlan dooro qol.');
    if (!selectedRoom.isAvailable) return setError('Walaal qolkan waa lagu jiraa xilliyada aad dooratay.');
    
    const nights = differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn));
    if (nights <= 0) return setError('Check-out waa inuu ka dambeeyaa Check-in.');

    try {
      await axios.post(`${API_URL}/bookings`, {
        ...formData,
        roomId: selectedRoom._id,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        totalPrice: calculateTotal()
      });
      setBooked(true);
      fetchRooms();
      fetchMyBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Khalad ayaa dhacay.');
    }
  };

  if (booked) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '6rem' }}>
        <div className="glass animate-fade-up" style={{ maxWidth: '500px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '2rem' }}>
            <CheckCircle size={64} color="#22c55e" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Boos-celinta waa laguu xaqiijiyay!</h2>
          <p style={{ color: 'var(--text-dim)', marginBottom: '3rem', fontSize: '1.1rem' }}>
            Waan kugu soo dhoweyneynaa Pilott Zadiiq. Waxaad ka eegi kartaa faahfaahinta "Taariikhda Safarka" hoose.
          </p>
          <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem' }} onClick={() => { setBooked(false); setSelectedRoom(null); setDates({ checkIn: '', checkOut: '' }); }}>
            Book kale sameyso
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-up" style={{ paddingTop: '5rem', paddingBottom: '8rem' }}>
      {/* Search & Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>Sahami Qolalkeena</h1>
        <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Pilott Zadiiq waxay kuu haysaa qolal casri ah, apartments, iyo suites loogu talagalay raaxadaada.
        </p>
      </div>

      {/* Modern Date Filter Bar */}
      <div className="glass" style={{ marginBottom: '4rem', padding: '2rem', borderRadius: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CalendarIcon size={14} /> Soo-gelitaan (Check-in)</label>
            <input type="date" value={dates.checkIn} onChange={e => setDates({...dates, checkIn: e.target.value})} />
          </div>
          <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CalendarIcon size={14} /> Ka-bixitaan (Check-out)</label>
            <input type="date" value={dates.checkOut} onChange={e => setDates({...dates, checkOut: e.target.value})} />
          </div>
          <button className="btn btn-primary" style={{ height: '54px', padding: '0 2.5rem' }} onClick={fetchRooms} disabled={loading}>
            {loading ? 'Hubinta...' : 'Hubi Qolalka Banaan'}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['All', 'Single', 'Double', 'Deluxe', 'Suite', 'Family', 'Apartment'].map(cat => (
          <button 
            key={cat}
            className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory(cat)}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '3rem', alignItems: 'start' }}>
        {/* Room Listings grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {rooms.filter(room => selectedCategory === 'All' || room.type === selectedCategory).map(room => (
            <div 
              key={room._id} 
              className={`room-card ${selectedRoom?._id === room._id ? 'selected-room' : ''} ${!room.isAvailable ? 'busy' : ''}`}
              onClick={() => room.isAvailable && setSelectedRoom(room)}
              style={{ 
                cursor: room.isAvailable ? 'pointer' : 'not-allowed', 
                boxShadow: selectedRoom?._id === room._id ? `0 0 0 4px var(--primary), 0 20px 40px -10px var(--primary-glow)` : 'none',
                opacity: room.isAvailable ? 1 : 0.6,
                transform: selectedRoom?._id === room._id ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div className="room-image-wrap">
                <img src={room.imageUrl} alt={room.type} className="room-image" />
                <div className={`room-badge ${room.isAvailable ? 'badge-confirmed' : 'badge-errors'}`} style={{ 
                  background: room.isAvailable ? 'var(--success)' : 'var(--error)',
                  padding: '0.6rem 1rem',
                  borderRadius: '1rem',
                  fontWeight: 800,
                  fontSize: '0.75rem'
                }}>
                  {room.isAvailable ? 'Banaan (Available)' : 'Buuxa (Unavailable)'}
                </div>
              </div>
              <div className="room-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{room.type}</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{room.roomNumber}</h3>
                  </div>
                  <div className="room-price" style={{ fontSize: '1.5rem' }}>${room.price}<span>/habeen</span></div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--glass)', padding: '0.4rem 0.8rem', borderRadius: '0.75rem', fontSize: '0.8rem' }}>
                    <DoorOpen size={14} color="var(--primary)" /> {room.bedrooms} Jiif
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--glass)', padding: '0.4rem 0.8rem', borderRadius: '0.75rem', fontSize: '0.8rem' }}>
                    <Info size={14} color="var(--accent)" /> {room.bathrooms} Musqul
                  </div>
                  {room.sittingRooms > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--glass)', padding: '0.4rem 0.8rem', borderRadius: '0.75rem', fontSize: '0.8rem' }}>
                      <Layout size={14} color="var(--secondary)" /> {room.sittingRooms} Fadhi
                    </div>
                  )}
                </div>

                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5 }}>{room.description}</p>
              </div>
            </div>
          ))}
          {rooms.length === 0 && (
            <div className="glass" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem' }}>
              <Search size={48} color="var(--text-dim)" style={{ marginBottom: '1.5rem' }} />
              <h3>Ma jiraan qolal banaan xilligaas.</h3>
              <p style={{ color: 'var(--text-dim)' }}>Fadlan dooro taariikh kale ama nala soo xiriir.</p>
            </div>
          )}
        </div>

        {/* Integrated Booking Panel */}
        <div className="glass" style={{ position: 'sticky', top: '7rem', padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CreditCard color="var(--primary)" /> {user?.role === 'staff' ? 'Xogta Qolka' : 'Dhamaystir Boos-celinta'}
          </h2>
          
          {user?.role === 'staff' && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '1rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <p style={{ color: 'var(--primary)', fontSize: '0.9rem', margin: 0 }}>
                ℹ️ <strong>Indhaha Shaqaalaha:</strong> Waxaad arki kartaa qolalka oo kaliya. Booking-ga waxaa sameeya macaamiisha.
              </p>
            </div>
          )}
          
          {error && <div style={{ color: 'white', marginBottom: '1.5rem', padding: '1rem', background: 'var(--error)', borderRadius: '1rem', fontSize: '0.85rem' }}>{error}</div>}
          
          {!selectedRoom ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed var(--glass-border)', borderRadius: '1.5rem' }}>
              <div style={{ background: 'var(--glass)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '1.5rem', margin: '0 auto 1.5rem' }}>
                <DoorOpen color="var(--text-dim)" size={32} />
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                {user?.role === 'staff' ? 'Riix qol si aad u aragto faahfaahinta.' : 'Fadlan dooro qolka aad rabto si aad u dhamaystirto xogta.'}
              </p>
            </div>
          ) : user?.role === 'staff' ? (
            // Staff view-only panel
            <div className="animate-fade-up">
              <div style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1rem', background: 'var(--glass)', borderRadius: '1.5rem', border: '1px solid var(--glass-border)' }}>
                <img src={selectedRoom.imageUrl} alt="" style={{ width: '80px', height: '80px', borderRadius: '1rem', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Qolka La Doortay</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedRoom.roomNumber}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{selectedRoom.type}</div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--glass)', borderRadius: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Qiimaha Habeenkii</span>
                  <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>${selectedRoom.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Qolalka Jiifka</span>
                  <span style={{ fontWeight: 700 }}>{selectedRoom.bedrooms}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Musqulaha</span>
                  <span style={{ fontWeight: 700 }}>{selectedRoom.bathrooms}</span>
                </div>
                {selectedRoom.sittingRooms > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Qolalka Fadhiga</span>
                    <span style={{ fontWeight: 700 }}>{selectedRoom.sittingRooms}</span>
                  </div>
                )}
              </div>

              <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '1rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: 0 }}>
                  📋 Faahfaahinta qolka oo kaliya. Booking waxaa sameeya macaamiisha.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="animate-fade-up">
              <div style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1rem', background: 'var(--glass)', borderRadius: '1.5rem', border: '1px solid var(--glass-border)' }}>
                <img src={selectedRoom.imageUrl} alt="" style={{ width: '80px', height: '80px', borderRadius: '1rem', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Qolka La Doortay</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedRoom.roomNumber}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{selectedRoom.type}</div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Magacaaga (Name)</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Magaca oo saddexan" style={{ paddingLeft: '3rem' }} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Telefoonkaaga (Phone)</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+252 61..." style={{ paddingLeft: '3rem' }} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Qaabka Lacag Bixinta (Payment Method)</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <select 
                    value={formData.paymentMethod} 
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                    style={{ paddingLeft: '3rem', width: '100%', padding: '1rem 3rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text)' }}
                  >
                    <option value="cash">Lacag Caddaan (Cash)</option>
                    <option value="E-Dahab">E-Dahab</option>
                    <option value="Zaad">Zaad Service</option>
                    <option value="Sahal">Sahal (Golis)</option>
                  </select>
                </div>
              </div>

              {formData.paymentMethod !== 'cash' && (
                <div className="input-group animate-fade-up">
                  <label className="input-label">Account Number / Number-ka lacagta laga diray</label>
                  <div style={{ position: 'relative' }}>
                    <Hash size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input 
                      type="text" 
                      required 
                      value={formData.accountNumber || ''} 
                      onChange={e => setFormData({...formData, accountNumber: e.target.value})} 
                      placeholder="Geli number-ka..." 
                      style={{ paddingLeft: '3rem' }} 
                    />
                  </div>
                </div>
              )}
              
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))', borderRadius: '1.5rem', marginBottom: '2rem', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Tirada Habeenada</span>
                  <span style={{ fontWeight: 700 }}>{differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn)) || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Mudada</span>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{dates.checkIn} — {dates.checkOut}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Wadarta</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${calculateTotal()}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.3rem' }}>
                Xaqiiji Booska <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* History section moved below */}
      <div className="glass animate-fade-up" style={{ marginTop: '6rem' }}>
        <h2 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock size={28} color="var(--primary)" /> Taariikhda Safarkaaga
        </h2>
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th>Xogta Qolka (Unit Info)</th>
                <th>Waqtiga (Timeline)</th>
                <th>Qiimaha (Total)</th>
                <th>Xaaladda (Status)</th>
              </tr>
            </thead>
            <tbody>
              {myBookings.map(b => (
                <tr key={b._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <img src={b.room?.imageUrl} alt="" style={{ width: '60px', height: '60px', borderRadius: '1rem', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{b.room?.type} Room {b.room?.roomNumber}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Pilott Zadiiq</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{format(new Date(b.checkIn), 'MMM dd')} - {format(new Date(b.checkOut), 'MMM dd, yyyy')}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{differenceInDays(new Date(b.checkOut), new Date(b.checkIn))} habeen</div>
                  </td>
                  <td style={{ fontWeight: 800, fontSize: '1.1rem' }}>${b.totalPrice}</td>
                  <td>
                    <span className={`badge badge-${b.status}`} style={{ padding: '0.5rem 1rem', borderRadius: '2rem' }}>
                      {b.status === 'confirmed' ? 'La Aqbalay' : b.status === 'pending' ? 'Sugaya' : 'La Joojiyay'}
                    </span>
                  </td>
                </tr>
              ))}
              {myBookings.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>Wali qol maadan qabsan. Ka xulo qolalka sare.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomExplorer;

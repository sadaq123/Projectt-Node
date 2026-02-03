import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, User, Mail, Phone, MessageSquare, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000';

const UserBooking = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    reason: ''
  });
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSlots();
    fetchMyAppointments();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${API_URL}/slots`);
      setSlots(res.data);
    } catch (err) {
      console.error('Error fetching slots', err);
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/appointments`);
      setMyAppointments(res.data);
    } catch (err) {
      console.error('Error fetching my appointments', err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return setError('Please select a time slot.');

    try {
      await axios.post(`${API_URL}/appointments`, {
        ...formData,
        date: selectedSlot.date,
        time: selectedSlot.time,
        slotId: selectedSlot._id
      });
      setBooked(true);
      fetchSlots();
      fetchMyAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  if (booked) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div className="glass" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Booking Successful!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            We've received your appointment request. You'll receive a confirmation email shortly.
          </p>
          <button className="btn btn-primary" onClick={() => { setBooked(false); setFormData({ name: '', email: '', phone: '', reason: '' }); setSelectedSlot(null); }}>
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="container">
      <div className="grid grid-cols-1 grid-cols-2">
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Select Available Slot</h2>
          {Object.keys(groupedSlots).length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No slots available. Please check back later.</p>
          ) : (
            Object.entries(groupedSlots).map(([date, daySlots]) => (
              <div key={date} style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{new Date(date).toDateString()}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                  {daySlots.sort((a,b) => a.time.localeCompare(b.time)).map(slot => (
                    <div
                      key={slot._id}
                      className={`slot-card ${slot.isBooked ? 'booked' : 'available'} ${selectedSlot?._id === slot._id ? 'selected' : ''}`}
                      onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                    >
                      <Clock size={16} style={{ marginBottom: '0.25rem' }} />
                      <div>{slot.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="glass">
          <h2 style={{ marginBottom: '1.5rem' }}>Your Information</h2>
          {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>{error}</div>}
          <form onSubmit={handleBooking}>
            <div className="input-group">
              <label><User size={14} inline /> Full Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label><Mail size={14} inline /> Email Address</label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label><Phone size={14} inline /> Phone Number</label>
              <input
                required
                type="tel"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label><MessageSquare size={14} inline /> Reason for Appointment</label>
              <textarea
                required
                rows="3"
                placeholder="Briefly describe why you are booking..."
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
              ></textarea>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem' }}>
                <strong>Selected:</strong> {selectedSlot ? `${selectedSlot.date} at ${selectedSlot.time}` : 'None'}
              </p>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!selectedSlot}>
              Confirm Booking
            </button>
          </form>
        </div>
      </div>

      <div className="glass" style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={24} /> My Appointments
        </h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myAppointments.map(app => (
                <tr key={app._id}>
                  <td>
                    <div>{app.date}</div>
                    <div style={{ color: 'var(--primary)', fontWeight: '600' }}>{app.time}</div>
                  </td>
                  <td>{app.reason}</td>
                  <td>
                    <span className={`badge badge-${app.status}`}>{app.status}</span>
                  </td>
                </tr>
              ))}
              {myAppointments.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>You haven't booked any appointments yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserBooking;

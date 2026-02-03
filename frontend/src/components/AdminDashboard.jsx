import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Check, X, Plus, Calendar } from 'lucide-react';

const API_URL = 'http://localhost:5000';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: '', time: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, slotRes] = await Promise.all([
        axios.get(`${API_URL}/appointments`),
        axios.get(`${API_URL}/slots`)
      ]);
      setAppointments(appRes.data);
      setSlots(slotRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/appointments/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/slots`, newSlot);
      setNewSlot({ date: '', time: '' });
      fetchData();
    } catch (err) {
      console.error('Error adding slot', err);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await axios.delete(`${API_URL}/slots/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting slot', err);
    }
  };

  return (
    <div className="container">
      <div className="grid grid-cols-1">
        <div className="glass" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={24} /> Manage Available Slots
          </h2>
          <form onSubmit={handleAddSlot} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
              <label>Date</label>
              <input type="date" required value={newSlot.date} onChange={e => setNewSlot({ ...newSlot, date: e.target.value })} />
            </div>
            <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
              <label>Time</label>
              <input type="time" required value={newSlot.time} onChange={e => setNewSlot({ ...newSlot, time: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Add Slot</button>
          </form>

          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {slots.sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map(slot => (
              <div key={slot._id} className="glass" style={{ padding: '1rem', position: 'relative' }}>
                <p><strong>{slot.date}</strong></p>
                <p style={{ color: 'var(--text-muted)' }}>{slot.time}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  {slot.isBooked ? 
                    <span className="badge badge-approved">Booked</span> : 
                    <span className="badge badge-pending">Available</span>
                  }
                </div>
                {!slot.isBooked && (
                  <button onClick={() => handleDeleteSlot(slot._id)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={24} /> Appointments
          </h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => (
                  <tr key={app._id}>
                    <td><strong>{app.name}</strong></td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{app.email}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{app.phone}</div>
                    </td>
                    <td>
                      <div>{app.date}</div>
                      <div style={{ color: 'var(--primary)', fontWeight: '600' }}>{app.time}</div>
                    </td>
                    <td>{app.reason}</td>
                    <td>
                      <span className={`badge badge-${app.status}`}>{app.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {app.status === 'pending' && (
                          <>
                            <button className="btn btn-primary" style={{ padding: '0.4rem', borderRadius: '4px' }} onClick={() => handleUpdateStatus(app._id, 'approved')}>
                              <Check size={16} />
                            </button>
                            <button className="btn" style={{ padding: '0.4rem', borderRadius: '4px', background: 'var(--error)' }} onClick={() => handleUpdateStatus(app._id, 'cancelled')}>
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {app.status === 'approved' && (
                          <button className="btn" style={{ padding: '0.4rem', borderRadius: '4px', background: 'var(--error)' }} onClick={() => handleUpdateStatus(app._id, 'cancelled')}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

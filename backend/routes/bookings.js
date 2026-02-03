const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// GET /bookings → list bookings (Open for testing)
router.get('/', async (req, res) => {
  try {
    let query = {};
    const bookings = await Booking.find(query).populate('room').sort({ checkIn: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /bookings/:id → get a single booking (Open for testing)
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /bookings → create a reservation (Open for testing)
router.post('/', async (req, res) => {
  const { roomId, checkIn, checkOut, name, email, phone, totalPrice } = req.body;

  try {
    // Check for date overlap
    const existingBooking = await Booking.findOne({
      room: roomId,
      status: { $ne: 'cancelled' },
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Qolkan waa la degan yahay ilaa laga baneynayo qof kale ma dalban karo.' });
    }

    const booking = new Booking({
      room: roomId,
      user: req.body.userId || null, // Optional userId from body
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalPrice,
      name, email, phone
    });

    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /bookings/:id → update status (Open for testing)
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = req.body.status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update booking payment status (Open for testing)
router.put('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.paymentStatus = paymentStatus;
    if (paymentMethod) booking.paymentMethod = paymentMethod;
    if (paymentStatus === 'paid') booking.paidAt = new Date();

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Toggle booking active status (admin, superadmin)
router.put('/:id/toggle-active', auth(['admin', 'superadmin']), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.isActive = !booking.isActive;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /bookings/:id (Open for testing)
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    await booking.deleteOne();
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

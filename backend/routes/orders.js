const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// GET /orders → list orders (Open for testing)
router.get('/', async (req, res) => {
  try {
    let query = {};
    const orders = await Order.find(query).populate('items.food').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /orders/:id → get a single order (Open for testing)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.food');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /orders → place order (Open for testing)
router.post('/', async (req, res) => {
  const { items, totalAmount, roomNumber, note } = req.body;
  
  try {
    // Check if room exists and is currently occupied
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ message: 'Qolkaas lama helin.' });
    }

    const now = new Date();
    const activeBooking = await Booking.findOne({
      room: room._id,
      status: { $in: ['confirmed', 'pending'] },
      checkIn: { $lte: now },
      checkOut: { $gte: now }
    });

    if (!activeBooking) {
      return res.status(400).json({ message: 'Qolkaas cidna ma degana, cunto looma diyaarin karo.' });
    }

    const order = new Order({
      user: req.body.userId || null, // Optional userId from body
      items,
      totalAmount,
      roomNumber,
      note
    });
    
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /orders/:id → update status (Open for testing)
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order payment status (cashier, admin, superadmin)
router.put('/:id/payment', auth(['cashier', 'admin', 'superadmin']), async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentStatus = paymentStatus;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (paymentStatus === 'paid') order.paidAt = new Date();

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Toggle order active status (admin, superadmin)
router.put('/:id/toggle-active', auth(['admin', 'superadmin']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isActive = !order.isActive;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /orders/:id (Open for testing)
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

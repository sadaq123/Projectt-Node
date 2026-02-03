const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

const Booking = require('../models/Booking');

// GET /rooms → list all rooms (with optional availability check)
router.get('/', async (req, res) => {
  const { checkIn, checkOut } = req.query;
  
  try {
    const rooms = await Room.find().lean(); // Use lean for modifying objects
    
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      
      const bookings = await Booking.find({
        status: { $ne: 'cancelled' },
        $or: [
          { checkIn: { $lt: end }, checkOut: { $gt: start } }
        ]
      });

      const bookedRoomIds = bookings.map(b => b.room.toString());
      
      rooms.forEach(room => {
        room.isAvailable = !bookedRoomIds.includes(room._id.toString());
      });
    } else {
      rooms.forEach(room => room.isAvailable = true);
    }
    
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /rooms/:id → get a single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /rooms → add a room (Open for testing)
router.post('/', validate(schemas.room), async (req, res) => {
  const { roomNumber, type, price, description, imageUrl, bedrooms, bathrooms, sittingRooms } = req.body;
  const room = new Room({ 
    roomNumber, type, price, description, imageUrl, 
    bedrooms: bedrooms || 1, 
    bathrooms: bathrooms || 1, 
    sittingRooms: sittingRooms || 0 
  });

  try {
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /rooms/:id → edit room (Open for testing)
router.put('/:id', validate(schemas.room), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    Object.assign(room, req.body);
    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /rooms/:id → delete room (Open for testing)
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    await room.deleteOne();
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

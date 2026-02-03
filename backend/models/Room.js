const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Family', 'Apartment'], 
    default: 'Single' 
  },
  price: { type: Number, required: true },
  description: { type: String },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  sittingRooms: { type: Number, default: 0 },
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80' }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);

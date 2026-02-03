const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    quantity: { type: Number, default: 1 },
    priceAtOrder: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  roomNumber: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile', 'other'],
    default: 'cash'
  },
  paidAt: { type: Date },
  isActive: { type: Boolean, default: true },
  note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

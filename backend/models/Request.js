const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  requestType: { 
    type: String, 
    required: true,
    enum: ['Room Service', 'Maintenance', 'Special Request', 'Complaint', 'Other']
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminNote: { 
    type: String 
  },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reviewedAt: { 
    type: Date 
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);

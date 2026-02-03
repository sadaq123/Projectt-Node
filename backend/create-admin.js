const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const mongodb = 'mongodb://127.0.0.1:27017/projectnode';

mongoose.connect(mongodb)
  .then(async () => {
    const existing = await User.findOne({ email: 'admin@pilott.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }
    const user = new User({ 
      name: 'Admin Pilott', 
      email: 'admin@pilott.com', 
      password: 'admin123', 
      role: 'superadmin' 
    });
    await user.save();
    console.log('Admin account created: admin@pilott.com / admin123');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

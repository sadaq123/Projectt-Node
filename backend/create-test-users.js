const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const mongodb = 'mongodb://127.0.0.1:27017/projectnode';

async function createTestUsers() {
  try {
    await mongoose.connect(mongodb);
    console.log('Connected to MongoDB');

    // Delete existing test users
    await User.deleteMany({ 
      email: { $in: testUsers.map(u => u.email) } 
    });
    console.log('Deleted existing test users');

    // Create new test users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✓ Created ${userData.role}: ${userData.email} (password: ${userData.password})`);
    }

    console.log('\n✅ All test users created successfully!');
    console.log('\nLogin credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach(u => {
      console.log(`${u.role.toUpperCase().padEnd(10)} | Email: ${u.email.padEnd(20)} | Password: ${u.password}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
}

createTestUsers();

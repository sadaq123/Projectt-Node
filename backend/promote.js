const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const email = process.argv[2];

if (!email) {
  console.log('Please provide an email: node promote.js user@example.com');
  process.exit(1);
}

const mongodb = 'mongodb://127.0.0.1:27017/projectnode';

mongoose.connect(mongodb)
  .then(async () => {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    user.role = 'superadmin';
    await user.save();
    console.log(`User ${email} promoted to superadmin`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

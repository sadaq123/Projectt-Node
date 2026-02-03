const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Qaybtan waxay soo dejinaysaa libraries-ka loo baahan yahay
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Qaybtan waxay maamushaa xogta soo gashay iyo ogolaanshaha CORS
app.use(cors());
app.use(express.json());

// MongoDB Connection - Qaybtan waxay ku xiraysaa database-ka MongoDB
const mongodb = 'mongodb://127.0.0.1:27017/projectnode';
mongoose.connect(mongodb)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes - Qaybtan waa waddooyinka (endpoints) API-ga uu leeyahay
app.use('/auth', require('./routes/auth'));      // Wadada xaqiijinta isticmaalaha (Login/Register)
app.use('/rooms', require('./routes/rooms'));    // Wadada maamulka qolalka
app.use('/bookings', require('./routes/bookings')); // Wadada maamulka boos qabsashada
app.use('/food', require('./routes/food'));      // Wadada maamulka cuntada
app.use('/orders', require('./routes/orders'));  // Wadada maamulka dalabaadka cuntada
app.use('/users', require('./routes/users'));    // Wadada maamulka isticmaalayaasha
app.use('/requests', require('./routes/requests')); // Wadada maamulka codsiyada
app.use('/reports', require('./routes/reports'));  // Wadada maamulka warbixinada (Accountant)

// Bogga ugu horeeya ee API-ga
app.get('/', (req, res) => {
  res.send('Appointment Booking API is running...');
});

// Bilaabista server-ka
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

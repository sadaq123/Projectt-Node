const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

const mongodb = 'mongodb://127.0.0.1:27017/projectnode';

const rooms = [
  {
    roomNumber: 'Suite 701',
    type: 'Suite',
    price: 350,
    description: 'Presidential Suite leh view qurux badan, fadhi casri ah iyo 2 musqulood.',
    bedrooms: 1,
    bathrooms: 2,
    sittingRooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
  },
  {
    roomNumber: 'Apt 502',
    type: 'Apartment',
    price: 500,
    description: 'Apartment dhamaystiran: 2 qol jif, kushiin, fadhi balaaran iyo 2 musqulood.',
    bedrooms: 2,
    bathrooms: 2,
    sittingRooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
  },
  {
    roomNumber: 'Double 304',
    type: 'Double',
    price: 180,
    description: 'Qol double ah oo ku haboon lamaanaha, leh musqul gaar ah iyo balakoon.',
    bedrooms: 1,
    bathrooms: 1,
    sittingRooms: 0,
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
  },
  {
    roomNumber: 'Family 101',
    type: 'Family',
    price: 280,
    description: 'Qolka qoyska: 3 sariirood, meel caruurtu ku ciyaarto iyo amniga oo sugan.',
    bedrooms: 1,
    bathrooms: 1,
    sittingRooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
  }
];

mongoose.connect(mongodb)
  .then(async () => {
    for (const r of rooms) {
      await Room.findOneAndUpdate({ roomNumber: r.roomNumber }, r, { upsert: true });
    }
    console.log('Diverse rooms seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

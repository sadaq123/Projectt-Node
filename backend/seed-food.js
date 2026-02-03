const mongoose = require('mongoose');
const Food = require('./models/Food');
require('dotenv').config();

const mongodb = 'mongodb://127.0.0.1:27017/projectnode';

const menuItems = [
  {
    name: 'Quraac Soomaali',
    description: 'Bariis, Canjeero, Beer iyo Shaah Cadeys.',
    price: 8,
    category: 'Quraac',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
  },
  {
    name: 'Bariis iyo Hilib Saliid',
    description: 'Bariis caraf leh, hilib ari oo la shiilay iyo suugo.',
    price: 15,
    category: 'Qado',
    imageUrl: 'https://images.unsplash.com/photo-1512058560366-cd2427ff2963'
  },
  {
    name: 'Baasto iyo Kaluun',
    description: 'Baasto Talyaani ah oo leh kaluun daray ah iyo khudaar.',
    price: 12,
    category: 'Casho',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-0bfb1c764b3f'
  },
  {
    name: 'Casiir Fresh ah',
    description: 'Cananaas, Cambe iyo Liin isku qasan.',
    price: 4,
    category: 'Cabitaan',
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-9cd14200fbf0'
  }
];

mongoose.connect(mongodb)
  .then(async () => {
    for (const item of menuItems) {
      await Food.findOneAndUpdate({ name: item.name }, item, { upsert: true });
    }
    console.log('Food menu seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const mongoose = require('mongoose');
const Room = require('./models/Room');
const Food = require('./models/Food');
require('dotenv').config();

const mongodb = 'mongodb://127.0.0.1:27017/projectnode';

// 40 STRICTLY UNIQUE ROOM IMAGES
const roomImages = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32', 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
  'https://images.unsplash.com/photo-1591088398332-8a77dff9768c', 'https://images.unsplash.com/photo-1544124499-58ed3237583e',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304', 'https://images.unsplash.com/photo-1554995207-c18c203602cb',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39', 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c', 'https://images.unsplash.com/photo-1595665593673-bf1ad72905c0',
  'https://images.unsplash.com/photo-1512918760513-95f192633805', 'https://images.unsplash.com/photo-1522771753037-6333618fce0e',
  'https://images.unsplash.com/photo-1609949165386-243a30094d27', 'https://images.unsplash.com/photo-1587985064135-0366536eab42',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  'https://images.unsplash.com/photo-1535827841776-24afc1e255ac', 'https://images.unsplash.com/photo-1600210491892-03d5430f363c',
  'https://images.unsplash.com/photo-1600210491369-e753d80a41f3', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0', 'https://images.unsplash.com/photo-1560184897-ae75f418493e',
  'https://images.unsplash.com/photo-1560185127-6a6a605ce226', 'https://images.unsplash.com/photo-1600607686527-6fb886090705',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfe1', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', 'https://images.unsplash.com/photo-1600566753197-87762921388f',
  'https://images.unsplash.com/photo-1600566753376-12c8ab78b301', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf6114',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b', 'https://images.unsplash.com/photo-1600585152220-9036c0474606',
  'https://images.unsplash.com/photo-1512918580421-b2feee0b8508', 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198'
];

// 43 STRICTLY UNIQUE FOOD IMAGES - NO DUPLICATES ACROSS CATEGORIES
const foodImages = {
  Quraac: [ // 8 Items
    'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666', 'https://images.unsplash.com/photo-1484723089335-9629bc196bc5',
    'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a', 'https://images.unsplash.com/photo-1525351484163-7529414344d8',
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759', 'https://images.unsplash.com/photo-1496042399014-dc73cbb36c81',
    'https://images.unsplash.com/photo-1522924194017-dda2e53ef71e', 'https://images.unsplash.com/photo-1628198950577-0c7f20152f2c'
  ],
  Qado: [ // 12 Items
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    'https://images.unsplash.com/photo-1547592166-23ac45744acd', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d', 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543',
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0', 'https://images.unsplash.com/photo-1543353071-087f9fb9c66e',
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe', 'https://images.unsplash.com/photo-1574484284002-952d92456975'
  ],
  Casho: [ // 13 Items
    'https://images.unsplash.com/photo-1559339352-11d035aa65de', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    'https://images.unsplash.com/photo-1544025162-d76690b67f66', 'https://images.unsplash.com/photo-1585238342024-78d387f4a707',
    'https://images.unsplash.com/photo-1550547660-d9450f859349', 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b9',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87', 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5',
    'https://images.unsplash.com/photo-1625944525867-b74709d1720d', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb',
    'https://images.unsplash.com/photo-1560684352-849783e938ca', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec',
    'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659'
  ],
  Macmacaan: [ // 10 Items
    'https://images.unsplash.com/photo-1551024601-bec78aea704b', 'https://images.unsplash.com/photo-1563729784400-d26b0d912061',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187',
    'https://images.unsplash.com/photo-1567171466295-4afa63d45416', 'https://images.unsplash.com/photo-1587314168485-3236d6710814',
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b', 'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9',
    'https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e'
  ]
};

const seedData = async () => {
  try {
    // 0. Pre-flight check for duplicates
    const allImages = [
      ...roomImages, 
      ...foodImages.Quraac, ...foodImages.Qado, ...foodImages.Casho, ...foodImages.Macmacaan
    ];
    
    // Check for exact string duplicates
    const set = new Set(allImages);
    if (set.size !== allImages.length) {
      console.error(`FATAL ERROR: Duplicate images detected in source code! Total: ${allImages.length}, Unique: ${set.size}`);
      const duplicates = allImages.filter((item, index) => allImages.indexOf(item) !== index);
      console.error('Duplicates:', duplicates);
      process.exit(1);
    }

    await mongoose.connect(mongodb);
    console.log('Connected. Starting strictly unique seed...');

    await Room.deleteMany({});
    await Food.deleteMany({});

    // 1. Seed 24 Rooms
    const rooms = [];
    const types = ['Single', 'Double', 'Deluxe', 'Suite', 'Family', 'Apartment'];
    
    for (let i = 0; i < 24; i++) {
        let type = types[i % types.length];
        let price = 100;
        let bedrooms = 1, bathrooms = 1, sittingRooms = 0;
        
        if(type === 'Double') { price = 180; }
        if(type === 'Deluxe') { price = 250; }
        if(type === 'Suite') { price = 400; sittingRooms = 1; bathrooms = 2; }
        if(type === 'Family') { price = 350; bedrooms = 2; }
        if(type === 'Apartment') { price = 550; bedrooms = 3; bathrooms = 2; sittingRooms = 1; }

        rooms.push({
            roomNumber: `${101 + i}`,
            type,
            price: price + (i % 10),
            description: `Experience luxury in Unit ${101+i}. A perfect ${type} setting for your stay.`,
            bedrooms, bathrooms, sittingRooms,
            imageUrl: roomImages[i] // Guaranteed unique by pre-flight check
        });
    }
    await Room.insertMany(rooms);
    console.log('24 Unique Rooms Seeded.');

    // 2. Seed 24 Food Items
    const foodItems = [];
    const counts = { Quraac: 6, Qado: 6, Casho: 6, Macmacaan: 6 };
    
    for (const [category, count] of Object.entries(counts)) {
        for (let i = 0; i < count; i++) {
            foodItems.push({
                name: `${category} Special ${String.fromCharCode(65 + i)}`,
                description: `Freshly prepared ${category} dish with premium ingredients.`,
                price: (category === 'Macmacaan' ? 5 : 12) + (i % 8),
                category,
                imageUrl: foodImages[category][i] // Guaranteed unique by pre-flight check
            });
        }
    }

    await Food.insertMany(foodItems);
    console.log('24 Unique Food Items Seeded.');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();

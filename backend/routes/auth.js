const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validate, schemas } = require('../middleware/validate');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Waddooyinka Xaqiijinta (Authentication Routes)

// POST /auth/register - Qaybtan waxay diiwaangelisaa isticmaale cusub
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    // Hubi hadii isticmaalahan uu hore u jiray (iyadoo la eegayo Email-ka)
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Sameynta isticmaale cusub
    const newUser = new User({
      name,
      email,
      phone,
      password, // Password-ka waxaa lagu xifdiyaa Model-ka User.js dhexdiisa
      role: role || 'user'
    });
    
    await newUser.save();

    // Sameynta Token (JWT) si qofka uu u galo nidaamka ka dib diiwaangelinta
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /auth/login - Qaybtan waa meesha laga galo nidaamka (Login)
router.post('/login', validate(schemas.login), async (req, res) => {
  const { identifier, password } = req.body; // Identifier waxay noqon kartaa Email ama Phone

  try {
    // Ka raadi isticmaalaha database-ka iyadoo la eegayo Email ama Phone
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { phone: identifier }] 
    });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Isbarbar dhig password-ka la soo galiyay iyo kan database-ka ku jira
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Sameynta Token-ka ogolaanshaha (JWT)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

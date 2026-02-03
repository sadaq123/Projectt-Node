const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// GET /food → list menu
router.get('/', async (req, res) => {
  try {
    const menu = await Food.find({ isAvailable: true });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /food/:id → get a single item
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Item not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /food → add item (Open for testing)
router.post('/', validate(schemas.food), async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;
  const food = new Food({ name, description, price, category, imageUrl });

  try {
    const newFood = await food.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /food/:id (Open for testing)
router.put('/:id', validate(schemas.food), async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Item not found' });
    Object.assign(food, req.body);
    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /food/:id (Open for testing)
router.delete('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Item not found' });
    await food.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

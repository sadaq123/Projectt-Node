const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const auth = require('../middleware/auth');

// Submit new request (Open for testing)
router.post('/', async (req, res) => {
  try {
    const { requestType, title, description, userId } = req.body;

    const request = new Request({
      user: userId || null, // Optional userId
      requestType,
      title,
      description
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get requests (Open for testing)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find({})
      .populate('user', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single request (Open for testing)
router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('user', 'name email')
      .populate('reviewedBy', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve request (Open for testing)
router.put('/:id/approve', async (req, res) => {
  try {
    const { adminNote, reviewedBy } = req.body;

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        adminNote,
        reviewedBy: reviewedBy || null,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('user', 'name email').populate('reviewedBy', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject request (Open for testing)
router.put('/:id/reject', async (req, res) => {
  try {
    const { adminNote, reviewedBy } = req.body;

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        adminNote,
        reviewedBy: reviewedBy || null,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('user', 'name email').populate('reviewedBy', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete request (Open for testing)
router.delete('/:id', async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

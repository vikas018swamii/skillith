const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// "http://localhost:5000/api/users/me" 

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// 
router.get('/matches', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const matches = await User.find({
      knownSkill: currentUser.wantToLearn,
      wantToLearn: currentUser.knownSkill,
      _id: { $ne: currentUser._id } // exclude current user
    }).select('-password');

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

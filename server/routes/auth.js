const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail'); 
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); 
const sendDeleteEmail = require('../utils/sendDeleteEmail');

router.post('/register', async (req, res) => {
  const { username, password, knownSkill, wantToLearn, email } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const newUser = new User({
      username,
      password: hashedPassword,
      knownSkill,
      wantToLearn,
      email,
      verificationToken,
      isVerified: false,  
    });

    await newUser.save();

    sendVerificationEmail(email, verificationToken);
   

    res.status(200).send('Registration successful! Please check your email for verification.');
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }

  function newFunction() {
    alert('Verification email sent! Please check your inbox.');
  }
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query; 
  console.log('Token received:', token);

  try {h
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send('Invalid verification token.');
    }

    user.isVerified = true;
    console.log('User verified:', user.isVerified);

    user.verificationToken = undefined; 

    await user.save();

    res.status(200).json({
      msg: 'Email verified successfully!',
      isVerified: user.isVerified, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  console.log('Looking for:', emailOrUsername);



  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    console.log('req.body:', req.body);
    console.log('User found:', user);

    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email first.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        knownSkill: user.knownSkill,
        wantToLearn: user.wantToLearn,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; 
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/request-delete', async (req, res) => {
  try {

    console.log('Authorization Header:', req.headers.authorization);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const deleteToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const deleteLink = `http://localhost:5173/delete-confirm/${deleteToken}`;

    console.log('Delete link:', deleteLink);
    await sendDeleteEmail(user.email, deleteToken);

    res.status(200).json({ message: 'Confirmation email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/delete-confirm/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const deletedUser = await User.findByIdAndDelete(decoded.id);

    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
});

router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { username, email, password, knownSkill, wantToLearn } = req.body;
    const userId = req.user.id;

    const updatedUser = {};

    if (username) updatedUser.username = username;
    if (email) updatedUser.email = email;
    if (password) updatedUser.password = await bcrypt.hash(password, 10);
    if (knownSkill) updatedUser.knownSkill = knownSkill;
    if (wantToLearn) updatedUser.wantToLearn = wantToLearn;

    const updated = await User.findByIdAndUpdate(userId, updatedUser, { new: true });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/details', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

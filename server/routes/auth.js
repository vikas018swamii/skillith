const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail'); // Import the email sending function
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); // Import the authentication middleware
const sendDeleteEmail = require('../utils/sendDeleteEmail');

// inside your route



// Register
router.post('/register', async (req, res) => {
  const { username, password, knownSkill, wantToLearn, email } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: 'Username already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create a new user with the hashed password and verification token
    const newUser = new User({
      username,
      password: hashedPassword,
      knownSkill,
      wantToLearn,
      email,
      verificationToken,
      isVerified: false,  // Set user as unverified initially
    });

    // Save the new user to the database
    await newUser.save();

    // Send the verification email
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

// Verify Email
router.get('/verify-email', async (req, res) => {
  const { token } = req.query; // Get the token from the query parameters
  console.log('Token received:', token);

  try {
    // Find the user with the matching verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send('Invalid verification token.');
    }

    // Mark the user as verified
    user.isVerified = true;
    console.log('User verified:', user.isVerified); // Log user.isVerified

    user.verificationToken = undefined; // Remove the verification token once it's used

    // Save the updated user
    await user.save();

    // Send JSON response with success message and updated verification status
    res.status(200).json({
      msg: 'Email verified successfully!',
      isVerified: user.isVerified, // Send the updated isVerified status
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
    // Find user by either email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    console.log('req.body:', req.body);
    console.log('User found:', user);

    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email first.' });
    }




    // Create JWT
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



// DELETE /api/users/delete
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // assuming user ID is stored in JWT payload
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

// request-delete route
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

// delete-confirm route
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

// Update user details
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


// Get current user details
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

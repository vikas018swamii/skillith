const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail'); // Import the email sending function

const router = express.Router();

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





module.exports = router;

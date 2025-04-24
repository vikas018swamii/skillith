const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  password: String,
  knownSkill: String,
  wantToLearn: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String
});


const User = mongoose.model('User', userSchema);
module.exports = User;


'99'
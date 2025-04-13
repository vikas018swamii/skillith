const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  knownSkill: { type: String, required: true },
  wantToLearn: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);

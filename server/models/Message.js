const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: false }, // Make message optional
  image: { type: String, required: false },   // Base64 encoded image (optional)
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;

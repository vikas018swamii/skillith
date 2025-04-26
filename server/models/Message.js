const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: false }, 
  timestamp: { type: String, required: true },
  date: String,      
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;

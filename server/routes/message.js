const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const moment = require('moment'); // Import moment.js

// Get all messages between two users
router.get('/:userId/:recipientId', async (req, res) => {
  const { userId, recipientId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Get unread message count for a user from a specific sender
router.get('/unread/:userId/:senderId', async (req, res) => {
  const { userId, senderId } = req.params;
  try {
    const count = await Message.countDocuments({
      sender: senderId,
      recipient: userId,
      isRead: false
    });
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error in unread count:', error);
    res.status(500).json({ error: 'Error fetching unread count' });
  }
});

// Mark messages as read
router.put('/read/:userId/:senderId', async (req, res) => {
  const { userId, senderId } = req.params;
  try {
    await Message.updateMany(
      {
        sender: senderId,
        recipient: userId,
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking messages as read' });
  }
});

// Delete all messages between two users
router.delete('/:userId/:recipientId', async (req, res) => {
  const { userId, recipientId } = req.params;
  try {
    await Message.deleteMany({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    });
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting chat' });
  }
});

// Save new message
router.post('/', async (req, res) => {
  const { sender, recipient, message } = req.body;

  try {
    const now = moment(); // Get current date and time using moment

    const newMessage = new Message({
      sender,
      recipient,
      message,
      timestamp: now.format("hh:mm A"),     // e.g., 03:21 PM
      date: now.format("YYYY-MM-DD"),     // e.g., 2025-04-20
      isRead: false
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;

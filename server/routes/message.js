const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
});

"http://localhost:5000/messages/${fetchedUserId}/${recipientId}"
router.get('/:userId/:recipientId', async (req, res) => {
  const { userId, recipientId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: userId, recipient: recipientId },
      { sender: recipientId, recipient: userId },
    ],
  }).sort({ timestamp: 1 });
  res.json(messages);
});


// DELETE route for deleting messages between user and recipient
router.delete('/:userId/:recipientId', async (req, res) => {
    const { userId, recipientId } = req.params;
    try {
      await Message.deleteMany({
        $or: [
          { sender: userId, recipient: recipientId },
          { sender: recipientId, recipient: userId }
        ]
      });
      res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting chat' });
    }
  });

router.post('/', async (req, res) => {
  const newMessage = new Message(req.body);
  await newMessage.save();
  res.status(201).json(newMessage);
});

module.exports = router;

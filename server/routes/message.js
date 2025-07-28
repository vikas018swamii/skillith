const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const moment = require("moment");
const upload = require("../middleware/upload");
const { processImage } = require("../utils/imageProcessor");

router.get("/:userId/:recipientId", async (req, res) => {
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
    res.status(500).json({ error: "Error fetching messages" });
  }
});

router.get("/unread/:userId/:senderId", async (req, res) => {
  const { userId, senderId } = req.params;
  try {
    const count = await Message.countDocuments({
      sender: senderId,
      recipient: userId,
      isRead: false,
    });
    res.json({ unreadCount: count });
  } catch (error) {
    console.error("Error in unread count:", error);
    res.status(500).json({ error: "Error fetching unread count" });
  }
});

router.put("/read/:userId/:senderId", async (req, res) => {
  const { userId, senderId } = req.params;
  try {
    await Message.updateMany(
      {
        sender: senderId,
        recipient: userId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Error marking messages as read" });
  }
});

router.delete("/:userId/:recipientId", async (req, res) => {
  const { userId, recipientId } = req.params;
  try {
    await Message.deleteMany({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    });
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting chat" });
  }
});

router.post("/", upload.array("photos", 5), async (req, res) => {
  const { sender, recipient, message } = req.body;

  try {
    const photoFilenames = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filename = await processImage(file);
        photoFilenames.push(`/uploads/${filename}`);
      }
    }

    const now = moment();

    const newMessage = new Message({
      sender,
      recipient,
      message,
      photos: photoFilenames,
      timestamp: now.format("hh:mm A"),
      date: now.format("YYYY-MM-DD"),
      isRead: false,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error processing message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.delete("/multiple", async (req, res) => {
  const { messageIds } = req.body;
  try {
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ error: "Invalid message IDs" });
    }

    const result = await Message.deleteMany({
      _id: { $in: messageIds },
    });

    res.status(200).json({
      message: "Selected chats deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting chats" });
  }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');

dotenv.config();

const PORT = process.env.PORT || 5000; // Use the PORT from environment variables or default to 5000

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*', // Replace with your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: '*',  // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // <== add DELETE here
  credentials: true,  // Allow credentials (cookies, authorization headers)
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("working");
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

//
// DELETE chat between two users
app.delete('/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    await Message.deleteMany({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ]
    });
    res.status(200).json({ message: 'Chat deleted' });

    // Optional: Emit socket event to notify clients
    io.emit('chatDeleted', { user1, user2 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

//

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected',process.env.MONGO_URI);
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB error:', err));


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("working");
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.delete("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    await Message.deleteMany({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    });
    res.status(200).json({ message: "Chat deleted" });

    io.emit("chatDeleted", { user1, user2 });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected", process.env.MONGO_URI);
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

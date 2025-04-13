import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ConfirmationModal from "./ConfirmationModal";
import styles from "./Chat.module.css"; 


const socket = io("https://skillith.onrender.com", {
  transports: ["websocket"],
});

function Chat({ recipientId, recipientName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserIdAndMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRes = await axios.get("https://skillith.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUserId = userRes.data._id;
        setUserId(fetchedUserId);

        const messagesRes = await axios.get(
          `https://skillith.onrender.com/messages/${fetchedUserId}/${recipientId}`
        );
        setMessages(messagesRes.data);

        socket.on("receivePrivateMessage", (msg) => {
          if (msg.senderId === recipientId) {
            setMessages((prev) => [...prev, msg]);
          }
        });
      } catch (error) {
        console.error("Error fetching user or messages:", error);
      }

    };

    fetchUserIdAndMessages();

    return () => {
      socket.off("receivePrivateMessage");
    };

  }, [recipientId]);

  const sendMessage = async () => {

    if (!message.trim()) return;
    const msgObj = { sender: userId, recipient: recipientId, message };
    try {
      await axios.post("https://skillith.onrender.com/messages", msgObj);
      socket.emit("sendPrivateMessage", msgObj);
      setMessages((prev) => [...prev, msgObj]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }

  };

  const deleteChat = async () => {

    if (!userId || !recipientId) return;
    
    try {
      await axios.delete(
        `https://skillith.onrender.com/messages/${userId}/${recipientId}`
      );
      setMessages([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.chatContainer}>
      <h3 className={styles.chatHeading}>  Chatting with {recipientName.toUpperCase()} 📚 </h3>

      <div className={styles.chatMessages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.chatMessage} ${
              msg.sender === userId ? styles.sent : styles.received
            }`}
          >
            <b>{msg.sender === userId ? "You" : recipientName}</b>:{" "}
            {msg.message}
          </div>
        ))}
      </div>

      <div className={styles.chatControls}>
        <input
          className={styles.chatInput}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className={styles.chatSend} onClick={sendMessage}>
          Send
        </button>
        <div>
      <button className = {styles.chatDelete} onClick={openModal}>Delete</button>

      {isModalOpen && (
        <ConfirmationModal 
          onConfirm={deleteChat} 
          onCancel={closeModal} 
        />
      )}
    </div>
      </div>
    </div>
  );
}

export default Chat;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ConfirmationModal from "./ConfirmationModal";
import styles from "./Chat.module.css";
import { API } from "../utils/api";

const BASE_URL = API;
const socket = io(BASE_URL, { transports: ["websocket"] });

function Chat({ recipientId, recipientName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  

  useEffect(() => {
    const fetchUserIdAndMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRes = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUserId = userRes.data._id;
        setUserId(fetchedUserId);

        const messagesRes = await axios.get(
          `${BASE_URL}/messages/${fetchedUserId}/${recipientId}`
        );

        // Modify each message to add the date field
        const messagesWithDate = messagesRes.data.map((msg) => {
          const date = msg.timestamp.split("T")[0]; // Extract date from timestamp
          return { ...msg, date }; // Add date to each message object
        });

        setMessages(messagesRes.data);

        socket.on("receivePrivateMessage", (msg) => {
          if (msg.senderId === recipientId) {
            const date = msg.timestamp.split("T")[0];
            setMessages((prev) => [...prev, { ...msg, date }]);
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

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const currentDate = new Date().toISOString().split("T")[0];

    const msgObj = {
      sender: userId,
      recipient: recipientId,
      message,
      timestamp: currentTime,
      date: currentDate,
    };
    try {
      await axios.post(`${BASE_URL}/messages`, msgObj);
      socket.emit("sendPrivateMessage", msgObj);
      setMessages((prev) => [...prev, msgObj]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Change 1: Grouping messages by date
  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, msg) => {
      const date = msg.date; // Ensure 'date' is set when saving messages
      if (!acc[date]) acc[date] = [];
      acc[date].push(msg);
      return acc;
    }, {});
  };

  // Change 2: Format date for the separator (e.g., Today, Yesterday)
  const formatDate = (dateStr) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split("T")[0];

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";

    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const deleteChat = async () => {
    if (!userId || !recipientId) return;
    try {
      await axios.delete(`${BASE_URL}/messages/${userId}/${recipientId}`);
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
      <h3 className={styles.chatHeading}>
        Chatting with{" "}
        <span className={styles.recipientName}>
          {recipientName.toUpperCase()} 💬
        </span>
      </h3>

      {/* Change 3: Group messages by date and render them with a separator */}
      <div className={styles.chatMessages}>
        {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
          <div key={date}>
            {/* Change 4: Display date separator */}
            <div className={styles.dateSeparator}>{formatDate(date)}</div>
            {msgs.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.chatMessage} ${
                  msg.sender === userId ? styles.sent : styles.received
                }`}
              >
                <div>
                  <b>{msg.sender === userId ? "You" : recipientName}</b>:{" "}
                  {msg.message}
                </div>
                <div className={styles.timestamp}>{msg.timestamp}</div>
              </div>
            ))}
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

        

        <div className={styles.chatButtons}>
          <button className={styles.chatSend} onClick={sendMessage}>
            Send
          </button>
          <button className={styles.chatDelete} onClick={openModal}>
            Delete
          </button>
        </div>

        {isModalOpen && (
          <ConfirmationModal onConfirm={deleteChat} onCancel={closeModal} />
        )}
      </div>
    </div>
  );
}

export default Chat;

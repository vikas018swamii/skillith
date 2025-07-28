import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ConfirmationModal from "./ConfirmationModal";
import styles from "./Chat.module.css";
import { API } from "../utils/api";
import { useParams, useNavigate } from 'react-router-dom';
const BASE_URL = API;
const socket = io(BASE_URL, { transports: ["websocket"] });

function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const chatMessagesRef = useRef(null);
  const chatInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRes = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUserId = userRes.data._id;
        setCurrentUserId(fetchedUserId);

        const recipientRes = await axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipientName(recipientRes.data.username);

        const messagesRes = await axios.get(
          `${BASE_URL}/messages/${fetchedUserId}/${userId}`
        );

        setMessages(messagesRes.data);

        if (messagesRes.data.some(msg => !msg.isRead && msg.sender === userId)) {
          await axios.put(`${BASE_URL}/messages/read/${fetchedUserId}/${userId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        socket.on("receivePrivateMessage", (msg) => {
          if (msg.senderId === userId) {
            const date = msg.timestamp.split("T")[0];
            setMessages((prev) => [...prev, { ...msg, date }]);
          }
        });
      } catch (error) {
        console.error("Error fetching user or messages:", error);
        navigate('/matches');
      }
    };

    fetchUserAndMessages();
    return () => {
      socket.off("receivePrivateMessage");
    };
  }, [userId, navigate]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const currentDate = new Date().toISOString().split("T")[0];

    const formData = new FormData();
    formData.append('sender', currentUserId);
    formData.append('recipient', userId);
    formData.append('message', message);
    selectedFiles.forEach(file => {
      formData.append('photos', file);
    });

    try {
      const response = await axios.post(`${BASE_URL}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      socket.emit("sendPrivateMessage", response.data);
      setMessages((prev) => [...prev, response.data]);
      setMessage("");
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, msg) => {
      const date = msg.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(msg);
      return acc;
    }, {});
  };

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

  const toggleMessageSelection = (messageId) => {
    setSelectedMessages(prev => {
      if (prev.includes(messageId)) {
        return prev.filter(id => id !== messageId);
      } else {
        return [...prev, messageId];
      }
    });
  };

  const deleteSelectedChats = async () => {
    if (selectedMessages.length === 0) return;

    try {
      await axios.delete(`${BASE_URL}/messages/multiple`, {
        data: { messageIds: selectedMessages }
      });

      setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg._id)));
      setSelectedMessages([]);
      setIsSelectMode(false);
    } catch (error) {
      console.error("Error deleting selected chats:", error);
    }
  };

  const deleteChat = async () => {
    if (selectedMessages.length > 0) {
      try {
        await axios.delete(`${BASE_URL}/messages/multiple`, {
          data: { messageIds: selectedMessages }
        });
        setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg._id)));
        setSelectedMessages([]);
        setIsSelectMode(false);
      } catch (error) {
        console.error("Error deleting selected chats:", error);
      }
    } else {
      if (!currentUserId || !userId) return;
      try {
        await axios.delete(`${BASE_URL}/messages/${currentUserId}/${userId}`);
        setMessages([]);
      } catch (error) {
        console.error("Error deleting chat:", error);
      }
    }
    setIsModalOpen(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const scrollToInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleDownload = async (photoUrl) => {
    try {
      const fullUrl = `${BASE_URL}${photoUrl}`;
      const response = await fetch(fullUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const filename = photoUrl.split('/').pop();
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h3 className={styles.chatHeading}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/matches')}
        >
          <span>Back</span>
        </button>
        Chatting with {recipientName} 💬
        <button
          className={styles.scrollToInputButton}
          onClick={scrollToInput}
          aria-label="Scroll to input"
        >
          <i className="fas fa-chevron-circle-down" style={{ color: '#2e7be6' }}></i>
        </button>
      </h3>

      <div className={styles.chatMessages} ref={chatMessagesRef}>
        {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
          <div key={date}>
            <div className={styles.dateSeparator}>{formatDate(date)}</div>
            {msgs.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.chatMessage} ${msg.sender === currentUserId ? styles.sent : styles.received
                  }`}
              >
                {isSelectMode && (
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(msg._id)}
                    onChange={() => toggleMessageSelection(msg._id)}
                    className={styles.messageCheckbox}
                  />
                )}
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>
                    <b>{msg.sender === currentUserId ? "You" : recipientName}</b>
                    {msg.message}
                    <span className={styles.timestamp}>{msg.timestamp}</span>
                  </div>
                  {msg.photos && msg.photos.length > 0 && (
                    <div className={styles.messagePhotos}>
                      {msg.photos.map((photo, photoIdx) => (
                        <div key={photoIdx} className={styles.photoContainer}>
                          <img
                            src={`${BASE_URL}${photo}`}
                            alt={`Photo ${photoIdx + 1}`}
                            className={styles.messagePhoto}
                          />
                          <button
                            className={styles.downloadButton}
                            onClick={() => handleDownload(photo)}
                            title="Download image"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.chatControls}>
        {previewUrls.length > 0 && (
          <div className={styles.photoPreviews}>
            {previewUrls.map((url, index) => (
              <div key={index} className={styles.photoPreview}>
                <img src={url} alt={`Preview ${index + 1}`} />
                <button
                  className={styles.removePhoto}
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.inputContainer}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            className={styles.uploadButton}
            onClick={() => fileInputRef.current.click()}
            title="Upload photos"
          >
            <i className="fas fa-image"></i>
          </button>
          <input
            className={styles.chatInput}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            ref={chatInputRef}
          />
        </div>

        <div className={styles.chatButtons}>
          <button className={styles.chatSend} onClick={sendMessage}>
            Send
          </button>
          <button
            className={styles.selectButton}
            onClick={() => {
              if (isSelectMode && selectedMessages.length > 0) {
                openModal();
              } else {
                setIsSelectMode(!isSelectMode);
                setSelectedMessages([]);
              }
            }}
          >
            {isSelectMode ? (selectedMessages.length > 0 ? 'Delete Selected' : 'Cancel') : 'Delete'}
          </button>
        </div>

        {isModalOpen && (
          <ConfirmationModal
            onConfirm={deleteChat}
            onCancel={closeModal}
            message={selectedMessages.length > 0 ?
              `Are you sure you want to delete ${selectedMessages.length} selected messages?` :
              'Are you sure you want to delete all messages?'}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;

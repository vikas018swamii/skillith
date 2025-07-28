import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Matches.module.css';
import { API } from '../utils/api';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/api/users/matches`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMatches(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches');
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = userRes.data._id;

        const counts = {};
        for (const match of matches) {
          try {
            const res = await axios.get(`${API}/messages/unread/${userId}/${match._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            counts[match._id] = res.data.unreadCount;
          } catch (err) {
            console.error(`Error fetching unread count for ${match._id}:`, err);
            counts[match._id] = 0;
          }
        }
        setUnreadCounts(counts);
      } catch (err) {
        console.error('Error fetching unread counts:', err);
      }
    };

    if (matches.length > 0) {
      fetchUnreadCounts();
    }
  }, [matches]);

  const handleChatClick = (user) => {
    navigate(`/chat/${user._id}`);
  };

  if (loading) return <p>Loading matches...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Skill Matches</h2>
        {matches.length === 0 ? (
          <p className={styles.noMatchesText}>No matches ...</p>
        ) : (
          <ul className={styles.matchList}>
            {matches.map((user) => (
              <li key={user._id} className={styles.matchItem}>
                <h3>{user.username}</h3>
                <p>Knows: {user.knownSkill}</p>
                <p>Wants to learn: {user.wantToLearn}</p>
                <button
                  onClick={() => handleChatClick(user)}
                  className={styles.chatButton}
                >
                  Chat
                  {unreadCounts[user._id] > 0 && (
                    <span className={styles.unreadBadge}>
                      {unreadCounts[user._id]}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Matches;

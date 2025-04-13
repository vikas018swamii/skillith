import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat';
import styles from './Matches.module.css';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/matches', {
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

  if (loading) return <p>Loading matches...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Skill Matches</h2>
      {selectedUser ? (
        <div>
          <button onClick={() => setSelectedUser(null)} className={styles.backButton}>
            Back to Matches
          </button>
          <Chat recipientId={selectedUser._id} recipientName={selectedUser.username} />
        </div>
      ) : (
        <>
          {matches.length === 0 ? (
            <p>No matches found yet 😕</p>
          ) : (
            <ul className={styles.matchList}>
              {matches.map((user) => (
                <li key={user._id} className={styles.matchItem}>
                  <h3>{user.username}</h3>
                  <p>Knows: {user.knownSkill}</p>
                  <p>Wants to learn: {user.wantToLearn}</p>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className={styles.chatButton}
                  >
                    Chat
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Matches;

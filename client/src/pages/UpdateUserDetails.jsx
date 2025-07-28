import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../utils/api';
import styles from './UpdateUserDetails.module.css';

const skills = ['JavaScript', 'C++', 'Python', 'React', 'Node.js', 'HTML/CSS', 'Java', 'SQL'];

const UpdateUserDetails = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
    knownSkill: '',
    wantToLearn: ''
  });

  useEffect(() => {
    axios
      .get(`${API}/api/auth/details`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => setUserDetails(response.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm('Are you sure you want to update your details?');
    if (!isConfirmed) return;

    try {
      await axios.put(`${API}/api/auth/update`, userDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      alert('Details updated successfully!');
    } catch (err) {
      console.log(err);
      alert('Error updating details');
    }
  };

  return (

    <div className={styles.pageWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2 className={styles.title}>Update Your Details</h2>

        <input
          type="text"
          name="username"
          value={userDetails.username}
          onChange={handleChange}
          placeholder="Username"
          className={styles.inputField}
          required
        />
        <input
          type="email"
          name="email"
          value={userDetails.email}
          onChange={handleChange}
          placeholder="Email"
          className={styles.inputField}
          required
        />
        <input
          type="password"
          name="password"
          value={userDetails.password}
          onChange={handleChange}
          placeholder="Password"
          className={styles.inputField}
          required
        />

        <select
          name="knownSkill"
          value={userDetails.knownSkill}
          onChange={handleChange}
          className={styles.selectField}
          required
        >
          <option value="" disabled hidden>🎯 Skill Known</option>
          {skills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>

        <select
          name="wantToLearn"
          value={userDetails.wantToLearn}
          onChange={handleChange}
          className={styles.selectField}
          required
        >
          <option value="" disabled hidden>🚀 Skill to Learn</option>
          {skills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>

        <button type="submit" className={styles.updateButton}>
          Update Details
        </button>
      </form>
    </div>
  );

};

export default UpdateUserDetails;

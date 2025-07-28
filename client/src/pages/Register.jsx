import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { API } from '../utils/api';

const skills = ['JavaScript', 'C++', 'Python', 'React', 'Node.js', 'HTML/CSS', 'Java', 'SQL'];

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    knownSkill: '',
    wantToLearn: ''
  });

  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/api/auth/register`, form);

      if (response.status === 200) {
        alert('Verification email sent! Please check your inbox.');
        setMessage('Registered successfully! Please check your email to verify your account.');
        navigate('/');
      } else {
        alert('Registration failed: ' + response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'An error occurred during registration.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.registerContainer}>
        <form onSubmit={handleSubmit} className={styles.formBox}>
          <h2 className={styles.registerHeading}>Register</h2>

          {message && <p className={styles.message}>{message}</p>}

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className={styles.inputField}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className={styles.inputField}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className={styles.inputField}
          />
          <select
            name="knownSkill"
            value={form.knownSkill}
            onChange={handleChange}
            required
            className={`${styles.inputField} ${styles.selectField}`}
          >
            <option value="">🎯 Skill Known</option>
            {skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <select
            name="wantToLearn"
            value={form.wantToLearn}
            onChange={handleChange}
            required
            className={`${styles.inputField} ${styles.selectField}`}
          >
            <option value="">🚀 Skill to Learn</option>
            {skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <button type="submit" className={styles.submitButton}>Register</button>
          <button type="button" onClick={handleBack} className={styles.backButton}>Back</button>
        </form>
      </div>
    </div>
  );
}

export default Register;

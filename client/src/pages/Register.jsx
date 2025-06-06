import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';  // Import the CSS module
import { API } from '../utils/api';

const skills = ['JavaScript', 'C++', 'Python', 'React', 'Node.js', 'HTML/CSS', 'Java', 'SQL'];

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '', // Add email to the form state
    password: '',
    knownSkill: '',
    wantToLearn: ''
  });

  const [message, setMessage] = useState(''); // To show any status messages

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // This will navigate to the previous page in history
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request to register the user
      const response = await axios.post(`${API}/api/auth/register`, form);
      
      // Check if registration was successful based on the response status
      if (response.status === 200) {
        alert('Verification email sent! Please check your inbox.');
        // Display a message indicating registration success
        setMessage('Registered successfully! Please check your email to verify your account.');
        
        // Optionally, redirect to the login page after successful registration
        navigate('/'); // Redirect to login page after successful registration
      } else {
        // Handle non-200 responses
        alert('Registration failed: ' + response.data.message);
      }
    } catch (err) {
      // Handle error and display appropriate message
      const errorMessage = err.response?.data?.msg || 'An error occurred during registration.';
      setMessage(errorMessage);
    }
  };
  

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit} className={styles.formBox}>
          <h2 className={styles.loginHeading}>Register</h2>
          
          {message && <p className={styles.message}>{message}</p>} {/* Display status message */}
          
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
          
          {/* Skill Selection for Known Skill */}
          <select
            name="knownSkill"
            value={form.knownSkill}
            onChange={handleChange}
            required
            className={`${styles.inputField} ${styles.selectField}`} // Add this line for additional styling
          >
            <option value="">🎯 Skill Known</option>
            {skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          {/* Skill Selection for Skill to Learn */}
          <select
            name="wantToLearn"
            value={form.wantToLearn}
            onChange={handleChange}
            required
            className={`${styles.inputField} ${styles.selectField}`} // Add this line for additional styling
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

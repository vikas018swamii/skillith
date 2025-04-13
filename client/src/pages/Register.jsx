import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';  // Import the CSS module

const skills = ['JavaScript', 'C++', 'Python', 'React', 'Node.js', 'HTML/CSS', 'Java', 'SQL'];

function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    knownSkill: '',
    wantToLearn: ''
  });

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // This will navigate to the previous page in history
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('https://skillith.onrender.com/api/auth/register', form);
      alert('Registered successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration error');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit} className={styles.formBox}>
          <h2 className={styles.loginHeading}>Register</h2>
          <input 
            name="username" 
            placeholder="Username" 
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

          <label className={styles.labelField}>Skill You Know</label>
          <select 
            name="knownSkill" 
            value={form.knownSkill} 
            onChange={handleChange} 
            required 
            className={styles.inputField}
          >
            <option value="">-- Select --</option>
            {skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <label className={styles.labelField}>Skill You Want to Learn</label> 
          <select 
            name="wantToLearn" 
            value={form.wantToLearn} 
            onChange={handleChange} 
            required 
            className={styles.inputField}
          >
            <option value="">-- Select --</option>
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

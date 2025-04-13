import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      alert('Logged in!');
      navigate('/matches');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <form className={styles.formBox} onSubmit={handleSubmit}>
          <h2 className={styles.loginHeading}>Login</h2>
          <input
            className={styles.inputField}
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            className={styles.inputField}
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button type="submit" className={styles.submitButton}>Login</button>
          <button type="button" className={styles.backButton} onClick={handleBack}>Back</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

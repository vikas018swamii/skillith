import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { API } from '../utils/api';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emailOrUsername: '',
    password: ''
  });
  
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data being sent:", form);

      const res = await axios.post(`${API}/api/auth/login`, form);
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      alert('Logged in!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <form className={styles.formBox} onSubmit={handleSubmit}>
          <h2 className={styles.loginHeading}>Login</h2>
     
          <input
  className={styles.inputField}
  type="text"
  name="emailOrUsername"
  placeholder="Email or Username"
  value={form.emailOrUsername}
  onChange={handleChange}
  required
/>

<input
  className={styles.inputField}
  type="password"
  name="password"
  placeholder="Password"
  value={form.password}
  onChange={handleChange}
  required
/>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>Login</button>
            <button type="button" className={styles.backButton} onClick={handleBack}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
